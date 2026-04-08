import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import { CharacterProfile } from "./CharacterProfile";
import { useGameState } from "../../hooks/useGameState";

vi.mock("../../hooks/useGameState");

afterEach(() => {
    vi.useRealTimers();
});

describe("CharacterProfile", () => {
    it("renders top-panel quick actions for agents", () => {
        const gameState = {
            persons: {
                "person-1": {
                    id: "person-1",
                    name: "Agent Alpha",
                    zoneId: "zone-1",
                    homeZoneId: "zone-1",
                    governingOrganizationId: "org-1",
                    attributes: { intellect: 72 },
                    skills: { research: 66 },
                    loyalties: { empire: 81 },
                    intelLevel: 100,
                    health: 100,
                    money: 0,
                    activeEffectIds: [],
                    dead: false,
                    agentStatus: { job: "scientist", salary: 12 },
                },
            },
            governingOrganizations: {
                empire: { id: "empire", name: "Empire of Evil Inc." },
            },
            effectInstances: {},
        } as any;

        vi.mocked(useGameState).mockReturnValue(gameState);

        render(<CharacterProfile personId="person-1" onClose={() => {}} />);

        expect(
            screen.getByRole("button", { name: /REASSIGN/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /ADD TO SQUAD/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /MOVE/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /FIRE/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /TERMINATE/i }),
        ).toBeInTheDocument();
    });

    it("shows loyalty guidance in a tooltip", () => {
        vi.useFakeTimers();

        const gameState = {
            persons: {
                "person-1": {
                    id: "person-1",
                    name: "Agent Alpha",
                    zoneId: "zone-1",
                    homeZoneId: "zone-1",
                    governingOrganizationId: "org-1",
                    attributes: { intellect: 72 },
                    skills: { research: 66 },
                    loyalties: { empire: 81 },
                    intelLevel: 100,
                    health: 100,
                    money: 0,
                    activeEffectIds: [],
                    dead: false,
                    agentStatus: { job: "scientist", salary: 12 },
                },
            },
            governingOrganizations: {
                empire: { id: "empire", name: "Empire of Evil Inc." },
            },
            effectInstances: {},
        } as any;

        vi.mocked(useGameState).mockReturnValue(gameState);

        render(<CharacterProfile personId="person-1" onClose={() => {}} />);

        fireEvent.mouseOver(screen.getByLabelText("Loyalty help"));
        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(
            screen.getByRole("tooltip", {
                name: /Loyalty reflects alignment with each organization/i,
            }),
        ).toBeInTheDocument();
    });
});
