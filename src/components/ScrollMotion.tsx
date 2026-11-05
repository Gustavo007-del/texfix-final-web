'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ScrollMotion() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const smooth = new Lenis({ autoRaf: true, anchors: true, lerp: .13 });
    smooth.on('scroll', ScrollTrigger.update);
    return () => smooth.destroy();
  }, []);
  return null;
}
