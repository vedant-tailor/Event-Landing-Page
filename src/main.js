import './style.css'
import gsap from "gsap"


document.addEventListener('DOMContentLoaded', () => {

  // --- Feather Icons ---
  feather.replace();

  // --- Splitting JS for Text Animations ---
  Splitting();

  // --- Preloader ---
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
      gsap.to(preloader, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
              preloader.style.visibility = 'hidden';
              preloader.style.display = 'none';
          }
      });
      
      // --- Initial Page Load Animations ---
      const tl = gsap.timeline();
      tl.from('.hero-title .char', {
          y: 100,
          opacity: 0,
          stagger: 0.03,
          ease: 'back.out(1.7)',
          duration: 1
      })
      .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.8')
      .from('#countdown', { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6')
      .from('#hero-cta', { y: 20, opacity: 0, scale: 0.9, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.6')
      .from('#navbar', { y: -100, opacity: 0, duration: 1, ease: 'power3.out' }, '-=1');
  });

  // --- Custom Cursor ---
  const cursor = document.querySelector('.cursor');
  const cursorCircle = cursor.querySelector('.cursor__inner--circle');
  const interactiveElements = document.querySelectorAll('a, button, .speaker-card');

  gsap.set(cursor, { xPercent: -50, yPercent: -50 });
  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const mouse = { x: pos.x, y: pos.y };
  const speed = 0.1;

  const xSet = gsap.quickSetter(cursor, "x", "px");
  const ySet = gsap.quickSetter(cursor, "y", "px");

  window.addEventListener('mousemove', e => {
      mouse.x = e.x;
      mouse.y = e.y;
  });

  gsap.ticker.add(() => {
      const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
      pos.x += (mouse.x - pos.x) * dt;
      pos.y += (mouse.y - pos.y) * dt;
      xSet(pos.x);
      ySet(pos.y);
  });
  
  interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursorCircle.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorCircle.classList.remove('hover'));
  });


  // --- Horizontal Scrolling with GSAP ScrollTrigger ---
  const sections = gsap.utils.toArray(".panel");
  const track = document.querySelector("#scroll-track");

  let scrollTween = gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
          trigger: "#main-container",
          pin: true,
          scrub: 1,
          snap: 1 / (sections.length - 1),
          end: () => "+=" + track.offsetWidth
      }
  });

  // --- Animate elements within each section on scroll ---
  sections.forEach((section, i) => {
      // Animate section titles
      const sectionTitle = section.querySelector('.section-title');
      if (sectionTitle) {
          gsap.from(sectionTitle, {
              y: 50,
              opacity: 0,
              duration: 1,
              scrollTrigger: {
                  trigger: section,
                  containerAnimation: scrollTween,
                  start: 'left center',
              }
          });
      }
      
      // Animate speaker cards
      const speakerCards = section.querySelectorAll('.speaker-card');
      if (speakerCards.length > 0) {
          gsap.from(speakerCards, {
              y: 100,
              opacity: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                  trigger: section,
                  containerAnimation: scrollTween,
                  start: 'left 70%',
              }
          });
      }

      // Animate schedule items
      const scheduleItems = section.querySelectorAll('.schedule-item');
      if (scheduleItems.length > 0) {
          gsap.from(scheduleItems, {
              x: -100,
              opacity: 0,
              duration: 0.8,
              stagger: 0.2,
              ease: 'power2.out',
              scrollTrigger: {
                  trigger: section,
                  containerAnimation: scrollTween,
                  start: 'left 70%',
              }
          });
      }
  });

  // --- Vanilla Tilt JS for Speaker Cards ---
  VanillaTilt.init(document.querySelectorAll(".speaker-card"), {
      max: 15,
      speed: 400,
      glare: true,
      "max-glare": 0.2
  });

  // --- Countdown Timer Logic ---
  function startCountdown() {
      const countdownDate = new Date("Sep 1, 2025 09:00:00").getTime();
      const interval = setInterval(() => {
          const now = new Date().getTime();
          const distance = countdownDate - now;

          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          document.getElementById("days").innerText = days.toString().padStart(2, '0');
          document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
          document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
          document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
          
          if (distance < 0) {
              clearInterval(interval);
              document.getElementById("countdown").innerHTML = "<div class='text-2xl font-bold'>The Event is Live!</div>";
          }
      }, 1000);
  }
  startCountdown();
});
