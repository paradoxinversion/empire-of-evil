import type { Meta, StoryObj } from "@storybook/react";
import { DataLine } from "./DataLine";

const meta: Meta<typeof DataLine> = {
    title: "Components/DataLine",
    component: DataLine,
    parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof DataLine>;

export const Intel: Story = {
    args: { label: "Day", value: "47" },
};
