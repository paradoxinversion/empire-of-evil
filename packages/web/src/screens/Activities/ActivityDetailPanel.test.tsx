import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ActivityDetailPanel from "./ActivityDetailPanel";
import { useGameStore } from "../../store/gameStore";

vi.mock("../../store/gameStore");

describe("ActivityDetailPanel", () => {
    it("renders a detail placeholder when no activity is selected", () => {
        render((<ActivityDetailPanel enriched={null} />) as any);
        expect(
            screen.getByText(/Select an activity to view details\./i),
        ).toBeInTheDocument();
    });

    it("shows LAUNCH ACTIVITY for available activities and calls startActivity", async () => {
        const user = userEvent.setup();
        const startActivity = vi.fn();
        const storeState = {
            startActivity,
            cancelActivity: vi.fn(),
            assignAgentToActivity: vi.fn(),
            removeAgentFromActivity: vi.fn(),
            startActivityWithAgent: vi.fn(),
        } as any;

        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector(storeState),
        );

        const def = {
            id: "training",
            name: "Training",
            description: "Sharpen your edge.",
            costPerParticipantPerDay: 10,
        } as any;

        render(
            <ActivityDetailPanel
                enriched={{ definition: def, status: "available" } as any}
            />,
        );

        await user.click(
            screen.getByRole("button", { name: /LAUNCH ACTIVITY/i }),
        );

        expect(startActivity).toHaveBeenCalledWith(def.id);
    });

    it("shows CANCEL ACTIVITY for active activities and calls cancelActivity", async () => {
        const user = userEvent.setup();
        const cancelActivity = vi.fn();
        const storeState = {
            startActivity: vi.fn(),
            cancelActivity,
            assignAgentToActivity: vi.fn(),
            removeAgentFromActivity: vi.fn(),
            startActivityWithAgent: vi.fn(),
        } as any;

        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector(storeState),
        );

        const activeRecord = {
            id: "activity-1",
            activityDefinitionId: "training",
            assignedAgentIds: [],
            daysRemaining: 1,
            status: "active",
        } as any;

        const enriched = {
            record: activeRecord,
            definition: { id: "training", name: "Training" },
            assignedAgents: [],
        } as any;

        render(<ActivityDetailPanel enriched={enriched} />);

        await user.click(
            screen.getByRole("button", { name: /CANCEL ACTIVITY/i }),
        );

        expect(cancelActivity).toHaveBeenCalledWith(activeRecord.id);
    });

    it("removes assigned agents on active activities", async () => {
        const user = userEvent.setup();
        const removeAgentFromActivity = vi.fn();
        const storeState = {
            startActivity: vi.fn(),
            cancelActivity: vi.fn(),
            assignAgentToActivity: vi.fn(),
            removeAgentFromActivity,
            startActivityWithAgent: vi.fn(),
        } as any;

        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector(storeState),
        );

        const activeRecord = {
            id: "activity-1",
            activityDefinitionId: "training",
            assignedAgentIds: ["agent-1"],
            daysRemaining: 1,
            status: "active",
        } as any;

        const enriched = {
            record: activeRecord,
            definition: { id: "training", name: "Training" },
            assignedAgents: [{ id: "agent-1", name: "Agent One" }],
        } as any;

        render(
            <ActivityDetailPanel enriched={enriched} availableAgents={[]} />,
        );

        await user.click(screen.getByRole("button", { name: /REMOVE/i }));

        expect(removeAgentFromActivity).toHaveBeenCalledWith(
            activeRecord.id,
            "agent-1",
        );
    });

    it("assigns available agents to active activities", async () => {
        const user = userEvent.setup();
        const assignAgentToActivity = vi.fn();
        const storeState = {
            startActivity: vi.fn(),
            cancelActivity: vi.fn(),
            assignAgentToActivity,
            removeAgentFromActivity: vi.fn(),
            startActivityWithAgent: vi.fn(),
        } as any;

        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector(storeState),
        );

        const activeRecord = {
            id: "activity-1",
            activityDefinitionId: "training",
            assignedAgentIds: [],
            daysRemaining: 1,
            status: "active",
        } as any;

        const enriched = {
            record: activeRecord,
            definition: { id: "training", name: "Training" },
            assignedAgents: [],
        } as any;

        render(
            <ActivityDetailPanel
                enriched={enriched}
                availableAgents={[{ id: "agent-2", name: "Agent Two" } as any]}
            />,
        );

        await user.click(screen.getByRole("button", { name: /ASSIGN/i }));

        expect(assignAgentToActivity).toHaveBeenCalledWith(
            activeRecord.id,
            "agent-2",
        );
    });

    it("auto-launches and assigns when assigning from an available activity", async () => {
        const user = userEvent.setup();
        const startActivityWithAgent = vi.fn();
        const storeState = {
            startActivity: vi.fn(),
            cancelActivity: vi.fn(),
            assignAgentToActivity: vi.fn(),
            removeAgentFromActivity: vi.fn(),
            startActivityWithAgent,
        } as any;

        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector(storeState),
        );

        const def = {
            id: "training",
            name: "Training",
            description: "Sharpen your edge.",
            costPerParticipantPerDay: 10,
        } as any;

        render(
            <ActivityDetailPanel
                enriched={{ definition: def, status: "available" } as any}
                availableAgents={[{ id: "agent-2", name: "Agent Two" } as any]}
            />,
        );

        await user.click(screen.getByRole("button", { name: /ASSIGN/i }));

        expect(startActivityWithAgent).toHaveBeenCalledWith(def.id, "agent-2");
    });
});
