import { $, reduce } from "./utils.js";

const lines = [
  "> jacking in…",
  '> bypassing ICE ......... <span class="ok">ok</span>',
  '> decrypting profile ..... <span class="ok">ok</span>',
  "> link established",
];
const KEY = "boot-seen";

/* Plays once per browser session; click or any key skips it. */
export function runBoot(onDone) {
  const boot = $("#boot"),
    log = $("#bootlog");
  let finished = false,
    timer;

  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    removeEventListener("keydown", finish);
    boot.removeEventListener("click", finish);
    boot.classList.add("done");
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    onDone();
  };

  let seen = false;
  try {
    seen = sessionStorage.getItem(KEY) === "1";
  } catch {}
  if (reduce || seen) return finish();

  boot.addEventListener("click", finish);
  addEventListener("keydown", finish);

  let i = 0;
  (function next() {
    if (i < lines.length) {
      log.innerHTML += lines[i++] + "\n";
      timer = setTimeout(next, 380);
    } else timer = setTimeout(finish, 450);
  })();
}
