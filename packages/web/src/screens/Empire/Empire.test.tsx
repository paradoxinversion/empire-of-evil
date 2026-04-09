import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, vi } from "vitest";
import { EmpireScreen } from "./EmpireScreen";
import { useGameState } from "../../hooks/useGameState";
import type { GameState } from "@empire-of-evil/engine";

vi.mock("../../hooks/useGameState");

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
});
