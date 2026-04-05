export class Clock {
    private el: HTMLElement;
    private readonly interval: number;

    constructor(elementId: string) {
        this.el = document.getElementById(elementId)!;
        this.tick();
        this.interval = window.setInterval(() => this.tick(), 1000);
    }

    private tick(): void {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        this.el.textContent = `${h}:${m}:${s}`;
    }

    destroy(): void {
        clearInterval(this.interval);
    }
}