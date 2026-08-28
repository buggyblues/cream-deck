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
