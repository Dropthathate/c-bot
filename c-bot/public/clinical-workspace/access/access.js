(() => {
  "use strict";
  const config = window.SomaSyncClinicalConfig;
  const form = document.getElementById("accessForm");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const submit = document.getElementById("accessSubmit");
  const message = document.getElementById("accessMessage");
  const apiUrl = (path) => `${config.apiBaseUrl.replace(/\/$/, "")}${path}`;

  function setMessage(value = "") { message.hidden = !value; message.textContent = value; }

  form.addEventListener("submit", async (event) => {
    event.preventDefault(); setMessage();
    if (!email.value || !password.value) return setMessage("Email and password are required.");
    submit.disabled = true;
    try {
      const response = await fetch(apiUrl("/auth/session/password"), {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: email.value.trim(), password: password.value })
      });
      password.value = "";
      if (!response.ok) throw new Error("sign_in_failed");
      const confirmed = await fetch(apiUrl("/auth/session"), { credentials: "include", cache: "no-store", headers: { Accept: "application/json" } });
      if (!confirmed.ok) throw new Error("session_not_confirmed");
      window.location.assign("/clinical-workspace/");
    } catch { setMessage("The secure sign-in could not be verified. Check your details and try again."); }
    finally { submit.disabled = false; }
  });
})();
