// Cortés Agency – app.js
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

// Nav toggle
const toggle = $('.nav__toggle');
const navList = $('#navMenu');
if (toggle){
  toggle.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  $$('#navMenu a').forEach(a => a.addEventListener('click', ()=>{
    navList.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
  }));
}

// Header on scroll
const header = $('.site-header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
};
window.addEventListener('scroll', onScroll); onScroll();

// Scroll spy
const sections = $$('main section[id]');
const spy = () => {
  let id = "";
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom >= 120) id = sec.id;
  });
  $$('#navMenu a').forEach(a => {
    a.classList.toggle('is-active', a.getAttribute('href') === '#'+id);
  });
};
window.addEventListener('scroll', spy);

// Parallax hero (very subtle)
const hero = $('.hero');
if (hero){
  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.15;
    hero.style.backgroundPositionY = `-${y}px`;
  });
}

// Counters
const counters = $$('[data-count]');
if (counters.length){
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting){
        const el = e.target;
        const target = +el.dataset.count;
        let n = 0;
        const step = Math.ceil(target/40);
        const int = setInterval(()=>{
          n += step;
          if (n >= target){ n = target; clearInterval(int); }
          el.textContent = n;
        }, 30);
        io.unobserve(el);
      }
    });
  }, {threshold:.6});
  counters.forEach(c=>io.observe(c));
}

// Modals
$$('[data-modal]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const sel = btn.getAttribute('data-modal');
    const modal = $(sel);
    if(modal){
      modal.hidden = false;
      modal.querySelector('[data-close]').focus();
      modal.addEventListener('click', (e)=>{
        if(e.target === modal || e.target.hasAttribute('data-close')) modal.hidden = true;
      });
      document.addEventListener('keydown', (e)=>{
        if(e.key==='Escape') modal.hidden = true;
      }, {once:true});
    }
  });
});

// Gallery filtering
const gallery = $('#gallery');
if (gallery){
  const filters = $$('.filter');
  filters.forEach(f=>f.addEventListener('click', ()=>{
    filters.forEach(b=>b.classList.remove('is-active'));
    f.classList.add('is-active');
    const tag = f.dataset.filter;
    $$('.item', gallery).forEach(it=>{
      const tags = it.dataset.tags || "";
      const show = tag === 'all' || tags.includes(tag);
      it.style.display = show ? '' : 'none';
    });
  }));
}

// Testimonials slider (auto)
const slider = $('[data-slider]');
if (slider){
  const slides = $$('.slide', slider);
  const dotsWrap = $('.slider__dots', slider);
  slides.forEach((_,i)=>{
    const b = document.createElement('button');
    b.addEventListener('click', ()=>go(i));
    dotsWrap.appendChild(b);
  });
  const dots = $$('button', dotsWrap);
  let idx = 0, timer;
  const go = (i) => {
    slides[idx].classList.remove('is-active');
    dots[idx].classList.remove('is-active');
    idx = i;
    slides[idx].classList.add('is-active');
    dots[idx].classList.add('is-active');
    reset();
  };
  const reset = () => {
    clearInterval(timer);
    timer = setInterval(()=> go((idx+1)%slides.length), 5000);
  };
  go(0);
  slider.addEventListener('mouseenter', ()=>clearInterval(timer));
  slider.addEventListener('mouseleave', reset);
}

// Theme toggle
const themeBtn = $('.theme-toggle');
if (themeBtn){
  const apply = (t)=> document.documentElement.classList.toggle('light', t==='light');
  const saved = localStorage.getItem('theme') || 'dark';
  apply(saved);
  themeBtn.addEventListener('click', ()=>{
    const t = document.documentElement.classList.contains('light') ? 'dark' : 'light';
    localStorage.setItem('theme', t);
    apply(t);
  });
}

// Simple form success message (for static hosting)
const form = $('.form');
if(form){
  form.addEventListener('submit', (e)=>{
    const status = $('.form__status', form);
    status.textContent = 'Wysyłanie…';
    setTimeout(()=>{
      status.textContent = 'Dziękujemy! Skontaktujemy się niebawem.';
      form.reset();
    }, 600);
  });
}
