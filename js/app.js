const state = {
  repos: [],
  filter: "all",
  minecraftTab: location.hash === "#minecraft-packs" ? "packs" : "mods",
};

const els = {
  bar: document.getElementById("top-app-bar"),
  themeToggle: document.getElementById("theme-toggle"),
  themeIcon: document.getElementById("theme-icon"),
  filters: document.getElementById("filters"),
  catalog: document.getElementById("catalog"),
  featuredStack: document.getElementById("featured-stack"),
  showcaseTrack: document.getElementById("showcase-track"),
  statRepos: document.getElementById("stat-repos"),
  statTypes: document.getElementById("stat-types"),
  statUpdated: document.getElementById("stat-updated"),
  year: document.getElementById("year"),
};

function preferredTheme() {
  const saved = localStorage.getItem("aztrx-theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("aztrx-theme", theme);
  if (els.themeIcon) {
    els.themeIcon.textContent = theme === "dark" ? "light_mode" : "dark_mode";
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", theme === "dark" ? "#111318" : "#f8f9ff");
  }
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function displayName(repo) {
  return AZTRX.curated[repo.name]?.displayName || repo.name.replaceAll("_", " ").replaceAll("-", " ");
}

function description(repo) {
  return AZTRX.curated[repo.name]?.tagline || repo.description || "A public AZTRX Studio project on GitHub.";
}

function iconFor(repo, category) {
  return AZTRX.curated[repo.name]?.icon || category.icon;
}

async function fetchPublicRepos() {
  const url = `https://api.github.com/users/${AZTRX.githubUser}/repos?per_page=100&sort=updated`;
  const response = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
  });

  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}`);
  }

  const repos = await response.json();
  return repos
    .filter((repo) => !repo.fork && !repo.private && !AZTRX.excludeRepos.includes(repo.name))
    .map((repo) => ({
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      updated_at: repo.updated_at,
      topics: repo.topics || [],
      license: repo.license?.spdx_id || repo.license?.name || "",
      category: categorizeRepo(repo),
    }))
    .filter((repo) => !AZTRX.excludeCategories.includes(repo.category));
}

function fallbackRepos() {
  return Object.entries(AZTRX.curated)
    .filter(([name, meta]) => !AZTRX.excludeRepos.includes(name) && !AZTRX.excludeCategories.includes(meta.category))
    .map(([name, meta]) => ({
      name,
      description: meta.tagline,
      html_url: `${AZTRX.githubUrl}/${name}`,
      homepage: "",
      language: name === "PULSE" ? "TypeScript" : "Java",
      stargazers_count: 0,
      forks_count: 0,
      updated_at: "",
      topics: [],
      license: "",
      category: meta.category,
    }));
}

function renderFilters() {
  const chips = [
    { id: "all", label: "All", icon: "apps" },
    ...AZTRX.categories.map((category) => ({
      id: category.id,
      label: category.chip,
      icon: category.icon,
    })),
  ];

  els.filters.innerHTML = chips
    .map(
      (chip) => `
        <button class="chip" type="button" data-filter="${chip.id}" aria-pressed="${chip.id === state.filter}">
          <span class="material-symbols-outlined" aria-hidden="true">${chip.icon}</span>
          ${escapeHtml(chip.label)}
        </button>
      `,
    )
    .join("");
}

function showcasePicks(repos) {
  const picks = [];
  for (const name of ["Az_s_Companions", "PULSE"]) {
    const repo = repos.find((item) => item.name === name);
    if (repo) picks.push(repo);
  }

  const missing = (id) => !picks.some((item) => item.category === id);
  const extra = (id) => repos.find((item) => item.category === id && !picks.includes(item));
  if (missing("minecraft")) {
    const repo = extra("minecraft");
    if (repo) picks.push(repo);
  }
  if (missing("games")) {
    const repo = extra("games");
    if (repo) picks.push(repo);
  }

  return picks.slice(0, 2);
}

function showcaseCard(repo) {
  const category = AZTRX.categories.find((item) => item.id === repo.category);
  const home = repo.homepage && /^https?:\/\//.test(repo.homepage) ? repo.homepage : "";
  const viewHref = home || `#${category.id}`;

  return `
    <article class="showcase-card">
      <div class="card-media ${category.id}" aria-hidden="true">
        <span class="material-symbols-outlined">${iconFor(repo, category)}</span>
      </div>
      <div class="showcase-body">
        <span class="showcase-chip">
          <span class="material-symbols-outlined" aria-hidden="true">${category.icon}</span>
          ${escapeHtml(category.chip)}
        </span>
        <h3>${escapeHtml(displayName(repo))}</h3>
        <p>${escapeHtml(description(repo))}</p>
        <div class="card-actions">
          <a class="btn btn-filled btn-sm" href="${escapeHtml(viewHref)}">
            <span class="material-symbols-outlined" aria-hidden="true">visibility</span>
            View
          </a>
          <a class="btn btn-tonal btn-sm" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener noreferrer">
            <span class="material-symbols-outlined" aria-hidden="true">code</span>
            GitHub
          </a>
        </div>
      </div>
    </article>
  `;
}

