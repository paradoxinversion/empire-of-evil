import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmationModal } from "./ConfirmationModal";

describe("ConfirmationModal", () => {
    it("renders destructive copy and buttons", () => {
        render(
            <ConfirmationModal
                isOpen
                onClose={() => {}}
                onConfirm={() => {}}
                title="TERMINATE AGENT"
                description="You are about to TERMINATE Agent Alpha. This is permanent."
                consequenceSummary="Agent Alpha will be removed from the roster immediately."
                confirmLabel="CONFIRM TERMINATION"
                confirmVariant="destructive"
            />,
        );

        expect(
            screen.getByRole("alertdialog", { name: "TERMINATE AGENT" }),
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "You are about to TERMINATE Agent Alpha. This is permanent.",
            ),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "CANCEL" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "CONFIRM TERMINATION" }),
        ).toBeInTheDocument();
    });

    it("calls onConfirm when the confirm button is clicked", async () => {
        const user = userEvent.setup();
        const onConfirm = vi.fn();

        render(
            <ConfirmationModal
                isOpen
                onClose={() => {}}
                onConfirm={onConfirm}
                title="TERMINATE AGENT"
                description="You are about to TERMINATE Agent Alpha. This is permanent."
                consequenceSummary="Agent Alpha will be removed from the roster immediately."
                confirmLabel="CONFIRM TERMINATION"
                confirmVariant="destructive"
            />,
        );

        await user.click(
            screen.getByRole("button", { name: "CONFIRM TERMINATION" }),
        );

        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it("does not confirm destructive actions when Enter is pressed", async () => {
        const user = userEvent.setup();
        const onConfirm = vi.fn();

        render(
            <ConfirmationModal
                isOpen
                onClose={() => {}}
                onConfirm={onConfirm}
                title="TERMINATE AGENT"
                description="You are about to TERMINATE Agent Alpha. This is permanent."
                consequenceSummary="Agent Alpha will be removed from the roster immediately."
                confirmLabel="CONFIRM TERMINATION"
                confirmVariant="destructive"
                preventEnterConfirm
            />,
        );

        await user.keyboard("{Enter}");

        expect(onConfirm).not.toHaveBeenCalled();
    });
});
