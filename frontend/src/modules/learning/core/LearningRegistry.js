import { LEARNING_SECTIONS } from "../constants/sections";

export function getLearningSection(id) {

  return LEARNING_SECTIONS[id] ?? null;

}

export function getLearningSections(ids = []) {

  return ids

    .map(getLearningSection)

    .filter(Boolean);

}
