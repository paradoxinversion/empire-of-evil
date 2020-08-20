import { getUID } from "../../utilities";

export class Nation {
  constructor({ name, isEvilEmpire = false, uid = null }) {
    this.id = uid || getUID();
    this.name = name;
    this.isEvilEmpire = isEvilEmpire;
    this.cash = 10000;
    this.nationalControl = 100; // or, EVIL for the Empire
  }
}

export const createNation = (name, isEvilEmpire = false) => {
  const newNationOpts = {
    name,
    isEvilEmpire
  };
  const newNation = new Nation(newNationOpts);
  return newNation;
};

/**
 * Creates the nations that will be used in the game
 */
export const createNations = () => {
  const evilEmpire = createNation("EVIL Empire", true);

  const cpuNation = createNation("CPU Nation", false);
  const nations = {
    [evilEmpire.id]: evilEmpire,
    [cpuNation.id]: cpuNation
  };
  return { nations, cpuNation, evilEmpire };
};
