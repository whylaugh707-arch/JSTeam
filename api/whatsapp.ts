import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
// @ts-ignore
import type { Client as ClientType } from 'whatsapp-web.js';
import qrcode from 'qrcode';
import axios from 'axios';

let qrCodeDataUrl: string | null = null;
let botStatus: 'DISCONNECTED' | 'INITIALIZING' | 'QR_READY' | 'AUTHENTICATED' | 'READY' | 'ERROR' = 'DISCONNECTED';
let botError: string | null = null;
let client: ClientType | null = null;

export const initWhatsApp = () => {
  if (client) return;

  botStatus = 'INITIALIZING';
  botError = null;
  client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote', '--single-process', '--disable-gpu']
    }
  });

  client.on('qr', async (qr) => {
    console.log('[WhatsApp] QR Code received.');
    botStatus = 'QR_READY';
    botError = null;
    qrCodeDataUrl = await qrcode.toDataURL(qr);
  });

  client.on('ready', () => {
    console.log('[WhatsApp] Bot is READY!');
    botStatus = 'READY';
    botError = null;
    qrCodeDataUrl = null;
  });

  client.on('authenticated', () => {
      console.log('[WhatsApp] Authenticated successfully!');
      botStatus = 'AUTHENTICATED';
      botError = null;
  });

  client.on('auth_failure', (msg) => {
      console.error('[WhatsApp] Authentication failure', msg);
      botStatus = 'ERROR';
      botError = 'Authentication Failure: ' + msg;
  });

  client.on('disconnected', (reason) => {
      console.log('[WhatsApp] Client was logged out', reason);
      botStatus = 'DISCONNECTED';
      botError = null;
      if (client) {
          client.destroy().catch(()=>{});
          client = null;
      }
  });

  client.on('message', async (msg) => {
    // 1. Anti-Ban: Respond only to specific commands
    if (!msg.body.startsWith('!osint ')) return;

    const username = msg.body.replace('!osint ', '').trim();
    if (!username) return;

    const chat = await msg.getChat();

    // 2. Anti-Ban: Simulate Human Delay & Typing
    // Random delay between 1.5s to 3s before starting typing
    const readDelay = Math.floor(Math.random() * 1500) + 1500;
    await new Promise((resolve) => setTimeout(resolve, readDelay));

    await chat.sendStateTyping();

    // Random typing duration (e.g. 2s to 4s)
    const typingDelay = Math.floor(Math.random() * 2000) + 2000;
    await new Promise((resolve) => setTimeout(resolve, typingDelay));

    try {
      await chat.sendMessage(`⏳ Mencari jejak digital untuk username: *${username}*...\nHarap tunggu sebentar, proses memakan waktu 10-15 detik. (Anti-Ban Delay Active)`);
      
      const response = await axios.post('http://127.0.0.1:3000/api/osint/username', { username });
      const results: any[] = response.data;
      
      const found = results.filter((r) => r.exists);
      
      await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 2000) + 2500));
      await chat.sendStateTyping();
      await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 1500) + 1500));

      let replyText = `🎯 *OSINT Report untuk: ${username}*\n\n`;
      if (found.length > 0) {
        replyText += `✅ Ditemukan di ${found.length} situs:\n`;
        found.forEach((site) => {
            replyText += `- ${site.name}: ${site.url}\n`;
        });
      } else {
        replyText += `❌ Tidak ditemukan di platform utama.`;
      }
      
      replyText += `\n\n_Powered by JST-OSINT_`;
      await msg.reply(replyText);

    } catch (error) {
      await chat.sendStateTyping();
      await msg.reply(`❌ Terjadi kesalahan saat melakukan pencarian.`);
    }
  });

  client.initialize().catch((err) => {
    console.error('[WhatsApp] Initialization failed:', err);
    botStatus = 'ERROR';
    botError = err instanceof Error ? err.message : String(err);
    if (client) {
      client.destroy().catch(() => {});
      client = null;
    }
  });
};

export const getBotStatus = () => {
    return { status: botStatus, qr: qrCodeDataUrl, error: botError };
};
export const resetBot = () => {
    botStatus = 'DISCONNECTED';
    botError = null;
    qrCodeDataUrl = null;
    if (client) {
        client.destroy();
        client = null;
    }
}
