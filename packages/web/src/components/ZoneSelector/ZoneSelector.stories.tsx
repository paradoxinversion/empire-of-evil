import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ZoneSelector } from "./ZoneSelector";

const zones = [
    {
        id: "zone-1",
        name: "Albion Central",
        nationName: "Albion",
        controllingOrgName: "Civic Directorate",
        intelLevel: 48,
    },
    {
        id: "zone-2",
        name: "Carpathia Fringe",
        nationName: "Carpathia",
        controllingOrgName: "Frontier Bureau",
        intelLevel: 12,
    },
];

const meta: Meta<typeof ZoneSelector> = {
    title: "Components/ZoneSelector",
    component: ZoneSelector,
    parameters: { layout: "padded" },
};

export default meta;

type Story = StoryObj<typeof ZoneSelector>;

export const Default: Story = {
    render: () => {
        const [selectedZoneId, setSelectedZoneId] = useState<string | null>(
            null,
        );

        return (
            <div className="max-w-md bg-bg-surface p-4">
                <ZoneSelector
                    zones={zones}
                    selectedZoneId={selectedZoneId}
                    onChange={setSelectedZoneId}
                />
            </div>
        );
    },
};

export const LowIntelSelected: Story = {
    args: {
        zones,
        selectedZoneId: "zone-2",
        onChange: () => {},
    },
};
