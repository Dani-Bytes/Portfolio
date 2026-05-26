import { useEffect, useRef, useState } from 'react'
import { marked } from 'marked'

const GH_USERNAME = 'Dani-Bytes'
const RESUME_URL = '/DanuResume.pdf'
const CERTS = [
  {
    issuer: 'Coursera / IBM',
    title: 'Python for Data Science, AI & Development',
    credential: 'Certificate of Completion',
    verifyUrl: 'https://www.credly.com/earner/earned/badge/4cd77776-cba3-462f-ac1a-286232bee2a9',
  },
  {
    issuer: 'Coursera / Johns Hopkins University',
    title: 'HTML, CSS & JavaScript for Web Developers',
    credential: 'Certificate of Completion',
    verifyUrl: 'https://www.coursera.org/account/accomplishments/verify/S525DXYCKY7N',
  },
  {
    issuer: 'Coursera / DeepLearning.AI — Andrew Ng',
    title: 'AI For Everyone',
    credential: 'Certificate of Completion',
    verifyUrl: 'https://www.coursera.org/account/accomplishments/verify/HB8SU0LRFZVV',
  },
]

const PROJECTS = [
  {
    name: 'Code Carnival — DSA Gaming Platform',
    status: 'STABLE',
    description:
      'Multi-game terminal platform: Chess (Minimax + Alpha-Beta Pruning), Maze Runner (BFS/DFS), Battleship, Snake & Flappy Bird — each backed by a purpose-specific data structure.',
    tags: ['C++', 'DSA', 'Minimax', 'BFS/DFS', 'PostgreSQL'],
    repo: 'Code_Carnival',
    repoUrl: 'https://github.com/Dani-Bytes/Code_Carnival',
    demoUrl: '',
  },
  {
    name: 'Asian Antique Store',
    status: 'DEPLOYED',
    description:
      'E-commerce storefront with category browsing, cart flow, and product highlights tailored for a boutique antiques brand.',
    tags: ['React', 'Ecommerce', 'UI', 'Frontend'],
    repo: 'Asian-Antique-Store',
    repoUrl: 'https://github.com/Dani-Bytes/Asian-Antique-Store',
    demoUrl: '',
  },
  {
    name: 'Nova Site — Ecommerce',
    status: 'ACTIVE',
    description:
      'Modern storefront experience with hero collections, curated product grids, and conversion-first layout.',
    tags: ['React', 'UI', 'Ecommerce', 'Frontend'],
    repo: 'Nova-Site',
    repoUrl: 'https://github.com/Dani-Bytes/Nova-Site',
    demoUrl: '',
  },
  {
    name: 'FYP Management System',
    status: 'DEPLOYED',
    description:
      'Full-scale web platform managing Final Year Projects across role-based dashboards. Proposal → evaluation → defense → grade workflow.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Full-Stack', 'Role-Based Auth'],
    repo: 'FYP_Management',
    repoUrl: 'https://github.com/Dani-Bytes/FYP_Management',
    demoUrl: '',
  },
  {
    name: 'CyberBank — AI Banking System',
    status: 'ACTIVE',
    description:
      'Terminal banking system integrated with LLM APIs for natural language queries and async voice feedback.',
    tags: ['Python', 'Bash', 'Gemini API', 'Linux', 'AI/NLP'],
    repo: 'CyberBank',
    repoUrl: 'https://github.com/Dani-Bytes/CyberBank',
    demoUrl: '',
  },
]

