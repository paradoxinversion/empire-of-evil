import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import PlotsScreen from "./index";
import { useGameState } from "../../hooks/useGameState";

vi.mock("../../hooks/useGameState");

describe("PlotsScreen", () => {
    it("renders tabs and a right-side detail placeholder", () => {
        const mockReadyGameState = {
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
            mockReadyGameState as any,
        );

        render(<PlotsScreen />);
        expect(screen.getByText("AVAILABLE")).toBeInTheDocument();
        expect(screen.getByText("ACTIVE")).toBeInTheDocument();
        expect(
            screen.getByText(/Select a plot to view details\./i),
        ).toBeInTheDocument();
    });
});
