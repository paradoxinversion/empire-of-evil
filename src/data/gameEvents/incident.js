// 0 - Gain Recruit
// 1 - Kill Agent
// 2 - Gain Evil
// 3 - Lose Evil

const incidentTypes = {
  "evil-apprentice": {
    name: "EVIL Appretice",
    description:
      "An eager apprentice has arrived, prepared to learn your EVIL ways!",
    effect: 0,
    amount: 1
  },
  "change-of-heart": {
    name: "Change of Heart",
    description:
      "An 'EVIL' Agent has decided they weren't as EVIL as we hoped. They've been terminated. As in killed.",
    effect: 1,
    amount: 1
  }
};
