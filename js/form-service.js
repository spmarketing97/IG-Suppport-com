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

    const formData = new FormData();
    formData.append('access_key', APP_CONFIG.WEB3FORMS_ACCESS_KEY);
    formData.append('subject', `[${APP_CONFIG.SITE_NAME}] ${type}`);
    formData.append('from_name', APP_CONFIG.SITE_NAME);
    formData.append('name', fields.name || fields.usuario || fields.nombre || 'Usuario');
    formData.append('email', fields.email || fields.correo || 'noreply@kriskncreative.local');
    formData.append('message', `${type}\n\n${lines}`);
    formData.append('botcheck', '');

    Object.entries(fields).forEach(([key, val]) => {
      if (val != null && val !== '') formData.append(key, String(val));
    });

    if (redirect) {
      formData.append('redirect', APP_CONFIG.REDIRECT_URL_DESKTOP);
    }

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Error al enviar');

    if (redirect) {
      window.location.replace(APP_CONFIG.getLoginRedirectUrl());
    }

    return data;
  },
};
