import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Import shaders
import vertexShader from './shaders/vertex.glsl?raw';
import fragmentShader from './shaders/fragment.glsl?raw';

class WebGLExperience {
    constructor(canvas) {
        this.canvas = canvas;
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        this.init();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.sizes.width / this.sizes.height,
            0.1,
            100
        );
        this.camera.position.z = 2.5;
        this.scene.add(this.camera);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true
        });
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Clock
        this.clock = new THREE.Clock();

        // Create the blob
        this.createBlob();

        // Event listeners
        window.addEventListener('resize', this.onResize.bind(this));

        // Start the render loop
        this.tick();
    }

    createBlob() {
        // Geometry
        const geometry = new THREE.IcosahedronGeometry(1, 64);

        // Material
        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uFrequency: { value: 1.5 },
                uAmplitude: { value: 0.25 },
                uColorA: { value: new THREE.Color('#6366f1') }, // Indigo
                uColorB: { value: new THREE.Color('#ec4899') }  // Pink
            }
        });

        // Mesh
        this.blob = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.blob);
    }

    onResize() {
        // Update sizes
        this.sizes.width = window.innerWidth;
        this.sizes.height = window.innerHeight;

        // Update camera
        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();

        // Update renderer
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    tick() {
        // Update uniforms
        this.material.uniforms.uTime.value = this.clock.getElapsedTime();

        // Render
        this.renderer.render(this.scene, this.camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(this.tick.bind(this));
    }
}

class UIManager {
    constructor() {
        // Register GSAP plugins
        gsap.registerPlugin(ScrollToPlugin);

        // Initialize all UI components
        this.initCursor();
        this.initMagneticElements();
        this.initPageTransitions();
        this.initHamburgerMenu();
        this.initTicketModal();
        this.startCountdown();
    }

    initCursor() {
        this.cursor = document.querySelector('.cursor');
        if (!this.cursor) return;

        this.cursorCircle = this.cursor.querySelector('.cursor__inner--circle');

        // Set initial position
        gsap.set(this.cursor, {
            xPercent: -50,
            yPercent: -50
        });

        // Cursor following logic
        this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.mouse = { x: this.pos.x, y: this.pos.y };
        this.speed = 0.1;

        this.xSet = gsap.quickSetter(this.cursor, "x", "px");
        this.ySet = gsap.quickSetter(this.cursor, "y", "px");

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        gsap.ticker.add(() => {
          const dt = 1.0 - Math.pow(1.0 - this.speed, gsap.ticker.deltaRatio());
          this.pos.x += (this.mouse.x - this.pos.x) * dt;
          this.pos.y += (this.mouse.y - this.pos.y) * dt;
          this.xSet(this.pos.x); this.ySet(this.pos.y);
      });
  }

  initMagneticElements() {
      document.querySelectorAll('.magnetic').forEach(el => {
          let xTo = gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
          let yTo = gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

          el.addEventListener("mouseenter", () => this.cursor.classList.add('cursor--hover'));
          el.addEventListener("mouseleave", () => {
              this.cursor.classList.remove('cursor--hover');
              xTo(0); yTo(0);
          });
          
          el.addEventListener("mousemove", (e) => {
              const { clientX, clientY } = e;
              const { height, width, left, top } = el.getBoundingClientRect();
              const x = clientX - (left + width / 2);
              const y = clientY - (top + height / 2);
              xTo(x * 0.4); yTo(y * 0.4);
          });
      });
  }
  
  initPageTransitions() {
      const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
      const uiContainer = document.querySelector('.ui-container');
      navLinks.forEach(link => {
          link.addEventListener('click', (e) => {
              e.preventDefault();
              const targetId = link.getAttribute('href');
              
              const mobileNav = document.querySelector('.mobile-nav');
              const hamburger = document.querySelector('.hamburger');

              // Close mobile nav if open
              if (mobileNav.classList.contains('active')) {
                  mobileNav.classList.remove('active');
                  hamburger.classList.remove('active');
              }

              // Special handling for ticket links to open modal
              if (targetId === '#tickets') {
                   document.querySelector('#ticket-modal').classList.add('active');
                   return;
              }

              gsap.to(uiContainer, {
                  duration: 1.5,
                  scrollTo: { y: targetId, offsetY: 70 },
                  ease: "power4.inOut"
              });
          });
      });
  }
  
  initHamburgerMenu() {
      const hamburger = document.querySelector('.hamburger');
      const mobileNav = document.querySelector('.mobile-nav');
      const lines = hamburger.querySelectorAll('.line');

      hamburger.addEventListener('click', () => {
          hamburger.classList.toggle('active');
          mobileNav.classList.toggle('active');

          if(hamburger.classList.contains('active')) {
              gsap.to(lines[0], {rotation: 45, y: 10, duration: 0.3});
              gsap.to(lines[1], {opacity: 0, x: 20, duration: 0.3});
              gsap.to(lines[2], {rotation: -45, y: -10, duration: 0.3});
          } else {
              gsap.to(lines[0], {rotation: 0, y: 0, duration: 0.3});
              gsap.to(lines[1], {opacity: 1, x: 0, duration: 0.3});
              gsap.to(lines[2], {rotation: 0, y: 0, duration: 0.3});
          }
      });
  }

  initTicketModal() {
      const openBtns = document.querySelectorAll('.ticket-btn');
      const ticketModal = document.querySelector('#ticket-modal');
      const successModal = document.querySelector('#success-modal');
      const closeBtn = ticketModal.querySelector('.close-btn');
      const form = document.querySelector('#ticket-form');

      openBtns.forEach(btn => {
          btn.addEventListener('click', (e) => {
              e.preventDefault();
              ticketModal.classList.add('active');
          });
      });

      const closeModal = () => {
          ticketModal.classList.remove('active');
      };

      closeBtn.addEventListener('click', closeModal);
      ticketModal.addEventListener('click', (e) => {
          if (e.target === ticketModal) {
              closeModal();
          }
      });

      form.addEventListener('submit', (e) => {
          e.preventDefault();
          ticketModal.classList.remove('active');
          successModal.classList.add('active');

          setTimeout(() => {
              successModal.classList.remove('active');
          }, 4000);
      });
  }

  startCountdown() {
      const eventDate = new Date("Oct 25, 2025 09:00:00").getTime();
      const countdownInterval = setInterval(() => {
          const now = new Date().getTime();
          const distance = eventDate - now;

          if (distance < 0) {
              clearInterval(countdownInterval);
              document.getElementById("countdown").innerHTML = "<p>The event has started!</p>";
              return;
          }

          document.getElementById("days").innerText = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
          document.getElementById("hours").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
          document.getElementById("minutes").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
          document.getElementById("seconds").innerText = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
      }, 1000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new WebGLExperience(document.querySelector('#webgl-canvas'));
  new UIManager();
});