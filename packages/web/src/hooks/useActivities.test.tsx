import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

// We'll consume the hook through a small component for testing
import { useActivities } from "./useActivities";
import { useGameState } from "./useGameState";
vi.mock("./useGameState");
import type { GameState } from "@empire-of-evil/engine";

function TestHarness() {
    const {
        activeActivities,
        availableActivities,
        selectedActivityId,
        selectActivity,
    } = useActivities();
    return (
        <div>
            <div>ACTIVE_COUNT: {activeActivities.length}</div>
            <div>AVAILABLE_COUNT: {availableActivities.length}</div>
            <button onClick={() => selectActivity("activity-1")}>Select</button>
            <div>SELECTED: {selectedActivityId ?? "NONE"}</div>
        </div>
    );
}

describe("useActivities hook (integration smoke)", () => {
    it("provides arrays and selection API", async () => {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useGameState as any).mockReturnValue(
            mockReadyGameState as GameState,
        );

        render(<TestHarness />);
        expect(screen.getByText(/ACTIVE_COUNT:/i)).toBeInTheDocument();
        expect(screen.getByText(/AVAILABLE_COUNT:/i)).toBeInTheDocument();
        await userEvent.click(screen.getByRole("button", { name: /Select/i }));
        expect(screen.getByText(/SELECTED:/i)).toBeInTheDocument();
    });
});
