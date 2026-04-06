import { BaseDomModule } from './base-dom.module';
import { DomHelper } from '../helpers';

export class ClockModule extends BaseDomModule {
    private display!: HTMLElement;
    private interval!: number;

    constructor() {
        super('clockContainer');
    }

    public destroy(): void {
        clearInterval(this.interval);
    }

    protected override init(): void {
        this.display = DomHelper.el('div', { class: 'clock' }, '00:00:00');

        this.container.append(DomHelper.el('div', { class: 'clock-label' }, 'Lost since'), this.display);
        this.container.classList.add('clock-wrapper');

        this.tick();
        this.interval = window.setInterval(this.tick.bind(this), 1000);
    }

    private tick(): void {
        const now = new Date();
        const h = `${now.getHours()}`.padStart(2, '0');
        const m = `${now.getMinutes()}`.padStart(2, '0');
        const s = `${now.getSeconds()}`.padStart(2, '0');
        this.display.textContent = `${h}:${m}:${s}`;
    }
}
