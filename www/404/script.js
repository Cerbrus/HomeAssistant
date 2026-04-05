// Console art
(function () {
    const wolfRaw = [
        '                                                         :I;+i+.             ',
        '                                                       :t    ..=:            ',
        '                                                     .ii   ..:;+;=           ',
        '                                                   .=;i=t+;;:=;::I+          ',
        '                                                  ;i++tI:;;.i;+;;;+          ',
        '                                                 V+ttIi=;i;;=+=+t  X;        ',
        '                                               YIi++ii+=:;.=.+ii=  t:        ',
        '                                         ==+iI+:++=t=i+i;+=+it=i   R:        ',
        '                                ;+YVRRMBBBRY=::i=i++=tti;;==iii+.  R:        ',
        '                           =;=Itii+iIVYi=. i+i+iitiiiti+;+;+i+    +;         ',
        '                       ;===tii=;:+::IY;  .tIiiiIIYY++ii=i=+;=:.   ;.:X.:: .+ ',
        '                     =::+=t+;;.....:+=XVXYYYVYItIVItit+i=;;=..R;IY:+:  . .:;I',
        '                    =itt;+;;::;;;;===IVttt++ii++=+=iii+=;;;;;=:;:......::.;i+',
        '                  :=YI+=;:;::;:;==+t=;=ttIItItttiti++i;+=i+++=:;::;.::::.+It ',
        '               ;:ii+;.;::;::...;;:;=;=ttItttttittiii;===i=++;:=;::::.::;i=:  ',
        '        ;;;;:;;;;:;;;::.........:.:;;:::===iYV+VXXRRR=YIIiti++t+i+;.::+=:    ',
        '  :;;==;;==i+==:.:..........::::=;=VYYYRXRVVRRRRVIi;=+++=;+;+=;=itYt:        ',
        '    ;;;.;::;==::;;.:........:..=++YYtVIXYRVBYBBBRt+=++it+;i+;=;itX;          ',
        '      ::;:..;=;:;:::;.........;;;;;=;i;i;:=YIYIXRI+ii;;I:++;==iVY            ',
        '     ........:;....:..:.......:==I;tIiYIiXitIIRRXI:=tiiItIi+=IX=:            ',
        ' ...::.:....:.........:;.....:=++ItitIRIX+RVYVRRY+...YXIRY;VRRWB:            ',
        '.:;;;...::::;::.:::..........;=;ItiV;IRIYYRRBYBRYiI+.+VRRItXBWR+==           ',
    ];


    const pad = '   ';
    const w = 77 + pad.length *2;
    const hBorder = `${pad}╔${'═'.repeat(w)}╗${pad}`;
    const fBorder = `${pad}╚${'═'.repeat(w)}╝${pad}`;
    const blank = `${pad}║${pad}${' '.repeat(77)}${pad}║${pad}`;
    const wolf = [hBorder, blank, ...wolfRaw.map(l => `${pad}║${pad}${l}${pad}║${pad}`), blank, fBorder];

    const purple = 'color:#c084fc;font-weight:bold;';
    const amber  = 'color:#fbbf24;font-weight:bold;';
    const gray   = 'color:#9ca3af;';
    const cyan   = 'color:#22d3ee;font-weight:bold;';
    const reset  = 'color:inherit;font-weight:normal;';

    // Wolf art
    console.log(
        `%c${wolf.join('\n')}`,
        'color:#ffe8cc;background:linear-gradient(90deg,#1a1a2e,#87613e);font-size:12px;font-family:monospace;line-height:1;letter-spacing:-10px;'
    );

    // Title banner
    console.log(
        '%c  🐺 CERBRUS 404 — Pawge Not Found 🐺  ',
        'background:linear-gradient(90deg,#87613e,#ffe8cc);color:#1a1a2e;font-size:18px;font-weight:bold;padding:8px 100px;border-radius:6px;margin-top:4px;'
    );

    // Info lines
    console.log(
        `%c⚡  %cYou've wandered into uncharted territory.%c ⚡
%c🦴  %cThis page has been buried and forgotten. %c 🦴
%c🌙  %cThe pack couldn't track this URL.        %c 🌙
%c🏠  %cHead home: %chttps://ha.cerbrus.nl/        %c 🏠`,
        amber, gray, reset,
        amber, gray, reset,
        amber, gray, reset,
        amber, gray, cyan, reset
    );

    // Easter egg
    console.log(
        '%c🥩 Fun fact: %cCerbrus prefers his steaks rare — just like this page.',
        purple, gray
    );
})();

