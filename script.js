const year = document.querySelector('[data-year]');
const releaseLinks = document.querySelectorAll('[data-release-link]');

if (year) year.textContent = new Date().getFullYear();

fetch('https://api.github.com/repos/buggyblues/cream-deck/releases/latest', {
  headers: { Accept: 'application/vnd.github+json' }
})
  .then((response) => response.ok ? response.json() : Promise.reject(new Error('No release')))
  .then((release) => {
    releaseLinks.forEach((link) => { link.href = release.html_url; });
  })
  .catch(() => {
    releaseLinks.forEach((link) => {
      link.href = 'https://github.com/buggyblues/cream-deck/releases';
    });
  });

const initMotion = () => {
  if (!window.gsap || !window.ScrollTrigger) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  const media = gsap.matchMedia();

  media.add({
    motion: '(prefers-reduced-motion: no-preference)',
    desktop: '(min-width: 701px)',
    finePointer: '(pointer: fine)'
  }, (context) => {
    const { motion, desktop, finePointer } = context.conditions;
    if (!motion) return undefined;

    const cleanups = [];
    const reveal = {
      duration: .78,
      ease: 'power3.out',
      autoAlpha: 0,
      y: 42
    };

    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.site-header', { autoAlpha: 0, y: -18, duration: .55 })
      .from('.hero-line', { autoAlpha: 0, y: 52, rotation: 1.5, duration: .82, stagger: .12 }, '-=.18')
      .from('.hero-lede, .hero-actions, .availability', { autoAlpha: 0, y: 18, duration: .5, stagger: .08 }, '-=.38')
      .from('.hero-screen', { autoAlpha: 0, y: 92, rotation: desktop ? -3 : -1, scale: .96, duration: 1 }, '-=.26');

    const heroFloat = gsap.to('.hero-product', {
      y: -8,
      duration: 3.2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      paused: true
    });

    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => self.isActive ? heroFloat.play() : heroFloat.pause()
    });

    if (finePointer) {
      const heroProduct = document.querySelector('.hero-product');
      const heroScreen = document.querySelector('.hero-screen');
      if (heroProduct && heroScreen) {
        gsap.set(heroScreen, { transformPerspective: 900, transformOrigin: '50% 38%' });
        const rotateX = gsap.quickTo(heroScreen, 'rotationX', { duration: .45, ease: 'power3.out' });
        const rotateY = gsap.quickTo(heroScreen, 'rotationY', { duration: .45, ease: 'power3.out' });

        const onPointerMove = (event) => {
          const bounds = heroProduct.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width - .5;
          const y = (event.clientY - bounds.top) / bounds.height - .5;
          rotateX(y * -5);
          rotateY(x * 7);
        };
        const onPointerLeave = () => {
          rotateX(0);
          rotateY(0);
        };

        heroProduct.addEventListener('pointermove', onPointerMove);
        heroProduct.addEventListener('pointerleave', onPointerLeave);
        cleanups.push(() => {
          heroProduct.removeEventListener('pointermove', onPointerMove);
          heroProduct.removeEventListener('pointerleave', onPointerLeave);
        });
      }
    }

    gsap.from('.screens-section > h2', {
      ...reveal,
      scrollTrigger: { trigger: '.screens-section', start: 'top 78%', once: true }
    });
    gsap.from('.screen-gallery figure', {
      ...reveal,
      y: 72,
      rotation: (index) => [-2.5, 1.5, -1][index] || 0,
      stagger: .13,
      scrollTrigger: { trigger: '.screen-gallery', start: 'top 82%', once: true }
    });

    gsap.timeline({
      scrollTrigger: { trigger: '.product-section', start: 'top 76%', once: true }
    })
      .from('.product-shot', { ...reveal, x: desktop ? -54 : 0, rotation: -2 })
      .from('.product-copy .eyebrow, .product-copy h2, .product-copy > p', { ...reveal, y: 28, stagger: .08 }, '-=.42')
      .from('.feature-list article', { ...reveal, y: 24, stagger: .09 }, '-=.38');

    gsap.timeline({
      scrollTrigger: { trigger: '.how-section', start: 'top 74%', once: true }
    })
      .from('.pairing-art', { ...reveal, x: desktop ? -64 : 0, rotation: -4, scale: .94 })
      .from('.how-section > .eyebrow, .how-section > h2', { ...reveal, y: 26, stagger: .08 }, '-=.42')
      .from('.steps li', { ...reveal, y: 22, stagger: .1 }, '-=.35');

    gsap.timeline({
      scrollTrigger: { trigger: '.quick-section', start: 'top 76%', once: true }
    })
      .from('.quick-section > .eyebrow, .quick-section > h2, .section-intro', { ...reveal, y: 28, stagger: .08 })
      .from('.quick-screens figure', { ...reveal, y: 64, rotation: (index) => index ? 2 : -2, stagger: .14 }, '-=.35');

    gsap.from('.scenarios-section > h2, .scenario-list li', {
      ...reveal,
      y: 30,
      stagger: .09,
      scrollTrigger: { trigger: '.scenarios-section', start: 'top 76%', once: true }
    });
    gsap.fromTo('.scenario-mascot', {
      autoAlpha: 0,
      xPercent: desktop ? 20 : 0,
      y: 72,
      rotation: 11,
      scale: .84
    }, {
      autoAlpha: 1,
      xPercent: 0,
      y: -18,
      rotation: -2,
      scale: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.scenarios-section',
        start: 'top 82%',
        end: 'bottom 28%',
        scrub: .8
      }
    });

    const scenarioFrames = gsap.utils.toArray('.scenario-frame');
    if (scenarioFrames.length > 1) {
      const showScenarioFrame = (timeline, index, position) => {
        timeline
          .set(scenarioFrames, { autoAlpha: 0 }, position)
          .set(scenarioFrames[index], { autoAlpha: 1 }, position);
      };
      const frameLoop = gsap.timeline({ paused: true, repeat: -1, repeatDelay: .9 });
      const keyframeSequence = [
        { label: 'idle', frame: 0, at: 0 },
        { label: 'crouch', frame: 1, at: .32 },
        { label: 'launch', frame: 2, at: .5 },
        { label: 'contact', frame: 3, at: .68 },
        { label: 'impact', frame: 4, at: .84 },
        { label: 'recoil', frame: 5, at: 1.02 },
        { label: 'followThrough', frame: 6, at: 1.2 },
        { label: 'landing', frame: 7, at: 1.42 }
      ];

      keyframeSequence.forEach(({ label, frame, at }) => {
        frameLoop.addLabel(label, at);
        showScenarioFrame(frameLoop, frame, label);
      });

      ScrollTrigger.create({
        trigger: '.scenarios-section',
        start: 'top 85%',
        end: 'bottom 15%',
        onToggle: (self) => self.isActive ? frameLoop.play() : frameLoop.pause()
      });
    }

    gsap.timeline({
      scrollTrigger: { trigger: '.privacy-section', start: 'top 78%', once: true }
    })
      .from('.privacy-section img', { ...reveal, scale: .86, rotation: -7 })
      .from('.privacy-section .eyebrow, .privacy-section h2, .privacy-copy, .privacy-section > a', { ...reveal, y: 24, stagger: .08 }, '-=.4');

    gsap.from('.faq-section > h2, .faq-list details', {
      ...reveal,
      y: 26,
      stagger: .07,
      scrollTrigger: { trigger: '.faq-section', start: 'top 76%', once: true }
    });

    gsap.timeline({
      scrollTrigger: { trigger: '.download-section', start: 'top 82%', once: true }
    })
      .from('.download-section img', { autoAlpha: 0, scale: .72, rotation: -9, duration: .72, ease: 'back.out(1.7)' })
      .from('.download-section h2, .download-copy', { ...reveal, y: 24, stagger: .08 }, '-=.35')
      .from('.download-section .button', { autoAlpha: 0, y: 18, scale: .94, duration: .55, ease: 'back.out(1.5)' }, '-=.28');

    const hoverTargets = gsap.utils.toArray('.button, .header-download');
    hoverTargets.forEach((target) => {
      const onEnter = () => gsap.to(target, { y: -3, scale: 1.035, duration: .22, ease: 'power2.out', overwrite: 'auto' });
      const onLeave = () => gsap.to(target, { y: 0, scale: 1, duration: .28, ease: 'power2.out', overwrite: 'auto' });
      target.addEventListener('pointerenter', onEnter);
      target.addEventListener('pointerleave', onLeave);
      cleanups.push(() => {
        target.removeEventListener('pointerenter', onEnter);
        target.removeEventListener('pointerleave', onLeave);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  });

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
};

initMotion();
