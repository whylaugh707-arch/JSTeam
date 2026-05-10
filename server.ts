import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import dns from "dns";
import { promisify } from "util";

const resolveAny = promisify(dns.resolveAny);

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

  // Username Search
  app.post("/api/osint/username", async (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Username is required" });

    const sites = [
      { name: "Instagram", url: `https://www.instagram.com/${username}/` },
      { name: "TikTok", url: `https://www.tiktok.com/@${username}` },
      { name: "Twitter/X", url: `https://twitter.com/${username}` },
      { name: "GitHub", url: `https://github.com/${username}` },
      { name: "Facebook", url: `https://www.facebook.com/${username}` },
      { name: "YouTube", url: `https://www.youtube.com/@${username}` },
      { name: "Pinterest", url: `https://www.pinterest.com/${username}/` },
      { name: "LinkedIn", url: `https://www.linkedin.com/in/${username}/` },
      { name: "Reddit", url: `https://www.reddit.com/user/${username}` },
      { name: "Twitch", url: `https://www.twitch.tv/${username}` },
      { name: "SoundCloud", url: `https://soundcloud.com/${username}` },
      { name: "Medium", url: `https://medium.com/@${username}` },
      { name: "Steam", url: `https://steamcommunity.com/id/${username}` },
      { name: "DeviantArt", url: `https://www.deviantart.com/${username}` },
      { name: "Linktree", url: `https://linktr.ee/${username}` },
      { name: "Telegram", url: `https://t.me/${username}` },
      { name: "Bitbucket", url: `https://bitbucket.org/${username}/` },
      { name: "WordPress", url: `https://${username}.wordpress.com/` },
    ];

    const scan = async (site: any) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout per site

        const response = await axios.get(site.url, { 
          signal: controller.signal,
          headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          },
          maxRedirects: 3,
          validateStatus: (status) => status < 500
        });
        clearTimeout(timeoutId);

        const content = String(response.data).toLowerCase();
        let exists = response.status === 200;

        // More robust checks for sites that use anti-bot or custom error pages
        if (site.name === "Instagram" && (content.includes("login") || content.includes("checkpoint"))) exists = false;
        if (site.name === "TikTok" && (content.includes("not found") || content.includes("couldn't find"))) exists = false;
        if (site.name === "Twitter/X" && (content.includes("doesn’t exist") || content.includes("login"))) exists = false;
        if (site.name === "Facebook" && (content.includes("not found") || content.includes("login"))) exists = false;
        if (site.name === "GitHub" && (content.includes("not found") || response.status === 404)) exists = false;

        return { name: site.name, url: site.url, exists };
      } catch (error) {
        return { name: site.name, url: site.url, exists: false };
      }
    };

    // Parallel scan with limited sites to avoid timeout on Vercel
    const results = await Promise.all(sites.map(scan));
    res.json(results);
  });

  // IP Geolocation
  app.get("/api/osint/ip/:ip", async (req, res) => {
    const { ip } = req.params;
    try {
      // Using ipapi.co (fallback to http if https fails)
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
      // Final attempt with ip-api.com (http only)
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
        console.error("IP Error:", error.message);
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
        // Final fallback using system lookup
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
      // Try multiple providers
      const providers = [
        `https://rdap.org/domain/${domain}`,
        `https://whoisjs.com/api/v1/whois?domain=${domain}`
      ];

      for (const url of providers) {
        try {
          const response = await axios.get(url, { timeout: 5000 });
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }

export default app;
