import { Person } from "../../common/types";

const getPersonAttribute = (person: Person, attribute: string) => {
    return person.attributes[attribute];
};

const getPersonSkill = (person: Person, skill: string) => {
    return person.skills[skill];
};
