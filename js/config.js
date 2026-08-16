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
  excludeRepos: ["AZTRX.github.io", "Azturax.github.io", "minecraft-packs"],
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
      subtitle: "Mods, resource packs, and datapacks for inhabiting a world.",
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
  packsRepo: {
    name: "minecraft-packs",
    url: "https://github.com/Azturax/minecraft-packs",
    releases: "https://github.com/Azturax/minecraft-packs/releases/latest",
  },
  packs: [
    {
      id: "natures-carpet",
      name: "Nature's Carpet",
      kind: "resource",
      tagline: "Gives grass that extra feel of nature — a richer forest-floor carpet.",
      icon: "grass",
      versions: "1.21–26.1",
      highlights: ["Resource pack", "Grass", "1.21–26.1"],
      curseforge: "https://www.curseforge.com/minecraft/texture-packs/natures-carpet",
    },
    {
      id: "barren-lands",
      name: "Barren Lands",
      kind: "datapack",
      tagline: "Almost only Badlands biomes — a desolate, mesa-heavy overworld.",
      icon: "landscape",
      versions: "1.21.9–1.21.10",
      highlights: ["Datapack", "Worldgen", "Badlands"],
      curseforge: "https://www.curseforge.com/minecraft/data-packs/barren-lands-datapack-by-azturax",
    },
    {
      id: "amplified-ore-generation",
      name: "Amplified Ore Generation",
      kind: "datapack",
      tagline: "Makes vanilla ores more abundant without changing the rest of worldgen.",
      icon: "diamond",
      versions: "26.1",
      highlights: ["Datapack", "Ores", "26.1"],
      curseforge: "https://www.curseforge.com/minecraft/data-packs/amplified-ore-generation",
    },
    {
      id: "relicbound",
      name: "Relicbound",
      kind: "resource",
      tagline: "Hand-crafted icons that feel like weathered relics from forgotten empires.",
      icon: "swords",
      versions: "1.21–26.1",
      highlights: ["Resource pack", "Items", "1.21–26.1"],
      curseforge: "https://www.curseforge.com/minecraft/texture-packs/relicbound",
    },
    {
      id: "runesmiths-arsenal",
      name: "Runesmith's Arsenal",
      kind: "resource",
      tagline: "Tools and weapons etched with ancient runes and mythic craftsmanship.",
      icon: "hardware",
      versions: "1.21–26.1",
      highlights: ["Resource pack", "Tools", "1.21–26.1"],
      curseforge: "https://www.curseforge.com/minecraft/texture-packs/runesmiths-arsenal",
    },
    {
      id: "rustic-foods",
      name: "Rustic Foods",
      kind: "resource",
      tagline: "Transforms vanilla food icons with a rich, rustic style.",
      icon: "bakery_dining",
      versions: "1.21–26.1",
      highlights: ["Resource pack", "Food", "1.21–26.1"],
      curseforge: "https://www.curseforge.com/minecraft/texture-packs/rustic-foods",
    },
    {
      id: "natures-carpet-twigs-n-leaves",
      name: "Nature's Carpet: Twigs 'n' Leaves",
      kind: "resource",
      tagline: "Scattered twigs and leaves on grass for a natural forest floor.",
      icon: "forest",
      versions: "1.21–26.1",
      highlights: ["Resource pack", "Add-on", "1.21–26.1"],
      curseforge: "https://www.curseforge.com/minecraft/texture-packs/natures-carpet-twigs-n-leaves",
    },
    {
      id: "natures-carpet-wilder-flowers",
      name: "Nature's Carpet — Wilder Flowers",
      kind: "resource",
      tagline: "A lush floral overhaul that brings wildflowers into the grass.",
      icon: "local_florist",
      versions: "1.21–26.1",
      highlights: ["Resource pack", "Add-on", "1.21–26.1"],
      curseforge: "https://www.curseforge.com/minecraft/texture-packs/natures-carpet-wilder-flowers",
    },
    {
      id: "pebble-paths",
      name: "Pebble Paths",
      kind: "resource",
      tagline: "Adds a charming stony texture to dirt paths and walkways.",
      icon: "hiking",
      versions: "1.21–26.1",
      highlights: ["Resource pack", "Paths", "1.21–26.1"],
      curseforge: "https://www.curseforge.com/minecraft/texture-packs/pebble-paths",
    },
    {
      id: "cracked-and-broken",
      name: "Cracked & Broken",
      kind: "resource",
      tagline: "Natural cracks and mossy variations for stone, caves, and weathered builds.",
      icon: "foundation",
      versions: "1.21–26.1",
      highlights: ["Resource pack", "Stone", "1.21–26.1"],
      curseforge: "https://www.curseforge.com/minecraft/texture-packs/cracked-broken",
    },
    {
      id: "the-sky-sun-and-moon",
      name: "The Sky, Sun and Moon",
      kind: "resource",
      tagline: "Replaces the blocky sun and moon with circular celestial bodies.",
      icon: "clear_day",
      versions: "1.21.7–1.21.8",
      highlights: ["Resource pack", "Sky", "1.21.7"],
      curseforge: "https://www.curseforge.com/minecraft/texture-packs/the-sky-sun-and-moon",
    },
    {
      id: "muddy-way",
      name: "Muddy Ways",
      kind: "resource",
      tagline: "Makes path blocks extra muddy underfoot.",
      icon: "water",
      versions: "1.21.7–1.21.8",
      highlights: ["Resource pack", "Paths", "1.21.7"],
      curseforge: "https://www.curseforge.com/minecraft/texture-packs/muddy-ways",
    },
    {
      id: "os-scissum",
      name: "Os Scissum — Split Bone",
      kind: "resource",
      tagline: "Rustic bone-block textures with unique variations and natural rotations.",
      icon: "skeleton",
      versions: "1.21.7–1.21.8",
      highlights: ["Resource pack", "Bone", "1.21.7"],
      curseforge: "https://www.curseforge.com/minecraft/texture-packs/os-scissum-split-bone",
    },
    {
      id: "autumn-birch",
      name: "Autumn Birch",
      kind: "resource",
      tagline: "Autumn leaves for birch trees — the right feel for the season.",
      icon: "park",
      versions: "1.21.7–1.21.8",
      highlights: ["Resource pack", "Birch", "1.21.7"],
      curseforge: "https://www.curseforge.com/minecraft/texture-packs/autumn-birch-by-azturax",
    },
    {
      id: "autumn-birch-bushy",
      name: "Autumn Birch Bushy",
      kind: "resource",
      tagline: "Bushier autumn birch leaves for fuller seasonal canopies.",
      icon: "park",
      versions: "1.21.7–1.21.8",
      highlights: ["Resource pack", "Bushy", "1.21.7"],
      curseforge: "https://www.curseforge.com/minecraft/texture-packs/autumn-birch-by-azturax",
    },
    {
      id: "better-pines",
      name: "Better Pines",
      kind: "resource",
      tagline: "Turns spruce into a teal-green pine — made for winter worlds.",
      icon: "forest",
      versions: "1.21.7–1.21.8",
      highlights: ["Resource pack", "Spruce", "1.21.7"],
      curseforge: "https://www.curseforge.com/minecraft/texture-packs/better-pines",
    },
    {
      id: "better-pines-bushy",
      name: "Better Pines Bushy",
      kind: "resource",
      tagline: "The bushy-leaf edition of Better Pines.",
      icon: "forest",
      versions: "1.21.7–1.21.8",
      highlights: ["Resource pack", "Bushy", "1.21.7"],
      curseforge: "https://www.curseforge.com/minecraft/texture-packs/better-pines",
    },
    {
      id: "red-pines",
      name: "Red Pines",
      kind: "resource",
      tagline: "A warmer, reddish spruce canopy from the Better Pines set.",
      icon: "forest",
      versions: "1.21.7–1.21.8",
      highlights: ["Resource pack", "Spruce", "1.21.7"],
      curseforge: "https://www.curseforge.com/minecraft/texture-packs/better-pines",
    },
    {
      id: "red-pines-bushy",
      name: "Red Pines Bushy",
      kind: "resource",
      tagline: "Bushier red pine leaves for denser warm-toned spruce.",
      icon: "forest",
      versions: "1.21.7–1.21.8",
      highlights: ["Resource pack", "Bushy", "1.21.7"],
      curseforge: "https://www.curseforge.com/minecraft/texture-packs/better-pines",
    },
    {
      id: "hazel-oak",
      name: "Hazel Oak",
      kind: "resource",
      tagline: "Hazel-colored oak trees.",
      icon: "park",
      versions: "1.21.7–1.21.8",
      highlights: ["Resource pack", "Oak", "1.21.7"],
      curseforge: "https://www.curseforge.com/minecraft/texture-packs/hazel-oak",
    },
    {
      id: "hazel-oak-bushy",
      name: "Hazel Oak Bushy",
      kind: "resource",
      tagline: "The bushy-leaf edition of Hazel Oak.",
      icon: "park",
      versions: "1.21.7–1.21.8",
      highlights: ["Resource pack", "Bushy", "1.21.7"],
      curseforge: "https://www.curseforge.com/minecraft/texture-packs/hazel-oak",
    },
  ],
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
