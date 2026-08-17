import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  AuditEvent,
  Message,
  OutcomeEntry,
  Room,
  RoomParticipant,
  User,
} from "@/domain/types";
import type { CloseRoomSummary, RoomRepository } from "./repository";
import { requireSupabasePublicEnv } from "./repository";

type DbRoom = {
  id: string;
  title: string;
  status: Room["status"];
  phase: Room["phase"];
  ground_rules: string[];
  invite_code: string | null;
  created_by: string | null;
  created_at: string;
  closed_at: string | null;
};

type DbMembership = {
  id: string;
  room_id: string;
  user_id: string;
  display_role: string;
  is_facilitator: boolean;
  joined_at: string | null;
};

type DbMessage = {
  id: string;
  room_id: string;
  membership_id: string;
  display_role: string;
  body: string;
  is_facilitator: boolean;
  created_at: string;
};

type DbOutcome = {
  id: string;
  room_id: string;
  status: OutcomeEntry["status"];
  body: string;
  owner_label: string | null;
  due_date: string | null;
  proposed_by: string | null;
  approved_by: string | null;
  approved_at: string | null;
  notes: string | null;
  created_at: string;
};

function mapRoom(r: DbRoom): Room {
  return {
    id: r.id,
    title: r.title,
    status: r.status,
    phase: r.phase,
    groundRules: r.ground_rules ?? [],
    inviteCode: r.invite_code ?? "",
    createdBy: r.created_by ?? "",
    createdAt: r.created_at,
    closedAt: r.closed_at ?? undefined,
  };
}

function mapParticipant(m: DbMembership): RoomParticipant {
  return {
    id: m.id,
    roomId: m.room_id,
    userId: m.user_id,
    displayRole: m.display_role,
    isFacilitator: m.is_facilitator,
    joinedAt: m.joined_at ?? undefined,
  };
}

function mapMessage(m: DbMessage): Message {
  return {
    id: m.id,
    roomId: m.room_id,
    participantId: m.membership_id,
    displayRole: m.display_role,
    body: m.body,
    createdAt: m.created_at,
    isFacilitator: m.is_facilitator,
  };
}

function mapOutcome(o: DbOutcome): OutcomeEntry {
  return {
    id: o.id,
    roomId: o.room_id,
    status: o.status,
    body: o.body,
    ownerLabel: o.owner_label ?? undefined,
    dueDate: o.due_date ?? undefined,
    proposedBy: o.proposed_by ?? "",
    approvedBy: o.approved_by ?? undefined,
    approvedAt: o.approved_at ?? undefined,
    notes: o.notes ?? undefined,
    createdAt: o.created_at,
  };
}

function mapRpcError(err: { message?: string; code?: string }): Error {
  const msg = err.message ?? "Request could not be completed.";
  if (msg.includes("not_facilitator") || msg.includes("42501")) {
    return new Error("You do not have permission to perform this action.");
  }
  if (msg.includes("room_closed")) {
    return new Error("This room is closed.");
  }
  if (msg.includes("outcome_not_approvable")) {
    return new Error("This outcome cannot be approved in its current state.");
  }
  if (msg.includes("outcome_not_found") || msg.includes("room_not_found")) {
    return new Error("The requested record was not found.");
  }
  return new Error("Something went wrong. Please try again.");
}

/**
 * Production-shaped adapter. Uses ONLY the anon key + user JWT (RLS + RPCs).
 * Never falls back to fixtures. Fails closed if env is missing.
 */
export class SupabaseRoomRepository implements RoomRepository {
  private client: SupabaseClient;

  constructor(client?: SupabaseClient) {
    if (client) {
      this.client = client;
    } else {
      const { url, anonKey } = requireSupabasePublicEnv();
      this.client = createClient(url, anonKey, {
        auth: { persistSession: true, autoRefreshToken: true },
      });
    }
  }

  async listUsers(): Promise<User[]> {
    // Profiles for other users are not enumerable under RLS.
    const { data: session } = await this.client.auth.getUser();
    if (!session.user) return [];
    const me = await this.getUser(session.user.id);
    return me ? [me] : [];
  }

  async getUser(id: string): Promise<User | null> {
    const { data, error } = await this.client
      .from("profiles")
      .select("id, display_name, email")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return {
      id: data.id,
      name: data.display_name || "User",
      email: data.email || "",
      role: "participant",
    };
  }

  async listRooms(): Promise<Room[]> {
    const { data, error } = await this.client.from("rooms").select("*");
    if (error) throw mapRpcError(error);
    return (data as DbRoom[]).map(mapRoom);
  }

  async getRoom(id: string): Promise<Room | null> {
    const { data, error } = await this.client
      .from("rooms")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw mapRpcError(error);
    return data ? mapRoom(data as DbRoom) : null;
  }

