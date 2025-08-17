// ===============================
// UNIFIED CLEANVAPE SCRIPT
// Desktop functionality (default) + Mobile functionality (≤ 767px)
// ===============================

// Device detection
const isMobile = window.matchMedia('(max-width: 767px)').matches;

// Initialize the appropriate version
$(document).ready(function () {
  if (isMobile) {
    initMobileVersion();
  } else {
    initDesktopVersion();
  }
});

// ===============================
// DESKTOP VERSION (ORIGINAL FUNCTIONALITY)
// ===============================
function initDesktopVersion() {
  // --- Existing desktop code (unchanged) ---
  function highlightActiveMenuItem(sectionIndex) {
    document.querySelectorAll('.menu .nav-item').forEach(item => {
      item.classList.remove('aactive');
    });
    const menuItems = document.querySelectorAll('.menu .nav-item');
    if (menuItems[sectionIndex]) {
      menuItems[sectionIndex].classList.add('aactive');
    }
  }

  // Функция для изменения стиля меню в зависимости от секции
  function updateMenuStyle(sectionIndex) {
    const body = document.body;
    
    // Применяем инверсию меню для section1 (индекс 1)
    if (sectionIndex === 1) {
      body.classList.add('invert-menu');
    } else {
      body.classList.remove('invert-menu');
    }
  }

  const currentHash = window.location.hash;
  let initialSection = 0;
  switch(currentHash) {
    case '#firstPage': initialSection = 0; break;
    case '#secondPage': initialSection = 1; break;
    case '#3rdPage': initialSection = 2; break;
    case '#4thpage': initialSection = 3; break;
  }
  highlightActiveMenuItem(initialSection);
  updateMenuStyle(initialSection);

  const hash = window.location.hash;
  const isFirstSection = !hash || hash === "#firstPage";

  if (isFirstSection) {
    let tl = gsap.timeline({ delay: 0 });
    tl.to(".col", { top: "0", duration: 3, ease: "power4.inOut" });
    tl.to(".c-1 .item", { top: "0", stagger: 0.25, duration: 3, ease: "power4.inOut" }, "-=2");
    tl.to(".c-2 .item", { top: "0", stagger: -0.25, duration: 3, ease: "power4.inOut" }, "-=4");
    tl.to(".c-3 .item", { top: "0", stagger: 0.25, duration: 3, ease: "power4.inOut" }, "-=4");
    tl.to(".c-4 .item", { top: "0", stagger: -0.25, duration: 3, ease: "power4.inOut" }, "-=4");
    tl.to(".c-5 .item", { top: "0", stagger: 0.25, duration: 3, ease: "power4.inOut" }, "-=4");
    tl.to(".preloader", { scale: 6, duration: 4, ease: "power4.inOut" }, "-=2");
    tl.to(".nav-item a, .title p, .slide-num p, .preview img", { top: 0, stagger: 0.075, duration: 1, ease: "power3.out", }, "-=1.5");
    tl.to(".icon ion-icon, .icon-2 ion-icon", { scale: 1, stagger: 0.05, ease: "power3.out", }, "-=1");
    tl.to(".main-header, #section0", { opacity: 1, visibility: 'visible', duration: 1.5, ease: "power3.out" }, "-=1.5");
    tl.to(".nav-item", { opacity: 1, y: 0, stagger: 0.2, duration: 1, ease: "power3.out" }, "<+0.3");
  } else {
    let tl = gsap.timeline({ delay: 0 });
    tl.set(".col, .c-1 .item, .c-2 .item, .c-3 .item, .c-4 .item, .c-5 .item", { top: 0 });
    tl.to(".preloader", { scale: 6, duration: 0.2, ease: "power4.inOut" });
    tl.to(".nav-item a, .title p, .slide-num p, .preview img", { top: 0, stagger: 0.05, duration: 0.2, ease: "power3.out", });
    tl.to(".icon ion-icon, .icon-2 ion-icon", { scale: 1, stagger: 0.05, duration: 0.2, ease: "power3.out" });
    tl.to(".main-header, #section0", { opacity: 1, visibility: 'visible', duration: 0.2, ease: "power3.out" });
    tl.to(".nav-item", { opacity: 1, y: 0, stagger: 0.1, duration: 0.2, ease: "power3.out" });
  }

  const slideSections = [1, 2, 3, 4];
  const currentSlides = {};
  let isSliding = false;
  let menuClick = false;

  $('.menu a').on('click', function () {
    menuClick = true;
  });

  $('#fullpage').fullpage({
    anchors: ['firstPage', 'secondPage', '3rdPage', '4thpage'],
    css3: true,
    licenseKey: 'OPEN-SOURCE-GPLV3-LICENSE',
    afterLoad: function(origin, destination) {
      highlightActiveMenuItem(destination.index);
      updateMenuStyle(destination.index);
      
      // CleanVape: показать элементы управления при входе в section3
      if (destination.index === 3) {
        document.getElementById('section3').classList.add('active');
        // Запуск анимации статистики если находимся на втором слайде
        setTimeout(() => {
          if (cleanvapeCurrentSlide === 1) {
            startCleanvapeAnimation();
          }
        }, 300);
      } else {
        document.getElementById('section3').classList.remove('active');
      }
    },
    onLeave: function(origin, destination) {
      // CleanVape: скрыть элементы управления при уходе из section3
      if (origin.index === 3) {
        document.getElementById('section3').classList.remove('active');
      }
    },
    afterSlideLoad: function (section, origin, destination) {
      const sectionIndex = section.index;
      currentSlides[sectionIndex] = destination.index;
      
      // CleanVape: обновление навигации при смене слайдов в section3
      if (sectionIndex === 3) {
        updateCleanvapeSlideNavigation(destination.index);
        cleanvapeCurrentSlide = destination.index;
        
        // Запуск анимации при переходе на второй слайд
        if (destination.index === 1) {
          setTimeout(startCleanvapeAnimation, 300);
        }
      }
    },
    onLeave: function (origin, destination, direction) {
      if (menuClick) {
        menuClick = false;
        return true;
      }
      const sectionIndex = origin.index;
      const currentSlideIndex = currentSlides[sectionIndex] || 0;
      
      // CleanVape: обработка колесика для section3
      if (sectionIndex === 3 && !isSliding) {
        if (direction === 'down' && cleanvapeCurrentSlide === 0) {
          isSliding = true;
          fullpage_api.moveSlideRight();
          setTimeout(() => isSliding = false, 700);
          return false;
        }
        if (direction === 'up' && cleanvapeCurrentSlide === 1) {
          isSliding = true;
          fullpage_api.moveSlideLeft();
          setTimeout(() => isSliding = false, 700);
          return false;
        }
      }
      
      if (slideSections.includes(sectionIndex) && !isSliding) {
        const numSlides = $('.section').eq(sectionIndex).find('.slide').length;
        if (direction === 'down' && currentSlideIndex < numSlides - 1) {
          isSliding = true;
          fullpage_api.moveSlideRight();
          setTimeout(() => isSliding = false, 700);
          return false;
        }
        if (direction === 'up' && currentSlideIndex > 0) {
          isSliding = true;
          fullpage_api.moveSlideLeft();
          setTimeout(() => isSliding = false, 700);
          return false;
        }
      }
    }
  });

  // Map interactive enable/disable
  const wrapper = document.getElementById("mapWrapper");
  const iframe = document.getElementById("mapFrame");
  if (wrapper && iframe) {
    wrapper.addEventListener("click", function () {
      iframe.style.pointerEvents = "auto";
    });
    wrapper.addEventListener("mouseleave", function () {
      iframe.style.pointerEvents = "none";
    });
  }

  // Sidebar logic
  const openBtn = document.getElementById('openSidebar');
  const closeBtn = document.getElementById('closeBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarNavBtns = document.querySelectorAll('.sidebar-nav-btn');
  const sidebarSlides = document.querySelector('.sidebar-slides');
  const slideElements = document.querySelectorAll('.sidebar-slide');
  const faqQuestions = document.querySelectorAll('.faq-question');
  let currentSlide = 0;

  function openSidebar() {
    document.body.classList.add('sidebar-open');
    sidebar.style.display = 'block';
    requestAnimationFrame(() => {
      sidebar.classList.add('open');
    });
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    document.body.classList.remove('sidebar-open');
    
    // Сброс к первому слайду при закрытии
    setTimeout(() => {
      // Переключаемся на первый слайд
      switchSlide(0);
      
      // Очищаем форму
      const form = sidebar.querySelector('.my-form');
      if (form) {
        form.reset();
      }
      
      // Закрываем все открытые FAQ элементы
      faqQuestions.forEach(q => {
        q.classList.remove('active');
        q.parentElement.querySelector('.faq-answer').classList.remove('active');
      });
      
      sidebar.style.display = 'none';
    }, 800);
  }
  function switchSlide(slideIndex) {
    sidebarNavBtns.forEach(btn => btn.classList.remove('active'));
    sidebarNavBtns[slideIndex].classList.add('active');
    slideElements.forEach(slide => slide.classList.remove('active'));
    slideElements[slideIndex].classList.add('active');
    const translateX = -slideIndex * 100;
    sidebarSlides.style.transform = `translateX(${translateX}%)`;
    currentSlide = slideIndex;
  }
  function toggleFaqItem(questionElement) {
    const faqItem = questionElement.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const isActive = questionElement.classList.contains('active');
    faqQuestions.forEach(q => {
      q.classList.remove('active');
      q.parentElement.querySelector('.faq-answer').classList.remove('active');
    });
    if (!isActive) {
      questionElement.classList.add('active');
      answer.classList.add('active');
    }
  }

  if (openBtn) {
    openBtn.addEventListener('click', (e) => { e.preventDefault(); openSidebar(); });
  }
  if (closeBtn) {
    closeBtn.addEventListener('mousemove', function (e) {
      const rect = closeBtn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const angle = Math.atan2(dy, dx);
      const radius = 8;
      closeBtn.style.transform = `translate(${Math.cos(angle)*radius}px, ${Math.sin(angle)*radius}px)`;
    });
    closeBtn.addEventListener('mouseleave', function () {
      closeBtn.style.transform = 'translate(0, 0)';
    });
    closeBtn.addEventListener('click', () => { closeSidebar(); });
  }
  sidebarNavBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => { switchSlide(index); });
  });
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => { toggleFaqItem(question); });
  });

  // Counter
  let targetValue = 4247;
  let lastStep = false;
  const counterElement = document.getElementById('counter');
  if (counterElement) {
    counterElement.textContent = 0;
    setTimeout(function () {
      let current = 0;
      const duration = 2000;
      const steps = 60;
      const increment = targetValue / steps;
      const delay = duration / steps;
      function countUp() {
        current += increment;
        if (current >= targetValue) {
          counterElement.textContent = targetValue;
        } else {
          counterElement.textContent = Math.floor(current);
          setTimeout(countUp, delay);
        }
      }
      countUp();
    }, 6100);
  }
  const exactSecond = 10.1;
  const video = document.querySelector('.my-video');
  if (video && counterElement) {
    video.addEventListener('timeupdate', function() {
      if (counterElement.textContent !== "0" && video.currentTime >= exactSecond && !lastStep) {
        targetValue++;
        counterElement.textContent = targetValue;
        counterElement.style.transform = 'scale(1.15)';
        setTimeout(() => { counterElement.style.transform = 'scale(1)'; }, 250);
        lastStep = true;
      }
      if (video.currentTime < exactSecond) {
        lastStep = false;
      }
    });
  }

  // ===============================
  // Donation Widget (Isolated)
  // ===============================
  (function initDonationWidget() {
    const widget = document.getElementById('donationWidget');
    if (!widget) return;

    // CONFIG (placeholders!)
    const IS_SANDBOX = false; // true for sandbox
    const PAYPAL_HOSTED_BUTTON_ID = 'YOUR_HOSTED_BUTTON_ID'; // TODO: replace
    const CURRENCY = 'USD';
    const SUBSCRIPTION_PLANS = {
      10: 'P-PLANID_FOR_10',
      25: 'P-PLANID_FOR_25',
      50: 'P-PLANID_FOR_50',
      100: 'P-PLANID_FOR_100'
      // Custom amounts for subscription need backend
    };
    const PAYPAL_BASE = IS_SANDBOX ? 'https://www.sandbox.paypal.com' : 'https://www.paypal.com';

    // Elements (scoped)
    const form = widget.querySelector('#donationForm');
    const amountButtons = widget.querySelectorAll('.donation-amount-btn');
    const customInput = widget.querySelector('#donationAmountInput');
    const errorBox = widget.querySelector('#donationError');
    const submitBtn = widget.querySelector('.donation-submit-btn');

    let selectedAmount = 25;
    highlightSelected(selectedAmount);

    amountButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        selectedAmount = parseInt(btn.getAttribute('data-amount'), 10);
        highlightSelected(selectedAmount);
        customInput.value = '';
        clearError();
      });
    });

    customInput.addEventListener('input', () => {
      if (customInput.value.trim() !== '') {
        selectedAmount = parseInt(customInput.value, 10) || 0;
        amountButtons.forEach(b => b.classList.remove('active'));
      } else {
        const activeBtn = widget.querySelector('.donation-amount-btn.active');
        selectedAmount = activeBtn ? parseInt(activeBtn.getAttribute('data-amount'), 10) : 0;
      }
      clearError();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearError();
      if (!validateAmount()) {
        showError('Please enter a valid amount.');
        return;
      }
      const frequency = getFrequency();
      if (frequency === 'oneTime') {
        redirectOneTime(selectedAmount);
      } else {
        redirectSubscription(selectedAmount);
      }
    });

    function getFrequency() {
      return widget.querySelector('input[name="donationFrequency"]:checked').value;
    }
    function validateAmount() {
      return selectedAmount && selectedAmount > 0;
    }
    function highlightSelected(amount) {
      amountButtons.forEach(b => b.classList.remove('active'));
      const btn = widget.querySelector(`.donation-amount-btn[data-amount="${amount}"]`);
      if (btn) btn.classList.add('active');
    }
    function showError(msg) {
      if (!errorBox) return;
      errorBox.textContent = msg;
      errorBox.classList.add('visible');
    }
    function clearError() {
      if (!errorBox) return;
      errorBox.textContent = '';
      errorBox.classList.remove('visible');
    }
    // OPEN IN NEW TAB
    function redirectOneTime(amount) {
      const url = `${PAYPAL_BASE}/donate/?hosted_button_id=${encodeURIComponent(PAYPAL_HOSTED_BUTTON_ID)}&amount=${encodeURIComponent(amount)}&currency_code=${encodeURIComponent(CURRENCY)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    function redirectSubscription(amount) {
      const planId = SUBSCRIPTION_PLANS[amount];
      if (!planId) {
        showError('No subscription plan for this amount. Choose another or use one-time.');
        return;
      }
      const url = `${PAYPAL_BASE}/webapps/billing/subscriptions?plan_id=${encodeURIComponent(planId)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }

    // Button gradient hover
    if (submitBtn) {
      submitBtn.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.style.background = `radial-gradient(circle at ${x}px ${y}px, var(--donation-tertiary) 0%, var(--donation-primary) 100%)`;
      });
      submitBtn.addEventListener('mouseleave', function () {
        this.style.background = 'linear-gradient(135deg, var(--donation-primary) 0%, var(--donation-tertiary) 100%)';
      });
    }
  })();

  // ===============================
  // CLEANVAPE FUNCTIONALITY
  // ===============================
  let cleanvapeCurrentSlide = 0;
  let cleanvapeIsScrolling = false;
  const cleanvapeTotalSlides = 2;

  // Функция обновления навигации для CleanVape
  function updateCleanvapeSlideNavigation(activeIndex) {
    const navItems = document.querySelectorAll('.cleanvape-slide-nav-item');
    navItems.forEach((item, index) => {
      item.classList.toggle('active', index === activeIndex);
    });
  }

  // Навигация по слайдам CleanVape
  function navigateCleanvapeSlide(direction) {
    if (direction === 'next' && cleanvapeCurrentSlide < cleanvapeTotalSlides - 1) {
      fullpage_api.moveSlideRight();
    } else if (direction === 'prev' && cleanvapeCurrentSlide > 0) {
      fullpage_api.moveSlideLeft();
    }
  }

  // Обработчики для стрелок навигации CleanVape
  const cleanvapeNavPrev = document.getElementById('cleanvapeNavPrev');
  const cleanvapeNavNext = document.getElementById('cleanvapeNavNext');
  
  if (cleanvapeNavPrev) {
    cleanvapeNavPrev.addEventListener('click', () => navigateCleanvapeSlide('prev'));
  }
  
  if (cleanvapeNavNext) {
    cleanvapeNavNext.addEventListener('click', () => navigateCleanvapeSlide('next'));
  }

  // Обработчики для точечной навигации CleanVape
  document.querySelectorAll('.cleanvape-slide-nav-item').forEach((item, index) => {
    item.addEventListener('click', () => {
      if(index === 0 && cleanvapeCurrentSlide !== 0) {
        fullpage_api.moveSlideLeft();
      } else if(index === 1 && cleanvapeCurrentSlide !== 1) {
        fullpage_api.moveSlideRight();
      }
    });
  });

  // Обработка колесика мыши для CleanVape
  function handleCleanvapeWheel(e) {
    const activeSection = document.querySelector('.fp-section.active');
    if (!activeSection || activeSection.id !== 'section3') {
      return;
    }
    
    e.preventDefault();
    
    if (cleanvapeIsScrolling) return;
    cleanvapeIsScrolling = true;
    
    if (e.deltaY > 0) {
      // Скролл вниз - следующий слайд
      navigateCleanvapeSlide('next');
    } else {
      // Скролл вверх - предыдущий слайд
      navigateCleanvapeSlide('prev');
    }
    
    setTimeout(() => {
      cleanvapeIsScrolling = false;
    }, 800);
  }

  // Добавляем обработчик колесика
  document.addEventListener('wheel', handleCleanvapeWheel, { passive: false });

  // Поддержка тачпада для CleanVape
  let cleanvapeTouchStartY = 0;
  let cleanvapeTouchEndY = 0;
  const cleanvapeMinSwipeDistance = 50;

  document.addEventListener('touchstart', function(e) {
    const activeSection = document.querySelector('.fp-section.active');
    if (activeSection && activeSection.id === 'section3') {
      cleanvapeTouchStartY = e.changedTouches[0].screenY;
    }
  });

  document.addEventListener('touchend', function(e) {
    const activeSection = document.querySelector('.fp-section.active');
    if (activeSection && activeSection.id === 'section3') {
      cleanvapeTouchEndY = e.changedTouches[0].screenY;
      handleCleanvapeSwipe();
    }
  });

  function handleCleanvapeSwipe() {
    const swipeDistance = cleanvapeTouchStartY - cleanvapeTouchEndY;
    
    if (Math.abs(swipeDistance) > cleanvapeMinSwipeDistance) {
      if (swipeDistance > 0) {
        // Свайп вверх - следующий слайд
        navigateCleanvapeSlide('next');
      } else {
        // Свайп вниз - предыдущий слайд
        navigateCleanvapeSlide('prev');
      }
    }
  }

  // Анимация статистики CleanVape
  function startCleanvapeAnimation() {
    const numbers = document.querySelectorAll('[data-target]');
    
    numbers.forEach((number, index) => {
      setTimeout(() => {
        const target = parseFloat(number.getAttribute('data-target'));
        let current = 0;
        const increment = target / 60;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            if (target % 1 !== 0) {
              number.textContent = target.toFixed(1);
            } else {
              number.textContent = target.toLocaleString();
            }
            clearInterval(timer);
          } else {
            if (target % 1 !== 0 && current > 1) {
              number.textContent = current.toFixed(1);
            } else {
              number.textContent = Math.floor(current).toLocaleString();
            }
          }
        }, 25);
      }, index * 150);
    });
  }

  // Параллакс эффект для плавающих форм CleanVape
  document.addEventListener('mousemove', function(e) {
    const activeSection = document.querySelector('.fp-section.active');
    if (activeSection && activeSection.id === 'section3') {
      const shapes = document.querySelectorAll('.cleanvape-shape');
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.5;
        const x = mouseX * speed * 15;
        const y = mouseY * speed * 15;
        
        shape.style.transform = `translate(${x}px, ${y}px)`;
      });
    }
  });

  // Поддержка клавиатуры для CleanVape
  document.addEventListener('keydown', function(e) {
    const activeSection = document.querySelector('.fp-section.active');
    if (activeSection && activeSection.id === 'section3') {
      if(e.key === 'ArrowLeft') {
        navigateCleanvapeSlide('prev');
      } else if(e.key === 'ArrowRight') {
        navigateCleanvapeSlide('next');
      }
    }
  });

  // Скрытие подсказки CleanVape через несколько секунд
  setTimeout(() => {
    const cleanvapeScrollHint = document.getElementById('cleanvapeScrollHint');
    if (cleanvapeScrollHint) {
      cleanvapeScrollHint.style.opacity = '0';
      setTimeout(() => {
        cleanvapeScrollHint.style.display = 'none';
      }, 500);
    }
  }, 5000);
});




