import path from "path";
import { walk } from "./filesystem.mjs";

export function getProjectStatistics(root) {

  const files = walk(root);

  const stats = {
    pages: 0,
    components: 0,
    contexts: 0,
    hooks: 0,
    locales: 0,
    services: 0,
    utils: 0
  };

  for (const file of files) {

    const normalized = file.split(path.sep).join("/");

    if (normalized.includes("/src/pages/")) {
      stats.pages++;
    }

    if (normalized.includes("/src/components/")) {
      stats.components++;
    }

    if (normalized.includes("/src/context/")) {
      stats.contexts++;
    }

    if (normalized.includes("/src/hooks/")) {
      stats.hooks++;
    }

    if (normalized.includes("/public/locales/")) {
      stats.locales++;
    }

    if (normalized.includes("/src/services/")) {
      stats.services++;
    }

    if (normalized.includes("/src/utils/")) {
      stats.utils++;
    }

  }

  return stats;

}
