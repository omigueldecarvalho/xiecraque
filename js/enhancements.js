(function () {
  'use strict';

  const KEY = 'onze-de-ouro-save-v1';
  const D = window.OuroData;
  const E = window.OuroEngine;
  if (!D || !E) return;

  const hash = (value) => {
    let h = 2166136261;
    for (const char of String(value || '')) h = Math.imul(h ^ char.charCodeAt(0), 16777619);
    return h >>> 0;
  };

  const colors = {
    backgrounds: ['#293e55', '#3e4b36', '#573c4b', '#304b4e', '#4a3f32', '#343b58'],
    skins: ['#e3aa7c', '#c98761', '#efbc8e', '#9d5f43', '#d89a72'],
    hair: ['#17191f', '#302218', '#563a27', '#7a502c', '#201d2a']
  };

  const crestDefaults = {
    crestShape: 'shield',
    crestPattern: 'split',
    crestMark: 'star',
    crestShowLabel: true,
    crestLabelColor: '#ffffff'
  };
  const crestChoices = {
    shape: [['shield', 'Escudo'], ['round', 'Redondo'], ['diamond', 'Diamante'], ['banner', 'Faixa']],
    pattern: [['split', 'Dividido'], ['stripe', 'Diagonal'], ['bands', 'Faixas'], ['dots', 'Bolinhas'], ['solid', 'Liso']],
    mark: [['star', 'Estrela'], ['ball', 'Bola'], ['bolt', 'Raio'], ['crown', 'Coroa'], ['none', 'Sem símbolo']]
  };

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const validChoice = (group, value) => crestChoices[group].some(([id]) => id === value) ? value : crestDefaults[`crest${group[0].toUpperCase()}${group.slice(1)}`];
  const validColor = (value, fallback) => /^#[\da-f]{6}$/i.test(value || '') ? value : fallback;

  let setupCrestDraft = {};

  function crestOptions(group, selected) {
    return crestChoices[group].map(([id, label]) => `<option value="${id}" ${id === selected ? 'selected' : ''}>${label}</option>`).join('');
  }

  function crestEditor(config = {}, prefix = 'setup', includeColors = false) {
    const shape = validChoice('shape', config.crestShape || crestDefaults.crestShape);
    const pattern = validChoice('pattern', config.crestPattern || crestDefaults.crestPattern);
    const mark = validChoice('mark', config.crestMark || crestDefaults.crestMark);
    const showLabel = config.crestShowLabel !== false;
    const labelColor = validColor(config.crestLabelColor, crestDefaults.crestLabelColor);
    const short = String(config.short || 'XI').replace(/[^a-z0-9]/gi, '').slice(0, 3).toUpperCase() || 'XI';
    const primary = validColor(config.color, '#bcf269');
    const secondary = validColor(config.secondary, '#172b24');
    const preview = `<span class="crest crest-editor-crest" data-crest-shape="${shape}" data-crest-pattern="${pattern}" data-crest-mark="${mark}" data-crest-show-label="${showLabel}" data-crest-label-color="${labelColor}" style="--crest-color:${primary};--crest-secondary:${secondary}">${short}</span>`;
    return `<div class="crest-builder" data-crest-editor="${prefix}">
      <div class="crest-preview">${preview}<small>Prévia do escudo</small></div>
      <div class="crest-controls">
        <label class="field"><span>Formato</span><select id="${prefix}-crest-shape">${crestOptions('shape', shape)}</select></label>
        <label class="field"><span>Padrão</span><select id="${prefix}-crest-pattern">${crestOptions('pattern', pattern)}</select></label>
        <label class="field"><span>Símbolo</span><select id="${prefix}-crest-mark">${crestOptions('mark', mark)}</select></label>
        <label class="field crest-label-control"><span>Sigla no escudo</span><select id="${prefix}-crest-label"><option value="show" ${showLabel ? 'selected' : ''}>Mostrar sigla</option><option value="hide" ${showLabel ? '' : 'selected'}>Ocultar sigla</option></select></label>
        <div class="crest-color-row">${includeColors ? `<label class="color-field"><input type="color" id="${prefix}-crest-primary" value="${primary}" aria-label="Cor principal do escudo"><span>Principal</span></label><label class="color-field"><input type="color" id="${prefix}-crest-secondary" value="${secondary}" aria-label="Cor secundária do escudo"><span>Secundária</span></label>` : ''}<label class="color-field"><input type="color" id="${prefix}-crest-label-color" value="${labelColor}" aria-label="Cor da sigla do escudo"><span>Cor da sigla</span></label></div>
      </div>
    </div>`;
  }

  function avatarSvg(seed) { return window.OuroStory.avatar(seed); }

  function crestSvg(label, shape = 'shield', pattern = 'split', mark = 'star', showLabel = true, labelColor = crestDefaults.crestLabelColor) {
    const short = String(label || 'XI').replace(/[^a-z0-9]/gi, '').slice(0, 3).toUpperCase() || 'XI';
    const safeShape = ['shield', 'round', 'diamond', 'banner'].includes(shape) ? shape : 'shield';
    const safePattern = ['split', 'stripe', 'bands', 'dots', 'solid'].includes(pattern) ? pattern : 'split';
    const safeMark = ['star', 'ball', 'bolt', 'crown', 'none'].includes(mark) ? mark : 'star';
    const id = `crest-${hash(`${short}-${safeShape}-${safePattern}`)}`;
    const shapes = {
      shield: 'M7 5h50v31c0 16-11 27-25 31C18 63 7 52 7 36Z',
      round: 'M32 5a27 27 0 1 1 0 54a27 27 0 1 1 0-54Z',
      diamond: 'M32 4 58 30 32 66 6 30Z',
      banner: 'M9 7h46v12l4 4-4 4v28L32 65 9 55V27l-4-4 4-4Z'
    };
    const shapePath = shapes[safeShape];
    const clipShape = safeShape === 'round' ? '<circle cx="32" cy="32" r="27"/>' : `<path d="${shapePath}"/>`;
    const patternShape = safePattern === 'solid'
      ? ''
      : safePattern === 'split'
        ? '<rect x="32" y="0" width="32" height="72" fill="var(--crest-secondary,#1b242b)" opacity=".94"/>'
        : safePattern === 'stripe'
          ? '<path d="M-8 8h17l63 63H55Z" fill="var(--crest-secondary,#1b242b)" opacity=".92"/>'
          : safePattern === 'bands'
            ? '<path d="M0 25h64v12H0Zm0 25h64v9H0Z" fill="var(--crest-secondary,#1b242b)" opacity=".9"/>'
            : '<circle cx="18" cy="23" r="5" fill="var(--crest-secondary,#1b242b)" opacity=".82"/><circle cx="45" cy="37" r="5" fill="var(--crest-secondary,#1b242b)" opacity=".82"/><circle cx="23" cy="51" r="5" fill="var(--crest-secondary,#1b242b)" opacity=".82"/><circle cx="50" cy="54" r="3.5" fill="var(--crest-secondary,#1b242b)" opacity=".82"/>';
    const marks = {
      star: '<path d="m32 11 2.5 5.3 5.8.8-4.2 4.1 1 5.8-5.1-2.7-5.1 2.7 1-5.8-4.2-4.1 5.8-.8Z" fill="#fff0a7" stroke="#fff8d4" stroke-width=".8"/>',
      ball: '<circle cx="32" cy="18" r="5.5" fill="#fff" opacity=".9"/><path d="m32 14 2 3-2 2-2-2Z M27 18h3m4 0h3m-5 2v3" fill="none" stroke="var(--crest-secondary,#1b242b)" stroke-width="1"/>',
      bolt: '<path d="M35 10 25 20h7l-2 8 10-13h-7Z" fill="#fff0a7" stroke="#fff8d4" stroke-width=".8"/>',
      crown: '<path d="m24 15 5 5 3-7 3 7 5-5-2 10H26Z" fill="#fff0a7" stroke="#fff8d4" stroke-width=".8"/><path d="M26 27h12" stroke="#fff8d4" stroke-width="1.5"/>',
      none: ''
    };
    const safeLabelColor = validColor(labelColor, crestDefaults.crestLabelColor);
    const labelMarkup = showLabel ? `<text x="32" y="49" text-anchor="middle" fill="${safeLabelColor}">${short}</text>` : '';
    return `<svg class="crest-svg" viewBox="0 0 64 72" aria-hidden="true" focusable="false">
      <defs><clipPath id="${id}">${clipShape}</clipPath></defs>
      <g clip-path="url(#${id})"><rect width="64" height="72" fill="var(--crest-color,#bcf269)"/>${patternShape}</g>
      <path class="crest-outline" d="${shapePath}"/>
      ${marks[safeMark]}
      <path d="M17 13h30" stroke="#ffffff45" stroke-width="2" stroke-linecap="round"/>
      ${labelMarkup}
    </svg>`;
  }

  function enhanceAvatars(root) {
    root.querySelectorAll('.card-monogram, .mini-monogram').forEach((node) => {
      if (node.dataset.avatarEnhanced) return;
      const seed = node.dataset.avatarSeed || node.textContent.trim() || 'player';
      node.textContent = '';
      node.insertAdjacentHTML('afterbegin', avatarSvg(seed));
      node.dataset.avatarEnhanced = '1';
    });
  }

  function enhanceCrests(root) {
    root.querySelectorAll('.crest').forEach((node) => {
      if (node.dataset.crestEnhanced) return;
      const label = node.textContent.trim();
      node.textContent = '';
      const showLabel = node.dataset.crestShowLabel !== 'false';
      const labelColor = validColor(node.dataset.crestLabelColor, crestDefaults.crestLabelColor);
      node.insertAdjacentHTML('afterbegin', crestSvg(label, node.dataset.crestShape, node.dataset.crestPattern, node.dataset.crestMark, showLabel, labelColor));
      node.dataset.crestEnhanced = '1';
    });
  }

  function editorValues(prefix) {
    const editor = document.querySelector(`[data-crest-editor="${prefix}"]`);
    if (!editor) return { ...crestDefaults };
    return {
      crestShape: editor.querySelector(`#${prefix}-crest-shape`)?.value || crestDefaults.crestShape,
      crestPattern: editor.querySelector(`#${prefix}-crest-pattern`)?.value || crestDefaults.crestPattern,
      crestMark: editor.querySelector(`#${prefix}-crest-mark`)?.value || crestDefaults.crestMark,
      crestShowLabel: (editor.querySelector(`#${prefix}-crest-label`)?.value || 'show') !== 'hide',
      crestLabelColor: validColor(editor.querySelector(`#${prefix}-crest-label-color`)?.value, crestDefaults.crestLabelColor),
      color: editor.querySelector(`#${prefix}-crest-primary`)?.value,
      secondary: editor.querySelector(`#${prefix}-crest-secondary`)?.value
    };
  }

  function refreshEditorPreview(editor) {
    if (!editor) return;
    const prefix = editor.dataset.crestEditor;
    const values = editorValues(prefix);
    const short = prefix === 'setup'
      ? (document.querySelector('#club-short')?.value || 'XI')
      : (currentSave()?.club?.short || 'XI');
    const primary = values.color || document.querySelector('#club-primary')?.value || document.querySelector('input[name="primary"]')?.value || '#bcf269';
    const secondary = values.secondary || document.querySelector('#club-secondary')?.value || document.querySelector('input[name="secondary"]')?.value || '#172b24';
    const preview = editor.querySelector('.crest-editor-crest');
    if (!preview) return;
    preview.dataset.crestShape = values.crestShape;
    preview.dataset.crestPattern = values.crestPattern;
    preview.dataset.crestMark = values.crestMark;
    preview.dataset.crestShowLabel = String(values.crestShowLabel !== false);
    preview.dataset.crestLabelColor = validColor(values.crestLabelColor, crestDefaults.crestLabelColor);
    preview.style.setProperty('--crest-color', validColor(primary, '#bcf269'));
    preview.style.setProperty('--crest-secondary', validColor(secondary, '#172b24'));
    preview.dataset.crestEnhanced = '';
    preview.textContent = String(short).replace(/[^a-z0-9]/gi, '').slice(0, 3).toUpperCase() || 'XI';
    enhanceCrests(editor);
  }

  function injectSetupEditor(root) {
    const form = root.querySelector('#create-form');
    if (!form || form.querySelector('[data-crest-editor="setup"]')) return;
    const anchor = form.querySelector('.color-fields') || form.querySelector('.setup-label');
    if (!anchor) return;
    anchor.insertAdjacentHTML('afterend', `<span class="setup-label crest-editor-title">Crie o escudo do clube</span>${crestEditor({ ...crestDefaults, ...setupCrestDraft, short: form.querySelector('#club-short')?.value || 'XI', color: form.querySelector('input[name="primary"]')?.value, secondary: form.querySelector('input[name="secondary"]')?.value }, 'setup')}`);
    const editor = form.querySelector('[data-crest-editor="setup"]');
    const rememberCrest = () => { setupCrestDraft = editorValues('setup'); refreshEditorPreview(editor); };
    form.addEventListener('input', rememberCrest);
    form.addEventListener('change', rememberCrest);
    refreshEditorPreview(editor);
  }

  function injectSettingsEditor() {
    const modal = document.querySelector('#modal[open]');
    if (!modal || modal.querySelector('[data-crest-editor="club"]')) return;
    const title = modal.querySelector('.dialog-top h2');
    if (!title || title.textContent.trim() !== 'Seu jogo, do seu jeito') return;
    const save = currentSave();
    if (!save) return;
    const firstRule = modal.querySelector('.rule');
    if (!firstRule) return;
    firstRule.insertAdjacentHTML('beforebegin', `<section class="crest-settings"><div class="panel-heading"><div><h3>Identidade do clube</h3><p>Monte um escudo único com formas, padrões e cores.</p></div></div>${crestEditor(save.club, 'club', true)}<button class="btn secondary save-crest-btn" data-action="save-custom-crest">Salvar escudo</button></section>`);
    const editor = modal.querySelector('[data-crest-editor="club"]');
    editor.addEventListener('input', () => refreshEditorPreview(editor));
    editor.addEventListener('change', () => refreshEditorPreview(editor));
    refreshEditorPreview(editor);
  }

  let createWrapped = false;
  function wrapClubCreation() {
    if (createWrapped || !E.createClub) return;
    const original = E.createClub;
    E.createClub = function (options, seed) {
      const values = editorValues('setup');
      const crest = {
        crestShape: values.crestShape,
        crestPattern: values.crestPattern,
        crestMark: values.crestMark,
        crestShowLabel: values.crestShowLabel !== false,
        crestLabelColor: validColor(values.crestLabelColor, crestDefaults.crestLabelColor)
      };
      const created = original({ ...options, ...crest }, seed);
      Object.assign(created.club, crestDefaults, crest);
      const userTeam = created.teams?.find((team) => team.id === 'user');
      if (userTeam) Object.assign(userTeam, crestDefaults, crest);
      return created;
    };
    createWrapped = true;
  }

  function localToast(message) {
    const toast = document.querySelector('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('toast-show');
    window.setTimeout(() => toast.classList.remove('toast-show'), 4200);
  }

  function saveCustomCrest() {
    const save = currentSave();
    if (!save) return;
    const values = editorValues('club');
    values.color = validColor(values.color, save.club.color);
    values.secondary = validColor(values.secondary, save.club.secondary);
    Object.assign(save.club, values);
    const userTeam = save.teams?.find((team) => team.id === 'user');
    if (userTeam) Object.assign(userTeam, values);
    if (!E.validate(save)) {
      localToast('Não foi possível salvar este escudo.');
      return;
    }
    notifySave(save, 'Escudo atualizado.');
  }

  function addSimulationControl(root) {
    const identity = document.querySelector('.club-identity small');
    if (!identity || /Carreira concluída/i.test(identity.textContent)) return;
    root.querySelectorAll('.page-heading').forEach((heading) => {
      if (heading.querySelector('[data-action="simulate-all"]')) return;
      heading.insertAdjacentHTML('beforeend', '<button class="btn secondary simulate-all" data-action="simulate-all" title="Simular partidas até a quinta temporada, com pausas para prêmios e eventos">⏩ Simular tudo</button>');
    });
  }

  function addDragHint(root) {
    const toolbar = root.querySelector('.pitch-toolbar');
    if (toolbar && !toolbar.querySelector('.drag-hint')) {
      toolbar.insertAdjacentHTML('beforeend', '<small class="drag-hint">Arraste uma carta para trocar</small>');
    }
  }

  function currentSave() {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY) || 'null');
      return E.validate(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  function notifySave(save, feedback = 'Escalação atualizada.') {
    const value = JSON.stringify(save);
    try { localStorage.setItem(KEY, value); } catch { return; }
    let event;
    try {
      event = new StorageEvent('storage', { key: KEY, newValue: value, storageArea: localStorage });
    } catch {
      event = new Event('storage');
      Object.defineProperties(event, { key: { value: KEY }, newValue: { value } });
    }
    window.dispatchEvent(event);
    // The original app uses the storage listener for cross-tab updates. A
    // The original app uses the storage listener for cross-tab updates. Local
    // enhancements reuse that render path but replace its generic toast.
    window.setTimeout(() => {
      const toast = document.querySelector('#toast');
      if (toast && toast.textContent === 'Progresso atualizado pela outra aba.') toast.textContent = feedback;
    }, 0);
  }

  function infoFor(element, save) {
    if (!save) return null;
    const pitch = element.closest('.pitch-player');
    if (pitch) {
      const slot = Number(pitch.dataset.slot);
      return Number.isInteger(slot) && save.lineup[slot] ? { kind: 'slot', slot, id: save.lineup[slot] } : null;
    }
    const bench = element.closest('button[data-action="bench-picker"]');
    if (bench && save.bench.includes(bench.dataset.id)) return { kind: 'bench', index: save.bench.indexOf(bench.dataset.id), id: bench.dataset.id };
    return null;
  }

  function targetAt(x, y) {
    const element = document.elementFromPoint(x, y);
    return element && (element.closest('.pitch-player') || element.closest('button[data-action="bench-picker"]'));
  }

  function move(source, destination) {
    const save = currentSave();
    if (!save || save.phase === 'finished' || save.pendingPack || !source || !destination) return false;
    if (source.kind === destination.kind && source.kind === 'slot' && source.slot === destination.slot) return false;
    if (source.kind === destination.kind && source.kind === 'bench' && source.index === destination.index) return false;

    if (destination.kind === 'slot') {
      E.swap(save, destination.slot, source.id);
    } else if (source.kind === 'bench' && destination.kind === 'bench') {
      const incoming = save.bench[destination.index];
      save.bench[destination.index] = source.id;
      save.bench[source.index] = incoming;
    } else if (source.kind === 'slot' && destination.kind === 'bench') {
      const old = save.lineup[source.slot];
      const benchIndex = save.bench.indexOf(destination.id);
      if (benchIndex < 0) return false;
      save.lineup[source.slot] = destination.id;
      save.bench[benchIndex] = old;
      if (save.captain === old) save.captain = destination.id;
      E.updateObjectives(save);
    }

    E.updateObjectives(save);
    if (!E.validate(save)) return false;
    notifySave(save);
    return true;
  }

  let drag = null;
  let suppressClickUntil = 0;

  function clearDragStyles() {
    document.querySelectorAll('.drag-source, .drag-target').forEach((node) => node.classList.remove('drag-source', 'drag-target'));
  }

  function pointerDown(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const save = currentSave();
    const source = infoFor(event.currentTarget, save);
    if (!source || save.phase === 'finished' || save.pendingPack) return;
    drag = { id: event.pointerId, element: event.currentTarget, source, x: event.clientX, y: event.clientY, moved: false };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function pointerMove(event) {
    if (!drag || drag.id !== event.pointerId) return;
    const distance = Math.hypot(event.clientX - drag.x, event.clientY - drag.y);
    if (distance < 8 && !drag.moved) return;
    drag.moved = true;
    event.preventDefault();
    drag.element.classList.add('drag-source');
    const destinationElement = targetAt(event.clientX, event.clientY);
    document.querySelectorAll('.drag-target').forEach((node) => node.classList.remove('drag-target'));
    if (destinationElement && destinationElement !== drag.element) destinationElement.classList.add('drag-target');
  }

  function pointerUp(event) {
    if (!drag || drag.id !== event.pointerId) return;
    const active = drag;
    const destinationElement = targetAt(event.clientX, event.clientY);
    drag = null;
    clearDragStyles();
    if (!active.moved) return;
    suppressClickUntil = Date.now() + 750;
    event.preventDefault();
    const save = currentSave();
    const destination = destinationElement && infoFor(destinationElement, save);
    if (destination && move(active.source, destination)) {
      window.setTimeout(() => window.dispatchEvent(new Event('resize')), 0);
    }
  }

  function pointerCancel(event) {
    if (drag && drag.id === event.pointerId) drag = null;
    clearDragStyles();
  }

  function bindDrag(root) {
    root.querySelectorAll('.pitch-player, .bench button[data-action="bench-picker"]').forEach((element) => {
      if (element.dataset.dragBound) return;
      element.dataset.dragBound = '1';
      element.addEventListener('pointerdown', pointerDown);
      element.addEventListener('pointermove', pointerMove, { passive: false });
      element.addEventListener('pointerup', pointerUp);
      element.addEventListener('pointercancel', pointerCancel);
    });
  }

  function enhance(root = document) {
    wrapClubCreation();
    injectSetupEditor(root);
    injectSettingsEditor();
    addSimulationControl(root);
    enhanceAvatars(root);
    enhanceCrests(root);
    addDragHint(root);
    bindDrag(root);
  }

  // The game re-renders its main app and modal after almost every action.
  if (document.body) new MutationObserver(() => enhance(document)).observe(document.body, { childList: true, subtree: true });

  // The app's click delegate is registered before this script. Capture phase
  // prevents a completed drag from also opening the normal picker dialog.
  document.addEventListener('click', (event) => {
    if (Date.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    if (button.dataset.action === 'save-custom-crest') {
      event.preventDefault();
      event.stopImmediatePropagation();
      saveCustomCrest();
    } else if (button.dataset.action === 'reset-confirmed') {
      // The original app renders the setup screen immediately after this
      // action, so reset the one-shot guard before that render happens.
      setupCrestDraft = {};
    }
  }, true);

  window.setTimeout(() => enhance(document), 0);
})();
