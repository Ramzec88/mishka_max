// Theme Toggle
let currentTheme = 'system';
const themeToggle = document.getElementById('themeToggle');

function initTheme() {
  const savedTheme = getCurrentTheme();
  applyTheme(savedTheme);
}

function getCurrentTheme() {
  if (currentTheme !== 'system') return currentTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-color-scheme', 'dark');
  } else if (theme === 'light') {
    document.documentElement.setAttribute('data-color-scheme', 'light');
  } else {
    document.documentElement.removeAttribute('data-color-scheme');
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    if (currentTheme === 'system' || currentTheme === 'light') {
      currentTheme = 'dark';
    } else {
      currentTheme = 'light';
    }
    applyTheme(currentTheme);
  });
}

// Initialize theme on load
initTheme();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// Format Card Details Toggle
function toggleFormatDetails(card) {
  const details = card.querySelector('.format-details');
  const isActive = details.classList.contains('active');
  
  // Close all other format details
  document.querySelectorAll('.format-details').forEach(d => {
    d.classList.remove('active');
  });
  
  // Toggle current one
  if (!isActive) {
    details.classList.add('active');
  }
}

// Carousel functionality
let currentSlide = 0;
const carouselTrack = document.getElementById('carouselTrack');
const carouselDots = document.getElementById('carouselDots');
let autoPlayInterval;

function initCarousel() {
  const cards = document.querySelectorAll('.example-card');
  const totalSlides = Math.max(1, cards.length - 2); // Show 3 at a time
  
  // Create dots
  if (carouselDots) {
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot';
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      carouselDots.appendChild(dot);
    }
  }
  
  // Start autoplay
  startAutoPlay();
}

function moveCarousel(direction) {
  const cards = document.querySelectorAll('.example-card');
  const totalSlides = Math.max(1, cards.length - 2);
  
  currentSlide += direction;
  
  if (currentSlide < 0) {
    currentSlide = totalSlides - 1;
  } else if (currentSlide >= totalSlides) {
    currentSlide = 0;
  }
  
  updateCarousel();
  resetAutoPlay();
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
  resetAutoPlay();
}

