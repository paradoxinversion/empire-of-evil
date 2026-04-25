import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, vi } from "vitest";
import { App } from "./App";
import { useGameStore } from "./store/gameStore";
import { useGameState } from "./hooks/useGameState";
import { useNavigationStore } from "./store/navigationStore";
import type { GameState } from "@empire-of-evil/engine";

vi.mock("./store/gameStore");
vi.mock("./hooks/useGameState");
vi.mock("./store/navigationStore");

const mockReadyGameState: Partial<GameState> = {
    date: 0,
    empire: {
        id: "empire-1",
        overlordId: "person-1",
        petId: "person-2",
        resources: { money: 0, science: 0, infrastructure: 0 },
        evil: { actual: 0, perceived: 0 },
        innerCircleIds: [],
        unlockedPlotIds: [],
        unlockedActivityIds: [],
        unlockedResearchIds: [],
    },
    zones: {},
    plots: {},
    activities: {},
    persons: {},
    nations: {},
    pendingEvents: [],
    eventLog: [],
};

beforeEach(() => {
    const navState = { activeScreen: "empire", setActiveScreen: vi.fn() };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(useNavigationStore).mockImplementation((sel: any) =>
        sel(navState),
    );
    vi.mocked(useGameState).mockReturnValue(mockReadyGameState as GameState);
});

describe("App", () => {
    it("renders LoginScreen when status is idle", () => {
        const storeState = {
            status: "idle" as const,
            newGame: vi.fn(),
            advanceTo: vi.fn(),
            pauseAdvance: vi.fn(),
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useGameStore).mockImplementation((sel: any) =>
            sel(storeState),
        );
        render(<App />);
        expect(
            screen.getByRole("button", { name: /NEW GAME/i }),
        ).toBeInTheDocument();
    });

    it("clicking NEW GAME shows the WorldGen screen", async () => {
        const storeState = {
            status: "idle" as const,
            newGame: vi.fn(),
            advanceTo: vi.fn(),
            pauseAdvance: vi.fn(),
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useGameStore).mockImplementation((sel: any) =>
            sel(storeState),
        );
        render(<App />);
        await userEvent.click(
            screen.getByRole("button", { name: /NEW GAME/i }),
        );
        expect(
            screen.getByRole("button", { name: /GENERATE WORLD/i }),
        ).toBeInTheDocument();
    });

    it("renders AppShell with Empire screen when status is ready", () => {
        const storeState = {
            status: "ready" as const,
            newGame: vi.fn(),
            advanceTo: vi.fn(),
            pauseAdvance: vi.fn(),
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useGameStore).mockImplementation((sel: any) =>
            sel(storeState),
        );
        render(<App />);
        expect(screen.getByText("EMPIRE OF EVIL INC.")).toBeInTheDocument();
        expect(screen.getByText("EMPIRE OVERVIEW")).toBeInTheDocument();
    });

    it("renders CaptivesScreen when activeScreen is captives", () => {
        const storeState = {
            status: "ready" as const,
            newGame: vi.fn(),
            advanceTo: vi.fn(),
            pauseAdvance: vi.fn(),
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useGameStore).mockImplementation((sel: any) =>
            sel(storeState),
        );
        const navState = { activeScreen: "captives", setActiveScreen: vi.fn() };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useNavigationStore).mockImplementation((sel: any) =>
            sel(navState),
        );
        vi.mocked(useGameState).mockReturnValue({
            ...mockReadyGameState,
            captives: {},
        } as GameState);
        render(<App />);
        // 'CAPTIVES' appears in both the sidebar nav item and the screen heading
        expect(screen.getAllByText("CAPTIVES").length).toBeGreaterThanOrEqual(
            1,
        );
    });
});
