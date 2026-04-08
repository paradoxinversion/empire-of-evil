import type { AgentJob, GameState } from "../types/index.js";

export const reassignAgentJob = (
    state: GameState,
    agentId: string,
    job: AgentJob,
): void => {
    const person = state.persons[agentId];
    if (!person) throw new Error(`Person not found: ${agentId}`);
    if (!person.agentStatus)
        throw new Error(`Person is not an agent: ${agentId}`);

    person.agentStatus.job = job;
};

export const fireAgent = (state: GameState, agentId: string): void => {
    const person = state.persons[agentId];
    if (!person) throw new Error(`Person not found: ${agentId}`);
    if (!person.agentStatus)
        throw new Error(`Person is not an agent: ${agentId}`);

    for (const squad of Object.values(state.squads)) {
        squad.memberIds = squad.memberIds.filter((id) => id !== agentId);
        if (squad.leaderId === agentId) {
            delete squad.leaderId;
        }
    }

    delete person.agentStatus;
};

export const terminatePerson = (state: GameState, personId: string): void => {
    const person = state.persons[personId];
    if (!person) throw new Error(`Person not found: ${personId}`);
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
