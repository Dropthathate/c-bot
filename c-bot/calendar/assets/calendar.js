const config = window.SomaSyncCalendarConfig || {};
const apiOrigin = (config.apiOrigin || window.location.origin).replace(/\/$/, "");
const els = {
  notice: document.querySelector("#auth-notice"),
  today: document.querySelector("#today-label"),
  events: document.querySelector("#events"),
  form: document.querySelector("#time-block-form"),
  label: document.querySelector("#block-label"),
  start: document.querySelector("#block-start"),
  end: document.querySelector("#block-end"),
  toast: document.querySelector("#toast-region")
};

function assertHttps() {
  if (window.location.protocol === "https:" && !apiOrigin.startsWith("https://")) {
    throw new Error("Calendar API configuration must use HTTPS in production.");
  }
}

function csrfToken() {
  const match = document.cookie.split(";").map((entry) => entry.trim()).find((entry) => entry.startsWith("somasync_csrf="));
  return match ? decodeURIComponent(match.slice("somasync_csrf=".length)) : "";
}

function showNotice(message, error = false) {
  els.notice.textContent = message;
  els.notice.classList.toggle("error", error);
}

function toast(message, error = false) {
  const item = document.createElement("div");
  item.className = `toast${error ? " error" : ""}`;
  item.textContent = message;
  els.toast.append(item);
  window.setTimeout(() => item.remove(), 6000);
}

async function request(path, options = {}) {
  assertHttps();
  const method = (options.method || "GET").toUpperCase();
  const csrf = ["GET", "HEAD", "OPTIONS"].includes(method) ? "" : csrfToken();
  const response = await fetch(`${apiOrigin}${path}`, {
    ...options,
    credentials: "include",
    headers: { Accept: "application/json", ...(csrf ? { "X-SomaSync-CSRF": csrf } : {}), ...(options.headers || {}) }
  });
  if (response.status === 401) throw new Error("Your SomaSyncAI session has expired. Return to the voice workspace to sign in again.");
  if (!response.ok) throw new Error("Calendar service request failed.");
  return response.status === 204 ? null : response.json();
}

function renderEvents(events) {
  els.events.replaceChildren();
  if (!Array.isArray(events) || !events.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No time blocks are scheduled for today.";
    els.events.append(empty);
    return;
  }
  for (const event of events) {
    const row = document.createElement("article");
    row.className = "event";
    const time = document.createElement("time");
    const start = new Date(event.startsAt);
    time.dateTime = start.toISOString();
    time.textContent = start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    const copy = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = event.label;
    const duration = document.createElement("span");
    duration.textContent = `${new Date(event.startsAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} – ${new Date(event.endsAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
    copy.append(title, duration);
    row.append(time, copy);
    els.events.append(row);
  }
}

async function loadCalendar() {
  const session = await request("/api/v1/auth/session");
  showNotice(`Signed in as ${session.user.displayName || "SomaSyncAI clinician"}. Calendar uses your shared secure session.`);
  const data = await request("/api/v1/calendar/blocks?range=today");
  renderEvents(data.blocks);
}

function setDefaultTimes() {
  const start = new Date();
  start.setMinutes(Math.ceil(start.getMinutes() / 15) * 15, 0, 0);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const local = (date) => new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  els.start.value = local(start);
  els.end.value = local(end);
}

els.form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const startsAt = new Date(els.start.value);
  const endsAt = new Date(els.end.value);
  if (!(startsAt instanceof Date) || Number.isNaN(startsAt.valueOf()) || endsAt <= startsAt) {
    toast("Choose a valid start and end time.", true);
    return;
  }
  const button = els.form.querySelector("button");
  button.disabled = true;
  try {
    await request("/api/v1/calendar/blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: els.label.value.trim(), startsAt: startsAt.toISOString(), endsAt: endsAt.toISOString() })
    });
    els.label.value = "";
    setDefaultTimes();
    await loadCalendar();
    toast("Documentation time block created.");
  } catch (error) {
    toast(error instanceof Error ? error.message : "Could not create the time block.", true);
  } finally {
    button.disabled = false;
  }
});

els.today.textContent = new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
setDefaultTimes();
loadCalendar().catch((error) => {
  showNotice(error instanceof Error ? error.message : "Could not verify the calendar session.", true);
  els.events.replaceChildren();
});
