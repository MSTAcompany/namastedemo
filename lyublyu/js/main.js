/* Намасте — интерактив: данные, скролл-анимации, меню, форма. */
(function () {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const el = (t, c, h) => { const n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };

  const YANDEX = "https://yandex.ru/maps/org/lyublyu_pilates/79484976232/";
  const YCLIENTS = ""; // онлайн-запись студии
  const PHONE = "+7 (929) 043-22-11";
  const WA = "79290432211"; // только для tel: ссылки

  const FORMATS = [
    { n: "01", title: "Мини-группа", img: "assets/p01.jpg", desc: "Занятия на реформерах в компании до трёх человек — внимание тренера к каждому и доступная цена.", price: "2 500 ₽", per: "занятие" },
    { n: "02", title: "Индивидуально", img: "assets/p05.jpg", desc: "Персональная тренировка один на один. Программа под ваши цели и особенности тела.", price: "5 500 ₽", per: "занятие" },
    { n: "03", title: "Сплит на двоих", img: "assets/p11.jpg", desc: "Тренировка вдвоём — с подругой или партнёром. Мотивация вместе, внимание тренера.", price: "7 000 ₽", per: "занятие" },
  ];

  // Фото студии
  const HERO_ARCHED = "assets/p04.jpg";  // арочное фото справа (десктоп)
  const HERO_PHOTO = "assets/p11.jpg";   // фон-фото (только мобильный) — реформеры, контрастнее
  const ABOUT_PHOTO = "assets/p08.jpg";
  const GALLERY = ["assets/p02.jpg", "assets/p07.jpg", "assets/p10.jpg", "assets/p12.jpg"];

  const PRICES = [
    { n: "Мини-группа (до 3 человек)", s: "разовое занятие", v: "2 500 ₽" },
    { n: "Индивидуальная на реформере", s: "разовое занятие", v: "5 500 ₽" },
    { n: "Сплит-тренировка", s: "на двоих", v: "7 000 ₽" },
    { n: "Абонемент 4 занятия", s: "мини-группа", v: "9 000 ₽" },
    { n: "Абонемент 8 занятий", s: "мини-группа", v: "17 500 ₽" },
    { n: "Абонемент 4 занятия", s: "индивидуальные", v: "20 000 ₽" },
    { n: "Абонемент 8 занятий", s: "индивидуальные", v: "37 000 ₽" },
  ];

  // TODO: заменить на реальные отзывы с Яндекс.Карт (рейтинг 4.9, 27 отзывов)
  const REVIEWS = [
    { t: "После работы за компьютером спина сказала спасибо. Тренеры внимательные, группы маленькие.", w: "Гостья студии" },
    { t: "Наконец нашла студию, где не теряешься в потоке — индивидуальный подход правда чувствуется.", w: "Гостья студии" },
    { t: "Красивая студия, чистые реформеры, приятная атмосфера. Хожу с удовольствием.", w: "Гостья студии" },
  ];

  // TODO: вставить реальные ссылки Telegram / ВК студии
  const SOCIALS = { telegram: "", vk: "" };

  function renderFormats() {
    const box = $("#formats-cards");
    FORMATS.forEach((f, i) => {
      const c = el("div", "fmt reveal");
      c.style.transitionDelay = (i * 0.1) + "s";
      const thumb = f.img ? `<div class="fmt-thumb" style="background-image:url('${f.img}')"></div>` : "";
      c.innerHTML = `${thumb}<div class="num">${f.n}</div><h3>${f.title}</h3><p>${f.desc}</p>
        <div class="price"><b>${f.price}</b> / ${f.per}</div>`;
      box.appendChild(c);
    });
  }

  function renderPrices() {
    const box = $("#price-grid");
    PRICES.forEach((p, i) => {
      const r = el("div", "price-row reveal");
      r.style.transitionDelay = ((i % 2) * 0.08) + "s";
      r.innerHTML = `<div class="pn">${p.n}<small>${p.s}</small></div><div class="pv">${p.v}</div>`;
      box.appendChild(r);
    });
  }

  function renderReviews() {
    const box = $("#reviews-list");
    REVIEWS.forEach((r, i) => {
      const c = el("div", "rev reveal");
      c.style.transitionDelay = (i * 0.1) + "s";
      c.innerHTML = `<div class="stars">★★★★★</div><p>«${r.t}»</p><div class="who">${r.w}</div>`;
      box.appendChild(c);
    });
    $("#reviews-link").href = YANDEX;
  }

  function renderContacts() {
    $("#c-address").textContent = "📍 Москва, Очаковское ш., 5к2 · Очаково-Матвеевское";
    const ph = $("#c-phone"); ph.textContent = "📞 " + PHONE; ph.href = "tel:+" + WA;
    $("#c-hours").textContent = "🕒 Ежедневно · до 21:00";

    const soc = $("#socials");
    const map = { telegram: "TG", vk: "VK", whatsapp: "WA" };
    Object.entries(SOCIALS).forEach(([k, url]) => {
      if (url) { const a = el("a", null, map[k] || k); a.href = url; a.target = "_blank"; a.rel = "noopener"; soc.appendChild(a); }
    });

    const fb = el("div", "map-fallback");
    const link = el("a", "btn btn-grad", "Открыть на Яндекс.Картах");
    link.href = YANDEX; link.target = "_blank"; link.rel = "noopener";
    fb.appendChild(link); $("#map").appendChild(fb);

    // ссылки в блоке записи
    const bl = $("#book-links");
    if (SOCIALS.telegram) { const a = el("a", null, "Telegram"); a.href = SOCIALS.telegram; a.target = "_blank"; bl.appendChild(a); }
    if (SOCIALS.vk) { const a = el("a", null, "ВКонтакте"); a.href = SOCIALS.vk; a.target = "_blank"; bl.appendChild(a); }
  }

  function setupBooking() {
    document.querySelectorAll('a[href="#book"], a[href*="vk.com"]').forEach((a) => {
      a.removeAttribute("href"); a.classList.add("btn-disabled");
      a.addEventListener("click", (e) => e.preventDefault());
    });
    const form = $("#book-form");
    if (!form) return;
    const cta = el("div", "book-cta");
    cta.innerHTML =
      `<span class="btn btn-grad btn-lg btn-disabled">Записаться онлайн</span>` +
      `<p class="book-cta-alt">Запись по телефону:</p>` +
      `<a class="book-cta-phone" href="tel:+${WA}">${PHONE}</a>`;
    form.replaceWith(cta);
  }

  function initReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.14 });
    document.querySelectorAll(".reveal").forEach((n) => io.observe(n));
    // hero — показать сразу
    document.querySelectorAll(".hero .reveal").forEach((n) => n.classList.add("in"));
  }

  function initHeader() {
    const hdr = $("#hdr");
    const onScroll = () => hdr.classList.toggle("scrolled", window.scrollY > 40);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
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
        const cardW = cards[0].offsetWidth + 14;
        const idx = Math.min(cards.length - 1, Math.max(0, Math.round(gridEl.scrollLeft / cardW)));
        dots.forEach((d, i) => d.classList.toggle("active", i === idx));
        rafId = null;
      });
    }, { passive: true });
  }

  function initMenu() {
    const b = $("#burger"), nav = $("#nav"), closeBtn = $("#nav-close"), backdrop = $("#nav-backdrop");
    function setOpen(state) {
      b.classList.toggle("open", state);
      nav.classList.toggle("open", state);
      if (backdrop) backdrop.classList.toggle("open", state);
      document.body.classList.toggle("menu-open", state);
    }
    b.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
    if (closeBtn) closeBtn.addEventListener("click", () => setOpen(false));
    if (backdrop) backdrop.addEventListener("click", () => setOpen(false));
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    bindCarouselDots($("#formats-cards"), $("#formats-dots"));
    bindCarouselDots($("#reviews-list"), $("#reviews-dots"));
  }

  function renderGallery() {
    const box = $("#gallery-grid");
    if (!box) return;
    GALLERY.forEach((src, i) => {
      const fig = el("div", "g-img reveal");
      fig.style.transitionDelay = (i * 0.08) + "s";
      fig.style.backgroundImage = `url('${src}')`;
      box.appendChild(fig);
    });
  }

  function setPhotos() {
    const arched = $("#hero-photo");
    if (arched && HERO_ARCHED) arched.style.backgroundImage = `url('${HERO_ARCHED}')`;
    // фон-фото (слой для мобильного) — инлайн-путь резолвится относительно документа
    const hbp = document.querySelector(".hero-bg-photo");
    if (hbp && HERO_PHOTO) hbp.style.backgroundImage = `url('${HERO_PHOTO}')`;
    const ap = $("#about-photo"); if (ap && ABOUT_PHOTO) ap.style.backgroundImage = `url('${ABOUT_PHOTO}')`;
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderFormats(); renderPrices(); renderReviews(); renderContacts();
    renderGallery(); setPhotos(); setupBooking();
    initReveal(); initHeader(); initMenu();
  });
})();
