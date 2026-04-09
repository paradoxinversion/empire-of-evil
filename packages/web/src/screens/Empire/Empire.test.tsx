import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, vi } from "vitest";
import { EmpireScreen } from "./EmpireScreen";
import { useGameState } from "../../hooks/useGameState";
import { useGameStore } from "../../store/gameStore";
import type { GameState } from "@empire-of-evil/engine";

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

const mockGameState: Partial<GameState> = {
    date: 0,
    worldSeed: 42,
    tiles: {
        t1: {
            id: "t1",
            typeId: "urban",
            zoneId: "z1",
            activeEffectIds: [],
            governingOrganizationId: "empire-1",
        },
        t2: {
            id: "t2",
            typeId: "urban",
            zoneId: "z2",
            activeEffectIds: [],
            governingOrganizationId: "org-2",
        },
    },
    empire: {
        id: "empire-1",
        overlordId: "person-1",
        petId: "person-2",
        resources: { money: 1500000, science: 500, infrastructure: 3 },
        evil: { actual: 5, perceived: 5 },
        innerCircleIds: [],
        unlockedPlotIds: [],
        unlockedActivityIds: [],
        unlockedResearchIds: [],
    },
    zones: {
        z1: {
            id: "z1",
            name: "Zone Alpha",
            nationId: "n1",
            governingOrganizationId: "empire-1",
            tileIds: ["t1"],
            buildingIds: ["b1", "b2"],
            generationWealth: 10,
            economicOutput: 500,
            population: 1000,
            intelLevel: 0,
            taxRate: 0.1,
            activeEffectIds: [],
        },
        z2: {
            id: "z2",
            name: "Zone Beta",
            nationId: "n1",
            governingOrganizationId: "org-2",
            tileIds: ["t2"],
            buildingIds: ["b3"],
            generationWealth: 10,
            economicOutput: 500,
            population: 1000,
            intelLevel: 0,
            taxRate: 0.1,
            activeEffectIds: [],
        },
    },
    buildings: {
        b1: {
            id: "b1",
            name: "Citadel Prime",
            typeId: "market-stall",
            zoneId: "z1",
            tileId: "t1",
            intelLevel: 3,
            governingOrganizationId: "empire-1",
            activeEffectIds: [],
            assignedAgentIds: ["person-1"],
        },
        b2: {
            id: "b2",
            name: "Bio Lab 9",
            typeId: "bank",
            zoneId: "z1",
            tileId: "t1",
            intelLevel: 1,
            governingOrganizationId: "empire-1",
            activeEffectIds: [],
        },
        b3: {
            id: "b3",
            name: "Foreign Bureau",
            typeId: "office",
            zoneId: "z2",
            tileId: "t2",
            intelLevel: 4,
            governingOrganizationId: "org-2",
            activeEffectIds: [],
        },
    },
    plots: {},
    activities: {},
    persons: {
        "person-1": {
            id: "person-1",
            name: "The Overlord",
            zoneId: "z1",
            homeZoneId: "z1",
            governingOrganizationId: "org-1",
            attributes: {},
            skills: {},
            loyalties: {},
            intelLevel: 0,
            health: 100,
            money: 0,
            activeEffectIds: [],
            dead: false,
            agentStatus: { job: "unassigned", salary: 0 },
        },
        "person-2": {
            id: "person-2",
            name: "Agent Violet",
            zoneId: "z1",
            homeZoneId: "z1",
            governingOrganizationId: "empire-1",
            attributes: {},
            skills: { finance: 7 },
            loyalties: {},
            intelLevel: 0,
            health: 100,
            money: 0,
            activeEffectIds: [],
            dead: false,
            agentStatus: { job: "administrator", salary: 10 },
        },
    },
    pendingEvents: [],
    eventLog: [],
    nations: {
        n1: {
            id: "n1",
            name: "Test Nation",
            size: 1,
            governingOrganizationId: "org-1",
        },
    },
    governingOrganizations: {
        "empire-1": {
            id: "empire-1",
            name: "Empire",
            intelLevel: 10,
            activeEffectIds: [],
        },
        "org-2": {
            id: "org-2",
            name: "Rivals",
            intelLevel: 10,
            activeEffectIds: [],
        },
    },
    squads: {},
    research: {},
    captives: {},
    effectInstances: {},
    morgues: { byCitizen: {}, byAgent: {} },
};

beforeEach(() => {
    vi.mocked(useGameState).mockReturnValue(mockGameState as GameState);
    vi.mocked(useGameStore).mockImplementation((selector: any) =>
        selector({
            assignAgentToBuilding: vi.fn(),
            removeAgentFromBuilding: vi.fn(),
        }),
    );
});

