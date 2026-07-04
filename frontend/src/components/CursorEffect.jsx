import React, { useEffect, useRef } from 'react';

export default function CursorEffect() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    let ringX = 0, ringY = 0;
    let mouseX = 0, mouseY = 0;

    const handleMove = e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dot) {
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
      }
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (ring) {
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
      }
      requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', handleMove);
    const raf = requestAnimationFrame(animateRing);

    const clickables = document.querySelectorAll('a, button, .card, input, select');
    const grow = () => ring?.classList.add('cursor-ring--grow');
    const shrink = () => ring?.classList.remove('cursor-ring--grow');
    clickables.forEach(el => {
      el.addEventListener('mouseenter', grow);
      el.addEventListener('mouseleave', shrink);
    });

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(raf);
      clickables.forEach(el => {
        el.removeEventListener('mouseenter', grow);
        el.removeEventListener('mouseleave', shrink);
      });
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
}
