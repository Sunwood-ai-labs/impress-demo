const allSteps = Array.from(document.querySelectorAll("#impress .step"));
const countedSteps = allSteps.filter(
  (step) => step.dataset.skipCounter !== "true"
);

const currentTitle = document.querySelector('[data-role="current-title"]');
const counter = document.querySelector('[data-role="counter"]');

const updateHud = (step) => {
  if (!step) {
    return;
  }

  const visibleSteps = countedSteps;
  const currentIndex = visibleSteps.indexOf(step);
  const safeIndex = currentIndex >= 0 ? currentIndex + 1 : visibleSteps.length;
  const label = step.dataset.title || step.id || "Slide";

  if (currentTitle) {
    currentTitle.textContent = label;
  }

  if (counter) {
    counter.textContent = `${safeIndex} / ${visibleSteps.length}`;
  }

  document.title = `${label} | draw-io-skill v0.1.0`;
};

window.addEventListener("DOMContentLoaded", () => {
  if (!window.impress) {
    return;
  }

  const api = window.impress();
  api.init();

  const initialStep = document.querySelector("#impress .step.active") || countedSteps[0];
  updateHud(initialStep);

  document.addEventListener("impress:stepenter", (event) => {
    updateHud(event.target);
  });
});
