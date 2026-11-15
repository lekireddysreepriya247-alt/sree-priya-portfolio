(function () {
  "use strict";
  var P = window.PORTFOLIO || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var el = function (tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var pad2 = function (n) { return (n < 10 ? "0" : "") + n; };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var root = document.documentElement;
  var skills = P.skills || [];
  var skillById = {};
  skills.forEach(function (s) { skillById[s.id] = s; });

  /* ---------- Theme (remembered) ---------- */
  function setTheme(dark) {
    root.classList.toggle("dark", dark);
    var meta = $("meta[name='theme-color']");
    if (meta) meta.content = dark ? "#0c1612" : "#eceff3";
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
  }
  try { if (localStorage.getItem("theme") === "dark") setTheme(true); } catch (e) {}

  /* ---------- Fill the page from content.js ---------- */
  document.title = P.name + " | Portfolio";
  $$("[data-fill]").forEach(function (n) { n.textContent = P[n.dataset.fill] || ""; });
  $$("[data-photo]").forEach(function (img) { img.src = P.photo; img.alt = "Portrait of " + P.name; });

  // Headline, split into letters so each one can react to the cursor
  var hi = $("[data-chars]");
  var hiText = "Hi, I'm " + (P.shortName || P.name) + ".";
  hi.setAttribute("aria-label", hiText);
  var ci = 0;
  hiText.split(" ").forEach(function (word, wi, all) {
    var w = el("span", "wd");
    w.setAttribute("aria-hidden", "true");
    word.split("").forEach(function (c) {
      var ch = el("span", "ch", c);
      ch.style.setProperty("--i", ci++);
      ch.addEventListener("pointerenter", function () {
        ch.classList.add("hop");
        setTimeout(function () { ch.classList.remove("hop"); }, 450);
      });
      w.appendChild(ch);
    });
    hi.appendChild(w);
    if (wi < all.length - 1) hi.appendChild(document.createTextNode(" "));
  });

  function tags(list, cls) {
    var ul = el("ul", cls || "tags");
    (list || []).forEach(function (t) { ul.appendChild(el("li", "", t)); });
    return ul;
  }

  /* ---------- Loader, then the opening sequence ---------- */
  var num = $(".loader-num");
  var started = false;
  function start() {
    if (started) return;
    started = true;
    num.textContent = "100";
    document.body.classList.add("loaded");
    setTimeout(function () { document.body.classList.add("ready"); startPad(); }, reduced ? 0 : 750);
  }
  if (reduced) start();
  else {
    var t0 = performance.now(), loaded = document.readyState === "complete";
    window.addEventListener("load", function () { loaded = true; });
    (function count(now) {
      var p = Math.min(1, (now - t0) / 1300);
      if (!loaded) p = Math.min(p, 0.9);
      num.textContent = Math.round(p * 100);
      if (p < 1 && !started) requestAnimationFrame(count); else start();
    })(t0);
    setTimeout(start, 4000);
  }

  /* ---------- Flip pad: "I am a ___" ---------- */
  var roles = P.roles || [];
  var padTop = $(".pad-top"), padUnder = $(".pad-under span"), padCount = $(".pad-count");
  var rings = $(".pad-rings");
  for (var r = 0; r < 12; r++) rings.appendChild(el("i"));
  var ri = 0;
  function showCount() { padCount.textContent = pad2(ri + 1) + " / " + pad2(roles.length); }
  $("span", padTop).textContent = roles[0] || "";
  showCount();
  function startPad() {
    if (reduced || roles.length < 2) return;
    setInterval(function () {
      var next = (ri + 1) % roles.length;
      padUnder.textContent = roles[next];
      padTop.classList.add("flip");
      setTimeout(function () {
        ri = next;
        $("span", padTop).textContent = roles[ri];
        padTop.classList.remove("flip");
        showCount();
      }, 760);
    }, 2600);
  }

  /* ---------- Doors ---------- */
  var wall = $("[data-wall]");
  var detail = $(".wall-detail");
  var doors = [];
  skills.forEach(function (s, i) {
    var d = el("button", "door");
    d.type = "button";
    d.style.setProperty("--c", s.color);
    d.style.setProperty("--d", i * 0.12 + "s");
    d.setAttribute("aria-label", s.name + ". Open this door.");
    d.dataset.cursor = "Enter";
    d.appendChild(el("span", "door-frame"));
    d.appendChild(el("span", "door-inside"));
    var leaf = el("span", "door-leaf");
    leaf.appendChild(el("span", "door-window"));
    leaf.appendChild(el("span", "door-plate", s.name));
    leaf.appendChild(el("span", "door-handle"));
    leaf.appendChild(el("span", "door-key"));
    d.appendChild(leaf);
    wall.insertBefore(d, detail);
    doors.push(d);
    d.addEventListener("pointerenter", function (e) { if (e.pointerType !== "touch") peek(i); });
    d.addEventListener("focus", function () { peek(i); });
    d.addEventListener("blur", unpeek);
    d.addEventListener("click", function () { enter(i); });
  });
  wall.addEventListener("pointerleave", unpeek);

  function peek(i) {
    var s = skills[i], d = doors[i];
    doors.forEach(function (x, k) { x.classList.toggle("active", k === i); });
    detail.textContent = "";
    detail.style.setProperty("--c", s.color);
    detail.appendChild(el("h3", "", s.name));
    detail.appendChild(el("p", "sum", s.summary));
    var ul = el("ul");
    (s.points || []).forEach(function (p, k) { var li = el("li", "", p); li.style.setProperty("--i", k); ul.appendChild(li); });
    detail.appendChild(ul);
    var wr = wall.getBoundingClientRect(), dr = d.getBoundingClientRect();
    var onRight = i < doors.length / 2;
    detail.classList.toggle("right", !onRight);
    detail.style.left = onRight ? (dr.right - wr.left + 36) + "px" : "auto";
    detail.style.right = onRight ? "auto" : (wr.right - dr.left + 36) + "px";
    wall.classList.add("has-active");
  }
  function unpeek() {
    wall.classList.remove("has-active");
    doors.forEach(function (x) { x.classList.remove("active"); });
  }

  /* ---------- Room behind a door ---------- */
  var room = $(".room");
  var lastFocus = null;
  function enter(i) {
    var s = skills[i], d = doors[i], rect = d.getBoundingClientRect();
    lastFocus = d;
    var ringEl = $(".cursor"); if (ringEl) ringEl.classList.remove("label");
    d.classList.add("active", "entering");
    room.style.setProperty("--c", s.color);
    room.style.setProperty("--x", (rect.left + rect.width / 2) + "px");
    room.style.setProperty("--y", (rect.top + rect.height / 2) + "px");
    $(".room-tag", room).textContent = "Door " + pad2(i + 1) + " of " + pad2(skills.length) + " — " + s.summary;
    $("#room-title").textContent = s.name;
    $(".room-detail", room).textContent = s.detail;
    var pts = $(".room-points", room); pts.textContent = "";
    (s.points || []).forEach(function (p) { pts.appendChild(el("li", "", p)); });
    var tl = $(".room-tools", room); tl.textContent = "";
    (s.tools || []).forEach(function (t) { tl.appendChild(el("li", "", t)); });
    var pj = $(".room-projects", room); pj.textContent = "";
    var mine = (P.projects || []).filter(function (p) { return p.room === s.id; });
    if (mine.length) pj.appendChild(el("h3", "", "Built with it"));
    mine.forEach(function (p) {
      var box = el("div", "room-project");
      box.appendChild(el("b", "", p.title));
      box.appendChild(el("p", "", p.text));
      pj.appendChild(box);
    });
    setTimeout(function () {
      room.hidden = false;
      room.scrollTop = 0;
      document.body.classList.add("locked");
      void room.offsetWidth;
      room.classList.add("open");
      $(".room-close", room).focus();
    }, reduced ? 0 : 320);
  }
  function leaveRoom() {
    room.classList.remove("open");
    document.body.classList.remove("locked");
    setTimeout(function () {
      room.hidden = true;
      doors.forEach(function (x) { x.classList.remove("entering", "active"); });
      wall.classList.remove("has-active");
      if (lastFocus) { lastFocus.focus({ preventScroll: true }); lastFocus.blur(); }
    }, reduced ? 0 : 700);
  }
  $(".room-close", room).addEventListener("click", leaveRoom);

  /* ---------- Work cards ---------- */
  (P.projects || []).forEach(function (p, i) {
    var card = el("article", "project reveal");
    card.style.setProperty("--d", i * 0.1 + "s");
    card.style.setProperty("--c", (skillById[p.room] || {}).color || "#10291f");
    card.appendChild(el("span", "project-num", pad2(i + 1)));
    card.appendChild(el("p", "project-kind", p.kind));
    card.appendChild(el("h3", "", p.title));
    card.appendChild(el("p", "", p.text));
    card.appendChild(tags(p.stack));
    if (p.link) {
      var a = el("a", "project-link", "Open project");
      a.href = p.link; a.target = "_blank"; a.rel = "noopener";
      card.appendChild(a);
    }
    tiltOn(card, card, 7);
    $("[data-projects]").appendChild(card);
  });

  /* ---------- Journey ---------- */
  var journey = P.journey || [];
  var list = $("[data-journey]");
  journey.forEach(function (j) {
    var li = el("li");
    li.appendChild(el("p", "when", j.when));
    li.appendChild(el("h3", "", j.title));
    if (j.place) li.appendChild(el("p", "place", j.place));
    li.appendChild(el("p", "", j.text));
    list.appendChild(li);
  });
  var entries = $$("li", list);
  var yearEl = $(".year span"), countEl = $(".journey-count b"), bar = $(".journey-bar i");
  $("[data-total]").textContent = pad2(journey.length);
  var nowIdx = -1;
  function setEntry(i) {
    if (i === nowIdx || !journey[i]) return;
    nowIdx = i;
    entries.forEach(function (e, k) { e.classList.toggle("now", k === i); });
    yearEl.textContent = journey[i].when;
    yearEl.classList.remove("swap"); void yearEl.offsetWidth; yearEl.classList.add("swap");
    countEl.textContent = pad2(i + 1);
    bar.style.setProperty("--p", (i + 1) / journey.length);
  }
  setEntry(0);

  /* ---------- Contact details + links ---------- */
  var hasMail = P.email && P.email.indexOf("example.com") === -1;
  $$("[data-mail]").forEach(function (m) {
    if (hasMail) { m.textContent = P.email; m.href = "mailto:" + P.email; }
  });
  var linkBox = $("[data-links]");
  [["github", "GitHub"], ["linkedin", "LinkedIn"], ["resume", "Resume"]].forEach(function (pair) {
    var url = (P.links || {})[pair[0]];
    if (!url) return;
    var a = el("a", "", pair[1]);
    a.href = url; a.target = "_blank"; a.rel = "noopener";
    linkBox.appendChild(a);
  });

  /* ---------- Skill card ---------- */
  var box = $(".cardbox"), card = $(".card3d"), flipped = false;
  var lv = $(".card-levels");
  ((P.card || {}).levels || []).forEach(function (l) {
    var li = el("li");
    li.appendChild(el("span", "", l.name));
    var pips = el("span", "pips");
    for (var k = 0; k < 10; k++) pips.appendChild(el("i", k < Math.round(l.score / 10) ? "on" : ""));
    li.appendChild(pips);
    li.appendChild(el("b", "", l.score));
    lv.appendChild(li);
  });
  $(".card-about").textContent = (P.card || {}).back || P.intro || "";
  var ct = $(".card-tags");
  skills.forEach(function (s) { ct.appendChild(el("li", "", s.name)); });
  function openCard() {
    lastFocus = $(".card-open");
    box.hidden = false;
    document.body.classList.add("locked");
    void box.offsetWidth;
    box.classList.add("open");
    card.focus();
  }
  function closeCard() {
    box.classList.remove("open");
    document.body.classList.remove("locked");
    setTimeout(function () {
      box.hidden = true; flipped = false;
      card.style.setProperty("--flip", "0deg");
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    }, reduced ? 0 : 500);
  }
  function flipCard() {
    flipped = !flipped;
    card.classList.remove("live");
    card.style.setProperty("--flip", flipped ? "180deg" : "0deg");
  }
  $(".card-open").addEventListener("click", openCard);
  $(".cardbox-close").addEventListener("click", closeCard);
  box.addEventListener("click", function (e) { if (e.target === box) closeCard(); });
  card.addEventListener("click", function (e) { if (e.target.tagName !== "A") flipCard(); });
  card.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flipCard(); }
  });
  if (fine && !reduced) {
    box.addEventListener("pointermove", function (e) {
      var r2 = card.getBoundingClientRect();
      var x = (e.clientX - r2.left) / r2.width, y = (e.clientY - r2.top) / r2.height;
      card.classList.add("live");
      card.style.setProperty("--ry", clamp((x - 0.5) * 34, -24, 24) + "deg");
      card.style.setProperty("--rx", clamp((0.5 - y) * 26, -18, 18) + "deg");
      $$(".card-glare", card).forEach(function (g) {
        g.style.setProperty("--mx", clamp((flipped ? 1 - x : x) * 100, 0, 100) + "%");
        g.style.setProperty("--my", clamp(y * 100, 0, 100) + "%");
      });
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!room.hidden) leaveRoom();
    if (!box.hidden) closeCard();
  });

  /* ---------- Cursor reactions ---------- */
  function tiltOn(area, target, max) {
    if (!fine || reduced) return;
    area.addEventListener("pointermove", function (e) {
      var r2 = target.getBoundingClientRect();
      var x = (e.clientX - r2.left) / r2.width, y = (e.clientY - r2.top) / r2.height;
      target.style.setProperty("--ry", clamp((x - 0.5) * 2 * max, -max, max) + "deg");
      target.style.setProperty("--rx", clamp((0.5 - y) * 2 * max, -max, max) + "deg");
      target.style.setProperty("--mx", x * 100 + "%");
      target.style.setProperty("--my", y * 100 + "%");
    });
    area.addEventListener("pointerleave", function () {
      target.style.setProperty("--ry", "0deg");
      target.style.setProperty("--rx", "0deg");
    });
  }
  var hero = $(".hero");
  tiltOn(hero, $(".tilt"), 9);

  var cord = $(".cord");
  cord.addEventListener("click", function () {
    cord.classList.remove("pulled"); void cord.offsetWidth; cord.classList.add("pulled");
    setTimeout(function () { setTheme(!root.classList.contains("dark")); }, reduced ? 0 : 220);
  });

  if (fine && !reduced) {
    var ring = $(".cursor"), ringText = $("span", ring);
    var mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, lastX = mx;
    var glow = $(".hero-glow");
    window.addEventListener("pointermove", function (e) {
      mx = e.clientX; my = e.clientY;
      ring.classList.add("on");
      var t = e.target.closest ? e.target.closest("[data-cursor], a, button, input, textarea") : null;
      var label = t && t.dataset.cursor;
      ring.classList.toggle("label", !!label);
      ring.classList.toggle("link", !!t && !label);
      ringText.textContent = label || "";
      var hr = hero.getBoundingClientRect();
      if (my < hr.bottom) { glow.style.setProperty("--gx", (mx - hr.left) + "px"); glow.style.setProperty("--gy", (my - hr.top) + "px"); }
      // the cord swings away from a passing cursor
      var cr = cord.getBoundingClientRect(), dx = mx - (cr.left + cr.width / 2);
      var near = Math.abs(dx) < 160 && my < cr.bottom + 80;
      cord.style.setProperty("--sway", near ? clamp((mx - lastX) * 1.2 + (dx > 0 ? -5 : 5), -16, 16) + "deg" : "0deg");
      lastX = mx;
    }, { passive: true });
    document.addEventListener("pointerleave", function () { ring.classList.remove("on"); });
    (function follow() {
      cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2;
      ring.style.transform = "translate(" + cx + "px," + cy + "px)";
      requestAnimationFrame(follow);
    })();

    // buttons lean toward the cursor
    $$(".magnet").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r2 = b.getBoundingClientRect();
        b.style.translate = (e.clientX - r2.left - r2.width / 2) * 0.25 + "px " + (e.clientY - r2.top - r2.height / 2) * 0.35 + "px";
      });
      b.addEventListener("pointerleave", function () { b.style.translate = ""; });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var items = $$(".reveal").concat(doors);
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("seen"); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (n) { io.observe(n); });
  } else items.forEach(function (n) { n.classList.add("seen"); });

  /* ---------- Scroll: progress, nav, timeline ---------- */
  var prog = $(".progress"), nav = $(".nav"), jSec = $(".journey");
  var navLinks = $$(".nav-links a");
  var sections = navLinks.map(function (a) { return $(a.getAttribute("href")); });
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.scrollY, vh = window.innerHeight;
      var max = document.documentElement.scrollHeight - vh;
      prog.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
      nav.classList.toggle("stuck", y > 30);
      cord.classList.toggle("short", y > vh * 0.6);
      var here = 0;
      sections.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < vh * 0.45) here = i; });
      navLinks.forEach(function (a, i) { a.classList.toggle("here", i === here); });
      // timeline: the entry nearest the middle of the screen is "now"
      var mid = vh / 2, best = 0, bestD = Infinity;
      entries.forEach(function (e, i) {
        var r2 = e.getBoundingClientRect(), d = Math.abs(r2.top + 40 - mid);
        if (d < bestD) { bestD = d; best = i; }
      });
      setEntry(best);
      var lr = list.getBoundingClientRect();
      list.style.setProperty("--fill", clamp((mid - lr.top) / lr.height, 0, 1));
      var jr = jSec.getBoundingClientRect();
      jSec.style.setProperty("--turn", clamp(-jr.top / 6, -400, 400));
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- Local time ---------- */
  function tick() {
    var now = new Date(), tz = P.timezone || undefined;
    try {
      $("[data-clock]").textContent = now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: tz });
      $("[data-date]").textContent = now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: tz });
    } catch (e) {}
  }
  tick(); setInterval(tick, 20000);

  /* ---------- Mobile menu ---------- */
  var toggle = $(".nav-toggle");
  function closeMenu() { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); toggle.textContent = "Menu"; }
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Close" : "Menu";
  });
  navLinks.forEach(function (a) { a.addEventListener("click", closeMenu); });

  /* ---------- Contact form -> Python backend ---------- */
  var form = $("#contact-form"), status = $(".form-status"), sendBtn = $(".form-send"), sent = $(".sent");
  function clearErrors() {
    $$(".field", form).forEach(function (f) { f.classList.remove("bad"); var s = $("small", f); if (s) s.remove(); });
    status.textContent = "";
  }
  function showErrors(errors) {
    Object.keys(errors).forEach(function (k) {
      var input = form.elements[k];
      if (!input) return;
      var f = input.closest(".field");
      f.classList.add("bad");
      f.appendChild(el("small", "", errors[k]));
    });
    var first = $(".field.bad input, .field.bad textarea", form);
    if (first) first.focus();
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();
    var data = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      message: form.elements.message.value.trim(),
      website: form.elements.website.value
    };
    sendBtn.disabled = true;
    sendBtn.textContent = "Sending...";
    fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
      .then(function (res) {
        if (res.ok && res.body.ok) { form.hidden = true; sent.hidden = false; form.reset(); }
        else if (res.body.errors) showErrors(res.body.errors);
        else status.textContent = res.body.error || "The message could not be sent. Try again in a moment.";
      })
      .catch(function () { status.textContent = "The server could not be reached. Check your connection and send again."; })
      .then(function () { sendBtn.disabled = false; sendBtn.textContent = "Send message"; });
  });
  $("#send-another").addEventListener("click", function () { sent.hidden = true; form.hidden = false; form.elements.name.focus(); });

  /* ---------- Visitor counter (Python backend) ---------- */
  var visits = $("[data-visits]"), counted = false;
  try { counted = sessionStorage.getItem("counted") === "1"; } catch (err) {}
  fetch("/api/visits", { method: counted ? "GET" : "POST" })
    .then(function (r) { return r.json(); })
    .then(function (j) {
      if (typeof j.count !== "number") return;
      try { sessionStorage.setItem("counted", "1"); } catch (err) {}
      visits.textContent = "";
      visits.appendChild(el("strong", "", j.count.toLocaleString()));
      visits.appendChild(document.createTextNode(j.count === 1 ? " visit so far" : " visits so far"));
      visits.hidden = false;
    })
    .catch(function () {});
})();
