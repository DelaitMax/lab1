import "./style.css";
import { Simulation } from "./Simulation.js";
import { validate } from "./validation.js";
import { render, showErrors } from "./ui.js";
import { createStationList } from "./stations.js";

const sim = new Simulation();
sim.events.subscribe(render);

const cashierList = createStationList({ containerId: "cashier-settings", prefix: "K", defaultSeconds: 1 });
const cookList = createStationList({ containerId: "cook-settings", prefix: "P", defaultSeconds: 3 });

const cashierCountInput = document.getElementById("cashier-count");
const cookCountInput = document.getElementById("cook-count");

cashierCountInput.addEventListener("focus", (e) => e.target.select());
cookCountInput.addEventListener("focus", (e) => e.target.select());

cashierCountInput.addEventListener("change", (e) => {
  e.target.value = cashierList.setCount(Number(e.target.value) || 1, false);
});
cookCountInput.addEventListener("change", (e) => {
  e.target.value = cookList.setCount(Number(e.target.value) || 1, false);
});

document.getElementById("start").addEventListener("click", () => {
  const result = validate({
    arrivalRaw: document.getElementById("arrival").value,
    cashiers: cashierList.readValues(),
    cooks: cookList.readValues(),
  });
  showErrors(result.errors);
  if (result.errors.length) return;

  cashierList.setDisabled(true);
  cookList.setDisabled(true);
  sim.start(result.config);
});

document.getElementById("stop").addEventListener("click", () => {
  sim.stop();
  cashierList.setDisabled(false);
  cookList.setDisabled(false);
});

render(sim.snapshot());
