const $ = (id) => document.getElementById(id);
const MAX_DOTS = 200;

const dot = (cls = 'bg-slate-300') =>
	`<span class="inline-block h-3 w-3 rounded-full ${cls}"></span>`;

const orderCircle = (n, cls = 'bg-slate-700 text-white') =>
	`<span class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${cls}">${n}</span>`;

const emptyCircle = () =>
	`<span class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-slate-300"></span>`;

function dotsRow(count) {
	if (!count) return `<p class="text-sm text-slate-400">никого</p>`;
	const shown = Math.min(count, MAX_DOTS);
	const extra = count - shown;
	return `<div class="flex flex-wrap gap-1.5">${dot().repeat(shown)}${
		extra > 0 ? `<span class="text-xs text-slate-500">+${extra}</span>` : ''
	}</div>`;
}

function workerTile(label, orderNumber, chipClass) {
	return `
    <div class="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
      <span class="text-sm text-slate-600">${label}</span>
      ${orderNumber ? orderCircle(orderNumber, chipClass) : emptyCircle()}
    </div>`;
}

export function render(s) {
	$('order-line-count').textContent = s.orderLine;
	$('order-line-dots').innerHTML = dotsRow(s.orderLine);

	$('cashier-grid').innerHTML = s.cashiers
		.map((c, i) => workerTile(`Касса ${i + 1}`, c.taking, 'bg-indigo-600 text-white'))
		.join('');

	$('kitchen-count').textContent = s.kitchenWaiting.length;
	$('kitchen-tickets').innerHTML = s.kitchenWaiting.length
		? `<div class="flex flex-wrap gap-1.5">${s.kitchenWaiting
				.map((n) => orderCircle(n, 'bg-slate-200 text-slate-700 h-8 w-8 text-xs'))
				.join('')}</div>`
		: `<p class="text-sm text-slate-400">пусто</p>`;
	$('cook-grid').innerHTML = s.cooks
		.map((c, i) => workerTile(`Повар ${i + 1}`, c.cooking, 'bg-amber-600 text-white'))
		.join('');

	$('pickup').innerHTML = s.pickup
		? orderCircle(s.pickup, 'h-16 w-16 bg-emerald-600 text-white text-xl')
		: `<span class="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-slate-300 text-xs text-slate-400">—</span>`;
	$('serving-count').textContent = s.servingLine.length;
	$('serving-dots').innerHTML = dotsRow(s.servingLine.length);

	const running = s.running;
	$('start').disabled = running;
	$('stop').disabled = !running;
	$('arrival').disabled = running;
	$('cashier-count').disabled = running;
	$('cook-count').disabled = running;
}

export function showErrors(errors) {
	const box = $('errors');
	box.innerHTML = errors.map((e) => `<li>${e}</li>`).join('');
	box.classList.toggle('hidden', errors.length === 0);
}
