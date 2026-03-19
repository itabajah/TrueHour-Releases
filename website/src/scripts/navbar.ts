export function initNavbar(): void {
  const nav = document.getElementById("navbar") as HTMLElement | null;
  const toggle = document.getElementById("mobile-toggle") as HTMLButtonElement | null;
  const menu = document.getElementById("mobile-menu") as HTMLElement | null;

  if (!nav || !toggle || !menu) return;
  if (nav.dataset.navInit === "true") return;
  nav.dataset.navInit = "true";

  const spans = toggle.querySelectorAll("span");
  let open = false;

  const setToggleState = (isOpen: boolean) => {
    if (spans.length < 3) return;

    const first = spans[0] as HTMLElement;
    const middle = spans[1] as HTMLElement;
    const last = spans[2] as HTMLElement;

    first.style.transform = isOpen ? "rotate(45deg) translateY(4px)" : "";
    middle.style.opacity = isOpen ? "0" : "";
    last.style.transform = isOpen ? "rotate(-45deg) translateY(-4px)" : "";
  };

  const closeMenu = () => {
    open = false;
    menu.style.maxHeight = "0";
    toggle.setAttribute("aria-expanded", "false");
    setToggleState(false);
  };

  const openMenu = () => {
    open = true;
    menu.style.maxHeight = `${menu.scrollHeight}px`;
    toggle.setAttribute("aria-expanded", "true");
    setToggleState(true);
  };

  const onScroll = () => {
    if (window.scrollY > 50) {
      nav.style.background = "var(--nav-solid-bg)";
      nav.style.backdropFilter = "blur(20px)";
      nav.style.boxShadow = "0 4px 30px rgba(0,0,0,0.1)";
    } else {
      nav.style.background = "";
      nav.style.backdropFilter = "";
      nav.style.boxShadow = "";
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toggle.addEventListener("click", () => {
    if (open) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && open) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768 && open) {
      closeMenu();
    }
  });

  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.classList.contains("dark");

    if (isDark) {
      html.classList.remove("dark");
      localStorage.setItem("truehour-theme", "light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("truehour-theme", "dark");
    }
  };

  document.getElementById("theme-toggle")?.addEventListener("click", toggleTheme);
  document.getElementById("theme-toggle-mobile")?.addEventListener("click", toggleTheme);
}
