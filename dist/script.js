const translations = {
  uz: {
    groom: "Ravshanbek", bride: "Aziza", kicker: "TO'Y TAKLIFNOMASI", welcome: "Hurmatli mehmonimiz",
    heroCopy: "Hayotimizdagi eng baxtli kunni siz bilan birga nishonlashdan mamnun bo'lamiz.",
    sunday: "YAKSHANBA", october: "OKTYABR", octoberShort: "OKTYABR", scroll: "PASTGA",
    storyKicker: "MEHR BILAN", storyTitle: "Sizni baxtli kunimizga taklif qilamiz",
    storyCopy: "Biz uchun qadrli bo'lgan insonlar bilan ushbu kunni baham ko'rish — bayramimizning eng go'zal qismi. Sizning tashrifingiz biz uchun katta quvonch.",
    detailsKicker: "MUHIM KUN", detailsTitle: "Bir kun, bir manzil, bir xotira.",
    dateLabel: "SANA", venueLabel: "MANZIL", venueCity: "Urganch", map: "Xaritada ko'rish",
    timeLabel: "BOSHLANISH", timeSmall: "kechqurun",
    note: "Ushbu kunning eng chiroyli qismi — sizning ishtirokingiz.",
    countKicker: "BIZNING KUNIMIZGACHA", countTitle: "Qancha vaqt qoldi?",
    days: "KUN", hours: "SOAT", minutes: "DAQIQA", seconds: "SONIYA",
    rsvpKicker: "ISHTIROKINGIZNI TASDIQLANG", rsvpTitle: "Sizni kutamiz",
    rsvpCopy: "Marosimda biz bilan birga bo'lasizmi?",
    nameLabel: "Ismingiz", namePlaceholder: "Ism va familiya", answerLabel: "Javobingiz", yes: "Ha, boraman",
    no: "Afsuski, bora olmayman", submit: "JAVOBNI YUBORISH",
    success: "Rahmat! Javobingiz saqlandi.",
    invalidName: "Iltimos, ismingizni kiriting.",
    error: "Javobni yuborib bo'lmadi. Iltimos, birozdan so'ng qayta urinib ko'ring.",
    city: "URGANCH", venueName: "OMAD"
  },
  ru: {
    groom: "Равшанбек", bride: "Азиза", kicker: "СВАДЕБНОЕ ПРИГЛАШЕНИЕ", welcome: "Дорогой наш гость",
    heroCopy: "Мы будем счастливы разделить с вами самый прекрасный день нашей жизни.",
    sunday: "ВОСКРЕСЕНЬЕ", october: "ОКТЯБРЯ", octoberShort: "ОКТЯБРЯ", scroll: "ЛИСТАТЬ",
    storyKicker: "С ЛЮБОВЬЮ", storyTitle: "Приглашаем вас разделить наш счастливый день",
    storyCopy: "Для нас особенно важно разделить этот день с дорогими людьми. Ваше присутствие станет частью нашего самого красивого воспоминания.",
    detailsKicker: "ВАЖНЫЙ ДЕНЬ", detailsTitle: "Один день, один адрес, одна история.",
    dateLabel: "ДАТА", venueLabel: "МЕСТО", venueCity: "Ургенч", map: "Открыть на карте",
    timeLabel: "НАЧАЛО", timeSmall: "вечером",
    note: "Самая красивая часть этого дня — ваше присутствие.",
    countKicker: "ДО НАШЕГО ДНЯ", countTitle: "Сколько осталось?",
    days: "ДНЕЙ", hours: "ЧАСОВ", minutes: "МИНУТ", seconds: "СЕКУНД",
    rsvpKicker: "ПОДТВЕРДИТЕ ПРИСУТСТВИЕ", rsvpTitle: "Будем ждать вас",
    rsvpCopy: "Сможете ли вы разделить этот вечер с нами?",
    nameLabel: "Ваше имя", namePlaceholder: "Имя и фамилия", answerLabel: "Ваш ответ", yes: "Да, буду",
    no: "К сожалению, не смогу", submit: "ОТПРАВИТЬ ОТВЕТ",
    success: "Спасибо! Ваш ответ сохранён.",
    invalidName: "Пожалуйста, укажите имя.",
    error: "Не удалось отправить ответ. Попробуйте ещё раз чуть позже.",
    city: "УРГЕНЧ", venueName: "ОМАД"
  },
  en: {
    groom: "Ravshanbek", bride: "Aziza", kicker: "WEDDING INVITATION", welcome: "Dear guest",
    heroCopy: "We would be delighted to celebrate the most beautiful day of our lives with you.",
    sunday: "SUNDAY", october: "OCTOBER", octoberShort: "OCTOBER", scroll: "SCROLL",
    storyKicker: "WITH LOVE", storyTitle: "We invite you to share our happiest day",
    storyCopy: "Sharing this day with the people most dear to us is what will make it truly special. Your presence will be part of our favorite memory.",
    detailsKicker: "THE SPECIAL DAY", detailsTitle: "One date, one place, one story.",
    dateLabel: "DATE", venueLabel: "VENUE", venueCity: "Urgench", map: "View on map",
    timeLabel: "STARTS", timeSmall: "in the evening",
    note: "The most beautiful part of this day is having you there.",
    countKicker: "UNTIL OUR DAY", countTitle: "How much time is left?",
    days: "DAYS", hours: "HOURS", minutes: "MINUTES", seconds: "SECONDS",
    rsvpKicker: "PLEASE RSVP", rsvpTitle: "We will be waiting for you",
    rsvpCopy: "Will you be able to join us for this evening?",
    nameLabel: "Your name", namePlaceholder: "First and last name", answerLabel: "Your answer", yes: "Yes, I will",
    no: "Sadly, I cannot", submit: "SEND RSVP",
    success: "Thank you! Your response has been saved.",
    invalidName: "Please enter your name.",
    error: "We couldn't send your response. Please try again later.",
    city: "URGENCH", venueName: "OMAD"
  }
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const target = new Date("2026-10-04T18:00:00+05:00").getTime();

let lang = "uz";
try {
  const saved = localStorage.getItem("wedding-lang");
  if (translations[saved]) lang = saved;
} catch {}

function setLang(next, keepMessage = false) {
  if (!translations[next]) return;
  lang = next;
  try { localStorage.setItem("wedding-lang", lang); } catch {}
  document.documentElement.lang = lang;

  const t = translations[lang];
  document.title = `${t.groom} & ${t.bride} — 4 ${t.october} 2026`;

  $$(".groom-name").forEach((el) => { el.textContent = t.groom; });
  $$(".bride-name").forEach((el) => { el.textContent = t.bride; });

  $$('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (Object.prototype.hasOwnProperty.call(t, key)) el.textContent = t[key];
  });

  $$('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (Object.prototype.hasOwnProperty.call(t, key)) el.placeholder = t[key];
  });

  $$(".hero-place-city").forEach((el) => { el.textContent = t.city; });
  $$(".hero-place-venue").forEach((el) => { el.textContent = t.venueName; });
  $$(".footer-venue").forEach((el) => { el.textContent = t.venueName; });
  $$(".footer-city").forEach((el) => { el.textContent = t.city; });
  $$(".lang").forEach((btn) => btn.classList.toggle("active", btn.dataset.lang === lang));

  if (!keepMessage) $("#formMessage").textContent = "";
}

