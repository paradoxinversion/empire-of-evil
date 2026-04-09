import type { Meta, StoryObj } from "@storybook/react";
import { ConfirmationModal } from "./ConfirmationModal";

const meta: Meta<typeof ConfirmationModal> = {
    title: "Components/ConfirmationModal",
    component: ConfirmationModal,
    parameters: { layout: "fullscreen" },
    args: {
        isOpen: true,
        onClose: () => {},
        onConfirm: () => {},
    },
};

export default meta;

type Story = StoryObj<typeof ConfirmationModal>;

export const Destructive: Story = {
    args: {
        title: "TERMINATE AGENT",
        description:
            "You are about to TERMINATE Agent Alpha. This is permanent.",
        consequenceSummary:
            "Agent Alpha will be removed from the roster immediately.",
        confirmLabel: "CONFIRM TERMINATION",
        confirmVariant: "destructive",
        preventEnterConfirm: true,
    },
};

export const Standard: Story = {
    args: {
        title: "ABANDON RESEARCH",
        description: "You are about to stop the current research project.",
        consequenceSummary:
            "All accumulated research progress on this project will be lost.",
        confirmLabel: "CONFIRM",
        confirmVariant: "primary",
    },
};
