import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { GameState } from "@empire-of-evil/engine";
import { CaptivesScreen } from "./CaptivesScreen";
import { useGameState } from "../../hooks/useGameState";

vi.mock("../../hooks/useGameState");

const basePerson = {
    id: "person-1",
    name: "Jane Smith",
    zoneId: "zone-1",
    homeZoneId: "zone-1",
    governingOrganizationId: "gov-1",
    attributes: {},
    skills: {},
    loyalties: {},
    intelLevel: 0,
    health: 100,
    money: 0,
    activeEffectIds: [],
    dead: false,
};

const baseZone = {
    id: "zone-1",
    name: "Sector 7",
    nationId: "nation-1",
    governingOrganizationId: "gov-1",
    tileIds: [],
    buildingIds: [],
    intelLevel: 0,
    generationWealth: 0,
    economicOutput: 0,
    stability: 100,
    activeEffectIds: [],
};

const baseCaptive = {
    id: "cap-1",
    personId: "person-1",
    capturedOnDate: 2,
    zoneId: "zone-1",
};

function makeState(overrides: Partial<GameState> = {}): GameState {
    return {
        date: 5,
        captives: { "cap-1": baseCaptive },
        persons: { "person-1": basePerson },
        zones: { "zone-1": baseZone },
        empire: { id: "emp-1" } as any,
        tiles: {},
        nations: {},
        buildings: {},
        squads: {},
        plots: {},
        activities: {},
        research: {},
        effectInstances: {},
        governingOrganizations: {},
        morgues: { byCitizen: {}, byAgent: {} },
        pendingEvents: [],
        eventLog: [],
        worldSeed: 0,
        ...overrides,
    } as GameState;
}

beforeEach(() => {
    vi.mocked(useGameState).mockReturnValue(makeState());
});

describe("CaptivesScreen", () => {
    it("renders the screen heading", () => {
        render(<CaptivesScreen />);
        expect(screen.getByText("CAPTIVES")).toBeInTheDocument();
    });

    it("shows empty state message when there are no captives", () => {
        vi.mocked(useGameState).mockReturnValue(makeState({ captives: {} }));
        render(<CaptivesScreen />);
        expect(screen.getByText(/no captives/i)).toBeInTheDocument();
    });

    it("renders a row for each captive showing the person name", () => {
        render(<CaptivesScreen />);
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    it("shows placeholder in detail panel when no captive is selected", () => {
        render(<CaptivesScreen />);
        expect(screen.getByText(/select a captive/i)).toBeInTheDocument();
    });

    it("shows captive detail panel when a row is selected", async () => {
        render(<CaptivesScreen />);
        await userEvent.click(screen.getByText("Jane Smith"));
        // 'Sector 7' appears in both the table row and the detail panel
        expect(screen.getAllByText("Sector 7").length).toBeGreaterThanOrEqual(
            1,
        );
    });

    it("detail panel shows capture day (1-indexed)", async () => {
        render(<CaptivesScreen />);
        await userEvent.click(screen.getByText("Jane Smith"));
        // capturedOnDate is 2, display as "Day 3" (1-indexed)
        // 'Day 3' appears in both the table row and the detail panel
        expect(screen.getAllByText(/day 3/i).length).toBeGreaterThanOrEqual(1);
    });

    it("detail panel shows detention duration", async () => {
        render(<CaptivesScreen />);
        // date=5, capturedOnDate=2, duration = 5 - 2 + 1 = 4 days
        await userEvent.click(screen.getByText("Jane Smith"));
        expect(screen.getByText(/4 days/i)).toBeInTheDocument();
    });

    it("shows fallback name when captive personId is not found in persons", () => {
        vi.mocked(useGameState).mockReturnValue(
            makeState({
                captives: {
                    "cap-2": {
                        id: "cap-2",
                        personId: "missing-person",
                        capturedOnDate: 1,
                        zoneId: "zone-1",
                    },
                },
            }),
        );
        render(<CaptivesScreen />);
        expect(screen.getByText(/unknown/i)).toBeInTheDocument();
    });

    it("shows fallback zone when captive zoneId is not found in zones", async () => {
        vi.mocked(useGameState).mockReturnValue(
            makeState({
                captives: {
                    "cap-3": {
                        id: "cap-3",
                        personId: "person-1",
                        capturedOnDate: 0,
                        zoneId: "missing-zone",
                    },
                },
            }),
        );
        render(<CaptivesScreen />);
        await userEvent.click(screen.getByText("Jane Smith"));
        expect(screen.getByText(/unknown zone/i)).toBeInTheDocument();
    });
});