describe("EmpireScreen", () => {
    it("renders without error", () => {
        render(<EmpireScreen />);
        expect(
            screen.getByRole("button", { name: "OVERVIEW" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "BUILDINGS" }),
        ).toBeInTheDocument();
    });

    it("displays the money value", () => {
        render(<EmpireScreen />);
        expect(screen.getByText("$1,500,000")).toBeInTheDocument();
    });

    it("renders the ACTIVE OPERATIONS panel", () => {
        render(<EmpireScreen />);
        expect(screen.getByText("ACTIVE OPERATIONS")).toBeInTheDocument();
    });

    it("renders the RECENT ACTIVITY panel", () => {
        render(<EmpireScreen />);
        expect(screen.getByText("RECENT ACTIVITY")).toBeInTheDocument();
    });

    it("renders the CONTROLLED ZONES panel", () => {
        render(<EmpireScreen />);
        expect(screen.getByText("CONTROLLED ZONES")).toBeInTheDocument();
    });

    it("shows only empire buildings on the Buildings tab", async () => {
        const user = userEvent.setup();
        render(<EmpireScreen />);

        await user.click(screen.getByRole("button", { name: "BUILDINGS" }));

        expect(screen.getByText("EMPIRE BUILDINGS")).toBeInTheDocument();
        expect(screen.getByText("Citadel Prime")).toBeInTheDocument();
        expect(screen.getByText("Bio Lab 9")).toBeInTheDocument();
        expect(screen.queryByText("Foreign Bureau")).not.toBeInTheDocument();
    });

    it("filters buildings by search text", async () => {
        const user = userEvent.setup();
        render(<EmpireScreen />);

        await user.click(screen.getByRole("button", { name: "BUILDINGS" }));
        await user.type(
            screen.getByPlaceholderText("SEARCH BUILDINGS..."),
            "bio",
        );

        expect(screen.getByText("Bio Lab 9")).toBeInTheDocument();
        expect(screen.queryByText("Citadel Prime")).not.toBeInTheDocument();
    });

    it("sorts buildings by output descending", async () => {
        const user = userEvent.setup();
        render(<EmpireScreen />);

        await user.click(screen.getByRole("button", { name: "BUILDINGS" }));
        await user.selectOptions(
            screen.getByLabelText("Sort by"),
            "output_desc",
        );

        const rows = screen.getAllByTestId("empire-building-row");
        expect(within(rows[0]).getByText("Bio Lab 9")).toBeInTheDocument();
        expect(within(rows[1]).getByText("Citadel Prime")).toBeInTheDocument();
    });

    it("groups buildings by zone", async () => {
        const user = userEvent.setup();
        render(<EmpireScreen />);

        await user.click(screen.getByRole("button", { name: "BUILDINGS" }));
        await user.selectOptions(screen.getByLabelText("Group by"), "zone");

        expect(screen.getByText("ZONE ALPHA (2)")).toBeInTheDocument();
    });

    it("shows the empty state when filters remove all buildings", async () => {
        const user = userEvent.setup();
        render(<EmpireScreen />);

        await user.click(screen.getByRole("button", { name: "BUILDINGS" }));
        await user.type(
            screen.getByPlaceholderText("SEARCH BUILDINGS..."),
            "no-match",
        );

        expect(
            screen.getByText("No empire buildings match the current controls."),
        ).toBeInTheDocument();
        expect(
            screen.queryByTestId("empire-building-row"),
        ).not.toBeInTheDocument();
    });

    it("shows a placeholder until a building row is selected", async () => {
        const user = userEvent.setup();
        render(<EmpireScreen />);

        await user.click(screen.getByRole("button", { name: "BUILDINGS" }));

        expect(
            screen.getByText("Select a building to view details."),
        ).toBeInTheDocument();
    });

    it("shows selected building details when a row is clicked", async () => {
        const user = userEvent.setup();
        render(<EmpireScreen />);

        await user.click(screen.getByRole("button", { name: "BUILDINGS" }));
        await user.click(screen.getByRole("button", { name: /Bio Lab 9/i }));

        expect(screen.getByText("BUILDING DETAIL")).toBeInTheDocument();
        expect(screen.getByText("ASSIGNED AGENTS")).toBeInTheDocument();
        expect(screen.getByText("0 / 2 STAFFED")).toBeInTheDocument();
    });

    it("renders per-resource output in list and detail", async () => {
        const user = userEvent.setup();

        const withHeadquarters = structuredClone(mockGameState);
        (withHeadquarters.zones as any).z1.buildingIds.push("b4");
        (withHeadquarters.buildings as any).b4 = {
            id: "b4",
            name: "Central HQ",
            typeId: "headquarters",
            zoneId: "z1",
            tileId: "t1",
            intelLevel: 3,
            governingOrganizationId: "empire-1",
            activeEffectIds: [],
        };

        vi.mocked(useGameState).mockReturnValue(withHeadquarters as GameState);

        render(<EmpireScreen />);

        await user.click(screen.getByRole("button", { name: "BUILDINGS" }));

        expect(screen.getByText("$10 | S5 | I5")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /Central HQ/i }));

        expect(screen.getAllByText("$10 | S5 | I5")).toHaveLength(2);
    });

    it("unassigns agents from the selected building", async () => {
        const user = userEvent.setup();
        const removeAgentFromBuilding = vi.fn();
        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector({
                assignAgentToBuilding: vi.fn(),
                removeAgentFromBuilding,
            }),
        );

        render(<EmpireScreen />);

        await user.click(screen.getByRole("button", { name: "BUILDINGS" }));
        await user.click(
            screen.getByRole("button", { name: /Citadel Prime/i }),
        );
        await user.click(screen.getByRole("button", { name: /UNASSIGN/i }));

        expect(removeAgentFromBuilding).toHaveBeenCalledWith("b1", "person-1");
    });

    it("assigns available agents to the selected building", async () => {
        const user = userEvent.setup();
        const assignAgentToBuilding = vi.fn();
        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector({
                assignAgentToBuilding,
                removeAgentFromBuilding: vi.fn(),
            }),
        );

        render(<EmpireScreen />);

        await user.click(screen.getByRole("button", { name: "BUILDINGS" }));
        await user.click(screen.getByRole("button", { name: /Bio Lab 9/i }));
        await user.click(screen.getByRole("button", { name: /ASSIGN AGENT/i }));
        await user.click(screen.getByRole("button", { name: /Agent Violet/i }));
        await user.click(
            screen.getByRole("button", { name: /ASSIGN 1 AGENT/i }),
        );

        expect(assignAgentToBuilding).toHaveBeenCalledWith("b2", "person-2");
    });
});
