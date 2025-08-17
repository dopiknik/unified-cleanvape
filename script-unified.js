/*
=======================================================
 UNIFIED CLEANVAPE SCRIPT
 Adaptive Desktop (fullPage.js) + Mobile (scroll) logic
=======================================================
*/

(function() {
  'use strict';

  // Breakpoint for desktop/mobile switching
  const DESKTOP_BREAKPOINT = 1024;
  
  // Global state
  let isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;
  let fullPageInitialized = false;
  let mobileInitialized = false;

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    checkScreenMode();
    setupResponsiveHandling();
    initCommonFunctionality();
  }

  function checkScreenMode() {
    const newIsDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;
    
    if (newIsDesktop !== isDesktop) {
      // Mode switched, reinitialize
      isDesktop = newIsDesktop;
      if (isDesktop) {
        destroyMobile();
        initDesktop();
      } else {
        destroyDesktop();
        initMobile();
      }
    } else if (isDesktop && !fullPageInitialized) {
      initDesktop();
    } else if (!isDesktop && !mobileInitialized) {
      initMobile();
    }
  }

  function setupResponsiveHandling() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkScreenMode, 150);
    });
  }

  function initCommonFunctionality() {
    setYear();
    initPreloader();
    initDonationWidgets();
  }

  // ===================
  // DESKTOP MODE
  // ===================
  function initDesktop() {
    if (fullPageInitialized) return;
    
    console.log('Initializing desktop mode');
    
    // Show desktop elements, hide mobile
    const fullPageEl = document.getElementById('fullpage');
    const contentEl = document.getElementById('content');
    const siteHeader = document.querySelector('.site-header');
    const mainHeader = document.querySelector('.main-header');
    
    if (fullPageEl) fullPageEl.style.display = 'block';
    if (contentEl) contentEl.style.display = 'none';
    if (siteHeader) siteHeader.style.display = 'none';
    if (mainHeader) mainHeader.style.display = 'flex';
    
    // Initialize fullPage.js if available
    if (typeof $ === 'function' && typeof $.fn.fullpage === 'function') {
      initFullPage();
    } else {
      console.warn('fullPage.js not available, using fallback desktop layout');
    }
    
    initDesktopAnimations();
    initDesktopNavigation();
    initDesktopSidebar();
    initDesktopCounters();
    
    fullPageInitialized = true;
  }

  function destroyDesktop() {
    if (!fullPageInitialized) return;
    
    console.log('Destroying desktop mode');
    
    // Destroy fullPage if initialized
    if (typeof $.fn.fullpage === 'function' && typeof fullpage_api !== 'undefined') {
      fullpage_api.destroy('all');
    }
    
    fullPageInitialized = false;
  }

  function initFullPage() {
    if (typeof $ === 'undefined' || typeof $.fn.fullpage !== 'function') {
      console.warn('fullPage.js not loaded, using fallback');
      return;
    }

    $('#fullpage').fullpage({
      autoScrolling: true,
      scrollHorizontally: true,
      navigation: false,
      navigationPosition: 'right',
      showActiveTooltip: false,
      sectionsColor: ['transparent', 'transparent', 'transparent', 'transparent'],
      anchors: ['firstPage', 'secondPage', '3rdPage', '4thpage'],
      menu: '.menu',
      
      onLeave: function(origin, destination, direction) {
        updateMenuStyle(destination.index);
        highlightActiveMenuItem(destination.index);
      },

      afterLoad: function(origin, destination, direction) {
        if (destination.index === 0) {
          initDesktopPreloaderAnimations();
        }
        
        if (destination.index === 3) {
          initCleanVapeAnimations();
        }
      }
    });
  }

  function initDesktopAnimations() {
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not loaded, skipping desktop animations');
      return;
    }

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
    }
  }

  function initDesktopPreloaderAnimations() {
    if (typeof gsap === 'undefined') return;

    gsap.to(".preloader", { opacity: 0, duration: 1, delay: 8.5, ease: "power2.inOut" });
    gsap.to("#section0", { visibility: "visible", opacity: 1, duration: 1, delay: 9.5, ease: "power2.inOut" });
  }

  function initDesktopNavigation() {
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
  }

  function initDesktopSidebar() {
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.getElementById('openSidebar');
    const closeBtn = document.getElementById('closeBtn');

    if (openBtn) {
      openBtn.addEventListener('click', () => {
        sidebar?.classList.add('open');
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        sidebar?.classList.remove('open');
      });
    }

    // FAQ functionality in sidebar
    initDesktopFAQ();
  }

  function initDesktopFAQ() {
    const faqQuestions = document.querySelectorAll('#sidebar .faq-question');
    faqQuestions.forEach(question => {
      question.addEventListener('click', function() {
        const faqItem = this.closest('.faq-item');
        const answer = faqItem.querySelector('.faq-answer');
        const icon = this.querySelector('.faq-icon');

        faqItem.classList.toggle('active');
        
        if (faqItem.classList.contains('active')) {
          answer.style.display = 'block';
          icon.textContent = '−';
        } else {
          answer.style.display = 'none';
          icon.textContent = '+';
        }
      });
    });
  }

  function initDesktopCounters() {
    // Counter animation for section 0
    const counter = document.getElementById('counter');
    if (counter) {
      animateNumber(counter, 0, 4247, 3000);
    }

    // CleanVape stats counters
    const statNumbers = document.querySelectorAll('.cleanvape-primary-number, .cleanvape-secondary-number');
    statNumbers.forEach(stat => {
      const target = parseInt(stat.dataset.target) || 0;
      animateNumber(stat, 0, target, 2000);
    });
  }

  function initCleanVapeAnimations() {
    // CleanVape slide functionality would go here
    // This is a placeholder for the CleanVape specific animations
  }

  // ===================
  // MOBILE MODE
  // ===================
  function initMobile() {
    if (mobileInitialized) return;
    
    console.log('Initializing mobile mode');
    
    // Show mobile elements, hide desktop
    const fullPageEl = document.getElementById('fullpage');
    const contentEl = document.getElementById('content');
    const siteHeader = document.querySelector('.site-header');
    const mainHeader = document.querySelector('.main-header');
    
    if (fullPageEl) fullPageEl.style.display = 'none';
    if (contentEl) contentEl.style.display = 'block';
    if (siteHeader) siteHeader.style.display = 'flex';
    if (mainHeader) mainHeader.style.display = 'none';
    
    initMobileNavigation();
    initMobileScrollEffects();
    initMobileCounters();
    initMobileTabs();
    initMobileAccordion();
    initMobileMapToggle();
    initMobileBackToTop();
    
    mobileInitialized = true;
  }

  function destroyMobile() {
    if (!mobileInitialized) return;
    
    console.log('Destroying mobile mode');
    
    // Clean up mobile event listeners if needed
    mobileInitialized = false;
  }

  function initMobileNavigation() {
    const body = document.body;
    const burger = document.getElementById('burgerBtn');
    const nav = document.getElementById('mainNav');
    const overlay = document.getElementById('navOverlay');
    const closeBtn = nav?.querySelector('.nav-close-btn');

    burger?.addEventListener('click', toggleNav);
    closeBtn?.addEventListener('click', closeNav);
    overlay?.addEventListener('click', closeNav);

    // Close nav when clicking nav links
    nav?.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (window.innerWidth < DESKTOP_BREAKPOINT) closeNav();
      });
    });

    function toggleNav() {
      const isOpen = burger.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    }

    function openNav() {
      burger?.setAttribute('aria-expanded', 'true');
      nav?.classList.add('open');
      overlay?.removeAttribute('hidden');
      overlay?.classList.add('visible');
      body.style.overflow = 'hidden';
    }

    function closeNav() {
      burger?.setAttribute('aria-expanded', 'false');
      nav?.classList.remove('open');
      overlay?.setAttribute('hidden', '');
      overlay?.classList.remove('visible');
      if (!body.classList.contains('is-locked')) {
        body.style.overflow = '';
      }
    }
  }

  function initMobileScrollEffects() {
    // Intersection Observer for animations
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Trigger number animations
            const numbers = entry.target.querySelectorAll('[data-anim="number"]');
            numbers.forEach(num => {
              const target = parseFloat(num.dataset.target) || 0;
              const decimal = parseInt(num.dataset.decimal) || 0;
              animateNumber(num, 0, target, 2000, decimal);
            });
          }
        });
      }, { threshold: 0.2 });

      document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
      });
    }
  }

  function initMobileCounters() {
    const mainCounter = document.getElementById('mainCounter');
    if (mainCounter) {
      // Trigger counter when section becomes visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = parseInt(mainCounter.dataset.target) || 0;
            animateNumber(mainCounter, 0, target, 3000);
            observer.unobserve(entry.target);
          }
        });
      });
      
      observer.observe(mainCounter.closest('.section'));
    }
  }

  function initMobileTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetPanel = tab.getAttribute('aria-controls');
        
        // Update tabs
        tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
        tab.setAttribute('aria-selected', 'true');
        
        // Update panels
        panels.forEach(panel => {
          panel.classList.add('is-hidden');
          if (panel.id === targetPanel) {
            panel.classList.remove('is-hidden');
          }
        });
      });
    });
  }

  function initMobileAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
      item.addEventListener('click', () => {
        const isExpanded = item.getAttribute('aria-expanded') === 'true';
        const icon = item.querySelector('.acc-icon');
        const panel = item.querySelector('.acc-panel');
        
        item.setAttribute('aria-expanded', !isExpanded);
        icon.textContent = isExpanded ? '+' : '−';
        
        if (isExpanded) {
          panel.style.maxHeight = '0';
        } else {
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    });
  }

  function initMobileMapToggle() {
    const frame = document.getElementById('mapFrameMobile');
    const btn = document.getElementById('activateMap');
    
    if (!frame || !btn) return;
    
    btn.addEventListener('click', () => {
      const isActive = btn.getAttribute('aria-pressed') === 'true';
      
      if (!isActive) {
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

  function initMobileBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===================
  // COMMON FUNCTIONS
  // ===================
  function initPreloader() {
    const body = document.body;
    const preloader = document.getElementById('preloader');
    const skipBtn = document.getElementById('preloaderSkip');
    
    const PRELOADER_KEY = 'preloaderSeenStable';
    const PRELOADER_TIMEOUT = 3200;
    
    function finishPreloader() {
      preloader?.classList.add('hide');
      setTimeout(() => {
        preloader?.remove();
        body.classList.remove('is-locked');
        if (isDesktop) {
          initDesktopPreloaderAnimations();
        }
      }, 900);
      
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(PRELOADER_KEY, 'true');
      }
    }
    
    // Skip if seen before
    if (typeof localStorage !== 'undefined' && localStorage.getItem(PRELOADER_KEY)) {
      finishPreloader();
      return;
    }
    
    // Auto finish after timeout
    setTimeout(finishPreloader, PRELOADER_TIMEOUT);
    
    // Skip button
    skipBtn?.addEventListener('click', finishPreloader);
  }

  function initDonationWidgets() {
    // Initialize both desktop and mobile donation widgets
    const widgets = document.querySelectorAll('#donationWidget, #donationWidgetMobile');
    
    widgets.forEach(widget => {
      const form = widget.querySelector('form');
      const btns = widget.querySelectorAll('.donation-amount-btn');
      const input = widget.querySelector('.donation-input-number');
      const errorBox = widget.querySelector('.donation-error');
      let selected = 25;

      // Preset amount buttons
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          selected = parseInt(btn.dataset.amount, 10);
          input.value = '';
          highlightAmount(selected);
          clearError();
        });
      });

      // Custom amount input
      input?.addEventListener('input', () => {
        if (input.value.trim() !== '') {
          selected = parseInt(input.value, 10) || 0;
          btns.forEach(b => b.classList.remove('active'));
        } else {
          highlightAmount(selected);
        }
        clearError();
      });

      // Form submission
      form?.addEventListener('submit', e => {
        e.preventDefault();
        clearError();
        
        if (selected <= 0) {
          showError('Enter a valid amount.');
          return;
        }
        
        const freq = widget.querySelector('input[name*="donationFrequency"]:checked')?.value || 'oneTime';
        const baseUrl = 'https://www.paypal.com';
        const hostedId = 'YOUR_HOSTED_BUTTON_ID';
        
        if (freq === 'oneTime') {
          window.open(`${baseUrl}/donate/?hosted_button_id=${encodeURIComponent(hostedId)}&amount=${encodeURIComponent(selected)}&currency_code=USD`, '_blank', 'noopener');
        } else {
          // Monthly subscription logic would go here
          console.log('Monthly donation not implemented yet');
        }
      });

      function highlightAmount(amount) {
        btns.forEach(b => b.classList.remove('active'));
        const matchBtn = [...btns].find(b => parseInt(b.dataset.amount, 10) === amount);
        if (matchBtn) matchBtn.classList.add('active');
      }

      function showError(msg) {
        if (errorBox) errorBox.textContent = msg;
      }

      function clearError() {
        if (errorBox) errorBox.textContent = '';
      }

      // Initialize with default amount
      highlightAmount(selected);
    });
  }

  function setYear() {
    const yearElements = document.querySelectorAll('#year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => el.textContent = currentYear);
  }

  // Utility functions
  function highlightActiveMenuItem(sectionIndex) {
    if (!isDesktop) return;
    
    document.querySelectorAll('.menu .nav-item').forEach(item => {
      item.classList.remove('aactive');
    });
    const menuItems = document.querySelectorAll('.menu .nav-item');
    if (menuItems[sectionIndex]) {
      menuItems[sectionIndex].classList.add('aactive');
    }
  }

  function updateMenuStyle(sectionIndex) {
    if (!isDesktop) return;
    
    const body = document.body;
    
    // Apply menu inversion for section1 (index 1)
    if (sectionIndex === 1) {
      body.classList.add('invert-menu');
    } else {
      body.classList.remove('invert-menu');
    }
  }

  function animateNumber(element, start, end, duration, decimals = 0) {
    if (!element) return;
    
    const startTime = performance.now();
    const difference = end - start;
    
    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = start + (difference * easeOut);
      
      element.textContent = current.toFixed(decimals);
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        element.textContent = end.toFixed(decimals);
      }
    }
    
    requestAnimationFrame(updateNumber);
  }

})();