import { createI18n } from "vue-i18n";

function loadLocaleMessages() {
  const locales = require.context("./locales", true, /[-_A-Za-z0-9]+\.json$/i);
  const messages = {} as any;
  locales.keys().forEach((key) => {
    const matched = key.match(/([-_A-Za-z0-9]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

export default createI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || "en",
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
  messages: loadLocaleMessages(),
});