$$(".lang").forEach((btn) => btn.addEventListener("click", () => setLang(btn.dataset.lang)));
setLang(lang);

function countdown() {
  let diff = Math.max(0, target - Date.now());
  const d = Math.floor(diff / 86400000); diff %= 86400000;
  const h = Math.floor(diff / 3600000); diff %= 3600000;
  const m = Math.floor(diff / 60000); diff %= 60000;
  const s = Math.floor(diff / 1000);
  $("#days").textContent = String(d).padStart(2, "0");
  $("#hours").textContent = String(h).padStart(2, "0");
  $("#minutes").textContent = String(m).padStart(2, "0");
  $("#seconds").textContent = String(s).padStart(2, "0");
}
countdown();
window.setInterval(countdown, 1000);

$$(".choice").forEach((row) => {
  row.addEventListener("click", () => {
    $$(".choice").forEach((item) => item.classList.remove("active"));
    row.classList.add("active");
  });
});

const form = $("#rsvpForm");
const msg = $("#formMessage");
const submitButton = $(".submit");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = $("#guestName").value.trim().replace(/\s+/g, " ");
  const attendance = new FormData(form).get("attendance");

  if (name.length < 2 || name.length > 80) {
    msg.textContent = translations[lang].invalidName;
    $("#guestName").focus();
    return;
  }

  submitButton.disabled = true;
  msg.textContent = "";

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, attending: attendance }),
      signal: controller.signal,
      cache: "no-store"
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    msg.textContent = translations[lang].success;
    form.reset();
    $$(".choice").forEach((el, i) => el.classList.toggle("active", i === 0));
  } catch (error) {
    console.error("RSVP submission failed", error);
    msg.textContent = translations[lang].error;
  } finally {
    window.clearTimeout(timer);
    submitButton.disabled = false;
  }
});

/* Reveal animation — kept identical to the original visual behavior. */
const revealMap = [
  [".hero-copy", 80],
  [".story-card", 80],
  [".details-head", 70],
  [".royal-stage", 110],
  [".detail-note", 680],
  [".countdown-inner", 90],
  [".rsvp-paper", 100]
];

revealMap.forEach(([selector, delay]) => {
  document.querySelectorAll(selector).forEach((el) => {
    el.classList.add("reveal-ready");
    el.style.setProperty("--reveal-delay", `${delay}ms`);
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("reveal-in");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -7% 0px" });

  document.querySelectorAll(".reveal-ready").forEach((el) => revealObserver.observe(el));
} else {
  document.querySelectorAll(".reveal-ready").forEach((el) => el.classList.add("reveal-in"));
}

/* Desktop-only subtle depth effect. Disabled on touch screens. */
const plaque = document.querySelector(".royal-plaque");
if (plaque && window.matchMedia("(pointer:fine)").matches) {
  let rect = null;
  let raf = 0;

  window.addEventListener("pointermove", (event) => {
    if (!rect) rect = plaque.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      plaque.style.transform =
        `perspective(1000px) rotateY(${x * 2.4}deg) rotateX(${y * -2.4}deg)`;
    });
  }, { passive: true });

  window.addEventListener("scroll", () => { rect = null; }, { passive: true });
  window.addEventListener("pointerleave", () => { plaque.style.transform = ""; });
}
