import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { chromium } from "playwright";

const presets = {
  presentation: {
    minFillRatio: 0.2,
    minContentBoundsRatio: 0.36,
    maxEdgeGapRatio: 0.48,
    topHeavyMaxCenterY: 0.38,
    topHeavyMinUpperHalfRatio: 0.78,
    topHeavyMaxLowerHalfFill: 0.09,
    topHeavyMinBottomGap: 0.44,
    allowedSparseIds: ["cover", "closing"],
    allowedTopHeavyIds: ["cover"],
  },
};

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

const rootDir = process.cwd();
const slideDir = path.join(rootDir, "slide");

const parseArgs = (argv) => {
  const targets = [];
  let preset = "presentation";
  let showMetrics = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--preset") {
      preset = argv[index + 1] || preset;
      index += 1;
      continue;
    }

    if (arg.startsWith("--preset=")) {
      preset = arg.slice("--preset=".length) || preset;
      continue;
    }

    if (arg === "--metrics") {
      showMetrics = true;
      continue;
    }

    targets.push(arg);
  }

  return { preset, showMetrics, targets };
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

const { preset: presetName, showMetrics, targets: cliTargets } = parseArgs(process.argv.slice(2));
const preset = presets[presetName];

if (!preset) {
  console.error(`Unknown preset: ${presetName}`);
  process.exit(1);
}

const targets = cliTargets.length > 0 ? cliTargets : collectDefaultTargets(slideDir);

if (targets.length === 0) {
  console.error("No slide index.html targets found.");
  process.exit(1);
}

const resolveRequestPath = (pathname) => {
  const decodedPath = decodeURIComponent(pathname);
  const normalizedPath = decodedPath === "/" ? "/index.html" : decodedPath;
  let filePath = path.resolve(rootDir, `.${normalizedPath}`);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  } else if (!path.extname(filePath)) {
    const candidate = path.join(filePath, "index.html");
    if (fs.existsSync(candidate)) {
      filePath = candidate;
    }
  }

  if (!filePath.startsWith(rootDir)) {
    return null;
  }

  return filePath;
};