// Простое управление иконкой скролла
$(document).ready(function() {
  const scrollIcon = $('.aniWrap');
  
  setTimeout(() => {
    if (window.location.hash === '' || window.location.hash === '#firstPage') {
      scrollIcon.css('opacity', '1');
    }
  }, 15000);
  
  // Скрыть при переходе на другие страницы
  $('#fullpage').on('afterLoad', function(origin, destination) {
    if (destination.index === 0) {
      scrollIcon.css('opacity', '1');
    } else {
      scrollIcon.css('opacity', '0');
    }
  });
});

} // End of initDesktopVersion()

// ===============================
// MOBILE VERSION (NEW FUNCTIONALITY)
// ===============================
function initMobileVersion() {
  const PRELOADER_KEY = 'preloaderSeenStable';
  const PRELOADER_TIMEOUT = 3200;
  const DEBUG = false;

  let preloaderFinished = false;
  let numbersStarted = false;

  function log(...a) { 
    if (DEBUG) console.log('[MOBILE]', ...a); 
  }

  function init() {
    setAppHeightVar();
    window.addEventListener('resize', setAppHeightVar);
    window.addEventListener('orientationchange', setAppHeightVar);

    setYear();
    initPreloader();
    initNav();
    initBackToTop();
    initMapToggle();
    initDonationWidget();
    initDonationAccordion();
    initTabsSlider();
    initOrderForm();
    initHashFocus();
    maybeDeepLinkToFAQ();
  }

  function setYear() { 
    const y = document.getElementById('year'); 
    if (y) y.textContent = new Date().getFullYear(); 
  }
  
  function setAppHeightVar() { 
    document.documentElement.style.setProperty('--app-dvh', window.innerHeight + 'px'); 
  }

  /* ---------- Preloader ---------- */
  function initPreloader() {
    const body = document.body;
    const pre = document.getElementById('preloader');
    const skip = document.getElementById('preloaderSkip');
    const header = document.querySelector('.site-header');
    
    function finish() {
      if (preloaderFinished) return;
      preloaderFinished = true;
      if (pre) { 
        pre.classList.add('hide'); 
        setTimeout(() => pre.remove(), 900); 
      }
      body.classList.remove('is-locked');
      header?.classList.add('ready');
      sessionStorage.setItem(PRELOADER_KEY, '1');
      startNumbers();
    }
    
    if (!pre) { finish(); return; }
    if (sessionStorage.getItem(PRELOADER_KEY)) { finish(); return; }
    
    setTimeout(finish, PRELOADER_TIMEOUT);
    skip?.addEventListener('click', () => finish());
    setTimeout(() => finish(), 9000);
  }

  /* ---------- Navigation ---------- */
  function initNav() {
    const body = document.body;
    const burger = document.getElementById('burgerBtn');
    const nav = document.getElementById('mainNav');
    const overlay = document.getElementById('navOverlay');
    const closeBtn = nav?.querySelector('.nav-close-btn');
    let pointerOrigin = null;

    burger?.addEventListener('pointerdown', e => { 
      pointerOrigin = { x: e.clientX, y: e.clientY }; 
    });
    
    burger?.addEventListener('click', e => {
      if (pointerOrigin) {
        const dx = Math.abs(e.clientX - pointerOrigin.x);
        const dy = Math.abs(e.clientY - pointerOrigin.y);
        if (dx > 10 || dy > 10) return;
      }
      toggleNav();
    });
    
    closeBtn?.addEventListener('click', closeNav);

    function toggleNav() { 
      burger.getAttribute('aria-expanded') === 'true' ? closeNav() : openNav(); 
    }
    
    function openNav() {
      burger?.setAttribute('aria-expanded', 'true');
      nav?.classList.add('open');
      overlay?.removeAttribute('hidden');
      overlay?.classList.add('visible');
      body.style.overflow = 'hidden';
      trapFocus(nav, burger);
    }
    
    function closeNav() {
      burger?.setAttribute('aria-expanded', 'false');
      nav?.classList.remove('open');
      overlay?.setAttribute('hidden', '');
      overlay?.classList.remove('visible');
      if (!body.classList.contains('is-locked')) body.style.overflow = '';
      releaseFocusTrap();
    }
    
    overlay?.addEventListener('click', closeNav);
    nav?.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => { 
        if (burger.offsetParent !== null) closeNav(); 
      });
    });

    /* Focus trap */
    let focusTrapHandler;
    function trapFocus(container, returnEl) {
      const sel = 'a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])';
      const nodes = [...container.querySelectorAll(sel)].filter(el => !el.disabled && el.offsetParent !== null);
      if (!nodes.length) return;
      nodes[0].focus();
      focusTrapHandler = (e) => {
        if (e.key === 'Escape') { closeNav(); returnEl?.focus(); }
        if (e.key === 'Tab') {
          const first = nodes[0], last = nodes[nodes.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      };
      document.addEventListener('keydown', focusTrapHandler);
    }
    
    function releaseFocusTrap() {
      if (focusTrapHandler) {
        document.removeEventListener('keydown', focusTrapHandler);
        focusTrapHandler = null;
      }
    }
  }

  /* ---------- Back to Top ---------- */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) btn.classList.add('visible');
      else btn.classList.remove('visible');
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Map Toggle ---------- */
  function initMapToggle() {
    const frame = document.getElementById('mapFrameMobile');
    const btn = document.getElementById('activateMap');
    if (!frame || !btn) return;
    btn.addEventListener('click', () => {
      const active = btn.getAttribute('aria-pressed') === 'true';
      if (!active) {
        frame.style.pointerEvents = 'auto';
        btn.setAttribute('aria-pressed', 'true');
        btn.textContent = 'Interaction enabled';
      } else {
        frame.style.pointerEvents = 'none';
        btn.setAttribute('aria-pressed', 'false');
        btn.textContent = 'Enable map interaction';
      }
    });
  }

  /* ---------- Numbers ---------- */
  function startNumbers() {
    if (numbersStarted) return;
    numbersStarted = true;
    const els = document.querySelectorAll('[data-anim="number"]');
    els.forEach(el => { el.textContent = '0'; el.dataset.animDone = '0'; });

    function animate(el) {
      if (!el || el.dataset.animDone === '1') return;
      el.dataset.animDone = '1';
      const target = parseFloat(el.dataset.target || '0');
      const dec = parseInt(el.dataset.decimal || '0', 10);
      const dur = 2000;
      const start = performance.now();
      
      function frame(now) {
        const p = Math.min((now - start) / dur, 1);
        const val = target * p;
        el.textContent = dec ? val.toFixed(dec) : Math.floor(val).toLocaleString();
        if (p < 1) requestAnimationFrame(frame);
        else el.textContent = dec ? target.toFixed(dec) : target.toLocaleString();
      }
      requestAnimationFrame(frame);
    }

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); }
        });
      }, { threshold: .4 });
      els.forEach(n => obs.observe(n));
    } else {
      els.forEach(animate);
    }
  }

  /* ---------- Donation Widget ---------- */
  function initDonationWidget() {
    const widget = document.getElementById('donationWidgetMobile');
    if (!widget) return;
    
    const IS_SANDBOX = false;
    const HOSTED = 'YOUR_HOSTED_BUTTON_ID';
    const CURRENCY = 'USD';
    const PLANS = { 10: 'P-PLANID_FOR_10', 25: 'P-PLANID_FOR_25', 50: 'P-PLANID_FOR_50', 100: 'P-PLANID_FOR_100' };
    const BASE = IS_SANDBOX ? 'https://www.sandbox.paypal.com' : 'https://www.paypal.com';

    const form = widget.querySelector('#donationFormMobile');
    const btns = widget.querySelectorAll('.donation-amount-btn');
    const input = widget.querySelector('#donationAmountInputMobile');
    const errorBox = widget.querySelector('#donationErrorMobile');
    let selected = 25;

    highlight(selected);
    btns.forEach(b => b.addEventListener('click', () => {
      selected = parseInt(b.dataset.amount, 10);
      input.value = '';
      highlight(selected); 
      clearErr();
    }));
    
    input?.addEventListener('input', () => {
      if (input.value.trim() !== '') {
        selected = parseInt(input.value, 10) || 0;
        btns.forEach(b => b.classList.remove('active'));
      } else { 
        highlight(selected); 
      }
      clearErr();
    });
    
    form?.addEventListener('submit', e => {
      e.preventDefault();
      clearErr();
      if (selected <= 0) { showErr('Enter a valid amount.'); return; }
      const freq = widget.querySelector('input[name="donationFrequencyMobile"]:checked')?.value || 'oneTime';
      if (freq === 'oneTime') {
        window.open(`${BASE}/donate/?hosted_button_id=${encodeURIComponent(HOSTED)}&amount=${encodeURIComponent(selected)}&currency_code=${encodeURIComponent(CURRENCY)}`, '_blank', 'noopener');
      } else {
        const plan = PLANS[selected]; 
        if (!plan) { showErr('No subscription plan for this amount.'); return; }
        window.open(`${BASE}/webapps/billing/subscriptions?plan_id=${encodeURIComponent(plan)}`, '_blank', 'noopener');
      }
    });
    
    function highlight(a) {
      btns.forEach(b => b.classList.remove('active'));
      const m = [...btns].find(b => parseInt(b.dataset.amount, 10) === a);
      if (m) m.classList.add('active');
    }
    
    function showErr(m) { if (errorBox) errorBox.textContent = m; }
    function clearErr() { if (errorBox) errorBox.textContent = ''; }
  }

  /* ---------- Donation Accordion ---------- */
  function initDonationAccordion() {
    const items = [...document.querySelectorAll('.accordion-item')];
    items.forEach(btn => {
      btn.addEventListener('click', () => {
        const exp = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', exp ? 'false' : 'true');
      });
    });
  }

  /* ---------- Tabs / Slider ---------- */
  function initTabsSlider() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-tab');
        const targetId = 'panel' + key.charAt(0).toUpperCase() + key.slice(1);
        tabBtns.forEach(b => b.setAttribute('aria-selected', b === btn ? 'true' : 'false'));
        panels.forEach(p => p.classList.toggle('is-hidden', p.id !== targetId));
      });
    });
  }

  /* ---------- Order Form ---------- */
  function initOrderForm() {
    const form = document.getElementById('orderForm');
    const feedback = document.getElementById('orderFeedback');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Clear previous messages
      if (feedback) {
        feedback.className = 'form-feedback';
        feedback.textContent = '';
      }
      
      // List all possible field IDs
      const possibleFields = [
        'reason', 'firstName', 'lastName', 'email', 'phone', 'message'
      ];
      
      // Find existing fields
      const existingFields = [];
      possibleFields.forEach(function(fieldId) {
        const field = document.getElementById(fieldId);
        if (field && (field.type !== 'hidden')) {
          existingFields.push({ id: fieldId, element: field });
        }
      });
      
      // Required fields (exclude message)
      const requiredFields = existingFields.filter(function(field) {
        return field.id !== 'message';
      });
      
      let isValid = true;
      const errors = [];
      
      // Check each required field
      requiredFields.forEach(function(field) {
        const element = field.element;
        let value = '';
        
        if (element.tagName.toLowerCase() === 'select') {
          value = element.value;
        } else if (element.type === 'email') {
          value = element.value.trim();
        } else {
          value = element.value.trim();
        }
        
        // Check if empty
        if (!value) {
          isValid = false;
          errors.push(field.id);
          
          // Visual error highlight
          element.style.border = '2px solid red';
          element.style.backgroundColor = '#ffe6e6';
          
          // Remove error highlight on input
          const removeError = function() {
            element.style.border = '';
            element.style.backgroundColor = '';
            element.removeEventListener('input', removeError);
            element.removeEventListener('change', removeError);
          };
          
          element.addEventListener('input', removeError);
          element.addEventListener('change', removeError);
        }
        
        // Additional email validation
        if (field.id === 'email' && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            isValid = false;
            errors.push('email-invalid');
            
            element.style.border = '2px solid red';
            element.style.backgroundColor = '#ffe6e6';
            
            const removeError = function() {
              element.style.border = '';
              element.style.backgroundColor = '';
              element.removeEventListener('input', removeError);
            };
            element.addEventListener('input', removeError);
          }
        }
      });
      
      // Show result
      if (feedback) {
        if (!isValid) {
          let message = 'Please fill all required fields';
          if (errors.includes('email-invalid')) {
            message += ' (check email format)';
          }
          message += '.';
          
          feedback.textContent = message;
          feedback.classList.add('err');
          feedback.style.color = '#ff0000';
          feedback.style.padding = '10px';
          feedback.style.marginTop = '10px';
        } else {
          feedback.textContent = 'Submitted successfully! We will contact you shortly.';
          feedback.classList.add('ok');
          feedback.style.color = '#008000';
          feedback.style.padding = '10px';
          feedback.style.marginTop = '10px';
          
          // Clear form after success
          setTimeout(function() {
            form.reset();
            setTimeout(function() {
              if (feedback) {
                feedback.textContent = '';
                feedback.className = 'form-feedback';
                feedback.style.color = '';
                feedback.style.padding = '';
                feedback.style.marginTop = '';
              }
            }, 4000);
          }, 100);
        }
      }
    });
  }

  function maybeDeepLinkToFAQ() {
    if (location.hash.toLowerCase() === '#faq') {
      document.querySelector('.tab-btn[data-tab="faq"]')?.click();
      document.getElementById('panelFaq')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /* ---------- Hash Focus ---------- */
  function initHashFocus() {
    function focusFromHash() {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (el) {
        el.setAttribute('tabindex', '-1');
        el.focus({ preventScroll: true });
        setTimeout(() => el.removeAttribute('tabindex'), 600);
      }
    }
    window.addEventListener('hashchange', focusFromHash);
    focusFromHash();
  }

  // Initialize mobile version
  init();
}

// ===============================
// END OF UNIFIED SCRIPT
// ===============================