function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const AZTRX = {
  githubUser: "Azturax",
  githubUrl: "https://github.com/Azturax",
  excludeRepos: ["AZTRX.github.io", "Azturax.github.io"],
  excludeCategories: [],
  store: {
    polarOrg: "azturax",
    polarStorefront: "https://polar.sh/azturax",
    sponsorsUrl: "https://github.com/sponsors/Azturax",
    successUrl: "https://azturax.github.io/thanks.html",
    currency: "EUR",
    currencySymbol: "€",
    minAmount: 6,
    suggestedAmounts: [6, 10, 15, 25],
    // Polar product: Pay what you want, currency EUR, minimum €6.
    // Paste Checkout Link URLs into each product.checkoutLink.
    products: [
      {
        id: "pulse",
        repo: "PULSE",
        name: "PULSE",
        category: "games",
        icon: "graphic_eq",
        description: "A one-tap reflex game about rhythm, pacing, and split-second timing.",
        includes: ["Free on GitHub", "Pay what you want from €6", "Desktop build"],
        checkoutLink: "",
        sponsorsFallback: true,
      },
    ],
  },
  donate: {
    id: "donate",
    checkoutLink: "",
    sponsorsFallback: true,
    ranks: [
      {
        id: "spark",
        name: "Spark",
        amount: 6,
        period: "month",
        recommended: false,
        icon: "auto_awesome",
        tagline: "Light the studio — a credit and a badge.",
        benefits: ["Name in the studio credits", "Supporter badge"],
        checkoutLink: "",
      },
      {
        id: "pulse",
        name: "Pulse",
        amount: 10,
        period: "month",
        recommended: true,
        icon: "graphic_eq",
        tagline: "Stay in the rhythm of what ships next.",
        benefits: ["Everything in Spark", "Early looks at games in progress"],
        checkoutLink: "",
      },
      {
        id: "resonance",
        name: "Resonance",
        amount: 15,
        period: "month",
        recommended: false,
        icon: "waves",
        tagline: "Hear how the work actually comes together.",
        benefits: ["Everything in Pulse", "Behind-the-scenes notes from the studio"],
        checkoutLink: "",
      },
      {
        id: "aether",
        name: "Aether",
        amount: 25,
        period: "month",
        recommended: false,
        icon: "blur_on",
        tagline: "Closest seat to new experiments.",
        benefits: [
          "Everything in Resonance",
          "Highest credit placement",
          "First look at new experiments",
        ],
        checkoutLink: "",
      },
    ],
  },
  categories: [
    {
      id: "minecraft",
      title: "Minecraft",
      subtitle: "Companions, systems, and new ways to inhabit a world.",
      icon: "pets",
      chip: "Minecraft",
    },
    {
      id: "games",
      title: "Games",
      subtitle: "Playable experiments built around feel, timing, and atmosphere.",
      icon: "sports_esports",
      chip: "Games",
    },
    {
      id: "tools",
      title: "Tools",
      subtitle: "Utilities and software that support the rest of the work.",
      icon: "terminal",
      chip: "Tools",
    },
    {
      id: "misc",
      title: "Misc",
      subtitle: "Everything else that does not fit a dedicated shelf yet.",
      icon: "auto_awesome",
      chip: "Misc",
    },
  ],
  curated: {
    Az_s_Companions: {
      displayName: "Az's Companions",
      category: "minecraft",
      tagline:
        "A wholesome companion mod for Minecraft. Follow, gather, gift, and explore together across NeoForge, Fabric, and Forge.",
      highlights: ["Minecraft 1.20.1–1.21.5", "NeoForge · Fabric · Forge", "Companion AI"],
      icon: "pets",
    },
    PULSE: {
      displayName: "PULSE",
      category: "games",
      tagline: "A one-tap reflex game about rhythm, pacing, and split-second timing.",
      highlights: ["TypeScript", "Reflex", "Rhythm"],
      icon: "graphic_eq",
    },
  },
};

function categorizeRepo(repo) {
  const curated = AZTRX.curated[repo.name];
  if (curated?.category) return curated.category;

  const haystack = [repo.name, repo.description, ...(repo.topics || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    /minecraft|neoforge|fabric|forge|modrinth|curseforge|\bmod\b|companion/.test(haystack) ||
    repo.language === "Java"
  ) {
    return "minecraft";
  }

  if (/game|pulse|reflex|rhythm|playable/.test(haystack)) {
    return "games";
  }

  if (/tool|cli|app|util|script|bot/.test(haystack)) {
    return "tools";
  }

  return "misc";
}
