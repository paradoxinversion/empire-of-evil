import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, vi } from "vitest";
import PlotDetailPanel from "./PlotDetailPanel";
import { useGameStore } from "../../store/gameStore";

vi.mock("../../store/gameStore");

afterEach(() => {
    vi.useRealTimers();
});

describe("PlotDetailPanel", () => {
    it("renders a detail placeholder when no plot is selected", () => {
        // For the RED test we render with null enriched and expect the select placeholder
        render((<PlotDetailPanel enriched={null} />) as any);
        expect(
            screen.getByText(/Select a plot to view details\./i),
        ).toBeInTheDocument();
    });

    it("keeps hook order stable when selection changes from empty to a plot", () => {
        const consoleErrorSpy = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});

        const storeState = {
            startPlot: vi.fn(),
            cancelPlot: vi.fn(),
            assignAgentToPlot: vi.fn(),
            removeAgentFromPlot: vi.fn(),
            gameState: {
                date: 0,
                zones: {},
                nations: {},
                governingOrganizations: {},
            },
        } as any;

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

        const { rerender } = render(
            (<PlotDetailPanel enriched={null} />) as any,
        );

        rerender(
            (
                <PlotDetailPanel
                    enriched={{ definition: def, status: "available" } as any}
                />
            ) as any,
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

    it("shows LAUNCH PLOT for available plots and calls startPlot", async () => {
        const startPlot = vi.fn();
        const storeState = {
            startPlot,
            gameState: {
                date: 0,
                zones: {},
                nations: {},
                governingOrganizations: {},
            },
        } as any;
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

    it("shows requirements help in a tooltip", () => {
        vi.useFakeTimers();

        const startPlot = vi.fn();
        const storeState = {
            startPlot,
            gameState: {
                date: 0,
                zones: {},
                nations: {},
                governingOrganizations: {},
            },
        } as any;
        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector(storeState),
        );

        const def = {
            id: "plot-1",
            name: "Plot One",
            description: "x",
            tier: 1,
            category: "cat",
            requirements: { agentCount: 1, researchIds: ["counterfeiter"] },
            stages: [{ durationDays: 3 }],
        } as any;

        render(
            <PlotDetailPanel
                enriched={{ definition: def, status: "available" } as any}
                unlockedResearchIds={[]}
            />,
        );

        fireEvent.mouseOver(screen.getByLabelText("Requirements help"));
        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(
            screen.getByRole("tooltip", {
                name: /Use this section to confirm agent/i,
            }),
        ).toBeInTheDocument();
    });

    it("requires a target zone for zone-targeted plots and launches with the selected zone", async () => {
        const startPlot = vi.fn();
        const storeState = {
            startPlot,
            gameState: {
                date: 0,
                zones: {
                    "zone-1": {
                        id: "zone-1",
                        name: "Albion Central",
                        nationId: "nation-1",
                        governingOrganizationId: "org-1",
                        intelLevel: 48,
                    },
                    "zone-2": {
                        id: "zone-2",
                        name: "Carpathia Fringe",
                        nationId: "nation-2",
                        governingOrganizationId: "org-2",
                        intelLevel: 12,
                    },
                },
                nations: {
                    "nation-1": { id: "nation-1", name: "Albion" },
                    "nation-2": { id: "nation-2", name: "Carpathia" },
                },
                governingOrganizations: {
                    "org-1": { id: "org-1", name: "Civic Directorate" },
                    "org-2": { id: "org-2", name: "Frontier Bureau" },
                },
            },
        } as any;

        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector(storeState),
        );

        const def = {
            id: "plot-zone",
            name: "Reconnaissance",
            description: "Gather intelligence on a foreign zone.",
            tier: 1,
            category: "military-operations",
            requirements: { agentCount: 1, researchIds: [], zoneCount: 1 },
            stages: [{ durationDays: 3 }],
        } as any;

        render(
            <PlotDetailPanel
                enriched={{ definition: def, status: "available" } as any}
                unlockedResearchIds={[]}
            />,
        );

        const launchButton = screen.getByRole("button", {
            name: /LAUNCH PLOT/i,
        });
        expect(launchButton).toBeDisabled();

        await userEvent.selectOptions(
            screen.getByLabelText(/Target zone/i),
            "zone-2",
        );

        expect(screen.getByText(/Intel level LOW/i)).toBeInTheDocument();
        expect(launchButton).not.toBeDisabled();

        await userEvent.click(launchButton);
        expect(startPlot).toHaveBeenCalledWith("plot-zone", "zone-2");
    });

    it("assigns available agents through the picker and confirms before canceling", async () => {
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

        // available agent assign via picker modal
        const addAgentsBtn = screen.getByRole("button", {
            name: /ADD AGENTS/i,
        });
        await userEvent.click(addAgentsBtn);

        expect(
            screen.getByRole("dialog", { name: /ADD AGENTS/i }),
        ).toBeInTheDocument();
        await userEvent.click(
            screen.getByRole("button", { name: /Agent Two/i }),
        );
        await userEvent.click(
            screen.getByRole("button", { name: /ASSIGN 1 AGENT/i }),
        );

        expect(assignAgentToPlot).toHaveBeenCalledWith(
            activeRecord.id,
            person2.id,
        );

        // cancel plot opens confirmation first
        const cancelBtn = screen.getByRole("button", { name: /CANCEL PLOT/i });
        await userEvent.click(cancelBtn);
        expect(cancelPlot).not.toHaveBeenCalled();

        expect(
            screen.getByRole("alertdialog", { name: /CANCEL PLOT/i }),
        ).toBeInTheDocument();

        await userEvent.click(screen.getByRole("button", { name: /CONFIRM/i }));
        expect(cancelPlot).toHaveBeenCalledWith(activeRecord.id);
    });
});
