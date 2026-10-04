(function () {
  'use strict';
  // Public information stays in HTML. This script only adds small conveniences.
  const app = document.getElementById('app');
  const footer = document.getElementById('project-footer');
  if (app && footer) {
    const alignFooter = () => footer.classList.toggle('xi-footer-playing', Boolean(app.querySelector('.shell')));
    alignFooter();
    new MutationObserver(alignFooter).observe(app, {childList: true});
  }

  const button = document.getElementById('copy-pix');
  const code = document.getElementById('pix-code');
  const status = document.getElementById('pix-status');
  if (!button || !code || !status) return;
  button.hidden = false;
  button.addEventListener('click', async function () {
    button.disabled = true;
    status.textContent = '';
    let copied = false;
    try {
      if (window.isSecureContext && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code.value);
        copied = true;
      }
    } catch { /* Selection below also works when clipboard access is denied. */ }
    if (!copied) {
      code.focus();
      code.select();
      code.setSelectionRange(0, code.value.length);
      try { copied = typeof document.execCommand === 'function' && document.execCommand('copy'); } catch { /* Keep the code selected. */ }
    }
    status.textContent = copied
      ? 'Pix copiado! Cole no aplicativo do seu banco e confira o recebedor.'
      : 'Código selecionado. Use Copiar no celular ou Ctrl+C / ⌘C e cole no seu banco.';
    button.disabled = false;
    if (copied) button.focus({preventScroll: true});
  });
})();
