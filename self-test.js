(function () {
  const results = document.getElementById("self-test-results");
  const frame = document.getElementById("app-frame");

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function report(name, passed, detail) {
    const row = document.createElement("div");
    row.className = `result ${passed ? "pass" : "fail"}`;
    row.innerHTML = `<span>${name}${detail ? ` - ${detail}` : ""}</span><span class="badge">${passed ? "PASS" : "FAIL"}</span>`;
    results.appendChild(row);
  }

  async function runCheck(name, check) {
    try {
      const detail = await check();
      report(name, true, detail);
    } catch (error) {
      report(name, false, error instanceof Error ? error.message : String(error));
    }
  }

  function getAppDocument() {
    const doc = frame.contentDocument || frame.contentWindow?.document;
    if (!doc) {
      throw new Error("Cannot access app iframe.");
    }
    return doc;
  }

  function query(doc, selector) {
    const element = doc.querySelector(selector);
    if (!element) {
      throw new Error(`Missing selector: ${selector}`);
    }
    return element;
  }

  async function run() {
    const doc = getAppDocument();
    const win = frame.contentWindow;

    await runCheck("Page can load", () => {
      query(doc, "[data-testid='app-shell']");
      return "app shell found";
    });

    await runCheck("Sample cards render", () => {
      const cards = doc.querySelectorAll("[data-testid='clip-card']");
      if (cards.length < 1) {
        throw new Error("No clip cards rendered.");
      }
      return `${cards.length} card(s) found`;
    });

    await runCheck("Quick capture exists", () => {
      query(doc, "[data-testid='quick-capture']");
      query(doc, "[data-testid='floating-cards']");
      return "capture and grid found";
    });

    await runCheck("localStorage is available", () => {
      const key = "vault-local.self-test";
      win.localStorage.setItem(key, "ok");
      const value = win.localStorage.getItem(key);
      win.localStorage.removeItem(key);
      if (value !== "ok") {
        throw new Error("localStorage did not persist the probe value.");
      }
      return "probe value persisted";
    });

    await runCheck("Theme toggle works", async () => {
      const before = doc.documentElement.dataset.theme;
      query(doc, "[data-testid='theme-toggle']").click();
      await wait(80);
      const after = doc.documentElement.dataset.theme;
      if (!after || before === after) {
        throw new Error("Theme did not change.");
      }
      return `${before || "unset"} -> ${after}`;
    });

    await runCheck("Language toggle works", async () => {
      const before = doc.documentElement.lang;
      query(doc, "[data-testid='language-toggle']").click();
      await wait(80);
      const after = doc.documentElement.lang;
      if (!after || before === after) {
        throw new Error("Language did not change.");
      }
      return `${before || "unset"} -> ${after}`;
    });

    await runCheck("Settings modal opens", async () => {
      const settingsButton = doc.querySelector(".dock__settings");
      if (!settingsButton) {
        throw new Error("Missing settings dock button.");
      }
      settingsButton.click();
      await wait(100);
      query(doc, "[data-testid='matrix-modal']");
      return "settings dialog found";
    });

    await runCheck("PWA manifest is accessible", async () => {
      const response = await fetch(new URL("manifest.webmanifest", frame.src));
      if (!response.ok) {
        throw new Error("manifest.webmanifest not accessible.");
      }
      return "manifest loaded";
    });
  }

  function start() {
    results.textContent = "";
    run();
  }

  frame.addEventListener("load", start);

  if (frame.contentDocument?.readyState === "complete") {
    start();
  }
})();