// Clock
function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${h}:${m}:${s}`;
}

updateClock();
setInterval(updateClock, 1000);

// Pun rotation
const puns = [
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
    "This page got grilled and didn't survive.",
];
let punIndex = Math.floor(Math.random() * puns.length);
const punText = document.getElementById('punText');
const punTicker = document.getElementById('punTicker');

function showPun() {
    punTicker.style.opacity = '0';
    setTimeout(() => {
        punText.textContent = puns[punIndex];
        punTicker.style.opacity = '1';
        punIndex = (punIndex + 1) % puns.length;
    }, 400);
}

showPun();
setInterval(showPun, 10000);

// Pong game
(function () {
    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Score
    let scoreL = 0;
    let scoreR = 0;
    const scoreLeftEl = document.getElementById('scoreLeft');
    const scoreRightEl = document.getElementById('scoreRight');

    // Steak emoji (pre-render to offscreen canvas for performance)
    const steakSize = 32;
    const steakCanvas = document.createElement('canvas');
    steakCanvas.width = steakSize * 2;
    steakCanvas.height = steakSize * 2;
    const steakCtx = steakCanvas.getContext('2d');
    steakCtx.font = `${steakSize}px serif`;
    steakCtx.textAlign = 'center';
    steakCtx.textBaseline = 'middle';
    steakCtx.fillText('🥩', steakSize, steakSize);

    // Ball
    const ball = {
        x: W / 2, y: H / 2,
        vx: 2.5, vy: 1.8,
        r: 11,
        trail: []
    };

    // Paddles (bones)
    const boneW = 14;
    const boneH = 70;
    const knobR = 10;
    const paddleMargin = 20;

    const padL = { x: paddleMargin, y: H / 2 - boneH / 2, vy: 0 };
    const padR = { x: W - paddleMargin - boneW, y: H / 2 - boneH / 2, vy: 0 };

    function drawBone(x, y) {
        const cx = x + boneW / 2;
        const topY = y;
        const botY = y + boneH;

        // Shaft
        ctx.fillStyle = '#e9ecef';
        ctx.strokeStyle = '#ced4da';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x, topY + knobR * 0.5, boneW, boneH - knobR, 2);
        ctx.fill();
        ctx.stroke();

        // Top knobs
        ctx.fillStyle = '#f1f3f5';
        ctx.beginPath();
        ctx.arc(cx - knobR * 0.55, topY + knobR * 0.6, knobR * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx + knobR * 0.55, topY + knobR * 0.6, knobR * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Bottom knobs
        ctx.beginPath();
        ctx.arc(cx - knobR * 0.55, botY - knobR * 0.6, knobR * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx + knobR * 0.55, botY - knobR * 0.6, knobR * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Subtle highlight on shaft
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(x + 2, topY + knobR, 3, boneH - knobR * 2);
    }

    function drawCenterLine() {
        ctx.setLineDash([6, 8]);
        ctx.strokeStyle = 'rgba(252, 196, 25, 0.12)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(W / 2, 0);
        ctx.lineTo(W / 2, H);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    function resetBall(dir) {
        ball.x = W / 2;
        ball.y = H / 2;
        ball.vx = 2.5 * dir;
        ball.vy = (Math.random() - 0.5) * 3;
        ball.trail = [];
    }

    // AI paddle movement
    function aiMove(pad, speed, reaction) {
        const center = pad.y + boneH / 2;
        const target = ball.y;
        const diff = target - center;
        if (Math.abs(diff) > reaction) {
            pad.vy = Math.sign(diff) * speed;
        } else {
            pad.vy *= 0.8;
        }
        pad.y += pad.vy;
        pad.y = Math.max(0, Math.min(H - boneH, pad.y));
    }

    function update() {
        // AI
        aiMove(padL, 2.2, 8);
        aiMove(padR, 2.0, 12);

        // Ball trail
        ball.trail.push({ x: ball.x, y: ball.y });
        if (ball.trail.length > 8) ball.trail.shift();

        // Move ball
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Top/bottom bounce
        if (ball.y - ball.r < 0) { ball.y = ball.r; ball.vy = Math.abs(ball.vy); }
        if (ball.y + ball.r > H) { ball.y = H - ball.r; ball.vy = -Math.abs(ball.vy); }

        // Left paddle collision
        if (ball.vx < 0 &&
            ball.x - ball.r < padL.x + boneW &&
            ball.x + ball.r > padL.x &&
            ball.y > padL.y - knobR &&
            ball.y < padL.y + boneH + knobR) {
            ball.x = padL.x + boneW + ball.r;
            ball.vx = Math.abs(ball.vx) * 1.03;
            const hitPos = (ball.y - (padL.y + boneH / 2)) / (boneH / 2);
            ball.vy += hitPos * 1.5;
        }

        // Right paddle collision
        if (ball.vx > 0 &&
            ball.x + ball.r > padR.x &&
            ball.x - ball.r < padR.x + boneW &&
            ball.y > padR.y - knobR &&
            ball.y < padR.y + boneH + knobR) {
            ball.x = padR.x - ball.r;
            ball.vx = -Math.abs(ball.vx) * 1.03;
            const hitPos = (ball.y - (padR.y + boneH / 2)) / (boneH / 2);
            ball.vy += hitPos * 1.5;
        }

        // Speed cap
        const maxSpeed = 6;
        if (Math.abs(ball.vx) > maxSpeed) ball.vx = maxSpeed * Math.sign(ball.vx);
        if (Math.abs(ball.vy) > maxSpeed) ball.vy = maxSpeed * Math.sign(ball.vy);

        // Score
        if (ball.x < -ball.r) {
            scoreR++;
            scoreRightEl.textContent = scoreR;
            resetBall(1);
        }
        if (ball.x > W + ball.r) {
            scoreL++;
            scoreLeftEl.textContent = scoreL;
            resetBall(-1);
        }
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        drawCenterLine();

        // Ball trail
        for (let i = 0; i < ball.trail.length; i++) {
            const t = ball.trail[i];
            const alpha = (i / ball.trail.length) * 0.3;
            ctx.globalAlpha = alpha;
            ctx.drawImage(steakCanvas, t.x - steakSize / 2, t.y - steakSize / 2, steakSize, steakSize);
        }
        ctx.globalAlpha = 1;

        // Ball (steak)
        ctx.drawImage(steakCanvas, ball.x - steakSize / 2, ball.y - steakSize / 2, steakSize, steakSize);

        // Paddles (bones)
        drawBone(padL.x, padL.y);
        drawBone(padR.x, padR.y);
    }

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    resetBall(Math.random() < 0.5 ? 1 : -1);
    gameLoop();
})();

// Floating paw prints
const pawField = document.getElementById('pawField');
const pawEmojis = ['\uD83D\uDC3E', '\uD83D\uDC3E', '\uD83D\uDC3A', '\uD83E\uDDB4', '\uD83E\uDD69', '\uD83E\uDD69', '\uD83C\uDF56'];
for (let i = 0; i < 20; i++) {
    const paw = document.createElement('div');
    paw.className = 'paw';
    paw.textContent = pawEmojis[Math.floor(Math.random() * pawEmojis.length)];
    paw.style.left = `${Math.random() * 100}%`;
    paw.style.animationDelay = `${Math.random() * 12}s`;
    paw.style.animationDuration = `${8 + Math.random() * 8}s`;
    paw.style.fontSize = `${1 + Math.random() * 1.5}rem`;
    pawField.appendChild(paw);
}