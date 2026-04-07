"use strict";
(() => {
  // modules/ui/base-dom.module.ts
  var BaseDomModule = class {
    constructor(containerId) {
      const container = document.getElementById(containerId);
      if (!container) {
        console.warn(
          `Container with id "${containerId}" not found. Unable to initialize ${this.constructor.name}.`
        );
        return;
      }
      this.container = container;
      this.init();
    }
    query(selector) {
      return this.container.querySelector(selector);
    }
  };

  // modules/helpers/dom.helper.ts
  var DomHelper = class {
    static el(tag, attrs, text) {
      const element = document.createElement(tag);
      if (attrs) {
        for (const [key, value] of Object.entries(attrs)) {
          element.setAttribute(key, value);
        }
      }
      if (text) element.textContent = text;
      return element;
    }
  };

  // modules/helpers/array.helper.ts
  var ArrayHelper = class {
    static shuffle(array) {
      let currentIndex = array.length;
      while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      }
    }
  };

  // modules/ui/clock.module.ts
  var ClockModule = class extends BaseDomModule {
    constructor() {
      super("clockContainer");
    }
    destroy() {
      clearInterval(this.interval);
    }
    init() {
      this.display = DomHelper.el("div", { class: "clock" }, "00:00:00");
      this.container.append(DomHelper.el("div", { class: "clock-label" }, "Lost since"), this.display);
      this.container.classList.add("clock-wrapper");
      this.tick();
      this.interval = window.setInterval(this.tick.bind(this), 1e3);
    }
    tick() {
      const now = /* @__PURE__ */ new Date();
      const h = `${now.getHours()}`.padStart(2, "0");
      const m = `${now.getMinutes()}`.padStart(2, "0");
      const s = `${now.getSeconds()}`.padStart(2, "0");
      this.display.textContent = `${h}:${m}:${s}`;
    }
  };

  // modules/ui/paw-field.module.ts
  var PAW_EMOJIS = [
    "\u{1F43E}",
    "\u{1F43E}",
    "\u{1F43A}",
    "\u{1F9B4}",
    "\u{1F969}",
    "\u{1F969}",
    "\u{1F356}"
  ];
  var PAW_COUNT = 20;
  var PawFieldModule = class extends BaseDomModule {
    constructor() {
      super("pawFieldContainer");
    }
    init() {
      this.container.classList.add("paw-field");
      for (let i = 0; i < PAW_COUNT; i++) {
        const paw = DomHelper.el(
          "div",
          { class: "paw" },
          PAW_EMOJIS[Math.floor(Math.random() * PAW_EMOJIS.length)]
        );
        paw.style.left = `${Math.random() * 100}%`;
        paw.style.animationDelay = `${Math.random() * 12}s`;
        paw.style.animationDuration = `${8 + Math.random() * 8}s`;
        paw.style.fontSize = `${1 + Math.random() * 1.5}rem`;
        this.container.appendChild(paw);
      }
    }
  };

  // modules/ui/pong.module.ts
  var BONE_W = 14;
  var BONE_H = 70;
  var KNOB_R = 10;
  var PADDLE_MARGIN = 20;
  var STEAK_SIZE = 32;
  var MAX_SPEED = 6;
  var TRAIL_LENGTH = 8;
  var PongModule = class extends BaseDomModule {
    constructor() {
      super("pongContainer");
      this.scoreL = 0;
      this.scoreR = 0;
      this.rafId = 0;
      this.running = false;
      this.test = 123;
    }
    destroy() {
      this.stop();
      this.mql.removeEventListener("change", this.onMediaChange);
    }
    init() {
      this.container.classList.add("pong-wrapper");
      this.canvas = document.createElement("canvas");
      this.canvas.width = 500;
      this.canvas.height = 300;
      const scoreDiv = DomHelper.el("div", { class: "pong-score" });
      this.scoreLeftEl = DomHelper.el("span", { class: "score-left" }, "0");
      this.scoreRightEl = DomHelper.el("span", { class: "score-right" }, "0");
      scoreDiv.append(this.scoreLeftEl, DomHelper.el("span", { class: "pong-dash" }, "\u2014"), this.scoreRightEl);
      this.container.append(this.canvas, scoreDiv);
      this.ctx = this.canvas.getContext("2d");
      this.W = this.canvas.width;
      this.H = this.canvas.height;
      this.steakSprite = this.createSteakSprite();
      this.ball = {
        x: this.W / 2,
        y: this.H / 2,
        vx: 2.5,
        vy: 1.8,
        r: 11,
        trail: []
      };
      this.padL = { x: PADDLE_MARGIN, y: this.H / 2 - BONE_H / 2, vy: 0 };
      this.padR = { x: this.W - PADDLE_MARGIN - BONE_W, y: this.H / 2 - BONE_H / 2, vy: 0 };
      this.resetBall(Math.random() < 0.5 ? 1 : -1);
      this.mql = window.matchMedia("(max-width: 560px)");
      this.onMediaChange = this.onMediaChange.bind(this);
      this.mql.addEventListener("change", this.onMediaChange);
      if (!this.mql.matches) {
        this.start();
      }
    }
    onMediaChange(e) {
      e.matches ? this.stop() : this.start();
    }
    start() {
      if (this.running) return;
      this.running = true;
      this.loop();
    }
    stop() {
      this.running = false;
      cancelAnimationFrame(this.rafId);
    }
    createSteakSprite() {
      const c = document.createElement("canvas");
      c.width = STEAK_SIZE * 2;
      c.height = STEAK_SIZE * 2;
      const ctx = c.getContext("2d");
      ctx.font = `${STEAK_SIZE}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("\u{1F969}", STEAK_SIZE, STEAK_SIZE);
      return c;
    }
    resetBall(dir) {
      this.ball.x = this.W / 2;
      this.ball.y = this.H / 2;
      this.ball.vx = 2.5 * dir;
      this.ball.vy = (Math.random() - 0.5) * 3;
      this.ball.trail = [];
    }
    aiMove(pad, speed, reaction) {
      const center = pad.y + BONE_H / 2;
      const diff = this.ball.y - center;
      if (Math.abs(diff) > reaction) {
        pad.vy = Math.sign(diff) * speed;
      } else {
        pad.vy *= 0.8;
      }
      pad.y += pad.vy;
      pad.y = Math.max(0, Math.min(this.H - BONE_H, pad.y));
    }
    checkPaddleCollision(pad, fromLeft) {
      const b = this.ball;
      const goingToward = fromLeft ? b.vx < 0 : b.vx > 0;
      if (!goingToward) return;
      const hitX = fromLeft ? b.x - b.r < pad.x + BONE_W && b.x + b.r > pad.x : b.x + b.r > pad.x && b.x - b.r < pad.x + BONE_W;
      if (hitX && b.y > pad.y - KNOB_R && b.y < pad.y + BONE_H + KNOB_R) {
        b.x = fromLeft ? pad.x + BONE_W + b.r : pad.x - b.r;
        b.vx = (fromLeft ? Math.abs(b.vx) : -Math.abs(b.vx)) * 1.03;
        const hitPos = (b.y - (pad.y + BONE_H / 2)) / (BONE_H / 2);
        b.vy += hitPos * 1.5;
      }
    }
    update() {
      this.aiMove(this.padL, 2.2, 8);
      this.aiMove(this.padR, 2, 12);
      const b = this.ball;
      b.trail.push({ x: b.x, y: b.y });
      if (b.trail.length > TRAIL_LENGTH) b.trail.shift();
      b.x += b.vx;
      b.y += b.vy;
      if (b.y - b.r < 0) {
        b.y = b.r;
        b.vy = Math.abs(b.vy);
      }
      if (b.y + b.r > this.H) {
        b.y = this.H - b.r;
        b.vy = -Math.abs(b.vy);
      }
      this.checkPaddleCollision(this.padL, true);
      this.checkPaddleCollision(this.padR, false);
      if (Math.abs(b.vx) > MAX_SPEED) b.vx = MAX_SPEED * Math.sign(b.vx);
      if (Math.abs(b.vy) > MAX_SPEED) b.vy = MAX_SPEED * Math.sign(b.vy);
      if (b.x < -b.r) {
        this.scoreR++;
        this.scoreRightEl.textContent = String(this.scoreR);
        this.resetBall(1);
      }
      if (b.x > this.W + b.r) {
        this.scoreL++;
        this.scoreLeftEl.textContent = String(this.scoreL);
        this.resetBall(-1);
      }
    }
    drawBone(x, y) {
      const ctx = this.ctx;
      const cx = x + BONE_W / 2;
      const botY = y + BONE_H;
      ctx.fillStyle = "#e9ecef";
      ctx.strokeStyle = "#ced4da";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x, y + KNOB_R * 0.5, BONE_W, BONE_H - KNOB_R, 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#f1f3f5";
      for (const [ky, sign] of [
        [y + KNOB_R * 0.6, -1],
        [y + KNOB_R * 0.6, 1],
        [botY - KNOB_R * 0.6, -1],
        [botY - KNOB_R * 0.6, 1]
      ]) {
        ctx.beginPath();
        ctx.arc(cx + sign * KNOB_R * 0.55, ky, KNOB_R * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.fillRect(x + 2, y + KNOB_R, 3, BONE_H - KNOB_R * 2);
    }
    draw() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.W, this.H);
      ctx.setLineDash([6, 8]);
      ctx.strokeStyle = "rgba(252, 196, 25, 0.12)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.W / 2, 0);
      ctx.lineTo(this.W / 2, this.H);
      ctx.stroke();
      ctx.setLineDash([]);
      for (let i = 0; i < this.ball.trail.length; i++) {
        const t = this.ball.trail[i];
        ctx.globalAlpha = i / this.ball.trail.length * 0.3;
        ctx.drawImage(this.steakSprite, t.x - STEAK_SIZE / 2, t.y - STEAK_SIZE / 2, STEAK_SIZE, STEAK_SIZE);
      }
      ctx.globalAlpha = 1;
      ctx.drawImage(
        this.steakSprite,
        this.ball.x - STEAK_SIZE / 2,
        this.ball.y - STEAK_SIZE / 2,
        STEAK_SIZE,
        STEAK_SIZE
      );
      this.drawBone(this.padL.x, this.padL.y);
      this.drawBone(this.padR.x, this.padR.y);
    }
    loop() {
      this.update();
      this.draw();
      this.rafId = requestAnimationFrame(this.loop.bind(this));
    }
  };

  // modules/ui/pun-ticker.module.ts
  var PUNS = [
    "This page has gone to the dogs.",
    "Fur-oh-fur: destination unknown.",
    "We looked everywhere... even under the couch.",
    "This URL is barking up the wrong tree.",
    "The page you seek has been re-furred elsewhere.",
    "Howl about trying a different link?",
    "404: No bones about it, this page is gone.",
    "Looks like someone buried this page in the yard.",
    "This link is ruff around the edges.",
    "The server fetched nothing. Bad server.",
    "Tail not found. Neither was this page.",
    "You've been led astray \u2014 paws and reconsider.",
    "This page pulled a Houndini. Poof!",
    "Sniffed all the packets. Nothing here.",
    "Error: page chased its own tail into oblivion.",
    "Fur real though, this page doesn't exist.",
    "This page is rare. As in, it doesn't exist.",
    "Well done. You found nothing. Medium rare effort.",
    "That's a mis-steak. This page was never here.",
    "The steaks have never been higher... or more missing.",
    "This page was too raw to serve.",
    "404: a rare occurrence. Like a well-done wolf.",
    "We've got beef with whoever linked you here.",
    "This page got grilled and didn't survive."
  ];
  var PunTickerModule = class extends BaseDomModule {
    constructor() {
      super("punTickerContainer");
      this.index = 0;
    }
    destroy() {
      clearInterval(this.interval);
    }
    init() {
      ArrayHelper.shuffle(PUNS);
      this.textEl = DomHelper.el("span", { class: "pun-text" });
      this.container.append(DomHelper.el("span", { class: "pun-icon" }, "\u{1F43A}"), this.textEl);
      this.show();
      this.interval = window.setInterval(() => this.show(), 1e4);
    }
    show() {
      this.container.style.opacity = "0";
      setTimeout(() => {
        this.textEl.textContent = PUNS[this.index];
        this.container.style.opacity = "1";
        this.index = (this.index + 1) % PUNS.length;
      }, 400);
    }
  };

  // modules/debug/console.module.ts
  var WOLF_ART = [
    "                                                         :I;+i+.             ",
    "                                                       :t    ..=:            ",
    "                                                     .ii   ..:;+;=           ",
    "                                                   .=;i=t+;;:=;::I+          ",
    "                                                  ;i++tI:;;.i;+;;;+          ",
    "                                                 V+ttIi=;i;;=+=+t  X;        ",
    "                                               YIi++ii+=:;.=.+ii=  t:        ",
    "                                         ==+iI+:++=t=i+i;+=+it=i   R:        ",
    "                                ;+YVRRMBBBRY=::i=i++=tti;;==iii+.  R:        ",
    "                           =;=Itii+iIVYi=. i+i+iitiiiti+;+;+i+    +;         ",
    "                       ;===tii=;:+::IY;  .tIiiiIIYY++ii=i=+;=:.   ;.:X.:: .+ ",
    "                     =::+=t+;;.....:+=XVXYYYVYItIVItit+i=;;=..R;IY:+:  . .:;I",
    "                    =itt;+;;::;;;;===IVttt++ii++=+=iii+=;;;;;=:;:......::.;i+",
    "                  :=YI+=;:;::;:;==+t=;=ttIItItttiti++i;+=i+++=:;::;.::::.+It ",
    "               ;:ii+;.;::;::...;;:;=;=ttItttttittiii;===i=++;:=;::::.::;i=:  ",
    "        ;;;;:;;;;:;;;::.........:.:;;:::===iYV+VXXRRR=YIIiti++t+i+;.::+=:    ",
    "  :;;==;;==i+==:.:..........::::=;=VYYYRXRVVRRRRVIi;=+++=;+;+=;=itYt:        ",
    "    ;;;.;::;==::;;.:........:..=++YYtVIXYRVBYBBBRt+=++it+;i+;=;itX;          ",
    "      ::;:..;=;:;:::;.........;;;;;=;i;i;:=YIYIXRI+ii;;I:++;==iVY            ",
    "     ........:;....:..:.......:==I;tIiYIiXitIIRRXI:=tiiItIi+=IX=:            ",
    " ...::.:....:.........:;.....:=++ItitIRIX+RVYVRRY+...YXIRY;VRRWB:            ",
    ".:;;;...::::;::.:::..........;=;ItiV;IRIYYRRBYBRYiI+.+VRRItXBWR+==           "
  ];
  var ConsoleModule = class {
    constructor() {
      this.print();
    }
    print() {
      const pad = "   ";
      const w = 77 + pad.length * 2;
      const hBorder = `${pad}\u2554${"\u2550".repeat(w)}\u2557${pad}`;
      const fBorder = `${pad}\u255A${"\u2550".repeat(w)}\u255D${pad}`;
      const blank = `${pad}\u2551${pad}${" ".repeat(77)}${pad}\u2551${pad}`;
      const wolf = [
        hBorder,
        blank,
        ...WOLF_ART.map((l) => `${pad}\u2551${pad}${l}${pad}\u2551${pad}`),
        blank,
        fBorder
      ];
      const purple = "color:#c084fc;font-weight:bold;";
      const amber = "color:#fbbf24;font-weight:bold;";
      const gray = "color:#9ca3af;";
      const cyan = "color:#22d3ee;font-weight:bold;";
      const reset = "color:inherit;font-weight:normal;";
      console.log(
        `%c${wolf.join("\n")}`,
        "color:#ffe8cc;background:linear-gradient(90deg,#1a1a2e,#87613e);font-size:12px;font-family:monospace;line-height:1;letter-spacing:-10px;"
      );
      console.log(
        "%c  \u{1F43A} CERBRUS 404 \u2014 Pawge Not Found \u{1F43A}  ",
        "background:linear-gradient(90deg,#87613e,#ffe8cc);color:#1a1a2e;font-size:18px;font-weight:bold;padding:8px 100px;border-radius:6px;margin-top:4px;"
      );
      console.log(
        `%c\u26A1  %cYou've wandered into uncharted territory.%c \u26A1
%c\u{1F9B4}  %cThis page has been buried and forgotten. %c \u{1F9B4}
%c\u{1F319}  %cThe pack couldn't track this URL.        %c \u{1F319}
%c\u{1F3E0}  %cHead home: %chttps://ha.cerbrus.nl/        %c \u{1F3E0}`,
        amber,
        gray,
        reset,
        amber,
        gray,
        reset,
        amber,
        gray,
        reset,
        amber,
        gray,
        cyan,
        reset
      );
      console.log(
        "%c\u{1F969} Fun fact: %cCerbrus prefers his steaks rare \u2014 just like this page.",
        purple,
        gray
      );
    }
  };

  // pages/404.ts
  new ConsoleModule();
  new ClockModule();
  new PunTickerModule();
  new PongModule();
  new PawFieldModule();
  console.log("404 Not Found");
})();
