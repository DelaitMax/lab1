export function createStationList({ containerId, prefix, defaultSeconds }) {
  const container = document.getElementById(containerId);
  let rows = [{ id: `${prefix}1`, value: String(defaultSeconds) }];

  function render(disabled) {
    container.innerHTML = rows
      .map(
        (row, i) => `
        <label class="flex items-center justify-between gap-3 rounded border border-slate-200 bg-white px-3 py-1.5 text-sm">
          <span class="text-slate-600">${prefix === "K" ? "Касса" : "Повар"} ${i + 1}, сек</span>
          <input
            data-row-id="${row.id}"
            value="${row.value}"
            inputmode="decimal"
            class="w-16 rounded border border-slate-300 px-2 py-0.5 text-right disabled:bg-slate-100"
            ${disabled ? "disabled" : ""}
          />
        </label>`
      )
      .join("");
  }

  function setCount(count, disabled) {
    const clamped = Math.max(1, Math.min(6, count));
    if (clamped > rows.length) {
      for (let i = rows.length; i < clamped; i++) {
        rows.push({ id: `${prefix}${i + 1}`, value: String(defaultSeconds) });
      }
    } else {
      rows = rows.slice(0, clamped);
    }
    render(disabled);
    return clamped;
  }

  function setDisabled(disabled) {
    render(disabled);
  }

  function readValues() {
    rows = rows.map((row) => ({
      ...row,
      value: container.querySelector(`[data-row-id="${row.id}"]`)?.value ?? row.value,
    }));
    return rows.map((row, i) => ({ id: `${prefix}${i + 1}`, label: `${prefix === "K" ? "Касса" : "Повар"} ${i + 1}`, raw: row.value }));
  }

  render(false);
  return { setCount, setDisabled, readValues, get count() { return rows.length; } };
}
