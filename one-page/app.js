(() => {
  const button = document.getElementById('help-toggle')
  const menu = document.getElementById('help-menu')
  button.addEventListener('click', () => {
    menu.hidden = !menu.hidden
    button.setAttribute('aria-expanded', String(!menu.hidden))
  })
  document.addEventListener('click', event => {
    if (event.target.closest('.help-fab-wrap')) return
    menu.hidden = true
    button.setAttribute('aria-expanded', 'false')
  })
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      menu.hidden = true
      button.setAttribute('aria-expanded', 'false')
    }
  })
})();

(() => {
  const backdrop = document.getElementById('info-backdrop')
  const title = document.getElementById('info-title')
  const copy = document.getElementById('info-copy')
  const messages = {
    method: ['本栏目正在更新中，请关注微信公众号获取', ''],
    timeline: ['请关注微信公众号获取', '获取史纲互动时间轴、一页纸解题方法工作台、模拟卷知识点合集互动工作台等后续更新内容，请关注微信公众号 @普通小豆芽'],
    pdf: ['请关注微信公众号获取', '获取一页纸PDF，请关注微信公众号 @普通小豆芽'],
    update: ['当前工作台版本为：v1.0.2', '获取一页纸工作台更新日志和最新版本，请关注微信公众号 @普通小豆芽'],
    account: ['请关注微信公众号获取', ''],
  }
  let returnFocus
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-qr-dialog]')
    if (!trigger) return
    event.preventDefault()
    returnFocus = document.activeElement;
    [title.textContent, copy.textContent] = messages[trigger.dataset.qrDialog] || messages.account
    copy.hidden = !copy.textContent
    backdrop.hidden = false
    document.getElementById('info-close').focus()
  })
  const close = () => {
    backdrop.hidden = true; returnFocus?.focus()
  }
  document.getElementById('info-close').addEventListener('click', close)
  backdrop.addEventListener('click', event => {
    if (event.target === backdrop) close()
  })
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !backdrop.hidden) close()
  })
})();

