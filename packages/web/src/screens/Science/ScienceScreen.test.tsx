import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { ScienceScreen } from "./ScienceScreen";
import { useResearch } from "../../hooks/useResearch";
import { useGameState } from "../../hooks/useGameState";
import { useGameStore } from "../../store/gameStore";
import type { GameState } from "@empire-of-evil/engine";

vi.mock("../../hooks/useResearch");
vi.mock("../../hooks/useGameState");
vi.mock("../../store/gameStore", async () => {
    const actual = await vi.importActual<
        typeof import("../../store/gameStore")
    >("../../store/gameStore");
    return {
        ...actual,
        useGameStore: vi.fn(),
    };
});

const mockState: Partial<GameState> = {
    date: 0,
    worldSeed: 123,
    empire: {
        id: "empire-1",
        overlordId: "p-overlord",
        petId: "pet-1",
        resources: { money: 1000, science: 100, infrastructure: 5 },
        evil: { actual: 1, perceived: 1 },
        innerCircleIds: [],
        unlockedPlotIds: [],
        unlockedActivityIds: [],
        unlockedResearchIds: [],
    },
    zones: {
        z1: {
            id: "z1",
            name: "Zone One",
            nationId: "n1",
            governingOrganizationId: "empire-1",
            tileIds: ["t1"],
            buildingIds: ["b-lab", "b-hq", "b-market"],
            generationWealth: 10,
            economicOutput: 100,
            population: 1000,
            intelLevel: 0,
            taxRate: 0.1,
            activeEffectIds: [],
        },
    },
    nations: {
        n1: {
            id: "n1",
            name: "Nation One",
            size: 1,
            governingOrganizationId: "empire-1",
        },
    },
    tiles: {
        t1: {
            id: "t1",
            typeId: "urban",
            zoneId: "z1",
            activeEffectIds: [],
            governingOrganizationId: "empire-1",
        },
    },
    buildings: {
        "b-lab": {
            id: "b-lab",
            name: "Apex Lab",
            typeId: "research-lab",
            zoneId: "z1",
            tileId: "t1",
            intelLevel: 3,
            governingOrganizationId: "empire-1",
            activeEffectIds: [],
            assignedAgentIds: [],
        },
        "b-hq": {
            id: "b-hq",
            name: "Dark HQ",
            typeId: "headquarters",
            zoneId: "z1",
            tileId: "t1",
            intelLevel: 4,
            governingOrganizationId: "empire-1",
            activeEffectIds: [],
            assignedAgentIds: [],
        },
        "b-market": {
            id: "b-market",
            name: "Cash Market",
            typeId: "market-stall",
            zoneId: "z1",
            tileId: "t1",
            intelLevel: 2,
            governingOrganizationId: "empire-1",
            activeEffectIds: [],
            assignedAgentIds: [],
        },
    },
    persons: {
        "p-sci": {
            id: "p-sci",
            name: "Doctor Volt",
            zoneId: "z1",
            homeZoneId: "z1",
            governingOrganizationId: "empire-1",
            attributes: {},
            skills: {},
            loyalties: {},
            intelLevel: 0,
            health: 100,
            money: 0,
            activeEffectIds: [],
            dead: false,
            agentStatus: { job: "scientist", salary: 10 },
        },
        "p-op": {
            id: "p-op",
            name: "Agent Brick",
            zoneId: "z1",
            homeZoneId: "z1",
            governingOrganizationId: "empire-1",
            attributes: {},
            skills: {},
            loyalties: {},
            intelLevel: 0,
            health: 100,
            money: 0,
            activeEffectIds: [],
            dead: false,
            agentStatus: { job: "operative", salary: 10 },
        },
    },
    research: {},
    plots: {},
    activities: {},
    governingOrganizations: {
        "empire-1": {
            id: "empire-1",
            name: "Empire",
            intelLevel: 10,
            activeEffectIds: [],
        },
    },
    squads: {},
    captives: {},
    effectInstances: {},
    morgues: { byCitizen: {}, byAgent: {} },
    pendingEvents: [],
    eventLog: [],
};

function mockResearchHook() {
    vi.mocked(useResearch).mockReturnValue({
        projectsByBranch: {
            "materials-engineering": [],
        },
        activeResearches: [],
        completedCount: 0,
        scienceBalance: 0,
        availableScientists: [],
    });
}

beforeEach(() => {
    mockResearchHook();
    vi.mocked(useGameState).mockReturnValue(mockState as GameState);
});

describe("ScienceScreen", () => {
    it("shows a Laboratories tab", () => {
        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector({
                assignAgentToBuilding: vi.fn(),
                removeAgentFromBuilding: vi.fn(),
            }),
        );

        render(<ScienceScreen />);

        expect(
            screen.getByRole("button", { name: "LABORATORIES" }),
        ).toBeInTheDocument();
    });

    it("lists only science-producing buildings in Laboratories", async () => {
        const user = userEvent.setup();
        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector({
                assignAgentToBuilding: vi.fn(),
                removeAgentFromBuilding: vi.fn(),
            }),
        );

        render(<ScienceScreen />);

        await user.click(screen.getByRole("button", { name: "LABORATORIES" }));

        expect(screen.getByText("Apex Lab")).toBeInTheDocument();
        expect(screen.getByText("Dark HQ")).toBeInTheDocument();
        expect(screen.queryByText("Cash Market")).not.toBeInTheDocument();
    });

    it("assigns scientists only in laboratory detail panel", async () => {
        const user = userEvent.setup();
        const assignAgentToBuilding = vi.fn();
        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector({
                assignAgentToBuilding,
                removeAgentFromBuilding: vi.fn(),
            }),
        );

        render(<ScienceScreen />);

        await user.click(screen.getByRole("button", { name: "LABORATORIES" }));
        await user.click(screen.getByRole("button", { name: /Apex Lab/i }));
        await user.click(
            screen.getByRole("button", { name: "ASSIGN SCIENTIST" }),
        );
        await user.click(screen.getByRole("button", { name: /Doctor Volt/i }));
        await user.click(
            screen.getByRole("button", { name: "ASSIGN 1 AGENT" }),
        );

        expect(
            screen.queryByRole("button", { name: /Agent Brick/i }),
        ).not.toBeInTheDocument();
        expect(assignAgentToBuilding).toHaveBeenCalledWith("b-lab", "p-sci");
    });
});
