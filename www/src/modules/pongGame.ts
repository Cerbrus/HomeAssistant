interface Point {
    x: number;
    y: number;
}

interface Ball extends Point {
    vx: number;
    vy: number;
    r: number;
    trail: Point[];
}

interface Paddle {
    x: number;
    y: number;
    vy: number;
}

const BONE_W = 14;
const BONE_H = 70;
const KNOB_R = 10;
const PADDLE_MARGIN = 20;
const STEAK_SIZE = 32;
const MAX_SPEED = 6;
const TRAIL_LENGTH = 8;

export class PongGame {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private readonly W: number;
    private readonly H: number;

    private scoreL = 0;
    private scoreR = 0;
    private scoreLeftEl: HTMLElement;
    private scoreRightEl: HTMLElement;

    private readonly steakSprite: HTMLCanvasElement;

    private readonly ball: Ball;
    private readonly padL: Paddle;
    private readonly padR: Paddle;
    private rafId = 0;

    constructor(canvasId: string, scoreLeftId: string, scoreRightId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.W = this.canvas.width;
        this.H = this.canvas.height;
        this.scoreLeftEl = document.getElementById(scoreLeftId)!;
        this.scoreRightEl = document.getElementById(scoreRightId)!;

        this.steakSprite = this.createSteakSprite();

        this.ball = {
            x: this.W / 2, y: this.H / 2,
            vx: 2.5, vy: 1.8,
            r: 11, trail: []
        };

        this.padL = {x: PADDLE_MARGIN, y: this.H / 2 - BONE_H / 2, vy: 0};
        this.padR = {x: this.W - PADDLE_MARGIN - BONE_W, y: this.H / 2 - BONE_H / 2, vy: 0};

        this.resetBall(Math.random() < 0.5 ? 1 : -1);
        this.loop();
    }

    private createSteakSprite(): HTMLCanvasElement {
        const c = document.createElement('canvas');
        c.width = STEAK_SIZE * 2;
        c.height = STEAK_SIZE * 2;
        const ctx = c.getContext('2d')!;
        ctx.font = `${STEAK_SIZE}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('\uD83E\uDD69', STEAK_SIZE, STEAK_SIZE);
        return c;
    }

    private resetBall(dir: number): void {
        this.ball.x = this.W / 2;
        this.ball.y = this.H / 2;
        this.ball.vx = 2.5 * dir;
        this.ball.vy = (Math.random() - 0.5) * 3;
        this.ball.trail = [];
    }

    private aiMove(pad: Paddle, speed: number, reaction: number): void {
        const center = pad.y + BONE_H / 2;
        const diff = this.ball.y - center;
        if (Math.abs(diff) > reaction) {
            pad.vy = Math.sign(diff) * speed;
        } else {
            pad.vy *= 0.8;
        }
        pad.y += pad.vy;
        pad.y = Math.max(0, Math.min(this.H - BONE_H, pad.y));
    }

    private checkPaddleCollision(pad: Paddle, fromLeft: boolean): void {
        const b = this.ball;
        const goingToward = fromLeft ? b.vx < 0 : b.vx > 0;
        if (!goingToward) return;

        const hitX = fromLeft
            ? b.x - b.r < pad.x + BONE_W && b.x + b.r > pad.x
            : b.x + b.r > pad.x && b.x - b.r < pad.x + BONE_W;

        if (hitX && b.y > pad.y - KNOB_R && b.y < pad.y + BONE_H + KNOB_R) {
            b.x = fromLeft ? pad.x + BONE_W + b.r : pad.x - b.r;
            b.vx = (fromLeft ? Math.abs(b.vx) : -Math.abs(b.vx)) * 1.03;
            const hitPos = (b.y - (pad.y + BONE_H / 2)) / (BONE_H / 2);
            b.vy += hitPos * 1.5;
        }
    }

    private update(): void {
        this.aiMove(this.padL, 2.2, 8);
        this.aiMove(this.padR, 2.0, 12);

        const b = this.ball;
        b.trail.push({x: b.x, y: b.y});
        if (b.trail.length > TRAIL_LENGTH) b.trail.shift();

        b.x += b.vx;
        b.y += b.vy;

        if (b.y - b.r < 0) {
            b.y = b.r;
            b.vy = Math.abs(b.vy);
        }
        if (b.y + b.r > this.H) {
            b.y = this.H - b.r;
            b.vy = -Math.abs(b.vy);
        }

        this.checkPaddleCollision(this.padL, true);
        this.checkPaddleCollision(this.padR, false);

        if (Math.abs(b.vx) > MAX_SPEED) b.vx = MAX_SPEED * Math.sign(b.vx);
        if (Math.abs(b.vy) > MAX_SPEED) b.vy = MAX_SPEED * Math.sign(b.vy);

        if (b.x < -b.r) {
            this.scoreR++;
            this.scoreRightEl.textContent = String(this.scoreR);
            this.resetBall(1);
        }
        if (b.x > this.W + b.r) {
            this.scoreL++;
            this.scoreLeftEl.textContent = String(this.scoreL);
            this.resetBall(-1);
        }
    }

    private drawBone(x: number, y: number): void {
        const ctx = this.ctx;
        const cx = x + BONE_W / 2;
        const botY = y + BONE_H;

        ctx.fillStyle = '#e9ecef';
        ctx.strokeStyle = '#ced4da';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x, y + KNOB_R * 0.5, BONE_W, BONE_H - KNOB_R, 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f1f3f5';
        for (const [ky, sign] of [[y + KNOB_R * 0.6, -1], [y + KNOB_R * 0.6, 1], [botY - KNOB_R * 0.6, -1], [botY - KNOB_R * 0.6, 1]] as [number, number][]) {
            ctx.beginPath();
            ctx.arc(cx + sign * KNOB_R * 0.55, ky, KNOB_R * 0.7, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }

        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(x + 2, y + KNOB_R, 3, BONE_H - KNOB_R * 2);
    }

    private draw(): void {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.W, this.H);

        // Center line
        ctx.setLineDash([6, 8]);
        ctx.strokeStyle = 'rgba(252, 196, 25, 0.12)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.W / 2, 0);
        ctx.lineTo(this.W / 2, this.H);
        ctx.stroke();
        ctx.setLineDash([]);

        // Ball trail
        for (let i = 0; i < this.ball.trail.length; i++) {
            const t = this.ball.trail[i];
            ctx.globalAlpha = (i / this.ball.trail.length) * 0.3;
            ctx.drawImage(this.steakSprite, t.x - STEAK_SIZE / 2, t.y - STEAK_SIZE / 2, STEAK_SIZE, STEAK_SIZE);
        }
        ctx.globalAlpha = 1;

        // Ball
        ctx.drawImage(this.steakSprite, this.ball.x - STEAK_SIZE / 2, this.ball.y - STEAK_SIZE / 2, STEAK_SIZE, STEAK_SIZE);

        // Paddles
        this.drawBone(this.padL.x, this.padL.y);
        this.drawBone(this.padR.x, this.padR.y);
    }

    private loop = (): void => {
        this.update();
        this.draw();
        this.rafId = requestAnimationFrame(this.loop);
    };

    destroy(): void {
        cancelAnimationFrame(this.rafId);
    }
}