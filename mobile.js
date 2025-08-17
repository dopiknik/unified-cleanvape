/* =========================================================
   Mobile Site Logic (Complete Fixed Version)
   ========================================================= */
(function(){
  const PRELOADER_KEY='preloaderSeenStable';
  const PRELOADER_TIMEOUT=3200;
  const ENABLE_FAQ_SLIDER=true;
  const SLIDER_AUTO_HEIGHT=true;
  const SWIPE_HINT_KEY='faqSwipeHintShown';
  const FAQ_SINGLE_OPEN=false;
  const SLIDER_SWIPE_THRESHOLD=55;
  const DEBUG=false;

  let preloaderFinished=false;
  let numbersStarted=false;
  let slider={init:false,activeIndex:0,track:null,panels:[],wrapper:null};

  document.addEventListener('DOMContentLoaded',init);

  function log(...a){ if(DEBUG) console.log('[APP]',...a); }

  function init(){
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

  function setYear(){ const y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear(); }
  function setAppHeightVar(){ document.documentElement.style.setProperty('--app-dvh', window.innerHeight+'px'); }

  /* ---------- Preloader ---------- */
  function initPreloader(){
    const body=document.body;
    const pre=document.getElementById('preloader');
    const skip=document.getElementById('preloaderSkip');
    const header=document.querySelector('.site-header');
    function finish(){
      if(preloaderFinished) return;
      preloaderFinished=true;
      if(pre){ pre.classList.add('hide'); setTimeout(()=>pre.remove(),900); }
      body.classList.remove('is-locked');
      header?.classList.add('ready');
      sessionStorage.setItem(PRELOADER_KEY,'1');
      startNumbers();
      showSwipeHintOnce();
    }
    if(!pre){ finish(); return; }
    if(sessionStorage.getItem(PRELOADER_KEY)){ finish(); return; }
    setTimeout(finish,PRELOADER_TIMEOUT);
    skip?.addEventListener('click',()=>finish());
    setTimeout(()=>finish(),9000);
  }

  /* ---------- Navigation ---------- */
  function initNav(){
    const body=document.body;
    const burger=document.getElementById('burgerBtn');
    const nav=document.getElementById('mainNav');
    const overlay=document.getElementById('navOverlay');
    const closeBtn=nav?.querySelector('.nav-close-btn');
    let pointerOrigin=null;

    burger?.addEventListener('pointerdown',e=>{ pointerOrigin={x:e.clientX,y:e.clientY}; });
    burger?.addEventListener('click',e=>{
      if(pointerOrigin){
        const dx=Math.abs(e.clientX-pointerOrigin.x);
        const dy=Math.abs(e.clientY-pointerOrigin.y);
        if(dx>10||dy>10) return;
      }
      toggleNav();
    });
    closeBtn?.addEventListener('click', closeNav);

    function toggleNav(){ burger.getAttribute('aria-expanded')==='true'?closeNav():openNav(); }
    function openNav(){
      burger?.setAttribute('aria-expanded','true');
      nav?.classList.add('open');
      overlay?.removeAttribute('hidden');
      overlay?.classList.add('visible');
      body.style.overflow='hidden';
      trapFocus(nav, burger);
    }
    function closeNav(){
      burger?.setAttribute('aria-expanded','false');
      nav?.classList.remove('open');
      overlay?.setAttribute('hidden','');
      overlay?.classList.remove('visible');
      if(!body.classList.contains('is-locked')) body.style.overflow='';
      releaseFocusTrap();
    }
    overlay?.addEventListener('click', closeNav);
    nav?.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click',()=>{ if(burger.offsetParent!==null) closeNav(); });
    });

    /* Focus trap */
    let focusTrapHandler;
    function trapFocus(container,returnEl){
      const sel='a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])';
      const nodes=[...container.querySelectorAll(sel)].filter(el=>!el.disabled && el.offsetParent!==null);
      if(!nodes.length) return;
      nodes[0].focus();
      focusTrapHandler=(e)=>{
        if(e.key==='Escape'){ closeNav(); returnEl?.focus(); }
        if(e.key==='Tab'){
          const first=nodes[0], last=nodes[nodes.length-1];
          if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
          else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
        }
      };
      document.addEventListener('keydown',focusTrapHandler);
    }
    function releaseFocusTrap(){
      if(focusTrapHandler){
        document.removeEventListener('keydown',focusTrapHandler);
        focusTrapHandler=null;
      }
    }
  }

  /* ---------- Back to Top ---------- */
  function initBackToTop(){
    const btn=document.getElementById('backToTop');
    if(!btn) return;
    window.addEventListener('scroll',()=>{
      if(window.scrollY>600) btn.classList.add('visible');
      else btn.classList.remove('visible');
    });
    btn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  }

  /* ---------- Map Toggle ---------- */
  function initMapToggle(){
    const frame=document.getElementById('mapFrame');
    const btn=document.getElementById('activateMap');
    if(!frame||!btn) return;
    btn.addEventListener('click',()=>{
      const active=btn.getAttribute('aria-pressed')==='true';
      if(!active){
        frame.style.pointerEvents='auto';
        btn.setAttribute('aria-pressed','true');
        btn.textContent='Interaction enabled';
      }else{
        frame.style.pointerEvents='none';
        btn.setAttribute('aria-pressed','false');
        btn.textContent='Enable map interaction';
      }
    });
  }

  /* ---------- Numbers ---------- */
  function startNumbers(){
    if(numbersStarted) return;
    numbersStarted=true;
    const els=document.querySelectorAll('[data-anim="number"]');
    els.forEach(el=>{ el.textContent='0'; el.dataset.animDone='0'; });

    function animate(el){
      if(!el||el.dataset.animDone==='1') return;
      el.dataset.animDone='1';
      const target=parseFloat(el.dataset.target||'0');
      const dec=parseInt(el.dataset.decimal||'0',10);
      const dur=2000;
      const start=performance.now();
      function frame(now){
        const p=Math.min((now-start)/dur,1);
        const val=target*p;
        el.textContent= dec?val.toFixed(dec):Math.floor(val).toLocaleString();
        if(p<1) requestAnimationFrame(frame);
        else el.textContent= dec?target.toFixed(dec):target.toLocaleString();
      }
      requestAnimationFrame(frame);
    }

    if('IntersectionObserver' in window){
      const obs=new IntersectionObserver(entries=>{
        entries.forEach(e=>{
          if(e.isIntersecting){ animate(e.target); obs.unobserve(e.target); }
        });
      },{threshold:.4});
      els.forEach(n=>obs.observe(n));
    }else{
      els.forEach(animate);
    }

    const mc=document.getElementById('mainCounter');
    if(mc){
      const r=mc.getBoundingClientRect();
      if(r.top>=0 && r.bottom<=window.innerHeight) animate(mc);
    }
    window.__forceNumbers=()=>els.forEach(animate);
  }

  /* ---------- Donation Widget ---------- */
  function initDonationWidget(){
    const widget=document.getElementById('donationWidget');
    if(!widget) return;
    const IS_SANDBOX=false;
    const HOSTED='YOUR_HOSTED_BUTTON_ID';
    const CURRENCY='USD';
    const PLANS={10:'P-PLANID_FOR_10',25:'P-PLANID_FOR_25',50:'P-PLANID_FOR_50',100:'P-PLANID_FOR_100'};
    const BASE=IS_SANDBOX?'https://www.sandbox.paypal.com':'https://www.paypal.com';

    const form=widget.querySelector('#donationForm');
    const btns=widget.querySelectorAll('.donation-amount-btn');
    const input=widget.querySelector('#donationAmountInput');
    const errorBox=widget.querySelector('#donationError');
    let selected=25;

    highlight(selected);
    btns.forEach(b=>b.addEventListener('click',()=>{
      selected=parseInt(b.dataset.amount,10);
      input.value='';
      highlight(selected); clearErr();
    }));
    input?.addEventListener('input',()=>{
      if(input.value.trim()!==''){
        selected=parseInt(input.value,10)||0;
        btns.forEach(b=>b.classList.remove('active'));
      }else highlight(selected);
      clearErr();
    });
    form?.addEventListener('submit',e=>{
      e.preventDefault();
      clearErr();
      if(selected<=0){ showErr('Enter a valid amount.'); return; }
      const freq=widget.querySelector('input[name="donationFrequency"]:checked')?.value || 'oneTime';
      if(freq==='oneTime'){
        window.open(`${BASE}/donate/?hosted_button_id=${encodeURIComponent(HOSTED)}&amount=${encodeURIComponent(selected)}&currency_code=${encodeURIComponent(CURRENCY)}`,'_blank','noopener');
      }else{
        const plan=PLANS[selected]; if(!plan){ showErr('No subscription plan for this amount.'); return; }
        window.open(`${BASE}/webapps/billing/subscriptions?plan_id=${encodeURIComponent(plan)}`,'_blank','noopener');
      }
    });
    function highlight(a){
      btns.forEach(b=>b.classList.remove('active'));
      const m=[...btns].find(b=>parseInt(b.dataset.amount,10)===a);
      if(m) m.classList.add('active');
    }
    function showErr(m){ if(errorBox) errorBox.textContent=m; }
    function clearErr(){ if(errorBox) errorBox.textContent=''; }
  }

  /* ---------- Donation Accordion ---------- */
  function initDonationAccordion(){
    const items=[...document.querySelectorAll('.accordion-item')];
    items.forEach(btn=>{
      btn.addEventListener('click',()=>{
        const exp=btn.getAttribute('aria-expanded')==='true';
        if(FAQ_SINGLE_OPEN && !exp){
          items.forEach(i=>{ if(i!==btn) i.setAttribute('aria-expanded','false'); });
        }
        btn.setAttribute('aria-expanded', exp?'false':'true');
      });
    });
  }

  /* ---------- Tabs / Slider ---------- */
  function initTabsSlider(){
    if(!ENABLE_FAQ_SLIDER){ initClassicTabs(); return; }
    const wrapper=document.querySelector('.tab-panels');
    const tabBtns=document.querySelectorAll('.tab-btn');
    const panels=document.querySelectorAll('.tab-panel');
    if(!wrapper||panels.length<2){ initClassicTabs(); return; }

    wrapper.classList.add('slider-mode');
    if(SLIDER_AUTO_HEIGHT) wrapper.classList.add('auto-height');

    const track=document.createElement('div');
    track.className='tab-slider-track';
    panels.forEach(p=>{
      p.classList.remove('is-hidden');
      p.classList.add('tab-slide');
      p.setAttribute('aria-hidden', p.id==='panelOrder'?'false':'true');
      track.appendChild(p);
    });
    wrapper.appendChild(track);

    slider.init=true;
    slider.track=track;
    slider.panels=[...panels];
    slider.wrapper=wrapper;
    slider.activeIndex=0;

    if(SLIDER_AUTO_HEIGHT) adjustSliderHeight();

    tabBtns.forEach(btn=>{
      btn.addEventListener('click',()=>{
        const key=btn.getAttribute('data-tab');
        gotoSlide(key==='faq'?1:0,true);
      });
    });

    let startX=0,startY=0,swiping=false,locked=false;
    wrapper.addEventListener('touchstart',e=>{
      if(e.touches.length!==1) return;
      startX=e.touches[0].clientX;
      startY=e.touches[0].clientY;
      swiping=false; locked=false;
    },{passive:true});
    wrapper.addEventListener('touchmove',e=>{
      if(e.touches.length!==1||locked) return;
      const dx=e.touches[0].clientX-startX;
      const dy=e.touches[0].clientY-startY;
      if(!swiping){
        if(Math.abs(dx)>14 && Math.abs(dx)>Math.abs(dy)){ swiping=true; }
        else if(Math.abs(dy)>12){ locked=true; }
      }
    },{passive:true});
    wrapper.addEventListener('touchend',e=>{
      if(!swiping) return;
      const dx=e.changedTouches[0].clientX-startX;
      if(dx<-SLIDER_SWIPE_THRESHOLD && slider.activeIndex<slider.panels.length-1){
        gotoSlide(slider.activeIndex+1,true);
      } else if(dx>SLIDER_SWIPE_THRESHOLD && slider.activeIndex>0){
        gotoSlide(slider.activeIndex-1,true);
      }
    });

    wrapper.addEventListener('keydown',e=>{
      if(e.key==='ArrowLeft') gotoSlide(slider.activeIndex-1,true);
      else if(e.key==='ArrowRight') gotoSlide(slider.activeIndex+1,true);
    });

    function gotoSlide(index, focus){
      if(!slider.init) return;
      if(index<0 || index>=slider.panels.length) return;
      slider.activeIndex=index;
      track.style.transform=`translateX(-${index*100}%)`;
      slider.panels.forEach((p,i)=>p.setAttribute('aria-hidden', i===index?'false':'true'));
      tabBtns.forEach(b=>{
        const idx = b.getAttribute('data-tab')==='faq'?1:0;
        b.setAttribute('aria-selected', idx===index?'true':'false');
      });
      if(SLIDER_AUTO_HEIGHT) adjustSliderHeight();
      if(focus){
        const panel=slider.panels[index];
        panel.setAttribute('tabindex','-1');
        panel.focus({preventScroll:true});
        setTimeout(()=>panel.removeAttribute('tabindex'),400);
      }
    }

    function adjustSliderHeight(){
      const active=slider.panels[slider.activeIndex];
      if(!active) return;
      slider.wrapper.style.height=active.offsetHeight+'px';
    }

    window.addEventListener('resize',()=>{ if(slider.init && SLIDER_AUTO_HEIGHT) adjustSliderHeight(); });

    slider.goto=gotoSlide;
    gotoSlide(0,false);

    window.__gotoFAQ=()=>gotoSlide(1,true);
  }

  function initClassicTabs(){
    const tabBtns=document.querySelectorAll('.tab-btn');
    const panels=document.querySelectorAll('.tab-panel');
    tabBtns.forEach(btn=>{
      btn.addEventListener('click',()=>{
        const key=btn.getAttribute('data-tab');
        const targetId='panel'+key.charAt(0).toUpperCase()+key.slice(1);
        tabBtns.forEach(b=>b.setAttribute('aria-selected', b===btn?'true':'false'));
        panels.forEach(p=>p.classList.toggle('is-hidden', p.id!==targetId));
      });
    });
  }

  function maybeDeepLinkToFAQ(){
    if(!ENABLE_FAQ_SLIDER){
      if(location.hash.toLowerCase()==='#faq'){
        document.querySelector('.tab-btn[data-tab="faq"]')?.click();
        document.getElementById('panelFaq')?.scrollIntoView({behavior:'smooth'});
      }
      return;
    }
    if(location.hash.toLowerCase()==='#faq' && slider.init){
      slider.goto?.(1,false);
      document.getElementById('panelFaq')?.scrollIntoView({behavior:'smooth'});
    }
  }

  function showSwipeHintOnce(){
    if(!ENABLE_FAQ_SLIDER) return;
    if(sessionStorage.getItem(SWIPE_HINT_KEY)) return;
    const hint=document.getElementById('swipeHint');
    if(hint){
      sessionStorage.setItem(SWIPE_HINT_KEY,'1');
      hint.style.opacity='1';
      setTimeout(()=>hint.remove(),7000);
    }
  }

  /* ---------- Order Form (ПОЛНОСТЬЮ ПЕРЕПИСАННАЯ ВЕРСИЯ) ---------- */
  function initOrderForm(){
    const form=document.getElementById('orderForm');
    const feedback=document.getElementById('orderFeedback');
    if(!form) return;
    
    // Пересчёт высоты слайдера после отрисовки формы
    if(slider.init){
      requestAnimationFrame(()=>{ 
        if(slider.init) slider.wrapper.style.height=slider.panels[slider.activeIndex].offsetHeight+'px'; 
      });
    }

    form.addEventListener('submit',function(e){
      e.preventDefault();
      
      // Очистить предыдущие сообщения
      if(feedback) {
        feedback.className='form-feedback';
        feedback.textContent='';
      }
      
      // Список всех возможных ID полей (проверим все варианты)
      const possibleFields = [
        'reason', 'firstName', 'lastname', 'lastName', 'email', 'phone', 'message'
      ];
      
      // Найти все существующие поля в форме
      const existingFields = [];
      possibleFields.forEach(function(fieldId) {
        const field = document.getElementById(fieldId);
        if(field && (field.type !== 'hidden')) {
          existingFields.push({id: fieldId, element: field});
        }
      });
      
      // Определить обязательные поля (исключаем message - оно может быть необязательным)
      const requiredFields = existingFields.filter(function(field) {
        return field.id !== 'message';
      });
      
      let isValid = true;
      const errors = [];
      
      // Проверить каждое обязательное поле
      requiredFields.forEach(function(field) {
        const element = field.element;
        let value = '';
        
        if(element.tagName.toLowerCase() === 'select') {
          value = element.value;
        } else if(element.type === 'email') {
          value = element.value.trim();
        } else {
          value = element.value.trim();
        }
        
        // Проверка на пустоту
        if(!value) {
          isValid = false;
          errors.push(field.id);
          
          // Визуальное выделение ошибки
          element.style.border = '2px solid red';
          element.style.backgroundColor = '#ffe6e6';
          
          // Убрать выделение при вводе
          const removeError = function() {
            element.style.border = '';
            element.style.backgroundColor = '';
            element.removeEventListener('input', removeError);
            element.removeEventListener('change', removeError);
          };
          
          element.addEventListener('input', removeError);
          element.addEventListener('change', removeError);
        }
        
        // Дополнительная проверка email
        if(field.id === 'email' && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if(!emailRegex.test(value)) {
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
      
      // Показать результат
      if(feedback) {
        if(!isValid) {
          let message = 'Please fill all required fields';
          if(errors.includes('email-invalid')) {
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
          
          // Очистить форму через небольшую задержку
          setTimeout(function() {
            form.reset();
            // Очистить сообщение через 4 секунды
            setTimeout(function() {
              if(feedback) {
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

  /* ---------- Hash Focus ---------- */
  function initHashFocus(){
    function focusFromHash(){
      const id=window.location.hash.slice(1);
      if(!id) return;
      const el=document.getElementById(id);
      if(el){
        el.setAttribute('tabindex','-1');
        el.focus({preventScroll:true});
        setTimeout(()=>el.removeAttribute('tabindex'),600);
      }
    }
    window.addEventListener('hashchange',focusFromHash);
    focusFromHash();
  }

})();

