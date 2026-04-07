import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import EventDetailPanel from "./EventDetailPanel";

const aar = {
    id: "aar-1",
    subject: "Operation Nightfall",
    date: "DAY 46 — 13 MARCH, YEAR 1",
    status: "SUCCESS",
    executiveSummary:
        "Operation Nightfall secured the objective with minimal collateral.",
    operationalLog: [
        "Deploy squad",
        "Engage enemy",
        "Secure objective",
        "Exfiltrate to base",
    ],
    personnelReport: [
        {
            name: "Agent K",
            role: "Operative",
            status: "Injured",
            notes: "Shrapnel wound to left arm",
        },
    ],
    resourceEffects: ["+ $1,200", "+ EVIL: +4"],
} as const;

const meta: Meta<typeof EventDetailPanel> = {
    title: "Screens/Events/EventDetailPanel",
    component: EventDetailPanel,
};

export default meta;
type Story = StoryObj<typeof EventDetailPanel>;

export const SimpleEvent: Story = {
    args: {
        enriched: {
            id: "feed-1",
            day: 50,
            date: "17 MARCH, YEAR 1",
            type: "internal",
            title: "Empire Established",
            text: "The empire has been formally established. A short ceremony took place at the central command.",
            mechanics: ["+ $500", "+ EVIL: +2"],
        },
    },
};

export const AfterActionReport: Story = {
    args: {
        enriched: {
            id: aar.id,
            day: 46,
            date: aar.date,
            type: "landmark",
            title: aar.subject,
            text: aar.executiveSummary,
            isAAR: true,
            aar,
        },
    },
};
