var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// api/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_axios = __toESM(require("axios"), 1);
var import_dns = __toESM(require("dns"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_util = require("util");
var resolveAny = (0, import_util.promisify)(import_dns.default.resolveAny);
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
app.use((0, import_cors.default)({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use((req, res, next) => {
  console.log(`[DEBUG] Backend received: ${req.method} ${req.url}`);
  next();
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});
app.post("/api/osint/username", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username is required" });
  const sites = [
    { name: "Instagram", url: `https://www.instagram.com/${username}/` },
    { name: "TikTok", url: `https://www.tiktok.com/@${username}` },
    { name: "X (Twitter)", url: `https://twitter.com/${username}` },
    { name: "Facebook", url: `https://www.facebook.com/${username}` },
    { name: "YouTube", url: `https://www.youtube.com/@${username}` },
    { name: "Reddit", url: `https://www.reddit.com/user/${username}` },
    { name: "GitHub", url: `https://github.com/${username}` },
    { name: "LinkedIn", url: `https://www.linkedin.com/in/${username}/` },
    { name: "Pinterest", url: `https://www.pinterest.com/${username}/` },
    { name: "Medium", url: `https://medium.com/@${username}` },
    { name: "SoundCloud", url: `https://soundcloud.com/${username}` },
    { name: "Twitch", url: `https://www.twitch.tv/${username}` },
    { name: "Wattpad", url: `https://www.wattpad.com/user/${username}` },
    { name: "Ask.fm", url: `https://ask.fm/${username}` },
    { name: "Spotify", url: `https://open.spotify.com/user/${username}` },
    { name: "Quora", url: `https://www.quora.com/profile/${username}` },
    { name: "Behance", url: `https://www.behance.net/${username}` },
    { name: "Dribbble", url: `https://dribbble.com/${username}` },
    { name: "Linktree", url: `https://linktr.ee/${username}` },
    { name: "Telegram", url: `https://t.me/${username}` }
  ];
  const scan = async (site) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6e3);
      const response = await import_axios.default.get(site.url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9"
        },
        maxRedirects: 5,
        validateStatus: (status) => status < 500
      });
      clearTimeout(timeoutId);
      const content = String(response.data).toLowerCase();
      let exists = response.status === 200;
      if (site.name === "Instagram" && (content.includes("login") || content.includes("checkpoint") || content.includes("halaman ini tidak tersedia"))) exists = false;
      if (site.name === "TikTok" && (content.includes("not found") || content.includes("couldn't find") || content.includes("halaman tidak ditemukan"))) exists = false;
      if (site.name === "Twitter/X" && (content.includes("doesn\u2019t exist") || content.includes("login") || content.includes("halaman tidak ada"))) exists = false;
      if (site.name === "Facebook" && (content.includes("not found") || content.includes("login") || content.includes("konten tidak ditemukan"))) exists = false;
      if (site.name === "GitHub" && (content.includes("not found") || response.status === 404)) exists = false;
      if (site.name === "LinkedIn" && (content.includes("halaman tidak ditemukan") || content.includes("not found"))) exists = false;
      if (site.name === "Reddit" && (content.includes("not found") || content.includes("maaf, halaman ini tidak tersedia"))) exists = false;
      if (site.name === "YouTube" && (content.includes("halaman tidak tersedia") || content.includes("not found"))) exists = false;
      if (site.name === "Steam" && content.includes("could not be found")) exists = false;
      if (site.name === "Roblox" && (content.includes("not found") || content.includes("tidak ditemukan"))) exists = false;
      if (response.status === 404) exists = false;
      return { name: site.name, url: site.url, exists };
    } catch (error) {
      return { name: site.name, url: site.url, exists: false };
    }
  };
  const results = await Promise.all(sites.map(scan));
  res.json(results);
});
app.get("/api/osint/ip/:ip", async (req, res) => {
  const { ip } = req.params;
  try {
    const response = await import_axios.default.get(`https://ipapi.co/${ip}/json/`, { timeout: 5e3 });
    if (response.data.error) {
      throw new Error(response.data.reason || "IP resolution failed");
    }
    const data = {
      ip: response.data.ip,
      city: response.data.city,
      region: response.data.region,
      country_name: response.data.country_name,
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      org: response.data.org,
      timezone: response.data.timezone,
      postal: response.data.postal
    };
    res.json(data);
  } catch (error) {
    try {
      const response = await import_axios.default.get(`http://ip-api.com/json/${ip}`, { timeout: 3e3 });
      const data = {
        ip: response.data.query,
        city: response.data.city,
        region: response.data.regionName,
        country_name: response.data.country,
        latitude: response.data.lat,
        longitude: response.data.lon,
        org: response.data.isp || response.data.org,
        timezone: response.data.timezone,
        postal: response.data.zip
      };
      return res.json(data);
    } catch (e) {
      res.status(500).json({ error: "NODE_CONN_TIMEOUT" });
    }
  }
});
app.get("/api/osint/dns/:domain", async (req, res) => {
  const { domain } = req.params;
  try {
    const types = ["resolve4", "resolve6", "resolveMx", "resolveTxt", "resolveNs", "resolveCname"];
    const results = await Promise.all(
      types.map(async (type) => {
        try {
          const resolver = (0, import_util.promisify)(import_dns.default[type]);
          const data = await resolver(domain);
          const typeLabel = type.replace("resolve", "").toUpperCase();
          if (Array.isArray(data)) {
            return data.map((val) => ({
              type: typeLabel === "4" ? "A" : typeLabel === "6" ? "AAAA" : typeLabel,
              value: typeof val === "string" ? val : JSON.stringify(val)
            }));
          }
          return [];
        } catch (e) {
          return [];
        }
      })
    );
    const flatResults = results.flat();
    if (flatResults.length === 0) {
      const lookup = (0, import_util.promisify)(import_dns.default.lookup);
      const { address } = await lookup(domain);
      return res.json([{ type: "A", value: address }]);
    }
    res.json(flatResults);
  } catch (error) {
    res.status(500).json({ error: "DNS_UNRESOLVABLE_OR_TIMEOUT" });
  }
});
app.get("/api/osint/whois/:domain", async (req, res) => {
  const { domain } = req.params;
  try {
    const providers = [
      `https://rdap.org/domain/${domain}`,
      `https://whoisjs.com/api/v1/whois?domain=${domain}`
    ];
    for (const url of providers) {
      try {
        const response = await import_axios.default.get(url, { timeout: 5e3 });
        if (response.data && Object.keys(response.data).length > 0) {
          return res.json(response.data);
        }
      } catch (e) {
        continue;
      }
    }
    res.status(500).json({ error: "REGISTRY_TIMEOUT_OR_BLOCKED" });
  } catch (error) {
    res.status(500).json({ error: "REGISTRY_TIMEOUT_OR_BLOCKED" });
  }
});
if (process.env.NODE_ENV === "development") {
  import("vite").then(({ createServer: createViteServer }) => {
    createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    }).then((vite) => {
      app.use(vite.middlewares);
    });
  });
} else {
  const distPath = import_path.default.join(process.cwd(), "dist");
  app.use(import_express.default.static(distPath));
  app.get("/", (req, res) => {
    res.sendFile(import_path.default.join(distPath, "index.html"));
  });
  app.get("*", (req, res) => {
    res.sendFile(import_path.default.join(distPath, "index.html"));
  });
}
if (!process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
var index_default = app;
//# sourceMappingURL=server.cjs.map
