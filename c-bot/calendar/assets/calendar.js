(() => {
  "use strict";
  const config = window.SomaSyncCalendarConfig;
  const els = Object.fromEntries(["calendarApp", "authRequired", "sessionState", "todayDate", "blocks", "blockForm", "blockLabel", "startsAt", "endsAt", "formError"].map((id) => [id, document.getElementById(id)]));

  function getCookie(name) {
    const prefix = `${encodeURIComponent(name)}=`;
    return document.cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(prefix))?.slice(prefix.length) || "";
  }
  function api(path) { return `${config.apiBaseUrl.replace(/\/$/, "")}${path}`; }
  function showError(message = "") { els.formError.hidden = !message; els.formError.textContent = message; }
  function formatTime(value) { return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(value)); }
  function localInputValue(date) { const offset = date.getTimezoneOffset() * 60_000; return new Date(date.valueOf() - offset).toISOString().slice(0, 16); }

  function renderBlocks(blocks) {
    els.blocks.replaceChildren();
    if (!blocks.length) {
      const empty = document.createElement("p"); empty.className = "empty"; empty.textContent = "No protected documentation time blocks have been added for today."; els.blocks.append(empty); return;
    }
    blocks.forEach((block) => {
      const item = document.createElement("article"); item.className = "block";
      const title = document.createElement("strong"); title.textContent = block.label;
      const detail = document.createElement("span"); detail.textContent = `${formatTime(block.startsAt)} – ${formatTime(block.endsAt)}`;
      item.append(title, detail); els.blocks.append(item);
    });
  }

  async function loadBlocks() {
    const response = await fetch(api("/calendar/blocks?range=today"), { credentials: "include", cache: "no-store", headers: { Accept: "application/json" } });
    if (response.status === 401) throw new Error("session_required");
    if (!response.ok) throw new Error("schedule_unavailable");
    const payload = await response.json();
    renderBlocks(Array.isArray(payload.blocks) ? payload.blocks : []);
  }

  async function verifySession() {
    try {
      const response = await fetch(api("/auth/session"), { credentials: "include", cache: "no-store", headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("session_required");
      els.calendarApp.hidden = false;
      els.sessionState.textContent = "Secure shared session ready";
      await loadBlocks();
    } catch {
      els.authRequired.hidden = false;
      els.sessionState.textContent = "Sign-in required";
    }
  }

  els.blockForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    showError();
    const label = els.blockLabel.value.trim();
    const starts = new Date(els.startsAt.value);
    const ends = new Date(els.endsAt.value);
    if (!label || label.length > 80 || /patient|client|name|dob/i.test(label)) return showError("Use a short operational label only. Do not enter patient or clinical information.");
    if (!Number.isFinite(starts.valueOf()) || !Number.isFinite(ends.valueOf()) || ends <= starts) return showError("Choose a valid end time after the start time.");
    const csrf = getCookie(config.csrfCookieName);
    if (!csrf) return showError("Secure session verification is missing. Please sign in again.");

    const submit = event.currentTarget.querySelector("button[type='submit']");
    submit.disabled = true;
    try {
      const response = await fetch(api("/calendar/blocks"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", "X-SomaSync-CSRF": csrf },
        body: JSON.stringify({ label, startsAt: starts.toISOString(), endsAt: ends.toISOString() })
      });
      if (response.status === 401 || response.status === 403) throw new Error("session_required");
      if (!response.ok) throw new Error("schedule_unavailable");
      els.blockForm.reset();
      setDefaults();
      await loadBlocks();
    } catch (error) {
      showError(error.message === "session_required" ? "Your secure session expired. Return to the access portal and sign in again." : "The time block could not be saved. No schedule changes were confirmed.");
    } finally {
      submit.disabled = false;
    }
  });

  function setDefaults() {
    const start = new Date(); start.setSeconds(0, 0); start.setMinutes(Math.ceil(start.getMinutes() / 15) * 15);
    const end = new Date(start.valueOf() + 30 * 60_000);
    els.startsAt.value = localInputValue(start); els.endsAt.value = localInputValue(end);
    els.todayDate.textContent = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(new Date());
  }

  setDefaults();
  verifySession();
})();
