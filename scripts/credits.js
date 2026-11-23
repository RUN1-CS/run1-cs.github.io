"use strict";

const SCRIPT = [
  "@logo",
  ["RUN1 ENRICHMENT CENTER", "h"],
  ["NIGHT CITY DIVISION // TEST CHAMBER 77", "d"],
  "",
  "Initializing development environment...",
  ["NixOS: ONLINE", "g"],
  ["Neural interface: OLLAMA CONNECTED", "g"],
  ["Git repository: CLEAN ENOUGH", "g"],
  "",
  ["SUBJECT IDENTIFIED: RUN1", "c"],
  "Occupation: IT Specialist",
  "Secondary occupation: Systems Architect",
  "Tertiary occupation: Everything else",
  "",
  "Headcount: 1",
  "Management: 1",
  "Engineering: 1",
  "Quality assurance: Also 1",
  "",
  "@pause",

  ["--- PROJECT DIVISION ---", "h"],
  "",
  ["AMADEUS", "c"],
  "Local intelligence. Private infrastructure.",
  "Ollama, PostgreSQL, TypeScript.",
  "The machines are finally talking.",
  "",
  ["SYSTEM GENESIS", "c"],
  "Log. Track. Control.",
  "Linux infrastructure monitoring.",
  "",
  ["NEON KERNEL", "c"],
  "Bare metal. No safety net.",
  "C, Assembly, and questionable decisions.",
  "",
  ["XXSH", "c"],
  "A shell of my own.",
  "Custom interpreter. Written in C.",
  "",
  "@pause",

  ["--- ENGINEERING DEPARTMENT ---", "h"],
  "",
  "Architecture ............ RUN1",
  "Backend ................. RUN1",
  "Frontend ................ RUN1",
  "Infrastructure .......... RUN1",
  "Database ................ RUN1",
  "Security ................ RUN1",
  "Documentation ........... RUN1",
  "Coffee acquisition ...... RUN1",
  "",
  ["--- TECHNOLOGY STACK ---", "h"],
  "TypeScript / JavaScript",
  "C / C++ / Assembly",
  "Vue / Node.js / PostgreSQL",
  "Docker / Linux / NixOS",
  "Ollama / pgvector / ComfyUI",
  "",
  ["--- SPECIAL THANKS ---", "h"],
  "The Linux kernel.",
  "The Nix ecosystem.",
  "The open-source community.",
  "The anime character in Fastfetch.",
  "The local LLM that occasionally hallucinates.",
  "Git, for keeping receipts.",
  "",
  "@pause",

  ["--- SYSTEM DIAGNOSTICS ---", "h"],
  "",
  ["Cyberdeck .............. OPERATIONAL", "g"],
  ["Firewall ............... ENABLED", "g"],
  ["Secure boot ............ OPTIONAL", "d"],
  ["Python indentation ..... UNDER INVESTIGATION", "d"],
  ["Windows ................ NOT FOUND", "d"],
  ["JavaScript ............. STILL JAVASCRIPT", "d"],
  "",
  ["--- FINAL REPORT ---", "h"],
  "",
  "Repositories: MULTIPLE",
  "Development department: ONE PERSON",
  "Technical debt: CLASSIFIED",
  "Sleep schedule: UNKNOWN",
  "",
  "@pause",

  ["CORPORATE MESSAGE", "h"],
  "Your productivity has been recorded.",
  "Your contributions have been monetized.",
  "Your soul remains your own.",
  "",
  ["Wake the f- up, Samurai.", "h"],
  ["We've got corpo systems to hack.", "h"],
  "",
  ["[ END OF TRANSMISSION ]", "d"],
  ["RUN1-CS // 2026", "c"],
  "",
  "@end",
];

addEventListener("DOMContentLoaded", () => {
  const text = document.getElementById("text");
  const logo = document.getElementById("logo");
  const system = document.getElementById("system");
  const start = document.getElementById("start");
  const replay = document.getElementById("replay");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  let session = 0;
  let started = false;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function play() {
    const currentSession = ++session;

    text.replaceChildren();
    logo.classList.remove("on");
    system.classList.remove("on");
    replay.style.display = "none";

    for (const item of SCRIPT) {
      if (currentSession !== session) return;

      if (item === "@logo") {
        logo.classList.add("on");
        system.classList.add("on");
        await sleep(1200);
        continue;
      }

      if (item === "@pause") {
        await sleep(1100);
        continue;
      }

      if (item === "@end") {
        replay.style.display = "block";
        return;
      }

      const [content, style] = Array.isArray(item) ? item : [item, ""];

      const line = document.createElement("div");
      line.className = `l ${style} cur`;
      text.appendChild(line);

      while (text.children.length > 22) {
        text.removeChild(text.firstChild);
      }

      for (const character of content) {
        if (currentSession !== session) return;

        line.textContent += character;

        if (!reducedMotion) {
          await sleep(character === " " ? 8 : 19);
        }
      }

      line.classList.remove("cur");
      await sleep(reducedMotion ? 0 : content ? 220 : 100);
    }
  }

  function begin() {
    if (started) return;

    started = true;
    start.remove();
    play();
  }

  start.addEventListener("click", begin);

  start.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      begin();
    }
  });

  replay.addEventListener("click", () => {
    play();
  });

  logo.addEventListener("error", () => {
    logo.style.display = "none";
  });
});
