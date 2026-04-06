export class DomHelper {
    public static el(tag: string, attrs?: Record<string, string>, text?: string): HTMLElement {
        const element = document.createElement(tag);
        if (attrs) {
            for (const [key, value] of Object.entries(attrs)) {
                element.setAttribute(key, value);
            }
        }
        if (text) element.textContent = text;
        return element;
    }
}
