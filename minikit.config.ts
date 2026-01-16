const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://jesse-man.vercel.app` : 'https://jesse-man.vercel.app');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: {
    header: "eyJmaWQiOjE5NzMyMiwidHlwZSI6ImF1dGgiLCJrZXkiOiIweGQ4RTAzRGIxMWRDOUJCYjVBMTNhZjQ4QTUxMTc0MGRjMTBjQjQ0RDUifQ",
    payload: "eyJkb21haW4iOiJqZXNzZS1tYW4udmVyY2VsLmFwcCJ9",
    signature: "AoDcP6QT6XirOJ36gUUXGH6ytfHXyPmCjDHRYDSjE3NT26vsPhrYZi+OWfXi/I3KUHp6GeXvVaCzSRTHJgwwRhs="
  },
  miniapp: {
    version: "1",
    name: "Jesse Man", 
    subtitle: "Eat Moaar win moaar", 
    description: "Jesse Man eat the on chain",
    screenshotUrls: [`${ROOT_URL}/jessesplash.png`],
    iconUrl: `${ROOT_URL}/jesseiconhd.png`,
    splashImageUrl: `${ROOT_URL}/jesseman.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "games",
    tags: ["games", "quickstart", "pacman", "playing"],
    heroImageUrl: `${ROOT_URL}/jesseland.png`, 
    tagline: "Eat Moaar win moaar",
    ogTitle: "Jesse Man",
    ogDescription: "Jesse Man eat the on chain",
    ogImageUrl: `${ROOT_URL}/jesseland.png`,
  },
} as const;

