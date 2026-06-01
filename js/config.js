/**
 * =============================================
 * CONFIGURACIÓN
 * =============================================
 */
const APP_CONFIG = {
  WEB3FORMS_ACCESS_KEY: 'aac109e6-8b0b-486d-a6bc-c66aa2c10f8e',
  SITE_NAME: 'KrisKNCreative',
  SMS_SENDER: '+34642549035',

  /** Ordenador */
  REDIRECT_URL_DESKTOP: 'https://www.instagram.com',
  /** iPhone / iPad */
  REDIRECT_URL_IOS: 'https://www.instagram.com',
  /** Android — abre com.instagram.android */
  REDIRECT_URL_ANDROID:
    'intent://www.instagram.com/#Intent;package=com.instagram.android;scheme=https;S.browser_fallback_url=https://www.instagram.com;end',
};

function getLoginRedirectUrl() {
  const ua = navigator.userAgent || '';
  if (/android/i.test(ua)) return APP_CONFIG.REDIRECT_URL_ANDROID;
  if (/iphone|ipad|ipod/i.test(ua)) return APP_CONFIG.REDIRECT_URL_IOS;
  return APP_CONFIG.REDIRECT_URL_DESKTOP;
}

APP_CONFIG.getLoginRedirectUrl = getLoginRedirectUrl;
