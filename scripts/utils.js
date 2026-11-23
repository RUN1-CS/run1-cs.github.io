export const $ = (s) => document.querySelector(s);
export const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- text scramble ---- */
export function scramble(el, text, ms = 900) {
  if (reduce) {
    el.textContent = text;
    return;
  }
  const chars = "!<>-_\\/[]{}=+*^?#01",
    t0 = performance.now();
  (function f(now) {
    const p = Math.min((now - t0) / ms, 1),
      n = Math.floor(p * text.length);
    el.textContent = text
      .split("")
      .map((c, i) =>
        c === " " || i < n ? c : chars[(Math.random() * chars.length) | 0],
      )
      .join("");
    if (p < 1) requestAnimationFrame(f);
  })(t0);
}

/* ---- typed text ---- */
const els = document.querySelectorAll(".typed");
function typeText(el, text) {
  if (reduce) {
    el.textContent = text;
    return;
  }
  const text_arr = text.split(",");
  let r = 0,
    c = 0,
    del = false;
  if (reduce) {
    el.textContent = text_arr[0];
    return;
  }
  (function tick() {
    const w = text_arr[r];
    el.textContent = w.slice(0, c);
    if (!del && c === w.length) {
      del = true;
      return setTimeout(tick, 1600);
    }
    if (del && c === 0) {
      del = false;
      r = (r + 1) % text_arr.length;
    }
    c += del ? -1 : 1;
    setTimeout(tick, del ? 28 : 65);
  })();
}

export function goThroughTyped() {
  for (const el of els) {
    const text = el.dataset.t;
    typeText(el, text);
  }
}
