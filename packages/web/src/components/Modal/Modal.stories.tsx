import type { Meta, StoryObj } from "@storybook/react";
import { ActionButton } from "../ActionButton/ActionButton";
import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = {
    title: "Components/Modal",
    component: Modal,
    parameters: { layout: "fullscreen" },
    args: {
        isOpen: true,
        onClose: () => {},
        title: "CONFIRM OPERATION",
        description: "Review the action details before proceeding.",
        children: (
            <div className="space-y-2 text-[12px] text-text-secondary">
                <p>Mechanical consequences are summarized here.</p>
                <p>
                    This base primitive is used by confirmation and picker
                    flows.
                </p>
            </div>
        ),
        footer: (
            <>
                <ActionButton variant="default" onClick={() => {}}>
                    CANCEL
                </ActionButton>
                <ActionButton variant="primary" onClick={() => {}}>
                    CONTINUE
                </ActionButton>
            </>
        ),
    },
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {};

export const AlertDialog: Story = {
    args: {
        role: "alertdialog",
        title: "THRESHOLD ALERT",
        description: "The empire has crossed a monitored risk boundary.",
        footer: (
            <>
                <ActionButton variant="default" onClick={() => {}}>
                    ACKNOWLEDGE
                </ActionButton>
                <ActionButton variant="destructive" onClick={() => {}}>
                    ESCALATE RESPONSE
                </ActionButton>
            </>
        ),
    },
};
