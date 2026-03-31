/* ================================================
   ALFULANY CONCEPT — MAIN JS
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Navbar Scroll Effect ───
  const navbar = document.querySelector('.navbar');
  const navHamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  if (navHamburger && mobileMenu) {
    navHamburger.addEventListener('click', () => {
      navHamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navHamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ─── Active nav link ───
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // ─── Scroll Reveal ───
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, entry.target.dataset.delay || 0);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  reveals.forEach(el => observer.observe(el));

  // ─── Staggered children reveal ───
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const children = parent.children;
    Array.from(children).forEach((child, i) => {
      child.classList.add('reveal');
      child.dataset.delay = i * 80;
      observer.observe(child);
    });
  });

  // ─── Animated counter ───
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + suffix;
          if (current >= target) clearInterval(timer);
        }, 25);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  // ─── Contact Form ───
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.form-submit');
      const success = document.getElementById('formSuccess');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Simulate send (replace with EmailJS or Formspree)
      setTimeout(() => {
        btn.textContent = 'Message Sent ✓';
        btn.style.background = '#00C864';
        if (success) success.style.display = 'block';
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = 'Send Message';
          btn.style.background = '';
          btn.disabled = false;
          if (success) success.style.display = 'none';
        }, 4000);
      }, 1800);
    });
  }

  // ─── Gallery lightbox (if on index) ───
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const label = item.querySelector('.gallery-overlay-text')?.textContent || 'Gallery';
      showToast(`📸 ${label} — Add your images here!`);
    });
  });

  // ─── Hero parallax subtle effect ───
  const heroBg = document.querySelector('.hero-bg-pattern');
  if (heroBg) {
    window.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      heroBg.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  // ─── Portfolio filters ───
  const filterTabs = document.querySelectorAll('.filter-tab');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  if (filterTabs.length) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.filter;
        portfolioCards.forEach(card => {
          if (filter === 'all' || card.dataset.cat === filter) {
            card.style.display = '';
            setTimeout(() => card.style.opacity = '1', 10);
          } else {
            card.style.opacity = '0';
            setTimeout(() => card.style.display = 'none', 300);
          }
        });
      });
    });
  }

  // ─── Portfolio lightbox ───
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    portfolioCards.forEach(card => {
      card.addEventListener('click', () => {
        const cat = card.dataset.cat || '';
        const name = card.querySelector('.portfolio-bottom-title')?.textContent || '';
        const emoji = card.querySelector('.portfolio-card-img')?.dataset.emoji || '🎨';
        lightbox.querySelector('.lightbox-img-box').textContent = emoji;
        lightbox.querySelector('.lightbox-cat').textContent = cat.toUpperCase();
        lightbox.querySelector('.lightbox-title').textContent = name;
        lightbox.querySelector('.lightbox-desc').textContent = 'This is a sample project by Alfulany Concept. Replace with your actual project description, client details, and real images.';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // ─── Store search filter ───
  const searchInput = document.getElementById('storeSearch');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      const cards = document.querySelectorAll('.book-card');
      let visible = 0;
      cards.forEach(card => {
        const title = card.querySelector('.book-title')?.textContent.toLowerCase() || '';
        const show = title.includes(q);
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      const countEl = document.getElementById('visibleCount');
      if (countEl) countEl.textContent = visible;
    });
  }
});

// ─── Toast Notification ───
function showToast(msg, duration = 3000) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

window.showToast = showToast;