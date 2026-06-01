/**
 * =============================================
 * SERVICIO DE FORMULARIOS — Web3Forms
 * https://api.web3forms.com/submit
 * =============================================
 */

const FormService = {
  async submit(type, fields) {
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

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Error al enviar');
    return data;
  },
};
