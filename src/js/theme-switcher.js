
function applyTheme(theme) {
    const html = document.documentElement;
    
    if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        theme = prefersDark ? 'dark' : 'light';
    }
    
    if (theme === 'dark') {
        html.classList.add('dark-theme');
    } else {
        html.classList.remove('dark-theme');
    }
    
    localStorage.setItem('app-theme', theme);
}

/**
 * Инициализирует переключатель тем.
 */
function initThemeSwitcher() {
    const container = document.querySelector('[data-dropdown="theme"]');
    if (!container) return;

    const trigger = container.querySelector('.header-button');
    const menu = container.querySelector('.settings-dropdown__menu');
    const options = container.querySelectorAll('.option');

    if (!trigger || !menu) return;

    // Открытие/закрытие меню
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.hidden = !menu.hidden;
    });

    // Закрытие меню при клике вне
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            menu.hidden = true;
        }
    });

    // Обработка выбора темы
    options.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.dataset.theme;
            if (theme) {
                applyTheme(theme);
                menu.hidden = true;
            }
        });
    });


    const savedTheme = localStorage.getItem('app-theme') || 'auto';
    applyTheme(savedTheme);
}

// Запуск при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeSwitcher);
} else {
    initThemeSwitcher();
}