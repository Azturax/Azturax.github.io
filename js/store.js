function storeProductForRepo(repoName) {
  return AZTRX.store.products.find((product) => product.repo && product.repo === repoName);
}

function polarTheme() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function refreshPolarThemes() {
  document.querySelectorAll("[data-polar-checkout]").forEach((node) => {
    node.setAttribute("data-polar-checkout-theme", polarTheme());
  });
}

function initPolarEmbed() {
  refreshPolarThemes();
  if (window.PolarEmbedCheckout?.init) {
    window.PolarEmbedCheckout.init();
  }
}

function clampAmount(euros) {
  const min = AZTRX.store.minAmount;
  const value = Number(euros);
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.round(value));
}

function formatEuros(euros) {
  return `${AZTRX.store.currencySymbol}${clampAmount(euros)}`;
}

function checkoutWithAmount(link, euros) {
  const url = new URL(link, window.location.href);
  url.searchParams.set("amount", String(clampAmount(euros) * 100));
  return url.toString();
}

function lookupPayable(id) {
  if (id === AZTRX.donate.id) return AZTRX.donate;
  const product = AZTRX.store.products.find((item) => item.id === id);
  if (product) return product;
  return (AZTRX.donate.ranks || []).find((item) => item.id === id);
}

function storeBuyHref(product, euros = AZTRX.store.minAmount) {
  if (product.checkoutLink) {
    if (product.period === "month") return product.checkoutLink;
    return checkoutWithAmount(product.checkoutLink, euros);
  }
  return AZTRX.store.sponsorsUrl || "";
}

function storeBuyButton(product, extraClass = "", euros = AZTRX.store.minAmount) {
  const href = storeBuyHref(product, euros);
  const classes = `btn btn-filled ${extraClass}`.trim();
  const label = `Pay ${formatEuros(euros)}`;

  if (product.checkoutLink) {
    return `
      <a
        class="${classes} js-pay"
        href="${escapeHtml(href)}"
        data-polar-checkout
        data-polar-checkout-theme="${polarTheme()}"
      >
        <span class="material-symbols-outlined" aria-hidden="true">favorite</span>
        <span class="js-pay-label">${escapeHtml(label)}</span>
      </a>
    `;
  }

  if (href) {
    return `
      <a class="${classes} js-pay" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">
        <span class="material-symbols-outlined" aria-hidden="true">favorite</span>
        Support on GitHub
      </a>
    `;
  }

  return `
    <a class="btn btn-tonal ${extraClass}" href="#shop">
      <span class="material-symbols-outlined" aria-hidden="true">storefront</span>
      Pay from ${escapeHtml(formatEuros(AZTRX.store.minAmount))}
    </a>
  `;
}

function amountPicker(id, label) {
  const min = AZTRX.store.minAmount;
  const chips = AZTRX.store.suggestedAmounts
    .map(
      (amount) => `
        <button
          class="chip"
          type="button"
          data-amount="${amount}"
          aria-pressed="${amount === min}"
        >${escapeHtml(formatEuros(amount))}</button>
      `,
    )
    .join("");

  return `
    <div class="amount-picker" data-product="${escapeHtml(id)}">
      <p class="amount-label">${escapeHtml(label)}</p>
      <div class="amount-chips">${chips}</div>
      <label class="amount-custom">
        <span>Custom</span>
        <input
          type="number"
          min="${min}"
          step="1"
          value="${min}"
          inputmode="numeric"
          data-custom-amount
          aria-label="Custom amount in euros"
        />
        <span>€</span>
      </label>
    </div>
  `;
}