function App() {
  const initRef = useRef(false)
  const ghStatsRef = useRef({ repos: 0, followers: 0, contributions: 0, streak: 0 })
  const [blogPosts, setBlogPosts] = useState([])
  const [blogStatus, setBlogStatus] = useState('loading')
  const [contribDays, setContribDays] = useState([])
  const [modalState, setModalState] = useState({
    open: false,
    project: null,
    content: '',
    loading: false,
    error: '',
  })
  const [ghProfile, setGhProfile] = useState({
    name: 'Muhammad Daniyal Qureshi',
    login: GH_USERNAME,
    avatarUrl: '',
    htmlUrl: `https://github.com/${GH_USERNAME}`,
  })
  const [ghStats, setGhStats] = useState({
    repos: 0,
    followers: 0,
    contributions: 0,
    streak: 0,
  })
  const ghInitials = ghProfile.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  const openModal = async (project) => {
    setModalState({ open: true, project, content: '', loading: true, error: '' })
    if (!project || !project.repo) {
      setModalState({ open: true, project, content: '', loading: false, error: 'README not available.' })
      return
    }
    try {
      const res = await fetch(`/api/github/readme?repo=${encodeURIComponent(project.repo)}`)
      if (!res.ok) throw new Error('readme-failed')
      const data = await res.json()
      const html = marked.parse(data.content || '')
      setModalState({ open: true, project, content: html, loading: false, error: '' })
    } catch (err) {
      setModalState({ open: true, project, content: '', loading: false, error: 'README not available.' })
    }
  }

  const closeModal = () => {
    setModalState({ open: false, project: null, content: '', loading: false, error: '' })
  }

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    const timeouts = []
    const intervals = []
    const cleanupFns = []

    const safeTimeout = (fn, delay) => {
      const id = setTimeout(fn, delay)
      timeouts.push(id)
      return id
    }

    const safeInterval = (fn, delay) => {
      const id = setInterval(fn, delay)
      intervals.push(id)
      return id
    }

    const addListener = (target, type, handler, options) => {
      target.addEventListener(type, handler, options)
      cleanupFns.push(() => target.removeEventListener(type, handler, options))
    }

    // CLOCK
    const tick = () => {
      const n = new Date()
      const el = document.getElementById('clock')
      if (el) {
        el.textContent =
          n.toLocaleDateString('en', { weekday: 'short' }) +
          ' ' +
          n.toLocaleTimeString('en', { hour12: false })
      }
    }
    tick()
    safeInterval(tick, 1000)

    // PARTICLES
    const pCanvas = document.getElementById('particles-canvas')
    if (pCanvas) {
      const ctx = pCanvas.getContext('2d')
      const rsz = () => {
        pCanvas.width = window.innerWidth
        pCanvas.height = window.innerHeight
      }
      rsz()
      addListener(window, 'resize', rsz)
      const pts = Array.from({ length: 55 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.5 + 0.5,
        o: Math.random() * 0.4 + 0.1,
      }))
      let animId = 0
      const draw = () => {
        if (!ctx) return
        ctx.clearRect(0, 0, pCanvas.width, pCanvas.height)
        pts.forEach((p) => {
          p.x += p.vx
          p.y += p.vy
          if (p.x < 0 || p.x > pCanvas.width) p.vx *= -1
          if (p.y < 0 || p.y > pCanvas.height) p.vy *= -1
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(0,255,65,${p.o})`
          ctx.fill()
        })
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x
            const dy = pts[i].y - pts[j].y
            const d = Math.sqrt(dx * dx + dy * dy)
            if (d < 130) {
              ctx.beginPath()
              ctx.moveTo(pts[i].x, pts[i].y)
              ctx.lineTo(pts[j].x, pts[j].y)
              ctx.strokeStyle = `rgba(0,255,65,${0.07 * (1 - d / 130)})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        }
        animId = requestAnimationFrame(draw)
      }
      draw()
      cleanupFns.push(() => cancelAnimationFrame(animId))
    }

    // BOOT
    const bootLines = [
      'BIOS v2.4.1  ·  DaniOS Systems Inc.  ·  All rights reserved',
      '',
      'CPU: Ambition Core i9 @ 3.6GHz  ................  [ OK ]',
      'RAM: 16GB DDR5 Knowledge  .......................  [ OK ]',
      'DISK: 1TB NVMe Projects  ........................  [ OK ]',
      'GPU: Creative Reasoning Unit  ...................  [ OK ]',
      '',
      'Loading DaniOS Kernel v1.0-AI...',
      'Initializing AI inference modules  ..............  [ OK ]',
      'Mounting ~/projects filesystem  .................  [ OK ]',
      'Starting GitHub synchronization daemon  .........  [ OK ]',
      'Loading DSA algorithms library  .................  [ OK ]',
      'Spawning React renderer process  ................  [ OK ]',
      'Connecting to neural networks  ..................  [ OK ]',
      'Applying Merit Scholarship patch  ...............  [ OK ]',
      '',
      '╔══════════════════════════════════════════════╗',
      '║           DaniOS v1.0 — AI Edition            ║',
      '║       Muhammad Daniyal Qureshi © 2024        ║',
      '╚══════════════════════════════════════════════╝',
      '',
      '▌ System ready. Access granted. Welcome._',
    ]
    let bi = 0
    const bEl = document.getElementById('boot-text')
    const bBar = document.getElementById('boot-bar')

    function bootNext() {
      if (!bEl || !bBar) return
      if (bi >= bootLines.length) {
        bBar.style.width = '100%'
        safeTimeout(launchDesktop, 500)
        return
      }
      const ln = bootLines[bi]
      const d = document.createElement('div')
      d.style.cssText = 'opacity:0;transition:opacity 0.05s;color:'
      if (ln.includes('[ OK ]')) d.style.color = '#00ff41'
      else if (ln.startsWith('╔') || ln.startsWith('║') || ln.startsWith('╚'))
        d.style.color = '#00ccff'
      else if (ln.includes('▌')) d.style.color = '#ffb000'
      else if (ln.includes('BIOS')) d.style.color = '#888'
      else d.style.color = '#00aa22'
      d.textContent = ln || '\u00a0'
      bEl.appendChild(d)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          d.style.opacity = '1'
        })
      })
      bEl.scrollTop = bEl.scrollHeight
      bBar.style.width = (bi / bootLines.length) * 100 + '%'
      bi++
      safeTimeout(bootNext, ln === '' ? 35 : ln.includes('[ OK ]') ? 70 : 55)
    }

    function launchDesktop() {
      const boot = document.getElementById('boot')
      if (!boot) return
      boot.style.transition = 'opacity .9s'
      boot.style.opacity = '0'
      safeTimeout(() => {
        boot.style.display = 'none'
        const d = document.getElementById('desktop')
        if (d) {
          d.classList.add('active')
          safeTimeout(() => openWin('wt'), 300)
          safeTimeout(() => showNotif('DaniOS ready — type help in terminal'), 900)
          safeTimeout(animSkills, 700)
          safeTimeout(animGH, 700)
        }
      }, 900)
    }

    function skipBoot() {
      bi = bootLines.length - 1
      bootNext()
    }

    addListener(document, 'keydown', (e) => {
      const boot = document.getElementById('boot')
      if (e.key === 'Escape' && boot && boot.style.display !== 'none') skipBoot()
    })

    safeTimeout(bootNext, 400)

    // WINDOWS
    let zTop = 200
    const positions = {
      wt: [40, 50],
      wa: [200, 60],
      wp: [80, 45],
      ws: [160, 55],
      wc: [180, 65],
      wg: [130, 48],
      wco: [170, 70],
      wach: [220, 75],
      wb: [140, 80],
    }

    function openWin(id) {
      const w = document.getElementById(id)
      if (!w) return
      if (w.classList.contains('active')) {
        focusWin(id)
        return
      }
      const p = positions[id] || [80, 50]
      w.style.left = p[0] + 'px'
      w.style.top = 32 + p[1] + 'px'
      w.classList.add('active')
      focusWin(id)
      const dk = document.getElementById('dk-' + id)
      if (dk) dk.classList.add('open')
      if (id === 'ws') safeTimeout(animSkills, 250)
      if (id === 'wg') {
        safeTimeout(animGH, 250)
        safeTimeout(animLang, 250)
      }
    }

    function closeWin(id) {
      const w = document.getElementById(id)
      if (!w) return
      w.style.opacity = '0'
      w.style.transform = 'scale(0.88)'
      w.style.transition = 'opacity .15s,transform .15s'
      safeTimeout(() => {
        w.classList.remove('active')
        w.style.opacity = ''
        w.style.transform = ''
        w.style.transition = ''
      }, 150)
      const dk = document.getElementById('dk-' + id)
      if (dk) dk.classList.remove('open')
    }

    function focusWin(id) {
      document.querySelectorAll('.win').forEach((w) => w.classList.remove('focused'))
      const w = document.getElementById(id)
      if (w) {
        w.classList.add('focused')
        w.style.zIndex = ++zTop
      }
    }

    const desktop = document.getElementById('desktop')
    if (desktop) {
      addListener(desktop, 'mousedown', (e) => {
        if (!e.target.closest('.win')) {
          document.querySelectorAll('.win').forEach((w) => w.classList.remove('focused'))
        }
      })
    }

    // DRAG
    let drag = null
    let ox = 0
    let oy = 0
    function startDrag(e, id) {
      const w = document.getElementById(id)
      if (!w) return
      focusWin(id)
      drag = w
      ox = e.clientX - w.offsetLeft
      oy = e.clientY - w.offsetTop
      e.preventDefault()
    }
    addListener(document, 'mousemove', (e) => {
      if (!drag) return
      drag.style.left = e.clientX - ox + 'px'
      drag.style.top = Math.max(32, e.clientY - oy) + 'px'
    })
    addListener(document, 'mouseup', () => {
      drag = null
    })

    // TERMINAL
    const tOut = document.getElementById('t-out')
    const tIn = document.getElementById('t-input')
    const tWrap = document.getElementById('wt')
    let hist = []
    let hIdx = -1

    function tLine(html, cls = '') {
      if (!tOut) return
      const d = document.createElement('div')
      d.className = 'tl ' + (cls || 't-out-line')
      d.innerHTML = html
      tOut.appendChild(d)
      if (tOut.parentElement) {
        tOut.parentElement.scrollTop = tOut.parentElement.scrollHeight
      }
    }

    function tPrompt(cmd) {
      tLine(
        '<span class="t-pr"><span style="color:var(--cyan)">daniyal</span><span style="color:var(--text3)">@</span><span style="color:var(--purple)">portfolio</span><span style="color:var(--text3)">:~$</span></span> <span style="color:var(--green)">' +
          cmd +
          '</span>'
      )
    }

    const cmds = {
      help() {
        tLine('')
        tLine('<span style="color:var(--cyan)">╔══════════════════════════════════════════╗</span>')
        tLine('<span style="color:var(--cyan)">║       DaniOS Command Reference v1.0      ║</span>')
        tLine('<span style="color:var(--cyan)">╚══════════════════════════════════════════╝</span>')
        tLine('')
        ;[
          ['about', '→ open about me'],
          ['projects', '→ classified modules'],
          ['skills', '→ system diagnostics'],
          ['certs', '→ credentials vault'],
          ['blog', '→ case studies feed'],
          ['github', '→ git analytics'],
          ['contact', '→ secure channel'],
          ['achievements', '→ sudo honors'],
          ['clear', '→ clear terminal'],
          ['neofetch', '→ system info'],
          ['whoami', '→ identity check'],
          ['ls', '→ list all sections'],
          ['sudo hire-me', '→ best decision ever 😏'],
          ['coffee', '→ ☕ emergency'],
          ['hack', '→ nice try'],
          ['matrix', '→ enter the matrix'],
        ].forEach(([c, d]) =>
          tLine(
            `  <span style="color:var(--green)">${c.padEnd(20)}</span><span style="color:var(--text2)">${d}</span>`
          )
        )
        tLine('')
      },
      about() {
        openWin('wa')
        tLine('Opening about.txt...')
      },
      projects() {
        openWin('wp')
        tLine('Listing ~/projects/...')
      },
      skills() {
        openWin('ws')
        tLine('Running diagnostics...')
      },
      certs() {
        openWin('wc')
        tLine('Reading certifications.log...')
      },
      certifications() {
        openWin('wc')
        tLine('Reading certifications.log...')
      },
      blog() {
        openWin('wb')
        tLine('Opening case studies feed...')
      },
      github() {
        openWin('wg')
        tLine('Connecting to api.github.com...')
      },
      contact() {
        openWin('wco')
        tLine('Initializing encrypted channel...')
      },
      achievements() {
        openWin('wach')
        tLine('[sudo] password: ●●●●●●●')
        safeTimeout(() => tLine('root access granted ✓'), 400)
      },
      clear() {
        if (tOut) tOut.innerHTML = ''
      },
      neofetch() {
        tLine('')
        tLine('<span style="color:var(--green)">        ██████  </span>   <span style="color:var(--cyan)">daniyal@portfolio</span>')
        tLine('<span style="color:var(--green)">      ████████  </span>   ─────────────────────')
        tLine('<span style="color:var(--green)">     ██  ████   </span>   <span style="color:var(--text3)">OS:</span>         DaniOS v1.0-AI')
        tLine('<span style="color:var(--green)">    ████████    </span>   <span style="color:var(--text3)">Kernel:</span>     Brain 6.0-ml-patch')
        tLine('<span style="color:var(--green)">    ████  ██    </span>   <span style="color:var(--text3)">Uptime:</span>     21 years, 0 crashes')
        tLine('<span style="color:var(--green)">    ████████    </span>   <span style="color:var(--text3)">Shell:</span>      Ambition v2.4')
        tLine('<span style="color:var(--green)">      ████      </span>   <span style="color:var(--text3)">Packages:</span>   500+ (github repos)')
        tLine('<span style="color:var(--green)">        ██      </span>   <span style="color:var(--text3)">University:</span> Bahria University ISB')
        tLine('                    <span style="color:var(--text3)">Degree:</span>     BS Software Engineering')
        tLine('                    <span style="color:var(--text3)">Awards:</span>     Merit Scholar + PM Laptop')
        tLine('                    <span style="color:var(--text3)">Memory:</span>     DSA + OOP + AI/ML + Web')
        tLine('')
      },
      whoami() {
        tLine('Muhammad Daniyal Qureshi')
        tLine('Software Engineering Student — 6th Semester')
        tLine('AI/ML Enthusiast | Full-Stack Developer')
        tLine('Bahria University Islamabad')
        tLine('<span style="color:var(--amber)">Merit Scholar ✓  |  PM Laptop Scheme Recipient ✓</span>')
      },
      ls() {
        tLine('')
        tLine('drwxr-xr-x   <span style="color:var(--cyan)">about</span>           Who am I')
        tLine('drwxr-xr-x   <span style="color:var(--cyan)">projects</span>        3 classified modules')
        tLine('drwxr-xr-x   <span style="color:var(--cyan)">skills</span>          System diagnostics')
        tLine('drwxr-xr-x   <span style="color:var(--cyan)">certifications</span>  3 verified credentials')
        tLine('drwxr-xr-x   <span style="color:var(--cyan)">blog</span>            Case studies feed')
        tLine('-rwxr-xr-x   <span style="color:var(--cyan)">github</span>          @Dani-Bytes analytics')
        tLine('-r--------   <span style="color:var(--amber)">achievements</span>    [sudo required]')
        tLine('-rwxr-xr-x   <span style="color:var(--cyan)">contact</span>         Secure channel')
        tLine('')
      },
      'sudo hire-me'() {
        tLine('[sudo] password for daniyal: ●●●●●●●')
        safeTimeout(() => tLine('<span style="color:var(--amber)">✓ Permission granted. Executing hire_daniyal.sh...</span>'), 500)
        safeTimeout(() => tLine('Loading skills... <span style="color:var(--green)">████████████████████</span> 100%'), 900)
        safeTimeout(() => tLine('Loading projects... <span style="color:var(--green)">████████████████████</span> 100%'), 1300)
        safeTimeout(() => tLine('Loading potential... <span style="color:var(--cyan)">████████████████████</span> ∞'), 1700)
        safeTimeout(() => tLine('<span style="color:var(--green)">✓ Congratulations. You just made an excellent hire. 🚀</span>'), 2200)
        safeTimeout(() => tLine('→ <span style="color:var(--cyan)">daniyalqureshi164@gmail.com</span>  |  +92-346-1706663'), 2500)
      },
      coffee() {
        tLine('☕ Brewing...')
        safeTimeout(() => tLine('ERROR: coffee.jar not found. Running on sheer willpower and code.'), 600)
      },
      hack() {
        tLine('<span style="color:var(--red)">INITIATING HACK SEQUENCE...</span>')
        safeTimeout(() => tLine('ACCESS DENIED — nice try though 😄'), 400)
        safeTimeout(() => tLine('I only build things, not break them.'), 800)
        safeTimeout(() => tLine('...although I do know my way around Linux 😏'), 1200)
      },
      'sudo make me a sandwich'() {
        tLine('[sudo] ●●●●●●●')
        safeTimeout(() => tLine('✓ Okay. 🥪'), 500)
      },
      matrix() {
        showMatrix()
        tLine('Entering the Matrix... click screen to exit.')
      },
      exit() {
        closeWin('wt')
      },
      pwd() {
        tLine('/home/daniyal/portfolio')
      },
      date() {
        tLine(new Date().toString())
      },
      uname() {
        tLine('DaniOS 1.0-AI #1 SMP PREEMPT Brain 6.0-ml x86_64 GNU/Linux')
      },
    }

    if (tIn) {
      addListener(tIn, 'keydown', (e) => {
        if (e.key === 'Enter') {
          const v = tIn.value.trim()
          if (!v) return
          tPrompt(v)
          hist.unshift(v)
          hIdx = -1
          tIn.value = ''
          const fn = cmds[v.toLowerCase()] || cmds[v]
          if (fn) fn()
          else {
            tLine(`<span style="color:var(--red)">bash: ${v}: command not found</span>`)
            tLine('Hint: type <span style="color:var(--green)">help</span> for commands.')
          }
          tLine('')
        } else if (e.key === 'ArrowUp') {
          hIdx = Math.min(hIdx + 1, hist.length - 1)
          tIn.value = hist[hIdx] || ''
          e.preventDefault()
        } else if (e.key === 'ArrowDown') {
          hIdx = Math.max(hIdx - 1, -1)
          tIn.value = hIdx < 0 ? '' : hist[hIdx]
          e.preventDefault()
        }
      })
    }

    if (tWrap && tIn) {
      addListener(tWrap, 'click', () => tIn.focus())
    }

    safeTimeout(() => {
      tLine('<span style="color:var(--cyan)">╔════════════════════════════════════╗</span>')
      tLine('<span style="color:var(--cyan)">║  Welcome to DaniOS Terminal v1.0   ║</span>')
      tLine('<span style="color:var(--cyan)">╚════════════════════════════════════╝</span>')
      tLine('')
      tLine('Type <span style="color:var(--green)">help</span> to see all commands.')
      tLine('Try: <span style="color:var(--amber)">neofetch</span> · <span style="color:var(--amber)">sudo hire-me</span> · <span style="color:var(--amber)">ls</span> · <span style="color:var(--amber)">whoami</span>')
      tLine('')
      if (tIn) tIn.focus()
    }, 200)

    // SKILL BARS
    function animSkills() {
      document.querySelectorAll('.sk-fill').forEach((el, i) => {
        safeTimeout(() => {
          el.style.width = el.dataset.p + '%'
        }, 100 + i * 40)
      })
    }

    // GITHUB
    function animGH() {
      animCount('rc', 0, ghStatsRef.current.repos, 1200)
      animCount('cc', 0, ghStatsRef.current.contributions, 1200)
      animCount('sc2', 0, ghStatsRef.current.streak, 1200)
    }

    function animCount(id, f, t, dur) {
      const el = document.getElementById(id)
      if (!el) return
      const step = (t - f) / (dur / 16)
      let cur = f
      const iv = safeInterval(() => {
        cur += step
        if (cur >= t) {
          cur = t
          clearInterval(iv)
        }
        el.textContent = Math.round(cur)
      }, 16)
    }

    function animLang() {
      document.querySelectorAll('.lb-fill').forEach((el, i) => {
        safeTimeout(() => {
          el.style.width = el.dataset.w + '%'
          el.style.transition = 'width 1.6s'
        }, 100 + i * 100)
      })
    }

    const loadGitHub = async () => {
      try {
        const res = await fetch('/api/github/profile')
        if (!res.ok) throw new Error('profile-failed')
        const data = await res.json()
        const profile = {
          name: data.name || data.login || GH_USERNAME,
          login: data.login || GH_USERNAME,
          avatarUrl: data.avatarUrl || '',
          htmlUrl: data.htmlUrl || `https://github.com/${GH_USERNAME}`,
        }
        setGhProfile(profile)
      } catch (err) {
        try {
          const res = await fetch(`https://api.github.com/users/${GH_USERNAME}`)
          if (!res.ok) return
          const data = await res.json()
          setGhProfile({
            name: data.name || data.login || GH_USERNAME,
            login: data.login || GH_USERNAME,
            avatarUrl: data.avatar_url || '',
            htmlUrl: data.html_url || `https://github.com/${GH_USERNAME}`,
          })
        } catch (innerErr) {
          // Keep fallback values if GitHub API fails.
        }
      }
    }

    const loadContribs = async () => {
      try {
        const res = await fetch('/api/github/contributions')
        if (!res.ok) throw new Error('contrib-failed')
        const data = await res.json()
        const days = Array.isArray(data.days) ? data.days : []
        setContribDays(days)

        const total = days.reduce((sum, day) => sum + (day.count || 0), 0)
        let streak = 0
        for (let i = days.length - 1; i >= 0; i -= 1) {
          if (days[i].count > 0) streak += 1
          else break
        }

        const stats = {
          repos: ghStatsRef.current.repos,
          followers: ghStatsRef.current.followers,
          contributions: total,
          streak,
        }
        setGhStats((prev) => ({
          ...prev,
          contributions: total,
          streak,
        }))
        ghStatsRef.current = { ...ghStatsRef.current, ...stats }
        safeTimeout(animGH, 200)
      } catch (err) {
        // Keep fallback values if GitHub API fails.
      }
    }

    const loadGitHubStats = async () => {
      try {
        const res = await fetch('/api/github/profile')
        if (!res.ok) throw new Error('profile-failed')
        const data = await res.json()
        const stats = {
          repos: Number.isFinite(data.publicRepos) ? data.publicRepos : 0,
          followers: Number.isFinite(data.followers) ? data.followers : 0,
          contributions: ghStatsRef.current.contributions,
          streak: ghStatsRef.current.streak,
        }
        setGhStats((prev) => ({ ...prev, repos: stats.repos, followers: stats.followers }))
        ghStatsRef.current = { ...ghStatsRef.current, ...stats }
        safeTimeout(animGH, 200)
      } catch (err) {
        // Keep fallback values.
      }
    }

    const loadBlogs = async () => {
      try {
        const res = await fetch('/api/blogs')
        if (!res.ok) throw new Error('blogs-failed')
        const data = await res.json()
        setBlogPosts(Array.isArray(data.items) ? data.items : [])
        setBlogStatus('ready')
      } catch (err) {
        setBlogStatus('error')
      }
    }

    loadGitHub()
    loadGitHubStats()
    loadContribs()
    loadBlogs()

    // CONTACT
    async function sendMsg() {
      const fEl = document.getElementById('co-from')
      const mEl = document.getElementById('co-msg')
      const s = document.getElementById('co-status')
      if (!fEl || !mEl || !s) return
      const f = fEl.value.trim()
      const m = mEl.value.trim()
      if (!f || !m) {
        s.textContent = 'ERROR: Empty fields. Fill all inputs.'
        s.style.color = 'var(--red)'
        return
      }
      s.style.color = 'var(--amber)'
      s.textContent = 'Encrypting transmission...'
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: f, message: m }),
        })
        if (!res.ok) {
          s.textContent = 'ERROR: Transmission failed. Try again.'
          s.style.color = 'var(--red)'
          return
        }
        s.textContent = '✓ Message transmitted successfully to daniyal@portfolio.'
        s.style.color = 'var(--green)'
        fEl.value = ''
        mEl.value = ''
      } catch (err) {
        s.textContent = 'ERROR: Network failure. Try again.'
        s.style.color = 'var(--red)'
      }
    }

    // MATRIX
    function showMatrix() {
      const m = document.getElementById('matrix')
      if (!m) return
      m.style.display = 'block'
      const c = document.getElementById('mcanvas')
      if (!c) return
      c.width = window.innerWidth
      c.height = window.innerHeight
      const ctx = c.getContext('2d')
      const cols = Math.floor(window.innerWidth / 13)
      const drops = Array(cols).fill(1)
      const ch = 'アイウエオカキクケコ01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef'
      m._iv = setInterval(() => {
        if (!ctx) return
        ctx.fillStyle = 'rgba(0,0,0,0.05)'
        ctx.fillRect(0, 0, c.width, c.height)
        ctx.fillStyle = '#00ff41'
        ctx.font = '12px JetBrains Mono'
        drops.forEach((y, i) => {
          const char = ch[Math.floor(Math.random() * ch.length)]
          ctx.fillText(char, i * 13, y * 13)
          if (y * 13 > c.height && Math.random() > 0.975) drops[i] = 0
          drops[i]++
        })
      }, 33)
    }

    function dismissMatrix() {
      const m = document.getElementById('matrix')
      if (!m) return
      clearInterval(m._iv)
      m.style.display = 'none'
    }

    // NOTIFICATION
    function showNotif(msg) {
      const n = document.getElementById('notif')
      if (!n) return
      n.textContent = msg
      n.classList.add('show')
      safeTimeout(() => n.classList.remove('show'), 3500)
    }

    // IDLE SCREENSAVER
    let idleT
    const resetIdle = () => {
      if (idleT) clearTimeout(idleT)
      idleT = setTimeout(() => {
        const d = document.getElementById('desktop')
        if (d && d.classList.contains('active')) showMatrix()
      }, 90000)
    }
    addListener(document, 'mousemove', resetIdle)
    addListener(document, 'keydown', resetIdle)
    resetIdle()

    // EXPOSE HELPERS
    window.openWin = openWin
    window.closeWin = closeWin
    window.startDrag = startDrag
    window.sendMsg = sendMsg
    window.skipBoot = skipBoot
    window.dismissMatrix = dismissMatrix

    return () => {
      cleanupFns.forEach((fn) => fn())
      intervals.forEach((id) => clearInterval(id))
      timeouts.forEach((id) => clearTimeout(id))
      if (idleT) clearTimeout(idleT)
    }
  }, [])

  return (
    <>
      <div id="boot">
        <div id="boot-text"></div>
        <div id="boot-progress">
          <div id="boot-label">[ DaniOS v1.0 — AI Edition ]</div>
          <div id="boot-bar-wrap">
            <div id="boot-bar"></div>
          </div>
        </div>
        <div id="skip-boot" onClick={() => window.skipBoot?.()}>
          skip [ESC]
        </div>
      </div>

      <div id="matrix" onClick={() => window.dismissMatrix?.()}>
        <canvas id="mcanvas"></canvas>
        <div id="matrix-hint">▌ click anywhere to resume session_</div>
      </div>

      <div id="notif"></div>

      <div id="desktop">
        <canvas id="particles-canvas"></canvas>

        <div id="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span className="topbar-logo">⬡ DaniOS</span>
            <span style={{ color: 'var(--text3)', fontSize: '10px' }}>daniyal@portfolio:~$</span>
          </div>
          <div className="topbar-right">
            <span className="sys-dot dot-g"></span>
            <span style={{ fontSize: '10px' }}>SYS</span>
            <span className="sys-dot dot-a"></span>
            <span style={{ fontSize: '10px' }}>NET</span>
            <span className="sys-dot dot-r"></span>
            <span style={{ fontSize: '10px' }}>AI</span>
            <span style={{ color: 'var(--text3)' }}>│</span>
            <span id="clock"></span>
          </div>
        </div>

        <div className="win" id="wt">
          <div className="win-tb" onMouseDown={(e) => window.startDrag?.(e, 'wt')}>
            <div className="wc-wrap">
              <div className="wc wc-x" onClick={() => window.closeWin?.('wt')}></div>
              <div className="wc wc-m" onClick={() => window.closeWin?.('wt')}></div>
              <div className="wc wc-z"></div>
            </div>
            <div className="win-title-text">bash — daniyal@portfolio:~ — 80×24</div>
          </div>
          <div className="win-body" id="t-out-wrap">
            <div id="t-out"></div>
            <div id="t-in-row">
              <span id="t-in-pr">
                <span style={{ color: 'var(--cyan)' }}>daniyal</span>
                <span style={{ color: 'var(--text3)' }}>@</span>
                <span style={{ color: 'var(--purple)' }}>portfolio</span>
                <span style={{ color: 'var(--text3)' }}>:~$</span>
              </span>
              <input type="text" id="t-input" autoComplete="off" spellCheck="false" placeholder="type 'help'..." />
            </div>
          </div>
        </div>

        <div className="win" id="wa">
          <div className="win-tb" onMouseDown={(e) => window.startDrag?.(e, 'wa')}>
            <div className="wc-wrap">
              <div className="wc wc-x" onClick={() => window.closeWin?.('wa')}></div>
              <div className="wc wc-m" onClick={() => window.closeWin?.('wa')}></div>
              <div className="wc wc-z"></div>
            </div>
            <div className="win-title-text">cat ~/about.txt</div>
          </div>
          <div className="win-body">
            <div className="ab">
              <pre className="ascii">{`  ██████╗  █████╗ ███╗  ██╗██╗██╗   ██╗  █████╗ ██╗
  ██╔══██╗██╔══██╗████╗ ██║██║╚██╗ ██╔╝ ██╔══██╗██║
  ██║  ██║███████║██╔██╗██║██║ ╚████╔╝  ███████║██║
  ██║  ██║██╔══██║██║╚████║██║  ╚██╔╝   ██╔══██║██║
  ██████╔╝██║  ██║██║ ╚███║██║   ██║    ██║  ██║███████╗
  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚══╝╚═╝   ╚═╝    ╚═╝  ╚═╝╚══════╝`}</pre>
              <div className="sg">
                <div className="sc">
                  <div className="sl">// NAME</div>
                  <div className="sv">Muhammad Daniyal Qureshi</div>
                </div>
                <div className="sc">
                  <div className="sl">// STATUS</div>
                  <div className="sv" style={{ color: 'var(--green)' }}>
                    ● Active — 6th Semester
                  </div>
                </div>
                <div className="sc">
                  <div className="sl">// UNIVERSITY</div>
                  <div className="sv">Bahria University, ISB</div>
                </div>
                <div className="sc">
                  <div className="sl">// LOCATION</div>
                  <div className="sv">Islamabad, Pakistan 🇵🇰</div>
                </div>
                <div className="sc">
                  <div className="sl">// KERNEL</div>
                  <div className="sv">Brain v6.0-AI/ML</div>
                </div>
                <div className="sc">
                  <div className="sl">// UPTIME</div>
                  <div className="sv">21 years, 0 crashes</div>
                </div>
              </div>
              <div className="bio">
                BS Software Engineering student at Bahria University, specializing in AI/ML. Merit Scholar for outstanding CGPA. Recipient of PM Laptop Scheme — national recognition for top university performers. Building intelligent systems that bridge theory and real-world engineering.
              </div>
              <div className="about-links">
                <div>$ email  → <span className="lnk">daniyalqureshi164@gmail.com</span></div>
                <div>$ phone  → <span style={{ color: 'var(--text2)' }}>+92-346-1706663</span></div>
                {RESUME_URL ? (
                  <div>
                    $ resume →{' '}
                    <a className="lnk" href={RESUME_URL} download>
                      download resume ↗
                    </a>
                  </div>
                ) : null}
                <div>
                  $ github →{' '}
                  <span className="lnk" onClick={() => window.open('https://github.com/Dani-Bytes', '_blank')}>
                    github.com/Dani-Bytes ↗
                  </span>
                </div>
                <div>
                  $ linked →{' '}
                  <span className="lnk" onClick={() => window.open('https://linkedin.com/in/daniyal-qureshi-b81016334', '_blank')}>
                    linkedin.com/in/daniyal-qureshi-b81016334 ↗
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="win" id="wp">
          <div className="win-tb" onMouseDown={(e) => window.startDrag?.(e, 'wp')}>
            <div className="wc-wrap">
              <div className="wc wc-x" onClick={() => window.closeWin?.('wp')}></div>
              <div className="wc wc-m" onClick={() => window.closeWin?.('wp')}></div>
              <div className="wc wc-z"></div>
            </div>
            <div className="win-title-text">ls -la ~/projects/ — classified modules</div>
          </div>
          <div className="win-body">
            <div className="pj-wrap">
              <div style={{ fontSize: '10px', color: 'var(--text3)', padding: '4px 4px 0' }}>
                total {PROJECTS.length} classified modules  ·  drwxr-xr-x
              </div>
              {PROJECTS.map((project) => (
                <div className="pj" key={project.name}>
                  <div className="ph">
                    <span className="pn">⬡ {project.name}</span>
                    <span className="ps">● {project.status}</span>
                  </div>
                  <div className="pd">{project.description}</div>
                  <div className="ptags">
                    {project.tags.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="plinks">
                    <button className="plbtn" onClick={() => window.open(project.repoUrl, '_blank')}>
                      $ git clone ↗
                    </button>
                    <button className="plbtn" onClick={() => openModal(project)}>
                      $ readme
                    </button>
                    {project.demoUrl ? (
                      <button className="plbtn" style={{ color: 'var(--green)', borderColor: 'var(--green3)' }} onClick={() => window.open(project.demoUrl, '_blank')}>
                        $ ./launch_demo
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="win" id="ws">
          <div className="win-tb" onMouseDown={(e) => window.startDrag?.(e, 'ws')}>
            <div className="wc-wrap">
              <div className="wc wc-x" onClick={() => window.closeWin?.('ws')}></div>
              <div className="wc wc-m" onClick={() => window.closeWin?.('ws')}></div>
              <div className="wc wc-z"></div>
            </div>
            <div className="win-title-text">neofetch --skills-diagnostic</div>
          </div>
          <div className="win-body">
            <div className="sk-body">
              <div className="sk-cat">
                <div className="sk-ct">▸ LANGUAGES</div>
                <div className="sk-row">
                  <span className="sk-nm">Python</span>
                  <div className="sk-bar">
                    <div className="sk-fill" data-p="88" style={{ background: 'linear-gradient(90deg,#004d14,var(--green))' }}></div>
                  </div>
                  <span className="sk-pct">88%</span>
                </div>
                <div className="sk-row">
                  <span className="sk-nm">C++</span>
                  <div className="sk-bar">
                    <div className="sk-fill" data-p="82" style={{ background: 'linear-gradient(90deg,#004d14,var(--green))' }}></div>
                  </div>
                  <span className="sk-pct">82%</span>
                </div>
                <div className="sk-row">
                  <span className="sk-nm">JavaScript</span>
                  <div className="sk-bar">
                    <div className="sk-fill" data-p="80" style={{ background: 'linear-gradient(90deg,#004d14,var(--green))' }}></div>
                  </div>
                  <span className="sk-pct">80%</span>
                </div>
                <div className="sk-row">
                  <span className="sk-nm">Java</span>
                  <div className="sk-bar">
                    <div className="sk-fill" data-p="70" style={{ background: 'linear-gradient(90deg,#004d14,var(--green))' }}></div>
                  </div>
                  <span className="sk-pct">70%</span>
                </div>
                <div className="sk-row">
                  <span className="sk-nm">SQL / Bash</span>
                  <div className="sk-bar">
                    <div className="sk-fill" data-p="75" style={{ background: 'linear-gradient(90deg,#004d14,var(--green))' }}></div>
                  </div>
                  <span className="sk-pct">75%</span>
                </div>
              </div>
              <div className="sk-cat">
                <div className="sk-ct">▸ WEB &amp; FRAMEWORKS</div>
                <div className="sk-row">
                  <span className="sk-nm">React / TypeScript</span>
                  <div className="sk-bar">
                    <div className="sk-fill" data-p="85" style={{ background: 'linear-gradient(90deg,#004d7a,#00ccff)' }}></div>
                  </div>
                  <span className="sk-pct">85%</span>
                </div>
                <div className="sk-row">
                  <span className="sk-nm">Tailwind CSS</span>
                  <div className="sk-bar">
                    <div className="sk-fill" data-p="80" style={{ background: 'linear-gradient(90deg,#004d7a,#00ccff)' }}></div>
                  </div>
                  <span className="sk-pct">80%</span>
                </div>
                <div className="sk-row">
                  <span className="sk-nm">HTML5 / CSS3</span>
                  <div className="sk-bar">
                    <div className="sk-fill" data-p="87" style={{ background: 'linear-gradient(90deg,#004d7a,#00ccff)' }}></div>
                  </div>
                  <span className="sk-pct">87%</span>
                </div>
              </div>
              <div className="sk-cat">
                <div className="sk-ct">▸ DATABASES &amp; TOOLS</div>
                <div className="sk-row">
                  <span className="sk-nm">PostgreSQL</span>
                  <div className="sk-bar">
                    <div className="sk-fill" data-p="78" style={{ background: 'linear-gradient(90deg,#4d0080,var(--purple))' }}></div>
                  </div>
                  <span className="sk-pct">78%</span>
                </div>
                <div className="sk-row">
                  <span className="sk-nm">MongoDB Atlas</span>
                  <div className="sk-bar">
                    <div className="sk-fill" data-p="72" style={{ background: 'linear-gradient(90deg,#4d0080,var(--purple))' }}></div>
                  </div>
                  <span className="sk-pct">72%</span>
                </div>
                <div className="sk-row">
                  <span className="sk-nm">Git / Linux</span>
                  <div className="sk-bar">
                    <div className="sk-fill" data-p="86" style={{ background: 'linear-gradient(90deg,#4d0080,var(--purple))' }}></div>
                  </div>
                  <span className="sk-pct">86%</span>
                </div>
                <div className="sk-row">
                  <span className="sk-nm">Supabase</span>
                  <div className="sk-bar">
                    <div className="sk-fill" data-p="68" style={{ background: 'linear-gradient(90deg,#4d0080,var(--purple))' }}></div>
                  </div>
                  <span className="sk-pct">68%</span>
                </div>
              </div>
              <div className="sk-cat">
                <div className="sk-ct">▸ AI / ML (ACTIVE LEARNING)</div>
                <div className="sk-row">
                  <span className="sk-nm">ML Fundamentals</span>
                  <div className="sk-bar">
                    <div className="sk-fill" data-p="65" style={{ background: 'linear-gradient(90deg,#806600,var(--amber))' }}></div>
                  </div>
                  <span className="sk-pct">65%</span>
                </div>
                <div className="sk-row">
                  <span className="sk-nm">Gemini / LLM APIs</span>
                  <div className="sk-bar">
                    <div className="sk-fill" data-p="72" style={{ background: 'linear-gradient(90deg,#806600,var(--amber))' }}></div>
                  </div>
                  <span className="sk-pct">72%</span>
                </div>
                <div className="sk-row">
                  <span className="sk-nm">DSA / Algorithms</span>
                  <div className="sk-bar">
                    <div className="sk-fill" data-p="84" style={{ background: 'linear-gradient(90deg,#806600,var(--amber))' }}></div>
                  </div>
                  <span className="sk-pct">84%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="win" id="wc">
          <div className="win-tb" onMouseDown={(e) => window.startDrag?.(e, 'wc')}>
            <div className="wc-wrap">
              <div className="wc wc-x" onClick={() => window.closeWin?.('wc')}></div>
              <div className="wc wc-m" onClick={() => window.closeWin?.('wc')}></div>
              <div className="wc wc-z"></div>
            </div>
            <div className="win-title-text">cat ~/certifications.log — [3 records found]</div>
          </div>
          <div className="win-body">
            <div className="certs">
              {CERTS.map((cert) => (
                <div className="cert" key={cert.title}>
                  <div className="ci">{cert.issuer}</div>
                  <div className="cn">{cert.title}</div>
                  <div className="cm">{cert.credential}</div>
                  {cert.verifyUrl ? (
                    <div className="cert-actions">
                      <a className="plbtn cert-link" href={cert.verifyUrl} target="_blank" rel="noreferrer">
                        verify ↗
                      </a>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="win" id="wb">
          <div className="win-tb" onMouseDown={(e) => window.startDrag?.(e, 'wb')}>
            <div className="wc-wrap">
              <div className="wc wc-x" onClick={() => window.closeWin?.('wb')}></div>
              <div className="wc wc-m" onClick={() => window.closeWin?.('wb')}></div>
              <div className="wc wc-z"></div>
            </div>
            <div className="win-title-text">cat ~/case_studies.log — [auto-refresh 24h]</div>
          </div>
          <div className="win-body">
            <div className="blog">
              <div className="blog-hint">// curated open source case studies (top 4)</div>
              {blogStatus === 'error' ? (
                <div className="blog-empty">Feed unavailable. Try again later.</div>
              ) : null}
              {blogStatus === 'loading' ? (
                <div className="blog-empty">Loading feed...</div>
              ) : null}
              {blogStatus === 'ready' && blogPosts.length === 0 ? (
                <div className="blog-empty">No entries available.</div>
              ) : null}
              {blogPosts.map((post) => (
                <div className="blog-item" key={post.url}>
                  <div className="blog-top">
                    <div className="blog-title">{post.title}</div>
                    <div className="blog-meta">{post.source} · {post.date}</div>
                  </div>
                  <div className="blog-desc">{post.description}</div>
                  <div className="blog-actions">
                    <a className="plbtn blog-link" href={post.url} target="_blank" rel="noreferrer">
                      read ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="win" id="wg">
          <div className="win-tb" onMouseDown={(e) => window.startDrag?.(e, 'wg')}>
            <div className="wc-wrap">
              <div className="wc wc-x" onClick={() => window.closeWin?.('wg')}></div>
              <div className="wc wc-m" onClick={() => window.closeWin?.('wg')}></div>
              <div className="wc wc-z"></div>
            </div>
            <div className="win-title-text">curl api.github.com/users/Dani-Bytes</div>
          </div>
          <div className="win-body">
            <div className="gh">
              <div className="gh-top">
                <div className="gh-av">
                  {ghProfile.avatarUrl ? (
                    <img src={ghProfile.avatarUrl} alt="" />
                  ) : (
                    <span>{ghInitials || 'DQ'}</span>
                  )}
                </div>
                <div>
                  <div className="gh-nm">{ghProfile.name}</div>
                  <div className="gh-hn">@{ghProfile.login}</div>
                  <div style={{ marginTop: '8px' }}>
                    <button className="plbtn" onClick={() => window.open(ghProfile.htmlUrl, '_blank')}>
                      $ open github.com/{ghProfile.login} ↗
                    </button>
                  </div>
                </div>
              </div>
              <div className="gh-sg">
                <div className="gh-sc">
                  <span className="gh-sn" id="rc">
                    {ghStats.repos}
                  </span>
                  <span className="gh-sl">repos</span>
                </div>
                <div className="gh-sc">
                  <span className="gh-sn" id="cc">
                    {ghStats.contributions}
                  </span>
                  <span className="gh-sl">contribs</span>
                </div>
                <div className="gh-sc">
                  <span className="gh-sn" id="sc2">
                    {ghStats.streak}
                  </span>
                  <span className="gh-sl">day streak</span>
                </div>
                <div className="gh-sc">
                  <span className="gh-sn">{ghStats.followers}</span>
                  <span className="gh-sl">followers</span>
                </div>
              </div>
              <div className="cg-label">// contribution graph — last 52 weeks</div>
              <div className="cg" id="cgrid">
                {contribDays.length ? (
                  contribDays.map((day) => (
                    <div
                      key={day.date}
                      className="cday"
                      title={`${day.date} · ${day.count} contributions`}
                      style={{ background: day.color }}
                    ></div>
                  ))
                ) : (
                  <div className="cday" style={{ background: '#0a150a' }}></div>
                )}
              </div>
              <div className="lb-wrap">
                <div className="lb-label">// language distribution</div>
                <div className="lb-row">
                  <span className="lb-name">Python</span>
                  <div className="lb-bar">
                    <div className="lb-fill" data-w="38" style={{ background: '#3776ab' }}></div>
                  </div>
                  <span className="lb-pct">38%</span>
                </div>
                <div className="lb-row">
                  <span className="lb-name">C++</span>
                  <div className="lb-bar">
                    <div className="lb-fill" data-w="28" style={{ background: '#f34b7d' }}></div>
                  </div>
                  <span className="lb-pct">28%</span>
                </div>
                <div className="lb-row">
                  <span className="lb-name">TypeScript</span>
                  <div className="lb-bar">
                    <div className="lb-fill" data-w="22" style={{ background: '#3178c6' }}></div>
                  </div>
                  <span className="lb-pct">22%</span>
                </div>
                <div className="lb-row">
                  <span className="lb-name">Bash</span>
                  <div className="lb-bar">
                    <div className="lb-fill" data-w="12" style={{ background: '#89e051' }}></div>
                  </div>
                  <span className="lb-pct">12%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="win" id="wco">
          <div className="win-tb" onMouseDown={(e) => window.startDrag?.(e, 'wco')}>
            <div className="wc-wrap">
              <div className="wc wc-x" onClick={() => window.closeWin?.('wco')}></div>
              <div className="wc wc-m" onClick={() => window.closeWin?.('wco')}></div>
              <div className="wc wc-z"></div>
            </div>
            <div className="win-title-text">sendmail — secure encrypted channel</div>
          </div>
          <div className="win-body">
            <div className="co">
              <div style={{ color: 'var(--text3)', fontSize: '10px', marginBottom: '10px' }}>
                // establishing end-to-end encrypted session...
              </div>
              <div className="co-ln">
                <span>EMAIL:</span> daniyalqureshi164@gmail.com
              </div>
              <div className="co-ln">
                <span>PHONE:</span> +92-346-1706663
              </div>
              <div className="co-ln">
                <span>GITHUB:</span>
                <span className="lnk" onClick={() => window.open('https://github.com/Dani-Bytes', '_blank')}>
                  Dani-Bytes ↗
                </span>
              </div>
              <div className="co-ln">
                <span>LINKEDIN:</span>
                <span className="lnk" onClick={() => window.open('https://linkedin.com/in/daniyal-qureshi-b81016334', '_blank')}>
                  daniyal-qureshi ↗
                </span>
              </div>
              <div className="co-ln">
                <span>LOCATION:</span> Islamabad, Pakistan 🇵🇰
              </div>
              <hr className="co-sep" />
              <div className="co-form">
                <div className="co-fl">
                  <label htmlFor="co-from">FROM: (your email)</label>
                  <input id="co-from" type="text" placeholder="you@email.com" />
                </div>
                <div className="co-fl">
                  <label htmlFor="co-msg">MESSAGE:</label>
                  <textarea id="co-msg" rows="3" placeholder="Hello Daniyal, I'd like to connect..."></textarea>
                </div>
                <button className="co-sub" onClick={() => window.sendMsg?.()}>
                  [ ENCRYPT &amp; TRANSMIT ↵ ]
                </button>
                <div id="co-status"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="win" id="wach">
          <div className="win-tb" onMouseDown={(e) => window.startDrag?.(e, 'wach')}>
            <div className="wc-wrap">
              <div className="wc wc-x" onClick={() => window.closeWin?.('wach')}></div>
              <div className="wc wc-m" onClick={() => window.closeWin?.('wach')}></div>
              <div className="wc wc-z"></div>
            </div>
            <div className="win-title-text">sudo cat /etc/honors — root access granted</div>
          </div>
          <div className="win-body">
            <div className="ach">
              <div style={{ fontSize: '10px', color: 'var(--amber)', marginBottom: '4px' }}>
                [sudo] password accepted — 2 records found in honors database
              </div>
              <div className="ac gold">
                <div className="ac-icon">🏆</div>
                <div>
                  <div className="ac-title">Merit Scholarship</div>
                  <div className="ac-desc">
                    Bahria University Islamabad — Awarded for achieving outstanding academic CGPA. Currently ongoing throughout all semesters of the degree program.
                  </div>
                </div>
              </div>
              <div className="ac purple">
                <div className="ac-icon">💻</div>
                <div>
                  <div className="ac-title">Prime Minister Laptop Scheme</div>
                  <div className="ac-desc">
                    National award granted by the Government of Pakistan to top-performing university students. Recognized for exceptional academic excellence.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {modalState.open ? (
          <div id="modal" onClick={closeModal}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-head">
                <div className="modal-title">{modalState.project?.name || 'Project'}</div>
                <button className="modal-close" onClick={closeModal}>
                  close
                </button>
              </div>
              <div className="modal-body">
                {modalState.loading ? <div className="modal-status">Loading README...</div> : null}
                {modalState.error ? <div className="modal-status error">{modalState.error}</div> : null}
                {!modalState.loading && !modalState.error ? (
                  <div className="modal-content" dangerouslySetInnerHTML={{ __html: modalState.content }}></div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        <div id="dock">
          <div className="dk" id="dk-wt" onClick={() => window.openWin?.('wt')}>
            <span className="dk-icon">⌨</span>
            <span>{'>_'}</span>
            <div className="dk-dot"></div>
            <span className="dk-tip">Terminal</span>
          </div>
          <div className="dk" id="dk-wa" onClick={() => window.openWin?.('wa')}>
            <span className="dk-icon">👤</span>
            <span>about</span>
            <div className="dk-dot"></div>
            <span className="dk-tip">About Me</span>
          </div>
          <div className="dk" id="dk-wp" onClick={() => window.openWin?.('wp')}>
            <span className="dk-icon">📁</span>
            <span>proj</span>
            <div className="dk-dot"></div>
            <span className="dk-tip">Projects</span>
          </div>
          <div className="dk" id="dk-ws" onClick={() => window.openWin?.('ws')}>
            <span className="dk-icon">⚡</span>
            <span>skills</span>
            <div className="dk-dot"></div>
            <span className="dk-tip">Skills</span>
          </div>
          <div className="dk" id="dk-wc" onClick={() => window.openWin?.('wc')}>
            <span className="dk-icon">🎖</span>
            <span>certs</span>
            <div className="dk-dot"></div>
            <span className="dk-tip">Certifications</span>
          </div>
          <div className="dk" id="dk-wb" onClick={() => window.openWin?.('wb')}>
            <span className="dk-icon">📰</span>
            <span>blog</span>
            <div className="dk-dot"></div>
            <span className="dk-tip">Case Studies</span>
          </div>
          <div className="dk" id="dk-wg" onClick={() => window.openWin?.('wg')}>
            <span className="dk-icon">⬡</span>
            <span>github</span>
            <div className="dk-dot"></div>
            <span className="dk-tip">GitHub</span>
          </div>
          <div className="dk" id="dk-wach" onClick={() => window.openWin?.('wach')}>
            <span className="dk-icon">🏆</span>
            <span>honors</span>
            <div className="dk-dot"></div>
            <span className="dk-tip">Achievements</span>
          </div>
          <div className="dk" id="dk-wco" onClick={() => window.openWin?.('wco')}>
            <span className="dk-icon">✉</span>
            <span>contact</span>
            <div className="dk-dot"></div>
            <span className="dk-tip">Contact</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
