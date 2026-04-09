import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { InterruptQueueModal } from "./InterruptQueueModal";
import { useGameStore } from "../../store/gameStore";

vi.mock("../../store/gameStore");

describe("InterruptQueueModal", () => {
    it("renders first interrupt event and resolves selected choice", async () => {
        const user = userEvent.setup();
        const resolveEvent = vi.fn();

        const storeState = {
            status: "interrupted",
            activeInterrupts: [
                {
                    id: "event-1",
                    category: "player_choice",
                    title: "Citizen Recruited",
                    body: "A citizen has been flagged as a potential recruit.",
                    relatedEntityIds: [],
                    requiresResolution: true,
                    createdOnDate: 3,
                    choices: [
                        {
                            label: "Recruit",
                            effects: [],
                        },
                        {
                            label: "Ignore",
                            effects: [],
                        },
                    ],
                },
            ],
            resolveEvent,
            resumeAfterInterrupt: vi.fn(),
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector(storeState),
        );

        render(<InterruptQueueModal />);

        expect(
            screen.getByRole("alertdialog", { name: "Citizen Recruited" }),
        ).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Recruit" }));

        expect(resolveEvent).toHaveBeenCalledWith("event-1", 0);
    });

    it("renders acknowledge action for non-choice events", async () => {
        const user = userEvent.setup();
        const resolveEvent = vi.fn();

        const storeState = {
            status: "interrupted",
            activeInterrupts: [
                {
                    id: "event-2",
                    category: "informational",
                    title: "Raid",
                    body: "A hostile force has entered empire territory.",
                    relatedEntityIds: [],
                    requiresResolution: true,
                    createdOnDate: 4,
                },
            ],
            resolveEvent,
            resumeAfterInterrupt: vi.fn(),
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector(storeState),
        );

        render(<InterruptQueueModal />);

        await user.click(screen.getByRole("button", { name: "Acknowledge" }));

        expect(resolveEvent).toHaveBeenCalledWith("event-2");
    });
});
