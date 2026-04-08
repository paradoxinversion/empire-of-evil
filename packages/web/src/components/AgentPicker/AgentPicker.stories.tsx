import type { Meta, StoryObj } from "@storybook/react";
import { AgentPicker } from "./AgentPicker";

const agents = [
    {
        id: "agent-1",
        name: "Agent Alpha",
        zoneId: "zone-albion",
        agentStatus: { job: "scientist" },
        skills: { research: 84, stealth: 18 },
        loyalties: { empire: 78 },
        attributes: { intellect: 88 },
        health: 100,
    },
    {
        id: "agent-2",
        name: "Agent Beta",
        zoneId: "zone-carpathia",
        agentStatus: { job: "operative" },
        skills: { research: 26, stealth: 81 },
        loyalties: { empire: 63 },
        attributes: { cunning: 79 },
        health: 100,
    },
    {
        id: "agent-3",
        name: "Agent Gamma",
        zoneId: "zone-albion",
        agentStatus: { job: "scientist" },
        skills: { research: 91, stealth: 9 },
        loyalties: { empire: 71 },
        attributes: { intellect: 94 },
        health: 100,
    },
] as any;

const meta: Meta<typeof AgentPicker> = {
    title: "Components/AgentPicker",
    component: AgentPicker,
    parameters: { layout: "fullscreen" },
    args: {
        isOpen: true,
        onClose: () => {},
        onConfirm: () => {},
        agents,
    },
};

export default meta;

type Story = StoryObj<typeof AgentPicker>;

export const Default: Story = {};

export const ResearchAssignment: Story = {
    args: {
        title: "ADD SCIENTISTS",
        relevantSkillKey: "research",
        getLocationLabel: (person) =>
            person.zoneId === "zone-albion" ? "ALBION" : "CARPATHIA",
    },
};
