import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import PlotsList from "./PlotsList";
import type {
    EnrichedAvailablePlot,
    EnrichedActivePlot,
} from "../../hooks/usePlots";

const sampleAvailable: EnrichedAvailablePlot[] = [
    {
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
    },
    {
        definition: {
            id: "plot_2",
            name: "Recruit Spy",
            description: "Recruit a local operative",
            tier: 1,
            category: "Espionage",
            requirements: { agentCount: 1, researchIds: [] },
            durationDays: 3,
            stages: [{ name: "Recruit", durationDays: 3 }],
        },
        status: "locked",
        lockedReason: "research",
    },
];

const sampleActive: EnrichedActivePlot[] = [
    {
        record: {
            id: "active_1",
            plotDefinitionId: "plot_1",
            currentStageIndex: 0,
            assignedAgentIds: ["p1", "p2"],
            targetZoneId: "zone_1",
            daysRemaining: 4,
            accumulatedSuccessScore: 2,
            status: "active",
        },
        definition: sampleAvailable[0].definition,
        assignedAgents: [
            {
                id: "p1",
                name: "Agent One",
                zoneId: "zone_1",
                homeZoneId: "zone_1",
                governingOrganizationId: "org_1",
                attributes: {},
                skills: {},
                loyalties: {},
                intelLevel: 1,
                health: 100,
                money: 0,
                activeEffectIds: [],
                dead: false,
                agentStatus: { job: "operative", salary: 0 },
            } as any,
            {
                id: "p2",
                name: "Agent Two",
                zoneId: "zone_1",
                homeZoneId: "zone_1",
                governingOrganizationId: "org_1",
                attributes: {},
                skills: {},
                loyalties: {},
                intelLevel: 1,
                health: 100,
                money: 0,
                activeEffectIds: [],
                dead: false,
                agentStatus: { job: "operative", salary: 0 },
            } as any,
        ],
        progressPct: 25,
        targetLabel: "Zone One",
    },
];

const meta: Meta<typeof PlotsList> = {
    title: "Screens/Plots/PlotsList",
    component: PlotsList,
};

export default meta;

type Story = StoryObj<typeof PlotsList>;

export const Available: Story = {
    args: {
        tab: "available",
        availablePlots: sampleAvailable,
        activePlots: [],
        selectedPlotId: null,
    },
};

export const Active: Story = {
    args: {
        tab: "active",
        availablePlots: [],
        activePlots: sampleActive,
        selectedPlotId: "active_1",
    },
};
