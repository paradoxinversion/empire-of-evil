import { createSquad } from "../factories/index.js";
import type { AgentJob, GameState, Squad, StandingOrder } from "../types/index.js";
import type { Person } from "../types/index.js";

const getPersonOrThrow = (state: GameState, personId: string) => {
    const person = state.persons[personId];
    if (!person) throw new Error(`Person not found: ${personId}`);
    return person;
};

type AgentPerson = Person & {
    agentStatus: NonNullable<Person["agentStatus"]>;
};

const getAgentOrThrow = (state: GameState, agentId: string): AgentPerson => {
    const person = getPersonOrThrow(state, agentId);
    if (!person.agentStatus) throw new Error(`Person is not an agent: ${agentId}`);
    if (person.dead) throw new Error(`Person is dead: ${agentId}`);
    return person as AgentPerson;
};

const getSquadOrThrow = (state: GameState, squadId: string): Squad => {
    const squad = state.squads[squadId];
    if (!squad) throw new Error(`Squad not found: ${squadId}`);
    return squad;
};

export const reassignAgentJob = (
    state: GameState,
    agentId: string,
    job: AgentJob,
): void => {
    const person = getAgentOrThrow(state, agentId);

    person.agentStatus.job = job;
};

export const fireAgent = (state: GameState, agentId: string): void => {
    const person = getPersonOrThrow(state, agentId);
    if (!person.agentStatus)
        throw new Error(`Person is not an agent: ${agentId}`);
    if (person.dead) throw new Error(`Person is dead: ${agentId}`);

    for (const squad of Object.values(state.squads)) {
        squad.memberIds = squad.memberIds.filter((id) => id !== agentId);
        if (squad.leaderId === agentId) {
            delete squad.leaderId;
        }
    }

    delete person.agentStatus;
};

export const terminatePerson = (state: GameState, personId: string): void => {
    const person = getPersonOrThrow(state, personId);
    if (person.dead) return;

    person.dead = true;

    for (const squad of Object.values(state.squads)) {
        squad.memberIds = squad.memberIds.filter((id) => id !== personId);
        if (squad.leaderId === personId) {
            delete squad.leaderId;
        }
    }

    for (const activity of Object.values(state.activities)) {
        activity.assignedAgentIds = activity.assignedAgentIds.filter(
            (id) => id !== personId,
        );
    }

    for (const plot of Object.values(state.plots)) {
        plot.assignedAgentIds = plot.assignedAgentIds.filter(
            (id) => id !== personId,
        );
    }

    for (const research of Object.values(state.research)) {
        research.assignedAgentIds = research.assignedAgentIds.filter(
            (id) => id !== personId,
        );
    }
};

export const createSquadInState = (
    state: GameState,
    input: { name: string },
): Squad => {
    const squad = createSquad({ name: input.name.trim() });
    state.squads[squad.id] = squad;
    return squad;
};

export const renameSquad = (
    state: GameState,
    squadId: string,
    name: string,
): void => {
    const squad = getSquadOrThrow(state, squadId);
    squad.name = name.trim();
};

export const setSquadHomeZone = (
    state: GameState,
    squadId: string,
    zoneId: string,
): void => {
    const squad = getSquadOrThrow(state, squadId);
    if (!state.zones[zoneId]) throw new Error(`Zone not found: ${zoneId}`);
    squad.homeZoneId = zoneId;
};

export const setSquadStandingOrder = (
    state: GameState,
    squadId: string,
    standingOrder: StandingOrder,
): void => {
    const squad = getSquadOrThrow(state, squadId);
    squad.standingOrders = standingOrder;
};

export const addAgentToSquad = (
    state: GameState,
    squadId: string,
    agentId: string,
): void => {
    const squad = getSquadOrThrow(state, squadId);
    const agent = getAgentOrThrow(state, agentId);

    if (agent.agentStatus.squadId && agent.agentStatus.squadId !== squadId) {
        throw new Error(`Agent already assigned to squad: ${agentId}`);
    }

    if (!squad.memberIds.includes(agentId)) {
        squad.memberIds.push(agentId);
    }
    agent.agentStatus.squadId = squadId;
};

export const removeAgentFromSquad = (
    state: GameState,
    squadId: string,
    agentId: string,
): void => {
    const squad = getSquadOrThrow(state, squadId);
    const agent = getAgentOrThrow(state, agentId);

    squad.memberIds = squad.memberIds.filter((id) => id !== agentId);
    if (squad.leaderId === agentId) {
        delete squad.leaderId;
    }

    if (agent.agentStatus.squadId === squadId) {
        delete agent.agentStatus.squadId;
    }
};

export const setSquadLeader = (
    state: GameState,
    squadId: string,
    leaderId: string,
): void => {
    const squad = getSquadOrThrow(state, squadId);
    const leader = getAgentOrThrow(state, leaderId);
    if (!squad.memberIds.includes(leaderId)) {
        throw new Error(`Leader must be a squad member: ${leaderId}`);
    }

    const leadership = leader.attributes.leadership ?? 0;
    if (leadership < 1) {
        throw new Error(`Leader does not meet leadership requirement: ${leaderId}`);
    }

    squad.leaderId = leaderId;
};

export const disbandSquad = (state: GameState, squadId: string): void => {
    const squad = getSquadOrThrow(state, squadId);
    for (const memberId of squad.memberIds) {
        const person = state.persons[memberId];
        if (person?.agentStatus?.squadId === squadId) {
            delete person.agentStatus.squadId;
        }
    }

    for (const person of Object.values(state.persons)) {
        if (person.agentStatus?.squadId === squadId) {
            delete person.agentStatus.squadId;
        }
    }

    delete state.squads[squadId];
};

export const addInnerCircleMember = (
    state: GameState,
    personId: string,
): void => {
    getAgentOrThrow(state, personId);
    if (!state.empire.innerCircleIds.includes(personId)) {
        state.empire.innerCircleIds.push(personId);
    }
};

export const removeInnerCircleMember = (
    state: GameState,
    personId: string,
): void => {
    state.empire.innerCircleIds = state.empire.innerCircleIds.filter(
        (id) => id !== personId,
    );
};

export const reorderInnerCircleMembers = (
    state: GameState,
    orderedIds: string[],
): void => {
    const current = state.empire.innerCircleIds;
    if (orderedIds.length !== current.length) {
        throw new Error("Inner circle reorder length mismatch");
    }

    const currentSet = new Set(current);
    if (orderedIds.some((id) => !currentSet.has(id))) {
        throw new Error("Inner circle reorder contains unknown member");
    }

    state.empire.innerCircleIds = [...orderedIds];
};
