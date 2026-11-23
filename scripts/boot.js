import { scramble, $, reduce, goThroughTyped } from "./utils.js";

/* ---- boot sequence (the one big moment) ---- */
const lines = [
  "> jacking in…",
  '> bypassing ICE ......... <span class="ok">ok</span>',
  '> decrypting profile ..... <span class="ok">ok</span>',
  "> link established",
];
const boot = $("#boot"),
  log = $("#bootlog");

export function runBoot() {
  if (reduce) {
    boot.classList.add("done");
    start();
    return;
  }
  let i = 0;
  (function next() {
    if (i < lines.length) {
      log.innerHTML += lines[i++] + "\n";
      setTimeout(next, 380);
    } else
      setTimeout(() => {
        boot.classList.add("done");
        start();
      }, 450);
  })();
}

function start() {
  const n = $("#name");
  scramble(n, n.dataset.t, 1000);
  goThroughTyped();
  setInterval(() => {
    n.classList.add("glitch");
    setTimeout(() => n.classList.remove("glitch"), 360);
  }, 5200);
}
