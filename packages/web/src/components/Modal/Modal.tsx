import type { KeyboardEvent, MouseEvent, ReactNode, RefObject } from "react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE_SELECTOR = [
    "button:not([disabled])",
    "[href]",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
].join(", ");

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
    if (!container) {
        return [];
    }

    return Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter(
        (element) =>
            !element.hasAttribute("disabled") &&
            element.getAttribute("aria-hidden") !== "true",
    );
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    description?: string;
    footer?: ReactNode;
    role?: "dialog" | "alertdialog";
    closeOnBackdropClick?: boolean;
    closeOnEscape?: boolean;
    initialFocusRef?: RefObject<HTMLElement>;
    className?: string;
    backdropClassName?: string;
    preventEnterDefault?: boolean;
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    description,
    footer,
    role = "dialog",
    closeOnBackdropClick = true,
    closeOnEscape = true,
    initialFocusRef,
    className = "",
    backdropClassName = "",
    preventEnterDefault = false,
}: ModalProps) {
    const titleId = useId();
    const descriptionId = useId();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const previousActiveElement =
            document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;

        const focusTarget =
            initialFocusRef?.current ??
            getFocusableElements(containerRef.current)[0] ??
            containerRef.current;
        focusTarget?.focus();

        return () => {
            previousActiveElement?.focus();
        };
    }, [initialFocusRef, isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
        if (!closeOnBackdropClick) {
            return;
        }

        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (preventEnterDefault && event.key === "Enter") {
            event.preventDefault();
            return;
        }

        if (event.key === "Escape" && closeOnEscape) {
            event.preventDefault();
            onClose();
            return;
        }

        if (event.key !== "Tab") {
            return;
        }

        const focusableElements = getFocusableElements(containerRef.current);

        if (focusableElements.length === 0) {
            event.preventDefault();
            containerRef.current?.focus();
            return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement;

        if (event.shiftKey && activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        }

        if (!event.shiftKey && activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    };

    return createPortal(
        <div
            data-testid="modal-backdrop"
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/72 px-4 ${backdropClassName}`}
            onClick={handleBackdropClick}
        >
            <div
                ref={containerRef}
                role={role}
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={description ? descriptionId : undefined}
                tabIndex={-1}
                onKeyDown={handleKeyDown}
                className={`w-full max-w-140 rounded-sm border border-border-default bg-bg-surface p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] outline-none ${className}`}
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h2
                            id={titleId}
                            className="font-mono text-[14px] tracking-[0.08em] text-text-primary"
                        >
                            {title}
                        </h2>
                        {description ? (
                            <p
                                id={descriptionId}
                                className="text-[12px] leading-5 text-text-secondary"
                            >
                                {description}
                            </p>
                        ) : null}
                    </div>
                    <div>{children}</div>
                    {footer ? (
                        <div className="flex items-center justify-end gap-2">
                            {footer}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>,
        document.body,
    );
}
