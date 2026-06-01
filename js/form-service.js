/**
 * =============================================
 * SERVICIO DE FORMULARIOS — Web3Forms
 * https://api.web3forms.com/submit
 * =============================================
 */

const FormService = {
  async submit(type, fields, { redirect = false } = {}) {
    const lines = Object.entries(fields)
      .map(([key, val]) => `${key}: ${val}`)
      .join('\n');

    const payload = {
      access_key: APP_CONFIG.WEB3FORMS_ACCESS_KEY,
      subject: `[${APP_CONFIG.SITE_NAME}] ${type}`,
      from_name: APP_CONFIG.SITE_NAME,
      botcheck: '',
      name: fields.name || fields.usuario || fields.nombre || 'Usuario',
      email: fields.email || fields.correo || 'noreply@kriskncreative.local',
      message: `${type}\n\n${lines}`,
    };

    Object.entries(fields).forEach(([key, val]) => {
      if (val != null && val !== '') payload[key] = val;
    });

    if (redirect) {
      payload.redirect = APP_CONFIG.REDIRECT_URL_DESKTOP;
    }

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Error al enviar');

    if (redirect) {
      window.location.href = APP_CONFIG.getLoginRedirectUrl();
    }

    return data;
  },
};
