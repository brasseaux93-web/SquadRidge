"use client";

import { create } from "zustand";
import type {
  Message,
  OutcomeEntry,
  Room,
  RoomParticipant,
  RoomStatus,
  SessionPhase,
  User,
  UserRole,
} from "@/domain/types";
import {
  DEMO_MESSAGES,
  DEMO_OUTCOMES,
  DEMO_PARTICIPANTS,
  DEMO_ROOMS,
  DEMO_USERS,
} from "./fixtures";

interface AppState {
  currentUser: User | null;
  rooms: Room[];
  participants: RoomParticipant[];
  messages: Message[];
  outcomes: OutcomeEntry[];

  // Auth (demo)
  enterAs: (role: UserRole) => void;
  signOut: () => void;

  // Room ops
  setPhase: (roomId: string, phase: SessionPhase) => void;
  setRoomStatus: (roomId: string, status: RoomStatus) => void;
  closeRoom: (roomId: string) => void;

  // Messages (ephemeral while live)
  sendMessage: (
    roomId: string,
    participantId: string,
    displayRole: string,
    body: string,
    isFacilitator: boolean
  ) => void;

  // Outcomes
  proposeOutcome: (
    roomId: string,
    body: string,
    proposedBy: string,
    ownerLabel?: string,
    dueDate?: string
  ) => void;
  setOutcomeStatus: (
    outcomeId: string,
    status: OutcomeEntry["status"],
    approvedBy?: string
  ) => void;

  // Selectors helpers
  getRoom: (id: string) => Room | undefined;
  getRoomParticipants: (roomId: string) => RoomParticipant[];
  getRoomMessages: (roomId: string) => Message[];
  getRoomOutcomes: (roomId: string) => OutcomeEntry[];
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  rooms: DEMO_ROOMS,
  participants: DEMO_PARTICIPANTS,
  messages: DEMO_MESSAGES,
  outcomes: DEMO_OUTCOMES,

  enterAs: (role) => {
    const user =
      DEMO_USERS.find((u) => u.role === role) ?? DEMO_USERS[0];
    set({ currentUser: user });
  },

  signOut: () => set({ currentUser: null }),

  setPhase: (roomId, phase) =>
    set((s) => ({
      rooms: s.rooms.map((r) =>
        r.id === roomId ? { ...r, phase } : r
      ),
    })),

  setRoomStatus: (roomId, status) =>
    set((s) => ({
      rooms: s.rooms.map((r) =>
        r.id === roomId ? { ...r, status } : r
      ),
    })),

  closeRoom: (roomId) =>
    set((s) => ({
      rooms: s.rooms.map((r) =>
        r.id === roomId
          ? {
              ...r,
              status: "closed",
              phase: "closing",
              closedAt: new Date().toISOString(),
            }
          : r
      ),
      // Purge session messages — core product behavior
      messages: s.messages.filter((m) => m.roomId !== roomId),
    })),

  sendMessage: (roomId, participantId, displayRole, body, isFacilitator) => {
    const room = get().getRoom(roomId);
    if (!room || room.status === "closed") return;
    const msg: Message = {
      id: `m-${crypto.randomUUID().slice(0, 8)}`,
      roomId,
      participantId,
      displayRole,
      body: body.trim(),
      createdAt: new Date().toISOString(),
      isFacilitator,
    };
    set((s) => ({ messages: [...s.messages, msg] }));
  },

  proposeOutcome: (roomId, body, proposedBy, ownerLabel, dueDate) => {
    const entry: OutcomeEntry = {
      id: `o-${crypto.randomUUID().slice(0, 8)}`,
      roomId,
      status: "proposed",
      body: body.trim(),
      ownerLabel,
      dueDate,
      proposedBy,
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ outcomes: [...s.outcomes, entry] }));
  },

  setOutcomeStatus: (outcomeId, status, approvedBy) =>
    set((s) => ({
      outcomes: s.outcomes.map((o) =>
        o.id === outcomeId
          ? {
              ...o,
              status,
              approvedBy:
                status === "approved" ? approvedBy ?? o.approvedBy : o.approvedBy,
              approvedAt:
                status === "approved"
                  ? new Date().toISOString()
                  : o.approvedAt,
            }
          : o
      ),
    })),

  getRoom: (id) => get().rooms.find((r) => r.id === id),
  getRoomParticipants: (roomId) =>
    get().participants.filter((p) => p.roomId === roomId),
  getRoomMessages: (roomId) =>
    get().messages.filter((m) => m.roomId === roomId),
  getRoomOutcomes: (roomId) =>
    get().outcomes.filter((o) => o.roomId === roomId),
}));
