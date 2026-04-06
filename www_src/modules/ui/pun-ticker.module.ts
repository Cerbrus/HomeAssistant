import { BaseDomModule } from './base-dom.module';
import { ArrayHelper, DomHelper } from '../helpers';

const PUNS = [
    'This page has gone to the dogs.',
    'Fur-oh-fur: destination unknown.',
    'We looked everywhere... even under the couch.',
    'This URL is barking up the wrong tree.',
    'The page you seek has been re-furred elsewhere.',
    'Howl about trying a different link?',
    '404: No bones about it, this page is gone.',
    'Looks like someone buried this page in the yard.',
    'This link is ruff around the edges.',
    'The server fetched nothing. Bad server.',
    'Tail not found. Neither was this page.',
    "You've been led astray \u2014 paws and reconsider.",
    'This page pulled a Houndini. Poof!',
    'Sniffed all the packets. Nothing here.',
    'Error: page chased its own tail into oblivion.',
    "Fur real though, this page doesn't exist.",
    "This page is rare. As in, it doesn't exist.",
    'Well done. You found nothing. Medium rare effort.',
    "That's a mis-steak. This page was never here.",
    'The steaks have never been higher... or more missing.',
    'This page was too raw to serve.',
    '404: a rare occurrence. Like a well-done wolf.',
    "We've got beef with whoever linked you here.",
    "This page got grilled and didn't survive.",
];

export class PunTickerModule extends BaseDomModule {
    private textEl!: HTMLElement;
    private interval!: number;
    private index = 0;

    constructor() {
        super('punTickerContainer');
    }

    public destroy(): void {
        clearInterval(this.interval);
    }

    protected override init(): void {
        ArrayHelper.shuffle(PUNS);
        this.textEl = DomHelper.el('span', { class: 'pun-text' });
        this.container.classList.add('pun-ticker');
        this.container.append(DomHelper.el('span', { class: 'pun-icon' }, '\uD83D\uDC3A'), this.textEl);

        this.show();
        this.interval = window.setInterval(() => this.show(), 10000);
    }

    private show(): void {
        this.container.style.opacity = '0';
        setTimeout(() => {
            this.textEl.textContent = PUNS[this.index];
            this.container.style.opacity = '1';
            this.index = (this.index + 1) % PUNS.length;
        }, 400);
    }
}
