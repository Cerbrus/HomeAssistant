// Clock
function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = h + ':' + m + ':' + s;
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
    paw.style.left = (Math.random() * 100) + '%';
    paw.style.animationDelay = (Math.random() * 12) + 's';
    paw.style.animationDuration = (8 + Math.random() * 8) + 's';
    paw.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
    pawField.appendChild(paw);
}
