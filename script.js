const year = document.querySelector('[data-year]');
const releaseStatus = document.querySelector('[data-release-status]');
const releaseLinks = document.querySelectorAll('[data-release-link]');

if (year) year.textContent = new Date().getFullYear();

fetch('https://api.github.com/repos/buggyblues/cream-deck/releases/latest', {
  headers: { Accept: 'application/vnd.github+json' }
})
  .then((response) => response.ok ? response.json() : Promise.reject(new Error('No release')))
  .then((release) => {
    if (releaseStatus) releaseStatus.textContent = `${release.name || release.tag_name} · Apple 已公证`;
    releaseLinks.forEach((link) => { link.href = release.html_url; });
  })
  .catch(() => {
    if (releaseStatus) releaseStatus.textContent = '公证版准备中';
    releaseLinks.forEach((link) => {
      link.href = 'https://github.com/buggyblues/cream-deck/releases';
      link.textContent = link.classList.contains('header-download') ? '发布' : '查看发布进度';
      link.setAttribute('aria-label', '查看 Mac 端发布进度');
    });
  });
