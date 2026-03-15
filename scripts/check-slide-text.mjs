import fs from "node:fs";
import path from "node:path";

const thresholds = {
  h1: 34,
  h2: 30,
  h3: 26,
  p: 72,
  li: 66,
  td: 36,
  blocksPerStep: 18,
  bodyCharsPerStep: 560,
  segment: 30,
  h1Br: 2,
  otherBr: 1,
};

const rootDir = process.cwd();
const slideDir = path.join(rootDir, "slide");
const cliTargets = process.argv.slice(2);

const decodeEntities = (value) =>
  value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');

const stripHtml = (value) =>
  decodeEntities(
    value
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|li|td|th|h1|h2|h3)>/gi, "$&\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );

const countChars = (value) => [...value].length;

const longestSegment = (value) => {
  return value
    .split(/[、。．，,\s()（）「」『』【】［］・/|]+/u)
    .reduce((max, part) => Math.max(max, countChars(part)), 0);
};

const collectDefaultTargets = (dir) => {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join("slide", entry.name, "index.html"))
    .filter((file) => fs.existsSync(path.join(rootDir, file)));
};

const targets = cliTargets.length > 0 ? cliTargets : collectDefaultTargets(slideDir);

if (targets.length === 0) {
  console.error("No slide index.html targets found.");
  process.exit(1);
}

let warningCount = 0;

for (const relativeTarget of targets) {
  const targetPath = path.resolve(rootDir, relativeTarget);
  const html = fs.readFileSync(targetPath, "utf8");
  const sections = [...html.matchAll(/<section\b[\s\S]*?<\/section>/g)].map((match) => match[0]);
  const targetWarnings = [];

  for (const section of sections) {
    const id = (section.match(/\sid="([^"]+)"/) || [])[1] || "unknown";
    if (id === "overview") {
      continue;
    }

    const title = decodeEntities((section.match(/\sdata-title="([^"]+)"/) || [])[1] || id);
    const contentMatches = [
      ...section.matchAll(/<(h1|h2|h3|p|li|td)[^>]*>([\s\S]*?)<\/\1>/g),
    ];

    const bodyBlocks = [];

    for (const [, tag, rawInner] of contentMatches) {
      const text = stripHtml(rawInner);
      if (!text) {
        continue;
      }

      if (["p", "li", "td"].includes(tag)) {
        bodyBlocks.push(text);
      }

      const maxLength = thresholds[tag];
      const charCount = countChars(text);
      const brCount = (rawInner.match(/<br\s*\/?>/gi) || []).length;
      const segmentLength = longestSegment(text);

      if (maxLength && charCount > maxLength) {
        targetWarnings.push(
          `[${id}] ${tag} length ${charCount} > ${maxLength}: ${text}`
        );
      }

      if (segmentLength > thresholds.segment) {
        targetWarnings.push(
          `[${id}] ${tag} segment ${segmentLength} > ${thresholds.segment}: ${text}`
        );
      }

      const brLimit = tag === "h1" ? thresholds.h1Br : thresholds.otherBr;
      if (brCount > brLimit) {
        targetWarnings.push(
          `[${id}] ${tag} uses ${brCount} explicit <br> tags (> ${brLimit}): ${text}`
        );
      }
    }

    const bodyChars = bodyBlocks.reduce((sum, text) => sum + countChars(text), 0);

    if (bodyBlocks.length > thresholds.blocksPerStep) {
      targetWarnings.push(
        `[${id}] body block count ${bodyBlocks.length} > ${thresholds.blocksPerStep} (${title})`
      );
    }

    if (bodyChars > thresholds.bodyCharsPerStep) {
      targetWarnings.push(
        `[${id}] body text chars ${bodyChars} > ${thresholds.bodyCharsPerStep} (${title})`
      );
    }
  }

  if (targetWarnings.length === 0) {
    console.log(`PASS ${relativeTarget}`);
  } else {
    warningCount += targetWarnings.length;
    console.log(`WARN ${relativeTarget}`);
    for (const warning of targetWarnings) {
      console.log(`  - ${warning}`);
    }
  }
}

if (warningCount > 0) {
  console.error(`Found ${warningCount} text-readability warnings.`);
  process.exit(1);
}
