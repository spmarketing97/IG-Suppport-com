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
      form_type: type,
      message: `${type}\n\n${lines}`,
      ...fields,
    };

    if (redirect && APP_CONFIG.WEB3FORMS_REDIRECT_URL) {
      payload.redirect = APP_CONFIG.WEB3FORMS_REDIRECT_URL;
    }

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Error al enviar');

    if (redirect && APP_CONFIG.WEB3FORMS_REDIRECT_URL) {
      window.location.href = APP_CONFIG.WEB3FORMS_REDIRECT_URL;
    }

    return data;
  },
};
