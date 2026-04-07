import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import PlotDetailPanel from "./PlotDetailPanel";
import { useGameStore } from "../../store/gameStore";

vi.mock("../../store/gameStore");

describe("PlotDetailPanel", () => {
    it("renders a detail placeholder when no plot is selected", () => {
        // For the RED test we render with null enriched and expect the select placeholder
        render((<PlotDetailPanel enriched={null} />) as any);
        expect(
            screen.getByText(/Select a plot to view details\./i),
        ).toBeInTheDocument();
    });

    it("shows LAUNCH PLOT for available plots and calls startPlot", async () => {
        const startPlot = vi.fn();
        const storeState = { startPlot } as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector(storeState),
        );

        const def = {
            id: "plot-1",
            name: "Plot One",
            description: "x",
            tier: 1,
            category: "cat",
            requirements: { agentCount: 1, researchIds: [] },
            stages: [{ durationDays: 3 }],
        } as any;
        const enriched = {
            definition: def,
            status: "available" as const,
        } as any;

        render(
            (
                <PlotDetailPanel enriched={enriched} unlockedResearchIds={[]} />
            ) as any,
        );

        const btn = screen.getByRole("button", { name: /LAUNCH PLOT/i });
        await userEvent.click(btn);
        expect(startPlot).toHaveBeenCalledWith(def.id);
    });

    it("shows assigned and available agents and wires assign/remove/cancel", async () => {
        const assignAgentToPlot = vi.fn();
        const removeAgentFromPlot = vi.fn();
        const cancelPlot = vi.fn();
        const storeState = {
            assignAgentToPlot,
            removeAgentFromPlot,
            cancelPlot,
        } as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector(storeState),
        );

        const person1 = { id: "p1", name: "Agent One", agentStatus: {} } as any;
        const person2 = { id: "p2", name: "Agent Two", agentStatus: {} } as any;

        const activeRecord = {
            id: "active-1",
            plotDefinitionId: "plot-1",
            currentStageIndex: 0,
            assignedAgentIds: ["p1"],
            daysRemaining: 2,
            accumulatedSuccessScore: 0,
            status: "active",
        } as any;
        const def = {
            id: "plot-1",
            name: "Plot One",
            description: "x",
            tier: 1,
            category: "cat",
            requirements: { agentCount: 1, researchIds: [] },
            stages: [{ durationDays: 3 }],
        } as any;
        const enriched = {
            record: activeRecord,
            definition: def,
            assignedAgents: [person1],
            progressPct: 33,
            targetLabel: "—",
        } as any;

        render(
            (
                <PlotDetailPanel
                    enriched={enriched}
                    availableAgents={[person2]}
                    unlockedResearchIds={[]}
                />
            ) as any,
        );

        // assigned agent row and remove
        expect(screen.getByText(/Agent One/)).toBeInTheDocument();
        const removeBtn = screen.getByRole("button", { name: /REMOVE/i });
        await userEvent.click(removeBtn);
        expect(removeAgentFromPlot).toHaveBeenCalledWith(
            activeRecord.id,
            person1.id,
        );

        // available agent assign
        expect(screen.getByText(/Agent Two/)).toBeInTheDocument();
        const assignBtn = screen.getByRole("button", { name: /ASSIGN/i });
        await userEvent.click(assignBtn);
        expect(assignAgentToPlot).toHaveBeenCalledWith(
            activeRecord.id,
            person2.id,
        );

        // cancel plot
        const cancelBtn = screen.getByRole("button", { name: /CANCEL PLOT/i });
        await userEvent.click(cancelBtn);
        expect(cancelPlot).toHaveBeenCalledWith(activeRecord.id);
    });
});
