
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeWriter(element, text, speed = 40) {
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
  element.style.opacity = '1';
}

async function cascadeFadeIn(items, stagger = 200) {
  const elements = Array.from(items);
  elements.forEach((item, index) => {
    item.classList.add('feature-item-hidden');
    setTimeout(() => {
      item.classList.add('animate');
    }, index * stagger);
  });
  await delay(elements.length * stagger + 400);
}

async function startHeroAnimation() {
  const featuresBlock = document.querySelector('.block.features');
  const skillsBlock = document.querySelector('.block.skills');
  const portfolioSection = document.querySelector('.portfolio');

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

    const subtitle = featuresBlock.querySelector('span');
    if (subtitle) await animateTextParts(subtitle, subtitle.textContent, ',', 300);

    const featureItems = featuresBlock.querySelectorAll('.features__feature-wrapper');
    if (featureItems.length > 0) {
      await cascadeFadeIn(featureItems, 200);
    }
  }

  // 2. Skills (правый блок) – запускается сразу после фич
  if (skillsBlock) {
    skillsBlock.classList.add('animate');
    await delay(600);

    const title = skillsBlock.querySelector('h1');
    const text = title?.dataset.text;
    if (title && text) await typeWriter(title, text, 40);
  }

  // 3. Портфолио (снизу)
  if (portfolioSection) {
    portfolioSection.classList.add('animate');
    await delay(600);
  }
}

startHeroAnimation();