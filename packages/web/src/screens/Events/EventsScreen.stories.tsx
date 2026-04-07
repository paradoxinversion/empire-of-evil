import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import EventsScreen from "./index";

const meta: Meta<typeof EventsScreen> = {
    title: "Screens/Events/EventsScreen",
    component: EventsScreen,
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof EventsScreen>;

export const Default: Story = {};
