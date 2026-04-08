import { act, fireEvent, render, screen } from "@testing-library/react";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
    it("shows after the 300ms hover delay", () => {
        vi.useFakeTimers();

        render(
            <Tooltip content="Intel values may be stale." delayMs={300}>
                <button type="button">HOVER TARGET</button>
            </Tooltip>,
        );

        fireEvent.mouseOver(
            screen.getByRole("button", { name: "HOVER TARGET" }),
        );

        expect(
            screen.queryByRole("tooltip", {
                name: /Intel values may be stale/i,
            }),
        ).not.toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(
            screen.getByRole("tooltip", { name: /Intel values may be stale/i }),
        ).toBeInTheDocument();

        vi.useRealTimers();
    });

    it("dismisses when Escape is pressed", () => {
        vi.useFakeTimers();

        render(
            <Tooltip content="Intel values may be stale." delayMs={300}>
                <button type="button">HOVER TARGET</button>
            </Tooltip>,
        );

        fireEvent.mouseOver(
            screen.getByRole("button", { name: "HOVER TARGET" }),
        );
        act(() => {
            vi.advanceTimersByTime(300);
        });
        expect(screen.getByRole("tooltip")).toBeInTheDocument();

        fireEvent.keyDown(window, { key: "Escape" });

        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

        vi.useRealTimers();
    });

    it("renders the rich variant structure", () => {
        vi.useFakeTimers();

        render(
            <Tooltip
                delayMs={300}
                variant="rich"
                richTitle="INTEL CONFIDENCE"
                content="Low intel means attribute values are estimated."
            >
                <button type="button">RICH TARGET</button>
            </Tooltip>,
        );

        fireEvent.mouseOver(
            screen.getByRole("button", { name: "RICH TARGET" }),
        );
        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(screen.getByText("INTEL CONFIDENCE")).toBeInTheDocument();
        expect(
            screen.getByText("Low intel means attribute values are estimated."),
        ).toBeInTheDocument();

        vi.useRealTimers();
    });
});
