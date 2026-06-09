// =============================================
// Вспомогательные функции
// =============================================

/**
 * Простая задержка (пауза).
 * @param {number} ms - Миллисекунды.
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Печатает текст по одному символу.
 * @param {HTMLElement} element - Элемент, в который выводится текст.
 * @param {string} text - Полный текст для печати.
 * @param {number} speed - Скорость печати (мс на символ).
 */
async function typeWriter(element, text, speed = 40) {
  if (element.dataset.typing === 'true') return; // защита от двойного запуска
  element.dataset.typing = 'true';

  const line = element.nextElementSibling; // предполагаем, что линия идёт сразу за заголовком
  element.textContent = '';
  for (let i = 0; i < text.length; i++) {
    element.textContent += text[i];
    // Если следующий элемент - линия, обновляем её ширину пропорционально прогрессу
    if (line && line.classList.contains('typing-line')) {
      const progress = (i + 1) / text.length;
      line.style.width = `${progress * 100}%`;
    }
    await delay(speed);
  }
}

/**
 * Показывает подзаголовок по частям (плавно, без дёрганий).
 * @param {HTMLElement} element - Элемент, в который выводится текст.
 * @param {string} fullText - Полный текст с разделителями.
 * @param {string} separator - Разделитель (по умолчанию ',').
 * @param {number} pause - Пауза между появлением частей (мс).
 */
async function animateTextParts(element, fullText, separator = ',', pause = 300) {
  const parts = fullText.split(separator).map(part => part.trim());
  element.textContent = '';
  element.style.opacity = '1'; // делаем элемент видимым

  // Создаём спаны для каждой части, задаём им нулевую прозрачность и переход
  const spans = parts.map((part, i) => {
    const span = document.createElement('span');
    span.textContent = part;
    span.style.opacity = '0';
    span.style.transition = 'opacity 0.3s ease';
    // Добавляем разделитель ко всем частям, кроме последней
    if (i < parts.length - 1) {
      span.textContent += separator + ' ';
    }
    element.appendChild(span);
    return span;
  });

  // Последовательно делаем их видимыми
  for (const span of spans) {
    await delay(pause);
    span.style.opacity = '1';
  }
}

/**
 * Каскадно показывает фичи.
 * @param {NodeList} items - Коллекция DOM-элементов.
 * @param {number} stagger - Задержка между появлением элементов (мс).
 */
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

  // --- 1. Левый блок (features) ---
  if (featuresBlock) {
    await delay(100);
    featuresBlock.classList.add('animate');
    await delay(600); // ждём, пока блок доедет

    // Печать заголовка и линии
    const title = featuresBlock.querySelector('h1');
    const line = featuresBlock.querySelector('.typing-line');
    const text = title?.dataset.text;
    if (title && text) await typeWriter(title, text, 40);
    if (line) line.classList.add('visible');

    // Подзаголовок по частям
    const subtitle = featuresBlock.querySelector('h3');
    if (subtitle) await animateTextParts(subtitle, subtitle.textContent, ',', 300);

    // Каскадное появление фич
    const featureItems = featuresBlock.querySelectorAll('.features__feature-wrapper');
    if (featureItems.length > 0) {
      await cascadeFadeIn(featureItems, 200);
    }
  }

  // --- 2. Правый блок (skills) ---
  if (skillsBlock) {
    skillsBlock.classList.add('animate');
    await delay(600); // ждём, пока блок доедет

    const title = skillsBlock.querySelector('h1');
    const text = title?.dataset.text;
    if (title && text) await typeWriter(title, text, 40);
  }

  // --- 3. Блок портфолио (снизу) ---
  if (portfolioSection) {
    portfolioSection.classList.add('animate');
    await delay(600); // анимация появления
    // Портфолио автоматически сворачивается, потому что в HTML уже есть класс portfolio--collapsed
  }

  // После того как все анимации завершены, инициализируем интерактивное портфолио
  await initPortfolio();
}

// =============================================
// Интерактивное раскрытие портфолио
// =============================================
async function initPortfolio() {
  const portfolio = document.querySelector('.portfolio');
  if (!portfolio) return;

  await delay(500); // даём время на появление

  const openButton = portfolio.querySelector('.portfolio_portfolio-open-button');
  console.log('openButton found:', openButton);
  if (!openButton) {
    console.warn('Кнопка открытия портфолио не найдена.');
    return;
  }

  openButton.addEventListener('click', () => {
    expandPortfolio(portfolio);
  });

  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'ArrowDown' &&
      portfolio.classList.contains('portfolio--collapsed') &&
      document.activeElement === document.body
    ) {
      event.preventDefault();
      expandPortfolio(portfolio);
    }
  });

  // Инициализируем скролл для содержимого портфолио
  initPortfolioScroll();
}

function expandPortfolio(portfolio) {
  // Сразу убираем класс, запуская CSS-анимацию раскрытия
  portfolio.classList.remove('portfolio--collapsed');
  
  // Одновременно запускаем плавную прокрутку к секции
  portfolio.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
// =============================================
// Запуск после готовности DOM
// =============================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startHeroAnimation);
} else {
  startHeroAnimation();
}

// Инициализация скролла для портфолио
function initPortfolioScroll() {
  const projectsContent = document.querySelector('.portfolio__portfolio-content');
  const btnLeft = document.querySelector('.portfolio__portfolio-scroll-btn-left');
  const btnRight = document.querySelector('.portfolio__portfolio-scroll-btn-right');

  if (!projectsContent || !btnLeft || !btnRight) {
    console.warn('Не найдены элементы для скролла портфолио');
    return;
  }

  const card = document.querySelector('.project-card');
  // Получаем фактический gap из CSS
  const gap = parseInt(getComputedStyle(projectsContent).columnGap) || 0;
  const scrollAmount = card ? card.offsetWidth + gap : 300 + gap;

  function scrollLeft() {
    projectsContent.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  }

  function scrollRight() {
    projectsContent.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
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
