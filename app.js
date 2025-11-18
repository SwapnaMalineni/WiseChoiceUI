/* Globals */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

document.addEventListener('DOMContentLoaded', () => {
  $('#year').textContent = new Date().getFullYear();

  setupSmoothScroll();
  runIntroAnimations();
  initAOS();
  initSwipers();
  setupBackToTop();
});

/* Smooth scroll for anchor links */
function setupSmoothScroll() {
  [...$$('.nav-links a'), $('#get-started'), $('.cta-try')].filter(Boolean).forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        const target = $(href);
        if (!target) return document.body.scrollTo({ top: 0, behavior: 'smooth' });
        document.body.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
      }
    });
  });
}

/* Swiper sliders */
function initSwipers() {
  if (window.Swiper) {
    // Hero slider
    new Swiper('.hero-swiper', {
      loop: true,
      speed: 700,
      autoplay: { delay: 4500, disableOnInteraction: false },
      pagination: { el: '.hero-pagination', clickable: true },
      navigation: { nextEl: '.hero-next', prevEl: '.hero-prev' },
      effect: 'fade',
      fadeEffect: { crossFade: true }
    });

    // About Us slider
    const aboutSwiper = new Swiper('.about-swiper', {
      loop: true,
      speed: 600,
      autoplay: { delay: 4000, disableOnInteraction: false },
      pagination: { el: '.about-pagination', clickable: true },
      effect: 'fade',
      fadeEffect: { crossFade: true },
      grabCursor: true,
      on: {
        init: function () {
          updateAboutContent(this.slides[this.activeIndex]);
        },
        slideChangeTransitionStart: function () {
          // Fade out current content
          gsap.to(['#about-slide-title', '#about-slide-description', '#about-slide-button'], {
            opacity: 0,
            y: -10,
            duration: 0.3,
            ease: 'power1.in'
          });
        },
        slideChangeTransitionEnd: function () {
          updateAboutContent(this.slides[this.activeIndex]);
        }
      }
    });

    function updateAboutContent(activeSlide) {
      const title = activeSlide.dataset.title;
      const description = activeSlide.dataset.description;
      const buttonText = activeSlide.dataset.buttonText;
      const buttonLink = activeSlide.dataset.buttonLink;

      $('#about-slide-title').textContent = title;
      $('#about-slide-description').textContent = description;
      const button = $('#about-slide-button');
      button.textContent = buttonText;
      button.setAttribute('href', buttonLink);

      // Animate new content in
      gsap.fromTo(['#about-slide-title', '#about-slide-description', '#about-slide-button'], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' });
    }

    // Testimonials slider
    new Swiper('.testimonial-swiper', {
      loop: true,
      speed: 600,
      autoplay: { delay: 5000, disableOnInteraction: false },
      slidesPerView: 2,
      spaceBetween: 30,
      pagination: { el: '.testimonial-pagination', clickable: true },
      navigation: { nextEl: '.testimonial-next', prevEl: '.testimonial-prev' },
      breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 40
        }
      }
    });
  }
}

/* Back to Top Button */
function setupBackToTop() {
  const backToTopButton = $('#back-to-top');
  if (!backToTopButton) return;

  // Use window for scroll events for cross-browser compatibility
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Show button only when scrolled to the bottom (within 100px of the end)
    if (scrollTop + windowHeight >= documentHeight - 100) {
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }
  });

  // The smooth scroll is already handled by setupSmoothScroll,
  // so we don't need a separate click listener here.
  // The href="#home" will be caught by the main smooth scroll function.
}

/* GSAP Animations */
function runIntroAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Navbar slide-in on scroll
  const navbar = $('#navbar');
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > lastY && y > 80) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    lastY = y;
  });

  // Hero text fade + stagger
  const tl = gsap.timeline();
  tl.from('.headline .headline-line', { y: 20, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out' })
    .from('.subhead', { y: 10, opacity: 0, duration: 0.4 }, '-=0.2')
    .from('.analyze-form', { y: 10, opacity: 0, duration: 0.4 }, '-=0.2')
    .from('.hero-badges span', { y: 8, opacity: 0, duration: 0.3, stagger: 0.06 }, '-=0.2');
  
  // Animate counters on scroll
  $$('.counter-number').forEach(counter => {
    const target = +counter.dataset.target;
    const counterObj = { val: 0 };

    gsap.to(counterObj, {
      val: target,
      duration: 2.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: counter,
        start: 'top 85%',
      },
      onUpdate: () => counter.textContent = Math.floor(counterObj.val).toLocaleString()
    });
  });


}

function initAOS() {
  if (window.AOS) {
    AOS.init({ duration: 600, once: true, easing: 'ease-out-quart' });
  }
}

/* Contact Form Submission */
function sendMessage() {
  const name = $('#name').value.trim();
  const email = $('#email').value.trim();
  const subject = $('#subject').value.trim();
  const message = $('#message').value.trim();

  if (!name || !email || !subject || !message) {
    alert('Please fill in all fields.');
    return;
  }

  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  // For demo purposes, just log the message and show a success alert
  console.log('Contact Form Submission:', { name, email, subject, message });
  alert('Thank you for your message! We will get back to you soon.');

  // Clear the form
  $('#name').value = '';
  $('#email').value = '';
  $('#subject').value = '';
  $('#message').value = '';
}
