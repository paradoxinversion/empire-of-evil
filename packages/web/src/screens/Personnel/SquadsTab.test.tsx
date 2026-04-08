import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { SquadsTab } from "./SquadsTab";
import { useGameState } from "../../hooks/useGameState";
import { useGameStore } from "../../store/gameStore";

vi.mock("../../hooks/useGameState");
vi.mock("../../store/gameStore");

describe("SquadsTab", () => {
    it("creates a squad from the squads tab controls", async () => {
        const user = userEvent.setup();
        const createSquad = vi.fn();

        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector({ createSquad }),
        );

        vi.mocked(useGameState).mockReturnValue({
            persons: {},
            squads: {},
            zones: {},
        } as any);

        render(<SquadsTab onSelectPerson={() => {}} selectedPersonId={null} />);

        await user.type(screen.getByLabelText(/new squad name/i), "Red Choir");
        await user.click(screen.getByRole("button", { name: /create squad/i }));

        expect(createSquad).toHaveBeenCalledWith("Red Choir");
    });

    it("disbands the selected squad via destructive action", async () => {
        const user = userEvent.setup();
        const disbandSquad = vi.fn();

        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector({ disbandSquad }),
        );

        vi.mocked(useGameState).mockReturnValue({
            persons: {},
            zones: {},
            squads: {
                s1: {
                    id: "s1",
                    name: "Night Shift",
                    memberIds: [],
                },
            },
        } as any);

        render(<SquadsTab onSelectPerson={() => {}} selectedPersonId={null} />);

        await user.click(screen.getByText("Night Shift"));
        await user.click(screen.getByRole("button", { name: /disband squad/i }));

        expect(disbandSquad).toHaveBeenCalledWith("s1");
    });
});
