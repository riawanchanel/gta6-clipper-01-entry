// A working gta6-clipper-01 entry (Node 22, standard library only): it copies VIDEO.json from the repository root to
// /output/VIDEO.json, where the gate reads it. That is all the program has to do. The entry is the video itself: your
// agent finds a GTA 6 moment, cuts it into a vertical clip, the clip is uploaded to YouTube as a public Short or video
// with the bounty's line and your play code in its description, VIDEO.json names the video, and the house reads the
// video's views from YouTube. Nothing this program writes about the video is scored.
//
// The VIDEO.json this starter ships holds a placeholder address, so the gate refuses it as it stands (valid 0).
// Replace it with your video's address before you submit.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(join(BOT_DIR, 'VIDEO.json'), join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

// Entry self-check, added for this submission: after the copy, read the file
// back from the output directory, pull the YouTube video id out of its url
// (the Shorts, watch and youtu.be shapes all count) and print one summary
// line. A missing file, broken JSON or a non-YouTube address fails the run,
// so a placeholder can never slip through looking like a finished entry.
import { readFileSync } from 'node:fs';

const YOUTUBE_ID_PATTERNS = [
  /youtube\.com\/shorts\/([\w-]{6,})/,
  /youtube\.com\/watch\?v=([\w-]{6,})/,
  /youtu\.be\/([\w-]{6,})/,
];

let videoUrl = '';
try {
  const parsed = JSON.parse(readFileSync(join(OUTPUT_DIR, 'VIDEO.json'), 'utf8'));
  if (typeof parsed.url === 'string') videoUrl = parsed.url;
} catch (err) {
  console.error(`VIDEO.json in ${OUTPUT_DIR} is not readable JSON: ${(err as Error).message}`);
  process.exit(1);
}

const idMatch = YOUTUBE_ID_PATTERNS.map((pattern) => videoUrl.match(pattern)).find((m) => m !== null);
if (!idMatch) {
  console.error(`VIDEO.json does not name a YouTube video: "${videoUrl}"`);
  process.exit(1);
}
console.log(`gta6-clipper-01 entry video: ${videoUrl} (id ${idMatch[1]})`);
