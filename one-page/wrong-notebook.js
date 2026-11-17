// Browser-local wrong-question notebook. No visitor records are sent to a server.
'use strict'
window.initializeWrongNotebook = ({ data, openQuestion, refreshQuestionLayout }) => {
  const KEY = 'paladiyu-wrong-notebook-v1'
  const parts = data.parts.map(part => part.name)
  const relatedParts = new Map()
  for (const part of data.parts) for (const theme of part.themes) for (const point of theme.points) {
    for (const id of point.questionIds || []) {
      if (!relatedParts.has(id)) relatedParts.set(id, new Set())
      relatedParts.get(id).add(part.name)
    }
  }
  function subjectsFor(id) {
    const question = data.questions[id]
    if (!question) return []
    const name = question.part
    if (parts.includes(name)) return [name]
    if (parts.includes('其他') && ['毛中特', '新思想', '思修'].includes(name)) return ['其他']
    return [...(relatedParts.get(id) || ['未分类'])]
  }
  let records = Object.create(null)
  let storageOK = true
  function read() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '{}')
      if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return Object.create(null)
      const clean = Object.create(null)
      for (const [id, record] of Object.entries(saved)) {
        if (record && Number.isSafeInteger(record.wrong) && record.wrong > 0
          && Number.isFinite(record.lastWrong)) {
          clean[id] = { wrong: record.wrong, lastWrong: record.lastWrong,
            selected: typeof record.selected === 'string' ? record.selected.slice(0, 26) : '' }
        }
      }
      return clean
    } catch (_) { storageOK = false; return records }
  }
  records = read()
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(records)); storageOK = true }
    catch (_) { storageOK = false }
  }
  const grid = document.querySelector('.content-grid')
  grid.classList.add('single-subject-view')
  const subjects = document.getElementById('subjects')
  const searchBox = document.getElementById('search-box')
  const panel = document.createElement('section')
  panel.className = 'wrong-notebook'
  panel.hidden = true
  panel.setAttribute('aria-labelledby', 'wrong-notebook-title')
  panel.innerHTML = `<div class="wrong-notebook-head"><div><p class="section-kicker">MY WRONG QUESTIONS</p>
    <h2 id="wrong-notebook-title" tabindex="-1">错题本</h2></div>
    <button type="button" class="wrong-back">返回知识卡</button></div>
    <p class="wrong-storage-note"></p>
    <div class="wrong-filters"><label>学科 <select aria-label="错题学科"></select></label>
    <label>搜索 <input type="search" placeholder="搜索题号或题干" aria-label="搜索错题"></label></div>
    <p class="wrong-summary" role="status" aria-live="polite"></p><div class="wrong-list"></div>`
  subjects.before(panel)
  const select = panel.querySelector('select')
  for (const name of [...parts, '未分类']) {
    const option = document.createElement('option')
    option.value = option.textContent = name
    select.append(option)
  }
  const menus = []
  function addMenu(parent, name, mobile = false) {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = mobile ? 'wrong-mobile-menu' : 'wrong-nav-menu'
    button.dataset.wrongPart = name
    button.append(document.createTextNode(mobile ? `${name}错题 ` : '错题 '))
    const count = document.createElement('b')
    button.append(count)
    button.addEventListener('click', () => show(name))
    if (mobile) parent.append(button)
    else parent.prepend(button)
    menus.push({ button, count, name })
  }
  document.querySelectorAll('#side-nav .nav-group').forEach(group => {
    addMenu(group.querySelector('.nav-theme-list'), group.querySelector('.nav-button').dataset.part)
  })
  addMenu(document.getElementById('side-nav'), '未分类')
  for (const name of parts) addMenu(document.getElementById('mobile-nav'), name, true)
  let active = null
  let currentSubject = parts[0]
  function selectSubject(name) {
    currentSubject = name
    grid.dataset.activeSubject = name
    document.querySelectorAll('#subjects > .subject').forEach(section => {
      section.classList.toggle('current-subject', section.dataset.part === name)
    })
    document.querySelectorAll('#side-nav .nav-group').forEach(group => {
      const selected = group.querySelector('.nav-button').dataset.part === name
      const expand = group.querySelector('.nav-expand')
      expand.setAttribute('aria-expanded', String(selected))
      expand.setAttribute('aria-label', `${selected ? '收起' : '展开'}${group.querySelector('.nav-button').dataset.part}目录`)
      group.querySelector('.nav-theme-list').hidden = !selected
    })
    document.querySelectorAll('#side-nav .nav-button, #mobile-nav > button[data-target]').forEach(button => {
      const selected = button.dataset.part === name
      button.classList.toggle('selected-subject', selected)
      if (selected) button.setAttribute('aria-current', 'page')
      else button.removeAttribute('aria-current')
    })
    const search = document.getElementById('search-input')
    if (search.value) { search.value = ''; search.dispatchEvent(new Event('input', { bubbles: true })) }
    refreshQuestionLayout()
  }
  const queryInput = panel.querySelector('input')
  function idsFor(name) {
    return Object.keys(records).filter(id => data.questions[id] && subjectsFor(id).includes(name))
      .sort((a, b) => records[b].lastWrong - records[a].lastWrong || a.localeCompare(b))
  }
  function render() {
    for (const { button, count, name } of menus) {
      const total = idsFor(name).length
      count.textContent = total
      button.classList.toggle('active', active === name)
      button.setAttribute('aria-pressed', String(active === name))
      button.setAttribute('aria-label', `${name}错题，${total} 道`)
      if (name === '未分类') button.hidden = !total && active !== name
    }
    if (!active) return
    panel.querySelector('h2').textContent = `${active} · 错题本`
    panel.querySelector('.wrong-storage-note').textContent = storageOK
      ? '错题仅保存在当前浏览器，刷新后保留；不会上传服务器。答对后仍保留，可手动移出。'
      : '浏览器存储不可用，当前错题暂存在本页，关闭或刷新后可能丢失。'
    const all = idsFor(active)
    const query = queryInput.value.trim().toLowerCase()
    const ids = all.filter(id => {
      const q = data.questions[id]
      return `${q.label} ${q.displayLabel || ''} ${q.stem}`.toLowerCase().includes(query)
    })
    panel.querySelector('.wrong-summary').textContent = query
      ? `共 ${all.length} 道错题，找到 ${ids.length} 道` : `共 ${all.length} 道错题`
    const list = panel.querySelector('.wrong-list')
    list.replaceChildren()
    if (!ids.length) {
      const empty = document.createElement('p')
      empty.className = 'wrong-empty'
      empty.textContent = query ? '没有匹配的错题，请调整关键词。'
        : '当前学科还没有错题。选择答案并点击“显示答案”后，答错的题目会自动收录。'
      list.append(empty)
    }
    for (const id of ids) {
      const question = data.questions[id], record = records[id]
      const card = document.createElement('article')
      card.className = 'wrong-question-card'
      card.dataset.wrongId = id
      const heading = document.createElement('h3')
      heading.textContent = `${question.displayLabel || question.label} · ${question.kind}`
      const meta = document.createElement('p')
      meta.className = 'wrong-question-meta'
      meta.textContent = `累计答错 ${record.wrong} 次 · 最近 ${new Date(record.lastWrong).toLocaleString('zh-CN')} · 上次选择 ${record.selected || '未记录'}`
      const stem = document.createElement('p')
      stem.className = 'wrong-question-stem'
      stem.textContent = question.stem
      const actions = document.createElement('div')
      actions.className = 'wrong-question-actions'
      const practice = document.createElement('button')
      practice.type = 'button'
      practice.textContent = '重新练习'
      practice.addEventListener('click', () => openQuestion(id, null, true))
      const remove = document.createElement('button')
      remove.type = 'button'
      remove.textContent = '移出错题本'
      remove.addEventListener('click', () => {
        records = read()
        delete records[id]
        save(); render()
        const next = list.querySelector('button') || panel.querySelector('h2')
        next.focus({ preventScroll: true })
      })
      actions.append(practice, remove)
      card.append(heading, meta, stem, actions)
      list.append(card)
    }
  }
  function show(name) {
    selectSubject(name)
    active = name
    select.value = name
    queryInput.value = ''
    subjects.hidden = true
    panel.hidden = false
    searchBox.hidden = true
    grid.classList.add('show-wrong-notebook')
    render()
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' })
    panel.querySelector('h2').focus({ preventScroll: true })
  }
  function back() {
    active = null
    subjects.hidden = false
    panel.hidden = true
    searchBox.hidden = false
    grid.classList.remove('show-wrong-notebook')
    refreshQuestionLayout()
    render()
  }
  panel.querySelector('.wrong-back').addEventListener('click', () => {
    selectSubject(parts.includes(currentSubject) ? currentSubject : parts[0])
    back()
    document.getElementById('knowledge').scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
  select.addEventListener('change', () => show(select.value))
  queryInput.addEventListener('input', render)
  for (const root of [document.getElementById('side-nav'), document.getElementById('mobile-nav')]) {
    root.addEventListener('click', event => {
      const button = event.target.closest('.nav-button,.nav-theme,[data-target]')
      if (button && !event.target.closest('[data-wrong-part]') && button.dataset.part) {
        selectSubject(button.dataset.part)
        back()
      }
    }, true)
  }
  document.addEventListener('one-page-answer', event => {
    const { id, right, selected } = event.detail
    if (right || !data.questions[id]) return
    records = read()
    const previous = records[id]
    records[id] = { wrong: (previous?.wrong || 0) + 1, lastWrong: Date.now(), selected }
    save(); render()
  })
  window.addEventListener('storage', event => {
    if (event.key === KEY || event.key === null) { records = read(); render() }
  })
  document.addEventListener('one-page-reveal-subject', event => {
    if (parts.includes(event.detail.part)) { selectSubject(event.detail.part); back() }
  })
  selectSubject(currentSubject)
  render()
}
