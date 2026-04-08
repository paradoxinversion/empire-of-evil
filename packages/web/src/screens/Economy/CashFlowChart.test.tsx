import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach } from "vitest";
import { CashFlowChart } from "./CashFlowChart";

afterEach(() => {
    vi.useRealTimers();
});

describe("CashFlowChart", () => {
    it("shows projection guidance in a tooltip", () => {
        vi.useFakeTimers();

        render(<CashFlowChart currentFunds={1500} netDaily={-50} />);

        fireEvent.mouseOver(screen.getByLabelText("Projection help"));
        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(
            screen.getByRole("tooltip", {
                name: /Projection extends current funds using net daily cash flow/i,
            }),
        ).toBeInTheDocument();
    });

    it("shows insolvency warning guidance in a tooltip", () => {
        vi.useFakeTimers();

        render(<CashFlowChart currentFunds={1500} netDaily={-50} />);

        fireEvent.mouseOver(screen.getByLabelText("Insolvency warning help"));
        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(
            screen.getByRole("tooltip", {
                name: /Projected insolvency day assumes net daily stays constant/i,
            }),
        ).toBeInTheDocument();
    });
});
