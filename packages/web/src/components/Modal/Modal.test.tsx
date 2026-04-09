import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Modal } from "./Modal";

function ModalHarness() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button type="button" onClick={() => setIsOpen(true)}>
                OPEN MODAL
            </button>
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Confirm Operation"
            >
                <button type="button">PRIMARY ACTION</button>
                <button type="button">SECONDARY ACTION</button>
            </Modal>
        </div>
    );
}

describe("Modal", () => {
    it("renders with dialog semantics when open", () => {
        render(
            <Modal isOpen onClose={() => {}} title="Confirm Operation">
                <div>Body copy</div>
            </Modal>,
        );

        expect(
            screen.getByRole("dialog", { name: "Confirm Operation" }),
        ).toBeInTheDocument();
        expect(screen.getByText("Body copy")).toBeInTheDocument();
    });

    it("closes on Escape", async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        render(
            <Modal isOpen onClose={onClose} title="Confirm Operation">
                <div>Body copy</div>
            </Modal>,
        );

        await user.keyboard("{Escape}");

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("closes on backdrop click", async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        render(
            <Modal isOpen onClose={onClose} title="Confirm Operation">
                <div>Body copy</div>
            </Modal>,
        );

        await user.click(screen.getByTestId("modal-backdrop"));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("traps focus inside the dialog", async () => {
        const user = userEvent.setup();

        render(<ModalHarness />);

        await user.click(screen.getByRole("button", { name: "OPEN MODAL" }));

        expect(
            screen.getByRole("button", { name: "PRIMARY ACTION" }),
        ).toHaveFocus();

        await user.tab();
        expect(
            screen.getByRole("button", { name: "SECONDARY ACTION" }),
        ).toHaveFocus();

        await user.tab();
        expect(
            screen.getByRole("button", { name: "PRIMARY ACTION" }),
        ).toHaveFocus();
    });

    it("restores focus to the trigger when it closes", async () => {
        const user = userEvent.setup();

        render(<ModalHarness />);

        const trigger = screen.getByRole("button", { name: "OPEN MODAL" });
        await user.click(trigger);
        await user.keyboard("{Escape}");

        expect(trigger).toHaveFocus();
    });
});