(async () => {
  'use strict'
  const touchDevice = navigator.maxTouchPoints > 1
  document.documentElement.classList.toggle('touch-device', touchDevice)
  const loading = document.getElementById('workbench-loading')
  const retry = document.getElementById('workbench-retry')
  retry.addEventListener('click', () => location.reload())
  const COLOR_MODE_KEY = 'paladiyu-color-mode'
  const themeToggle = document.getElementById('theme-toggle')
  const themeColorMeta = document.getElementById('theme-color-meta')
  const applyColorMode = mode => {
    const dark = mode === 'dark'
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    themeToggle.setAttribute('aria-pressed', String(dark))
    themeToggle.setAttribute('aria-label', dark ? '切换到日间模式' : '切换到夜间模式')
    themeToggle.title = dark ? '切换到日间模式' : '切换到夜间模式'
    themeColorMeta.content = dark ? '#0D0D0D' : '#FFFFFF'
  }
  applyColorMode(document.documentElement.dataset.theme || 'light')
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
    applyColorMode(next)
    try {
      localStorage.setItem(COLOR_MODE_KEY, next)
    } catch (_) {}
  })
  const CARD_TEXT_MODE_KEY = 'paladiyu-card-text-mode'
  const cardTextToggle = document.getElementById('card-text-toggle')
  const applyCardTextMode = mode => {
    const uniform = mode === 'uniform'
    document.documentElement.dataset.cardText = uniform ? 'uniform' : 'original'
    cardTextToggle.setAttribute('aria-pressed', String(uniform))
    cardTextToggle.setAttribute('aria-label', uniform
      ? '恢复知识点卡片原文字色'
      : '将知识点卡片文字切换为黑白色')
    cardTextToggle.title = cardTextToggle.getAttribute('aria-label')
  }
  applyCardTextMode(document.documentElement.dataset.cardText)
  cardTextToggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.cardText === 'uniform'
      ? 'original'
      : 'uniform'
    applyCardTextMode(next)
    try {
      localStorage.setItem(CARD_TEXT_MODE_KEY, next)
    } catch (_) {}
  })
  const allCardToggle = document.getElementById('all-card-toggle')
  function updateAllCardToggle() {
    const rows = [...document.querySelectorAll('#subjects .point')]
    const hidden = rows.length > 0 && rows.every(row => row.classList.contains('knowledge-obscured'))
    allCardToggle.setAttribute('aria-pressed', String(hidden))
    allCardToggle.title = allCardToggle.ariaLabel = hidden ? '显示所有知识点卡片' : '隐藏所有知识点卡片'
  }
  allCardToggle.addEventListener('click', () => {
    const hide = allCardToggle.getAttribute('aria-pressed') !== 'true'
    document.querySelectorAll('#subjects .point').forEach(row => {
      row.classList.toggle('knowledge-obscured', hide)
      const button = row.querySelector('[data-hide-id]')
      if (button) {
        button.setAttribute('aria-pressed', String(hide))
        button.title = button.ariaLabel = hide ? '显示知识点' : '隐藏知识点'
        const point = knowledgeById.get(button.dataset.hideId)
        if (point) point.knowledgeObscured = hide
      }
    })
    updateAllCardToggle()
  })

  const viewMode = new URLSearchParams(location.search).get('view') === 'simulation'
    ? 'simulation'
    : 'workbench'
  const isSimulation = viewMode === 'simulation'
  const simulationLink = document.getElementById('view-simulation')
  const activeViewLink = document.getElementById(isSimulation ? 'view-simulation' : 'view-workbench')
  activeViewLink.classList.add('active')
  activeViewLink.setAttribute('aria-current', 'page')
  if (isSimulation) {
    simulationLink.addEventListener('click', event => event.preventDefault())
    const workbenchLink = document.getElementById('view-workbench')
    workbenchLink.target = '_blank'
    workbenchLink.rel = 'noopener noreferrer'
    document.getElementById('hero-deck').innerHTML = '马原导论知识卡已上线<br>其他模拟卷考点正在制作中'
    document.getElementById('hero-description').textContent
      = '马原导论部分已收录知识卡，其他考点正在制作中。获取更新进度，请关注公众号 @普通小豆芽。'
    document.getElementById('footer-description').textContent
      = '模拟卷考点：马原导论已收录，其他内容制作中'
  } else {
    simulationLink.target = '_blank'
    simulationLink.rel = 'noopener noreferrer'
  }
  // Offline snapshot: classic-script data also works when opened via file://.
  const data = window.__ONE_PAGE_OFFLINE_DATA__[viewMode]
  delete window.__ONE_PAGE_OFFLINE_DATA__
  if (!isSimulation) data.parts.push({ name: '时政',
    description: '该部分卡片正在制作中',
    pointCount: 0,
    themeCount: 1,
    questionCount: 0,
    themes: [{ name: '时政', points: [] }] })
  const LOCAL_KEY = `paladiyu-public-readonly-${viewMode}-v1`
  let localEdits = { points: {}, questions: {} }
  try {
    localEdits = JSON.parse(localStorage.getItem(LOCAL_KEY) || 'null') || localEdits
    for (const part of data.parts) for (const theme of part.themes) for (const point of theme.points) {
      const saved = localEdits.points?.[point.id]
      if (saved && Number(saved.editedAt) > Number(point.editedAt || 0)) {
        const reviewedQuestionIds = point.reviewedQuestionIds || []
        Object.assign(point, saved)
        point.questionIds = [...new Set([...(point.questionIds || []), ...reviewedQuestionIds])]
        point.sources = [...new Set(point.questionIds.map(id => data.questions[id]?.sourceType).filter(Boolean))]
      }
    }
    for (const [id, saved] of Object.entries(localEdits.questions || {})) {
      if (data.questions[id] && Number(saved.editedAt) > Number(data.questions[id].editedAt || 0)) {
        Object.assign(data.questions[id], saved)
      }
    }
  } catch (_) {
    localEdits = { points: {}, questions: {} }
  }
  // Keep the overview image's current theme even when an older card edit is restored locally.
  const overview = data.parts.flatMap(part => part.themes.flatMap(theme => theme.points))
    .find(point => point.id === 'MN037')
  if (overview?.sourceHtml?.includes('alt="史纲整体脉络原图"')) {
    overview.sourceHtml = overview.sourceHtml.replace(
      /(alt="史纲整体脉络原图" src=")[^"]+(")/,
      '$1./one-page/shi-gang-overview.png$2')
  }
  const allPoints = data.parts.flatMap(part => part.themes.flatMap(theme => theme.points))
  function sourceIndexLabel(point) {
    if (point.isUserAdded) return '新增卡片'
    const values = point.mergedSourceIndexes
    if (!values?.length || values.length === 1)
      return point.part === '时政' ? '2026 模拟卷专题' : `知识点 ${String(point.sourceIndex).padStart(3, '0')}`
    const ranges = []
    let start = values[0], end = start
    for (const value of values.slice(1)) {
      if (value === end + 1) {
        end = value; continue
      }
      ranges.push(start === end ? String(start) : `${start}–${end}`)
      start = end = value
    }
    ranges.push(start === end ? String(start) : `${start}–${end}`)
    return `原卡第 ${ranges.join('、')} 张合并`
  }
  const escapeHTML = value => String(value)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;')
    .replaceAll('\'', '&#039;')
  function relatedQuestionLabel(question) {
    const match = /^(新东方|苏一|余峰)(\d+[-－]\d+)$/.exec(question.label)
    if (!match || question.sourceType !== '模拟题') return question.label
    return `${{ 新东方: '新五', 苏一: '苏六', 余峰: '余六' }[match[1]]}${match[2]}`
  }
  const captured = data.capturedAt ? data.capturedAt.slice(0, 10).replaceAll('-', '.') : ''
  document.getElementById('footer-source').textContent
    = `当前 ${allPoints.length} 张 · 真题 v${data.decks.trueExam.revision} · 模拟卷 v${data.decks.simulation.revision} · ${captured}`

  const sideNav = document.getElementById('side-nav')
  const contentGrid = document.querySelector('.content-grid')
  const sideNavToggle = document.getElementById('side-nav-toggle')
  sideNavToggle.addEventListener('click', () => {
    const collapsed = contentGrid.classList.toggle('nav-collapsed')
    sideNavToggle.setAttribute('aria-expanded', String(!collapsed))
    sideNavToggle.setAttribute('aria-label', collapsed ? '展开学科导航' : '收起学科导航')
  })
  const mobileNav = document.getElementById('mobile-nav')
  const subjects = document.getElementById('subjects')
  const slug = name => `subject-${data.parts.findIndex(part => part.name === name) + 1}`
  const revealNavGroup = group => {
    const pad = 12
    const top = group.offsetTop
    const bottom = top + group.offsetHeight
    const viewTop = sideNav.scrollTop
    const viewBottom = viewTop + sideNav.clientHeight
    if (bottom > viewBottom - pad) {
      sideNav.scrollTo({
        top: Math.min(top - pad, bottom - sideNav.clientHeight + pad),
        behavior: 'smooth',
      })
    } else if (top < viewTop + pad) {
      sideNav.scrollTo({ top: Math.max(0, top - pad), behavior: 'smooth' })
    }
  }

  data.parts.forEach((part, partIndex) => {
    const id = slug(part.name)
    const group = document.createElement('div')
    group.className = 'nav-group'
    const navRow = document.createElement('div')
    navRow.className = 'nav-row'
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'nav-button'
    button.dataset.target = id
    button.dataset.part = part.name
    button.setAttribute('aria-label', `跳转到${part.name}`)
    button.textContent = part.name
    const expandButton = document.createElement('button')
    expandButton.type = 'button'
    expandButton.className = 'nav-expand'
    expandButton.setAttribute('aria-expanded', 'false')
    expandButton.setAttribute('aria-label', `展开${part.name}目录`)
    expandButton.innerHTML = `<span class="nav-tools"><span class="nav-count">${part.pointCount}</span>
      <svg class="nav-chevron" viewBox="0 0 12 20" fill="none" stroke="currentColor"
        stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m2 8 4 4 4-4"></path></svg></span>`
    const themeList = document.createElement('div')
    themeList.className = 'nav-theme-list'
    themeList.hidden = true
    part.themes.forEach((theme, themeIndex) => {
      const themeButton = document.createElement('button')
      themeButton.type = 'button'
      themeButton.className = 'nav-theme'
      themeButton.dataset.target = `${id}-theme-${themeIndex + 1}`
      themeButton.dataset.part = part.name
      themeButton.dataset.theme = theme.name
      themeButton.innerHTML = `<span>${escapeHTML(theme.name)}</span><b>${theme.points.length}</b>`
      themeButton.addEventListener('click', () => {
        document.getElementById(themeButton.dataset.target)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      themeList.appendChild(themeButton)
    })
    button.addEventListener('click', () => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    expandButton.addEventListener('click', () => {
      const expanded = expandButton.getAttribute('aria-expanded') === 'true'
      expandButton.setAttribute('aria-expanded', String(!expanded))
      expandButton.setAttribute('aria-label', `${expanded ? '展开' : '收起'}${part.name}目录`)
      themeList.hidden = expanded
      if (!expanded) revealNavGroup(group)
    })
    navRow.append(button, expandButton)
    group.append(navRow, themeList)
    sideNav.appendChild(group)

    const mobile = document.createElement('button')
    mobile.type = 'button'
    mobile.dataset.part = part.name
    mobile.textContent = `${part.name} ${part.pointCount}`
    mobile.dataset.target = id
    mobile.addEventListener('click', () => {
      document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    mobileNav.appendChild(mobile)
  })
  sideNav.insertAdjacentHTML('beforeend',
    '<div class="side-tip">点击题号查看原题；答错后可复制收藏。</div>')

  function renderCardActions(point) {
    const hidden = Boolean(point.knowledgeObscured)
    return `<div class="card-actions">
      <button type="button" class="card-icon-button card-copy" data-copy-id="${escapeHTML(point.id)}"
        title="复制本卡片内容" aria-label="复制本卡片内容">
        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path></svg>
      </button>
      <button type="button" class="card-icon-button card-hide" data-hide-id="${escapeHTML(point.id)}"
        title="${hidden ? '显示知识点' : '隐藏知识点'}" aria-label="${hidden ? '显示知识点' : '隐藏知识点'}"
        aria-pressed="${hidden}">
        <svg class="icon-hide" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle><path d="M3 21 21 3"></path></svg>
        <svg class="icon-show" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
      </button>
    </div>`
  }

  function createInsertSlot(afterId = '') {
    const slot = document.createElement('div')
    slot.className = 'card-insert-slot'
    slot.innerHTML = `<button type="button" class="card-insert-button"
      data-insert-after="${escapeHTML(afterId)}" aria-label="在此处增加知识卡"
      title="在此处增加知识卡">＋</button>`
    return slot
  }

  data.parts.forEach(part => {
    const section = document.createElement('section')
    section.className = 'subject'
    section.id = slug(part.name)
    section.dataset.part = part.name
    section.innerHTML = `
      <header class="subject-head">
        <div class="subject-mark" aria-hidden="true">📄</div>
        <div class="subject-title"><h2>${escapeHTML(part.name)}</h2>
          <p>${escapeHTML(part.description)}</p></div>
        <div class="subject-count"><strong data-subject-points>${part.pointCount}</strong><br>
          <span data-subject-meta>${part.themeCount} 个主题 · ${part.questionCount} 道题</span></div>
      </header>`
    part.themes.forEach((theme, themeIndex) => {
      const block = document.createElement('div')
      block.className = 'theme'
      block.id = `${slug(part.name)}-theme-${themeIndex + 1}`
      block.dataset.part = part.name
      block.dataset.theme = theme.name
      block.dataset.themeIndex = String(themeIndex)
      const head = document.createElement('div')
      head.className = 'theme-head'
      head.innerHTML = `<span class="theme-label">章节 ${String(themeIndex + 1).padStart(2, '0')}</span>
        <h3>${escapeHTML(theme.name)}</h3>
        <span class="theme-count">${theme.points.length} 条考点</span>`
      block.appendChild(head)
      if ((isSimulation && theme.points.length === 0) || (!isSimulation && part.name === '时政')) {
        const pending = document.createElement('div')
        pending.className = 'pending-card'
        pending.innerHTML = part.name === '时政' && !isSimulation
          ? '该部分卡片正在制作中，获取最新版，请关注微信公众号 <button type="button" data-qr-dialog="account">@普通小豆芽</button>。'
          : '该部分卡片正在制作中，获取更新进度，请关注公众号 <button type="button" data-qr-dialog="account">@普通小豆芽</button>。'
        block.appendChild(pending)
      }
      theme.points.forEach(point => {
        const row = document.createElement('article')
        row.className = `point${point.knowledgeObscured ? ' knowledge-obscured' : ''}`
        row.dataset.sources = point.sources.join('|')
        row.dataset.labels = `|${point.questionIds.flatMap(id => [
          data.questions[id].label,
          data.questions[id].displayLabel || data.questions[id].label,
          relatedQuestionLabel(data.questions[id]),
        ]).join('|')}|`
        row.dataset.search = [
          point.text,
          point.prompt,
          point.theme,
          part.name,
          ...point.sources,
          ...point.questionIds.flatMap(id => [
            data.questions[id].label,
            data.questions[id].displayLabel || data.questions[id].label,
            relatedQuestionLabel(data.questions[id]),
          ]),
        ].join(' ').toLowerCase()
        const recurrenceTag = point.recurrence
          ? '<span class="recurrence-tag">真题复现</span>'
          : ''
        row.innerHTML = `
          <div class="copy-area" data-point-id="${escapeHTML(point.id)}">
            <div class="point-card-head">
              ${renderCardActions(point)}
              ${recurrenceTag}
              <span class="source-index">${sourceIndexLabel(point)}</span>
              <span class="prompt">${escapeHTML(point.prompt)}</span>
            </div>
            <div class="point-card-body"><span class="knowledge source-content mn-content">${point.sourceHtml}</span></div>
          </div>
          <div class="question-links" aria-label="关联题目">${renderQuestionLinks(point)}</div>
          <div class="card-editor" data-editor-id="${escapeHTML(point.id)}" hidden>
            <p>左栏可直接编辑，⌘Z 回退、⌘⇧Z 重做；选中文字后可点“• 列表”；列表行按 Tab 缩进，按 Shift+Tab（或 ⌘Tab）退一级。题型圆标可拖动，也可点击修改或移动。</p>
            <div class="card-editor-actions">
              <button type="button" data-add-marker="${escapeHTML(point.id)}">新增题型圆标</button>
              <button type="button" class="card-save" data-save-id="${escapeHTML(point.id)}">保存本卡</button>
              <button type="button" class="card-cancel" data-cancel-id="${escapeHTML(point.id)}">取消</button>
              <button type="button" class="card-delete" data-delete-id="${escapeHTML(point.id)}">删除本卡</button>
            </div>
          </div>
          `
        block.append(row)
      })
      section.appendChild(block)
    })
    subjects.appendChild(section)
  })
  updateAllCardToggle()

  const knowledgeById = new Map()
  data.parts.forEach(part => part.themes.forEach(theme =>
    theme.points.forEach(point => knowledgeById.set(point.id, point))))

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (_) {
      const area = document.createElement('textarea')
      area.value = text
      area.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0'
      document.body.appendChild(area)
      area.focus()
      area.select()
      const ok = document.execCommand('copy')
      area.remove()
      return ok
    }
  }
  // 语法依据：墨墨开放 API 的「墨墨记忆卡制卡指南」。
  function markjiSafe(value) {
    return String(value ?? '').replaceAll('[', '\\[').replaceAll(']', '\\]')
  }
  function questionReference(id) {
    const question = data.questions[id]
    return `[Question#ID/${id}#${markjiSafe(question?.label || id)}]`
  }
  function hexColor(value) {
    const raw = String(value || '').trim().toLowerCase()
    const short = raw.match(/^#([0-9a-f]{3})$/)
    if (short) return [...short[1]].map(x => x + x).join('')
    const long = raw.match(/^#([0-9a-f]{6})$/)
    if (long) return long[1]
    const rgb = raw.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
    if (rgb) return rgb.slice(1, 4).map(x => Number(x).toString(16).padStart(2, '0')).join('')
    return ''
  }
  function styleText(text, style) {
    if (!text) return ''
    const params = []
    if (style.bold) params.push('B')
    if (style.italic) params.push('I')
    if (style.underline) params.push('U')
    if (style.color) params.push(`!${style.color}`)
    if (style.background) params.push(`!!${style.background}`)
    const safe = markjiSafe(text)
    return params.length && safe.trim() ? `[T#${params.join(',')}#${safe}]` : safe
  }
  function inlineMarkji(root) {
    const output = []
    function walk(node, inherited) {
      if (node.nodeType === Node.TEXT_NODE) {
        output.push(styleText(node.nodeValue, inherited)); return
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return
      if (node.matches('button,.exam-marker,.inline-question-ref,.question-link')) return
      if (node.tagName === 'BR') {
        output.push('\n'); return
      }
      const next = { ...inherited }
      if (node.matches('strong,b,th')) next.bold = true
      if (node.matches('em,i')) next.italic = true
      if (node.matches('u')) next.underline = true
      if (node.style) {
        const weight = node.style.fontWeight
        if (weight === 'bold' || Number(weight) >= 600) next.bold = true
        if (node.style.fontStyle === 'italic') next.italic = true
        if (node.style.textDecorationLine.includes('underline')) next.underline = true
        next.color = hexColor(node.style.color) || next.color
        next.background = hexColor(node.style.backgroundColor) || next.background
      }
      for (const child of node.childNodes) walk(child, next)
    }
    walk(root, { bold: false, italic: false, underline: false, color: '', background: '' })
    return output.join('').trim()
  }
  function formatPoint(point) {
    const root = document.createElement('div')
    root.innerHTML = point.sourceHtml || ''
    const lines = []
    for (const node of root.children) {
      if (node.matches('.source-spacer')) {
        lines.push(''); continue
      }
      if (node.matches('.knowledge-table-wrap,table')) {
        for (const row of node.querySelectorAll('tr')) {
          lines.push([...row.querySelectorAll('th,td')]
            .map(cell => inlineMarkji(cell)).join(' ｜ '))
        }
        lines.push('')
        continue
      }
      if (node.matches('img') || node.querySelector('img')) {
        lines.push('原卡含图片，请在工作台查看图片。')
        continue
      }
      const content = inlineMarkji(node)
      const level = node.querySelector('.source-list.level-3')
        ? 3
        : node.querySelector('.source-list.level-2')
          ? 2
          : node.querySelector('.source-list.level-1') ? 1 : 0
      lines.push(level && content ? `[P#I${level}#${content}]` : content)
    }
    const body = lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
      || markjiSafe(point.text || '')
    return `[P#H1#${markjiSafe(point.prompt)}]` + (body ? `\n${body}` : '')
  }
  function formatQuestion(question) {
    const correct = new Set(String(question.answer || '').toUpperCase().match(/[A-Z]/g) || [])
    const letters = new Set(question.options.map(option => String(option.letter).toUpperCase()))
    const valid = correct.size > 0 && [...correct].every(letter => letters.has(letter))
    const lines = [
      `[P#H1#${markjiSafe(question.displayLabel || question.label)}]`,
      markjiSafe(question.stem),
      '',
    ]
    if (valid) {
      lines.push(`[Choice#${correct.size > 1 ? 'fixed,multi' : 'fixed'}#`)
      for (const option of question.options) {
        const symbol = correct.has(String(option.letter).toUpperCase()) ? '* ' : '- '
        lines.push(symbol + markjiSafe(option.text))
      }
      lines.push(']')
    } else {
      for (const option of question.options)
        lines.push(`${option.letter}. ${markjiSafe(option.text)}`)
    }
    lines.push('---', '[T#B#正确答案]', markjiSafe(`${question.answer || ''} ${question.answerText || ''}`.trim()), '[T#B#答案解析]', markjiSafe(question.explanation || ''))
    return lines.join('\n')
  }
  const answerResults = new Map()
  const answerAttempts = new Map()
  function renderQuestionAttempts(id) {
    const counts = answerAttempts.get(id) || { right: 0, wrong: 0 }
    document.getElementById('question-right-count').textContent = counts.right
    document.getElementById('question-wrong-count').textContent = counts.wrong
  }
  const answerNote = '错题已自动保存到当前浏览器，可在左侧学科下的「错题」中复习。右下角「记录」只统计本次作答，刷新后重置。&nbsp;<a href="https://markji.discourse.group/t/topic/1225" target="_blank" rel="noopener noreferrer">?</a>'
  function refreshAnswerMarks() {
    let rightCount = 0
    let wrongCount = 0
    for (const result of answerResults.values()) {
      if (result === 'right') rightCount++
      if (result === 'wrong') wrongCount++
    }
    document.getElementById('record-total').textContent = rightCount + wrongCount
    document.getElementById('record-right').textContent = rightCount
    document.getElementById('record-wrong').textContent = wrongCount
    document.querySelectorAll('.sheet-cell[data-question],.question-link[data-question]').forEach(button => {
      const result = answerResults.get(button.dataset.question)
      button.classList.toggle('answered-right', result === 'right')
      button.classList.toggle('answered-wrong', result === 'wrong')
      if (result) button.title = result === 'right' ? '已答对' : '已答错'
    })
    document.getElementById('sheet-answer-note').hidden = answerResults.size === 0
    updateSheetScore()
    document.querySelectorAll('.point').forEach(row => {
      const links = row.querySelector('.question-links')
      if (!links) return
      let note = links.querySelector('.answer-record-note')
      const answered = [...links.querySelectorAll('[data-question]')]
        .some(button => answerResults.has(button.dataset.question))
      if (answered && !note) {
        note = document.createElement('p')
        note.className = 'answer-record-note'
        note.innerHTML = answerNote
        links.appendChild(note)
      }
      if (note) note.hidden = !answered
    })
  }
  let toastTimer
  function toast(message, persistent = false) {
    const element = document.getElementById('toast')
    document.getElementById('toast-message').textContent = message
    const copied = message === '已复制为墨墨记忆卡格式'
    document.getElementById('toast-divider').hidden = !copied
    document.getElementById('toast-help').hidden = !copied
    element.classList.add('show')
    clearTimeout(toastTimer)
    if (!persistent) toastTimer = setTimeout(() => element.classList.remove('show'), 3600)
  }
  async function copyFormatted(text) {
    try {
      const ok = await copyText(text)
      toast(ok ? '已复制为墨墨记忆卡格式' : '复制失败，请手动选择文本')
      return ok
    } catch (_) {
      toast('复制失败，请手动选择文本')
      return false
    }
  }

  subjects.addEventListener('click', event => {
    if (event.target.closest('[data-insert-after],[data-add-marker],[data-remove-question],[data-add-question],[data-edit-id],[data-save-id],[data-cancel-id],[data-delete-id]')) return
    const expandQuestions = event.target.closest('.question-expand')
    if (expandQuestions) {
      const links = expandQuestions.closest('.question-links')
      setQuestionLinksExpanded(links, !links.classList.contains('questions-expanded'))
      return
    }
    const copyCard = event.target.closest('[data-copy-id]')
    if (copyCard) {
      const point = knowledgeById.get(copyCard.dataset.copyId)
      if (point) copyFormatted(formatPoint(point), '知识卡')
      return
    }
    const hideCard = event.target.closest('[data-hide-id]')
    if (hideCard) {
      const point = knowledgeById.get(hideCard.dataset.hideId)
      if (point) {
        point.knowledgeObscured = !point.knowledgeObscured
        point.editedAt = Date.now()
        hideCard.closest('.point').classList.toggle('knowledge-obscured', point.knowledgeObscured)
        hideCard.setAttribute('aria-pressed', String(point.knowledgeObscured))
        hideCard.title = hideCard.ariaLabel = point.knowledgeObscured ? '显示知识点' : '隐藏知识点'
        updateAllCardToggle()
        // 遮挡状态只作用于当前页面，不写回知识卡数据。
      }
      return
    }
    const insertButton = event.target.closest('[data-insert-after]')
    if (insertButton) {
      insertCard(insertButton); return
    }
    const examMarker = event.target.closest('.exam-marker')
    if (examMarker) {
      if (examMarker.closest('.point.editing')) editExamMarker(examMarker)
      else highlightExamMarker(examMarker)
      return
    }
    const addMarker = event.target.closest('[data-add-marker]')
    if (addMarker) {
      addExamMarker(addMarker.dataset.addMarker); return
    }
    const removeQuestion = event.target.closest('[data-remove-question]')
    if (removeQuestion) {
      removeCardQuestion(removeQuestion.dataset.cardId,
        removeQuestion.dataset.removeQuestion); return
    }
    const addQuestion = event.target.closest('[data-add-question]')
    if (addQuestion) {
      addCardQuestion(addQuestion.dataset.addQuestion); return
    }
    const cited = event.target.closest('[data-question]')
    if (cited && !event.target.closest('.point.editing')) {
      openQuestion(cited.dataset.question,
        cited.closest('.question-links') ? cited : null); return
    }
    const edit = event.target.closest('[data-edit-id]')
    if (edit) {
      beginEdit(edit.dataset.editId); return
    }
    const save = event.target.closest('[data-save-id]')
    if (save) {
      saveCard(save.dataset.saveId); return
    }
    const cancel = event.target.closest('[data-cancel-id]')
    if (cancel) {
      cancelEdit(cancel.dataset.cancelId); return
    }
    const deleteButton = event.target.closest('[data-delete-id]')
    if (deleteButton) {
      deleteCard(deleteButton.dataset.deleteId); return
    }
  })
  subjects.addEventListener('keydown', event => {
    if (event.key === 'Enter' && event.target.matches('.link-editor input')) {
      event.preventDefault(); addCardQuestion(event.target.dataset.cardId)
    }
  })
  subjects.addEventListener('keydown', event => {
    const cited = event.target.closest('.inline-question-ref')
    if (cited && !event.target.closest('.point.editing')
      && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault(); openQuestion(cited.dataset.question); return
    }
  })

  const backdrop = document.getElementById('dialog-backdrop')
  const close = document.getElementById('dialog-close')
  const closeCorner = document.getElementById('dialog-close-corner')
  const dialogCopy = document.getElementById('dialog-copy')
  const dialogReference = document.getElementById('dialog-reference')
  const dialogEdit = document.getElementById('dialog-edit')
  const dialogSave = document.getElementById('dialog-save')
  const dialogCancel = document.getElementById('dialog-cancel')
  const dialog = document.getElementById('dialog')
  const quizActions = document.getElementById('quiz-actions')
  const quizStatus = document.getElementById('quiz-status')
  const showAnswer = document.getElementById('show-answer')
  const nextQuestion = document.getElementById('next-question')
  const answerPanel = document.getElementById('answer-panel')
  const analysisBox = document.getElementById('analysis-box')
  let lastFocus = null
  let currentQuestionId = null
  let activeQuestionAnchor = null
  let questionQuizMode = false
  let selectedAnswers = new Set()
  let answerRevealed = false

  function positionAnchoredQuestion() {
    if (!activeQuestionAnchor || !backdrop.classList.contains('open')) return
    const sidebar = activeQuestionAnchor.closest('.question-links')
    if (!sidebar) return
    const side = sidebar.getBoundingClientRect()
    const width = Math.min(side.width, window.innerWidth - 16)
    const left = Math.max(8, Math.min(side.left, window.innerWidth - width - 8))
    backdrop.style.setProperty('--question-left', `${left}px`)
    backdrop.style.setProperty('--question-width', `${width}px`)
  }

  function openQuestion(id, anchor = null, forceQuiz = false) {
    const question = data.questions[id]
    if (!question) return
    setQuestionEditing(false)
    dialogCopy.classList.remove('wrong-copy')
    document.getElementById('dialog-copy-label').textContent = '复制'
    document.getElementById('wrong-copy-note').hidden = true
    currentQuestionId = id
    renderQuestionAttempts(id)
    if (!backdrop.classList.contains('open')) lastFocus = document.activeElement
    activeQuestionAnchor = anchor
    questionQuizMode = Boolean(question.answer) && question.quizAvailable !== false
      && (Boolean(anchor) || forceQuiz)
    selectedAnswers = new Set()
    answerRevealed = false
    const relatedPoints = pointByQuestion.get(id) || []
    document.getElementById('question-knowledge-count').textContent = `· ${relatedPoints.length}`
    document.getElementById('question-knowledge-list').innerHTML = relatedPoints.length
      ? relatedPoints.map(point => `<button type="button" data-jump-card="${escapeHTML(point.id)}">
          第 ${point.sourceIndex} 张 · ${escapeHTML(point.part)} · ${escapeHTML(point.prompt)}</button>`).join('')
      : '<span class="no-links">暂无对应知识卡片</span>'
    document.getElementById('question-knowledge').open = false
    const paper = paperInfo(question)
    const paperName = question.sourceType === '模拟题' && paper
      ? FAMILY_NAME[paper.family]
      : null
    document.getElementById('dialog-title').textContent = paperName
      ? `${paperName}${paper.label === '全部题目' ? '' : ` · ${paper.label}`}`
      : `${question.sourceType}原题`
    const questionLabel = question.displayLabel || question.label
    const fallbackPrefix = question.sourceType === '真题' ? '历年真题' : '模拟卷'
    document.getElementById('dialog-label').textContent
      = question.part ? `${question.part} · ${questionLabel}` : `${fallbackPrefix} · ${questionLabel}`
    document.getElementById('question-kind').textContent = question.kind
    document.getElementById('question-stem').textContent = question.stem
    const options = document.getElementById('question-options')
    options.innerHTML = question.options.map(option => {
      const correct = !questionQuizMode && question.answer.includes(option.letter)
      const choice = questionQuizMode
        ? ` role="button" tabindex="0" aria-pressed="false" data-option-letter="${escapeHTML(option.letter)}"`
        : ''
      return `<li class="option${correct ? ' correct' : ''}"${choice}>
        <span class="option-letter">${option.letter}.</span>
        <span class="option-text">${escapeHTML(option.text)}</span></li>`
    }).join('')
    quizActions.hidden = !questionQuizMode
    quizStatus.textContent = question.kind === '多项选择题'
      ? '多选题：请选择所有正确选项'
      : '单选题：请选择一个选项'
    showAnswer.disabled = true
    showAnswer.textContent = '显示答案'
    nextQuestion.hidden = !(forceQuiz && !questionQuizMode && getNextQuestionTarget(id))
    answerPanel.hidden = questionQuizMode
    analysisBox.hidden = questionQuizMode
    document.getElementById('answer-letter').textContent = question.answer || '待核实'
    document.getElementById('answer-text').textContent = question.answerText
    document.getElementById('analysis-text').textContent = question.explanation
    analysisBox.open = false
    const metaParts = []
    if (question.cardId) metaParts.push(`卡片 ${String(question.cardId).slice(-8)}`)
    if (question.revision) metaParts.push(`版本 ${question.revision}`)
    document.getElementById('card-meta').textContent
      = metaParts.length
        ? metaParts.join(' · ')
        : `来源：${question.sourceType === '真题' ? '历年真题' : '模拟卷'}文稿（收录补全）`
    const markjiLink = document.getElementById('markji-link')
    if (question.markjiDeckId && question.markjiCardId) {
      markjiLink.hidden = false
      markjiLink.href
        = `https://www.markji.com/deck/${encodeURIComponent(question.markjiDeckId)}?cardId=${encodeURIComponent(question.markjiCardId)}`
    } else {
      markjiLink.hidden = true
      markjiLink.removeAttribute('href')
    }
    const compactDialog = touchDevice
      || window.matchMedia('(max-width: 1024px), (hover: none), (pointer: coarse)').matches
    const anchored = Boolean(anchor) && !compactDialog
    backdrop.classList.add('open')
    backdrop.classList.toggle('anchored', anchored)
    backdrop.classList.toggle('touch-dialog', compactDialog)
    backdrop.setAttribute('aria-modal', String(!anchored))
    document.body.style.overflow = anchored ? '' : 'hidden'
    dialog.scrollTop = 0
    dialog.querySelector('.dialog-body').scrollTop = 0
    if (anchored) positionAnchoredQuestion()
    requestAnimationFrame(() => {
      dialog.scrollTop = 0;
      (anchored ? closeCorner : close).focus({ preventScroll: true })
    })
  }

  function closeQuestion() {
    backdrop.classList.remove('open')
    backdrop.classList.remove('anchored')
    document.body.style.overflow = ''
    activeQuestionAnchor = null
    if (lastFocus) lastFocus.focus()
  }

  close.addEventListener('click', closeQuestion)
  closeCorner.addEventListener('click', closeQuestion)
  function chooseOption(letter) {
    if (!questionQuizMode || answerRevealed || dialog.classList.contains('editing')) return
    const question = data.questions[currentQuestionId]
    if (question.kind === '多项选择题') {
      if (selectedAnswers.has(letter)) selectedAnswers.delete(letter)
      else selectedAnswers.add(letter)
    } else {
      selectedAnswers = new Set([letter])
    }
    document.querySelectorAll('#question-options [data-option-letter]').forEach(option => {
      const selected = selectedAnswers.has(option.dataset.optionLetter)
      option.classList.toggle('selected', selected)
      option.setAttribute('aria-pressed', String(selected))
    })
    quizStatus.textContent = selectedAnswers.size
      ? `已选 ${[...selectedAnswers].sort().join('、')}，点击“显示答案”核对`
      : question.kind === '多项选择题'
        ? '多选题：请选择所有正确选项'
        : '单选题：请选择一个选项'
    showAnswer.disabled = selectedAnswers.size === 0
  }
  document.getElementById('question-options').addEventListener('click', event => {
    const option = event.target.closest('[data-option-letter]')
    if (option) chooseOption(option.dataset.optionLetter)
  })
  document.getElementById('question-options').addEventListener('keydown', event => {
    const option = event.target.closest('[data-option-letter]')
    if (option && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault(); chooseOption(option.dataset.optionLetter)
    }
  })
  showAnswer.addEventListener('click', () => {
    if (!currentQuestionId || !selectedAnswers.size || answerRevealed) return
    const correct = new Set(data.questions[currentQuestionId].answer.split(''))
    answerRevealed = true
    answerPanel.hidden = false
    analysisBox.hidden = false
    document.querySelectorAll('#question-options [data-option-letter]').forEach(option => {
      const letter = option.dataset.optionLetter
      option.classList.toggle('correct', correct.has(letter))
      option.classList.toggle('wrong', selectedAnswers.has(letter) && !correct.has(letter))
      option.removeAttribute('role')
      option.removeAttribute('tabindex')
    })
    const right = selectedAnswers.size === correct.size
      && [...selectedAnswers].every(letter => correct.has(letter))
    const attempts = answerAttempts.get(currentQuestionId) || { right: 0, wrong: 0 }
    attempts[right ? 'right' : 'wrong'] += 1
    answerAttempts.set(currentQuestionId, attempts)
    renderQuestionAttempts(currentQuestionId)
    answerResults.set(currentQuestionId, right ? 'right' : 'wrong')
    document.dispatchEvent(new CustomEvent('one-page-answer', {
      detail: { id: currentQuestionId, right, selected: [...selectedAnswers].sort().join('') }
    }))
    refreshAnswerMarks()
    quizStatus.textContent = right ? '回答正确' : `回答不正确，正确答案：${[...correct].sort().join('、')}`
    dialogCopy.classList.toggle('wrong-copy', !right)
    document.getElementById('dialog-copy-label').textContent = right ? '复制' : '复制本错题'
    document.getElementById('wrong-copy-note').hidden = right
    showAnswer.disabled = true
    showAnswer.textContent = '已显示答案'
    nextQuestion.hidden = !getNextQuestionTarget(currentQuestionId)
  })
  function getNextQuestionTarget(id) {
    if (activeQuestionAnchor) {
      const links = [...(activeQuestionAnchor.closest('.point')?.querySelectorAll('.question-link[data-question]') || [])]
      const index = links.findIndex(link => link === activeQuestionAnchor)
      if (index < 0) return null
      const next = links[index + 1]
      return next ? { id: next.dataset.question, anchor: next } : null
    }
    const info = paperInfo(data.questions[id])
    const paper = info && papersByFamily.get(info.family)?.get(info.key)
    if (!paper) return null
    const nextId = [...paper.nums.entries()].filter(([number, qid]) => number > info.num && qid)
      .sort((a, b) => a[0] - b[0])[0]?.[1]
    return nextId ? { id: nextId, anchor: null } : null
  }
  nextQuestion.addEventListener('click', () => {
    const next = currentQuestionId && getNextQuestionTarget(currentQuestionId)
    if (next) openQuestion(next.id, next.anchor, true)
  })
  window.addEventListener('resize', positionAnchoredQuestion)
  window.addEventListener('scroll', positionAnchoredQuestion, true)
  document.addEventListener('pointerdown', event => {
    if (backdrop.classList.contains('open') && backdrop.classList.contains('anchored')
      && !dialog.contains(event.target) && !activeQuestionAnchor?.contains(event.target)
      && !event.target.closest('[data-hide-id]')) {
      closeQuestion()
    }
  }, true)
  document.getElementById('question-knowledge-list').addEventListener('click', event => {
    const button = event.target.closest('[data-jump-card]')
    if (!button) return
    const id = button.dataset.jumpCard
    closeQuestion()
    jumpToPoint(id)
  })
  dialogCopy.addEventListener('click', () => {
    if (!currentQuestionId) return
    copyFormatted(formatQuestion(data.questions[currentQuestionId]), '')
  })
  dialogReference.addEventListener('click', async () => {
    if (!currentQuestionId) return
    const ok = await copyText(questionReference(currentQuestionId))
    if (ok) closeQuestion()
    toast(ok ? '已复制题目引用，可粘贴到正在编辑的知识卡' : '复制失败，请手动复制题号')
  })
  function setQuestionEditing(editing) {
    document.getElementById('dialog').classList.toggle('editing', editing)
    dialogEdit.hidden = editing
    dialogSave.hidden = !editing
    dialogCancel.hidden = !editing
    document.getElementById('question-edit-tip').hidden = !editing
    for (const selector of ['#question-kind',
      '#question-stem',
      '.option-text',
      '#answer-letter',
      '#answer-text',
      '#analysis-text']) {
      document.querySelectorAll(selector).forEach(node => {
        node.contentEditable = editing ? 'true' : 'false'
        node.spellcheck = false
      })
    }
    if (editing) {
      answerPanel.hidden = false
      analysisBox.hidden = false
      quizActions.hidden = true
      analysisBox.open = true
    }
  }
  dialogEdit.addEventListener('click', event => event.preventDefault())
  dialogCancel.addEventListener('click', () => {
    if (currentQuestionId) openQuestion(currentQuestionId, activeQuestionAnchor)
  })
  dialogSave.addEventListener('click', () => {
    if (!currentQuestionId) return
    const question = data.questions[currentQuestionId]
    const read = selector => document.querySelector(selector).innerText.trim()
    const stem = read('#question-stem')
    const answer = read('#answer-letter').toUpperCase().replace(/\s+/g, '')
    const options = [...document.querySelectorAll('#question-options .option-text')]
      .map((node, i) => ({ ...question.options[i], text: node.innerText.trim() }))
    if (!stem || !answer || options.some(option => !option.text)) {
      toast('请填写题干、选项和答案'); return
    }
    Object.assign(question, { kind: read('#question-kind'),
      stem,
      options,
      answer,
      answerText: read('#answer-text'),
      explanation: read('#analysis-text'),
      editedAt: Date.now() })
    const backedUp = rememberEdit('question', currentQuestionId, question)

    openQuestion(currentQuestionId, activeQuestionAnchor)
    toast(backedUp
      ? '题目已临时保存在本机浏览器'
      : '题目已更新，但浏览器临时保存失败')
  })
  backdrop.addEventListener('click', event => {
    if (event.target === backdrop) closeQuestion()
  })
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && backdrop.classList.contains('open')) {
      event.preventDefault()
      closeQuestion()
    }
  })

  const searchInput = document.getElementById('search-input')
  const searchBox = document.getElementById('search-box')
  const mobileCardJumpInput = document.querySelector('#mobile-card-jump input')
  const empty = document.getElementById('empty')
  const navButtons = [...document.querySelectorAll('.nav-button'),
    ...document.querySelectorAll('.mobile-nav button')]
  const themeNavButtons = [...document.querySelectorAll('.nav-theme')]

  function setQuestionLinksExpanded(links, expanded) {
    links.classList.toggle('questions-expanded', expanded)
    const button = links.querySelector('.question-expand')
    if (!button) return
    const label = expanded ? '收起关联题目' : '展开全部关联题目'
    button.setAttribute('aria-expanded', String(expanded))
    button.setAttribute('aria-label', label)
    button.title = label
  }

  let questionExpanderFrame = 0
  function scheduleQuestionExpanders() {
    if (questionExpanderFrame) return
    questionExpanderFrame = requestAnimationFrame(() => {
      questionExpanderFrame = 0
      document.querySelectorAll('.question-links').forEach(links => {
        const scroll = links.querySelector('.question-scroll')
        const button = links.querySelector('.question-expand')
        const point = links.closest('.point')
        if (!scroll || !button || point?.hidden || !links.getClientRects().length) return
        const expanded = links.classList.contains('questions-expanded')
        if (expanded) links.classList.remove('questions-expanded')
        links.style.removeProperty('--question-scroll-limit')
        button.hidden = true

        const linksStyle = getComputedStyle(links)
        const title = links.querySelector('.question-sidebar-title')
        const padding = parseFloat(linksStyle.paddingTop) + parseFloat(linksStyle.paddingBottom)
        const gap = parseFloat(linksStyle.rowGap || linksStyle.gap) || 0
        const titleHeight = title ? title.getBoundingClientRect().height : 0
        const availableWithoutButton = Math.max(0,
          links.clientHeight - padding - titleHeight - gap)
        const overflowing = scroll.scrollHeight > availableWithoutButton + 2

        button.hidden = !overflowing
        const buttonSpace = overflowing ? button.offsetHeight + gap : 0
        const scrollLimit = Math.max(0, Math.floor(availableWithoutButton - buttonSpace))
        links.style.setProperty('--question-scroll-limit', `${scrollLimit}px`)
        if (expanded && overflowing) links.classList.add('questions-expanded')
        setQuestionLinksExpanded(links, links.classList.contains('questions-expanded'))
      })
    })
  }
  window.addEventListener('resize', scheduleQuestionExpanders)

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase()
    const codeQuery = /^[^\s]+-\d+$/.test(query)
    searchBox.classList.toggle('has-value', Boolean(query))
    let visiblePoints = 0
    let visibleSubjects = 0
    let anyVisibleTheme = false
    document.querySelectorAll('.subject').forEach(section => {
      let sectionVisible = 0
      let sectionThemes = 0
      const sectionQuestions = new Set()
      section.querySelectorAll('.theme').forEach(theme => {
        let themeVisible = 0
        theme.querySelectorAll('.point').forEach(point => {
          const exactLabel = codeQuery && point.dataset.labels.includes(`|${query}|`)
          const visible = !query || section.dataset.part !== contentGrid.dataset.activeSubject || (codeQuery ? exactLabel : point.dataset.search.includes(query))
          point.hidden = !visible
          if (visible) {
            themeVisible += 1
            point.querySelectorAll('.question-source').forEach(group => {
              group.hidden = false
              group.querySelectorAll('.question-link').forEach(button => {
                sectionQuestions.add(button.dataset.question)
              })
            })
          }
        })
        const pending = theme.querySelector('.pending-card')
        const pendingVisible = Boolean(pending) && (!query
          || theme.dataset.theme.toLowerCase().includes(query)
          || section.dataset.part.toLowerCase().includes(query))
        theme.hidden = themeVisible === 0 && !pendingVisible
        theme.querySelector('.theme-count').textContent = pending
          ? '制作中'
          : `${themeVisible} 张知识卡`
        sectionVisible += themeVisible
        if (!theme.hidden) {
          sectionThemes += 1; anyVisibleTheme = true
        }
      })
      section.hidden = sectionThemes === 0
      section.dataset.visibleCount = sectionVisible
      section.querySelector('[data-subject-points]').textContent
        = sectionVisible || (isSimulation ? '制作中' : '0')
      section.querySelector('[data-subject-meta]').textContent
        = `${sectionThemes} 个主题 · ${sectionQuestions.size} 道题`
      if (!section.hidden) visibleSubjects += 1
      visiblePoints += sectionVisible
    })
    empty.classList.toggle('visible', !anyVisibleTheme)
    navButtons.forEach(button => {
      const section = document.getElementById(button.dataset.target)
      const count = Number(section?.dataset.visibleCount || 0)
      button.hidden = false
      if (button.classList.contains('nav-button')) {
        const group = button.closest('.nav-group')
        const expandButton = group.querySelector('.nav-expand')
        group.querySelector('.nav-row').hidden = button.hidden
        expandButton.querySelector('.nav-count').textContent
          = count || (isSimulation ? '制作中' : '0')
        const themeList = group.querySelector('.nav-theme-list')
        themeList.hidden = button.hidden || expandButton.getAttribute('aria-expanded') !== 'true'
      } else {
        button.textContent = `${button.dataset.part} ${count || (isSimulation ? '制作中' : '0')}`
      }
    })
    themeNavButtons.forEach(button => {
      const theme = document.getElementById(button.dataset.target)
      const count = theme?.querySelectorAll('.point:not([hidden])').length || 0
      const pending = Boolean(theme?.querySelector('.pending-card'))
      button.hidden = !theme || theme.hidden
      button.querySelector('b').textContent = pending ? '制作中' : String(count)
    })
    document.getElementById('stat-points').textContent = visiblePoints
    document.getElementById('stat-questions').textContent = Object.keys(data.questions).length
    document.getElementById('stat-subjects').textContent = visibleSubjects
    document.getElementById('total-badge').textContent = `${visiblePoints} 张知识卡`
    document.getElementById('snapshot-note').textContent = isSimulation
      ? `已收录 ${visiblePoints} 张马原导论知识卡；其他模拟卷考点正在制作中，请关注微信公众号获取更新。`
      : `${visiblePoints} 张一页纸知识卡 · 题库保留 ${Object.keys(data.questions).length} 道题。`
    scheduleQuestionExpanders()
  }
  const normalizeQuestionCode = value => String(value || '').trim().toLowerCase()
    .replace(/[－–—]/g, '-').replace(/\s+/g, '')
  const questionIdsByCode = new Map()
  Object.entries(data.questions).forEach(([id, question]) => {
    const labels = [question.label, question.displayLabel, relatedQuestionLabel(question)]
    labels.forEach(label => {
      const code = normalizeQuestionCode(label)
      if (!code) return
      if (!questionIdsByCode.has(code)) questionIdsByCode.set(code, new Set())
      questionIdsByCode.get(code).add(id)
    })
  })
  function yearQuestionTarget(value) {
    const match = normalizeQuestionCode(value).match(/^(\d{2}|\d{4})-(\d{1,2})$/)
    if (!match) return null
    const yearCode = Number(match[1])
    const number = Number(match[2])
    const truePapers = papersByFamily.get('真题')
    const matches = [...(truePapers?.entries() || [])].filter(([key, paper]) => {
      const year = Number(key.split('|')[0])
      return (match[1].length === 2 ? year % 100 === yearCode : year === yearCode)
        && paper.nums.has(number)
    })
    const selected = matches.find(([key]) => paperFamily.value === '真题'
      && paperSet.value === key)
    const [key, paper] = selected || matches.find(([key]) => key.endsWith('|'))
      || matches.sort((a, b) => a[1].order - b[1].order)[0] || []
    return paper ? { family: '真题', key, id: paper.nums.get(number) } : null
  }
  function searchedQuestionId(value = searchInput.value) {
    const code = normalizeQuestionCode(value)
    if (!/^[^\s]+-\d+$/.test(code)) return null
    const yearTarget = yearQuestionTarget(code)
    if (yearTarget) return yearTarget.id
    const ids = questionIdsByCode.get(code)
    return ids?.size === 1 ? [...ids][0] : null
  }
  function openSearchedQuestion(value = searchInput.value) {
    const id = searchedQuestionId(value)
    if (!id) return false
    openQuestion(id, null, true)
    return true
  }
  let questionSearchTimer = 0
  function scheduleQuestionSearch(input, event) {
    clearTimeout(questionSearchTimer)
    if (event.isComposing || !searchedQuestionId(input.value)) return
    const entered = input.value
    questionSearchTimer = setTimeout(() => {
      if (document.activeElement === input && input.value === entered)
        openSearchedQuestion(entered)
    }, 650)
  }
  searchInput.addEventListener('input', event => {
    applyFilters()
    scheduleQuestionSearch(searchInput, event)
  })
  searchInput.addEventListener('keydown', event => {
    if (event.key !== 'Enter' || event.isComposing || !searchedQuestionId()) return
    event.preventDefault()
    clearTimeout(questionSearchTimer)
    openSearchedQuestion()
  })
  mobileCardJumpInput.addEventListener('input', event => {
    const value = mobileCardJumpInput.value.trim()
    searchInput.value = /^\d+$/.test(value) ? '' : value
    applyFilters()
    scheduleQuestionSearch(mobileCardJumpInput, event)
  })
  document.getElementById('search-clear').addEventListener('click', () => {
    clearTimeout(questionSearchTimer)
    searchInput.value = ''
    mobileCardJumpInput.value = ''
    searchInput.focus()
    applyFilters()
  })
  const recordWidget = document.getElementById('record-widget')
  document.getElementById('record-collapse').addEventListener('click', () => {
    recordWidget.classList.add('collapsed')
    document.getElementById('record-expand').focus()
  })
  document.getElementById('record-expand').addEventListener('click', () => {
    recordWidget.classList.remove('collapsed')
    document.getElementById('record-collapse').focus()
  })
  applyFilters()

  /* ---------------- 知识卡编辑 ---------------- */
  const rootToQuestion = new Map(Object.entries(data.questions)
    .filter(([, question]) => question.markjiRootId)
    .map(([id, question]) => [question.markjiRootId, id]))
  function cardRow(id) {
    return document.querySelector(`.card-editor[data-editor-id="${id}"]`)?.closest('.point')
  }

  function markerTextNodes(container) {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
    const nodes = []
    let node
    while ((node = walker.nextNode())) {
      if (!node.parentElement?.closest('.exam-marker')) nodes.push(node)
    }
    return nodes
  }

  function markerPlainText(container) {
    return markerTextNodes(container).map(node => node.nodeValue).join('')
  }

  function markerBreakOffsets(container) {
    const offsets = []
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT)
    let offset = 0, node
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE && !node.parentElement?.closest('.exam-marker'))
        offset += node.nodeValue.length
      else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR')
        offsets.push(offset)
    }
    return offsets
  }

  function markerSentenceEnd(text, start, container) {
    let end = Math.max(0, Math.min(start, text.length))
    if (!/[。！？]/.test(text[end - 1] || '')) {
      const nextPunctuation = text.slice(end).search(/[。！？]/)
      const punctuationEnd = nextPunctuation < 0 ? text.length : end + nextPunctuation + 1
      const nextBreak = markerBreakOffsets(container).find(offset => offset >= end)
      end = nextBreak === undefined ? punctuationEnd : Math.min(punctuationEnd, nextBreak)
    }
    while (/[”’」』）》】]/.test(text[end] || '')) end++
    return end
  }

  function putMarkerAtTextOffset(container, offset, badge) {
    const nodes = markerTextNodes(container)
    if (!nodes.length) {
      container.append(badge); return
    }
    let remaining = offset
    for (const node of nodes) {
      if (remaining <= node.nodeValue.length) {
        const range = document.createRange()
        range.setStart(node, remaining)
        range.collapse(true)
        range.insertNode(badge)
        while (badge.parentElement && !badge.nextSibling
          && (badge.parentElement.tagName === 'MARK'
            || badge.parentElement.classList.contains('source-inline'))) {
          badge.parentElement.after(badge)
        }
        return
      }
      remaining -= node.nodeValue.length
    }
    container.append(badge)
  }

  function snapExamMarker(badge) {
    const container = badge.closest('td,th,.source-line')
    if (!container) return
    let start = 0
    for (const node of markerTextNodes(container)) {
      if (node.compareDocumentPosition(badge) & Node.DOCUMENT_POSITION_FOLLOWING)
        start += node.nodeValue.length
    }
    const text = markerPlainText(container)
    putMarkerAtTextOffset(container, markerSentenceEnd(text, start, container), badge)
  }

  function snapExamMarkers(body) {
    [...body.querySelectorAll('.exam-marker')].forEach(snapExamMarker)
  }

  function renderExamMarkers(point, row) {
    if (!row) return
    const body = row.querySelector('.source-content')
    if (body.querySelector('.exam-marker')) {
      body.querySelectorAll('.exam-marker').forEach(node => {
        const ids = (node.dataset.examQuestionIds || '').split(',').filter(id => data.questions[id])
        setExamMarkerDetails(node, node.dataset.examType, ids)
        node.draggable = row.classList.contains('editing')
      })
      snapExamMarkers(body)
      return
    }
    const lines = body.querySelectorAll('.source-line')
    const inserted = new Map()
    for (const marker of point.examMarkers || []) {
      const ids = marker.questionIds.filter(id => point.questionIds.includes(id) && data.questions[id])
      if (!ids.length) continue
      let line = lines[marker.line]
      if (marker.after && (!line || !markerPlainText(line).includes(marker.after))) {
        line = [...lines].find(candidate => markerPlainText(candidate).includes(marker.after))
      }
      if (!line) continue
      const badge = document.createElement('button')
      badge.type = 'button'
      badge.className = 'exam-marker'
      badge.dataset.examType = marker.type
      badge.dataset.examQuestionIds = ids.join(',')
      badge.textContent = marker.type
      badge.title = `${marker.type}题：${ids.map(id => relatedQuestionLabel(data.questions[id])).join('、')}；点击定位右栏题目`
      badge.setAttribute('aria-label', badge.title)
      badge.contentEditable = 'false'
      const key = `${marker.line}\0${marker.after}`
      if (inserted.has(key)) {
        inserted.get(key).after(badge)
        inserted.set(key, badge)
        continue
      }
      let container = line
      if (marker.after) {
        const cell = [...line.querySelectorAll('td,th')]
          .find(candidate => markerPlainText(candidate).includes(marker.after))
        if (cell) container = cell
      }
      const text = markerPlainText(container)
      const index = marker.after ? text.indexOf(marker.after) : text.length
      if (index < 0) continue
      const start = index + (marker.after?.length || 0)
      putMarkerAtTextOffset(container, markerSentenceEnd(text, start, container), badge)
      inserted.set(key, badge)
    }
  }

  function highlightExamMarker(badge) {
    const row = badge.closest('.point')
    const wasActive = badge.classList.contains('exam-marker-active')
    row.querySelectorAll('.exam-marker-active,.exam-mark-active')
      .forEach(node => node.classList.remove('exam-marker-active', 'exam-mark-active'))
    if (wasActive) return
    badge.classList.add('exam-marker-active')
    const ids = new Set(badge.dataset.examQuestionIds.split(','))
    const entries = [...row.querySelectorAll('.question-entry')]
      .filter(entry => ids.has(entry.querySelector('.question-link')?.dataset.question))
    entries.forEach(entry => entry.classList.add('exam-mark-active'))
    const scroll = row.querySelector('.question-scroll')
    if (entries.length && scroll) {
      const target = entries[0].getBoundingClientRect()
      const viewport = scroll.getBoundingClientRect()
      if (target.bottom > viewport.bottom || target.top < viewport.top) {
        setQuestionLinksExpanded(row.querySelector('.question-links'), true)
        entries[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }

  function renderQuestionLinks(point, draft = null) {
    const ids = draft ? draft.questionIds : point.questionIds
    const compareQuestions = (left, right) => {
      const a = data.questions[left].label
      const b = data.questions[right].label
      if (data.questions[left].sourceType === '真题') {
        const yearA = Number(a.match(/\d{4}/)?.[0] || 0)
        const yearB = Number(b.match(/\d{4}/)?.[0] || 0)
        if (yearA !== yearB) return yearA - yearB
      } else {
        const publisher = label => ['肖', '徐', '腿', '米', '新东方', '苏一', '余峰']
          .findIndex(name => label.startsWith(name))
        const publisherA = publisher(a), publisherB = publisher(b)
        if (publisherA !== publisherB) return publisherA - publisherB
        const setA = Number(a.match(/\d+/)?.[0] || 0)
        const setB = Number(b.match(/\d+/)?.[0] || 0)
        if (setA !== setB) return setA - setB
      }
      const numA = Number(a.match(/[-－](\d+)$/)?.[1] || 0)
      const numB = Number(b.match(/[-－](\d+)$/)?.[1] || 0)
      return numA - numB || a.localeCompare(b, 'zh-CN')
    }
    const groups = ['真题', '模拟题'].map(source => {
      const entries = ids.filter(id => data.questions[id]?.sourceType === source)
        .sort(compareQuestions)
        .map(id => {
          const label = escapeHTML(relatedQuestionLabel(data.questions[id]))
          return `<div class="question-entry">
          <button type="button" class="question-link" data-question="${escapeHTML(id)}"
            aria-label="查看 ${label} 原题">${label}</button>
          <button type="button" class="question-remove-link" data-card-id="${escapeHTML(point.id)}"
            data-remove-question="${escapeHTML(id)}" aria-label="移除 ${label} 的关联">移除</button>
        </div>`
        }).join('')
      return entries
        ? `<div class="question-source" data-source="${source}">
        <span class="source-tag ${source === '真题' ? 'true' : 'mock'}">${source}</span>
        <div class="question-grid">${entries}</div></div>`
        : ''
    }).join('')
    return `<span class="question-sidebar-title">关联题目 · ${ids.length}</span>
      <div class="question-scroll">${groups || '<span class="no-links">暂无关联题目</span>'}</div>
      <button type="button" class="question-expand" aria-label="展开全部关联题目"
        title="展开全部关联题目" aria-expanded="false" hidden>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="m5 9 7 7 7-7" />
        </svg>
      </button>
      <div class="link-editor"><input type="text" data-card-id="${escapeHTML(point.id)}"
        aria-label="粘贴网页内题目引用或输入题号" placeholder="粘贴题目引用或输入题号">
        <button type="button" data-add-question="${escapeHTML(point.id)}">添加题目</button></div>
      <button type="button" class="edit-card" data-edit-id="${escapeHTML(point.id)}">${draft ? '正在培养' : '培养小豆芽'}</button>`
  }

  function refreshLinks(point, row) {
    const container = row.querySelector('.question-links')
    container.classList.remove('questions-expanded')
    container.innerHTML = renderQuestionLinks(point, cardDrafts.get(point.id))
    scheduleQuestionExpanders()
    row.dataset.sources = point.sources.join('|')
    row.dataset.labels = `|${point.questionIds.flatMap(id => [data.questions[id].label,
      data.questions[id].displayLabel || data.questions[id].label,
      relatedQuestionLabel(data.questions[id])]).join('|')}|`
    row.dataset.search = [point.prompt,
      point.text,
      point.theme,
      point.part,
      ...point.sources,
      ...point.questionIds.flatMap(id => [data.questions[id].label,
        relatedQuestionLabel(data.questions[id])])].join(' ').toLowerCase()
  }

  window.addEventListener('beforeunload', event => {
    if (cardDrafts.size
      || document.getElementById('dialog').classList.contains('editing')) {
      event.preventDefault(); event.returnValue = ''
    }
  })

  /* ---------------- 可视化知识卡编辑 ---------------- */
  const cardDrafts = new Map()
  const pendingNewCards = new Set()
  // 初始化时一次收集卡片节点，避免逐张扫描整个文档。
  subjects.querySelectorAll('.point > .card-editor').forEach(editor => {
    renderExamMarkers(knowledgeById.get(editor.dataset.editorId), editor.closest('.point'))
  })

  const examMarkerEditor = document.createElement('div')
  examMarkerEditor.className = 'exam-marker-editor'
  examMarkerEditor.hidden = true
  examMarkerEditor.innerHTML = `
    <strong>编辑题型标记</strong>
    <label><span>题型</span><select data-marker-type>
      <option>真</option><option>肖</option><option>徐</option><option>腿</option><option>米</option><option>新</option>
    </select></label>
    <label><span>对应题号</span><input data-marker-questions type="text" placeholder="如 2021-1,徐十3-1"></label>
    <div class="marker-actions">
      <button type="button" data-marker-apply>应用修改</button>
      <button type="button" data-marker-move>移到光标</button>
      <button type="button" data-marker-delete>删除标记</button>
      <button type="button" data-marker-close>收起</button>
    </div>
    <small>可直接拖动圆标；也可先点正文中的目标位置，再点「移到光标」。题号用英文逗号分隔。</small>`
  document.body.append(examMarkerEditor)
  let selectedExamMarker = null
  let draggedExamMarker = null
  let lastCardCaret = null

  function setExamMarkerDetails(badge, type, ids) {
    badge.dataset.examType = type
    badge.dataset.examQuestionIds = ids.join(',')
    badge.textContent = type
    badge.title = `${type}题：${ids.map(id => relatedQuestionLabel(data.questions[id])).join('、')}；点击定位右栏题目`
    badge.setAttribute('aria-label', badge.title)
    badge.contentEditable = 'false'
    badge.type = 'button'
  }

  function closeExamMarkerEditor() {
    selectedExamMarker?.classList.remove('marker-selected')
    selectedExamMarker = null
    examMarkerEditor.hidden = true
  }

  function editExamMarker(badge) {
    selectedExamMarker?.classList.remove('marker-selected')
    selectedExamMarker = badge
    badge.classList.add('marker-selected')
    const ids = badge.dataset.examQuestionIds.split(',').filter(Boolean)
    examMarkerEditor.querySelector('[data-marker-type]').value = badge.dataset.examType
    examMarkerEditor.querySelector('[data-marker-questions]').value
      = ids.map(id => data.questions[id]?.label || id).join(',')
    examMarkerEditor.hidden = false
    const rect = badge.getBoundingClientRect()
    const width = examMarkerEditor.offsetWidth
    const height = examMarkerEditor.offsetHeight
    examMarkerEditor.style.left = `${Math.max(10, Math.min(innerWidth - width - 10, rect.left))}px`
    examMarkerEditor.style.top = `${rect.bottom + height + 10 < innerHeight
      ? rect.bottom + 7
      : Math.max(10, rect.top - height - 7)}px`
  }

  function rememberCardCaret() {
    const selection = window.getSelection()
    if (!selection.rangeCount) return
    const range = selection.getRangeAt(0).cloneRange()
    const body = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
      ? range.commonAncestorContainer.closest('.point.editing .source-content')
      : range.commonAncestorContainer.parentElement?.closest('.point.editing .source-content')
    if (!body || range.commonAncestorContainer.parentElement?.closest('.exam-marker')) return
    range.collapse(false)
    lastCardCaret = { body, range }
  }

  function moveMarkerToCaret(badge) {
    const body = badge.closest('.source-content')
    if (!lastCardCaret || lastCardCaret.body !== body
      || !body.contains(lastCardCaret.range.startContainer)) {
      toast('请先点击这张卡片正文中的目标位置'); return false
    }
    const range = lastCardCaret.range.cloneRange()
    range.collapse(true)
    range.insertNode(badge)
    snapExamMarker(badge)
    range.setStartAfter(badge)
    range.collapse(true)
    lastCardCaret = { body, range }
    return true
  }

  examMarkerEditor.addEventListener('click', event => {
    if (event.target.closest('[data-marker-close]')) {
      closeExamMarkerEditor(); return
    }
    const badge = selectedExamMarker
    if (!badge || !badge.closest('.point.editing')) return
    if (event.target.closest('[data-marker-delete]')) {
      recordCardEdit(badge.closest('.point'), 'marker', true)
      badge.remove(); closeExamMarkerEditor(); return
    }
    if (event.target.closest('[data-marker-move]')) {
      recordCardEdit(badge.closest('.point'), 'marker', true)
      if (moveMarkerToCaret(badge)) closeExamMarkerEditor()
      return
    }
    if (event.target.closest('[data-marker-apply]')) {
      const row = badge.closest('.point')
      const point = knowledgeById.get(row.querySelector('.card-editor').dataset.editorId)
      const allowed = cardDrafts.get(point.id)?.questionIds || point.questionIds
      const labels = examMarkerEditor.querySelector('[data-marker-questions]').value
        .split(/[,，\n]+/).map(value => value.trim()).filter(Boolean)
      const ids = labels.map(label => allowed.find(id =>
        id === label || data.questions[id]?.label === label
        || data.questions[id]?.displayLabel === label
        || (data.questions[id] && relatedQuestionLabel(data.questions[id]) === label)))
      if (!ids.length || ids.includes(undefined)) {
        toast('请填写右栏已有的题号，多个题号用逗号分隔'); return
      }
      const type = examMarkerEditor.querySelector('[data-marker-type]').value
      recordCardEdit(row, 'marker', true)
      setExamMarkerDetails(badge, type, [...new Set(ids)])
      closeExamMarkerEditor()
    }
  })

  subjects.addEventListener('dragstart', event => {
    const badge = event.target.closest('.point.editing .exam-marker')
    if (!badge) return
    draggedExamMarker = badge
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', badge.textContent)
  })
  subjects.addEventListener('dragover', event => {
    if (draggedExamMarker && event.target.closest('.source-content')
      === draggedExamMarker.closest('.source-content')) event.preventDefault()
  })
  subjects.addEventListener('drop', event => {
    const badge = draggedExamMarker
    if (!badge) return
    const body = badge.closest('.source-content')
    if (event.target.closest('.source-content') !== body) return
    event.preventDefault()
    recordCardEdit(body.closest('.point'), 'marker', true)
    const otherBadge = event.target.closest('.exam-marker')
    if (otherBadge && otherBadge !== badge) {
      otherBadge.after(badge); snapExamMarker(badge); return
    }
    const range = document.caretRangeFromPoint?.(event.clientX, event.clientY)
    if (!range || !body.contains(range.startContainer)
      || range.startContainer.parentElement?.closest('.exam-marker')) return
    range.collapse(true)
    range.insertNode(badge)
    snapExamMarker(badge)
    closeExamMarkerEditor()
  })
  subjects.addEventListener('dragend', () => {
    draggedExamMarker = null
  })

  function addExamMarker(id) {
    const row = cardRow(id), draft = cardDrafts.get(id)
    if (!row || !draft || !draft.questionIds.length) {
      toast('请先在右栏关联一道题目'); return
    }
    const body = row.querySelector('.source-content')
    const existing = new Set([...body.querySelectorAll('.exam-marker')]
      .flatMap(node => node.dataset.examQuestionIds.split(',')))
    const qid = draft.questionIds.find(value => !existing.has(value)) || draft.questionIds[0]
    const question = data.questions[qid]
    const type = question.sourceType === '真题'
      ? '真'
      : ['肖', '徐', '腿', '米'].find(value => question.label.startsWith(value)) || '肖'
    const badge = document.createElement('button')
    badge.className = 'exam-marker'
    badge.draggable = true
    setExamMarkerDetails(badge, type, [qid])
    recordCardEdit(row, 'marker', true);
    (body.querySelector('.source-line:last-of-type') || body).append(badge)
    if (lastCardCaret?.body === body) moveMarkerToCaret(badge)
    editExamMarker(badge)
  }

  function rememberEdit(type, id, value) {
    try {
      if (!localEdits.points) localEdits.points = {}
      if (!localEdits.questions) localEdits.questions = {}
      localEdits[type === 'card' ? 'points' : 'questions'][id] = type === 'card'
        ? { prompt: value.prompt,
            text: value.text,
            sourceHtml: value.sourceHtml,
            raw: value.raw,
            questionIds: value.questionIds,
            citedQuestionIds: value.citedQuestionIds,
            sources: value.sources,
            examMarkers: value.examMarkers,
            knowledgeObscured: Boolean(value.knowledgeObscured),
            editedAt: value.editedAt }
        : { kind: value.kind,
            stem: value.stem,
            options: value.options,
            answer: value.answer,
            answerText: value.answerText,
            explanation: value.explanation,
            editedAt: value.editedAt }
      localStorage.setItem(LOCAL_KEY, JSON.stringify(localEdits))
      return true
    } catch (_) {
      toast('浏览器临时保存不可用，当前修改将在关闭页面后丢失')
      return false
    }
  }

  function emptyCardText(value) {
    return !String(value || '').replace(/[\u200b-\u200d\ufeff]/g, '').trim()
  }

  function pruneEmptyCardLists(body) {
    body.querySelectorAll('.source-list').forEach(list => {
      if (!emptyCardText(list.textContent)
        || list.querySelector('img,button,.inline-question-ref')) return
      const line = list.closest('.source-line')
      if (line && emptyCardText(line.textContent)
        && !line.querySelector('img,button,table,.knowledge-table-wrap,.inline-question-ref'))
        line.remove()
      else list.remove()
    })
  }

  function normalizeCardFormatting(body) {
    body.querySelectorAll('.source-fill').forEach(mark => {
      const visual = getComputedStyle(mark)
      const span = document.createElement('span')
      span.style.backgroundColor = visual.backgroundColor
      span.style.color = visual.color
      span.style.fontWeight = visual.fontWeight
      while (mark.firstChild) span.append(mark.firstChild)
      mark.replaceWith(span)
    })
    body.querySelectorAll('.source-bold').forEach(node => {
      node.style.fontWeight = getComputedStyle(node).fontWeight
      node.classList.remove('source-bold')
    })
    pruneEmptyCardLists(body)
  }

  function splitCardLineBreaks(body) {
    body.querySelectorAll('.source-line').forEach(line => {
      if (line.querySelector('table,.knowledge-table-wrap')) return
      while (true) {
        const br = line.querySelector('br')
        if (!br) break
        const before = document.createRange()
        before.setStart(line, 0)
        before.setEndBefore(br)
        const contents = before.extractContents()
        br.remove()
        const separateLine = line.cloneNode(false)
        separateLine.append(contents)
        if (!separateLine.textContent.trim()
          && !separateLine.querySelector('img,button,.inline-question-ref'))
          separateLine.append(document.createElement('br'))
        line.before(separateLine)
      }
      if (!line.textContent.trim()
        && !line.querySelector('img,button,.inline-question-ref')) line.remove()
    })
  }

  function editorNodePath(root, node) {
    const path = []
    while (node && node !== root) {
      const parent = node.parentNode
      if (!parent) return null
      path.unshift(Array.prototype.indexOf.call(parent.childNodes, node))
      node = parent
    }
    return node === root ? path : null
  }

  function editorNodeAt(root, path) {
    let node = root
    for (const index of path || []) {
      if (!node?.childNodes) return root
      node = node.childNodes[index]
    }
    return node || root
  }

  function cardEditSnapshot(row) {
    const title = row.querySelector('.prompt')
    const body = row.querySelector('.source-content')
    const draft = cardDrafts.get(row.querySelector('.card-editor').dataset.editorId)
    const selection = window.getSelection()
    let caret = null
    if (selection.rangeCount) {
      const range = selection.getRangeAt(0)
      const area = body.contains(range.startContainer) && body.contains(range.endContainer)
        ? 'body'
        : title.contains(range.startContainer) && title.contains(range.endContainer)
          ? 'title'
          : null
      if (area) {
        const root = area === 'body' ? body : title
        caret = { area,
          start: editorNodePath(root, range.startContainer),
          startOffset: range.startOffset,
          end: editorNodePath(root, range.endContainer),
          endOffset: range.endOffset }
      }
    }
    return { title: title.innerHTML,
      body: body.innerHTML,
      questionIds: [...draft.questionIds],
      citedIds: [...draft.citedIds],
      caret }
  }

  function restoreCardEdit(row, snapshot) {
    const title = row.querySelector('.prompt')
    const body = row.querySelector('.source-content')
    const id = row.querySelector('.card-editor').dataset.editorId
    const draft = cardDrafts.get(id)
    title.innerHTML = snapshot.title
    body.innerHTML = snapshot.body
    draft.questionIds = [...snapshot.questionIds]
    draft.citedIds = [...snapshot.citedIds]
    body.querySelectorAll('.exam-marker').forEach(node => {
      node.draggable = true
    })
    refreshLinks(knowledgeById.get(id), row)
    selectionToolbar.hidden = true
    cardSelection = null
    lastCardCaret = null
    closeExamMarkerEditor()
    const area = snapshot.caret?.area === 'title' ? title : body
    area.focus()
    const range = document.createRange()
    const start = editorNodeAt(area, snapshot.caret?.start)
    const end = editorNodeAt(area, snapshot.caret?.end)
    const maxOffset = node => node.nodeType === Node.TEXT_NODE
      ? node.nodeValue.length
      : node.childNodes.length
    if (!snapshot.caret) {
      range.selectNodeContents(area); range.collapse(false)
    } else try {
      range.setStart(start, Math.min(snapshot.caret.startOffset, maxOffset(start)))
      range.setEnd(end, Math.min(snapshot.caret.endOffset, maxOffset(end)))
    } catch (_) {
      range.selectNodeContents(area); range.collapse(false)
    }
    const selection = window.getSelection()
    selection.removeAllRanges(); selection.addRange(range)
  }

  function recordCardEdit(row, kind, force = false) {
    const draft = cardDrafts.get(row?.querySelector('.card-editor')?.dataset.editorId)
    if (!draft?.history) return
    const history = draft.history
    const now = performance.now()
    if (force || history.kind !== kind || now - history.at > 750) {
      history.undo.push(cardEditSnapshot(row))
      if (history.undo.length > 100) history.undo.shift()
    }
    history.redo.length = 0
    history.kind = kind
    history.at = now
  }

  function stepCardHistory(row, redo = false) {
    const draft = cardDrafts.get(row?.querySelector('.card-editor')?.dataset.editorId)
    if (!draft?.history) return
    const from = redo ? draft.history.redo : draft.history.undo
    const to = redo ? draft.history.undo : draft.history.redo
    if (!from.length) return
    to.push(cardEditSnapshot(row))
    restoreCardEdit(row, from.pop())
    draft.history.kind = null
  }

  function beginEdit(id) {
    const row = cardRow(id)
    if (row.classList.contains('editing')) return
    const title = row.querySelector('.prompt'), body = row.querySelector('.source-content')
    const point = knowledgeById.get(id)
    cardDrafts.set(id, { title: title.textContent,
      body: body.innerHTML,
      questionIds: [...point.questionIds],
      citedIds: [...(point.citedQuestionIds || [])],
      history: { undo: [], redo: [], kind: null, at: 0 } })
    normalizeCardFormatting(body)
    splitCardLineBreaks(body)
    row.classList.add('editing')
    row.querySelectorAll('.exam-marker').forEach(node => {
      node.draggable = true
    })
    title.contentEditable = 'true'
    body.contentEditable = 'true'
    row.querySelector('.card-editor').hidden = false
    refreshLinks(point, row)
    body.focus()
  }

  function createNewCardRow(point) {
    const row = document.createElement('article')
    row.className = `point${point.knowledgeObscured ? ' knowledge-obscured' : ''}`
    row.dataset.sources = ''
    row.dataset.labels = '||'
    row.dataset.search = `${point.prompt} ${point.theme} ${point.part}`.toLowerCase()
    row.innerHTML = `
      <div class="copy-area" data-point-id="${escapeHTML(point.id)}">
        <div class="point-card-head">
          ${renderCardActions(point)}
          <span class="source-index">${sourceIndexLabel(point)}</span>
          <span class="prompt">${escapeHTML(point.prompt)}</span>
        </div>
        <div class="point-card-body"><span class="knowledge source-content mn-content">${point.sourceHtml}</span></div>
      </div>
      <div class="question-links" aria-label="关联题目">${renderQuestionLinks(point)}</div>
      <div class="card-editor" data-editor-id="${escapeHTML(point.id)}" hidden>
        <p>左栏可直接编辑，⌘Z 回退、⌘⇧Z 重做；选中文字后可点“• 列表”；列表行按 Tab 缩进，按 Shift+Tab（或 ⌘Tab）退一级。题型圆标可拖动，也可点击修改或移动。</p>
        <div class="card-editor-actions">
          <button type="button" data-add-marker="${escapeHTML(point.id)}">新增题型圆标</button>
          <button type="button" class="card-save" data-save-id="${escapeHTML(point.id)}">保存本卡</button>
          <button type="button" class="card-cancel" data-cancel-id="${escapeHTML(point.id)}">取消</button>
          <button type="button" class="card-delete" data-delete-id="${escapeHTML(point.id)}">删除本卡</button>
        </div>
      </div>`
    return row
  }

  function insertCard(button) {
    if (cardDrafts.size) {
      toast('请先保存或取消正在编辑的知识卡'); return
    }
    const block = button.closest('.theme')
    const part = data.parts.find(item => item.name === block?.dataset.part)
    const theme = part?.themes[Number(block.dataset.themeIndex)]
    const afterId = button.dataset.insertAfter
    const afterPoint = afterId ? knowledgeById.get(afterId) : null
    if (!part || !theme || (afterId && !theme.points.includes(afterPoint))) {
      toast('未找到插入位置，请刷新页面后再试'); return
    }
    let id
    do {
      id = `U${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
    }
    while (knowledgeById.has(id))
    const point = { id,
      sourceIndex: 0,
      sourceCardId: '',
      part: part.name,
      theme: theme.name,
      prompt: '新知识卡',
      text: '',
      sourceHtml: '<div class="source-line"><br></div>',
      raw: '',
      questionIds: [],
      recurrence: false,
      sources: [],
      examMarkers: [],
      citedQuestionIds: [],
      isUserAdded: true,
      editedAt: 0 }
    const index = afterPoint ? theme.points.indexOf(afterPoint) + 1 : 0
    const nextPoint = theme.points[index]
    const allIndex = nextPoint
      ? allPoints.indexOf(nextPoint)
      : afterPoint ? allPoints.indexOf(afterPoint) + 1 : allPoints.length
    theme.points.splice(index, 0, point)
    allPoints.splice(allIndex, 0, point)
    knowledgeById.set(id, point)
    pendingNewCards.add(id)
    part.pointCount += 1
    data.mergedPointCount = allPoints.length
    const row = createNewCardRow(point)
    button.closest('.card-insert-slot').after(row, createInsertSlot(id))
    beginEdit(id)
    applyFilters()
    row.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const title = row.querySelector('.prompt')
    title.focus()
    const range = document.createRange()
    range.selectNodeContents(title)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
  }

  function finishEdit(id) {
    const row = cardRow(id)
    selectionToolbar.hidden = true
    closeExamMarkerEditor()
    lastCardCaret = null
    row.querySelectorAll('.exam-marker').forEach(node => {
      node.draggable = false
    })
    row.classList.remove('editing')
    row.querySelector('.prompt').contentEditable = 'false'
    row.querySelector('.source-content').contentEditable = 'false'
    row.querySelector('.card-editor').hidden = true
    cardDrafts.delete(id)
  }

  function cancelEdit(id) {
    if (pendingNewCards.has(id)) {
      removeCardFromPage(id)
      toast('已取消新增知识卡')
      return
    }
    const row = cardRow(id), draft = cardDrafts.get(id)
    if (draft) {
      row.querySelector('.prompt').textContent = draft.title
      row.querySelector('.source-content').innerHTML = draft.body
    }
    finishEdit(id)
    refreshLinks(knowledgeById.get(id), row)
    renderExamMarkers(knowledgeById.get(id), row)
  }

  function removeCardFromPage(id) {
    const point = knowledgeById.get(id)
    const row = cardRow(id)
    if (!point || !row) return
    const part = data.parts.find(item => item.name === point.part)
    const theme = part?.themes.find(item => item.name === point.theme && item.points.includes(point))
    if (!part || !theme) {
      toast('未找到知识卡所在专题，删除失败'); return
    }
    if (cardDrafts.has(id)) finishEdit(id)
    pendingNewCards.delete(id)
    theme.points.splice(theme.points.indexOf(point), 1)
    allPoints.splice(allPoints.indexOf(point), 1)
    knowledgeById.delete(id)
    for (const [from, to] of Object.entries(data.duplicateRedirects || {})) {
      if (from === id || to === id) delete data.duplicateRedirects[from]
    }
    if (localEdits.points) delete localEdits.points[id]
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(localEdits))
    } catch (_) {}
    if (row.nextElementSibling?.classList.contains('card-insert-slot'))
      row.nextElementSibling.remove()
    row.remove()
    part.pointCount = part.themes.reduce((sum, item) => sum + item.points.length, 0)
    theme.questionCount = new Set(theme.points.flatMap(item => item.questionIds)).size
    part.questionCount = new Set(part.themes.flatMap(item =>
      item.points.flatMap(card => card.questionIds))).size
    data.mergedPointCount = allPoints.length

    rebuildPointByQuestion()
    applyFilters()
    renderSheet()
  }

  function deleteCard(id) {
    const point = knowledgeById.get(id)
    if (!point || !cardDrafts.has(id)) return
    if (pendingNewCards.has(id)) {
      removeCardFromPage(id)
      toast('已取消新增知识卡')
      return
    }
    if (!window.confirm(`确定从当前页面删除知识卡“${point.prompt}”吗？`)) return
    removeCardFromPage(id)
    toast('知识卡已从当前页面删除', true)
  }

  function addCardQuestion(id) {
    const draft = cardDrafts.get(id), row = cardRow(id)
    if (!draft || !row) return
    const input = row.querySelector('.link-editor input')
    const value = input.value.trim()
    const match = value.match(/^\[(?:Question|Card)#ID\/([^#\]]+)#/)
      || value.match(/^([^\s]+)$/)
    const key = match?.[1]
    const qid = data.questions[key]
      ? key
      : rootToQuestion.get(key)
        || Object.keys(data.questions).find(candidate => data.questions[candidate].label === key)
    if (!qid) {
      toast('未找到该题目，请粘贴网页内题目引用或输入题号'); return
    }
    recordCardEdit(row, 'link', true)
    if (!draft.questionIds.includes(qid)) draft.questionIds.push(qid)
    if (!draft.citedIds.includes(qid)) draft.citedIds.push(qid)
    refreshLinks(knowledgeById.get(id), row)
    toast('题目已加入右栏，保存本卡后套卷检索会变灰色')
  }

  function removeCardQuestion(id, qid) {
    const draft = cardDrafts.get(id), row = cardRow(id)
    if (!draft || !row) return
    recordCardEdit(row, 'link', true)
    draft.questionIds = draft.questionIds.filter(value => value !== qid)
    draft.citedIds = draft.citedIds.filter(value => value !== qid)
    row.querySelectorAll('.source-content .inline-question-ref').forEach(node => {
      if (node.dataset.question === qid) node.remove()
    })
    row.querySelectorAll('.source-content .exam-marker').forEach(node => {
      const ids = node.dataset.examQuestionIds.split(',').filter(value => value && value !== qid)
      if (ids.length) setExamMarkerDetails(node, node.dataset.examType, ids)
      else {
        if (node === selectedExamMarker) closeExamMarkerEditor(); node.remove()
      }
    })
    refreshLinks(knowledgeById.get(id), row)
  }

  const selectionToolbar = document.getElementById('selection-toolbar')
  let cardSelection = null
  let selectedCardBody = null
  let applyingCardFormat = false
  function showSelectionToolbar() {
    const selection = window.getSelection()
    if (!selection.rangeCount || selection.isCollapsed) {
      selectionToolbar.hidden = true; return
    }
    const range = selection.getRangeAt(0)
    const body = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
      ? range.commonAncestorContainer.closest('.point.editing .source-content')
      : range.commonAncestorContainer.parentElement?.closest('.point.editing .source-content')
    if (!body || !body.contains(range.startContainer) || !body.contains(range.endContainer)) {
      selectionToolbar.hidden = true; return
    }
    cardSelection = range.cloneRange()
    selectedCardBody = body
    selectionToolbar.hidden = false
    const rect = range.getBoundingClientRect()
    const width = selectionToolbar.offsetWidth
    const height = selectionToolbar.offsetHeight
    selectionToolbar.style.left = `${Math.max(10, Math.min(window.innerWidth - width - 10,
      rect.left + rect.width / 2 - width / 2))}px`
    selectionToolbar.style.top = `${rect.top > height + 14
      ? rect.top - height - 8
      : Math.min(window.innerHeight - height - 10, rect.bottom + 8)}px`
  }
  subjects.addEventListener('mouseup', event => {
    if (event.target.closest('.point.editing .source-content')) {
      if (!event.target.closest('.exam-marker')) rememberCardCaret()
      showSelectionToolbar()
    }
  })
  subjects.addEventListener('keyup', event => {
    if (event.target.closest('.point.editing .source-content')) {
      rememberCardCaret()
      showSelectionToolbar()
    }
  })
  selectionToolbar.addEventListener('mousedown', event => {
    if (event.target.closest('[data-format-command]')) event.preventDefault()
  })
  selectionToolbar.addEventListener('click', event => {
    const button = event.target.closest('[data-format-command]')
    if (button) formatCardSelection(button)
  })
  document.addEventListener('mousedown', event => {
    if (!selectionToolbar.contains(event.target)
      && !event.target.closest('.point.editing .source-content')) selectionToolbar.hidden = true
  })
  function toggleCardUnorderedList(body, range) {
    const lines = [...body.querySelectorAll('.source-line')].filter(line =>
      range.intersectsNode(line) && !line.querySelector('table,.knowledge-table-wrap')
      && (line.textContent.trim() || line.querySelector('img,button')))
    if (!lines.length) return false
    recordCardEdit(body.closest('.point'), 'list', true)
    const bullet = line => [...line.children].find(node => node.classList.contains('source-list'))
    const remove = lines.every(line => bullet(line))
    for (const line of lines) {
      const existing = bullet(line)
      if (remove && existing) existing.replaceWith(...existing.childNodes)
      else if (!remove && !existing) {
        const list = document.createElement('span')
        list.className = 'source-list level-1'
        while (line.firstChild) list.append(line.firstChild)
        line.append(list)
      }
    }
    const caret = document.createRange()
    caret.selectNodeContents(lines[lines.length - 1])
    caret.collapse(false)
    const selection = window.getSelection()
    selection.removeAllRanges(); selection.addRange(caret)
    return true
  }

  function indentCardUnorderedList(event) {
    if (event.key !== 'Tab' || event.altKey || event.isComposing) return
    const body = event.target.closest('.point.editing .source-content')
    const selection = window.getSelection()
    if (!body || !selection.rangeCount) return
    const range = selection.getRangeAt(0)
    if (!body.contains(range.startContainer) || !body.contains(range.endContainer)) return
    const lines = [...body.querySelectorAll('.source-line')].filter(line =>
      (range.collapsed ? line.contains(range.startContainer) : range.intersectsNode(line))
      && [...line.children].some(child => child.classList.contains('source-list')))
    if (!lines.length) return
    event.preventDefault()
    const change = event.metaKey || event.ctrlKey || event.shiftKey ? -1 : 1
    const edits = lines.map(line => {
      const list = [...line.children].find(child => child.classList.contains('source-list'))
      const level = [1, 2, 3, 4].find(value => list.classList.contains(`level-${value}`)) || 1
      return { list, level, next: Math.max(1, Math.min(4, level + change)) }
    }).filter(item => item.level !== item.next)
    if (!edits.length) return
    recordCardEdit(body.closest('.point'), 'list-indent', true)
    edits.forEach(({ list, level, next }) => {
      list.classList.remove(`level-${level}`)
      list.classList.add(`level-${next}`)
    })
  }

  function formatCardSelection(button) {
    const body = selectedCardBody
    if (!body || !cardSelection || !body.contains(cardSelection.commonAncestorContainer)
      || cardSelection.collapsed) {
      toast('请先在左栏正文选中文字'); return
    }
    const command = button.dataset.formatCommand
    const color = button.dataset.formatColor || null
    const selection = window.getSelection()
    selection.removeAllRanges(); selection.addRange(cardSelection)
    if (command === 'unorderedList') {
      if (!toggleCardUnorderedList(body, cardSelection)) toast('请选择普通文字行添加无序列表')
      cardSelection = null; selectionToolbar.hidden = true; return
    }
    recordCardEdit(body.closest('.point'), 'format', true)
    if (command === 'removeFormat') {
      const range = cardSelection
      const start = range.startContainer.nodeType === Node.ELEMENT_NODE
        ? range.startContainer
        : range.startContainer.parentElement
      const styled = start?.closest('span[style]')
      const textNode = styled?.firstChild
      if (styled && body.contains(styled) && styled.childNodes.length === 1
        && textNode.nodeType === Node.TEXT_NODE
        && range.startContainer === textNode && range.endContainer === textNode) {
        const value = textNode.nodeValue
        const before = value.slice(0, range.startOffset)
        const selected = value.slice(range.startOffset, range.endOffset)
        const after = value.slice(range.endOffset)
        const replacement = document.createDocumentFragment()
        if (before) {
          const left = styled.cloneNode(false); left.textContent = before; replacement.append(left)
        }
        const plain = document.createTextNode(selected); replacement.append(plain)
        if (after) {
          const right = styled.cloneNode(false); right.textContent = after; replacement.append(right)
        }
        styled.replaceWith(replacement)
        const caret = document.createRange()
        caret.setStartAfter(plain); caret.collapse(true)
        selection.removeAllRanges(); selection.addRange(caret)
        cardSelection = null; selectionToolbar.hidden = true; return
      }
    }
    applyingCardFormat = true
    try {
      document.execCommand('styleWithCSS', false, command === 'foreColor' || command === 'hiliteColor')
      document.execCommand(command, false, color)
      if (command === 'hiliteColor' && color?.toLowerCase() === '#eaf1ff')
        document.execCommand('foreColor', false, '#1546c9')
    } finally {
      applyingCardFormat = false
    }
    if (selection.rangeCount) cardSelection = selection.getRangeAt(0).cloneRange()
    selectionToolbar.hidden = true
  }

  function citationNode(kind, key, label) {
    const id = kind === 'Card' ? rootToQuestion.get(key) : key
    if (!id || !data.questions[id]) return document.createTextNode(label)
    const span = document.createElement('span')
    span.className = 'inline-question-ref'
    span.dataset.question = id
    span.setAttribute('role', 'button')
    span.tabIndex = 0
    span.contentEditable = 'false'
    span.textContent = label || data.questions[id].label
    return span
  }

  function insertUnformattedCardLine(body, range) {
    const startElement = range.startContainer.nodeType === Node.ELEMENT_NODE
      ? range.startContainer
      : range.startContainer.parentElement
    const cell = startElement?.closest('td,th')
    const line = startElement?.closest('.source-line')
    const container = cell && body.contains(cell) ? cell : line
    if (!container || !body.contains(container)) return false
    const tail = range.cloneRange()
    tail.setEnd(container, container.childNodes.length)
    const trailing = tail.extractContents()
    const hasVisibleTrailing = Boolean(trailing.textContent
      || trailing.querySelector?.('br,img,button,.inline-question-ref'))
    const plainCaret = document.createTextNode('')
    if (cell && container === cell) {
      cell.append(document.createElement('br'), plainCaret, trailing)
      if (!hasVisibleTrailing) cell.append(document.createElement('br'))
    } else {
      const newLine = document.createElement('div')
      newLine.className = 'source-line'
      newLine.append(plainCaret, trailing)
      if (!hasVisibleTrailing) newLine.append(document.createElement('br'))
      line.after(newLine)
      if (line.querySelector('.source-list') && emptyCardText(line.textContent)
        && !line.querySelector('img,button,.inline-question-ref')) line.remove()
    }
    range.setStart(plainCaret, 0)
    range.collapse(true)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    return true
  }

  function removeEmptyCardList(body, range) {
    if (!range.collapsed) return false
    const startElement = range.startContainer.nodeType === Node.ELEMENT_NODE
      ? range.startContainer
      : range.startContainer.parentElement
    const line = startElement?.closest('.source-line')
    const list = startElement?.closest('.source-list')
      || (emptyCardText(line?.textContent) ? line?.querySelector('.source-list') : null)
    if (!list || !body.contains(list) || !emptyCardText(list.textContent)
      || list.querySelector('img,button,.inline-question-ref')) return false
    const wholeLine = line && [...line.childNodes].every(node => node === list
      || node.nodeType === Node.TEXT_NODE && emptyCardText(node.nodeValue)
      || node.nodeName === 'BR')
    if (!wholeLine) {
      const parent = list.parentNode
      const offset = Array.prototype.indexOf.call(parent.childNodes, list)
      list.remove()
      range.setStart(parent, Math.min(offset, parent.childNodes.length))
    } else {
      let previous = line.previousElementSibling
      while (previous && !previous.matches('.source-line')) previous = previous.previousElementSibling
      let next = line.nextElementSibling
      while (next && !next.matches('.source-line')) next = next.nextElementSibling
      if (previous) {
        line.remove()
        range.setStart(previous, previous.childNodes.length)
      } else if (next) {
        line.remove()
        range.setStart(next, 0)
      } else {
        line.replaceChildren(document.createElement('br'))
        range.setStart(line, 0)
      }
    }
    range.collapse(true)
    const selection = window.getSelection()
    selection.removeAllRanges(); selection.addRange(range)
    return true
  }

  subjects.addEventListener('keydown', event => {
    indentCardUnorderedList(event)
    if (!(event.metaKey || event.ctrlKey) || event.altKey) return
    const key = event.key.toLowerCase()
    if (key !== 'z' && key !== 'y') return
    const row = event.target.closest('.point.editing')
    if (!row || !event.target.closest('.prompt,.source-content')) return
    event.preventDefault()
    stepCardHistory(row, key === 'y' || event.shiftKey)
  })

  subjects.addEventListener('beforeinput', event => {
    const row = event.target.closest('.point.editing')
    if (!row || !event.target.closest('.prompt,.source-content')) return
    const inputType = event.inputType || ''
    if (inputType === 'historyUndo' || inputType === 'historyRedo') {
      event.preventDefault()
      stepCardHistory(row, inputType === 'historyRedo')
      return
    }
    const body = event.target.closest('.point.editing .source-content')
    if (!applyingCardFormat && inputType !== 'insertFromPaste'
      && (inputType.startsWith('insert') || inputType.startsWith('delete')
        || inputType.startsWith('format')))
      recordCardEdit(row, inputType === 'insertText' ? 'typing' : inputType, inputType !== 'insertText' && inputType !== 'deleteContentBackward')
    if (!body || event.isComposing) return
    const selection = window.getSelection()
    if (!selection.rangeCount) return
    const range = selection.getRangeAt(0)
    if (!body.contains(range.startContainer) || !body.contains(range.endContainer)) return
    if (['deleteContentBackward', 'deleteContentForward'].includes(inputType)
      && removeEmptyCardList(body, range)) {
      event.preventDefault(); return
    }
    if (!['insertParagraph', 'insertLineBreak'].includes(inputType)) return
    const startElement = range.startContainer.nodeType === Node.ELEMENT_NODE
      ? range.startContainer
      : range.startContainer.parentElement
    const endElement = range.endContainer.nodeType === Node.ELEMENT_NODE
      ? range.endContainer
      : range.endContainer.parentElement
    if (!startElement?.closest('.source-line,td,th')) return
    if (!range.collapsed && startElement.closest('.source-line')
      !== endElement?.closest('.source-line')) return
    if (!range.collapsed && startElement.closest('td,th')
      !== endElement?.closest('td,th')) return
    event.preventDefault()
    if (!range.collapsed) range.deleteContents()
    insertUnformattedCardLine(body, range)
  })

  subjects.addEventListener('paste', event => {
    const editable = event.target.closest('.point.editing [contenteditable=\'true\']')
    if (!editable) return
    event.preventDefault()
    recordCardEdit(editable.closest('.point'), 'paste', true)
    const value = event.clipboardData.getData('text/plain')
    const selection = window.getSelection()
    if (!selection.rangeCount) return
    const range = selection.getRangeAt(0)
    range.deleteContents()
    const fragment = document.createDocumentFragment()
    const appendText = text => {
      text.split('\n').forEach((line, index) => {
        if (index) fragment.append(document.createElement('br'))
        if (line) fragment.append(document.createTextNode(line))
      })
    }
    const pattern = /\[(Card|Question)#ID\/([^#\]]+)#([^\]]*)\]/g
    let start = 0
    for (const match of value.matchAll(pattern)) {
      appendText(value.slice(start, match.index))
      fragment.append(citationNode(match[1], match[2], match[3]))
      start = match.index + match[0].length
    }
    appendText(value.slice(start))
    const last = fragment.lastChild
    range.insertNode(fragment)
    if (last) {
      range.setStartAfter(last); range.collapse(true)
      selection.removeAllRanges(); selection.addRange(range)
    }
  })

  function cleanVisual(element, linkedIds = []) {
    const clone = element.cloneNode(true)
    const allowed = new Set(['DIV', 'SPAN', 'MARK', 'STRONG', 'B', 'EM', 'I', 'U', 'BR', 'IMG', 'BUTTON', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD'])
    const classes = new Set(['source-line',
      'source-spacer',
      'source-page',
      'source-list',
      'level-1',
      'level-2',
      'level-3',
      'level-4',
      'source-inline',
      'source-bold',
      'source-fill',
      'source-equation',
      'source-picture',
      'inline-question-ref',
      'mn-line',
      'mn-picture',
      'math-inline',
      'math-display',
      'math-text',
      'math-fraction',
      'math-numerator',
      'math-denominator',
      'math-array',
      'math-array-table',
      'math-array-row',
      'math-array-cell',
      'knowledge-table-wrap',
      'knowledge-table',
      'works-table',
      'history-table',
      'commodity-table',
      'labor-table',
      'productivity-table',
      'soviet-table',
      'revolution-table',
      'comparison-table',
      'wide-table',
      'exam-marker'])
    for (const node of [...clone.querySelectorAll('*')]) {
      if (!allowed.has(node.tagName)) {
        node.replaceWith(document.createTextNode(node.textContent))
        continue
      }
      const keepClasses = [...node.classList].filter(name => classes.has(name))
      const questionId = node.dataset.question
      const markerType = node.dataset.examType
      const markerIds = (node.dataset.examQuestionIds || '').split(',')
        .filter(id => linkedIds.includes(id) && data.questions[id])
      if (node.tagName === 'BUTTON' && (!node.classList.contains('exam-marker')
        || !['真', '肖', '徐', '腿', '米'].includes(markerType) || !markerIds.length)) {
        node.remove(); continue
      }
      const style = node.getAttribute('style') || ''
      const color = style.match(/(?:^|;)\s*color:\s*(#[0-9a-fA-F]{3,6}|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\))/i)
      const highlight = style.match(/(?:^|;)\s*background-color:\s*(#[0-9a-fA-F]{3,6}|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\))/i)
      const weight = style.match(/(?:^|;)\s*font-weight:\s*(\d{3}|bold|normal)/i)
      const image = node.tagName === 'IMG' ? node.getAttribute('src') : null
      for (const attr of [...node.attributes]) node.removeAttribute(attr.name)
      if (keepClasses.length) node.className = keepClasses.join(' ')
      if (color) node.style.color = color[1]
      if (highlight) node.style.backgroundColor = highlight[1]
      if (weight) node.style.fontWeight = weight[1]
      if (node.classList.contains('exam-marker')) {
        node.type = 'button'
        node.dataset.examType = markerType
        node.dataset.examQuestionIds = markerIds.join(',')
        node.textContent = markerType
        node.contentEditable = 'false'
      }
      if (node.classList.contains('inline-question-ref') && data.questions[questionId]) {
        node.dataset.question = questionId
        node.setAttribute('role', 'button')
        node.tabIndex = 0
        node.contentEditable = 'false'
      }
      if (node.tagName === 'IMG') {
        if (image?.startsWith('data:image/png;base64,')) {
          node.src = image; node.alt = '原知识卡插图'
        } else node.remove()
      }
    }
    return clone
  }

  function saveCard(id) {
    const row = cardRow(id), point = knowledgeById.get(id)
    const title = row.querySelector('.prompt').textContent.trim()
    const draft = cardDrafts.get(id)
    snapExamMarkers(row.querySelector('.source-content'))
    pruneEmptyCardLists(row.querySelector('.source-content'))
    const body = cleanVisual(row.querySelector('.source-content'), draft?.questionIds || point.questionIds)
    const cleanText = body.cloneNode(true)
    cleanText.querySelectorAll('.exam-marker').forEach(node => node.remove())
    if (!title || (!cleanText.textContent.trim() && !cleanText.querySelector('img'))) {
      toast('请填写知识卡标题和正文'); return
    }
    const newIds = [...body.querySelectorAll('.inline-question-ref[data-question]')]
      .map(node => node.dataset.question).filter(qid => data.questions[qid])
    point.prompt = title
    point.sourceHtml = body.innerHTML
    point.examMarkers = []
    point.text = cleanText.textContent.trim()
    point.questionIds = [...new Set([...(draft?.questionIds || point.questionIds), ...newIds])]
    point.citedQuestionIds = [...new Set([...(draft?.citedIds || point.citedQuestionIds || []), ...newIds])]
    point.sources = [...new Set(point.questionIds.map(qid => data.questions[qid].sourceType))]
    const plain = cleanText.cloneNode(true)
    plain.querySelectorAll('.inline-question-ref[data-question]').forEach(node => {
      node.replaceWith(document.createTextNode(questionReference(node.dataset.question)))
    })
    point.raw = `[P#H1#${markjiSafe(title)}]\n${plain.textContent}`
    point.editedAt = Date.now()
    row.querySelector('.source-content').innerHTML = point.sourceHtml
    pendingNewCards.delete(id)
    finishEdit(id)
    refreshLinks(point, row)
    renderExamMarkers(point, row)
    rebuildPointByQuestion()
    const backedUp = rememberEdit('card', id, point)
    applyFilters(); renderSheet()
    toast(backedUp
      ? '知识卡已临时保存在本机浏览器'
      : '知识卡已更新，但浏览器临时保存失败')
  }

  /* ---------------- 答题卡 ---------------- */
  const pointByQuestion = new Map()
  function rebuildPointByQuestion() {
    pointByQuestion.clear()
    allPoints.forEach(point => point.questionIds.forEach(qid => {
      if (!pointByQuestion.has(qid)) pointByQuestion.set(qid, [])
      pointByQuestion.get(qid).push(point)
    }))
  }
  rebuildPointByQuestion()

  const FAMILY_ORDER = ['真题', '腿八', '徐十', '米六', '新东方', '苏一', '余峰', '肖190多选', '肖190单选']
  const FAMILY_NAME = {
    真题: '历年真题',
    腿八: '腿姐八套卷',
    徐十: '徐涛十套卷',
    米六: '米鹏六套卷',
    新东方: '新东方五套卷',
    苏一: '苏一六套卷',
    余峰: '余峰六套卷',
    肖190多选: '肖秀荣190题·多选',
    肖190单选: '肖秀荣190题·单选',
  }

  function paperInfo(question) {
    const match = String(question.label).match(/^(.*?)[-－](\d+)$/)
    if (!match) return null
    const prefix = match[1]
    const num = Number(match[2])
    if (question.sourceType === '真题') {
      const ym = prefix.match(/^(理|文|文、理)?(\d{4})$/)
      const year = ym ? Number(ym[2]) : 0
      const track = ym && ym[1] ? ym[1] : ''
      return {
        family: '真题',
        key: `${year}|${track}`,
        num,
        order: year * 10 + (track === '理' ? 1 : track === '文' ? 2 : 0),
        label: year
          ? `${year} 年${track ? `（${track === '文、理' ? '文理通用' : track + '科'}）` : ''}`
          : prefix,
      }
    }
    const mock = prefix.match(/^(腿八|徐十|米六|新东方|苏一|余峰)(\d+)$/)
    if (mock) return {
      family: mock[1],
      key: mock[2],
      num,
      order: Number(mock[2]),
      label: `第 ${mock[2]} 套`,
    }
    return { family: prefix, key: 'all', num, order: 0, label: '全部题目' }
  }

  const papersByFamily = new Map()
  Object.entries(data.questions).forEach(([qid, question]) => {
    const info = paperInfo(question)
    if (!info) return
    if (!papersByFamily.has(info.family)) papersByFamily.set(info.family, new Map())
    const family = papersByFamily.get(info.family)
    if (!family.has(info.key)) {
      family.set(info.key, { label: info.label, order: info.order, nums: new Map() })
    }
    family.get(info.key).nums.set(info.num, qid)
  })

  const familyKeys = [...papersByFamily.keys()].sort((a, b) => {
    const ia = FAMILY_ORDER.indexOf(a)
    const ib = FAMILY_ORDER.indexOf(b)
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib)
  })

  const sheet = document.getElementById('answer-sheet')
  const sheetToggle = document.getElementById('sheet-toggle')
  const sheetHead = document.getElementById('sheet-head')
  const sheetSub = document.getElementById('sheet-sub')
  const paperFamily = document.getElementById('paper-family')
  const paperSet = document.getElementById('paper-set')
  const sheetGrid = document.getElementById('sheet-grid')

  familyKeys.forEach(key => {
    const option = document.createElement('option')
    option.value = key
    option.textContent = FAMILY_NAME[key] || key
    paperFamily.appendChild(option)
  })

  function fillPaperSets(keepSelection) {
    const previous = keepSelection ? paperSet.value : ''
    const family = papersByFamily.get(paperFamily.value)
    paperSet.innerHTML = ''
    if (!family) {
      renderSheet(); return
    }
    const keys = [...family.keys()].sort((a, b) => family.get(a).order - family.get(b).order)
    keys.forEach(key => {
      const option = document.createElement('option')
      option.value = key
      option.textContent = family.get(key).label
      paperSet.appendChild(option)
    })
    if (previous && family.has(previous)) paperSet.value = previous
    else if (paperFamily.value === '真题') paperSet.value = keys[keys.length - 1]
    renderSheet()
  }

  function renderSheet() {
    const family = papersByFamily.get(paperFamily.value)
    const paper = family && family.get(paperSet.value)
    sheetGrid.innerHTML = ''
    if (!paper) {
      sheetSub.textContent = '暂无题目'; return
    }
    const numbers = [...paper.nums.keys()].sort((a, b) => a - b)
    const max = numbers[numbers.length - 1]
    for (let n = 1; n <= max; n += 1) {
      const qid = paper.nums.get(n)
      const cell = document.createElement('button')
      cell.type = 'button'
      cell.className = 'sheet-cell'
      if (qid) cell.dataset.question = qid
      cell.textContent = String(n)
      cell.title = `第 ${n} 题`
      cell.addEventListener('click', () => qid
        ? openQuestion(qid, null, true)
        : toast('此题暂未收录原题'))
      sheetGrid.appendChild(cell)
    }
    sheetSub.textContent = `${numbers.length} 题`
    refreshAnswerMarks()
  }
  function updateSheetScore() {
    const score = document.getElementById('sheet-score')
    const paper = papersByFamily.get(paperFamily.value)?.get(paperSet.value)
    const ids = paper ? [...paper.nums.values()].filter(Boolean) : []
    if (!ids.length || ids.some(id => data.questions[id].answer
      && data.questions[id].quizAvailable !== false && !answerResults.has(id))) {
      score.hidden = true
      score.textContent = ''
      return
    }
    score.hidden = false
    if (ids.length !== 33) {
      score.textContent = '本套卷暂不支持记分'
      return
    }
    const points = id => data.questions[id].kind === '多项选择题' ? 2 : 1
    const maximum = ids.reduce((sum, id) => sum + points(id), 0)
    const earned = ids.reduce((sum, id) => sum + (answerResults.get(id) === 'right' ? points(id) : 0), 0)
    score.textContent = `本套卷得分：${earned} / ${maximum} 分`
  }
  const exportMenu = document.getElementById('export-menu')
  document.getElementById('export-trigger').addEventListener('click', () => {
    exportMenu.hidden = !exportMenu.hidden
  })
  document.addEventListener('click', event => {
    if (!event.target.closest('.export-wrap')) exportMenu.hidden = true
  })
  const importGuide = `导入步骤（⚠️ 本txt文件仅 markji.com 网页端支持，墨墨记忆卡 App 内没有该入口）

⚠️导入前必看

1、电脑浏览器打开 markji.com，新建一个牌组（如「政治错题」）

2、牌组上方点「批量制卡」→「从文本导入」

3、把 txt 全部内容粘贴进去，分隔符保持默认（### 章节 / === 分卡 / --- 答案线）

4、确认预览无误后导入即可

5、不会导入的请私信 @普通小豆芽`
  function formatWrongQuestion(question) {
    const choices = question.options.map(option => `- ${markjiSafe(String(option.text || '').replaceAll('\n', ' '))}`).join('\n')
    const number = paperInfo(question)?.num || question.displayLabel || question.label
    return `${number}. ${markjiSafe(question.stem)}\n[Choice#ans/${question.answer}#\n${choices}\n]\n---\n正确答案：${markjiSafe(`${question.answer} ${question.answerText || ''}`.trim())}\n答案解析：${markjiSafe(question.explanation || '')}`
  }
  function exportWrongQuestions(scope) {
    const family = papersByFamily.get(paperFamily.value)
    const paper = family?.get(paperSet.value)
    const ids = scope === 'paper'
      ? [...(paper?.nums.values() || [])].filter(id => answerResults.get(id) === 'wrong')
      : [...answerResults.keys()].filter(id => answerResults.get(id) === 'wrong')
    if (!ids.length) {
      toast(scope === 'paper' ? '本套卷暂无错题' : '工作台暂无错题'); return
    }
    const groups = new Map()
    ids.forEach(id => {
      const question = data.questions[id]
      if (!question) return
      const info = paperInfo(question)
      const label = info ? `${FAMILY_NAME[info.family] || info.family}·${info.label}` : '其他错题'
      if (!groups.has(label)) groups.set(label, [])
      groups.get(label).push(question)
    })
    const body = [...groups.entries()].map(([label, questions]) =>
      `###${label}\n${questions.map(formatWrongQuestion).join('\n===\n')}`).join('\n===\n')
    const blob = new Blob(['\uFEFF', importGuide, '\n\n\n\n\n\n', body, '\n'], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '导入墨墨记忆卡官网（文件内有说明）.txt'
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    exportMenu.hidden = true
  }
  exportMenu.addEventListener('click', event => {
    const button = event.target.closest('[data-export]')
    if (button) exportWrongQuestions(button.dataset.export)
  })
  document.getElementById('record-export').addEventListener('click', () => exportWrongQuestions('all'))

  function resetFilters() {
    let changed = false
    if (searchInput.value) {
      searchInput.value = ''; changed = true
    }
    if (changed) applyFilters()
  }

  function jumpToPoint(pointId) {
    resetFilters()
    const area = document.querySelector(`.copy-area[data-point-id="${pointId}"]`)
    if (!area) return
    document.dispatchEvent(new CustomEvent('one-page-reveal-subject', {
      detail: { part: area.closest('.subject').dataset.part }
    }))
    const row = area.closest('.point')
    // 手机端让卡片贴近顶部，并留出顶栏与悬浮跳转栏的高度。
    const placeRow = smooth => {
      const box = row.getBoundingClientRect()
      const narrow = isNarrow()
      const offset = narrow
        ? document.querySelector('.topbar').offsetHeight
        + document.getElementById('mobile-card-jump').offsetHeight + 12
        : Math.max(90, (window.innerHeight - box.height) / 2)
      window.scrollTo({ top: Math.max(0, window.scrollY + box.top - offset),
        behavior: smooth ? 'smooth' : 'auto' })
    }
    placeRow(true)
    setTimeout(() => {
      const box = row.getBoundingClientRect()
      const narrow = isNarrow()
      const visibleBottom = window.innerHeight - 90
      if (box.top < 60 || box.top > visibleBottom - 60 || box.bottom > visibleBottom + 40) {
        placeRow(false)
      }
    }, 900)
    row.classList.remove('flash')
    void row.offsetWidth
    row.classList.add('flash')
    setTimeout(() => row.classList.remove('flash'), 2600)
  }
  function submitCardJump(event) {
    event.preventDefault()
    const input = event.currentTarget.querySelector('input')
    const value = input.value.trim()
    if (!/^\d+$/.test(value)) {
      if (event.currentTarget.id !== 'mobile-card-jump') {
        toast('请输入卡片序号')
        return
      }
      if (!value) {
        toast('请输入卡片序号或关键词')
        return
      }
      clearTimeout(questionSearchTimer)
      searchInput.value = value
      applyFilters()
      if (openSearchedQuestion(value)) return
      const firstPoint = document.querySelector('#subjects .point:not([hidden])')
      if (!firstPoint) {
        toast('未找到匹配的知识点或题目')
        return
      }
      const offset = document.querySelector('.topbar').offsetHeight
        + document.getElementById('mobile-card-jump').offsetHeight + 12
      window.scrollTo({ top: Math.max(0, window.scrollY
      + firstPoint.getBoundingClientRect().top - offset),
      behavior: 'smooth' })
      return
    }
    const point = allPoints.find(item => !item.isUserAdded && Number(item.sourceIndex) === Number(value))
    if (!point || !document.querySelector(`.copy-area[data-point-id="${point.id}"]`)) {
      toast('未找到对应知识点卡片'); return
    }
    jumpToPoint(point.id)
  }
  document.getElementById('card-jump').addEventListener('submit', submitCardJump)
  document.getElementById('mobile-card-jump').addEventListener('submit', submitCardJump)

  function isNarrow() {
    return window.matchMedia('(max-width: 760px)').matches
  }

  function setSheet(open) {
    sheet.classList.toggle('open', open)
    sheet.setAttribute('aria-hidden', String(!open))
    sheetToggle.setAttribute('aria-expanded', String(open))
  }

  sheetToggle.addEventListener('click', () => setSheet(!sheet.classList.contains('open')))
  document.getElementById('sheet-close').addEventListener('click', () => setSheet(false))
  sheetHead.addEventListener('click', event => {
    if (event.target.closest('.sheet-close')) return
    if (!sheet.classList.contains('open')) setSheet(true)
  })
  paperFamily.addEventListener('change', () => fillPaperSets(false))
  paperSet.addEventListener('change', renderSheet)
  document.getElementById('sheet-jump').addEventListener('submit', event => {
    event.preventDefault()
    const value = document.getElementById('sheet-jump-input').value.trim()
    let target = yearQuestionTarget(value)
    if (!target) {
      const id = searchedQuestionId(value)
      const info = id && paperInfo(data.questions[id])
      if (info) target = { family: info.family, key: info.key, id }
    }
    if (!target) {
      toast('未找到对应题目，请输入如 2012-3 的题号')
      return
    }
    paperFamily.value = target.family
    fillPaperSets(false)
    paperSet.value = target.key
    renderSheet()
    openQuestion(target.id, null, true)
  })

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && sheet.classList.contains('open')) setSheet(false)
  })

  if (familyKeys.length) {
    paperFamily.value = familyKeys[0]
    fillPaperSets(false)
  }

  const sections = [...document.querySelectorAll('.subject')]
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
    if (!visible) return
    navButtons.forEach(button => {
      const active = button.dataset.target === visible.target.id
      button.classList.toggle('active', active)
      button.closest('.nav-row')?.classList.toggle('active', active)
    })
  }, { rootMargin: '-15% 0px -68% 0px', threshold: [0, 0.1] })
  sections.forEach(section => observer.observe(section))
  contentGrid.hidden = false
  window.initializeWrongNotebook({ data, openQuestion, refreshQuestionLayout: scheduleQuestionExpanders })
  recordWidget.hidden = false
  searchInput.disabled = false
  sheetToggle.disabled = false
  loading.hidden = true
  // Restore the hero and position the index in the same frame, before either is painted.
  await new Promise(resolve => requestAnimationFrame(resolve))
  document.documentElement.removeAttribute('data-knowledge-entry')
  if (location.hash === '#knowledge') {
    document.getElementById('knowledge').scrollIntoView({ behavior: 'instant', block: 'start' })
    navButtons.forEach(button => {
      const active = button.dataset.target === sections[0]?.id
      button.classList.toggle('active', active)
      button.closest('.nav-row')?.classList.toggle('active', active)
    })
  }
})().catch(error => {
  console.error('一页纸工作台加载失败', error)
  const loading = document.getElementById('workbench-loading')
  loading.setAttribute('role', 'alert')
  document.getElementById('workbench-loading-message').textContent
    = '知识点和题库加载失败，请检查网络后重试。'
  document.getElementById('workbench-retry').hidden = false
})
