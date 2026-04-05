const PAW_EMOJIS = ['\uD83D\uDC3E', '\uD83D\uDC3E', '\uD83D\uDC3A', '\uD83E\uDDB4', '\uD83E\uDD69', '\uD83E\uDD69', '\uD83C\uDF56'];
const PAW_COUNT = 20;

export class PawField {
    constructor(containerId: string) {
        const field = document.getElementById(containerId)!;
        for (let i = 0; i < PAW_COUNT; i++) {
            const paw = document.createElement('div');
            paw.className = 'paw';
            paw.textContent = PAW_EMOJIS[Math.floor(Math.random() * PAW_EMOJIS.length)];
            paw.style.left = `${Math.random() * 100}%`;
            paw.style.animationDelay = `${Math.random() * 12}s`;
            paw.style.animationDuration = `${8 + Math.random() * 8}s`;
            paw.style.fontSize = `${1 + Math.random() * 1.5}rem`;
            field.appendChild(paw);
        }
    }
}
