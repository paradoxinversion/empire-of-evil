import { render, screen } from "@testing-library/react";
import PlotsList from "./PlotsList";

describe("PlotsList", () => {
    it("renders a placeholder when there are no plots", () => {
        render(
            (
                <PlotsList
                    tab="available"
                    availablePlots={[]}
                    activePlots={[]}
                />
            ) as any,
        );
        expect(screen.getByText(/No plots available\./i)).toBeInTheDocument();
    });
});
