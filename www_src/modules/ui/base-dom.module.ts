export abstract class BaseDomModule {
    protected readonly container!: HTMLElement;

    protected constructor(containerId: string) {
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

    protected abstract init(): void;

    protected query<T extends HTMLElement>(selector: string): T {
        return this.container.querySelector<T>(selector)!;
    }
}