  async updateRoom(
    id: string,
    patch: Partial<Pick<Room, "status" | "phase" | "closedAt">>
  ): Promise<Room | null> {
    // Phase updates only — closure must use closeAndPurge RPC.
    if (patch.status === "closed") {
      throw new Error("Use closeAndPurge to close rooms.");
    }
    const { data, error } = await this.client
      .from("rooms")
      .update({
        ...(patch.phase ? { phase: patch.phase } : {}),
        ...(patch.status ? { status: patch.status } : {}),
      })
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error) throw mapRpcError(error);
    return data ? mapRoom(data as DbRoom) : null;
  }

  async listParticipants(roomId: string): Promise<RoomParticipant[]> {
    const { data, error } = await this.client
      .from("room_memberships")
      .select("*")
      .eq("room_id", roomId)
      .eq("active", true);
    if (error) throw mapRpcError(error);
    return (data as DbMembership[]).map(mapParticipant);
  }

  async listMessages(roomId: string): Promise<Message[]> {
    const { data, error } = await this.client
      .from("room_messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });
    if (error) {
      // Closed rooms: policy returns no rows / error — treat as empty
      return [];
    }
    return (data as DbMessage[]).map(mapMessage);
  }

  async addMessage(message: Message): Promise<Message> {
    const { data, error } = await this.client
      .from("room_messages")
      .insert({
        id: message.id.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        )
          ? message.id
          : undefined,
        room_id: message.roomId,
        membership_id: message.participantId,
        display_role: message.displayRole,
        body: message.body,
        is_facilitator: message.isFacilitator,
      })
      .select("*")
      .single();
    if (error) throw mapRpcError(error);
    return mapMessage(data as DbMessage);
  }

  async purgeMessages(_roomId: string): Promise<number> {
    throw new Error("Message purge is only performed by the close_room RPC.");
  }

  async listOutcomes(roomId: string): Promise<OutcomeEntry[]> {
    // RLS already filters proposed outcomes from participants
    const { data, error } = await this.client
      .from("outcomes")
      .select("*")
      .eq("room_id", roomId);
    if (error) throw mapRpcError(error);
    return (data as DbOutcome[]).map(mapOutcome);
  }

  async getOutcome(id: string): Promise<OutcomeEntry | null> {
    const { data, error } = await this.client
      .from("outcomes")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw mapRpcError(error);
    return data ? mapOutcome(data as DbOutcome) : null;
  }

  async addOutcome(entry: OutcomeEntry): Promise<OutcomeEntry> {
    const { data, error } = await this.client
      .from("outcomes")
      .insert({
        room_id: entry.roomId,
        status: "proposed",
        body: entry.body,
        owner_label: entry.ownerLabel ?? null,
        due_date: entry.dueDate ?? null,
        proposed_by: entry.proposedBy || null,
      })
      .select("*")
      .single();
    if (error) throw mapRpcError(error);
    return mapOutcome(data as DbOutcome);
  }

  async updateOutcome(): Promise<OutcomeEntry | null> {
    throw new Error("Outcome status changes must use approveOutcomeAtomic RPC.");
  }

  async approveOutcomeAtomic(outcomeId: string): Promise<OutcomeEntry> {
    const { data, error } = await this.client.rpc("approve_outcome", {
      p_outcome_id: outcomeId,
    });
    if (error) throw mapRpcError(error);
    return mapOutcome(data as DbOutcome);
  }

  async closeAndPurge(roomId: string): Promise<CloseRoomSummary> {
    const { data, error } = await this.client.rpc("close_room", {
      p_room_id: roomId,
    });
    if (error) throw mapRpcError(error);
    const row = data as {
      room_id: string;
      status: string;
      already_closed: boolean;
      closed_at: string | null;
      purged_message_count: number;
      retained_approved_outcome_count: number;
    };
    return {
      roomId: row.room_id,
      status: "closed",
      alreadyClosed: row.already_closed,
      closedAt: row.closed_at,
      purgedMessageCount: row.purged_message_count,
      retainedApprovedOutcomeCount: row.retained_approved_outcome_count,
    };
  }

  async appendAudit(): Promise<void> {
    // Audit inserts are performed inside RPCs only.
  }

  async listAudit(roomId?: string): Promise<AuditEvent[]> {
    let q = this.client.from("room_audit_events").select("*");
    if (roomId) q = q.eq("room_id", roomId);
    const { data, error } = await q;
    if (error) return [];
    return (data ?? []).map(
      (e: {
        id: string;
        room_id: string | null;
        actor_id: string | null;
        action: string;
        metadata: Record<string, string | number | boolean | null>;
        created_at: string;
      }) => ({
        id: e.id,
        roomId: e.room_id ?? undefined,
        actorId: e.actor_id ?? "",
        action: e.action as AuditEvent["action"],
        metadata: e.metadata,
        createdAt: e.created_at,
      })
    );
  }
}
