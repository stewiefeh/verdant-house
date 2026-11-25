/* Verdant House — doors, light and growth */
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const veil = document.getElementById("veil");
  const head = document.getElementById("siteHead");

  /* header goes solid once you scroll past the hero top */
  const onScroll = () => head.classList.toggle("solid", scrollY > 24);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* mobile menu */
  const toggle = document.querySelector(".nav-toggle");
  if (toggle) toggle.addEventListener("click", () => {
    const open = head.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });

  if (reduce) { veil.remove(); document.querySelector(".hero")?.classList.add("play"); return; }

  const arrived = sessionStorage.getItem("vh-arrive") === "1";
  const seen = sessionStorage.getItem("vh-seen") === "1";
  const panels = veil.querySelectorAll("i");

  if (arrived) {
    /* landing from another page: veil is covering, lift it away upward */
    sessionStorage.removeItem("vh-arrive");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      veil.classList.add("lift");
      document.querySelector(".hero")?.classList.add("play");
      setTimeout(() => veil.remove(), 1100);
    }));
  } else if (seen) {
    /* refresh or direct visit mid-session: a quick quiet lift */
    veil.classList.add("fade");
    setTimeout(() => veil.remove(), 560);
    document.querySelector(".hero")?.classList.add("play");
  } else {
    /* first visit in this session: the doors open */
    sessionStorage.setItem("vh-seen", "1");
    setTimeout(() => {
      veil.classList.add("lift");
      document.querySelector(".hero")?.classList.add("play");
      setTimeout(() => veil.remove(), 1100);
    }, 350);
  }

  /* leaf-curtain wipe when leaving to another page */
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href$=".html"]');
    if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    const to = a.getAttribute("href");
    veil.classList.remove("lift", "fade");
    veil.style.display = "flex";
    panels.forEach(p => { p.style.transform = "translateY(103%)"; p.style.transition = "none"; });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      panels.forEach(p => { p.style.transition = ""; p.style.transform = ""; });
      setTimeout(() => { sessionStorage.setItem("vh-arrive", "1"); location.href = to; }, 780);
    }));
  });

  function revealAll() {
    document.querySelectorAll(".grow, .rise").forEach(el => el.classList.add("in"));
  }
  if (!("IntersectionObserver" in window)) revealAll();

  /* growth on scroll */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.18 });
  document.querySelectorAll(".grow, .rise").forEach(el => io.observe(el));
})();
