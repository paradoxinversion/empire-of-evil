import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ZoneSelector } from "./ZoneSelector";

const zones = [
    {
        id: "zone-1",
        name: "Albion Central",
        nationName: "Albion",
        controllingOrgName: "Ministry of Civic Order",
        intelLevel: 45,
    },
    {
        id: "zone-2",
        name: "Carpathia Fringe",
        nationName: "Carpathia",
        controllingOrgName: "Frontier Directorate",
        intelLevel: 12,
    },
] as const;

describe("ZoneSelector", () => {
    it("renders zone details and updates selection", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <ZoneSelector
                zones={zones as any}
                selectedZoneId={null}
                onChange={onChange}
            />,
        );

        await user.selectOptions(
            screen.getByLabelText("Target zone"),
            "zone-1",
        );

        expect(onChange).toHaveBeenCalledWith("zone-1");
    });

    it("shows the low-intel warning for uncertain target zones", () => {
        render(
            <ZoneSelector
                zones={zones as any}
                selectedZoneId="zone-2"
                onChange={() => {}}
            />,
        );

        expect(screen.getByText(/Intel level LOW/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Carpathia Fringe/i)).toHaveLength(2);
        expect(screen.getByText(/Frontier Directorate/i)).toBeInTheDocument();
    });

    it("shows intel guidance in a tooltip", () => {
        vi.useFakeTimers();

        render(
            <ZoneSelector
                zones={zones as any}
                selectedZoneId="zone-1"
                onChange={() => {}}
            />,
        );

        fireEvent.mouseOver(screen.getByLabelText("Intel help"));
        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(
            screen.getByRole("tooltip", {
                name: /Intel level reflects confidence/i,
            }),
        ).toBeInTheDocument();

        vi.useRealTimers();
    });
});
