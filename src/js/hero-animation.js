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

  // 1. Features (левый блок)
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

  // 2. Skills (правый блок)
  if (skillsBlock) {
    skillsBlock.classList.add('animate');
    await delay(600);

    const title = skillsBlock.querySelector('h1');
    const text = title?.dataset.text;
    if (title && text) await typeWriter(title, text, 40);

    const skillItems = skillsBlock.querySelectorAll('h3, h2');
    if (skillItems.length > 0) {
      skillItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('animate');
        }, index * 200);
      });
      await delay(skillItems.length * 200 + 400);
    }
  }

  // 3. Портфолио (снизу)
  if (portfolioSection) {
    portfolioSection.classList.add('animate');
    await delay(600);
  }

  // 4. Контакты (слева направо)
  if (contactsSection) {
    contactsSection.classList.add('animate');
    await delay(600);
  }

  // Инициализируем интерактивные элементы после завершения анимаций
  await initPortfolio();
  await initContacts();
  initToggleSections();
}

// =============================================
// Логика скролла внутри портфолио
// =============================================

function initPortfolioScroll() {
  const projectsContent = document.querySelector('.portfolio__portfolio-content');
  const btnLeft = document.querySelector('.portfolio__portfolio-scroll-btn-left');
  const btnRight = document.querySelector('.portfolio__portfolio-scroll-btn-right');

  if (!projectsContent || !btnLeft || !btnRight) return;

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

// =============================================
// Инициализация кнопок открытия/закрытия
// =============================================

async function initPortfolio() {
  const portfolio = document.querySelector('.portfolio');
  if (!portfolio) return;
  await delay(500);
  initPortfolioScroll();
}

async function initContacts() {
  // здесь можно будет добавить инициализацию для контактов, если понадобится
}

function toggleSection(section, otherSection) {
  const title = section.querySelector('.contacts__contacts-title') || section.querySelector('.portfolio__portfolio-title');
  if (!title) return;

  const isPortfolio = section.classList.contains('portfolio');
  const isHidden = isPortfolio
    ? section.classList.contains('portfolio--collapsed')
    : section.classList.contains('contacts--collapsed');

  if (isHidden) {
    // Сворачиваем другую секцию, если она открыта
    if (otherSection) {
      const otherIsPortfolio = otherSection.classList.contains('portfolio');
      const otherIsHidden = otherIsPortfolio
        ? otherSection.classList.contains('portfolio--collapsed')
        : otherSection.classList.contains('contacts--collapsed');
      if (!otherIsHidden) {
        if (otherIsPortfolio) {
          otherSection.classList.add('portfolio--collapsed');
        } else {
          otherSection.classList.add('contacts--collapsed');
        }
      }
    }

    // Открываем текущую
    if (isPortfolio) {
      section.classList.remove('portfolio--collapsed');
    } else {
      section.classList.remove('contacts--collapsed');
    }
    title.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    // Закрываем текущую
    if (isPortfolio) {
      section.classList.add('portfolio--collapsed');
    } else {
      section.classList.add('contacts--collapsed');
    }
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

function initToggleSections() {
  const portfolio = document.querySelector('.portfolio');
  const contacts = document.querySelector('.contacts');
  if (!portfolio || !contacts) return;

  const portfolioButton = portfolio.querySelector('.portfolio_portfolio-open-button');
  const contactsButton = contacts.querySelector('.portfolio_portfolio-open-button');

  if (portfolioButton) {
    portfolioButton.addEventListener('click', () => toggleSection(portfolio, contacts));
  }
  if (contactsButton) {
    contactsButton.addEventListener('click', () => toggleSection(contacts, portfolio));
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' && document.activeElement === document.body) {
      if (portfolio.classList.contains('portfolio--collapsed')) {
        event.preventDefault();
        toggleSection(portfolio, contacts);
      } else if (contacts.classList.contains('contacts--collapsed')) {
        event.preventDefault();
        toggleSection(contacts, portfolio);
      }
    }
  });
}

// =============================================
// Запуск после готовности DOM
// =============================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startHeroAnimation);
} else {
  startHeroAnimation();
}