function renderShowcase(repos) {
  if (!els.showcaseTrack) return;
  const picks = showcasePicks(repos);
  els.showcaseTrack.innerHTML = picks.map(showcaseCard).join("");
}

function renderFeatured(repos) {
  if (!els.featuredStack) return;
  const picks = showcasePicks(repos);

  els.featuredStack.innerHTML = picks
    .map((repo) => {
      const category = AZTRX.categories.find((item) => item.id === repo.category);
      return `
        <a class="mini-card" href="#showcase">
          <div class="mini-icon">
            <span class="material-symbols-outlined" aria-hidden="true">${iconFor(repo, category)}</span>
          </div>
          <div>
            <h3>${escapeHtml(displayName(repo))}</h3>
            <p>${escapeHtml(category.title)}</p>
          </div>
          <span class="material-symbols-outlined" aria-hidden="true">north_east</span>
        </a>
      `;
    })
    .join("");
}

function packDownload(pack) {
  return `${AZTRX.packsRepo.url}/releases/latest/download/${pack.id}.zip`;
}

function packCard(pack, featured) {
  const kindLabel = pack.kind === "datapack" ? "Datapack" : "Resource pack";
  const mediaClass = pack.kind === "datapack" ? "datapack" : "packs";

  return `
    <article class="project-card${featured ? " featured" : ""}">
      <div class="card-media ${mediaClass}" aria-hidden="true">
        <span class="material-symbols-outlined">${escapeHtml(pack.icon)}</span>
      </div>
      <div class="card-body">
        <div class="card-meta">
          <span class="badge lang">${escapeHtml(kindLabel)}</span>
          ${pack.versions ? `<span class="badge">${escapeHtml(pack.versions)}</span>` : ""}
        </div>
        <h3>${escapeHtml(pack.name)}</h3>
        <p class="desc">${escapeHtml(pack.tagline)}</p>
        ${
          pack.highlights?.length
            ? `<ul class="highlights">${pack.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
            : ""
        }
        <div class="card-actions">
          <a class="btn btn-filled btn-sm" href="${escapeHtml(packDownload(pack))}">
            <span class="material-symbols-outlined" aria-hidden="true">download</span>
            Download
          </a>
          ${
            pack.curseforge
              ? `<a class="btn btn-tonal btn-sm" href="${escapeHtml(pack.curseforge)}" target="_blank" rel="noopener noreferrer">
                  <span class="material-symbols-outlined" aria-hidden="true">storefront</span>
                  CurseForge
                </a>`
              : ""
          }
          <a class="btn btn-outlined btn-sm" href="${escapeHtml(AZTRX.packsRepo.url)}" target="_blank" rel="noopener noreferrer">
            <span class="material-symbols-outlined" aria-hidden="true">code</span>
            GitHub
          </a>
        </div>
      </div>
    </article>
  `;
}

function minecraftTabs() {
  const tab = state.minecraftTab === "packs" ? "packs" : "mods";
  return `
    <div class="section-tabs" role="tablist" aria-label="Minecraft catalog">
      <button class="chip" type="button" role="tab" data-mc-tab="mods" aria-selected="${tab === "mods"}" aria-pressed="${tab === "mods"}">
        <span class="material-symbols-outlined" aria-hidden="true">extension</span>
        Mods
      </button>
      <button class="chip" type="button" role="tab" data-mc-tab="packs" aria-selected="${tab === "packs"}" aria-pressed="${tab === "packs"}">
        <span class="material-symbols-outlined" aria-hidden="true">inventory_2</span>
        Resource Packs / Datapacks
      </button>
    </div>
  `;
}

function cardMarkup(repo, category, featured) {
  const curated = AZTRX.curated[repo.name];
  const product = storeProductForRepo(repo.name);
  const highlights = curated?.highlights || [...(repo.topics || [])].slice(0, 3);
  const home = repo.homepage && /^https?:\/\//.test(repo.homepage) ? repo.homepage : "";

  return `
    <article class="project-card${featured ? " featured" : ""}">
      <div class="card-media ${category.id}" aria-hidden="true">
        <span class="material-symbols-outlined">${iconFor(repo, category)}</span>
      </div>
      <div class="card-body">
        <div class="card-meta">
          ${repo.language ? `<span class="badge lang">${escapeHtml(repo.language)}</span>` : ""}
          ${repo.license ? `<span class="badge">${escapeHtml(repo.license)}</span>` : ""}
          <span class="badge">
            <span class="material-symbols-outlined" style="font-size:1rem">star</span>
            ${repo.stargazers_count}
          </span>
          ${repo.updated_at ? `<span class="badge">Updated ${escapeHtml(formatDate(repo.updated_at))}</span>` : ""}
        </div>
        <h3>${escapeHtml(displayName(repo))}</h3>
        <p class="desc">${escapeHtml(description(repo))}</p>
        ${
          highlights.length
            ? `<ul class="highlights">${highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
            : ""
        }
        <div class="card-actions">
          ${product ? storeBuyButton(product, "btn-sm") : ""}
          <a class="btn ${product ? "btn-tonal" : "btn-filled"} btn-sm" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener noreferrer">
            <span class="material-symbols-outlined" aria-hidden="true">code</span>
            View on GitHub
          </a>
          ${
            home
              ? `<a class="btn btn-outlined btn-sm" href="${escapeHtml(home)}" target="_blank" rel="noopener noreferrer">
                  <span class="material-symbols-outlined" aria-hidden="true">open_in_new</span>
                  Open project
                </a>`
              : ""
          }
        </div>
      </div>
    </article>
  `;
}

function renderCatalog(repos) {
  const filtered = state.filter === "all" ? repos : repos.filter((repo) => repo.category === state.filter);
  const visibleCategories =
    state.filter === "all"
      ? AZTRX.categories
      : AZTRX.categories.filter((category) => category.id === state.filter);

  if (!visibleCategories.length) {
    els.catalog.innerHTML = `<p class="empty-state">No public projects in this section yet.</p>`;
    return;
  }

  els.catalog.innerHTML = visibleCategories
    .map((category) => {
      const items = filtered.filter((repo) => repo.category === category.id);
      const showPacks = category.id === "minecraft" && state.minecraftTab === "packs";
      const packs = AZTRX.packs || [];
      const cards = showPacks
        ? packs.length
          ? packs.map((pack, index) => packCard(pack, index === 0)).join("")
          : `<p class="empty-state">No public packs in this section yet.</p>`
        : items.length
          ? items
              .map((repo, index) => cardMarkup(repo, category, items.length === 1 || index === 0))
              .join("")
          : `<p class="empty-state">No public projects in this section yet.</p>`;

      return `
        <section class="section" id="${category.id}" aria-labelledby="${category.id}-title">
          ${category.id === "minecraft" ? `<span id="minecraft-packs" hidden></span>` : ""}
          <div class="section-head">
            <div class="section-copy">
              <h2 id="${category.id}-title">
                <span class="section-icon">
                  <span class="material-symbols-outlined" aria-hidden="true">${category.icon}</span>
                </span>
                ${escapeHtml(category.title)}
              </h2>
              <p>${escapeHtml(category.subtitle)}</p>
            </div>
            ${category.id === "minecraft" ? minecraftTabs() : ""}
          </div>
          <div class="project-grid">
            ${cards}
          </div>
        </section>
      `;
    })
    .join("");
}

function renderStats(repos) {
  const types = new Set(repos.map((repo) => repo.category));
  els.statRepos.textContent = String(repos.length);
  els.statTypes.textContent = String(types.size);

  const latest = repos
    .map((repo) => repo.updated_at)
    .filter(Boolean)
    .sort()
    .at(-1);
  els.statUpdated.textContent = latest ? formatDate(latest) : "Live";
}

function render(repos) {
  state.repos = repos;
  renderFilters();
  renderShowcase(repos);
  renderFeatured(repos);
  renderCatalog(repos);
  renderStats(repos);
  initPolarEmbed();
}

els.filters?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  state.filter = button.dataset.filter;
  renderFilters();
  renderCatalog(state.repos);
});

els.catalog?.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-mc-tab]");
  if (!tab) return;
  state.minecraftTab = tab.dataset.mcTab === "packs" ? "packs" : "mods";
  history.replaceState(null, "", state.minecraftTab === "packs" ? "#minecraft-packs" : "#minecraft");
  renderCatalog(state.repos);
});

window.addEventListener("hashchange", () => {
  const next = location.hash === "#minecraft-packs" ? "packs" : "mods";
  if (location.hash !== "#minecraft" && location.hash !== "#minecraft-packs") return;
  if (state.minecraftTab === next) return;
  state.minecraftTab = next;
  renderCatalog(state.repos);
});

els.themeToggle?.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  refreshPolarThemes();
});

window.addEventListener("scroll", () => {
  els.bar?.classList.toggle("is-scrolled", window.scrollY > 8);
}, { passive: true });

if (els.year) {
  els.year.textContent = String(new Date().getFullYear());
}

applyTheme(preferredTheme());
render(fallbackRepos());

fetchPublicRepos()
  .then(render)
  .catch(() => {
    /* Curated fallback already rendered. */
  });
