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
    {
      name: "Instagram",
      url: `https://www.instagram.com/${username}/`,
      type: "custom",
      check: (res2, content, finalUrl) => res2.status === 200 && !content.includes("page not found") && !content.includes("halaman ini tidak tersedia") && !finalUrl.includes("login")
    },
    {
      name: "TikTok",
      url: `https://www.tiktok.com/@${username}`,
      type: "custom",
      check: (res2, content) => (res2.status === 200 || res2.status === 301 || res2.status === 302) && !content.includes("couldn't find this account") && !content.includes("404")
    },
    {
      name: "Twitter (X)",
      url: `https://twitter.com/${username}`,
      type: "custom",
      check: (res2, content, finalUrl) => res2.status === 200 && !content.includes("this account doesn\u2019t exist") || finalUrl.includes(username)
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/${username}`,
      type: "custom",
      check: (res2, content, finalUrl) => res2.status === 200 && !content.includes("This page isn't available") && !finalUrl.includes("login")
    },
    {
      name: "YouTube",
      url: `https://www.youtube.com/@${username}`,
      type: "custom",
      check: (res2, content) => res2.status === 200 && !content.includes("This page isn't available") && !content.includes("404")
    },
    { name: "GitHub", url: `https://github.com/${username}`, type: "status" },
    {
      name: "Telegram",
      url: `https://t.me/${username}`,
      type: "custom",
      check: (res2, content) => res2.status === 200 && !content.includes('<meta property="og:title" content="Telegram: Contact">')
    },
    { name: "Reddit", url: `https://www.reddit.com/user/${username}/about.json`, type: "json" },
    { name: "Pinterest", url: `https://www.pinterest.com/${username}/`, type: "status" },
    { name: "Spotify", url: `https://open.spotify.com/user/${username}`, type: "status" },
    { name: "SoundCloud", url: `https://soundcloud.com/${username}`, type: "status" },
    { name: "Quora", url: `https://www.quora.com/profile/${username}`, type: "status" },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/in/${username}/`,
      type: "custom",
      check: (res2, content, finalUrl) => res2.status === 200 && !finalUrl.includes("authwall") && !finalUrl.includes("login")
    },
    {
      name: "Twitch",
      url: `https://www.twitch.tv/${username}`,
      type: "custom",
      check: (res2, content) => res2.status === 200 && content.includes(`"${username}"`)
    },
    { name: "Wikipedia", url: `https://en.wikipedia.org/wiki/User:${username}`, type: "status" },
    { name: "Snapchat", url: `https://www.snapchat.com/add/${username}`, type: "status" },
    { name: "Behance", url: `https://www.behance.net/${username}`, type: "status" },
    { name: "Dribbble", url: `https://dribbble.com/${username}`, type: "status" },
    { name: "Linktree", url: `https://linktr.ee/${username}`, type: "status" },
    { name: "Roblox", url: `https://www.roblox.com/user.aspx?username=${username}`, type: "status" },
    { name: "Wattpad", url: `https://www.wattpad.com/user/${username}`, type: "status" },
    { name: "Medium", url: `https://medium.com/@${username}`, type: "status" },
    { name: "Dev.to", url: `https://dev.to/${username}`, type: "status" },
    { name: "HackerNews", url: `https://news.ycombinator.com/user?id=${username}`, type: "text", errorText: "No such user" },
    { name: "WordPress", url: `https://${username}.wordpress.com/`, type: "status" },
    { name: "Blogger", url: `https://${username}.blogspot.com/`, type: "status" },
    { name: "Tumblr", url: `https://${username}.tumblr.com/`, type: "status" },
    {
      name: "Tokopedia",
      url: `https://www.tokopedia.com/${username}`,
      type: "status"
    },
    { name: "Bukalapak", url: `https://www.bukalapak.com/u/${username}`, type: "status" },
    {
      name: "Kaskus",
      url: `https://www.kaskus.co.id/profile/${username}`,
      type: "custom",
      check: (res2, content) => res2.status === 200 && !content.includes("halaman tidak ditemukan") && !content.includes("Not Found")
    },
    { name: "GitLab", url: `https://gitlab.com/${username}`, type: "status" },
    {
      name: "Steam",
      url: `https://steamcommunity.com/id/${username}`,
      type: "custom",
      check: (res2, content) => res2.status === 200 && !content.includes("The specified profile could not be found")
    },
    { name: "MyAnimeList", url: `https://myanimelist.net/profile/${username}`, type: "status" },
    { name: "Last.fm", url: `https://www.last.fm/user/${username}`, type: "status" },
    { name: "Ask.fm", url: `https://ask.fm/${username}`, type: "status" },
    { name: "DeviantArt", url: `https://www.deviantart.com/${username}`, type: "status" },
    { name: "Vimeo", url: `https://vimeo.com/${username}`, type: "status" },
    { name: "Patreon", url: `https://www.patreon.com/${username}`, type: "status" },
    { name: "Fiverr", url: `https://www.fiverr.com/${username}`, type: "status" },
    { name: "Flickr", url: `https://www.flickr.com/people/${username}/`, type: "status" }
  ];
  const scan = async (site) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1e4);
      const response = await import_axios.default.get(site.url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5"
        },
        maxRedirects: 5,
        validateStatus: (status) => status < 500
        // Handle 404s cleanly instead of throwing
      });
      clearTimeout(timeoutId);
      let exists = false;
      const content = String(response.data);
      const finalUrl = response.request?.res?.responseUrl ? response.request.res.responseUrl.toString() : site.url;
      if (site.type === "status") {
        exists = response.status === 200;
        if (exists && finalUrl !== site.url && !finalUrl.toLowerCase().includes(username.toLowerCase())) {
          exists = false;
        }
      } else if (site.type === "json") {
        exists = response.status === 200 && !response.data?.error;
      } else if (site.type === "text") {
        exists = response.status === 200 && !content.includes(site.errorText);
      } else if (site.type === "custom") {
        exists = site.check(response, content, finalUrl);
      }
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
        const response = await import_axios.default.get(url, { timeout: 15e3 });
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
