import express from "express";
import path from "path";
import axios from "axios";
import dns from "dns";
import cors from "cors";
import { promisify } from "util";
import crypto from "crypto";

const resolveAny = promisify(dns.resolveAny);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  console.log(`[DEBUG] Backend received: ${req.method} ${req.url}`);
  next();
});

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Username Search
app.post("/api/osint/username", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username is required" });

  const sites = [
    { 
      name: "Instagram", 
      url: `https://www.instagram.com/${username}/`, 
      type: "custom", 
      check: (res: any, content: string, finalUrl: string) => 
        res.status === 200 && 
        !content.includes("page not found") && 
        !content.includes("halaman ini tidak tersedia") && 
        !finalUrl.includes("login")
    },
    { 
      name: "TikTok", 
      url: `https://www.tiktok.com/@${username}`, 
      type: "custom", 
      check: (res: any, content: string) => 
        (res.status === 200 || res.status === 301 || res.status === 302) && 
        !content.includes("couldn't find this account") && 
        !content.includes("404")
    },
    { 
      name: "Twitter (X)", 
      url: `https://twitter.com/${username}`, 
      type: "custom", 
      check: (res: any, content: string, finalUrl: string) => 
        (res.status === 200 && !content.includes("this account doesn’t exist")) || 
        finalUrl.includes(username) 
    },
    { 
      name: "Facebook", 
      url: `https://www.facebook.com/${username}`, 
      type: "custom", 
      check: (res: any, content: string, finalUrl: string) => 
        res.status === 200 && !content.includes("This page isn't available") && !finalUrl.includes("login")
    },
    { 
      name: "YouTube", 
      url: `https://www.youtube.com/@${username}`, 
      type: "status"
    },
    { name: "GitHub", url: `https://github.com/${username}`, type: "status" },
    { 
      name: "Telegram", 
      url: `https://t.me/${username}`, 
      type: "custom", 
      check: (res: any, content: string) => 
        res.status === 200 && !content.includes('<meta property="og:title" content="Telegram: Contact">')
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
      check: (res: any, content: string, finalUrl: string) => 
        res.status === 200 && !finalUrl.includes("authwall") && !finalUrl.includes("login")
    },
    { 
      name: "Twitch", 
      url: `https://www.twitch.tv/${username}`, 
      type: "custom", 
      check: (res: any, content: string) => 
        res.status === 200 && content.includes(`"${username}"`)
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
      check: (res: any, content: string) => 
        res.status === 200 && !content.includes("halaman tidak ditemukan") && !content.includes("Not Found")
    },
    { name: "GitLab", url: `https://gitlab.com/${username}`, type: "status" },
    { 
      name: "Steam", 
      url: `https://steamcommunity.com/id/${username}`, 
      type: "custom", 
      check: (res: any, content: string) => 
        res.status === 200 && !content.includes("The specified profile could not be found")
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

  const scan = async (site: any) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); 

      const response = await axios.get(site.url, { 
        signal: controller.signal,
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        maxRedirects: 5,
        validateStatus: (status) => status < 500 // Handle 404s cleanly instead of throwing
      });
      clearTimeout(timeoutId);

      let exists = false;
      const content = String(response.data);
      const finalUrl = response.request?.res?.responseUrl ? response.request.res.responseUrl.toString() : site.url;

      if (site.type === "status") {
        exists = response.status === 200;
        // Generic redirect check for status checks: if it redirects to a generic login or home page, it's likely not found
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
    } catch (error: any) {
      // Return false instead of throwing so Promise.all completes
      return { name: site.name, url: site.url, exists: false };
    }
  };

  const results = await Promise.all(sites.map(scan));
  res.json(results);
});

// IP Geolocation
app.get("/api/osint/ip/:ip", async (req, res) => {
  const { ip } = req.params;
  try {
    const response = await axios.get(`https://ipapi.co/${ip}/json/`, { timeout: 5000 });
    
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
  } catch (error: any) {
    try {
      const response = await axios.get(`http://ip-api.com/json/${ip}`, { timeout: 3000 });
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

// DNS Lookup
app.get("/api/osint/dns/:domain", async (req, res) => {
  const { domain } = req.params;
  try {
    const types: (keyof typeof dns)[] = ["resolve4", "resolve6", "resolveMx", "resolveTxt", "resolveNs", "resolveCname"];
    const results = await Promise.all(
      types.map(async (type) => {
        try {
          const resolver = promisify(dns[type] as any);
          const data = await resolver(domain);
          const typeLabel = type.replace("resolve", "").toUpperCase();
          if (Array.isArray(data)) {
            return data.map((val: any) => ({
              type: typeLabel === "4" ? "A" : typeLabel === "6" ? "AAAA" : typeLabel,
              value: typeof val === 'string' ? val : JSON.stringify(val)
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
      const lookup = promisify(dns.lookup);
      const { address } = await lookup(domain);
      return res.json([{ type: 'A', value: address }]);
    }

    res.json(flatResults);
  } catch (error) {
    res.status(500).json({ error: "DNS_UNRESOLVABLE_OR_TIMEOUT" });
  }
});

// WHOIS
app.get("/api/osint/whois/:domain", async (req, res) => {
  const { domain } = req.params;
  try {
    const providers = [
      `https://rdap.org/domain/${domain}`,
      `https://whoisjs.com/api/v1/whois?domain=${domain}`
    ];

    for (const url of providers) {
      try {
        const response = await axios.get(url, { timeout: 15000 });
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

// Email Search using XposedOrNot and Gravatar
app.get("/api/osint/email/:email", async (req, res) => {
  const { email } = req.params;
  const results = {
    breaches: [],
    gravatar: null
  };

  try {
    // 1. Check Gravatar
    const emailHash = crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex');
    try {
      const gravatarResponse = await axios.get(`https://en.gravatar.com/${emailHash}.json`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 5000
      });
      if (gravatarResponse.data && gravatarResponse.data.entry && gravatarResponse.data.entry.length > 0) {
        results.gravatar = gravatarResponse.data.entry[0];
      }
    } catch (gErr: any) {
      // 404 means no gravatar found, ignore other errors
    }

    // 2. Check XposedOrNot
    const response = await axios.get(`https://api.xposedornot.com/v1/check-email/${email}`, { 
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
      }
    });
    
    if (response.data && response.data.breaches) {
       results.breaches = response.data.breaches;
    }
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      // 404 means no breaches found
    } else {
      const statusCode = error.response ? error.response.status : (error.code === 'ECONNABORTED' ? 408 : 500);
      const errorDetails = error.message || "Unknown error";
      console.error("XposedOrNot Error:", errorDetails);
      
      return res.status(statusCode).json({ 
        error: statusCode === 408 
          ? "Waktu pencarian habis. Server sumber terlalu lama merespon." 
          : statusCode === 403 
          ? "Akses diblokir oleh sistem anti-bot tujuan. Coba server berbeda."
          : `Gagal memproses permintaan pelacakan (Status ${statusCode}).`
      });
    }
  }
  
  res.json(results);
});

// Vite middleware for development
if (process.env.NODE_ENV === "development") {
  import("vite").then(({ createServer: createViteServer }) => {
    createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    }).then((vite) => {
      app.use(vite.middlewares);
    });
  });
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get('/', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start server (outside Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
