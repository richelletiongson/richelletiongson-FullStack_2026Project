'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/all';

type Category = {
  value: string;
  label: string;
  description?: string;
  accent?: string; // CSS color
};

type Props = {
  categories: Category[];
  selectedValue: string;
  onSelect: (value: string) => void;
};

type Playhead = { offset: number };

const spacing = 0.12;
const defaultAccents = ['#cdb4ff', '#ffe08a', '#ffb3d9'] as const;

function buildSeamlessLoop(
  items: Element[],
  itemSpacing: number,
  animateFunc: (el: Element) => gsap.core.Timeline
) {
  const overlap = Math.ceil(1 / itemSpacing);
  const startTime = items.length * itemSpacing + 0.5;
  const loopTime = (items.length + overlap) * itemSpacing + 1;

  const rawSequence = gsap.timeline({ paused: true });
  const seamlessLoop = gsap.timeline({
    paused: true,
    repeat: -1,
    onRepeat() {
      // Workaround rare edge case in older GSAP; harmless now.
      const t = this as unknown as { _time: number; _dur: number; _tTime: number };
      if (t._time === t._dur) t._tTime += t._dur - 0.01;
    },
  });

  const l = items.length + overlap * 2;
  for (let i = 0; i < l; i += 1) {
    const index = i % items.length;
    const time = i * itemSpacing;
    rawSequence.add(animateFunc(items[index]), time);
    if (i <= items.length) seamlessLoop.add(`label${i}`, time);
  }

  rawSequence.time(startTime);
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
    );

  return seamlessLoop;
}

export default function CategoryCardSlider({ categories, selectedValue, onSelect }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const proxyRef = useRef<HTMLDivElement | null>(null);
  const scrollToOffsetRef = useRef<((offset: number) => void) | null>(null);
  const currentOffsetRef = useRef(0);

  // Duplicate the list once so the loop feels richer with only 5 cards.
  const loopCategories = useMemo(() => [...categories, ...categories], [categories]);

  useEffect(() => {
    if (!rootRef.current || !proxyRef.current) return;

    gsap.registerPlugin(Draggable);

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.ccs-cards li', rootRef.current) as HTMLElement[];
      if (cards.length === 0) return;

      // Smaller travel range so side cards remain more visible.
      gsap.set(cards, { xPercent: 320, opacity: 0, scale: 0 });

      const animateFunc = (element: Element) => {
        const tl = gsap.timeline();
        tl.fromTo(
          element,
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
          element,
          { xPercent: 320 },
          { xPercent: -320, duration: 1, ease: 'none', immediateRender: false },
          0
        );
        return tl;
      };

      const seamlessLoop = buildSeamlessLoop(cards, spacing, animateFunc);
      const playhead: Playhead = { offset: 0 };
      const wrapTime = gsap.utils.wrap(0, seamlessLoop.duration());
      const snapTime = gsap.utils.snap(spacing);

      const scrub = gsap.to(playhead, {
        offset: 0,
        onUpdate() {
          seamlessLoop.time(wrapTime(playhead.offset));
          currentOffsetRef.current = playhead.offset;
        },
        duration: 0.45,
        ease: 'power3',
        paused: true,
      });

      const scrollToOffset = (offset: number) => {
        scrub.vars.offset = snapTime(offset);
        scrub.invalidate().restart();
      };
      scrollToOffsetRef.current = scrollToOffset;

      Draggable.create(proxyRef.current!, {
        type: 'x',
        trigger: rootRef.current!.querySelector('.ccs-cards') as Element,
        onPress: function onPress() {
          currentOffsetRef.current = scrub.vars.offset;
        },
        onDrag: function onDrag() {
          const d = this as unknown as { startX: number; x: number };
          scrub.vars.offset = currentOffsetRef.current + (d.startX - d.x) * 0.0012;
          scrub.invalidate().restart();
        },
        onDragEnd: function onDragEnd() {
          scrollToOffset(scrub.vars.offset);
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const handlePrev = useCallback(() => {
    scrollToOffsetRef.current?.(currentOffsetRef.current - spacing);
  }, []);

  const handleNext = useCallback(() => {
    scrollToOffsetRef.current?.(currentOffsetRef.current + spacing);
  }, []);

  return (
    <div ref={rootRef} className="ccs-root" aria-label="Choose a category">
      <div className="ccs-gallery" role="group" aria-roledescription="carousel">
        <ul className="ccs-cards" aria-label="Categories">
          {loopCategories.map((c, idx) => {
            const isSelected = selectedValue === c.value;
            const fallbackAccent = defaultAccents[idx % defaultAccents.length];
            return (
              <li
                key={`${c.value}-${idx}`}
                data-value={c.value}
                className={`ccs-card ${isSelected ? 'ccs-card--selected' : ''}`}
                style={
                  {
                    // CSS custom props so styling stays in CSS.
                    ['--ccs-accent' as never]: c.accent ?? fallbackAccent,
                  } as React.CSSProperties
                }
              >
                <button
                  type="button"
                  className="ccs-cardButton"
                  onClick={() => onSelect(c.value)}
                  aria-pressed={isSelected}
                >
                  <span className="ccs-cardLabel">{c.label}</span>
                  {c.description ? <span className="ccs-cardDesc">{c.description}</span> : null}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="ccs-actions" aria-label="Slider controls">
          <button type="button" className="ccs-navBtn" onClick={handlePrev} aria-label="Previous">
            ←
          </button>
          <button type="button" className="ccs-navBtn" onClick={handleNext} aria-label="Next">
            →
          </button>
        </div>
      </div>

      <div ref={proxyRef} className="ccs-dragProxy" aria-hidden="true" />
    </div>
  );
}

