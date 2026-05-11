const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");
const siteHeader = document.querySelector(".site-header");

const syncHeaderState = () => {
  if (!siteHeader) {
    return;
  }

  const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  siteHeader.classList.toggle("is-scrolled", scrollTop > 8);
};

const syncViewportOffset = () => {
  const viewportTop = window.visualViewport?.offsetTop || 0;
  document.documentElement.style.setProperty("--viewport-top-offset", `${viewportTop}px`);
};

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    siteHeader?.classList.toggle("is-menu-open", isOpen);
  });

  mainNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      mainNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      siteHeader?.classList.remove("is-menu-open");
    }
  });
}

syncViewportOffset();
syncHeaderState();
window.addEventListener("scroll", syncHeaderState, { passive: true });
document.addEventListener("scroll", syncHeaderState, { passive: true });
window.addEventListener("touchmove", syncHeaderState, { passive: true });
window.addEventListener("resize", () => {
  syncViewportOffset();
  syncHeaderState();
}, { passive: true });
window.visualViewport?.addEventListener("resize", syncViewportOffset, { passive: true });
window.visualViewport?.addEventListener("scroll", syncViewportOffset, { passive: true });

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => {
    const isAboveFold = item.getBoundingClientRect().top < window.innerHeight * 0.95;
    if (isAboveFold) {
      item.classList.add("is-visible");
      return;
    }

    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const heroPhotoCards = Array.from(document.querySelectorAll(".hero-photo-card"));
const heroPhotoPositions = ["is-front", "is-left", "is-right"];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let heroPhotoOffset = 0;

if (heroPhotoCards.length > 1 && !prefersReducedMotion) {
  window.setInterval(() => {
    heroPhotoOffset = (heroPhotoOffset + 1) % heroPhotoCards.length;

    heroPhotoCards.forEach((card, index) => {
      card.classList.remove(...heroPhotoPositions);
      const nextPosition = heroPhotoPositions[(index + heroPhotoOffset) % heroPhotoPositions.length];
      card.classList.add(nextPosition);
    });
  }, 3200);
}

window.addEventListener("load", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