const startServer = async () => {
  const server = http.createServer((req, res) => {
    try {
      const requestUrl = new URL(req.url || "/", "http://127.0.0.1");
      const filePath = resolveRequestPath(requestUrl.pathname);

      if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const type = mimeTypes[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": type });
      fs.createReadStream(filePath).pipe(res);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(String(error));
    }
  });

  await new Promise((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  return { server, port };
};

const occupiedSelectors = [
  ".callout",
  ".meta-pills",
  ".pill",
  ".hero-icon-grid",
  ".icon-tile",
  ".accent-stage",
  ".cards-grid",
  ".card",
  ".panel",
  ".compare-grid",
  ".compare-card",
  ".signal-band",
  ".merge-board",
  ".source-card",
  ".badge-grid",
  ".badge-card",
  ".loop-strip",
  ".loop-step",
  ".card-index",
  ".mini-label",
  ".eyebrow",
  "h1",
  "h2",
  "h3",
  "p",
  "ul",
  "ol",
  "table",
  ".footnote",
].join(",");

const detectWhitespace = async (page) => {
  return page.evaluate(
    async ({ occupiedSelectors }) => {
      await document.fonts.ready.catch(() => {});

      const existingRoot = document.getElementById("layout-audit-root");
      existingRoot?.remove();

      const existingStyle = document.getElementById("layout-audit-style");
      existingStyle?.remove();

      const style = document.createElement("style");
      style.id = "layout-audit-style";
      style.textContent = `
        #layout-audit-root {
          position: fixed;
          left: -20000px;
          top: 0;
          z-index: -1;
          opacity: 0;
          pointer-events: none;
        }

        #layout-audit-root .step {
          position: relative !important;
          transform: none !important;
          opacity: 1 !important;
          left: 0 !important;
          top: 0 !important;
          margin: 0 !important;
          transition: none !important;
          animation: none !important;
        }

        #layout-audit-root .overview-step {
          display: none !important;
        }
      `;
      document.head.appendChild(style);

      const root = document.createElement("div");
      root.id = "layout-audit-root";
      document.body.appendChild(root);

      const rows = 54;
      const cols = 86;

      const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

      const collectMetrics = (clone) => {
        const stepRect = clone.getBoundingClientRect();
        const cells = Array.from({ length: rows }, () => Array(cols).fill(false));
        const nodes = Array.from(clone.querySelectorAll(occupiedSelectors));

        for (const node of nodes) {
          const rect = node.getBoundingClientRect();

          if (rect.width < 10 || rect.height < 10) {
            continue;
          }

          const left = clamp(rect.left, stepRect.left, stepRect.right);
          const right = clamp(rect.right, stepRect.left, stepRect.right);
          const top = clamp(rect.top, stepRect.top, stepRect.bottom);
          const bottom = clamp(rect.bottom, stepRect.top, stepRect.bottom);

          if (right - left < 8 || bottom - top < 8) {
            continue;
          }

          const x1 = clamp(Math.floor(((left - stepRect.left) / stepRect.width) * cols), 0, cols - 1);
          const x2 = clamp(Math.ceil(((right - stepRect.left) / stepRect.width) * cols) - 1, 0, cols - 1);
          const y1 = clamp(Math.floor(((top - stepRect.top) / stepRect.height) * rows), 0, rows - 1);
          const y2 = clamp(Math.ceil(((bottom - stepRect.top) / stepRect.height) * rows) - 1, 0, rows - 1);

          for (let y = y1; y <= y2; y += 1) {
            for (let x = x1; x <= x2; x += 1) {
              cells[y][x] = true;
            }
          }
        }

        let occupied = 0;
        let minX = cols;
        let maxX = -1;
        let minY = rows;
        let maxY = -1;
        let topOccupied = 0;
        let bottomOccupied = 0;
        let leftOccupied = 0;
        let rightOccupied = 0;
        let sumX = 0;
        let sumY = 0;
        const rowMid = rows / 2;
        const colMid = cols / 2;

        for (let y = 0; y < rows; y += 1) {
          for (let x = 0; x < cols; x += 1) {
            if (!cells[y][x]) {
              continue;
            }

            occupied += 1;
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
            sumX += x + 0.5;
            sumY += y + 0.5;

            if (y < rowMid) {
              topOccupied += 1;
            } else {
              bottomOccupied += 1;
            }

            if (x < colMid) {
              leftOccupied += 1;
            } else {
              rightOccupied += 1;
            }
          }
        }

        if (occupied === 0) {
          return {
            fillRatio: 0,
            contentBoundsRatio: 0,
            gaps: {
              left: 1,
              right: 1,
              top: 1,
              bottom: 1,
            },
            halves: {
              upperRatio: 0,
              lowerRatio: 0,
              leftRatio: 0,
              rightRatio: 0,
            },
            halfFill: {
              upper: 0,
              lower: 0,
              left: 0,
              right: 0,
            },
            center: {
              x: 0,
              y: 0,
            },
          };
        }

        return {
          fillRatio: occupied / (rows * cols),
          contentBoundsRatio:
            ((maxX - minX + 1) / cols) * ((maxY - minY + 1) / rows),
          gaps: {
            left: minX / cols,
            right: (cols - maxX - 1) / cols,
            top: minY / rows,
            bottom: (rows - maxY - 1) / rows,
          },
          halves: {
            upperRatio: topOccupied / occupied,
            lowerRatio: bottomOccupied / occupied,
            leftRatio: leftOccupied / occupied,
            rightRatio: rightOccupied / occupied,
          },
          halfFill: {
            upper: topOccupied / (rowMid * cols),
            lower: bottomOccupied / (rowMid * cols),
            left: leftOccupied / (rows * colMid),
            right: rightOccupied / (rows * colMid),
          },
          center: {
            x: sumX / occupied / cols,
            y: sumY / occupied / rows,
          },
        };
      };

      const sections = Array.from(document.querySelectorAll("#impress section.step")).filter(
        (section) => section.id !== "overview"
      );

      const metrics = [];

      for (const section of sections) {
        const frame = document.createElement("div");
        const clone = section.cloneNode(true);
        clone.removeAttribute("style");
        clone.classList.add("active");
        clone.classList.remove("future", "past", "present");

        frame.appendChild(clone);
        root.appendChild(frame);

        const sectionMetrics = collectMetrics(clone);
        metrics.push({
          id: section.id || "unknown",
          title: section.dataset.title || section.id || "Slide",
          ...sectionMetrics,
        });
      }

      root.remove();
      style.remove();

      return metrics;
    },
    { occupiedSelectors }
  );
};

let warningCount = 0;
let browser;
let server;

try {
  const serverHandle = await startServer();
  server = serverHandle.server;
  const baseUrl = `http://127.0.0.1:${serverHandle.port}/`;

  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1600, height: 900 },
  });
  const page = await context.newPage();

  for (const relativeTarget of targets) {
    const normalizedTarget = relativeTarget.replace(/\\/g, "/");
    const targetUrl = new URL(normalizedTarget, baseUrl).toString();
    await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
    const metrics = await detectWhitespace(page);
    const targetWarnings = [];

    for (const metric of metrics) {
      const maxEdgeGap = Math.max(
        metric.gaps.left,
        metric.gaps.right,
        metric.gaps.top,
        metric.gaps.bottom
      );

      const sparseAllowed = preset.allowedSparseIds.includes(metric.id);
      const topHeavyAllowed = preset.allowedTopHeavyIds.includes(metric.id);

      if (metric.fillRatio < preset.minFillRatio && !sparseAllowed) {
        targetWarnings.push(
          `[${metric.id}] fill ratio ${metric.fillRatio.toFixed(3)} < ${preset.minFillRatio.toFixed(3)} (${metric.title})`
        );
      }

      if (metric.contentBoundsRatio < preset.minContentBoundsRatio && !sparseAllowed) {
        targetWarnings.push(
          `[${metric.id}] content bounds ratio ${metric.contentBoundsRatio.toFixed(3)} < ${preset.minContentBoundsRatio.toFixed(3)} (${metric.title})`
        );
      }

      if (maxEdgeGap > preset.maxEdgeGapRatio && metric.fillRatio < preset.minFillRatio + 0.04) {
        targetWarnings.push(
          `[${metric.id}] edge gap ${maxEdgeGap.toFixed(3)} > ${preset.maxEdgeGapRatio.toFixed(3)} (${metric.title})`
        );
      }

      if (
        !topHeavyAllowed &&
        metric.center.y < preset.topHeavyMaxCenterY &&
        metric.halves.upperRatio > preset.topHeavyMinUpperHalfRatio &&
        metric.halfFill.lower < preset.topHeavyMaxLowerHalfFill &&
        metric.gaps.bottom > preset.topHeavyMinBottomGap
      ) {
        targetWarnings.push(
          `[${metric.id}] top-heavy layout: centerY=${metric.center.y.toFixed(3)}, upperRatio=${metric.halves.upperRatio.toFixed(3)}, lowerHalfFill=${metric.halfFill.lower.toFixed(3)}, bottomGap=${metric.gaps.bottom.toFixed(3)} (${metric.title})`
        );
      }
    }

    if (targetWarnings.length === 0) {
      console.log(`PASS ${relativeTarget} (${presetName})`);
    } else {
      warningCount += targetWarnings.length;
      console.log(`WARN ${relativeTarget} (${presetName})`);
      for (const warning of targetWarnings) {
        console.log(`  - ${warning}`);
      }
    }

    if (showMetrics) {
      for (const metric of metrics) {
        console.log(
          `  · ${metric.id}: fill=${metric.fillRatio.toFixed(3)} bounds=${metric.contentBoundsRatio.toFixed(3)} gaps(l=${metric.gaps.left.toFixed(3)}, r=${metric.gaps.right.toFixed(3)}, t=${metric.gaps.top.toFixed(3)}, b=${metric.gaps.bottom.toFixed(3)}) halves(u=${metric.halves.upperRatio.toFixed(3)}, d=${metric.halves.lowerRatio.toFixed(3)}) halfFill(u=${metric.halfFill.upper.toFixed(3)}, d=${metric.halfFill.lower.toFixed(3)}) center(y=${metric.center.y.toFixed(3)})`
        );
      }
    }
  }

  await context.close();
} finally {
  await browser?.close().catch(() => {});
  await new Promise((resolve) => server?.close(() => resolve()));
}

if (warningCount > 0) {
  console.error(`Found ${warningCount} whitespace warnings.`);
  process.exit(1);
}
