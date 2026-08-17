import { beforeEach, describe, expect, it } from "vitest";
import {
  createInitialFixtureState,
  FixtureRoomRepository,
} from "./fixture-repository";
import { RoomService } from "./room-service";
import type { User } from "@/domain/types";

const facilitator: User = {
  id: "u-fac-1",
  name: "Alex Rivera",
  email: "alex@example.org",
  role: "facilitator",
};

const participant: User = {
  id: "u-p-1",
  name: "Jordan Lee",
  email: "jordan@example.org",
  role: "participant",
};

describe("RoomService invariants", () => {
  let repo: FixtureRoomRepository;
  let service: RoomService;

  beforeEach(() => {
    repo = new FixtureRoomRepository(createInitialFixtureState());
    service = new RoomService(repo);
  });

  describe("outcome approval", () => {
    it("does not treat proposed outcomes as approved until facilitator approves", async () => {
      const before = await service.listOutcomesForViewer("room-1", participant);
      expect(before.every((o) => o.status === "approved")).toBe(true);

      const proposed = await service.proposeOutcome(facilitator, {
        roomId: "room-1",
        body: "Schedule joint review of checklist",
        proposedByParticipantId: "rp-1",
      });
      expect(proposed.success).toBe(true);

      const forParticipant = await service.listOutcomesForViewer(
        "room-1",
        participant
      );
      expect(
        forParticipant.find((o) => o.body.includes("joint review"))
      ).toBeUndefined();

      const forFac = await service.listOutcomesForViewer("room-1", facilitator);
      const draft = forFac.find((o) => o.body.includes("joint review"));
      expect(draft?.status).toBe("proposed");

      if (!draft) throw new Error("missing draft");
      const approved = await service.setOutcomeStatus(
        facilitator,
        draft.id,
        "approved"
      );
      expect(approved.success).toBe(true);

      const after = await service.listOutcomesForViewer("room-1", participant);
      expect(after.some((o) => o.body.includes("joint review"))).toBe(true);
    });

    it("rejects participant self-approval", async () => {
      const forFac = await service.listOutcomesForViewer("room-1", facilitator);
      const proposed = forFac.find((o) => o.status === "proposed");
      expect(proposed).toBeTruthy();
      if (!proposed) return;

      const result = await service.setOutcomeStatus(
        participant,
        proposed.id,
        "approved"
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.code).toBe("UNAUTHORIZED");
      }

      const still = await repo.getOutcome(proposed.id);
      expect(still?.status).toBe("proposed");
    });
  });

  describe("close and purge", () => {
    it("closes room, purges messages, retains approved outcomes", async () => {
      const msgsBefore = await repo.listMessages("room-1");
      expect(msgsBefore.length).toBeGreaterThan(0);

      const close = await service.closeRoom(facilitator, "room-1");
      expect(close.success).toBe(true);
      if (close.success) {
        expect(close.data.status).toBe("closed");
      }

      const msgsAfter = await repo.listMessages("room-1");
      expect(msgsAfter).toHaveLength(0);

      const outcomes = await repo.listOutcomes("room-1");
      expect(outcomes.length).toBeGreaterThan(0);

      const again = await service.closeRoom(facilitator, "room-1");
      expect(again.success).toBe(true);
      expect(await repo.listMessages("room-1")).toHaveLength(0);
    });

    it("rejects participant close attempts", async () => {
      const result = await service.closeRoom(participant, "room-1");
      expect(result.success).toBe(false);
      if (!result.success) expect(result.code).toBe("UNAUTHORIZED");
      const room = await repo.getRoom("room-1");
      expect(room?.status).not.toBe("closed");
    });
  });

  describe("phase transitions", () => {
    it("allows facilitator phase changes on open rooms", async () => {
      const result = await service.setPhase(facilitator, "room-1", "synthesis");
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.phase).toBe("synthesis");
    });

    it("rejects participant phase changes", async () => {
      const result = await service.setPhase(participant, "room-1", "caucus");
      expect(result.success).toBe(false);
      if (!result.success) expect(result.code).toBe("UNAUTHORIZED");
    });

    it("rejects phase changes on closed rooms", async () => {
      await service.closeRoom(facilitator, "room-1");
      const result = await service.setPhase(facilitator, "room-1", "dialogue");
      expect(result.success).toBe(false);
      if (!result.success) expect(result.code).toBe("INVALID_STATE");
    });
  });

  describe("messaging", () => {
    it("allows participant messages while open via membership", async () => {
      const result = await service.sendMessage(participant, {
        roomId: "room-1",
        participantId: "rp-2",
        displayRole: "Engineer A",
        body: "We need clearer handoff criteria.",
        isFacilitator: false,
      });
      expect(result.success).toBe(true);
    });

    it("blocks messages after close", async () => {
      await service.closeRoom(facilitator, "room-1");
      const result = await service.sendMessage(participant, {
        roomId: "room-1",
        participantId: "rp-2",
        displayRole: "Engineer A",
        body: "Should not land",
        isFacilitator: false,
      });
      expect(result.success).toBe(false);
    });
  });
});
