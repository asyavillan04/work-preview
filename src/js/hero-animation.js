// =============================================
// Вспомогательные функции
// =============================================

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeWriter(element, text, speed = 40) {
  if (element.dataset.typing === 'true') return;
  element.dataset.typing = 'true';

  const line = element.nextElementSibling;
  element.textContent = '';
  for (let i = 0; i < text.length; i++) {
    element.textContent += text[i];
    if (line && line.classList.contains('typing-line')) {
      const progress = (i + 1) / text.length;
      line.style.width = `${progress * 100}%`;
    }
    await delay(speed);
  }
}

async function animateTextParts(element, fullText, separator = ',', pause = 300) {
  const parts = fullText.split(separator).map(part => part.trim());
  element.textContent = '';
  element.style.opacity = '1';

  const spans = parts.map((part, i) => {
    const span = document.createElement('span');
    span.textContent = part;
    span.style.opacity = '0';
    span.style.transition = 'opacity 0.3s ease';
    if (i < parts.length - 1) {
      span.textContent += separator + ' ';
    }
    element.appendChild(span);
    return span;
  });

  for (const span of spans) {
    await delay(pause);
    span.style.opacity = '1';
  }
}

async function cascadeFadeIn(items, stagger = 200) {
  const elements = Array.from(items);
  elements.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('animate');
    }, index * stagger);
  });
  await delay(elements.length * stagger + 400);
}

// =============================================
// Основная анимационная последовательность
// =============================================
async function startHeroAnimation() {
  const featuresBlock = document.querySelector('.block.features');
  const skillsBlock = document.querySelector('.block.skills');
  const portfolioSection = document.querySelector('.portfolio');
  const contactsSection = document.querySelector('.contacts');

  // --- 1. Левый блок (features) ---
  if (featuresBlock) {
    await delay(100);
    featuresBlock.classList.add('animate');
    await delay(600);

    const title = featuresBlock.querySelector('h1');
    const line = featuresBlock.querySelector('.typing-line');
    const text = title?.dataset.text;
    if (title && text) await typeWriter(title, text, 40);
    if (line) line.classList.add('visible');

    const subtitle = featuresBlock.querySelector('h3');
    if (subtitle) await animateTextParts(subtitle, subtitle.textContent, ',', 300);

    const featureItems = featuresBlock.querySelectorAll('.features__feature-wrapper');
    if (featureItems.length > 0) {
      await cascadeFadeIn(featureItems, 200);
    }
  }

  // --- 2. Правый блок (skills) ---
  if (skillsBlock) {
    skillsBlock.classList.add('animate');
    await delay(600);

    const title = skillsBlock.querySelector('h1');
    const text = title?.dataset.text;
    if (title && text) await typeWriter(title, text, 40);

    // Каскадное появление подзаголовков и технологий
    const skillItems = skillsBlock.querySelectorAll('h3, h2');
    if (skillItems.length > 0) {
      skillItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('animate');
        }, index * 200); // задержка 200 мс между элементами
      });
      // Ждём завершения всех анимаций
      await delay(skillItems.length * 200 + 400);
    }
  }

  // --- 3. Блок портфолио (снизу) ---
  if (portfolioSection) {
    portfolioSection.classList.add('animate');
    await delay(600);
  }

  // --- 4. Контакты (слева направо) ---
  if (contactsSection) {
    contactsSection.classList.add('animate');
    await delay(600);
  }

  // После завершения всех анимаций инициализируем портфолио и скролл
  await initPortfolio();
}

// =============================================
// Интерактивное раскрытие/закрытие портфолио
// =============================================
async function initPortfolio() {
  const portfolio = document.querySelector('.portfolio');
  if (!portfolio) return;

  await delay(800); // даём время на появление

  const openButton = portfolio.querySelector('.portfolio_portfolio-open-button');
  if (!openButton) {
    console.warn('Кнопка открытия портфолио не найдена.');
    return;
  }

  // Обработчик кнопки
  openButton.addEventListener('click', () => {
    togglePortfolio(portfolio);
  });

  // Обработчик клавиши
  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'ArrowDown' &&
      portfolio.classList.contains('portfolio--collapsed') &&
      document.activeElement === document.body
    ) {
      event.preventDefault();
      togglePortfolio(portfolio);
    }
  });

  // Инициализируем скролл для содержимого портфолио
  initPortfolioScroll();
}

function togglePortfolio(portfolio) {
  const title = portfolio.querySelector('.portfolio__portfolio-title');
  if (!title) return;

  if (portfolio.classList.contains('portfolio--collapsed')) {
    // ОТКРЫВАЕМ: показываем контент и прокручиваем вверх
    portfolio.classList.remove('portfolio--collapsed');
    title.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    // ЗАКРЫВАЕМ: сворачиваем контент и прокручиваем вниз
    portfolio.classList.add('portfolio--collapsed');
    const rect = title.getBoundingClientRect();
    const titleAbsoluteTop = rect.top + window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const titleHeight = rect.height;
    const scrollTarget = titleAbsoluteTop - viewportHeight + titleHeight;
    window.scrollTo({
      top: Math.max(0, scrollTarget),
      behavior: 'smooth'
    });
  }
}

// =============================================
// Скролл для карточек проектов
// =============================================
function initPortfolioScroll() {
  const projectsContent = document.querySelector('.portfolio__portfolio-content');
  const btnLeft = document.querySelector('.portfolio__portfolio-scroll-btn-left');
  const btnRight = document.querySelector('.portfolio__portfolio-scroll-btn-right');

  if (!projectsContent || !btnLeft || !btnRight) {
    console.warn('Не найдены элементы для скролла портфолио');
    return;
  }

  const card = document.querySelector('.project-card');
  const gap = parseInt(getComputedStyle(projectsContent).columnGap) || 0;
  const scrollAmount = card ? card.offsetWidth + gap : 300 + gap;

  function scrollLeft() {
    projectsContent.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }
  function scrollRight() {
    projectsContent.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  btnLeft.addEventListener('click', scrollLeft);
  btnRight.addEventListener('click', scrollRight);

  function updateButtonsVisibility() {
    const maxScrollLeft = projectsContent.scrollWidth - projectsContent.clientWidth;
    btnLeft.style.opacity = projectsContent.scrollLeft <= 0 ? '0' : '1';
    btnLeft.style.pointerEvents = projectsContent.scrollLeft <= 0 ? 'none' : 'auto';
    btnRight.style.opacity = projectsContent.scrollLeft >= maxScrollLeft - 1 ? '0' : '1';
    btnRight.style.pointerEvents = projectsContent.scrollLeft >= maxScrollLeft - 1 ? 'none' : 'auto';
  }

  projectsContent.addEventListener('scroll', updateButtonsVisibility);
  updateButtonsVisibility();
}

function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark-theme', prefersDark);
    } else {
        root.classList.toggle('dark-theme', theme === 'dark');
    }
    localStorage.setItem('app-theme', theme);
}

function initThemeSwitcher() {
    const container = document.querySelector('[data-dropdown="theme"]');
    if (!container) return;

    const trigger = container.querySelector('.header-button');
    const menu = container.querySelector('.settings-dropdown__menu');
    const options = container.querySelectorAll('.option');

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

// =============================================
// Запуск после готовности DOM
// =============================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    startHeroAnimation();
    initThemeSwitcher(); 
});
} else {
  startHeroAnimation();
}