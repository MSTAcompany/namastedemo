/* ============================================================================
   main.js — рендерит сайт из config.js + мобильный UX (табы расписания, свайпы,
   индикаторы слайдеров, шторка меню).
   ========================================================================== */

(function () {
  "use strict";
  const C = window.CONFIG || CONFIG;
  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const accent = (s) => (s || "").replace(/\|([^|]+)\|/g, '<span class="accent-italic">$1</span>');

  const ICONS = {
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 8-4 12-9 12z"/><path d="M4 20c4-6 8-8 12-9"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 4l2.3 4.9 5.2.7-3.8 3.6.9 5.2L12 16.9 7.4 18.4l.9-5.2L4.5 9.6l5.2-.7z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/><circle cx="12" cy="12" r="2"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 6a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.6"/></svg>',
    lotus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 4c2 3 2 6 0 9-2-3-2-6 0-9z"/><path d="M12 13c3-1 6 0 8 2-3 2-6 2-8 0M12 13c-3-1-6 0-8 2 3 2 6 2 8 0"/></svg>',
  };
  const iconHtml = (key) => ICONS[key] ? ICONS[key] : `<span style="font-size:1.6rem">${key || "•"}</span>`;

  function applyBrand() {
    const c = C.brand.colors || {};
    const r = document.documentElement.style;
    if (c.primary) r.setProperty("--primary", c.primary);
    if (c.accent) r.setProperty("--accent", c.accent);
    if (c.dark) r.setProperty("--dark", c.dark);
    if (c.light) r.setProperty("--light", c.light);
    if (c.bg) r.setProperty("--bg", c.bg);
    if (c.card) r.setProperty("--card", c.card);
    if (c.line) r.setProperty("--line", c.line);
    const f = C.brand.fonts || {};
    if (f.body) r.setProperty("--font", f.body);
    if (f.heading) r.setProperty("--font-heading", f.heading);

    document.title = C.meta.title || C.brand.fullName || C.brand.name;
    const md = $("#meta-description");
    if (md) md.setAttribute("content", C.meta.description || "");
    const bn = $("#brand-name");
    if (bn && !bn.querySelector("img")) bn.textContent = C.brand.name;
    const fn = $("#footer-name");
    if (fn && !fn.querySelector("img")) fn.textContent = C.brand.fullName || C.brand.name;
  }

  function renderHero() {
    const h = C.hero || {};
    if (h.offer) $("#hero-offer").textContent = h.offer;
    $("#hero-title").innerHTML = accent(h.title);
    $("#hero-subtitle").innerHTML = accent(h.subtitle);
    const cta = $("#hero-cta");
    if (cta) {
      cta.textContent = h.ctaText || "Записаться онлайн";
      cta.removeAttribute("href");
      cta.classList.add("btn-disabled");
    }
    const sec = $("#hero-secondary");
    if (h.secondaryText) { sec.innerHTML = h.secondaryText + " →"; if (h.secondaryHref) sec.href = h.secondaryHref; }
    else sec.style.display = "none";

    const info = $("#hero-info");
    (h.info || []).forEach((i) => info.appendChild(el("span", null, `${i.icon || ""} ${i.text}`)));
    if (!(h.info || []).length) info.style.display = "none";

    const img = $("#hero-img");
    if (h.image) img.style.backgroundImage = `url('${h.image}')`;
    else img.style.background = `linear-gradient(135deg, ${C.brand.colors.primary}, ${C.brand.colors.accent})`;
  }

  function renderFeatures() {
    const f = C.features || {};
    const section = $("#features");
    const items = f.items || [];
    if (!items.length) { if (section) section.style.display = "none"; return; }
    if (f.title) $("#features-title").innerHTML = accent(f.title);
    if (f.caption) $("#features-caption").textContent = f.caption;
    const media = document.querySelector(".features-media");
    if (f.image) {
      $("#features-img").style.backgroundImage = `url('${f.image}')`;
    } else {
      if (media) media.style.display = "none";
      const inner = document.querySelector(".features-inner");
      if (inner) inner.classList.add("no-media");
    }
    const grid = $("#features-grid");
    items.forEach((it) => {
      grid.appendChild(el("div", "feature-card",
        `<div class="feature-icon">${iconHtml(it.icon)}</div>
         <h3>${it.title}</h3><p>${it.text}</p>`));
    });
  }

  function bindCarouselDots(gridEl, dotsEl) {
    if (!gridEl || !dotsEl) return;
    const cards = Array.from(gridEl.children);
    if (cards.length < 2) return;
    const dots = cards.map((_, i) => {
      const s = el("span", i === 0 ? "active" : "");
      dotsEl.appendChild(s);
      return s;
    });
    let rafId = null;
    gridEl.addEventListener("scroll", () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const scrollLeft = gridEl.scrollLeft;
        const cardW = cards[0].offsetWidth + 14;
        const idx = Math.min(cards.length - 1, Math.max(0, Math.round(scrollLeft / cardW)));
        dots.forEach((d, i) => d.classList.toggle("active", i === idx));
        rafId = null;
      });
    }, { passive: true });
  }

  function renderClasses() {
    const section = $("#classes");
    const list = C.classes || [];
    if (!list.length) { if (section) section.style.display = "none"; return; }
    if (C.classesTitle) $("#classes-title").innerHTML = accent(C.classesTitle);
    const grid = $("#classes-grid");
    list.forEach((c) => {
      const card = el("div", "class-card");
      const img = el("div", "class-card-img");
      if (c.image) img.style.backgroundImage = `url('${c.image}')`;
      card.appendChild(img);
      const body = el("div", "class-card-body");
      body.appendChild(el("h3", null, c.title));
      body.appendChild(el("p", null, c.desc || ""));
      const btn = el("span", "btn-text btn-disabled", "Записаться →");
      btn.setAttribute("aria-disabled", "true");
      body.appendChild(btn);
      card.appendChild(body);
      grid.appendChild(card);
    });
    bindCarouselDots(grid, $("#classes-dots"));
  }

  function renderSchedule() {
    const grid = $("#schedule-grid");
    const tabs = $("#schedule-tabs");
    const days = C.schedule || [];
    const dayCards = [];
    const tabBtns = [];

    // Определяем текущий день недели (Пн=0 .. Сб=5, Вс->0)
    const jsDay = new Date().getDay();
    const defaultIdx = jsDay >= 1 && jsDay <= days.length ? jsDay - 1 : 0;

    days.forEach((day, i) => {
      const isActive = i === defaultIdx;
      const card = el("div", "schedule-day" + (isActive ? " active" : ""));
      card.appendChild(el("div", "schedule-day-head", day.day));
      (day.items || []).forEach((it) => {
        card.appendChild(el("div", "schedule-slot",
          `<div class="schedule-time">${it.time}</div>
           <div class="schedule-name">${it.name}</div>
           <div class="schedule-trainer">${it.trainer || ""}</div>`));
      });
      grid.appendChild(card);
      dayCards.push(card);

      if (tabs) {
        const tab = el("button", "schedule-tab" + (isActive ? " active" : ""), day.day);
        tab.type = "button";
        tab.setAttribute("role", "tab");
        tab.setAttribute("aria-selected", isActive ? "true" : "false");
        tab.addEventListener("click", () => {
          dayCards.forEach((c, idx) => c.classList.toggle("active", idx === i));
          tabBtns.forEach((b, idx) => {
            b.classList.toggle("active", idx === i);
            b.setAttribute("aria-selected", idx === i ? "true" : "false");
          });
        });
        tabs.appendChild(tab);
        tabBtns.push(tab);
      }
    });
  }

  function renderAbout() {
    const a = C.about || {};
    if (a.title) $("#about-hero-text").innerHTML = accent(a.title);
    const body = $("#about-text");
    (a.text || "").split("\n").filter(Boolean).forEach((p) => body.appendChild(el("p", null, p)));

    const slides = (a.slides && a.slides.length ? a.slides : (a.image ? [a.image] : [])).filter(Boolean);
    initAboutCarousel(slides);

    const grid = $("#gallery-grid");
    (C.gallery || []).filter(Boolean).forEach((src) => {
      const item = el("div", "gallery-item");
      item.style.backgroundImage = `url('${src}')`;
      grid.appendChild(item);
    });
  }

  function initAboutCarousel(slides) {
    const slidesBox = $("#about-slides");
    const dotsBox = $("#about-dots");
    const prev = $("#about-prev");
    const next = $("#about-next");
    const heroBox = $("#about-hero");
    if (!slides.length) return;

    const slideEls = slides.map((src, i) => {
      const s = el("div", "about-slide" + (i === 0 ? " active" : ""));
      s.style.backgroundImage = `url('${src}')`;
      slidesBox.appendChild(s);
      return s;
    });

    if (slides.length < 2) { prev.style.display = "none"; next.style.display = "none"; return; }

    const dotEls = slides.map((_, i) => {
      const d = el("button", "about-dot" + (i === 0 ? " active" : ""));
      d.setAttribute("aria-label", "Слайд " + (i + 1));
      d.addEventListener("click", () => go(i));
      dotsBox.appendChild(d);
      return d;
    });

    let idx = 0, timer;
    function go(n) {
      idx = (n + slides.length) % slides.length;
      slideEls.forEach((s, i) => s.classList.toggle("active", i === idx));
      dotEls.forEach((d, i) => d.classList.toggle("active", i === idx));
      restart();
    }
    function restart() { clearInterval(timer); timer = setInterval(() => go(idx + 1), 5000); }

    prev.addEventListener("click", () => go(idx - 1));
    next.addEventListener("click", () => go(idx + 1));

    // Поддержка свайпа пальцем на мобильных
    if (heroBox) {
      let startX = 0;
      heroBox.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
      heroBox.addEventListener("touchend", (e) => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
      }, { passive: true });
    }

    restart();
  }

  function initials(name) {
    return (name || "").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  }
  function renderTrainers() {
    const grid = $("#trainers-grid");
    (C.trainers || []).forEach((t) => {
      const card = el("div", "trainer-card");
      const photo = el("div", "trainer-photo");
      if (t.photo) photo.style.backgroundImage = `url('${t.photo}')`;
      else {
        photo.style.background = `linear-gradient(135deg, ${C.brand.colors.primary}, ${C.brand.colors.accent})`;
        photo.appendChild(el("div", "trainer-initials", initials(t.name)));
      }
      card.appendChild(photo);
      card.appendChild(el("div", "trainer-body",
        `<h3>${t.name}</h3><div class="trainer-role">${t.role || ""}</div>
         <p class="trainer-bio">${t.bio || ""}</p>`));
      grid.appendChild(card);
    });
    bindCarouselDots(grid, $("#trainers-dots"));
  }

  function renderPrices() {
    const grid = $("#prices-grid");
    (C.memberships || []).forEach((m) => {
      const card = el("div", "price-card" + (m.highlighted ? " highlighted" : ""));
      if (m.highlighted) card.appendChild(el("div", "price-badge", "Популярный"));
      card.appendChild(el("h3", null, m.name));
      card.appendChild(el("div", "price-value", m.price));
      card.appendChild(el("div", "price-period", m.period || ""));
      const ul = el("ul", "price-features");
      (m.features || []).forEach((f) => ul.appendChild(el("li", null, f)));
      card.appendChild(ul);
      const cta = el("span", "btn btn-primary btn-disabled", "Выбрать");
      cta.setAttribute("aria-disabled", "true");
      card.appendChild(cta);
      grid.appendChild(card);
    });
  }

  function renderReviews() {
    const grid = $("#reviews-grid");
    const r = C.reviews || {};
    (r.items || []).forEach((rev) => {
      const stars = "★".repeat(rev.rating || 5) + "☆".repeat(5 - (rev.rating || 5));
      grid.appendChild(el("div", "review-card",
        `<div class="review-stars">${stars}</div>
         <p class="review-text">${rev.text}</p>
         <div class="review-author">${rev.author}</div>`));
    });
    if (r.mapsWidgetHtml) $("#maps-widget").innerHTML = r.mapsWidgetHtml;
    bindCarouselDots(grid, $("#reviews-dots"));
  }

  function renderContacts() {
    const k = C.contacts || {};
    const hide = (node, val) => { if (node && !val) node.closest(".contact-line").style.display = "none"; };
    $("#contact-address").textContent = "📍 " + (k.address || ""); hide($("#contact-address"), k.address);
    const phone = $("#contact-phone");
    phone.textContent = "📞 " + (k.phone || "+7 (929) 043-22-11");
    phone.href = "tel:" + (k.phone || "+79290432211").replace(/[^\d+]/g, "");
    hide(phone, k.phone);
    const email = $("#contact-email");
    email.textContent = "✉ " + (k.email || ""); email.href = "mailto:" + (k.email || ""); hide(email, k.email);
    $("#contact-hours").textContent = "🕒 " + (k.workingHours || ""); hide($("#contact-hours"), k.workingHours);

    const socials = $("#socials");
    const map = { telegram: "TG", whatsapp: "WA", vk: "VK", instagram: "IG" };
    Object.entries(k.socials || {}).forEach(([key, url]) => {
      if (key === "vk") return;
      if (url) { const a = el("a", null, map[key] || key.slice(0, 2).toUpperCase()); a.href = url; a.target = "_blank"; a.rel = "noopener"; socials.appendChild(a); }
    });

    const mapBox = $("#contacts-map");
    if (k.mapEmbedHtml) mapBox.innerHTML = k.mapEmbedHtml;
    else {
      const fb = el("div", "map-fallback");
      const link = el("a", "btn btn-primary btn-lg", "Открыть на Яндекс.Картах");
      link.href = k.mapLink || "#"; link.target = "_blank"; link.rel = "noopener";
      fb.appendChild(link); mapBox.appendChild(fb);
    }
  }

  function renderBooking() {
    const b = C.booking || {};
    const ul = $("#booking-benefits");
    (b.benefits || ["Первое пробное занятие", "Малые группы", "Дипломированные тренеры"])
      .forEach((t) => ul.appendChild(el("li", null, t)));

    const subtitle = $("#booking-subtitle");
    if (subtitle) subtitle.textContent = b.subtitle || "Запись на занятия осуществляется по телефону +7 (929) 043-22-11.";

    document.querySelectorAll('a[href="#booking"], a[href*="yclients"], a[href*="vk.com"]').forEach((a) => {
      a.removeAttribute("href");
      a.removeAttribute("target");
      a.classList.add("btn-disabled");
      a.addEventListener("click", (e) => e.preventDefault());
    });
  }

  function initBurgerMenu() {
    const burger = $("#burger");
    const nav = $("#nav");
    const closeBtn = $("#nav-close");
    const backdrop = $("#nav-backdrop");
    const header = $("#site-header");

    function setOpen(state) {
      nav.classList.toggle("open", state);
      if (burger) {
        burger.classList.toggle("active", state);
        burger.setAttribute("aria-expanded", state ? "true" : "false");
      }
      if (backdrop) backdrop.classList.toggle("open", state);
      document.body.classList.toggle("menu-open", state);
    }

    if (burger) burger.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
    if (closeBtn) closeBtn.addEventListener("click", () => setOpen(false));
    if (backdrop) backdrop.addEventListener("click", () => setOpen(false));
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));

    if (header) {
      window.addEventListener("scroll", () => {
        header.classList.toggle("scrolled", window.scrollY > 20);
      }, { passive: true });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyBrand();
    renderHero();
    renderFeatures();
    renderClasses();
    renderSchedule();
    renderAbout();
    renderTrainers();
    renderPrices();
    renderReviews();
    renderFAQ();
    renderContacts();
    renderBooking();
    initBurgerMenu();
  });
})();
