import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, vi } from "vitest";
import { CharacterProfile } from "./CharacterProfile";
import { useGameState } from "../../hooks/useGameState";
import { useGameStore } from "../../store/gameStore";

vi.mock("../../hooks/useGameState");
vi.mock("../../store/gameStore");

afterEach(() => {
    vi.useRealTimers();
});

describe("CharacterProfile", () => {
    it("fires an agent after confirmation", async () => {
        const user = userEvent.setup();
        const addAgentToSquad = vi.fn();
        const reassignAgentJob = vi.fn();
        const fireAgent = vi.fn();

        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector({ addAgentToSquad, reassignAgentJob, fireAgent }),
        );

        const gameState = {
            persons: {
                "person-1": {
                    id: "person-1",
                    name: "Agent Alpha",
                    zoneId: "zone-1",
                    homeZoneId: "zone-1",
                    governingOrganizationId: "org-1",
                    attributes: { intellect: 72 },
                    skills: { research: 66 },
                    loyalties: { empire: 81 },
                    intelLevel: 100,
                    health: 100,
                    money: 0,
                    activeEffectIds: [],
                    dead: false,
                    agentStatus: { job: "scientist", salary: 12 },
                },
            },
            zones: {
                "zone-1": { id: "zone-1", name: "Capital" },
            },
            squads: {},
            governingOrganizations: {
                empire: { id: "empire", name: "Empire of Evil Inc." },
            },
            effectInstances: {},
        } as any;

        vi.mocked(useGameState).mockReturnValue(gameState);

        render(<CharacterProfile personId="person-1" onClose={() => {}} />);

        await user.click(screen.getByRole("button", { name: /FIRE/i }));
        expect(
            screen.getByRole("alertdialog", { name: /FIRE AGENT/i }),
        ).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /CONFIRM FIRE/i }));
        expect(fireAgent).toHaveBeenCalledWith("person-1");
    });

    it("terminates an agent after destructive confirmation", async () => {
        const user = userEvent.setup();
        const addAgentToSquad = vi.fn();
        const reassignAgentJob = vi.fn();
        const fireAgent = vi.fn();
        const terminatePerson = vi.fn();

        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector({
                addAgentToSquad,
                reassignAgentJob,
                fireAgent,
                terminatePerson,
            }),
        );

        const gameState = {
            persons: {
                "person-1": {
                    id: "person-1",
                    name: "Agent Alpha",
                    zoneId: "zone-1",
                    homeZoneId: "zone-1",
                    governingOrganizationId: "org-1",
                    attributes: { intellect: 72 },
                    skills: { research: 66 },
                    loyalties: { empire: 81 },
                    intelLevel: 100,
                    health: 100,
                    money: 0,
                    activeEffectIds: [],
                    dead: false,
                    agentStatus: { job: "scientist", salary: 12 },
                },
            },
            zones: {
                "zone-1": { id: "zone-1", name: "Capital" },
            },
            squads: {},
            governingOrganizations: {
                empire: { id: "empire", name: "Empire of Evil Inc." },
            },
            effectInstances: {},
        } as any;

        vi.mocked(useGameState).mockReturnValue(gameState);

        render(<CharacterProfile personId="person-1" onClose={() => {}} />);

        await user.click(screen.getByRole("button", { name: /TERMINATE/i }));
        expect(
            screen.getByRole("alertdialog", { name: /TERMINATE AGENT/i }),
        ).toBeInTheDocument();

        await user.click(
            screen.getByRole("button", { name: /CONFIRM TERMINATION/i }),
        );
        expect(terminatePerson).toHaveBeenCalledWith("person-1");
    });

    it("opens move agent modal as a UI scaffold", async () => {
        const user = userEvent.setup();
        const addAgentToSquad = vi.fn();
        const reassignAgentJob = vi.fn();

        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector({ addAgentToSquad, reassignAgentJob }),
        );

        const gameState = {
            persons: {
                "person-1": {
                    id: "person-1",
                    name: "Agent Alpha",
                    zoneId: "zone-1",
                    homeZoneId: "zone-1",
                    governingOrganizationId: "org-1",
                    attributes: { intellect: 72 },
                    skills: { research: 66 },
                    loyalties: { empire: 81 },
                    intelLevel: 100,
                    health: 100,
                    money: 0,
                    activeEffectIds: [],
                    dead: false,
                    agentStatus: { job: "scientist", salary: 12 },
                },
            },
            zones: {
                "zone-1": { id: "zone-1", name: "Capital" },
                "zone-2": { id: "zone-2", name: "Outlands" },
            },
            squads: {},
            governingOrganizations: {
                empire: { id: "empire", name: "Empire of Evil Inc." },
            },
            effectInstances: {},
        } as any;

        vi.mocked(useGameState).mockReturnValue(gameState);

        render(<CharacterProfile personId="person-1" onClose={() => {}} />);

        await user.click(screen.getByRole("button", { name: /MOVE/i }));

        expect(
            screen.getByRole("dialog", { name: /MOVE AGENT/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /MOVE NOT YET WIRED/i }),
        ).toBeDisabled();
    });

    it("reassigns an agent job from the profile action", async () => {
        const user = userEvent.setup();
        const addAgentToSquad = vi.fn();
        const reassignAgentJob = vi.fn();

        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector({ addAgentToSquad, reassignAgentJob }),
        );

        const gameState = {
            persons: {
                "person-1": {
                    id: "person-1",
                    name: "Agent Alpha",
                    zoneId: "zone-1",
                    homeZoneId: "zone-1",
                    governingOrganizationId: "org-1",
                    attributes: { intellect: 72 },
                    skills: { research: 66 },
                    loyalties: { empire: 81 },
                    intelLevel: 100,
                    health: 100,
                    money: 0,
                    activeEffectIds: [],
                    dead: false,
                    agentStatus: { job: "scientist", salary: 12 },
                },
            },
            squads: {},
            governingOrganizations: {
                empire: { id: "empire", name: "Empire of Evil Inc." },
            },
            effectInstances: {},
        } as any;

        vi.mocked(useGameState).mockReturnValue(gameState);

        render(<CharacterProfile personId="person-1" onClose={() => {}} />);

        await user.click(screen.getByRole("button", { name: /REASSIGN/i }));

        expect(
            screen.getByRole("dialog", { name: /REASSIGN AGENT/i }),
        ).toBeInTheDocument();

        await user.selectOptions(
            screen.getByRole("combobox", { name: /DEPARTMENT/i }),
            "operative",
        );
        await user.click(
            screen.getByRole("button", { name: /CONFIRM REASSIGN/i }),
        );

        expect(reassignAgentJob).toHaveBeenCalledWith("person-1", "operative");
    });

    it("adds an agent to a selected squad from the profile action", async () => {
        const user = userEvent.setup();
        const addAgentToSquad = vi.fn();

        vi.mocked(useGameStore).mockImplementation((selector: any) =>
            selector({ addAgentToSquad }),
        );

        const gameState = {
            persons: {
                "person-1": {
                    id: "person-1",
                    name: "Agent Alpha",
                    zoneId: "zone-1",
                    homeZoneId: "zone-1",
                    governingOrganizationId: "org-1",
                    attributes: { intellect: 72 },
                    skills: { research: 66 },
                    loyalties: { empire: 81 },
                    intelLevel: 100,
                    health: 100,
                    money: 0,
                    activeEffectIds: [],
                    dead: false,
                    agentStatus: { job: "scientist", salary: 12 },
                },
            },
            squads: {
                "squad-1": {
                    id: "squad-1",
                    name: "Night Shift",
                    memberIds: [],
                },
                "squad-2": {
                    id: "squad-2",
                    name: "Red Choir",
                    memberIds: [],
                },
            },
            governingOrganizations: {
                empire: { id: "empire", name: "Empire of Evil Inc." },
            },
            effectInstances: {},
        } as any;

        vi.mocked(useGameState).mockReturnValue(gameState);

        render(<CharacterProfile personId="person-1" onClose={() => {}} />);

        await user.click(screen.getByRole("button", { name: /ADD TO SQUAD/i }));

        expect(
            screen.getByRole("dialog", { name: /ADD TO SQUAD/i }),
        ).toBeInTheDocument();

        await user.selectOptions(
            screen.getByRole("combobox", { name: /SQUAD/i }),
            "squad-2",
        );
        await user.click(
            screen.getByRole("button", { name: /CONFIRM ADD TO SQUAD/i }),
        );

        expect(addAgentToSquad).toHaveBeenCalledWith("squad-2", "person-1");
    });

    it("renders top-panel quick actions for agents", () => {
        const gameState = {
            persons: {
                "person-1": {
                    id: "person-1",
                    name: "Agent Alpha",
                    zoneId: "zone-1",
                    homeZoneId: "zone-1",
                    governingOrganizationId: "org-1",
                    attributes: { intellect: 72 },
                    skills: { research: 66 },
                    loyalties: { empire: 81 },
                    intelLevel: 100,
                    health: 100,
                    money: 0,
                    activeEffectIds: [],
                    dead: false,
                    agentStatus: { job: "scientist", salary: 12 },
                },
            },
            governingOrganizations: {
                empire: { id: "empire", name: "Empire of Evil Inc." },
            },
            effectInstances: {},
        } as any;

        vi.mocked(useGameState).mockReturnValue(gameState);

        render(<CharacterProfile personId="person-1" onClose={() => {}} />);

        expect(
            screen.getByRole("button", { name: /REASSIGN/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /ADD TO SQUAD/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /MOVE/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /FIRE/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /TERMINATE/i }),
        ).toBeInTheDocument();
    });

    it("shows loyalty guidance in a tooltip", () => {
        vi.useFakeTimers();

        const gameState = {
            persons: {
                "person-1": {
                    id: "person-1",
                    name: "Agent Alpha",
                    zoneId: "zone-1",
                    homeZoneId: "zone-1",
                    governingOrganizationId: "org-1",
                    attributes: { intellect: 72 },
                    skills: { research: 66 },
                    loyalties: { empire: 81 },
                    intelLevel: 100,
                    health: 100,
                    money: 0,
                    activeEffectIds: [],
                    dead: false,
                    agentStatus: { job: "scientist", salary: 12 },
                },
            },
            governingOrganizations: {
                empire: { id: "empire", name: "Empire of Evil Inc." },
            },
            effectInstances: {},
        } as any;

        vi.mocked(useGameState).mockReturnValue(gameState);

        render(<CharacterProfile personId="person-1" onClose={() => {}} />);

        fireEvent.mouseOver(screen.getByLabelText("Loyalty help"));
        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(
            screen.getByRole("tooltip", {
                name: /Loyalty reflects alignment with each organization/i,
            }),
        ).toBeInTheDocument();
    });
});
