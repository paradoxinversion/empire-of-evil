import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, vi } from "vitest";
import { ResearchDetailPanel } from "./ResearchDetailPanel";
import { useGameStore } from "../../store/gameStore";

vi.mock("../../store/gameStore");

afterEach(() => {
    vi.useRealTimers();
});

describe("ResearchDetailPanel", () => {
    it("assigns scientists through the shared picker", async () => {
        const user = userEvent.setup();
        const assignAgentToResearch = vi.fn();
        const removeAgentFromResearch = vi.fn();
        const cancelResearch = vi.fn();
        const startResearch = vi.fn();

        const storeState = {
            assignAgentToResearch,
            removeAgentFromResearch,
            cancelResearch,
            startResearch,
        } as any;

        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector(storeState),
        );

        const assignedScientist = {
            id: "p1",
            name: "Scientist One",
            zoneId: "zone_1",
            agentStatus: { job: "scientist" },
            skills: { research: 55 },
            loyalties: {},
            attributes: {},
            health: 100,
        } as any;
        const availableScientist = {
            id: "p2",
            name: "Scientist Two",
            zoneId: "zone_2",
            agentStatus: { job: "scientist" },
            skills: { research: 81 },
            loyalties: {},
            attributes: {},
            health: 100,
        } as any;

        const project = {
            definition: {
                id: "research-1",
                name: "Orbital Mirror Arrays",
                branch: "materials-engineering",
                description:
                    "Increase thermal leverage over contested regions.",
                cost: 12000,
                completionDays: 18,
                scienceRequired: 240,
                skillDrivers: ["research"],
                prerequisites: [],
                unlocks: {
                    researchIds: [],
                    plotIds: [],
                    activityIds: [],
                    effectIds: [],
                },
            },
            status: "active",
            activeRecord: {
                id: "active-research-1",
                projectId: "research-1",
                assignedAgentIds: ["p1"],
                daysRemaining: 8,
                accumulatedScore: 120,
            },
            progressPct: 50,
            daysRemaining: 8,
            assignedAgents: [assignedScientist],
        } as any;

        render(
            <ResearchDetailPanel
                ep={project}
                availableScientists={[availableScientist]}
                allProjects={[project]}
            />,
        );

        expect(screen.getByText(/Scientist One/i)).toBeInTheDocument();

        await user.click(
            screen.getByRole("button", { name: /ADD SCIENTISTS/i }),
        );

        expect(
            screen.getByRole("dialog", { name: /ADD SCIENTISTS/i }),
        ).toBeInTheDocument();

        await user.click(
            screen.getByRole("button", { name: /Scientist Two/i }),
        );
        await user.click(
            screen.getByRole("button", { name: /ASSIGN 1 AGENT/i }),
        );

        expect(assignAgentToResearch).toHaveBeenCalledWith(
            "active-research-1",
            "p2",
        );
    });

    it("shows progress guidance in a tooltip", () => {
        vi.useFakeTimers();

        const assignAgentToResearch = vi.fn();
        const removeAgentFromResearch = vi.fn();
        const cancelResearch = vi.fn();
        const startResearch = vi.fn();

        const storeState = {
            assignAgentToResearch,
            removeAgentFromResearch,
            cancelResearch,
            startResearch,
        } as any;

        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector(storeState),
        );

        const project = {
            definition: {
                id: "research-1",
                name: "Orbital Mirror Arrays",
                branch: "materials-engineering",
                description:
                    "Increase thermal leverage over contested regions.",
                cost: 12000,
                completionDays: 18,
                scienceRequired: 240,
                skillDrivers: ["research"],
                prerequisites: [],
                unlocks: {
                    researchIds: [],
                    plotIds: [],
                    activityIds: [],
                    effectIds: [],
                },
            },
            status: "active",
            activeRecord: {
                id: "active-research-1",
                projectId: "research-1",
                assignedAgentIds: [],
                daysRemaining: 8,
                accumulatedScore: 120,
            },
            progressPct: 50,
            daysRemaining: 8,
            assignedAgents: [],
        } as any;

        render(
            <ResearchDetailPanel
                ep={project}
                availableScientists={[]}
                allProjects={[project]}
            />,
        );

        fireEvent.mouseOver(screen.getByLabelText("Research progress help"));
        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(
            screen.getByRole("tooltip", {
                name: /Progress is driven by assigned scientists/i,
            }),
        ).toBeInTheDocument();
    });
});
