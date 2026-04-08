import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { InnerCircleTab } from "./InnerCircleTab";
import { useGameState } from "../../hooks/useGameState";
import { useGameStore } from "../../store/gameStore";

vi.mock("../../hooks/useGameState");
vi.mock("../../store/gameStore");

describe("InnerCircleTab", () => {
    it("adds a member from add-member control", async () => {
        const user = userEvent.setup();
        const addInnerCircleMember = vi.fn();

        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector({ addInnerCircleMember }),
        );

        vi.mocked(useGameState).mockReturnValue({
            empire: { id: "empire", innerCircleIds: [] },
            persons: {
                a1: {
                    id: "a1",
                    name: "Agent One",
                    zoneId: "z1",
                    homeZoneId: "z1",
                    governingOrganizationId: "empire",
                    attributes: { leadership: 60 },
                    skills: {},
                    loyalties: { empire: 80 },
                    intelLevel: 100,
                    health: 100,
                    money: 0,
                    activeEffectIds: [],
                    dead: false,
                    agentStatus: { job: "operative", salary: 10 },
                },
            },
        } as any);

        render(<InnerCircleTab onSelectPerson={() => {}} />);

        await user.click(screen.getByRole("button", { name: /add member/i }));
        await user.click(screen.getByRole("button", { name: /agent one/i }));
        await user.click(
            screen.getByRole("button", { name: /assign 1 agent/i }),
        );

        expect(addInnerCircleMember).toHaveBeenCalledWith("a1");
    });

    it("removes a member from card action", async () => {
        const user = userEvent.setup();
        const removeInnerCircleMember = vi.fn();

        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector({ removeInnerCircleMember }),
        );

        vi.mocked(useGameState).mockReturnValue({
            empire: { id: "empire", innerCircleIds: ["a1"] },
            persons: {
                a1: {
                    id: "a1",
                    name: "Agent One",
                    zoneId: "z1",
                    homeZoneId: "z1",
                    governingOrganizationId: "empire",
                    attributes: { leadership: 60 },
                    skills: {},
                    loyalties: { empire: 80 },
                    intelLevel: 100,
                    health: 100,
                    money: 0,
                    activeEffectIds: [],
                    dead: false,
                    agentStatus: { job: "operative", salary: 10 },
                },
            },
        } as any);

        render(<InnerCircleTab onSelectPerson={() => {}} />);

        await user.click(
            screen.getByRole("button", { name: /remove member/i }),
        );

        expect(removeInnerCircleMember).toHaveBeenCalledWith("a1");
    });

    it("reorders inner-circle members with move up control", async () => {
        const user = userEvent.setup();
        const reorderInnerCircleMembers = vi.fn();

        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector({ reorderInnerCircleMembers }),
        );

        vi.mocked(useGameState).mockReturnValue({
            empire: { id: "empire", innerCircleIds: ["a1", "a2"] },
            persons: {
                a1: {
                    id: "a1",
                    name: "Agent One",
                    zoneId: "z1",
                    homeZoneId: "z1",
                    governingOrganizationId: "empire",
                    attributes: { leadership: 60 },
                    skills: {},
                    loyalties: { empire: 80 },
                    intelLevel: 100,
                    health: 100,
                    money: 0,
                    activeEffectIds: [],
                    dead: false,
                    agentStatus: { job: "operative", salary: 10 },
                },
                a2: {
                    id: "a2",
                    name: "Agent Two",
                    zoneId: "z1",
                    homeZoneId: "z1",
                    governingOrganizationId: "empire",
                    attributes: { leadership: 50 },
                    skills: {},
                    loyalties: { empire: 75 },
                    intelLevel: 100,
                    health: 100,
                    money: 0,
                    activeEffectIds: [],
                    dead: false,
                    agentStatus: { job: "scientist", salary: 10 },
                },
            },
        } as any);

        render(<InnerCircleTab onSelectPerson={() => {}} />);

        await user.click(
            screen.getByRole("button", { name: /move up agent two/i }),
        );

        expect(reorderInnerCircleMembers).toHaveBeenCalledWith(["a2", "a1"]);
    });
});