function setCardAmount(card, euros) {
  const amount = clampAmount(euros);
  const productId = card.querySelector(".amount-picker")?.dataset.product;
  const product = lookupPayable(productId);
  if (!product) return;

  card.querySelectorAll("[data-amount]").forEach((chip) => {
    chip.setAttribute("aria-pressed", String(Number(chip.dataset.amount) === amount));
  });

  const custom = card.querySelector("[data-custom-amount]");
  if (custom && Number(custom.value) !== amount) {
    custom.value = String(amount);
  }

  const pay = card.querySelector(".js-pay");
  if (!pay || !product.checkoutLink) return;

  pay.setAttribute("href", storeBuyHref(product, amount));
  const label = pay.querySelector(".js-pay-label");
  if (label) {
    const verb = productId === "donate" ? "Donate" : "Pay";
    label.textContent = `${verb} ${formatEuros(amount)}`;
  }
}

function bindAmountEvents(root) {
  if (!root || root.dataset.bound === "true") return;
  root.dataset.bound = "true";

  root.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-amount]");
    if (!chip) return;
    const card = chip.closest(".store-card, .donate-panel");
    if (card) setCardAmount(card, Number(chip.dataset.amount));
  });

  const onAmount = (event) => {
    if (!event.target.matches("[data-custom-amount]")) return;
    const card = event.target.closest(".store-card, .donate-panel");
    if (card) setCardAmount(card, event.target.value);
  };

  root.addEventListener("input", onAmount);
  root.addEventListener("change", onAmount);
}

