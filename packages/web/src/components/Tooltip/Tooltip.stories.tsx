import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
    title: "Components/Tooltip",
    component: Tooltip,
    parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Short: Story = {
    args: {
        content: "Intel values may be stale.",
        children: <button type="button">HOVER</button>,
    },
};

export const Rich: Story = {
    args: {
        variant: "rich",
        richTitle: "INTEL CONFIDENCE",
        content: "Low intel means attribute values are estimated.",
        children: <button type="button">HOVER</button>,
    },
};
