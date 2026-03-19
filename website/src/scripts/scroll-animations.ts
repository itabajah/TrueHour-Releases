import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initScrollAnimations() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);

  // ── Hero elements: immediate entrance ──
  const heroElements = document.querySelectorAll('[data-animate="hero"]');
  gsap.fromTo(
    heroElements,
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.3 }
  );

  // ── Fade-up sections ──
  document.querySelectorAll('[data-animate="fade-up"]').forEach((el) => {
    gsap.fromTo(
      el,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          end: "bottom 5%",
          toggleActions: "play reverse play reverse",
        },
      }
    );
  });

  // ── Staggered card groups ──
  const staggerGroups = new Map<Element, Element[]>();
  document.querySelectorAll('[data-animate="stagger-up"]').forEach((el) => {
    const parent = el.parentElement;
    if (!parent) return;
    if (!staggerGroups.has(parent)) staggerGroups.set(parent, []);
    staggerGroups.get(parent)!.push(el);
  });

  staggerGroups.forEach((children, parent) => {
    gsap.fromTo(
      children,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: parent,
          start: "top 88%",
          end: "bottom 5%",
          toggleActions: "play reverse play reverse",
        },
      }
    );
  });
}
