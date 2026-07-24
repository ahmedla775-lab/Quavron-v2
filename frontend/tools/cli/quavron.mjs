#!/usr/bin/env node

const command = process.argv[2];

switch (command) {

  case "extract-i18n":
    await import("../commands/extract-i18n.mjs");
    break;

  case "replace-i18n":
    await import("../commands/replace-i18n.mjs");
    break;

  case "sync-locales":
    await import("../commands/sync-locales.mjs");
    break;

  case "missing-keys":
    await import("../commands/missing-keys.mjs");
    break;

  case "doctor":
    await import("../commands/doctor.mjs");
    break;

  default:

    console.log(`
Quavron CLI

Commands:

extract-i18n
replace-i18n
sync-locales
missing-keys
doctor

`);

}