function renderStore() {
  const root = document.getElementById("store-grid");
  if (!root) return;

  const ready = AZTRX.store.products.some((product) => product.checkoutLink);
  const banner = document.getElementById("store-status");
  if (banner) {
    banner.classList.toggle("hidden", ready);
  }

  root.innerHTML = AZTRX.store.products
    .map((product) => {
      const repoUrl = product.repo ? `${AZTRX.githubUrl}/${product.repo}` : AZTRX.githubUrl;
      const freeHref = product.repo ? repoUrl : AZTRX.githubUrl;
      return `
        <article class="store-card" id="buy-${escapeHtml(product.id)}">
          <div class="card-media ${escapeHtml(product.category)}" aria-hidden="true">
            <span class="material-symbols-outlined">${escapeHtml(product.icon)}</span>
          </div>
          <div class="card-body">
            <div class="price-row">
              <strong class="price">Free</strong>
              <span class="price-note">or from ${escapeHtml(formatEuros(AZTRX.store.minAmount))}</span>
            </div>
            <h3>${escapeHtml(product.name)}</h3>
            <p class="desc">${escapeHtml(product.description)}</p>
            <ul class="highlights">
              ${product.includes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
            ${amountPicker(product.id, `Optional tip — your amount, minimum ${formatEuros(AZTRX.store.minAmount)}`)}
            <div class="card-actions">
              <a class="btn btn-tonal btn-sm" href="${escapeHtml(freeHref)}" target="_blank" rel="noopener noreferrer">
                <span class="material-symbols-outlined" aria-hidden="true">download</span>
                Get free
              </a>
              ${storeBuyButton(product, "btn-sm")}
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  bindAmountEvents(root);
  initPolarEmbed();
}

function rankHref(rank) {
  return storeBuyHref(rank);
}

function rankButton(rank) {
  const href = rankHref(rank);
  const classes = `btn ${rank.recommended ? "btn-filled" : "btn-tonal"}`;
  const label = `Become ${rank.name}`;

  if (rank.checkoutLink) {
    return `
      <a
        class="${classes}"
        href="${escapeHtml(href)}"
        data-polar-checkout
        data-polar-checkout-theme="${polarTheme()}"
      >
        <span class="material-symbols-outlined" aria-hidden="true">volunteer_activism</span>
        ${escapeHtml(label)}
      </a>
    `;
  }

  return `
    <a class="${classes}" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">
      <span class="material-symbols-outlined" aria-hidden="true">volunteer_activism</span>
      ${escapeHtml(label)}
    </a>
  `;
}

function rankCard(rank) {
  const badge = rank.recommended
    ? `<span class="rank-badge">Recommended</span>`
    : "";

  return `
    <article class="rank-card${rank.recommended ? " recommended" : ""}" id="rank-${escapeHtml(rank.id)}">
      <div class="card-media ${escapeHtml(rank.id)}" aria-hidden="true">
        <span class="material-symbols-outlined">${escapeHtml(rank.icon)}</span>
        ${badge}
      </div>
      <div class="card-body">
        <div class="price-row">
          <strong class="price">${escapeHtml(formatEuros(rank.amount))}</strong>
          <span class="price-note">/ ${escapeHtml(rank.period)}</span>
        </div>
        <h3>${escapeHtml(rank.name)}</h3>
        <p class="desc">${escapeHtml(rank.tagline || "")}</p>
        <ul class="rank-benefits">
          ${rank.benefits
            .map(
              (item) => `
                <li>
                  <span class="material-symbols-outlined" aria-hidden="true">check</span>
                  ${escapeHtml(item)}
                </li>
              `,
            )
            .join("")}
        </ul>
        <div class="card-actions">
          ${rankButton(rank)}
        </div>
      </div>
    </article>
  `;
}

function polarDonateReady() {
  return Boolean(AZTRX.donate.checkoutLink) || (AZTRX.donate.ranks || []).some((rank) => rank.checkoutLink);
}

function renderRanks() {
  const root = document.getElementById("rank-grid");
  if (!root) return;

  root.innerHTML = (AZTRX.donate.ranks || []).map(rankCard).join("");
  initPolarEmbed();
}

function donateButton(euros = AZTRX.store.minAmount) {
  const href = storeBuyHref(AZTRX.donate, euros);
  const label = `Donate ${formatEuros(euros)}`;

  if (AZTRX.donate.checkoutLink) {
    return `
      <a
        class="btn btn-filled js-pay"
        href="${escapeHtml(href)}"
        data-polar-checkout
        data-polar-checkout-theme="${polarTheme()}"
      >
        <span class="material-symbols-outlined" aria-hidden="true">volunteer_activism</span>
        <span class="js-pay-label">${escapeHtml(label)}</span>
      </a>
    `;
  }

  return `
    <a class="btn btn-filled js-pay" href="${escapeHtml(AZTRX.store.sponsorsUrl)}" target="_blank" rel="noopener noreferrer">
      <span class="material-symbols-outlined" aria-hidden="true">volunteer_activism</span>
      <span class="js-pay-label">Donate on GitHub</span>
    </a>
  `;
}

function renderDonate() {
  const root = document.getElementById("donate-panel");
  if (!root) return;

  const banner = document.getElementById("donate-status");
  if (banner) banner.classList.toggle("hidden", polarDonateReady());

  root.innerHTML = `
    <div class="donate-copy">
      <p class="kicker">
        <span class="material-symbols-outlined" aria-hidden="true">volunteer_activism</span>
        One-time
      </p>
      <h3>Leave a tip</h3>
      <p class="desc">
        No subscription needed. Pick any amount from ${escapeHtml(formatEuros(AZTRX.store.minAmount))}.
        Polar handles card checkout; GitHub Sponsors stays on GitHub.
      </p>
    </div>
    <div class="donate-form">
      ${amountPicker(AZTRX.donate.id, `Your amount, minimum ${formatEuros(AZTRX.store.minAmount)}`)}
      <div class="card-actions">
        ${donateButton()}
        <a class="btn btn-outlined btn-sm" href="${escapeHtml(AZTRX.store.sponsorsUrl)}" target="_blank" rel="noopener noreferrer">
          <span class="material-symbols-outlined" aria-hidden="true">favorite</span>
          GitHub Sponsors
        </a>
      </div>
    </div>
  `;

  bindAmountEvents(root);
  initPolarEmbed();
}

document.addEventListener("DOMContentLoaded", () => {
  renderStore();
  renderRanks();
  renderDonate();
});
