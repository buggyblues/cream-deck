const year = document.querySelector('[data-year]');
const releaseLinks = document.querySelectorAll('[data-release-link]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (year) year.textContent = new Date().getFullYear();

fetch('https://api.github.com/repos/buggyblues/cream-deck/releases/latest', {
  headers: { Accept: 'application/vnd.github+json' }
})
  .then((response) => response.ok ? response.json() : Promise.reject(new Error('No release')))
  .then((release) => {
    const dmg = release.assets?.find((asset) => asset.name.toLowerCase().endsWith('.dmg'));
    const href = dmg?.browser_download_url || release.html_url;
    releaseLinks.forEach((link) => { link.href = href; });
  })
  .catch(() => {
    releaseLinks.forEach((link) => {
      link.href = 'https://github.com/buggyblues/cream-deck/releases';
    });
  });

const initLayoutTabs = () => {
  const tabs = Array.from(document.querySelectorAll('[role="tab"][data-image]'));
  const panel = document.querySelector('#layout-panel');
  const preview = document.querySelector('[data-layout-image]');
  const name = document.querySelector('[data-layout-name]');
  const description = document.querySelector('[data-layout-description]');
  const caption = preview?.nextElementSibling;
  if (!tabs.length || !panel || !preview || !name || !description) return;

  const preload = () => {
    [...new Set(tabs.map((tab) => tab.dataset.image))].forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  };
  if ('requestIdleCallback' in window) window.requestIdleCallback(preload);
  else window.setTimeout(preload, 500);

  const commit = (tab) => {
    preview.src = tab.dataset.image;
    preview.alt = tab.dataset.alt;
    name.textContent = tab.dataset.name;
    description.textContent = tab.dataset.description;
    panel.setAttribute('aria-labelledby', tab.id);
  };

  const select = (tab, moveFocus = false) => {
    if (!tab) return;
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    if (moveFocus) tab.focus();

    if (!window.gsap || prefersReducedMotion) {
      commit(tab);
      return;
    }

    window.gsap.killTweensOf([preview, caption]);
    window.gsap.to([preview, caption], {
      autoAlpha: 0,
      y: 12,
      duration: .16,
      ease: 'power2.in',
      onComplete: () => {
        commit(tab);
        window.gsap.fromTo([preview, caption], {
          autoAlpha: 0,
          y: 16
        }, {
          autoAlpha: 1,
          y: 0,
          duration: .38,
          stagger: .04,
          ease: 'power3.out',
          clearProps: 'transform'
        });
      }
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (event) => {
      let nextIndex = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = tabs.length - 1;
      else return;
      event.preventDefault();
      select(tabs[nextIndex], true);
    });
  });
};

const initTypewriter = (gsap) => {
  const target = document.querySelector('[data-typewriter]');
  const caret = document.querySelector('.type-caret');
  if (!target) return;

  const characters = Array.from(target.dataset.text || target.textContent || '');
  if (prefersReducedMotion) {
    if (caret) caret.classList.add('is-done');
    return;
  }

  target.textContent = '';
  const progress = { value: 0 };
  const blink = caret ? gsap.to(caret, {
    autoAlpha: .12,
    duration: .38,
    ease: 'steps(1)',
    repeat: -1,
    yoyo: true
  }) : null;

  gsap.to(progress, {
    value: characters.length,
    delay: .34,
    duration: 1.08,
    ease: 'none',
    snap: { value: 1 },
    onUpdate: () => {
      target.textContent = characters.slice(0, progress.value).join('');
    },
    onComplete: () => {
      target.textContent = characters.join('');
      gsap.delayedCall(.7, () => {
        blink?.kill();
        if (caret) gsap.to(caret, { autoAlpha: 0, duration: .25 });
      });
    }
  });
};

const initLookingPanda = (gsap) => {
  const panda = document.querySelector('.look-panda');
  const motionLayer = document.querySelector('.look-panda-motion');
  const pupils = Array.from(document.querySelectorAll('.look-pupil'));
  if (!panda || !motionLayer || pupils.length !== 2) return;
  panda.classList.add('is-ready');
  if (prefersReducedMotion || !window.matchMedia('(pointer: fine)').matches) return;

  gsap.set(pupils, { transformOrigin: '50% 50%' });
  gsap.to(motionLayer, {
    keyframes: [
      { yPercent: 0, rotation: 0, duration: .55 },
      { yPercent: -1.7, rotation: -.65, duration: .75 },
      { yPercent: -3.1, rotation: .2, duration: .85 },
      { yPercent: -2, rotation: .75, duration: .72 },
      { yPercent: -.6, rotation: .25, duration: .78 },
      { yPercent: 0, rotation: 0, duration: .65 }
    ],
    ease: 'sine.inOut',
    repeat: -1
  });

  gsap.timeline({ repeat: -1, repeatDelay: 2.4 })
    .to(pupils, { scaleY: .72, duration: .05, ease: 'power1.in' })
    .to(pupils, { scaleY: .12, duration: .055, ease: 'power1.in' })
    .to(pupils, { scaleY: .65, duration: .06, ease: 'power1.out' })
    .to(pupils, { scaleY: 1, duration: .08, ease: 'power1.out' })
    .to(pupils, { scaleY: .82, duration: .05, delay: .12 })
    .to(pupils, { scaleY: 1, duration: .08 });

  const pupilMoves = pupils.map((pupil) => ({
    x: gsap.quickTo(pupil, 'x', { duration: .2, ease: 'power3.out' }),
    y: gsap.quickTo(pupil, 'y', { duration: .2, ease: 'power3.out' })
  }));
  const pandaX = gsap.quickTo(panda, 'x', { duration: .45, ease: 'power3.out' });
  const pandaY = gsap.quickTo(panda, 'y', { duration: .45, ease: 'power3.out' });
  const pandaRotation = gsap.quickTo(panda, 'rotation', { duration: .5, ease: 'power3.out' });
  const clampX = gsap.utils.clamp(-7, 7);
  const clampY = gsap.utils.clamp(-6, 6);
  let eyeCenters = [];

  const measureEyes = () => {
    eyeCenters = pupils.map((pupil) => {
      const rect = pupil.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    });
  };
  measureEyes();

  let queued = false;
  let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const renderPointer = () => {
    queued = false;
    pupilMoves.forEach((move, index) => {
      const center = eyeCenters[index];
      const dx = pointer.x - center.x;
      const dy = pointer.y - center.y;
      const angle = Math.atan2(dy, dx);
      const distance = Math.min(7, Math.hypot(dx, dy) / 42);
      move.x(Math.cos(angle) * distance);
      move.y(Math.sin(angle) * distance);
    });
    const normalizedX = pointer.x / window.innerWidth - .5;
    const normalizedY = pointer.y / window.innerHeight - .5;
    pandaX(clampX(normalizedX * 14));
    pandaY(clampY(normalizedY * 12));
    pandaRotation(normalizedX * 2.2);
  };
  const onPointerMove = (event) => {
    pointer = { x: event.clientX, y: event.clientY };
    if (!queued) {
      queued = true;
      window.requestAnimationFrame(renderPointer);
    }
  };
  const reset = () => {
    pupilMoves.forEach((move) => { move.x(0); move.y(0); });
    pandaX(0);
    pandaY(0);
    pandaRotation(0);
  };
  const onPointerOut = (event) => {
    if (!event.relatedTarget) reset();
  };
  const onResize = () => {
    measureEyes();
    reset();
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerout', onPointerOut);
  window.addEventListener('resize', onResize, { passive: true });
};

const initMotion = () => {
  const panda = document.querySelector('.look-panda');
  if (!window.gsap) {
    panda?.classList.add('is-ready');
    return;
  }

  const { gsap } = window;
  initTypewriter(gsap);
  initLookingPanda(gsap);

  if (!prefersReducedMotion) {
    gsap.to('.hero-paw', {
      keyframes: [
        { rotation: 0, yPercent: 0, duration: .7 },
        { rotation: -9, yPercent: -7, duration: .16 },
        { rotation: 8, yPercent: -11, duration: .18 },
        { rotation: -5, yPercent: -5, duration: .16 },
        { rotation: 3, yPercent: -2, duration: .14 },
        { rotation: 0, yPercent: 0, duration: .18 }
      ],
      transformOrigin: '50% 70%',
      repeat: -1,
      repeatDelay: 2.2
    });
  }

  if (!window.ScrollTrigger) return;
  const { ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();

  media.add({
    motion: '(prefers-reduced-motion: no-preference)',
    desktop: '(min-width: 901px)',
    finePointer: '(pointer: fine)'
  }, (context) => {
    const { motion, desktop, finePointer } = context.conditions;
    if (!motion) return undefined;

    const cleanups = [];
    const reveal = { duration: .72, ease: 'power3.out', autoAlpha: 0, y: 36 };

    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.site-header', { autoAlpha: 0, y: -18, duration: .5 })
      .from('.hero-line-accent', { autoAlpha: 0, y: 38, rotation: 1.2, duration: .65 }, '-=.12')
      .from('.hero-actions, .availability', { autoAlpha: 0, y: 16, duration: .42, stagger: .07 }, '-=.28')
      .from('.hero-screen', { autoAlpha: 0, y: 72, rotation: desktop ? -3 : -1, scale: .97, duration: .88 }, '-=.32');

    const heroFloat = gsap.to('.hero-product', {
      y: -7,
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
          rotateX(((event.clientY - bounds.top) / bounds.height - .5) * -5);
          rotateY(((event.clientX - bounds.left) / bounds.width - .5) * 7);
        };
        const onPointerLeave = () => { rotateX(0); rotateY(0); };
        heroProduct.addEventListener('pointermove', onPointerMove);
        heroProduct.addEventListener('pointerleave', onPointerLeave);
        cleanups.push(() => {
          heroProduct.removeEventListener('pointermove', onPointerMove);
          heroProduct.removeEventListener('pointerleave', onPointerLeave);
        });
      }
    }

    gsap.timeline({ scrollTrigger: { trigger: '.layouts-section', start: 'top 76%', once: true } })
      .from('.layout-copy h2, .layout-copy > p', { ...reveal, y: 25, stagger: .07 })
      .from('.layout-tab', { ...reveal, y: 20, stagger: .045 }, '-=.3')
      .from('.layout-preview', { ...reveal, x: desktop ? 48 : 0, rotation: 2 }, '-=.5');

    gsap.timeline({ scrollTrigger: { trigger: '.product-section', start: 'top 76%', once: true } })
      .from('.product-shot', { ...reveal, x: desktop ? -48 : 0, rotation: -2 })
      .from('.product-copy .eyebrow, .product-copy h2, .product-copy > p', { ...reveal, y: 24, stagger: .07 }, '-=.38')
      .from('.feature-list article', { ...reveal, y: 20, stagger: .075 }, '-=.32');

    gsap.timeline({ scrollTrigger: { trigger: '.how-section', start: 'top 74%', once: true } })
      .from('.pairing-art', { ...reveal, x: desktop ? -54 : 0, rotation: -4, scale: .95 })
      .from('.how-section > .eyebrow, .how-section > h2', { ...reveal, y: 24, stagger: .07 }, '-=.4')
      .from('.steps li', { ...reveal, y: 19, stagger: .08 }, '-=.32');

    gsap.timeline({ scrollTrigger: { trigger: '.quick-section', start: 'top 76%', once: true } })
      .from('.quick-copy > *', { ...reveal, y: 24, stagger: .07 })
      .from('.quick-screens figure', { ...reveal, y: 52, rotation: (index) => index ? 2 : -2, stagger: .12 }, '-=.34');

    gsap.from('.scenarios-section > h2, .scenario-list li', {
      ...reveal,
      y: 26,
      stagger: .075,
      scrollTrigger: { trigger: '.scenarios-section', start: 'top 76%', once: true }
    });
    gsap.fromTo('.scenario-mascot', {
      autoAlpha: 0,
      xPercent: desktop ? 18 : 0,
      y: 62,
      rotation: 10,
      scale: .86
    }, {
      autoAlpha: 1,
      xPercent: 0,
      y: 0,
      rotation: -2,
      scale: 1,
      duration: .82,
      ease: 'back.out(1.45)',
      scrollTrigger: { trigger: '.scenarios-section', start: 'top 82%', once: true }
    });

    const scenarioFrames = gsap.utils.toArray('.scenario-frame');
    if (scenarioFrames.length > 1) {
      const frameLoop = gsap.timeline({ paused: true, repeat: -1, repeatDelay: .9 });
      const keyframes = [
        ['ready', 0, 0], ['crouch', 1, .28], ['launch', 2, .46], ['reach', 3, .63],
        ['press', 4, .79], ['rebound', 5, .96], ['followThrough', 6, 1.16], ['landing', 7, 1.38]
      ];
      keyframes.forEach(([label, frame, at]) => {
        frameLoop.addLabel(label, at).set(scenarioFrames, { autoAlpha: 0 }, label).set(scenarioFrames[frame], { autoAlpha: 1 }, label);
      });
      ScrollTrigger.create({
        trigger: '.scenarios-section',
        start: 'top 85%',
        end: 'bottom 15%',
        onToggle: (self) => self.isActive ? frameLoop.play() : frameLoop.pause()
      });
    }

    const softwareWall = document.querySelector('.software-wall');
    const softwareTrack = document.querySelector('.software-track');
    if (softwareWall && softwareTrack) {
      softwareWall.classList.add('is-animated');
      const softwareLoop = gsap.to(softwareTrack, { xPercent: -50, duration: desktop ? 34 : 25, ease: 'none', repeat: -1, paused: true });
      let visible = false;
      const sync = () => visible && !document.hidden ? softwareLoop.play() : softwareLoop.pause();
      const onVisibilityChange = () => sync();
      document.addEventListener('visibilitychange', onVisibilityChange);
      cleanups.push(() => {
        document.removeEventListener('visibilitychange', onVisibilityChange);
        softwareWall.classList.remove('is-animated');
      });
      ScrollTrigger.create({
        trigger: '.software-section',
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => { visible = self.isActive; sync(); }
      });
    }

    gsap.from('.software-section > h2', { ...reveal, y: 24, scrollTrigger: { trigger: '.software-section', start: 'top 78%', once: true } });
    gsap.timeline({ scrollTrigger: { trigger: '.mac-section', start: 'top 76%', once: true } })
      .from('.mac-copy > *', { ...reveal, y: 24, stagger: .07 })
      .from('.mac-section > img', { ...reveal, x: desktop ? 46 : 0, scale: .96 }, '-=.42');
    gsap.from('.faq-section > h2, .faq-list details', { ...reveal, y: 22, stagger: .055, scrollTrigger: { trigger: '.faq-section', start: 'top 76%', once: true } });
    gsap.timeline({ scrollTrigger: { trigger: '.download-section', start: 'top 82%', once: true } })
      .from('.download-section img', { autoAlpha: 0, scale: .74, rotation: -8, duration: .65, ease: 'back.out(1.7)' })
      .from('.download-section h2, .download-copy', { ...reveal, y: 21, stagger: .07 }, '-=.32')
      .from('.download-section .button', { autoAlpha: 0, y: 16, scale: .95, duration: .5, ease: 'back.out(1.5)' }, '-=.25');

    gsap.utils.toArray('.button, .header-download').forEach((target) => {
      const onEnter = () => gsap.to(target, { y: -3, scale: 1.035, duration: .2, ease: 'power2.out', overwrite: 'auto' });
      const onLeave = () => gsap.to(target, { y: 0, scale: 1, duration: .26, ease: 'power2.out', overwrite: 'auto' });
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

initLayoutTabs();
initMotion();
