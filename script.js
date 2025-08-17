/**
 * CleanVape Unified Responsive JavaScript
 * Handles desktop fullPage.js experience and mobile scroll-based experience
 */

class CleanVapeApp {
    constructor() {
        this.isDesktop = window.innerWidth >= 1024;
        this.fullPageInstance = null;
        this.counters = {
            quitCounter: 1247,
            moneySaved: 89432,
            healthDays: 15892,
            globalUsers: 45231,
            countries: 127
        };
        
        this.init();
    }

    init() {
        this.preloader();
        this.setupEventListeners();
        this.setupResponsiveDetection();
        
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeFeatures();
            });
        } else {
            this.initializeFeatures();
        }
    }

    preloader() {
        const preloader = document.getElementById('preloader');
        
        // Simulate loading time (2-4 seconds)
        const loadTime = this.isDesktop ? 3000 : 2000;
        
        setTimeout(() => {
            preloader.classList.add('hidden');
            
            // Remove preloader from DOM after animation
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, loadTime);
    }

    setupEventListeners() {
        // Resize event for responsive changes
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Scroll event for navbar behavior (mobile only)
        if (!this.isDesktop) {
            window.addEventListener('scroll', this.debounce(() => {
                this.handleScroll();
            }, 16));
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Form submissions
        this.setupFormHandlers();
    }

    setupResponsiveDetection() {
        // Create ResizeObserver for more accurate responsive detection
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    const newIsDesktop = entry.contentRect.width >= 1024;
                    if (newIsDesktop !== this.isDesktop) {
                        this.isDesktop = newIsDesktop;
                        this.reinitializeFeatures();
                    }
                }
            });
            
            resizeObserver.observe(document.body);
        }
    }

    initializeFeatures() {
        if (this.isDesktop) {
            this.initDesktopFeatures();
        } else {
            this.initMobileFeatures();
        }
        
        // Common features for both desktop and mobile
        this.initCommonFeatures();
    }

    initDesktopFeatures() {
        console.log('Initializing desktop features...');
        
        // Initialize fullPage.js
        this.initFullPage();
        
        // Initialize desktop sidebar
        this.initDesktopSidebar();
        
        // Initialize desktop navigation
        this.initDesktopNavigation();
        
        // Show desktop preloader components
        this.showDesktopComponents();
    }

    initMobileFeatures() {
        console.log('Initializing mobile features...');
        
        // Destroy fullPage.js if it exists
        this.destroyFullPage();
        
        // Initialize mobile navigation
        this.initMobileNavigation();
        
        // Initialize mobile tabs
        this.initMobileTabs();
        
        // Show mobile preloader components
        this.showMobileComponents();
    }

    initCommonFeatures() {
        // Live counters
        this.initCounters();
        
        // Donation widget
        this.initDonationWidget();
        
        // Forms
        this.initForms();
        
        // FAQ
        this.initFAQ();
        
        // Statistics charts
        this.initCharts();
        
        // Map
        this.initMap();
        
        // Animations
        this.initAnimations();
    }

    showDesktopComponents() {
        document.querySelectorAll('.desktop-nav, .desktop-sidebar').forEach(el => {
            el.style.display = '';
        });
        document.querySelectorAll('.mobile-nav, .mobile-tabs').forEach(el => {
            el.style.display = 'none';
        });
    }

    showMobileComponents() {
        document.querySelectorAll('.mobile-nav, .mobile-tabs').forEach(el => {
            el.style.display = '';
        });
        document.querySelectorAll('.desktop-nav, .desktop-sidebar').forEach(el => {
            el.style.display = 'none';
        });
    }

    initFullPage() {
        if (typeof fullpage === 'undefined') {
            console.warn('fullPage.js not loaded');
            return;
        }

        this.fullPageInstance = new fullpage('#fullpage', {
            navigation: false,
            navigationPosition: 'right',
            scrollHorizontally: true,
            sectionsColor: ['', '#f9fafb', '', '#f9fafb', '', '#f9fafb'],
            anchors: ['home', 'map', 'donate', 'about', 'stats', 'help'],
            menu: '.nav-menu',
            css3: true,
            scrollingSpeed: 1000,
            autoScrolling: true,
            fitToSection: true,
            fitToSectionDelay: 1000,
            scrollBar: false,
            easing: 'easeInOutCubic',
            easingcss3: 'ease',
            loopBottom: false,
            loopTop: false,
            continuousVertical: false,
            normalScrollElements: '.no-fullpage',
            paddingTop: '70px',
            
            onLeave: (origin, destination, direction) => {
                this.updateActiveNavigation(destination.anchor);
                this.animateSection(destination.index, direction);
            },
            
            afterLoad: (origin, destination, direction) => {
                this.triggerSectionAnimations(destination.index);
            }
        });
    }

    destroyFullPage() {
        if (this.fullPageInstance) {
            this.fullPageInstance.destroy('all');
            this.fullPageInstance = null;
        }
    }

    initDesktopNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                link.classList.add('active');
                
                if (this.fullPageInstance) {
                    fullpage_api.moveTo(target);
                }
            });
        });
    }

    initMobileNavigation() {
        const burgerMenu = document.getElementById('burger-menu');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        
        if (burgerMenu && mobileMenu) {
            burgerMenu.addEventListener('click', () => {
                burgerMenu.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            });
            
            // Close menu when clicking on links
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = link.getAttribute('href');
                    
                    // Close mobile menu
                    burgerMenu.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                    
                    // Scroll to section
                    const targetSection = document.querySelector(target);
                    if (targetSection) {
                        targetSection.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!burgerMenu.contains(e.target) && !mobileMenu.contains(e.target)) {
                    burgerMenu.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    initDesktopSidebar() {
        const sidebar = document.getElementById('desktop-sidebar');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        
        if (sidebar && sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
            
            // Auto-open sidebar after 3 seconds
            setTimeout(() => {
                sidebar.classList.add('open');
            }, 3000);
            
            // Initialize sidebar donation buttons
            this.initSidebarDonation();
            this.initSidebarHelp();
        }
    }

    initSidebarDonation() {
        const donateButtons = document.querySelectorAll('.donate-btn');
        
        donateButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove selected class from all buttons
                donateButtons.forEach(b => b.classList.remove('selected'));
                // Add selected class to clicked button
                btn.classList.add('selected');
                
                const amount = btn.dataset.amount;
                if (amount) {
                    this.processDonation(amount);
                } else if (btn.classList.contains('custom-amount')) {
                    this.showCustomDonationModal();
                }
            });
        });
    }

    initSidebarHelp() {
        const quitCalculatorBtn = document.getElementById('quit-calculator');
        const findSupportBtn = document.getElementById('find-support');
        
        if (quitCalculatorBtn) {
            quitCalculatorBtn.addEventListener('click', () => {
                if (this.fullPageInstance) {
                    fullpage_api.moveTo('help');
                }
                this.showHelpSection('calculator');
            });
        }
        
        if (findSupportBtn) {
            findSupportBtn.addEventListener('click', () => {
                if (this.fullPageInstance) {
                    fullpage_api.moveTo('help');
                }
                this.showHelpSection('support');
            });
        }
    }

    initMobileTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const helpSections = document.querySelectorAll('.help-section');
        
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // Remove active class from all tabs and sections
                tabButtons.forEach(b => b.classList.remove('active'));
                helpSections.forEach(s => s.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding section
                btn.classList.add('active');
                const targetSection = document.getElementById(`${targetTab}-section`);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            });
        });
    }

    initCounters() {
        const counterElements = {
            'quit-counter': this.counters.quitCounter,
            'money-saved': this.counters.moneySaved,
            'health-days': this.counters.healthDays,
            'global-users': this.counters.globalUsers,
            'countries': this.counters.countries
        };
        
        Object.keys(counterElements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                this.animateCounter(element, counterElements[id]);
            }
        });
        
        // Update counters every 30 seconds
        setInterval(() => {
            this.updateCounters();
        }, 30000);
    }

    animateCounter(element, targetValue) {
        const startValue = 0;
        const duration = 2000;
        const startTime = performance.now();
        
        const formatNumber = (num) => {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M';
            } else if (num >= 1000) {
                return (num / 1000).toFixed(0) + 'K';
            }
            return num.toLocaleString();
        };
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
            
            if (element.id === 'money-saved') {
                element.textContent = '$' + formatNumber(currentValue);
            } else if (element.id === 'success-rate') {
                element.textContent = currentValue + '%';
            } else {
                element.textContent = formatNumber(currentValue);
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    updateCounters() {
        // Simulate live counter updates
        this.counters.quitCounter += Math.floor(Math.random() * 5) + 1;
        this.counters.moneySaved += Math.floor(Math.random() * 500) + 100;
        this.counters.healthDays += Math.floor(Math.random() * 50) + 10;
        
        // Update displayed counters
        const quitElement = document.getElementById('quit-counter');
        const moneyElement = document.getElementById('money-saved');
        const healthElement = document.getElementById('health-days');
        
        if (quitElement) quitElement.textContent = this.counters.quitCounter.toLocaleString();
        if (moneyElement) moneyElement.textContent = '$' + this.counters.moneySaved.toLocaleString();
        if (healthElement) healthElement.textContent = this.counters.healthDays.toLocaleString();
    }

    initDonationWidget() {
        const amountButtons = document.querySelectorAll('.amount-btn');
        const customDonationInput = document.getElementById('custom-donation');
        let selectedAmount = 0;
        
        amountButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove selected class from all buttons
                amountButtons.forEach(b => b.classList.remove('selected'));
                // Add selected class to clicked button
                btn.classList.add('selected');
                
                selectedAmount = parseInt(btn.textContent.replace('$', ''));
                if (customDonationInput) {
                    customDonationInput.value = '';
                }
                
                this.updatePayPalButton(selectedAmount);
            });
        });
        
        if (customDonationInput) {
            customDonationInput.addEventListener('input', () => {
                const customAmount = parseInt(customDonationInput.value);
                if (customAmount > 0) {
                    // Remove selected class from all buttons
                    amountButtons.forEach(b => b.classList.remove('selected'));
                    selectedAmount = customAmount;
                    this.updatePayPalButton(selectedAmount);
                }
            });
        }
        
        // Initialize PayPal button with default amount
        this.initPayPalButton();
    }

    initPayPalButton() {
        if (typeof paypal === 'undefined') {
            console.warn('PayPal SDK not loaded');
            return;
        }
        
        const paypalContainer = document.getElementById('paypal-button-container');
        if (!paypalContainer) return;
        
        paypal.Buttons({
            createOrder: (data, actions) => {
                const amount = this.getSelectedDonationAmount();
                const frequency = document.querySelector('input[name="frequency"]:checked')?.value || 'once';
                
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: amount.toString()
                        },
                        description: `CleanVape ${frequency === 'monthly' ? 'Monthly ' : ''}Donation`
                    }]
                });
            },
            
            onApprove: (data, actions) => {
                return actions.order.capture().then((details) => {
                    this.handleDonationSuccess(details);
                });
            },
            
            onError: (err) => {
                console.error('PayPal error:', err);
                this.showNotification('There was an error processing your donation. Please try again.', 'error');
            },
            
            style: {
                layout: 'vertical',
                color: 'blue',
                shape: 'rect',
                label: 'donate'
            }
        }).render('#paypal-button-container');
    }

    updatePayPalButton(amount) {
        // PayPal button updates would go here
        // For demo purposes, we'll just log the amount
        console.log('Updated donation amount:', amount);
    }

    getSelectedDonationAmount() {
        const selectedButton = document.querySelector('.amount-btn.selected');
        const customInput = document.getElementById('custom-donation');
        
        if (selectedButton) {
            return parseInt(selectedButton.textContent.replace('$', ''));
        } else if (customInput && customInput.value) {
            return parseInt(customInput.value);
        }
        
        return 5; // Default amount
    }

    handleDonationSuccess(details) {
        console.log('Donation successful:', details);
        this.showNotification('Thank you for your generous donation!', 'success');
        
        // Reset donation form
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        const customInput = document.getElementById('custom-donation');
        if (customInput) customInput.value = '';
    }

    initForms() {
        this.initQuitCalculator();
        this.initSupportForm();
    }

    initQuitCalculator() {
        const calculatorForm = document.getElementById('quit-calculator-form');
        const resultsDiv = document.getElementById('calculator-results');
        
        if (calculatorForm) {
            calculatorForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const dailySpend = parseFloat(document.getElementById('daily-spend').value);
                const yearsVaping = parseFloat(document.getElementById('years-vaping').value);
                const quitDate = new Date(document.getElementById('quit-date').value);
                
                if (dailySpend && yearsVaping && quitDate) {
                    this.calculateQuitBenefits(dailySpend, yearsVaping, quitDate);
                    resultsDiv.style.display = 'block';
                    resultsDiv.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    calculateQuitBenefits(dailySpend, yearsVaping, quitDate) {
        const monthlySpend = dailySpend * 30;
        const yearlySpend = dailySpend * 365;
        const averageLifespan = 75; // years
        const currentAge = 25; // assumed average age
        const remainingYears = averageLifespan - currentAge;
        const lifetimeSavings = yearlySpend * remainingYears;
        
        // Update results
        document.getElementById('result-monthly').textContent = '$' + monthlySpend.toFixed(0);
        document.getElementById('result-yearly').textContent = '$' + yearlySpend.toFixed(0);
        document.getElementById('result-lifetime').textContent = '$' + lifetimeSavings.toFixed(0);
        document.getElementById('result-health').textContent = '+25%';
        
        // Animate the results
        this.animateResults();
    }

    animateResults() {
        const resultItems = document.querySelectorAll('.result-item');
        resultItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'scale(1.05)';
                item.style.transition = 'transform 0.3s ease';
                
                setTimeout(() => {
                    item.style.transform = 'scale(1)';
                }, 300);
            }, index * 200);
        });
    }

    initSupportForm() {
        const supportForm = document.getElementById('support-form');
        
        if (supportForm) {
            supportForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = new FormData(supportForm);
                const supportData = {
                    name: formData.get('support-name'),
                    email: formData.get('support-email'),
                    location: formData.get('support-location'),
                    supportType: formData.get('support-type'),
                    message: formData.get('support-message')
                };
                
                this.handleSupportRequest(supportData);
            });
        }
    }

    handleSupportRequest(data) {
        console.log('Support request:', data);
        
        // Simulate API call
        setTimeout(() => {
            this.showNotification('Thank you! We\'ll connect you with support resources within 24 hours.', 'success');
            
            // Reset form
            document.getElementById('support-form').reset();
        }, 1000);
    }

    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(faq => faq.classList.remove('active'));
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    initCharts() {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded');
            return;
        }
        
        this.initSuccessChart();
        this.initHealthChart();
        this.initSavingsChart();
        this.initTimelineChart();
    }

    initSuccessChart() {
        const ctx = document.getElementById('success-chart');
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['30 days', '90 days', '1 year'],
                datasets: [{
                    data: [67, 84, 92],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(16, 185, 129, 0.6)',
                        'rgba(16, 185, 129, 0.4)'
                    ],
                    borderColor: [
                        'rgba(16, 185, 129, 1)',
                        'rgba(16, 185, 129, 1)',
                        'rgba(16, 185, 129, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    initHealthChart() {
        const ctx = document.getElementById('health-chart');
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Lung Function', 'Sleep Quality', 'Energy Levels'],
                datasets: [{
                    data: [25, 40, 35],
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 50,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    initSavingsChart() {
        const ctx = document.getElementById('savings-chart');
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['1 Month', '3 Months', '6 Months', '1 Year'],
                datasets: [{
                    label: 'Savings ($)',
                    data: [127, 381, 762, 1524],
                    borderColor: 'rgba(16, 185, 129, 1)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                }
            }
        });
    }

    initTimelineChart() {
        const ctx = document.getElementById('timeline-chart');
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['24 Hours', '72 Hours', '2 Weeks', '3 Months'],
                datasets: [{
                    label: 'Health Progress',
                    data: [20, 45, 70, 90],
                    borderColor: 'rgba(16, 185, 129, 1)',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    pointBackgroundColor: 'rgba(16, 185, 129, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(16, 185, 129, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    initMap() {
        // Placeholder for map initialization
        // In a real implementation, this would integrate with Google Maps, Leaflet, or similar
        const mapContainer = document.getElementById('world-map');
        if (mapContainer) {
            setTimeout(() => {
                const placeholder = mapContainer.querySelector('.map-placeholder');
                if (placeholder) {
                    placeholder.innerHTML = `
                        <div style="color: #10b981; font-size: 2rem; margin-bottom: 1rem;">
                            <i class="fas fa-map-marked-alt"></i>
                        </div>
                        <p>Interactive World Map</p>
                        <p style="font-size: 0.9rem; color: #6b7280;">Showing CleanVape impact across ${this.counters.countries} countries</p>
                    `;
                }
            }, 2000);
        }
    }

    initAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        document.querySelectorAll('.stat-card, .feature, .impact-item, .visual-stat').forEach(el => {
            observer.observe(el);
        });
    }

    updateActiveNavigation(anchor) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${anchor}`) {
                link.classList.add('active');
            }
        });
    }

    animateSection(index, direction) {
        const section = document.querySelector(`.section:nth-child(${index + 1})`);
        if (section) {
            section.style.opacity = '0';
            section.style.transform = direction === 'down' ? 'translateY(50px)' : 'translateY(-50px)';
            
            setTimeout(() => {
                section.style.transition = 'all 0.6s ease-out';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    triggerSectionAnimations(index) {
        const section = document.querySelector(`.section:nth-child(${index + 1})`);
        if (section) {
            const animateElements = section.querySelectorAll('.counter-item, .stat-card, .feature');
            animateElements.forEach((el, i) => {
                setTimeout(() => {
                    el.classList.add('slide-up');
                }, i * 100);
            });
        }
    }

    handleResize() {
        const newIsDesktop = window.innerWidth >= 1024;
        if (newIsDesktop !== this.isDesktop) {
            this.isDesktop = newIsDesktop;
            this.reinitializeFeatures();
        }
    }

    handleScroll() {
        if (this.isDesktop) return;
        
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }
    }

    handleKeyboardNavigation(e) {
        if (!this.isDesktop || !this.fullPageInstance) return;
        
        switch(e.key) {
            case 'ArrowUp':
            case 'ArrowLeft':
                fullpage_api.moveSectionUp();
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                fullpage_api.moveSectionDown();
                break;
            case 'Home':
                fullpage_api.moveTo(1);
                break;
            case 'End':
                fullpage_api.moveTo(6);
                break;
        }
    }

    setupFormHandlers() {
        // Hero buttons
        const startJourneyBtn = document.getElementById('start-journey');
        const learnMoreBtn = document.getElementById('learn-more');
        
        if (startJourneyBtn) {
            startJourneyBtn.addEventListener('click', () => {
                if (this.isDesktop && this.fullPageInstance) {
                    fullpage_api.moveTo('help');
                } else {
                    document.getElementById('help').scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
        
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', () => {
                if (this.isDesktop && this.fullPageInstance) {
                    fullpage_api.moveTo('about');
                } else {
                    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    showHelpSection(sectionName) {
        // For desktop, this would update the sidebar or main content
        // For mobile, this would switch tabs
        if (!this.isDesktop) {
            const tabBtn = document.querySelector(`[data-tab="${sectionName}"]`);
            if (tabBtn) {
                tabBtn.click();
            }
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontSize: '0.9rem',
            zIndex: '10001',
            maxWidth: '300px',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease-out'
        });
        
        // Set background color based on type
        switch(type) {
            case 'success':
                notification.style.backgroundColor = '#10b981';
                break;
            case 'error':
                notification.style.backgroundColor = '#ef4444';
                break;
            case 'warning':
                notification.style.backgroundColor = '#f97316';
                break;
            default:
                notification.style.backgroundColor = '#3b82f6';
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    reinitializeFeatures() {
        console.log('Reinitializing features for', this.isDesktop ? 'desktop' : 'mobile');
        
        // Clear existing features
        this.destroyFullPage();
        
        // Initialize appropriate features
        if (this.isDesktop) {
            this.initDesktopFeatures();
        } else {
            this.initMobileFeatures();
        }
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    processDonation(amount) {
        console.log(`Processing donation of $${amount}`);
        this.showNotification(`Selected $${amount} donation`, 'info');
    }

    showCustomDonationModal() {
        const customAmount = prompt('Enter custom donation amount:');
        if (customAmount && !isNaN(customAmount) && customAmount > 0) {
            this.processDonation(customAmount);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cleanVapeApp = new CleanVapeApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.classList.add('paused');
    } else {
        // Resume animations when tab becomes visible
        document.body.classList.remove('paused');
    }
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

// Service Worker registration (for future PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker would be registered here in a production environment
        console.log('Service Worker support detected');
    });
}