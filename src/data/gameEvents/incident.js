// 0 - Gain Recruit
// 1 - Kill Agent
// 2 - Gain Evil
// 3 - Lose Evil
// 4 - Damage Agent

export const incidentTypes = {
  nothing: {
    name: "Nothing",
    description: "Nothing happens. The player won't even see this.",
    effect: "no-effect",
    eventType: "none"
  },
  "evil-apprentice": {
    name: "EVIL Appretice",
    description:
      "An eager apprentice has arrived, prepared to learn your EVIL ways!",
    effect: 0,
    amount: 1,
    eventType: "gain-agent"
  },
  "change-of-heart": {
    name: "Change of Heart",
    description:
      "An 'EVIL' Agent has decided they weren't as EVIL as we hoped. They've been terminated. As in killed.",
    effect: 1,
    amount: 1,
    eventType: "kill-agent"
  },
  "nerd-revenge": {
    name: "Revenge of the Nerds",
    description:
      "A violent mob of nerds has decided they would rather keep their lunch money.",
    effect: 4,
    amount: [1, 5],
    activityConsequence: true,
    eventType: "combat"
  },
  "the-ruler": {
    name: "Mess with the Nuns, get the ruler.",
    description: "Those sisters were having NUN of your agent's shenanigans.",
    effect: 4,
    amount: [3, 6],
    activityConsequence: true,
    eventType: "damage-agent"
  },
  "area-revolt": {
    name: "Uprising!",
    description:
      "The citizens of the area have grown tired of EVIL rule and staged an uprising! They're engaging our EVIL forces now!",
    eventType: "combat"
  }
};

export const incidentFrequency = {
  nothing: 100,
  "evil-apprentice": 10,
  "change-of-heart": 5
};
