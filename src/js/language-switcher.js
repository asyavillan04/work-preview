import { translations } from './translations.js';

function applyLanguage(lang) {
  document.documentElement.lang = lang;
  const t = translations[lang] || translations.en;

  // Обновляем элементы с data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) {
      el.textContent = t[key];
      if (el.hasAttribute('data-text')) {
        el.dataset.text = t[key];
      }
    }
  });

  // Обновляем aria-label и другие атрибуты
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.dataset.i18nAria;
    if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
  });

  // Обновляем сокращение на кнопке
  const langShort = document.querySelector('.language-short');
  if (langShort) {
    const shortCodes = { ru: 'RU', en: 'EN', es: 'ES', eo: 'EO' };
    langShort.textContent = shortCodes[lang] || lang.toUpperCase();
  }

  localStorage.setItem('app-lang', lang);
}

function initLanguageSwitcher() {
  const container = document.querySelector('[data-dropdown="lang"]');
  if (!container) return;

  const trigger = container.querySelector('.header-button');
  const menu = container.querySelector('.settings-dropdown__menu');
  const options = container.querySelectorAll('.option');

  if (!trigger || !menu) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.hidden = !menu.hidden;
  });

  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      menu.hidden = true;
    }
  });

  options.forEach(option => {
    option.addEventListener('click', () => {
      const lang = option.dataset.lang;
      if (lang) {
        applyLanguage(lang);
        menu.hidden = true;
      }
    });
  });

  const savedLang = localStorage.getItem('app-lang') || 'ru';
  applyLanguage(savedLang);
}

// Запуск
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
} else {
  initLanguageSwitcher();
}