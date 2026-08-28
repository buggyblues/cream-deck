const header = document.querySelector('[data-header]');
const year = document.querySelector('[data-year]');
const releaseStatus = document.querySelector('[data-release-status]');
const releaseLinks = document.querySelectorAll('[data-release-link]');
const tabs = document.querySelectorAll('[data-layout]');
const deckStage = document.querySelector('[data-deck-stage]');
const layoutDescription = document.querySelector('[data-layout-description]');

if (year) year.textContent = new Date().getFullYear();

const setHeaderState = () => header?.classList.toggle('is-scrolled', window.scrollY > 16);
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

const observer = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px' })
  : null;

document.querySelectorAll('.reveal').forEach((element) => {
  if (observer) observer.observe(element);
  else element.classList.add('is-visible');
});

const layouts = {
  codex: {
    page: 'CODEX / 01',
    copy: '旋钮调整推理强度，Agent 键显示状态，按住语音，点一下发送。',
    labels: ['快速模式', '批准', '拒绝', '新聊天继续', 'Agent', '按住说话', '发送']
  },
  resolve: {
    page: 'RESOLVE / 01',
    copy: '剪辑、修剪、播放和时间码分桌面排列，搜索旋钮可以连续回绕。',
    labels: ['智能插入', '入点', '出点', '源磁带', 'JOG', '播放 / 暂停', '时间码']
  },
  daily: {
    page: 'MAC / 01',
    copy: '音量、亮度、媒体、应用切换和触控板集中到一页，状态跟着 Mac 更新。',
    labels: ['显示桌面', '音量', '亮度', '应用切换', '触控板', '播放 / 暂停', '下一首']
  }
};

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const name = tab.dataset.layout;
    const layout = layouts[name];
    if (!layout || !deckStage || !layoutDescription) return;

    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });

    deckStage.dataset.layoutState = name;
    const page = deckStage.querySelector('.deck-page');
    if (page) page.textContent = layout.page;
    deckStage.querySelectorAll('.deck-control small').forEach((label, index) => {
      if (layout.labels[index]) label.textContent = layout.labels[index];
    });
    layoutDescription.textContent = layout.copy;
  });
});

fetch('https://api.github.com/repos/buggyblues/cream-deck/releases/latest', {
  headers: { Accept: 'application/vnd.github+json' }
})
  .then((response) => response.ok ? response.json() : Promise.reject(new Error('No release')))
  .then((release) => {
    if (releaseStatus) releaseStatus.textContent = `${release.name || release.tag_name} · Apple 已公证`;
    releaseLinks.forEach((link) => { link.href = release.html_url; });
  })
  .catch(() => {
    if (releaseStatus) releaseStatus.textContent = '首个公证版本准备中';
  });
