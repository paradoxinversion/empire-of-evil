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
        await user.click(
            screen.getByRole("button", { name: /disband squad/i }),
        );

        expect(disbandSquad).toHaveBeenCalledWith("s1");
    });

    it("updates selected squad name", async () => {
        const user = userEvent.setup();
        const renameSquad = vi.fn();

        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector({ renameSquad }),
        );

        vi.mocked(useGameState).mockReturnValue({
            persons: {
                a1: {
                    id: "a1",
                    name: "Agent One",
                    zoneId: "z1",
                    homeZoneId: "z1",
                    governingOrganizationId: "empire",
                    attributes: { leadership: 70 },
                    skills: {},
                    loyalties: {},
                    intelLevel: 100,
                    health: 100,
                    money: 0,
                    activeEffectIds: [],
                    dead: false,
                    agentStatus: {
                        job: "operative",
                        salary: 10,
                        squadId: "s1",
                    },
                },
            },
            zones: {},
            squads: {
                s1: {
                    id: "s1",
                    name: "Night Shift",
                    memberIds: ["a1"],
                },
            },
        } as any);

        render(<SquadsTab onSelectPerson={() => {}} selectedPersonId={null} />);

        await user.click(screen.getByText("Night Shift"));
        await user.clear(screen.getByLabelText("Squad name"));
        await user.type(screen.getByLabelText("Squad name"), "Red Choir");
        await user.click(screen.getByRole("button", { name: /save squad/i }));

        expect(renameSquad).toHaveBeenCalledWith("s1", "Red Choir");
    });

    it("updates home zone and leader on selected squad", async () => {
        const user = userEvent.setup();
        const setSquadHomeZone = vi.fn();
        const setSquadLeader = vi.fn();

        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector({ setSquadHomeZone, setSquadLeader }),
        );

        vi.mocked(useGameState).mockReturnValue({
            persons: {
                a1: {
                    id: "a1",
                    name: "Agent One",
                    zoneId: "z1",
                    homeZoneId: "z1",
                    governingOrganizationId: "empire",
                    attributes: { leadership: 70 },
                    skills: {},
                    loyalties: {},
                    intelLevel: 100,
                    health: 100,
                    money: 0,
                    activeEffectIds: [],
                    dead: false,
                    agentStatus: {
                        job: "operative",
                        salary: 10,
                        squadId: "s1",
                    },
                },
            },
            zones: {
                z1: {
                    id: "z1",
                    name: "Capital",
                },
                z2: {
                    id: "z2",
                    name: "Outlands",
                },
            },
            squads: {
                s1: {
                    id: "s1",
                    name: "Night Shift",
                    memberIds: ["a1"],
                },
            },
        } as any);

        render(<SquadsTab onSelectPerson={() => {}} selectedPersonId={null} />);

        await user.click(screen.getByText("Night Shift"));
        await user.selectOptions(screen.getByLabelText(/home zone/i), "z2");
        await user.selectOptions(screen.getByLabelText(/squad leader/i), "a1");

        expect(setSquadHomeZone).toHaveBeenCalledWith("s1", "z2");
        expect(setSquadLeader).toHaveBeenCalledWith("s1", "a1");
    });

    it("adds members to selected squad via picker modal", async () => {
        const user = userEvent.setup();
        const addAgentToSquad = vi.fn();

        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector({ addAgentToSquad }),
        );

        vi.mocked(useGameState).mockReturnValue({
            persons: {
                a1: {
                    id: "a1",
                    name: "Agent One",
                    zoneId: "z1",
                    homeZoneId: "z1",
                    governingOrganizationId: "empire",
                    attributes: { leadership: 70 },
                    skills: {},
                    loyalties: {},
                    intelLevel: 100,
                    health: 100,
                    money: 0,
                    activeEffectIds: [],
                    dead: false,
                    agentStatus: { job: "operative", salary: 10 },
                },
            },
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
        await user.click(screen.getByRole("button", { name: /add members/i }));
        await user.click(screen.getByRole("button", { name: /agent one/i }));
        await user.click(
            screen.getByRole("button", { name: /assign 1 agent/i }),
        );

        expect(addAgentToSquad).toHaveBeenCalledWith("s1", "a1");
    });

    it("updates standing plot when EXECUTE_STANDING_PLOT order is selected", async () => {
        const user = userEvent.setup();
        const setSquadStandingPlot = vi.fn();

        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector({ setSquadStandingPlot }),
        );

        vi.mocked(useGameState).mockReturnValue({
            persons: {
                a1: {
                    id: "a1",
                    name: "Agent One",
                    zoneId: "z1",
                    homeZoneId: "z1",
                    governingOrganizationId: "empire",
                    attributes: { leadership: 70 },
                    skills: {},
                    loyalties: {},
                    intelLevel: 100,
                    health: 100,
                    money: 0,
                    activeEffectIds: [],
                    dead: false,
                    agentStatus: { job: "operative", salary: 10 },
                },
            },
            zones: {
                z1: {
                    id: "z1",
                    name: "Capital",
                },
            },
            plots: {
                p1: {
                    id: "p1",
                    plotDefinitionId: "sabotage",
                    currentStageIndex: 0,
                    assignedAgentIds: [],
                    daysRemaining: 5,
                    accumulatedSuccessScore: 0,
                    status: "active",
                    targetZoneId: "z1",
                },
            },
            squads: {
                s1: {
                    id: "s1",
                    name: "Night Shift",
                    memberIds: ["a1"],
                    standingOrders: "EXECUTE_STANDING_PLOT",
                },
            },
        } as any);

        render(<SquadsTab onSelectPerson={() => {}} selectedPersonId={null} />);

        await user.click(screen.getByText("Night Shift"));
        await user.selectOptions(screen.getByLabelText(/standing plot/i), "p1");

        expect(setSquadStandingPlot).toHaveBeenCalledWith("s1", "p1");
    });
});
