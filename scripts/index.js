import { runBoot } from "./boot.js";
import { scramble, scrambleIn, goThroughTyped, $, reduce } from "./utils.js";

/* ---- reveal + skill bars + scramble-on-reveal ---- */
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      const t = e.target;
      t.classList.add("in");
      t.querySelectorAll(".fill").forEach(
        (f) => (f.style.width = f.dataset.v + "%"),
      );
      scrambleIn(t);
      io.unobserve(t);
    }),
  { threshold: 0.2 },
);
document.querySelectorAll(".rv").forEach((el) => io.observe(el));
$("#xp").textContent = new Date().getFullYear() - 2023;

/* ---- highlight current section in the nav ---- */
const links = [...document.querySelectorAll("nav a")];
const navIo = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) =>
        a.getAttribute("href") === "#" + e.target.id
          ? a.setAttribute("aria-current", "true")
          : a.removeAttribute("aria-current"),
      );
    }),
  { rootMargin: "-45% 0px -50% 0px" },
);
document.querySelectorAll("main section").forEach((s) => navIo.observe(s));

/* ---- code rain background (throttled, pauses in background tabs) ---- */
const cv = $("#rain"),
  cx = cv.getContext("2d");
let drops = [];
function size() {
  cv.width = innerWidth;
  cv.height = innerHeight;
  drops = Array.from(
    { length: Math.floor(cv.width / 18) },
    () => Math.random() * -50,
  );
}
size();
addEventListener("resize", size);
let last = 0;
function rain(now) {
  requestAnimationFrame(rain);
  if (now - last < 50) return;
  last = now;
  cx.fillStyle = "rgba(6,7,14,.12)";
  cx.fillRect(0, 0, cv.width, cv.height);
  cx.font = "14px monospace";
  drops.forEach((y, i) => {
    cx.fillStyle = Math.random() > 0.97 ? "#ff2e88" : "#5ef2ff";
    cx.fillText(
      String.fromCharCode(0x30a0 + Math.random() * 96),
      i * 18,
      y * 18,
    );
    drops[i] = y * 18 > cv.height && Math.random() > 0.975 ? 0 : y + 0.5;
  });
}
if (!reduce) requestAnimationFrame(rain);

/* ---- contact terminal ---- */
const cmds = {
  help: "commands: whoami, projects, github, email, clear",
  whoami:
    "C and Linux nerd, hopefully making the world better. Glory to Linux.",
  projects: "Neon Kernel, XXSH, Amadeus, System Genesis. scroll up, or: github",
  github: "github.com/RUN1-CS",
  email: "REDACTED@REDACTED.REDACTED",
};
const input = $("#cmd"),
  out = $("#out");
const history = [];
let hi = 0;

input.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    e.preventDefault();
    hi = Math.max(
      0,
      Math.min(history.length, hi + (e.key === "ArrowUp" ? -1 : 1)),
    );
    input.value = history[hi] ?? "";
    return;
  }
  if (e.key === "Tab") {
    e.preventDefault();
    const v = input.value.trim().toLowerCase();
    const hit = [...Object.keys(cmds), "clear"].filter(
      (c) => v && c.startsWith(v),
    );
    if (hit.length === 1) input.value = hit[0];
    return;
  }
  if (e.key !== "Enter") return;
  const v = input.value.trim().toLowerCase();
  input.value = "";
  if (v) {
    history.push(v);
    hi = history.length;
  }
  out.classList.toggle("redacted", v === "email");
  if (v === "clear") {
    out.textContent = "";
    return;
  }
  scramble(out, cmds[v] || `unknown command: ${v || "(empty)"}. try help`, 500);
});
$(".term").addEventListener("click", () => input.focus());

/* ---- go ---- */
runBoot(() => {
  const name = $("#name");
  name.dataset.t = name.textContent; // feeds the glitch layers
  scramble(name, name.textContent, 900);
  const projectTitles = [...document.querySelectorAll(".project-title")];
  const glitch = (el) => {
    el.classList.add("glitch");
    setTimeout(() => el.classList.remove("glitch"), 360);
  };
  projectTitles.forEach((title) => {
    title.dataset.t ||= title.textContent;
  });
  goThroughTyped();
  if (reduce) return;
  projectTitles.forEach((title) => {
    title.closest(".card").addEventListener("mouseenter", () => glitch(title));
  });
  let projectIndex = 0;
  setInterval(() => {
    if (document.hidden) return;
    name.classList.add("glitch");
    setTimeout(() => name.classList.remove("glitch"), 360);
    if (projectTitles.length) {
      glitch(projectTitles[projectIndex]);
      projectIndex = (projectIndex + 1) % projectTitles.length;
    }
  }, 5200);
});
