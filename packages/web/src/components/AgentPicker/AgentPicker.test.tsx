import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AgentPicker } from "./AgentPicker";

const agents = [
    {
        id: "agent-1",
        name: "Agent Alpha",
        zoneId: "zone-1",
        agentStatus: { job: "scientist" },
        loyalties: { empire: 82 },
        skills: { research: 72, stealth: 30 },
        attributes: { intellect: 80 },
        health: 100,
    },
    {
        id: "agent-2",
        name: "Agent Beta",
        zoneId: "zone-2",
        agentStatus: { job: "operative" },
        loyalties: { empire: 61 },
        skills: { research: 32, stealth: 78 },
        attributes: { cunning: 77 },
        health: 100,
    },
    {
        id: "agent-3",
        name: "Agent Gamma",
        zoneId: "zone-1",
        agentStatus: { job: "scientist" },
        loyalties: { empire: 74 },
        skills: { research: 90, stealth: 12 },
        attributes: { intellect: 92 },
        health: 100,
    },
] as any;

describe("AgentPicker", () => {
    it("renders as a modal and confirms the selected agents", async () => {
        const user = userEvent.setup();
        const onConfirm = vi.fn();

        render(
            <AgentPicker
                isOpen
                onClose={() => {}}
                onConfirm={onConfirm}
                agents={agents}
                relevantSkillKey="research"
                getLocationLabel={(person) =>
                    person.zoneId === "zone-1" ? "ALBION" : "CARPATHIA"
                }
            />,
        );

        expect(
            screen.getByRole("dialog", { name: "ADD AGENTS" }),
        ).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /Agent Alpha/i }));
        await user.click(screen.getByRole("button", { name: /Agent Gamma/i }));
        await user.click(
            screen.getByRole("button", { name: "ASSIGN 2 AGENTS" }),
        );

        expect(onConfirm).toHaveBeenCalledWith(["agent-1", "agent-3"]);
    });

    it("filters by text and department", async () => {
        const user = userEvent.setup();

        render(
            <AgentPicker
                isOpen
                onClose={() => {}}
                onConfirm={() => {}}
                agents={agents}
            />,
        );

        await user.type(
            screen.getByPlaceholderText("SEARCH AGENTS..."),
            "Gamma",
        );

        expect(
            screen.getByRole("button", { name: /Agent Gamma/i }),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /Agent Alpha/i }),
        ).not.toBeInTheDocument();

        await user.clear(screen.getByPlaceholderText("SEARCH AGENTS..."));
        await user.selectOptions(
            screen.getByLabelText("Department"),
            "scientist",
        );

        expect(
            screen.getByRole("button", { name: /Agent Alpha/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Agent Gamma/i }),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /Agent Beta/i }),
        ).not.toBeInTheDocument();
    });
});
