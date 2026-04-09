import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

    it("does not emit a hook-order warning when selecting a plot", async () => {
        const user = userEvent.setup();
        const consoleErrorSpy = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});

        const mockReadyGameState = {
            date: 0,
            empire: {
                id: "empire-1",
                overlordId: "person-1",
                petId: "person-2",
                resources: { money: 0, science: 0, infrastructure: 0 },
                evil: { actual: 0, perceived: 0 },
                innerCircleIds: [],
                unlockedPlotIds: ["biggest-tax-oldest-profession"],
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

        await user.click(
            screen.getByText(/The Biggest Tax for the Oldest Profession/i),
        );

        expect(
            screen.getByRole("button", { name: /LAUNCH PLOT/i }),
        ).toBeInTheDocument();
        expect(
            consoleErrorSpy.mock.calls.some((call) =>
                String(call[0]).includes("change in the order of Hooks"),
            ),
        ).toBe(false);

        consoleErrorSpy.mockRestore();
    });
});
