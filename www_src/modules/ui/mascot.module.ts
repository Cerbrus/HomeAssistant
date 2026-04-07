import { BaseDomModule } from './base-dom.module';

interface MascotCoordinates {
    eyeCx: number;
    eyeCy: number;
    maxOffset: number;
    mirrorXOffset: number;
}

export class MascotModule extends BaseDomModule {
    private svg!: SVGSVGElement;
    private leftPupil!: SVGCircleElement;
    private rightPupil!: SVGCircleElement;
    private coordinates!: MascotCoordinates;

    constructor() {
        super('mascotContainer');
    }

    public destroy(): void {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.documentElement.removeEventListener('mouseleave', this.onMouseLeave);
    }

    protected override init(): void {
        this.svg = this.container.querySelector<SVGSVGElement>('.mascot-svg')!;
        this.leftPupil = this.svg.querySelector<SVGCircleElement>('.eye-group-left .eye-pupil')!;
        this.rightPupil = this.svg.querySelector<SVGCircleElement>('.eye-group-right .eye-pupil')!;

        if (!this.svg || !this.leftPupil || !this.rightPupil) return;

        const iris = this.svg.querySelector<SVGCircleElement>('.eye-group-left .eye-yellow')!;
        const rightGroup = this.svg.querySelector<SVGGElement>('.eye-group-right')!;

        this.coordinates = {
            eyeCx: this.leftPupil.cx.baseVal.value,
            eyeCy: this.leftPupil.cy.baseVal.value,
            maxOffset: iris.r.baseVal.value - this.leftPupil.r.baseVal.value - 1,
            mirrorXOffset: rightGroup.transform.baseVal.getItem(0).matrix.e,
        };

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        document.addEventListener('mousemove', this.onMouseMove);
        document.documentElement.addEventListener('mouseleave', this.onMouseLeave);
    }

    private onMouseLeave(): void {
        this.leftPupil.style.translate = '0 0';
        this.rightPupil.style.translate = '0 0';
    }

    private onMouseMove(e: MouseEvent): void {
        const pt = this.svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgPt = pt.matrixTransform(this.svg.getScreenCTM()!.inverse());

        this.movePupil(this.leftPupil, svgPt.x, svgPt.y);

        // Right eye is mirrored via its transform matrix, so invert x into local space
        this.movePupil(this.rightPupil, this.coordinates.mirrorXOffset - svgPt.x, svgPt.y);
    }

    private movePupil(pupil: SVGCircleElement, targetX: number, targetY: number): void {
        const { eyeCx, eyeCy, maxOffset } = this.coordinates;
        const dx = targetX - eyeCx;
        const dy = targetY - eyeCy;
        const dist = Math.hypot(dx, dy);
        const clamp = Math.min(dist, maxOffset) / (dist || 1);

        pupil.style.translate = `${dx * clamp}px ${dy * clamp}px`;
    }
}
