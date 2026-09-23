#!/usr/bin/env node
'use strict';

/*
 * expo-expert-skills — CLI installer for the Expo Expert Skills collection.
 *
 * Uses only Node.js built-in APIs (fs, os, path). No third-party dependencies.
 *
 * Usage:
 *   expo-expert-skills install [skill-name | all]
 *   expo-expert-skills list
 *   expo-expert-skills help
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const PACKAGE_NAME = 'expo-expert-skills';

// The ten skills shipped in this package. This list is the single source of
// truth for what the installer knows how to copy. The order is stable so that
// `list` output is deterministic.
const SKILLS = [
  {
    name: 'expo-parity-engineer',
    description:
      'Senior Expo / React Native engineer skill: clean code, web/phone parity, and fully executed requests.',
  },
  {
    name: 'expo-error-resolver',
    description:
      'Diagnoses and fixes any error in an Expo / React Native project (TypeScript, Metro, runtime, build, API).',
  },
  {
    name: 'expo-safe-refactor',
    description:
      'Refactors Expo / React Native code for structure and readability without changing behavior.',
  },
  {
    name: 'expo-code-quality-analyzer',
    description:
      'Read-only code review: performance, cleanliness, and complexity, with prioritized suggestions.',
  },
  {
    name: 'expo-premium-design',
    description:
      'Analyzes and upgrades the visual design of an Expo / React Native app to feel premium.',
  },
  {
    name: 'expo-accessibility-auditor',
    description:
      'Reviews and improves accessibility: screen reader support, touch targets, color contrast, focus order, RTL accessibility, and dynamic text sizing.',
  },
  {
    name: 'expo-dependency-upgrade',
    description:
      'Safely upgrades the Expo SDK and/or npm dependencies, handling breaking changes and deprecated APIs.',
  },
  {
    name: 'expo-release-manager',
    description:
      'Prepares and manages Expo builds and releases: EAS Build, versioning, EAS Submit, OTA updates, and secrets setup.',
  },
  {
    name: 'expo-supabase-guardian',
    description:
      'Reviews and improves the Supabase backend: schema, RLS policies, auth setup, storage buckets, and query safety.',
  },
  {
    name: 'expo-test-writer',
    description:
      'Writes and maintains automated tests with Jest and React Native Testing Library.',
  },
];

const SKILL_NAMES = SKILLS.map((skill) => skill.name);

function fail(message) {
  process.stderr.write(`\nError: ${message}\n\n`);
  process.stderr.write(`Run "${PACKAGE_NAME} help" for usage.\n\n`);
  process.exitCode = 1;
}

function print(text) {
  process.stdout.write(`${text}\n`);
}

function help() {
  print(`Expo Expert Skills — installer

Install professional agent skills for Expo / React Native development.

Usage:
  ${PACKAGE_NAME} install                    Install all ten skills
  ${PACKAGE_NAME} install all                Install all ten skills
  ${PACKAGE_NAME} install <skill-name> [skill-name ...]  Install one or more skills
  ${PACKAGE_NAME} list                       List the available skills
  ${PACKAGE_NAME} help                       Show this help

Examples:
  ${PACKAGE_NAME} install
  ${PACKAGE_NAME} install expo-parity-engineer
  ${PACKAGE_NAME} install expo-error-resolver expo-safe-refactor

Skills are installed into:
  ~/.agents/skills/

Override the destination directory with the EXPO_EXPERT_SKILLS_DIR
environment variable.

Available skills:
${SKILLS.map((skill) => `  - ${skill.name}`).join('\n')}
`);
}

function list() {
  print('Available Expo Expert Skills:\n');
  for (const skill of SKILLS) {
    print(`  ${skill.name}`);
    print(`      ${skill.description}\n`);
  }
}

// Resolve the directory inside this package where the skill folders live.
function packageSkillsRoot() {
  // This file lives at <package>/bin/expo-expert-skills.js.
  return path.resolve(__dirname, '..');
}

// Resolve the destination directory for installed skills.
//
// The default is the Agent Skills standard global skills directory:
//
//   ~/.agents/skills/
//
// This is a single shared location that is auto-discovered by Agent
// Skills-compatible harnesses such as Pi and OpenCode, so one installation
// serves every compatible agent without duplicating the skills.
//
// `EXPO_EXPERT_SKILLS_DIR` always overrides the default destination.
function destinationRoot() {
  if (process.env.EXPO_EXPERT_SKILLS_DIR) {
    return path.resolve(process.env.EXPO_EXPERT_SKILLS_DIR);
  }
  return path.join(os.homedir(), '.agents', 'skills');
}

// Copy a directory recursively. Overwrites existing files with the same name,
// leaves any unrelated files in place, and never touches anything outside the
// target directory.
function copyDirectoryRecursive(source, destination) {
  fs.cpSync(source, destination, {
    recursive: true,
    force: true,
    errorOnExist: false,
  });
}

function installSkill(name) {
  if (!SKILL_NAMES.includes(name)) {
    fail(
      `Unknown skill "${name}". Available skills: ${SKILL_NAMES.join(', ')}`
    );
    return false;
  }

  const source = path.join(packageSkillsRoot(), name);
  const destination = path.join(destinationRoot(), name);

  if (!fs.existsSync(source) || !fs.statSync(source).isDirectory()) {
    fail(
      `The skill "${name}" is missing from this package (expected at ${source}).`
    );
    return false;
  }

  try {
    fs.mkdirSync(destinationRoot(), { recursive: true });
    copyDirectoryRecursive(source, destination);
    print(`Installed ${name} -> ${destination}`);
    return true;
  } catch (error) {
    fail(`Could not install "${name}": ${error.message}`);
    return false;
  }
}

function installAll() {
  let ok = true;
  for (const skill of SKILLS) {
    if (!installSkill(skill.name)) {
      ok = false;
    }
  }
  return ok;
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    help();
    return 0;
  }

  const command = args[0];

  if (command === 'help' || command === '--help' || command === '-h') {
    help();
    return 0;
  }

  if (command === 'list') {
    list();
    return 0;
  }

  if (command === 'install') {
    const targets = args.slice(1);

    // `install` with no arguments (or `install all`) installs everything.
    if (targets.length === 0 || (targets.length === 1 && targets[0] === 'all')) {
      return installAll() ? 0 : 1;
    }

    let ok = true;
    for (const target of targets) {
      if (!installSkill(target)) {
        ok = false;
      }
    }
    return ok ? 0 : 1;
  }

  fail(`Unknown command "${command}".`);
  return 1;
}

try {
  process.exitCode = main();
} catch (error) {
  // Guarantee a non-zero exit code for any unexpected failure, and surface a
  // clear message instead of an unhandled stack trace.
  fail(`Unexpected error: ${error && error.stack ? error.stack : error}`);
  process.exitCode = 1;
}
