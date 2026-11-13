export function createView() {
  return { yaw: .59, pitch: .58, distance: 128, x: 0, z: 2 };
}
export function changeView(view, action, a = 0, b = 0) {
  if (action === 'orbit') {
    view.yaw -= a * .006;
    view.pitch = Math.max(.12, Math.min(1.52, view.pitch + b * .006));
  }
  if (action === 'zoom') view.distance = Math.max(25, Math.min(235, view.distance * Math.exp(a)));
  if (action === 'pan') {
    const scale = view.distance * .0015;
    view.x = Math.max(-48, Math.min(48, view.x - (a * Math.cos(view.yaw) + b * Math.sin(view.yaw)) * scale));
    view.z = Math.max(-42, Math.min(42, view.z + (a * Math.sin(view.yaw) - b * Math.cos(view.yaw)) * scale));
  }
  if (action === 'reset') Object.assign(view, createView());
  if (action === 'top') Object.assign(view, { pitch: 1.52, distance: 145, x: 0, z: 0 });
  return view;
}

export function attachDistrictControls(canvas, pin, invalidate) {
  const view = createView();
  let enabled = false;
  const toolbar = document.createElement('div');
  toolbar.className = 'district-controls';
  toolbar.setAttribute('role', 'group');
  const copy = {
    fr: ['Explorer le quartier à 360°', 'Glissez : tourner · 2 doigts / clic droit : déplacer · + / − : zoom', 'Tourner à gauche', 'Tourner à droite', 'Rapprocher', 'Éloigner', 'Vue du dessus', 'Recentrer', 'Plein écran'],
    en: ['Explore the district in 360°', 'Drag: rotate · 2 fingers / right drag: pan · + / −: zoom', 'Rotate left', 'Rotate right', 'Zoom in', 'Zoom out', 'Top view', 'Reset view', 'Full screen'],
    ar: ['استكشف المجمع بزاوية 360°', 'اسحب للدوران · إصبعان أو الزر الأيمن للتحريك · + / − للتقريب', 'الدوران لليسار', 'الدوران لليمين', 'تقريب', 'إبعاد', 'منظر من الأعلى', 'إعادة المنظر', 'ملء الشاشة']
  };
  const actions = ['left', 'right', 'in', 'out', 'top', 'reset', 'fullscreen'];
  const icons = ['↶', '↷', '+', '−', '▱', '↺', '⛶'];
  const hint = document.createElement('p'); hint.className = 'district-help';
  canvas.tabIndex = 0;
  canvas.setAttribute('role', 'region');
  hint.id = `${canvas.id || 'villa-district'}-help`;
  canvas.setAttribute('aria-describedby', hint.id);
  async function act(action) {
    if (!enabled) return;
    if (action === 'left' || action === 'right') changeView(view, 'orbit', action === 'left' ? -35 : 35);
    else if (action === 'in' || action === 'out') changeView(view, 'zoom', action === 'in' ? -.16 : .16);
    else if (action === 'fullscreen') {
      try { if (document.fullscreenElement === pin) await document.exitFullscreen(); else await pin.requestFullscreen(); }
      catch { hint.textContent = copy[document.documentElement.lang]?.[1] || copy.fr[1]; }
    } else changeView(view, action);
    invalidate();
  }
  actions.forEach((action, i) => {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = icons[i];
    button.addEventListener('click', () => act(action)); toolbar.append(button);
  });
  pin.append(toolbar, hint);
  function translate() {
    const t = copy[document.documentElement.lang] || copy.fr;
    toolbar.setAttribute('aria-label', t[0]); canvas.setAttribute('aria-label', t[0]);
    hint.textContent = enabled ? t[1] : ({fr:'Défilez pour assembler le quartier. Le mode 360° sera disponible une fois tous les éléments au sol.',en:'Scroll to assemble the district. Explore in 360° once everything is on the ground.',ar:'مرّر لإنزال المباني. يتفعّل التحكم 360° بعد اكتمال المجمع على الأرض.'}[document.documentElement.lang] || 'Défilez pour assembler le quartier.');
    [...toolbar.children].forEach((button, i) => { button.title = t[i + 2]; button.setAttribute('aria-label', t[i + 2]); });
  }
  translate(); new MutationObserver(translate).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  const pointers = new Map();
  function pair() {
    const [a, b] = [...pointers.values()];
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, distance: Math.hypot(a.x - b.x, a.y - b.y) };
  }
  canvas.addEventListener('pointerdown', e => {
    if (!enabled) return;
    if (e.button !== 0 && e.button !== 2) return;
    canvas.focus({ preventScroll: true }); canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); canvas.classList.add('is-grabbing');
  });
  canvas.addEventListener('pointermove', e => {
    if (!enabled) return;
    const previous = pointers.get(e.pointerId); if (!previous) return;
    const before = pointers.size === 2 ? pair() : null;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const after = pair();
      if (before.distance > 0 && after.distance > 0) changeView(view, 'zoom', Math.log(before.distance / after.distance));
      changeView(view, 'pan', after.x - before.x, after.y - before.y);
    } else if (pointers.size === 1) changeView(view, e.buttons === 2 || e.shiftKey ? 'pan' : 'orbit', e.clientX - previous.x, e.clientY - previous.y);
    invalidate();
  });
  function release(e) { pointers.delete(e.pointerId); if (!pointers.size) canvas.classList.remove('is-grabbing'); }
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(event => canvas.addEventListener(event, release));
  canvas.addEventListener('contextmenu', e => { if (enabled) e.preventDefault(); });
  canvas.addEventListener('wheel', e => {
    // Keep page scrolling available until the visitor focuses the 3D view.
    if (!enabled || document.activeElement !== canvas) return;
    e.preventDefault(); changeView(view, 'zoom', Math.max(-.3, Math.min(.3, e.deltaY * .001))); invalidate();
  }, { passive: false });
  canvas.addEventListener('keydown', e => {
    if (!enabled) return;
    const keys = { ArrowLeft: 'left', ArrowRight: 'right', '+': 'in', '=': 'in', '-': 'out', '0': 'reset', Home: 'reset', t: 'top' };
    if (keys[e.key]) { e.preventDefault(); act(keys[e.key]); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); changeView(view, 'orbit', 0, e.key === 'ArrowUp' ? 20 : -20); invalidate(); }
    if (e.key === 'Escape') canvas.blur();
  });
  function setEnabled(value) {
    if (enabled === value && pin.dataset.controlsReady !== undefined) return;
    enabled = value;
    pin.dataset.controlsReady = String(value);
    toolbar.hidden = !value;
    canvas.tabIndex = value ? 0 : -1;
    if (!value) {
      for (const id of pointers.keys()) if (canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id);
      pointers.clear();canvas.classList.remove('is-grabbing');
      if (document.activeElement === canvas) canvas.blur();
      changeView(view, 'reset');
    }
    translate();
  }
  setEnabled(false);
  return {view, setEnabled};
}
