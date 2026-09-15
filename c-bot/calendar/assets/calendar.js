(() => {
  "use strict";
  const config = window.SomaSyncCalendarConfig;
  const els = Object.fromEntries(["calendarApp", "calendarSignIn", "calendarAuth", "blockForm", "startAt", "endAt", "label", "formMessage", "refresh", "blockList"].map((id) => [id, document.getElementById(id)]));
  const apiUrl = (path) => `${config.apiBaseUrl.replace(/\/$/, "")}${path}`;

  function csrfCookie() {
    const prefix = `${encodeURIComponent(config.csrfCookieName)}=`;
    return document.cookie.split(";").map((value) => value.trim()).find((value) => value.startsWith(prefix))?.slice(prefix.length) || "";
  }

  function message(text = "", success = false) {
    els.formMessage.hidden = !text;
    els.formMessage.textContent = text;
    els.formMessage.className = success ? "success" : "";
  }

  function formatDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.valueOf()) ? "Unknown time" : new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
  }

  function renderBlocks(blocks) {
    els.blockList.replaceChildren();
    if (!Array.isArray(blocks) || blocks.length === 0) {
      const empty = document.createElement("li"); empty.className = "empty"; empty.textContent = "No documentation blocks scheduled."; els.blockList.append(empty); return;
    }
    blocks.forEach((block) => {
      const item = document.createElement("li");
      const time = document.createElement("time"); time.textContent = `${formatDate(block.startAt)}\n– ${formatDate(block.endAt)}`;
      const detail = document.createElement("div"); const title = document.createElement("b"); title.textContent = block.label; const meta = document.createElement("span"); meta.textContent = "Clinician-owned operational time block"; detail.append(title, meta); item.append(time, detail); els.blockList.append(item);
    });
  }

  async function loadBlocks() {
    const response = await fetch(apiUrl("/calendar/blocks"), { credentials: "include", cache: "no-store", headers: { Accept: "application/json" } });
    if (response.status === 401) throw new Error("session");
    if (!response.ok) throw new Error("load");
    const payload = await response.json(); renderBlocks(payload.blocks);
  }

  function localDateTime() {
    const date = new Date(); date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); return date.toISOString().slice(0, 16);
  }

  async function createBlock(event) {
    event.preventDefault(); message();
    const startAt = els.startAt.value; const endAt = els.endAt.value; const label = els.label.value.trim();
    if (!startAt || !endAt || !label) return message("Start time, end time, and an operational label are required.");
    if (new Date(endAt) <= new Date(startAt)) return message("End time must be after start time.");
    const csrf = csrfCookie(); if (!csrf) return message("Secure session verification is missing. Sign in again.");
    const button = els.blockForm.querySelector("button[type=submit]"); button.disabled = true;
    try {
      const response = await fetch(apiUrl("/calendar/blocks"), { method: "POST", credentials: "include", headers: { "Content-Type": "application/json", "X-SomaSync-CSRF": csrf, Accept: "application/json" }, body: JSON.stringify({ startAt: new Date(startAt).toISOString(), endAt: new Date(endAt).toISOString(), label }) });
      if (response.status === 401) throw new Error("session");
      if (!response.ok) throw new Error("create");
      message("Documentation block created.", true); els.startAt.value = localDateTime(); els.endAt.value = ""; await loadBlocks();
    } catch (error) {
      if (error.message === "session") { els.calendarApp.hidden = true; els.calendarSignIn.hidden = false; els.calendarAuth.textContent = "Sign-in required"; }
      else message("The time block could not be created. No clinical content was sent.");
    } finally { button.disabled = false; }
  }

  async function initialize() {
    els.startAt.value = localDateTime();
    try { await loadBlocks(); els.calendarApp.hidden = false; els.calendarAuth.textContent = "Secure session ready"; }
    catch (error) { els.calendarSignIn.hidden = false; els.calendarAuth.textContent = "Sign-in required"; }
  }

  els.blockForm.addEventListener("submit", createBlock); els.refresh.addEventListener("click", () => { loadBlocks().catch(() => message("The calendar could not be refreshed.")); }); initialize();
})();
