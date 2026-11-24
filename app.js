(() => {
  const scenarios = {
    irrigation: {
      plot: 'Plot 01 · Grapes · Drip irrigation',
      title: 'Irrigation review',
      reason: 'The demo forecast and soil reading suggest reviewing a short irrigation run.',
      task: 'Run drip irrigation',
      fee: 'No charge in demo',
      reasoning: 'This example combines a low soil-moisture reading, the next-day forecast and the plot’s task history. A real deployment would require calibrated field data and agronomic validation.',
      proposal: 'Irrigation review proposed',
      completed: 'Irrigation run verified',
      detail: 'Plot 01 · Demo controller and flow confirmation',
      completion: 'A demo task was approved and marked verified. No equipment was operated.',
      finalStatus: 'Verified',
      state: 'done'
    },
    pressure: {
      plot: 'Plot 02 · Pomegranate · Drip irrigation',
      title: 'Pressure anomaly',
      reason: 'A sample pressure reading is below the plot’s expected range. Inspect the line before running irrigation.',
      task: 'Request line inspection',
      fee: 'No charge in demo',
      reasoning: 'This example compares a pump pressure reading with a configured plot threshold. A real product would also check sensor health and avoid treating one reading as a diagnosis.',
      proposal: 'Pressure anomaly flagged',
      completed: 'Inspection requested',
      detail: 'Plot 02 · Completion proof still needed',
      completion: 'The demo logged an exception. It did not mark the field work complete or bill a task.',
      finalStatus: 'Exception',
      state: 'alert'
    },
    crew: {
      plot: 'Plot 03 · Vegetables · Crew managed',
      title: 'Crew check-in',
      reason: 'A demo worker has checked in for a scheduled field task. Review the report before closing the job.',
      task: 'Review crew report',
      fee: 'No charge in demo',
      reasoning: 'A check-in shows that someone reported arriving. A real workflow would define the proof needed for this particular task before calling the work complete.',
      proposal: 'Crew check-in received',
      completed: 'Report reviewed',
      detail: 'Plot 03 · Field completion still unverified',
      completion: 'The demo recorded the review. A check-in alone does not verify that the farm task was completed.',
      finalStatus: 'Proof pending',
      state: 'alert'
    }
  };

  const $ = (selector) => document.querySelector(selector);
  const all = (selector) => [...document.querySelectorAll(selector)];
  const els = {
    title: $('#action-title'), reason: $('#action-reason'), task: $('#action-task'),
    fee: $('#action-fee'), reasoning: $('#reasoning'), reasoningCopy: $('#reasoning-copy'),
    chip: $('#action-chip'), detail: $('#plot-detail'), approve: $('#approve-button'),
    review: $('#review-button'), message: $('#decision-message'), ledger: $('#ledger-list'),
    ledgerCount: $('#ledger-count'), openCount: $('#open-count'),
    topStatus: $('#top-status'), topStatusNote: $('#top-status-note')
  };
  let current = 'irrigation';
  let timer = null;

  function ledgerRow(title, detail, state, type) {
    const row = document.createElement('div');
    row.className = 'ledger-row';
    const dot = document.createElement('span');
    dot.className = `ledger-bullet ${type}`;
    const copy = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = title;
    const small = document.createElement('small');
    small.textContent = detail;
    copy.append(strong, small);
    const status = document.createElement('span');
    status.className = 'ledger-state';
    status.textContent = state;
    row.append(dot, copy, status);
    return row;
  }

  function selectScenario(key) {
    if (!scenarios[key]) return;
    clearTimeout(timer);
    current = key;
    const data = scenarios[key];
    els.title.textContent = data.title;
    els.reason.textContent = data.reason;
    els.task.textContent = data.task;
    els.fee.textContent = data.fee;
    els.reasoningCopy.textContent = data.reasoning;
    els.detail.textContent = data.plot;
    els.chip.textContent = 'Approval needed';
    els.chip.className = 'status-chip';
    els.approve.disabled = false;
    els.approve.textContent = key === 'irrigation' ? 'Approve task' : 'Review action';
    els.message.textContent = '';
    els.reasoning.hidden = true;
    els.review.textContent = 'View reasoning';
    els.openCount.textContent = '01';
    els.topStatus.textContent = 'Review';
    els.topStatusNote.textContent = 'Action proposed';
    els.ledger.replaceChildren(ledgerRow(data.proposal, data.plot, 'Open', 'waiting'));
    els.ledgerCount.textContent = '1 demo entry';
    all('.scenario').forEach((button) => {
      const active = button.dataset.scenario === key;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    all('.map-plot').forEach((button) => button.classList.toggle('selected', button.dataset.map === key));
  }

  function approve() {
    const data = scenarios[current];
    const approvedKey = current;
    els.approve.disabled = true;
    els.chip.textContent = 'Processing demo';
    els.message.textContent = 'Recording your decision in the demo ledger…';
    els.topStatus.textContent = 'Running';
    els.topStatusNote.textContent = 'Demo workflow';
    timer = window.setTimeout(() => {
      if (current !== approvedKey) return;
      els.ledger.prepend(ledgerRow(data.completed, data.detail, data.finalStatus, data.state));
      els.ledgerCount.textContent = '2 demo entries';
      els.chip.textContent = data.finalStatus;
      els.chip.className = `status-chip ${data.state}`;
      els.openCount.textContent = data.state === 'done' ? '00' : '01';
      els.topStatus.textContent = data.finalStatus;
      els.topStatusNote.textContent = data.state === 'done' ? 'Demo task closed' : 'Needs follow-up';
      els.message.textContent = data.completion;
    }, 850);
  }

  all('.scenario').forEach((button) => button.addEventListener('click', () => selectScenario(button.dataset.scenario)));
  all('.map-plot').forEach((button) => button.addEventListener('click', () => selectScenario(button.dataset.map)));
  els.approve.addEventListener('click', approve);
  els.review.addEventListener('click', () => {
    els.reasoning.hidden = !els.reasoning.hidden;
    els.review.textContent = els.reasoning.hidden ? 'View reasoning' : 'Hide reasoning';
  });
  $('#reset-demo').addEventListener('click', () => selectScenario(current));

  const menu = $('.menu-toggle');
  const nav = $('.site-nav');
  menu.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
  });
  all('.site-nav a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  }));
  selectScenario('irrigation');
})();
