// Category card slider using GSAP (no React)
// Expects markup:
// <div class="ccs-root" data-selected="">
//   <div class="ccs-gallery"> <ul class="ccs-cards">...</ul> <div class="ccs-actions">...</div> </div>
// </div>

;(function () {
  if (typeof window === 'undefined') return
  if (!window.gsap) return

  const gsap = window.gsap

  function buildSeamlessLoop(items, itemSpacing, animateFunc) {
    const overlap = Math.ceil(1 / itemSpacing)
    const startTime = items.length * itemSpacing + 0.5
    const loopTime = (items.length + overlap) * itemSpacing + 1

    const rawSequence = gsap.timeline({ paused: true })
    const seamlessLoop = gsap.timeline({
      paused: true,
      repeat: -1,
      onRepeat() {
        const t = this
        if (t._time === t._dur) t._tTime += t._dur - 0.01
      },
    })

    const l = items.length + overlap * 2
    for (let i = 0; i < l; i += 1) {
      const index = i % items.length
      const time = i * itemSpacing
      rawSequence.add(animateFunc(items[index]), time)
      if (i <= items.length) seamlessLoop.add('label' + i, time)
    }

    rawSequence.time(startTime)
    seamlessLoop
      .to(rawSequence, {
        time: loopTime,
        duration: loopTime - startTime,
        ease: 'none',
      })
      .fromTo(
        rawSequence,
        { time: overlap * itemSpacing + 1 },
        {
          time: startTime,
          duration: startTime - (overlap * itemSpacing + 1),
          immediateRender: false,
          ease: 'none',
        }
      )

    return seamlessLoop
  }

  function initCategorySlider() {
    const root = document.querySelector('.ccs-root')
    if (!root) return

    const list = root.querySelector('.ccs-cards')
    if (!list) return

    const cards = Array.from(list.querySelectorAll('li'))
    if (!cards.length) return

    // Duplicate cards to enrich loop when few cards
    const clone = cards.map((card) => card.cloneNode(true))
    clone.forEach((c) => list.appendChild(c))
    const allCards = Array.from(list.querySelectorAll('li'))

    gsap.set(allCards, { xPercent: 320, opacity: 0, scale: 0 })

    const spacing = 0.12

    const animateFunc = (el) => {
      const tl = gsap.timeline()
      tl.fromTo(
        el,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          zIndex: 100,
          duration: 0.5,
          yoyo: true,
          repeat: 1,
          ease: 'power1.in',
          immediateRender: false,
        }
      ).fromTo(
        el,
        { xPercent: 320 },
        { xPercent: -320, duration: 1, ease: 'none', immediateRender: false },
        0
      )
      return tl
    }

    const seamlessLoop = buildSeamlessLoop(allCards, spacing, animateFunc)
    const playhead = { offset: 0 }
    const wrapTime = gsap.utils.wrap(0, seamlessLoop.duration())
    const snapTime = gsap.utils.snap(spacing)

    const scrub = gsap.to(playhead, {
      offset: 0,
      onUpdate() {
        seamlessLoop.time(wrapTime(playhead.offset))
      },
      duration: 0.45,
      ease: 'power3',
      paused: true,
    })

    function scrollToOffset(offset) {
      scrub.vars.offset = snapTime(offset)
      scrub.invalidate().restart()
    }

    const navPrev = root.querySelector('.ccs-navBtn[data-dir="prev"]')
    const navNext = root.querySelector('.ccs-navBtn[data-dir="next"]')

    if (navPrev) {
      navPrev.addEventListener('click', function () {
        scrollToOffset(scrub.vars.offset - spacing)
      })
    }
    if (navNext) {
      navNext.addEventListener('click', function () {
        scrollToOffset(scrub.vars.offset + spacing)
      })
    }

    // Card click -> update selected state & category <select>
    const categorySelect = document.querySelector('select[name="category"]')
    function updateSelected(value) {
      allCards.forEach((card) => {
        if (card.getAttribute('data-value') === value) {
          card.classList.add('ccs-card--selected')
        } else {
          card.classList.remove('ccs-card--selected')
        }
      })
      if (categorySelect) {
        categorySelect.value = value
      }
      root.setAttribute('data-selected', value)
    }

    allCards.forEach((card) => {
      const btn = card.querySelector('.ccs-cardButton')
      if (!btn) return
      btn.addEventListener('click', function () {
        const value = card.getAttribute('data-value')
        if (value) updateSelected(value)
      })
    })

    // Initialize default selection to first card
    const firstValue = allCards[0]?.getAttribute('data-value')
    if (firstValue) updateSelected(firstValue)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCategorySlider)
  } else {
    initCategorySlider()
  }
})()

