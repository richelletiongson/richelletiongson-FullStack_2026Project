'use client';

import { useEffect, useState } from 'react';

type Props = {
  label: string;
  prediction: string;
};

export default function CookieForecast({ label, prediction }: Props) {
  const [hasPlayed, setHasPlayed] = useState(false);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(false);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    if (!hasPlayed) return;

    setShake(true);
    const flashTimer = setTimeout(() => {
      setFlash(true);
    }, 1600);
    const revealTimer = setTimeout(() => {
      setReveal(true);
    }, 1900);

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(revealTimer);
    };
  }, [hasPlayed]);

  const handleClick = () => {
    if (hasPlayed) return;
    setHasPlayed(true);
  };

  return (
    <section className="cookie-forecast-wrapper">
      <p className="text-sm text-[var(--text-muted)]">{label}</p>
      <h1 className="font-display text-2xl font-bold text-[var(--text)] mt-1 mb-4">
        Your forecast
      </h1>

      <div className="cookie-viewport">
        <div className="cookie-scene">
          <div className="cookie-click-hint">Click the cookie</div>

          {/* Front cookie (asset 2) */}
          <img
            src="/images/asset-2.png"
            alt="Fortune cookie"
            className={`cookie-asset cookie-asset-2 ${shake ? 'cookie-shake' : ''} ${
              flash || reveal ? 'cookie-asset-2-hidden' : ''
            }`}
            onClick={handleClick}
          />

          {/* Blinding light overlay */}
          <div
            className={`cookie-flash-overlay ${
              flash ? 'cookie-flash cookie-flash-active' : ''
            }`}
          />

          {/* Reveal state with Asset 1 and prediction text */}
          <div
            className={`cookie-reveal ${reveal ? 'cookie-reveal-active' : ''}`}
            aria-live="polite"
          >
            <img
              src="/images/asset-1.png"
              alt="Fortune reveal"
              className="cookie-asset cookie-asset-1"
            />
            <div className="cookie-message">{prediction}</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cookie-forecast-wrapper {
          margin-top: 0;
        }

        .cookie-viewport {
          margin-top: 2rem;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .cookie-scene {
          position: relative;
          width: min(100%, 840px);
          aspect-ratio: 16 / 9;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
        }

        .cookie-asset {
          max-width: min(60vw, 420px);
          width: 65%;
          height: auto;
          user-select: none;
          -webkit-user-drag: none;
        }

        .cookie-asset-2 {
          cursor: pointer;
          margin-top: 4%; /* nudge cookie slightly downward */
          filter: drop-shadow(0 16px 32px rgba(0, 0, 0, 0.2));
          transition: transform 0.25s ease, filter 0.25s ease, opacity 0.2s ease;
        }

        .cookie-asset-2-hidden {
          opacity: 0 !important;
          pointer-events: none;
        }

        .cookie-asset-2:hover {
          transform: translateY(-4px) scale(1.03);
          filter: drop-shadow(0 22px 40px rgba(0, 0, 0, 0.3));
        }

        .cookie-asset-2:active {
          transform: scale(0.97);
        }

        .cookie-click-hint {
          position: absolute;
          top: 110%;
          left: 50%;
          transform: translateX(-50%);
          padding: 0.4rem 0.9rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.9);
          color: #a14b2a;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          font-size: 0.75rem;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
          animation: cookie-floatHint 2.4s ease-in-out infinite;
          pointer-events: none;
          z-index: 50;
        }

        .cookie-flash-overlay {
          position: fixed;
          inset: 0;
          opacity: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 40;
        }

        .cookie-flash-overlay::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 10vmin;
          height: 10vmin;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            #ffffff 0,
            #fff8dd 40%,
            rgba(255, 211, 159, 0.5) 65%,
            transparent 100%
          );
          transform: translate(-50%, -50%) scale(0);
          filter: blur(18px);
          pointer-events: none;
        }

        .cookie-reveal {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
        }

        .cookie-asset-1 {
          width: 95%;
          height: auto;
          max-height: 95%;
          object-fit: contain;
          transform: scaleX(-1) scale(1.5);
        }

        .cookie-message {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
          width: min(80%, 36rem);
          font-size: clamp(1.25rem, 2vw, 1.6rem);
          font-weight: 600;
          color: #fff7ea;
          text-shadow: 0 0 12px rgba(0, 0, 0, 0.28), 0 0 40px rgba(255, 255, 255, 0.65);
          letter-spacing: 0.04em;
        }

        .cookie-message::after {
          content: '';
          display: block;
          margin: 0.7rem auto 0;
          width: 80px;
          height: 3px;
          border-radius: 999px;
          background: linear-gradient(90deg, #fff7ea, #ffe08c, #fff7ea);
          box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
        }

        /* Animation states */

        .cookie-shake {
          animation: cookie-shakeBuild 1.8s ease-in-out forwards;
        }

        .cookie-flash-active {
          animation: cookie-flash 2.8s ease-in-out forwards;
        }

        .cookie-flash-active.cookie-flash-overlay::before {
          animation: cookie-flashCircle 2.8s ease-in-out forwards;
        }

        .cookie-reveal-active {
          animation: cookie-fadeIn 0.6s ease-out forwards 0.6s;
        }

        .cookie-reveal-active .cookie-asset-1 {
          animation: cookie-growIn 20s linear forwards;
        }

        .cookie-reveal-active .cookie-message {
          animation: cookie-messagePop 0.75s ease-out forwards 0.4s;
        }

        @keyframes cookie-floatHint {
          0%,
          100% {
            transform: translate(-50%, 0);
          }
          50% {
            transform: translate(-50%, -8px);
          }
        }

        @keyframes cookie-shakeBuild {
          0% {
            transform: translateX(0) rotate(0deg);
          }
          20% {
            transform: translateX(-4px) rotate(-2deg);
          }
          40% {
            transform: translateX(4px) rotate(2deg);
          }
          55% {
            transform: translateX(-10px) rotate(-5deg);
          }
          70% {
            transform: translateX(10px) rotate(5deg);
          }
          80% {
            transform: translateX(-14px) rotate(-7deg);
          }
          90% {
            transform: translateX(14px) rotate(7deg);
          }
          100% {
            transform: translateX(0) rotate(0deg);
          }
        }

        @keyframes cookie-flash {
          0% {
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          60% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes cookie-flashCircle {
          0% {
            transform: translate(-50%, -50%) scale(0);
          }
          25% {
            transform: translate(-50%, -50%) scale(8);
          }
          60% {
            transform: translate(-50%, -50%) scale(16);
          }
          100% {
            transform: translate(-50%, -50%) scale(22);
          }
        }

        @keyframes cookie-fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes cookie-growIn {
          0% {
            transform: scaleX(-1) scale(1.5);
          }
          100% {
            transform: scaleX(-1) scale(2.1);
          }
        }

        @keyframes cookie-messagePop {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @media (max-width: 640px) {
          .cookie-message {
            font-size: 1rem;
          }
        }
      `}</style>
    </section>
  );
}