function updateCarousel() {
  if (!carouselTrack) return;
  
  const cardWidth = carouselTrack.querySelector('.example-card')?.offsetWidth || 0;
  const gap = 24; // from CSS
  const offset = -(currentSlide * (cardWidth + gap));
  
  carouselTrack.style.transform = `translateX(${offset}px)`;
  
  // Update dots
  const dots = document.querySelectorAll('.carousel-dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

function startAutoPlay() {
  autoPlayInterval = setInterval(() => {
    moveCarousel(1);
  }, 5000);
}

function resetAutoPlay() {
  clearInterval(autoPlayInterval);
  startAutoPlay();
}

// Initialize carousel when DOM is ready
if (carouselTrack) {
  initCarousel();
  
  // Update carousel on window resize
  window.addEventListener('resize', () => {
    updateCarousel();
  });
}

// Pricing Calculator - New Version
function calculatePrice() {
  const checkboxes = document.querySelectorAll('input[name="format"]:checked');
  const formatCount = checkboxes.length;

  // Calculate base price
  let basePrice = 0;
  checkboxes.forEach(cb => {
    basePrice += parseInt(cb.value);
  });

  // Calculate discount based on quantity
  let discountPercent = 0;
  if (formatCount >= 5) {
    discountPercent = 20;
  } else if (formatCount === 4) {
    discountPercent = 15;
  } else if (formatCount === 3) {
    discountPercent = 10;
  }

  const discount = (basePrice * discountPercent) / 100;
  const total = basePrice - discount;

  // Update display
  document.getElementById('formatCount').textContent = formatCount;
  document.getElementById('basePrice').textContent = `${basePrice.toLocaleString('ru-RU')}₽`;
  document.getElementById('totalPrice').textContent = `${total.toLocaleString('ru-RU')}₽`;

  const discountLine = document.getElementById('discountLine');
  const orderButton = document.getElementById('orderButton');

  if (discountPercent > 0) {
    document.getElementById('discountPercent').textContent = discountPercent;
    document.getElementById('discountAmount').textContent = `-${discount.toLocaleString('ru-RU')}₽`;
    discountLine.style.display = 'flex';
  } else {
    discountLine.style.display = 'none';
  }

  // Show/hide order button
  if (formatCount > 0) {
    orderButton.style.display = 'block';
  } else {
    orderButton.style.display = 'none';
  }
}

// Order selected formats
function orderFormats() {
  const checkboxes = document.querySelectorAll('input[name="format"]:checked');
  const selectedFormats = Array.from(checkboxes).map(cb => cb.dataset.name);

  if (selectedFormats.length === 0) {
    alert('Пожалуйста, выберите хотя бы один формат размещения');
    return;
  }

  // Calculate totals
  const formatCount = checkboxes.length;
  let basePrice = 0;
  checkboxes.forEach(cb => {
    basePrice += parseInt(cb.value);
  });

  let discountPercent = 0;
  if (formatCount >= 5) discountPercent = 20;
  else if (formatCount === 4) discountPercent = 15;
  else if (formatCount === 3) discountPercent = 10;

  const discount = (basePrice * discountPercent) / 100;
  const total = basePrice - discount;

  // Create order message
  let message = `Здравствуйте! Хочу заказать рекламу на каналах Мишка Макс:\n\n`;
  message += `📋 Выбранные форматы:\n`;
  selectedFormats.forEach((format, index) => {
    message += `${index + 1}. ${format} - 1 000₽\n`;
  });
  message += `\n💰 Стоимость:\n`;
  message += `Базовая цена: ${basePrice.toLocaleString('ru-RU')}₽\n`;
  if (discountPercent > 0) {
    message += `Скидка ${discountPercent}%: -${discount.toLocaleString('ru-RU')}₽\n`;
  }
  message += `\nИТОГО: ${total.toLocaleString('ru-RU')}₽\n\n`;
  message += `Свяжитесь со мной для обсуждения деталей.`;

  // Copy to clipboard
  navigator.clipboard.writeText(message).then(() => {
    // Show success notification
    showNotification('✅ Текст заказа скопирован в буфер обмена!');

    // Open Telegram after a short delay
    setTimeout(() => {
      const telegramUrl = `https://t.me/yourusername?text=${encodeURIComponent(message)}`;
      window.open(telegramUrl, '_blank');
    }, 500);
  }).catch(err => {
    console.error('Ошибка копирования:', err);
    // Fallback: just open Telegram
    const telegramUrl = `https://t.me/yourusername?text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
  });
}

// Show notification helper
function showNotification(text) {
  const notification = document.createElement('div');
  notification.textContent = text;
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: var(--color-success);
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    font-weight: 500;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// FAQ Toggle
function toggleFaq(button) {
  const faqItem = button.closest('.faq-item');
  const isActive = faqItem.classList.contains('active');
  
  // Close all FAQ items
  document.querySelectorAll('.faq-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Toggle current item
  if (!isActive) {
    faqItem.classList.add('active');
  }
}

// Contact Form Submission
function submitContactForm(event) {
  event.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  
  // Create mailto link
  const subject = encodeURIComponent('Заявка на сотрудничество');
  const body = encodeURIComponent(`Имя: ${name}\nEmail: ${email}\n\nСообщение:\n${message}`);
  const mailtoLink = `mailto:your@email.com?subject=${subject}&body=${body}`;
  
  window.location.href = mailtoLink;
  
  // Show success message
  alert('Спасибо за ваше сообщение! Мы свяжемся с вами в течение 24 часов.');
  
  // Reset form
  document.getElementById('contactForm').reset();
}

// Download Media Kit PDF
function downloadMediaKit() {
  // In a real application, this would generate and download a PDF
  // For now, we'll show a message
  alert('Функция скачивания PDF будет доступна в ближайшее время. Пожалуйста, свяжитесь с нами напрямую через Telegram или Email.');
  
  // Alternative: scroll to contact section
  setTimeout(() => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, 500);
}

// Scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.metric-card, .audience-card, .format-card, .pricing-card, .case-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Add hover effects to metric cards
document.querySelectorAll('.metric-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.borderColor = 'var(--color-primary)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.borderColor = 'var(--color-card-border)';
  });
});

console.log('✨ Media Kit loaded successfully!');
console.log('📊 Instagram: 119K followers');
console.log('🎵 TikTok: 67K followers');
console.log('✈️ Telegram: 4K followers');
console.log('🎯 Total Reach: 190K followers');