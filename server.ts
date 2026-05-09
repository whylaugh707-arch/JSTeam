import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import dns from "dns";
import { promisify } from "util";

const resolveAny = promisify(dns.resolveAny);

async function startServer() {
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
      { name: "Tumblr", url: `https://${username}.tumblr.com/` },
      { name: "Behance", url: `https://www.behance.net/${username}` },
      { name: "Dribbble", url: `https://dribbble.com/${username}` },
      { name: "Steam", url: `https://steamcommunity.com/id/${username}` },
      { name: "Wattpad", url: `https://www.wattpad.com/user/${username}` },
      { name: "DeviantArt", url: `https://www.deviantart.com/${username}` },
      { name: "Kaskus", url: `https://www.kaskus.co.id/@${username}` },
      { name: "Linktree", url: `https://linktr.ee/${username}` },
      { name: "Roblox", url: `https://www.roblox.com/user.aspx?username=${username}` },
      { name: "Chess.com", url: `https://www.chess.com/member/${username}` },
      { name: "GitLab", url: `https://gitlab.com/${username}` },
      { name: "Spotify", url: `https://open.spotify.com/user/${username}` },
      { name: "Vimeo", url: `https://vimeo.com/${username}` },
      { name: "Patreon", url: `https://www.patreon.com/${username}` },
      { name: "Flickr", url: `https://www.flickr.com/people/${username}/` },
      { name: "Snapchat", url: `https://www.snapchat.com/add/${username}` },
      { name: "Telegram", url: `https://t.me/${username}` },
      { name: "Bitbucket", url: `https://bitbucket.org/${username}/` },
      { name: "Quora", url: `https://www.quora.com/profile/${username}` },
      { name: "About.me", url: `https://about.me/${username}` },
      { name: "Carrd", url: `https://${username}.carrd.co/` },
      { name: "Buy Me A Coffee", url: `https://www.buymeacoffee.com/${username}` },
      { name: "Ko-fi", url: `https://ko-fi.com/${username}` },
      { name: "Kompasiana", url: `https://www.kompasiana.com/${username}` },
      { name: "Tokopedia", url: `https://www.tokopedia.com/people/${username}` },
      { name: "Bukalapak", url: `https://www.bukalapak.com/u/${username}` },
      { name: "Blogger", url: `https://${username}.blogspot.com/` },
      { name: "WordPress", url: `https://${username}.wordpress.com/` },
    ];

    const scan = async (site: any) => {
      try {
        const response = await axios.get(site.url, { 
          timeout: 8000,
          headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          },
          maxRedirects: 5,
          validateStatus: (status) => status < 500
        });

        const content = String(response.data).toLowerCase();
        let exists = response.status === 200;

        // More robust checks for sites that use anti-bot or custom error pages
        if (site.name === "Instagram" && (content.includes("login") || content.includes("checkpoint"))) exists = false;
        if (site.name === "TikTok" && content.includes("not found")) exists = false;
        if (site.name === "Twitter/X" && (content.includes("doesn’t exist") || content.includes("login"))) exists = false;
        if (site.name === "Facebook" && (content.includes("not found") || content.includes("login"))) exists = false;

        return { name: site.name, url: site.url, exists };
      } catch (error) {
        return { name: site.name, url: site.url, exists: false };
      }
    };

    // Parallel scan
    const results = await Promise.all(sites.map(scan));
    res.json(results);
  });

  // IP Geolocation
  app.get("/api/osint/ip/:ip", async (req, res) => {
    const { ip } = req.params;
    try {
      // Trying ip-api.com as it's often more reliable for free tier
      const response = await axios.get(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`, { timeout: 5000 });
      
      if (response.data.status === "fail") {
        throw new Error(response.data.message || "IP resolution failed");
      }

      // Map to our IPInfo interface
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
      res.json(data);
    } catch (error: any) {
      console.error("IP Error:", error.message);
      res.status(500).json({ error: "NODE_CONN_TIMEOUT" });
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
      // WHOIS is tricky in cloud, so we use a more reliable public proxy
      const response = await axios.get(`https://whoisjs.com/api/v1/whois?domain=${domain}`, {
        headers: { 'Accept': 'application/json' },
        timeout: 10000
      });
      res.json(response.data);
    } catch (error) {
      // Fallback to RDAP if whoisjs fails
      try {
        const response = await axios.get(`https://rdap.org/domain/${domain}`, { timeout: 5000 });
        res.json(response.data);
      } catch (e) {
        res.status(500).json({ error: "REGISTRY_TIMEOUT_OR_BLOCKED" });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
