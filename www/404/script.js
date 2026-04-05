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