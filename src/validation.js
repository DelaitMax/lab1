const MAX_SECONDS = 60;

function parseSeconds(raw, label) {
  const value = String(raw).trim().replace(",", ".");
  if (value === "") return { error: `${label}: поле не заполнено.` };
  const num = Number(value);
  if (Number.isNaN(num)) return { error: `${label}: «${raw}» не число.` };
  if (num <= 0) return { error: `${label}: должно быть больше 0.` };
  if (num > MAX_SECONDS) return { error: `${label}: не больше ${MAX_SECONDS} секунд.` };
  return { value: num };
}

function parseWorkers(workers) {
  const errors = [];
  const parsed = [];
  for (const w of workers) {
    const result = parseSeconds(w.raw, w.label);
    if (result.error) errors.push(result.error);
    else parsed.push({ id: w.id, timeMs: result.value * 1000 });
  }
  return { errors, parsed };
}

export function validate({ arrivalRaw, cashiers, cooks }) {
  const arrival = parseSeconds(arrivalRaw, "Интервал прихода клиентов");
  const cashierResult = parseWorkers(cashiers);
  const cookResult = parseWorkers(cooks);

  const errors = [
    ...(arrival.error ? [arrival.error] : []),
    ...cashierResult.errors,
    ...cookResult.errors,
  ];
  if (!cashiers.length) errors.push("Нужна хотя бы одна касса.");
  if (!cooks.length) errors.push("Нужен хотя бы один повар.");

  if (errors.length) return { errors };

  return {
    errors: [],
    config: {
      arrivalMs: arrival.value * 1000,
      cashiers: cashierResult.parsed,
      cooks: cookResult.parsed,
    },
  };
}
