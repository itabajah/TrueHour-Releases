declare module "gsap" {
  const gsap: {
    registerPlugin(...plugins: unknown[]): void;
    fromTo(
      targets: gsap.TweenTarget,
      fromVars: Record<string, unknown>,
      toVars: Record<string, unknown>,
    ): unknown;
  };
  namespace gsap {
    type TweenTarget = string | Element | Element[] | NodeListOf<Element> | null;
  }
  export { gsap };
}

declare module "gsap/ScrollTrigger" {
  const ScrollTrigger: {
    create(vars: Record<string, unknown>): unknown;
  };
  export { ScrollTrigger };
}
