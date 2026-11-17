(() => {
  document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  })
  const trigger = document.getElementById('view-page-info')
  const dialog = document.getElementById('page-info-dialog')
  const close = document.getElementById('page-info-close')
  trigger.addEventListener('click', () => {
    if (dialog.open) return
    dialog.showModal()
    dialog.scrollTop = 0
    trigger.setAttribute('aria-expanded', 'true')
  })
  close.addEventListener('click', () => dialog.close())
  dialog.addEventListener('close', () => {
    trigger.setAttribute('aria-expanded', 'false')
    trigger.focus({ preventScroll: true })
  })
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return
    const box = dialog.getBoundingClientRect()
    if (event.clientX < box.left || event.clientX > box.right
      || event.clientY < box.top || event.clientY > box.bottom) dialog.close()
  })
})()
