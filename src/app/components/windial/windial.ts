import { ChangeDetectionStrategy, Component, computed, input, linkedSignal } from '@angular/core';

const ROSE = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'] as const;
const CALM_KMH = 2;

/** Fonction pure, donc testable sans TestBed. */
export function toCardinal(deg: number): (typeof ROSE)[number] {
    const d = ((deg % 360) + 360) % 360;
    return ROSE[Math.round(d / 22.5) % 16];
}

/**
 * Made by claude :)
 */
@Component({
    selector: 'app-wind-dial',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <svg viewBox="0 0 120 120" role="img" [attr.aria-label]="description()">
      <circle cx="60" cy="60" r="52" class="ring" />
      @for (t of ticks; track t.label) {
        <text [attr.x]="t.x" [attr.y]="t.y" text-anchor="middle">{{ t.label }}</text>
      }
      <g class="arrow" [class.calm]="calm()" [style.transform]="'rotate(' + angle() + 'deg)'">
        <path d="M60 32 L72 62 L63 59 L63 88 L57 88 L57 59 L48 62 Z" />
      </g>
    </svg>
  `,
    styles: `
    :host { display: block; width: 100%; height: 100%; min-height: 0; color: inherit; }
    svg { display: block; width: auto; height: 100%; max-width: 100%; max-height: 100%; aspect-ratio: 1; }
    .ring { fill: none; stroke: currentColor; stroke-opacity: .5; stroke-width: 2; }
    text { fill: currentColor; font: 700 11px sans-serif; }
    .arrow { fill: currentColor; transform-origin: 60px 60px; transition: transform .6s ease-out; }
    .arrow.calm { opacity: .5; }
    @media (prefers-reduced-motion: reduce) { .arrow { transition: none; } }
  `,
})
export class WindDial {
    /** Direction d'où vient le vent, en degrés (convention météo). */
    readonly direction = input.required<number>();
    readonly speed = input.required<number>(); // km/h

    protected readonly ticks = [
        { label: 'N', x: 60, y: 21 },
        { label: 'E', x: 101, y: 64 },
        { label: 'S', x: 60, y: 105 },
        { label: 'O', x: 19, y: 64 },
    ];

    protected readonly calm = computed(() => this.speed() < CALM_KMH);

    // La flèche pointe là où le vent va, donc +180°.
    // linkedSignal garde le chemin le plus court : 350° → 10° tourne de +20°, pas de -340°.
    protected readonly angle = linkedSignal<number, number>({
        source: () => (this.direction() + 180) % 360,
        computation: (next, prev) =>
            prev ? prev.value + ((next - prev.source + 540) % 360) - 180 : next,
    });

    protected readonly description = computed(() => {
        const kmh = this.speed().toLocaleString('fr-FR', { maximumFractionDigits: 1 });
        return this.calm()
            ? `Vent calme, ${kmh} km/h`
            : `Vent du ${toCardinal(this.direction())} (${this.direction()}°), ${kmh} km/h`;
    });
}