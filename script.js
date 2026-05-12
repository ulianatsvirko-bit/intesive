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
const scheduleSection = document.querySelector(".schedule");
const scheduleToggle = document.querySelector("[data-schedule-toggle]");
const scheduleSwitchButtons = Array.from(document.querySelectorAll("[data-schedule-target]"));
const schedulePanels = Array.from(document.querySelectorAll("[data-schedule-panel]"));
const desktopScheduleQuery = window.matchMedia("(min-width: 1024px)");

const setScheduleExpanded = (isExpanded, shouldScroll = false) => {
  if (!scheduleSection || !scheduleToggle) {
    return;
  }

  scheduleSection.classList.toggle("is-collapsed", !isExpanded);
  scheduleToggle.classList.toggle("is-open", isExpanded);
  scheduleToggle.setAttribute("aria-expanded", String(isExpanded));

  if (isExpanded && shouldScroll) {
    window.setTimeout(() => {
      scheduleSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }
};

if (scheduleToggle) {
  scheduleToggle.addEventListener("click", () => {
    const willExpand = scheduleToggle.getAttribute("aria-expanded") !== "true";
    setScheduleExpanded(willExpand, willExpand);
  });
}

document.querySelectorAll('a[href="#schedule"]').forEach((link) => {
  link.addEventListener("click", () => {
    setScheduleExpanded(true);
  });
});

const setActiveSchedule = (target) => {
  if (desktopScheduleQuery.matches) {
    schedulePanels.forEach((panel) => {
      panel.hidden = false;
      panel.classList.add("is-active");
    });
    return;
  }

  scheduleSwitchButtons.forEach((button) => {
    const isActive = button.dataset.scheduleTarget === target;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  schedulePanels.forEach((panel) => {
    panel.hidden = panel.dataset.schedulePanel !== target;
    panel.classList.toggle("is-active", panel.dataset.schedulePanel === target);
  });
};

scheduleSwitchButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveSchedule(button.dataset.scheduleTarget);
  });
});

if (scheduleSwitchButtons.length && schedulePanels.length) {
  setActiveSchedule(scheduleSwitchButtons.find((button) => button.classList.contains("is-active"))?.dataset.scheduleTarget || scheduleSwitchButtons[0].dataset.scheduleTarget);
}

desktopScheduleQuery.addEventListener?.("change", () => {
  setActiveSchedule(scheduleSwitchButtons.find((button) => button.classList.contains("is-active"))?.dataset.scheduleTarget || scheduleSwitchButtons[0]?.dataset.scheduleTarget);
});

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
