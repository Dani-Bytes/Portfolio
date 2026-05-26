import { useEffect, useRef } from 'react'

function App() {
  const initRef = useRef(false)

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
          initContrib()
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
      animCount('rc', 0, 12, 1200)
      animCount('cc', 0, 127, 1500)
      animCount('sc2', 0, 14, 900)
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

    // CONTRIBUTIONS
    function initContrib() {
      const g = document.getElementById('cgrid')
      if (!g) return
      const lvs = ['#0a150a', '#0d3d15', '#14662a', '#1a9940', '#22cc55']
      for (let i = 0; i < 364; i++) {
        const d = document.createElement('div')
        d.className = 'cday'
        const r = Math.random()
        const lv = r < 0.5 ? 0 : r < 0.65 ? 1 : r < 0.78 ? 2 : r < 0.9 ? 3 : 4
        d.style.background = lvs[lv]
        g.appendChild(d)
      }
    }

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
                total 3 classified modules  ·  drwxr-xr-x
              </div>

              <div className="pj">
                <div className="ph">
                  <span className="pn">⬡ FYP Management System</span>
                  <span className="ps">● DEPLOYED</span>
                </div>
                <div className="pd">
                  Full-scale web platform managing Final Year Projects across 5 role-based dashboards — Students, Supervisors, Coordinators, HOD & Evaluators. Real-time data visualizations, modular React+TS frontend, proposal → peer eval → defense → grade workflow.
                </div>
                <div className="ptags">
                  <span className="tag">React</span>
                  <span className="tag">TypeScript</span>
                  <span className="tag">Tailwind CSS</span>
                  <span className="tag">Full-Stack</span>
                  <span className="tag">Role-Based Auth</span>
                </div>
                <div className="plinks">
                  <button className="plbtn" onClick={() => window.open('https://github.com/Dani-Bytes', '_blank')}>
                    $ git clone ↗
                  </button>
                  <button className="plbtn" style={{ color: 'var(--green)', borderColor: 'var(--green3)' }}>
                    $ ./launch_demo
                  </button>
                </div>
              </div>

              <div className="pj">
                <div className="ph">
                  <span className="pn">⬡ CyberBank — AI Banking System</span>
                  <span className="ps">● ACTIVE</span>
                </div>
                <div className="pd">
                  Terminal banking system integrated with Google Gemini API for natural language queries. Async voice feedback via FCFS priority queue (gTTS) with non-blocking UI. Applies OS concepts: process management, concurrency, IPC, file-based persistence.
                </div>
                <div className="ptags">
                  <span className="tag">Python</span>
                  <span className="tag">Bash</span>
                  <span className="tag">Gemini API</span>
                  <span className="tag">Linux</span>
                  <span className="tag">AI/NLP</span>
                  <span className="tag">OS Concepts</span>
                </div>
                <div className="plinks">
                  <button className="plbtn" onClick={() => window.open('https://github.com/Dani-Bytes', '_blank')}>
                    $ git clone ↗
                  </button>
                </div>
              </div>

              <div className="pj">
                <div className="ph">
                  <span className="pn">⬡ Code Carnival — DSA Gaming Platform</span>
                  <span className="ps">● STABLE</span>
                </div>
                <div className="pd">
                  Multi-game terminal platform: Chess (Minimax + Alpha-Beta Pruning), Maze Runner (BFS/DFS), Battleship, Snake & Flappy Bird — each backed by a purpose-specific data structure. Relational DB with stored procedures & triggers for leaderboards.
                </div>
                <div className="ptags">
                  <span className="tag">C++</span>
                  <span className="tag">DSA</span>
                  <span className="tag">Minimax</span>
                  <span className="tag">BFS/DFS</span>
                  <span className="tag">Dijkstra</span>
                  <span className="tag">PostgreSQL</span>
                </div>
                <div className="plinks">
                  <button className="plbtn" onClick={() => window.open('https://github.com/Dani-Bytes', '_blank')}>
                    $ git clone ↗
                  </button>
                </div>
              </div>
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
              <div className="cert">
                <div className="ci">Coursera / DeepLearning.AI — Andrew Ng</div>
                <div className="cn">AI For Everyone</div>
                <div className="cm">Certificate of Completion</div>
              </div>
              <div className="cert">
                <div className="ci">Coursera / Johns Hopkins University</div>
                <div className="cn">HTML, CSS &amp; JavaScript for Web Developers</div>
                <div className="cm">Certificate of Completion</div>
              </div>
              <div className="cert">
                <div className="ci">Coursera / IBM</div>
                <div className="cn">Python for Data Science, AI &amp; Development</div>
                <div className="cm">Certificate of Completion</div>
              </div>
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
                <div className="gh-av">DQ</div>
                <div>
                  <div className="gh-nm">Muhammad Daniyal Qureshi</div>
                  <div className="gh-hn">@Dani-Bytes</div>
                  <div style={{ marginTop: '8px' }}>
                    <button className="plbtn" onClick={() => window.open('https://github.com/Dani-Bytes', '_blank')}>
                      $ open github.com/Dani-Bytes ↗
                    </button>
                  </div>
                </div>
              </div>
              <div className="gh-sg">
                <div className="gh-sc">
                  <span className="gh-sn" id="rc">
                    0
                  </span>
                  <span className="gh-sl">repos</span>
                </div>
                <div className="gh-sc">
                  <span className="gh-sn" id="cc">
                    0
                  </span>
                  <span className="gh-sl">commits</span>
                </div>
                <div className="gh-sc">
                  <span className="gh-sn" id="sc2">
                    0
                  </span>
                  <span className="gh-sl">day streak</span>
                </div>
                <div className="gh-sc">
                  <span className="gh-sn">3</span>
                  <span className="gh-sl">projects</span>
                </div>
              </div>
              <div className="cg-label">// contribution graph — last 52 weeks</div>
              <div className="cg" id="cgrid"></div>
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
