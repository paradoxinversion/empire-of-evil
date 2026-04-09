import { useEffect, useRef } from "react";

import { ActionButton } from "../ActionButton/ActionButton";
import { Modal } from "../Modal/Modal";
import { useGameStore } from "../../store/gameStore";

export function InterruptQueueModal() {
    const status = useGameStore((s) => s.status);
    const activeInterrupts = useGameStore((s) => s.activeInterrupts) ?? [];
    const resolveEvent =
        useGameStore((s) => s.resolveEvent) ??
        (() => {
            // no-op fallback for partial store mocks in tests
        });
    const resumeAfterInterrupt =
        useGameStore((s) => s.resumeAfterInterrupt) ??
        (() => {
            // no-op fallback for partial store mocks in tests
        });

    const event = activeInterrupts[0];
    const acknowledgeRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (status === "interrupted" && activeInterrupts.length === 0) {
            resumeAfterInterrupt();
        }
    }, [activeInterrupts.length, resumeAfterInterrupt, status]);

    if (status !== "interrupted" || !event) {
        return null;
    }

    const hasChoices = !!event.choices && event.choices.length > 0;

    return (
        <Modal
            isOpen
            onClose={() => {}}
            title={event.title}
            description={event.body}
            role="alertdialog"
            closeOnBackdropClick={false}
            closeOnEscape={false}
            initialFocusRef={acknowledgeRef}
            footer={
                hasChoices ? (
                    <>
                        {event.choices?.map((choice, choiceIndex) => (
                            <ActionButton
                                key={`${event.id}-${choice.label}-${choiceIndex}`}
                                variant="primary"
                                onClick={() => {
                                    resolveEvent(event.id, choiceIndex);
                                }}
                            >
                                {choice.label}
                            </ActionButton>
                        ))}
                    </>
                ) : (
                    <button
                        ref={acknowledgeRef}
                        type="button"
                        onClick={() => {
                            resolveEvent(event.id);
                        }}
                        className="font-mono text-[11px] tracking-[0.08em] px-3 py-1.5 rounded-sm border border-border-default bg-bg-elevated text-text-primary transition-colors duration-fast hover:bg-bg-hover hover:border-border-strong"
                    >
                        Acknowledge
                    </button>
                )
            }
        >
            <div className="font-mono text-[11px] text-text-muted uppercase tracking-[0.08em]">
                Day {event.createdOnDate}
            </div>
        </Modal>
    );
}

export default InterruptQueueModal;
