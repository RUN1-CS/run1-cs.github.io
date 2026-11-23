export const $ = (s, root = document) => root.querySelector(s);
export const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = matchMedia("(hover: hover)").matches;

/* ---- text scramble (one running job per element, so calls never fight) ---- */
const jobs = new WeakMap();
const CHARS = "!<>-_\\/[]{}=+*^?#01";

export function scramble(el, text, ms = 900) {
  cancelAnimationFrame(jobs.get(el));
  if (reduce) {
    el.textContent = text;
    return;
  }
  const t0 = performance.now();
  const step = (now) => {
    const p = Math.min((now - t0) / ms, 1);
    const n = Math.floor(p * text.length);
    el.textContent = text
      .split("")
      .map((c, i) =>
        c === " " || i < n ? c : CHARS[(Math.random() * CHARS.length) | 0],
      )
      .join("");
    if (p < 1) jobs.set(el, requestAnimationFrame(step));
  };
  step(t0);
}

/* Scrambles every .scramble inside root (or root itself), once each.
   Called when an element is revealed, so the effect is actually seen. */
const done = new WeakSet();
export function scrambleIn(root) {
  const els = root.matches?.(".scramble") ? [root] : [];
  els.push(...root.querySelectorAll(".scramble"));
  for (const el of els) {
    if (done.has(el)) continue;
    done.add(el);
    scramble(el, el.textContent);
  }
}

/* ---- typed text ---- */
function typeLoop(el, words) {
  let alive = true,
    timer,
    r = 0,
    c = 0,
    del = false;
  (function tick() {
    if (!alive) return;
    const w = words[r];
    el.textContent = w.slice(0, c);
    if (!del && c === w.length) {
      del = true;
      timer = setTimeout(tick, 1600);
      return;
    }
    if (del && c === 0) {
      del = false;
      r = (r + 1) % words.length;
    }
    c += del ? -1 : 1;
    timer = setTimeout(tick, del ? 28 : 65);
  })();
  return () => {
    alive = false;
    clearTimeout(timer);
  };
}

export function goThroughTyped() {
  for (const el of document.querySelectorAll(".typed")) {
    const words = el.dataset.t.split(",").map((s) => s.trim());
    const hoverOnly = el.dataset.hover === "true";

    // Reduced motion: no animation, just show everything.
    if (reduce) {
      el.textContent = words.join(" · ");
      continue;
    }
    if (!hoverOnly) {
      typeLoop(el, words);
      continue;
    }

    // Hover-only: full list shown statically, animated while hovered/focused.
    const staticText = words.join(" · ");
    el.textContent = staticText;
    if (!canHover) continue; // touch devices just keep the static list
    const host = el.closest(".card") || el;
    let stop = null;
    const on = () => {
      stop?.();
      stop = typeLoop(el, words);
    };
    const off = () => {
      stop?.();
      stop = null;
      el.textContent = staticText;
    };
    host.addEventListener("mouseenter", on);
    host.addEventListener("focusin", on);
    host.addEventListener("mouseleave", off);
    host.addEventListener("focusout", off);
  }
}
