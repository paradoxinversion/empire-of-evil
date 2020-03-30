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
    eventType: "informational"
  },
  "change-of-heart": {
    name: "Change of Heart",
    description:
      "An 'EVIL' Agent has decided they weren't as EVIL as we hoped. They've been terminated. As in killed.",
    effect: 1,
    amount: 1,
    eventType: "information"
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

    description:
      "Whether the Lord guided her hand or she honed the skill over decades, the fact remains: That really hurt.",
    effect: 4,
    amount: [3, 6],
    activityConsequence: true,
    eventType: "combat"
  }
};

export const incidentFrequency = {
  nothing: 1,
  "evil-apprentice": 1,
  "change-of-heart": 1
};
