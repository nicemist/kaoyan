(() => {
  let mode = 'light'
  try {
    mode = localStorage.getItem('paladiyu-color-mode')
      || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  } catch (_) {}
  document.documentElement.dataset.theme = mode
  try {
    document.documentElement.dataset.cardText
      = localStorage.getItem('paladiyu-card-text-mode') === 'uniform' ? 'uniform' : 'original'
  } catch (_) {
    document.documentElement.dataset.cardText = 'original'
  }
  if (location.hash === '#knowledge') {
    document.documentElement.setAttribute('data-knowledge-entry', '')
    window.addEventListener('hashchange', () => {
      document.documentElement.removeAttribute('data-knowledge-entry')
    }, { once: true })
  }
})()
