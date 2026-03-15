const allSteps = Array.from(document.querySelectorAll("#impress .step"));
const countedSteps = allSteps.filter(
  (step) => step.dataset.skipCounter !== "true"
);

const currentTitle = document.querySelector('[data-role="current-title"]');
const counter = document.querySelector('[data-role="counter"]');

const syncHudFromActiveStep = () => {
  const activeStep = document.querySelector("#impress .step.active") || countedSteps[0];
  updateHud(activeStep);
};

const updateHud = (step) => {
  if (!step) {
    return;
  }

  const currentIndex = countedSteps.indexOf(step);
  const safeIndex = currentIndex >= 0 ? currentIndex + 1 : countedSteps.length;
  const label = step.dataset.title || step.id || "Slide";
  const isOverview = step.dataset.skipCounter === "true";

  if (currentTitle) {
    currentTitle.textContent = label;
  }

  if (counter) {
    counter.textContent = isOverview ? "Overview" : `${safeIndex} / ${countedSteps.length}`;
  }

  document.title = `${label} | draw-io-skill v0.1.0 3D Presentation`;
};

window.addEventListener("DOMContentLoaded", () => {
  if (!window.impress) {
    return;
  }

  const api = window.impress();
  api.init();

  syncHudFromActiveStep();

  document.addEventListener("impress:stepenter", syncHudFromActiveStep);
  document.addEventListener("impress:steprefresh", syncHudFromActiveStep);
  window.addEventListener("hashchange", () => {
    window.requestAnimationFrame(syncHudFromActiveStep);
  });

  const observer = new MutationObserver(() => {
    syncHudFromActiveStep();
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });

  observer.observe(document.getElementById("impress"), {
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  });
});
