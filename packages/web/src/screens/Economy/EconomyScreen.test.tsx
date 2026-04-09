import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, vi } from "vitest";
import type { GameState } from "@empire-of-evil/engine";
import { EconomyScreen } from "./EconomyScreen";
import { useGameState } from "../../hooks/useGameState";
import { useGameStore } from "../../store/gameStore";

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
    date: 1,
    worldSeed: 42,
    empire: {
        id: "empire-1",
        overlordId: "p1",
        petId: "pet-1",
        resources: { money: 1000, science: 0, infrastructure: 0 },
        evil: { actual: 0, perceived: 0 },
        innerCircleIds: [],
        unlockedPlotIds: [],
        unlockedActivityIds: [],
        unlockedResearchIds: [],
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
    zones: {
        z1: {
            id: "z1",
            name: "Zone One",
            nationId: "n1",
            governingOrganizationId: "empire-1",
            tileIds: ["t1"],
            buildingIds: [],
            generationWealth: 0,
            economicOutput: 100,
            population: 100,
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
    buildings: {},
    persons: {},
    governingOrganizations: {
        "empire-1": {
            id: "empire-1",
            name: "Empire",
            intelLevel: 0,
            activeEffectIds: [],
        },
    },
    squads: {},
    plots: {},
    activities: {},
    research: {},
    captives: {},
    effectInstances: {},
    morgues: { byCitizen: {}, byAgent: {} },
    pendingEvents: [],
    eventLog: [],
};

beforeEach(() => {
    vi.mocked(useGameState).mockReturnValue(mockGameState as GameState);
});

describe("EconomyScreen", () => {
    it("updates zone tax rate from the citizen taxes controls", () => {
        const setZoneTaxRate = vi.fn();
        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector({
                setZoneTaxRate,
            }),
        );

        render(<EconomyScreen />);

        const slider = screen.getByRole("slider", {
            name: "Tax rate for Zone One",
        });

        fireEvent.change(slider, { target: { value: "25" } });

        expect(setZoneTaxRate).toHaveBeenCalledWith("z1", 0.25);
    });
});
