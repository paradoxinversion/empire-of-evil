import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type TooltipVariant = "short" | "rich";

interface TooltipProps {
    children: ReactNode;
    content: ReactNode;
    delayMs?: number;
    variant?: TooltipVariant;
    richTitle?: string;
}

export function Tooltip({
    children,
    content,
    delayMs = 300,
    variant = "short",
    richTitle,
}: TooltipProps) {
    const [isOpen, setIsOpen] = useState(false);
    const openTimerRef = useRef<number | null>(null);

    const clearOpenTimer = () => {
        if (openTimerRef.current !== null) {
            window.clearTimeout(openTimerRef.current);
            openTimerRef.current = null;
        }
    };

    const scheduleOpen = () => {
        clearOpenTimer();
        openTimerRef.current = window.setTimeout(() => {
            setIsOpen(true);
        }, delayMs);
    };

    const closeTooltip = () => {
        clearOpenTimer();
        setIsOpen(false);
    };

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    useEffect(
        () => () => {
            clearOpenTimer();
        },
        [],
    );

    return (
        <span
            className="relative inline-flex"
            onMouseEnter={scheduleOpen}
            onMouseLeave={closeTooltip}
            onFocus={scheduleOpen}
            onBlur={closeTooltip}
        >
            {children}
            {isOpen ? (
                <span
                    role="tooltip"
                    className={`absolute left-1/2 top-full z-40 mt-2 w-max max-w-[280px] -translate-x-1/2 rounded-sm border border-border-default bg-bg-surface px-2 py-1 text-left text-[10px] text-text-secondary shadow-[0_10px_40px_rgba(0,0,0,0.35)] ${
                        variant === "rich" ? "min-w-[220px] px-3 py-2" : ""
                    }`}
                >
                    {variant === "rich" && richTitle ? (
                        <div className="mb-1 font-mono text-[10px] tracking-widest text-text-primary">
                            {richTitle}
                        </div>
                    ) : null}
                    <div>{content}</div>
                </span>
            ) : null}
        </span>
    );
}
