import { BaseDomModule } from './base-dom.module';
import { DomHelper } from '../helpers';

const PAW_EMOJIS = [
    '\uD83D\uDC3E',
    '\uD83D\uDC3E',
    '\uD83D\uDC3A',
    '\uD83E\uDDB4',
    '\uD83E\uDD69',
    '\uD83E\uDD69',
    '\uD83C\uDF56',
];
const PAW_COUNT = 20;

export class PawFieldModule extends BaseDomModule {
    constructor() {
        super('pawFieldContainer');
    }

    protected override init(): void {
        this.container.classList.add('paw-field');

        for (let i = 0; i < PAW_COUNT; i++) {
            const paw = DomHelper.el(
                'div',
                { class: 'paw' },
                PAW_EMOJIS[Math.floor(Math.random() * PAW_EMOJIS.length)]
            );
            paw.style.left = `${Math.random() * 100}%`;
            paw.style.animationDelay = `${Math.random() * 12}s`;
            paw.style.animationDuration = `${8 + Math.random() * 8}s`;
            paw.style.fontSize = `${1 + Math.random() * 1.5}rem`;
            this.container.appendChild(paw);
        }
    }
}
