const AZTRX = {
  githubUser: "Azturax",
  githubUrl: "https://github.com/Azturax",
  excludeRepos: ["AZTRX.github.io", "Azturax.github.io"],
  categories: [
    {
      id: "mods",
      title: "Minecraft Mods",
      subtitle: "Companions, systems, and new ways to inhabit a world.",
      icon: "pets",
      chip: "Mods",
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
      title: "Tools & Apps",
      subtitle: "Utilities and software that support the rest of the work.",
      icon: "terminal",
      chip: "Tools",
    },
    {
      id: "other",
      title: "Other projects",
      subtitle: "Everything else that does not fit a dedicated shelf yet.",
      icon: "auto_awesome",
      chip: "Other",
    },
  ],
  curated: {
    Az_s_Companions: {
      displayName: "Az's Companions",
      category: "mods",
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
    return "mods";
  }

  if (/game|pulse|reflex|rhythm|playable/.test(haystack)) {
    return "games";
  }

  if (/tool|cli|app|util|script|bot/.test(haystack)) {
    return "tools";
  }

  return "other";
}
