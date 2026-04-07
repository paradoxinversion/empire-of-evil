import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import PlotDetailPanel from "./PlotDetailPanel";
import type {
    EnrichedAvailablePlot,
    EnrichedActivePlot,
} from "../../hooks/usePlots";

const available: EnrichedAvailablePlot = {
    definition: {
        id: "plot_1",
        name: "Sabotage Pipeline",
        description: "Sabotage enemy infrastructure",
        tier: 2,
        category: "Sabotage",
        requirements: { agentCount: 2, researchIds: ["r1"] },
        durationDays: 6,
        stages: [
            { name: "Infiltrate", durationDays: 2 },
            { name: "Damage", durationDays: 4 },
        ],
    },
    status: "available",
};

const active: EnrichedActivePlot = {
    record: {
        id: "active_1",
        plotDefinitionId: "plot_1",
        currentStageIndex: 0,
        assignedAgentIds: ["p1"],
        targetZoneId: "zone_1",
        daysRemaining: 3,
        accumulatedSuccessScore: 1,
        status: "active",
    },
    definition: available.definition,
    assignedAgents: [
        {
            id: "p1",
            name: "Agent One",
            zoneId: "zone_1",
            homeZoneId: "zone_1",
            governingOrganizationId: "org_1",
            attributes: {},
            skills: { science: 3, stealth: 2 },
            loyalties: {},
            intelLevel: 1,
            health: 100,
            money: 0,
            activeEffectIds: [],
            dead: false,
            agentStatus: { job: "operative", salary: 0 },
        } as any,
    ],
    progressPct: 20,
    targetLabel: "Zone One",
};

const meta: Meta<typeof PlotDetailPanel> = {
    title: "Screens/Plots/PlotDetailPanel",
    component: PlotDetailPanel,
};

export default meta;

type Story = StoryObj<typeof PlotDetailPanel>;

export const AvailablePlot: Story = {
    args: {
        enriched: available,
        availableAgents: [],
        unlockedResearchIds: [],
    },
};

export const ActivePlot: Story = {
    args: {
        enriched: active,
        availableAgents: [],
        unlockedResearchIds: ["r1"],
    },
};
