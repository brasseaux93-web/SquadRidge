"use client";

import { create } from "zustand";
import type {
  Message,
  OutcomeEntry,
  Room,
  RoomParticipant,
  SafetyReport,
  SessionPhase,
  User,
  UserRole,
} from "@/domain/types";
import { FixtureRoomRepository } from "./fixture-repository";
import { RoomService } from "./room-service";
import {
  DEMO_MESSAGES,
  DEMO_OUTCOMES,
  DEMO_PARTICIPANTS,
  DEMO_ROOMS,
  DEMO_USERS,
} from "./fixtures";

/** Shared fixture repo for the browser demo session. */
const fixtureRepo = new FixtureRoomRepository();
const service = new RoomService(fixtureRepo);

interface AppState {
  currentUser: User | null;
  rooms: Room[];
  participants: RoomParticipant[];
  messages: Message[];
  outcomes: OutcomeEntry[];
  safetyReports: SafetyReport[];
  lastError: string | null;

  enterAs: (role: UserRole) => void;
  signOut: () => void;
  clearError: () => void;

  /** Hydrate mirrors from fixture repo (after mutations). */
  refresh: () => Promise<void>;

  setPhase: (roomId: string, phase: SessionPhase) => Promise<boolean>;
  closeRoom: (roomId: string) => Promise<boolean>;
  sendMessage: (
    roomId: string,
    participantId: string,
    displayRole: string,
    body: string,
    isFacilitator: boolean
  ) => Promise<boolean>;
  proposeOutcome: (
    roomId: string,
    body: string,
    proposedBy: string,
    ownerLabel?: string,
    dueDate?: string
  ) => Promise<boolean>;
  setOutcomeStatus: (
    outcomeId: string,
    status: "approved" | "rejected"
  ) => Promise<boolean>;
  reportSafety: (
    roomId: string,
    intent: "pause" | "support" | "concern" | "step_away",
    note: string
  ) => Promise<boolean>;

  getRoom: (id: string) => Room | undefined;
  getRoomParticipants: (roomId: string) => RoomParticipant[];
  getRoomMessages: (roomId: string) => Message[];
  getRoomOutcomes: (roomId: string) => OutcomeEntry[];
  getRoomSafetyReports: (roomId: string) => SafetyReport[];
  getOutcomesForCurrentUser: (roomId: string) => OutcomeEntry[];
}

async function snapshot(): Promise<
  Pick<
    AppState,
    "rooms" | "participants" | "messages" | "outcomes" | "safetyReports"
  >
> {
  const rooms = await fixtureRepo.listRooms();
  const participants = (
    await Promise.all(rooms.map((r) => fixtureRepo.listParticipants(r.id)))
  ).flat();
  const messages = (
    await Promise.all(rooms.map((r) => fixtureRepo.listMessages(r.id)))
  ).flat();
  const outcomes = (
    await Promise.all(rooms.map((r) => fixtureRepo.listOutcomes(r.id)))
  ).flat();
  const safetyReports = (
    await Promise.all(rooms.map((r) => fixtureRepo.listSafetyReports(r.id)))
  ).flat();
  return { rooms, participants, messages, outcomes, safetyReports };
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  rooms: DEMO_ROOMS,
  participants: DEMO_PARTICIPANTS,
  messages: DEMO_MESSAGES,
  outcomes: DEMO_OUTCOMES,
  safetyReports: [],
  lastError: null,

  enterAs: (role) => {
    const user = DEMO_USERS.find((u) => u.role === role) ?? DEMO_USERS[0];
    set({ currentUser: user, lastError: null });
  },

  signOut: () => set({ currentUser: null, lastError: null }),

  clearError: () => set({ lastError: null }),

  refresh: async () => {
    const snap = await snapshot();
    set(snap);
  },

  setPhase: async (roomId, phase) => {
    const actor = get().currentUser;
    if (!actor) {
      set({ lastError: "Not signed in." });
      return false;
    }
    const result = await service.setPhase(actor, roomId, phase);
    if (!result.success) {
      set({ lastError: result.error });
      return false;
    }
    await get().refresh();
    set({ lastError: null });
    return true;
  },

  closeRoom: async (roomId) => {
    const actor = get().currentUser;
    if (!actor) {
      set({ lastError: "Not signed in." });
      return false;
    }
    const result = await service.closeRoom(actor, roomId);
    if (!result.success) {
      set({ lastError: result.error });
      return false;
    }
    await get().refresh();
    set({ lastError: null });
    return true;
  },

  sendMessage: async (
    roomId,
    participantId,
    displayRole,
    body,
    isFacilitator
  ) => {
    const actor = get().currentUser;
    if (!actor) {
      set({ lastError: "Not signed in." });
      return false;
    }
    const result = await service.sendMessage(actor, {
      roomId,
      participantId,
      displayRole,
      body,
      isFacilitator,
    });
    if (!result.success) {
      set({ lastError: result.error });
      return false;
    }
    await get().refresh();
    set({ lastError: null });
    return true;
  },

  proposeOutcome: async (roomId, body, proposedBy, ownerLabel, dueDate) => {
    const actor = get().currentUser;
    if (!actor) {
      set({ lastError: "Not signed in." });
      return false;
    }
    const result = await service.proposeOutcome(actor, {
      roomId,
      body,
      proposedByParticipantId: proposedBy,
      ownerLabel,
      dueDate,
    });
    if (!result.success) {
      set({ lastError: result.error });
      return false;
    }
    await get().refresh();
    set({ lastError: null });
    return true;
  },

  setOutcomeStatus: async (outcomeId, status) => {
    const actor = get().currentUser;
    if (!actor) {
      set({ lastError: "Not signed in." });
      return false;
    }
    const result = await service.setOutcomeStatus(actor, outcomeId, status);
    if (!result.success) {
      set({ lastError: result.error });
      return false;
    }
    await get().refresh();
    set({ lastError: null });
    return true;
  },

  reportSafety: async (roomId, intent, note) => {
    const actor = get().currentUser;
    if (!actor) {
      set({ lastError: "Not signed in." });
      return false;
    }
    const result = await service.reportSafety(actor, { roomId, intent, note });
    if (!result.success) {
      set({ lastError: result.error });
      return false;
    }
    await get().refresh();
    set({ lastError: null });
    return true;
  },

  getRoom: (id) => get().rooms.find((r) => r.id === id),
  getRoomParticipants: (roomId) =>
    get().participants.filter((p) => p.roomId === roomId),
  getRoomMessages: (roomId) =>
    get().messages.filter((m) => m.roomId === roomId),
  getRoomOutcomes: (roomId) =>
    get().outcomes.filter((o) => o.roomId === roomId),
  getRoomSafetyReports: (roomId) =>
    get().safetyReports.filter((r) => r.roomId === roomId),
  getOutcomesForCurrentUser: (roomId) => {
    const user = get().currentUser;
    const all = get().outcomes.filter((o) => o.roomId === roomId);
    if (!user) return [];
    if (
      user.role === "facilitator" ||
      user.role === "organization_admin" ||
      user.role === "platform_admin"
    ) {
      return all;
    }
    return all.filter((o) => o.status === "approved");
  },
}));

/** Test helper — not for production UI. */
export function getDemoService() {
  return { service, fixtureRepo };
}
