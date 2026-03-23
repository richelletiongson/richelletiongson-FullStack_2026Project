'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef } from 'react';

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

const defaultAccents = ['#cdb4ff', '#ffe08a', '#ffb3d9', '#9a7cf6'] as const;

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

function getCategoryImageSrc(categoryValue: string) {
  const key = normalizeKey(categoryValue);
  const map: Record<string, string> = {
    love: '/images/Love.png',
    health: '/images/Health.png',
    family: '/images/Family.png',
    career: '/images/Career.png',
    money: '/images/Money.png',
  };
  return map[key] ?? null;
}

export default function CategoryCardSlider({ categories, selectedValue, onSelect }: Props) {
  const listRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const selectedIndex = useMemo(() => {
    const idx = categories.findIndex((c) => c.value === selectedValue);
    return idx >= 0 ? idx : 0;
  }, [categories, selectedValue]);

  const scrollToIndex = useCallback(
    (idx: number, behavior: ScrollBehavior = 'smooth') => {
      const item = itemRefs.current[idx];
      if (!item) return;
      item.scrollIntoView({ behavior, block: 'nearest', inline: 'center' });
    },
    []
  );

  useEffect(() => {
      // Keep the selected card centered.
      scrollToIndex(selectedIndex, 'auto');
  }, [scrollToIndex, selectedIndex]);

  const handlePrev = useCallback(() => {
    const nextIndex = (selectedIndex - 1 + categories.length) % categories.length;
    onSelect(categories[nextIndex]!.value);
    scrollToIndex(nextIndex);
  }, [categories, onSelect, scrollToIndex, selectedIndex]);

  const handleNext = useCallback(() => {
    const nextIndex = (selectedIndex + 1) % categories.length;
    onSelect(categories[nextIndex]!.value);
    scrollToIndex(nextIndex);
  }, [categories, onSelect, scrollToIndex, selectedIndex]);

  return (
    <div className="ccs-root" aria-label="Choose a category">
      <div className="ccs-gallery" role="group" aria-roledescription="carousel">
        <button type="button" className="ccs-navBtn" onClick={handlePrev} aria-label="Previous">
          ←
        </button>
        <ul ref={listRef} className="ccs-cards" aria-label="Categories">
          {categories.map((c, idx) => {
            const isSelected = idx === selectedIndex;
            const fallbackAccent = defaultAccents[idx % defaultAccents.length];
            const imgSrc = getCategoryImageSrc(c.value);
            return (
              <li
                key={`${c.value}-${idx}`}
                data-value={c.value}
                className={`ccs-card ${isSelected ? 'ccs-card--selected' : ''}`}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
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
                  {imgSrc ? (
                    <span className="ccs-cardImageWrap" aria-hidden="true">
                      <Image src={imgSrc} alt="" fill sizes="220px" className="ccs-cardImage" />
                    </span>
                  ) : (
                    <span className="ccs-cardLabel">{c.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        <button type="button" className="ccs-navBtn" onClick={handleNext} aria-label="Next">
          →
        </button>
      </div>
    </div>
  );
}

