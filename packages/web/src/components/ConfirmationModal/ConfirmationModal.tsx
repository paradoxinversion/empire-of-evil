import { useRef } from "react";
import { ActionButton } from "../ActionButton/ActionButton";
import type { ButtonVariant } from "../ActionButton/ActionButton";
import { Modal } from "../Modal/Modal";

export interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    consequenceSummary?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmVariant?: ButtonVariant;
    preventEnterConfirm?: boolean;
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    consequenceSummary,
    confirmLabel = "CONFIRM",
    cancelLabel = "CANCEL",
    confirmVariant = "primary",
    preventEnterConfirm = false,
}: ConfirmationModalProps) {
    const cancelButtonRef = useRef<HTMLButtonElement>(null);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            description={description}
            role="alertdialog"
            initialFocusRef={cancelButtonRef}
            preventEnterDefault={preventEnterConfirm}
            className={
                confirmVariant === "destructive"
                    ? "border-accent-red-muted"
                    : ""
            }
            footer={
                <>
                    <button
                        ref={cancelButtonRef}
                        type="button"
                        onClick={onClose}
                        className="font-mono text-[11px] tracking-[0.08em] px-3 py-1.5 rounded-sm border border-border-default bg-bg-elevated text-text-primary transition-colors duration-fast hover:bg-bg-hover hover:border-border-strong"
                    >
                        {cancelLabel}
                    </button>
                    <ActionButton variant={confirmVariant} onClick={onConfirm}>
                        {confirmLabel}
                    </ActionButton>
                </>
            }
        >
            {consequenceSummary ? (
                <div className="border border-border-subtle bg-bg-elevated px-3 py-2 font-mono text-[11px] leading-5 text-text-secondary">
                    {consequenceSummary}
                </div>
            ) : null}
        </Modal>
    );
}
