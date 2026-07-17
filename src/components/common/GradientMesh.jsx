/**
 * The vivid wallpaper the glass surfaces refract — Apple's Liquid Glass reads
 * as "real" because there's a bold, colorful field behind it to bend and
 * catch light, not a near-black void. Spread out as percentages so it fills
 * whatever parent contains it (the board's 600vw track, or a fixed 100vw
 * wrapper for the mobile fallback). Purely decorative idle drift, no
 * pointer/scroll reactivity — that lives in <AmbientGlow/>, which stays
 * screen-fixed regardless of what the board is doing.
 */
export default function GradientMesh() {
  return (
    <div className="sg-gradient-mesh" aria-hidden="true">
      <span className="sg-mesh-blob sg-mesh-blob-a" />
      <span className="sg-mesh-blob sg-mesh-blob-b" />
      <span className="sg-mesh-blob sg-mesh-blob-c" />
      <span className="sg-mesh-blob sg-mesh-blob-d" />
      <span className="sg-mesh-blob sg-mesh-blob-e" />
      <span className="sg-mesh-blob sg-mesh-blob-f" />
      <span className="sg-mesh-blob sg-mesh-blob-g" />
      <span className="sg-mesh-grain" />

      <style>{`
        .sg-gradient-mesh {
          position: absolute;
          inset: 0;
          height: 100%;
          overflow: hidden;
          background: var(--color-background);
          pointer-events: none;
        }

        .sg-mesh-blob {
          position: absolute;
          width: 60vmax;
          height: 60vmax;
          border-radius: 50%;
          filter: blur(56px);
          opacity: 0.9;
          mix-blend-mode: screen;
          will-change: transform, opacity;
        }

        /* Dark mode: colors emit light against near-black, so screen brightens
           overlaps like real light. Light mode: color sits on a pale base like ink
           on paper, so multiply is the physically-correct swap — screen would
           just wash everything toward white and lose the color entirely. */
        html[data-sg-appearance='light'] .sg-mesh-blob {
          mix-blend-mode: multiply;
          opacity: 0.5;
        }

        /* "3D" — a consistent top-left light source on every blob, via a separate
           pseudo-element so its own blend mode doesn't fight the color layer's.
           Turns a flat blurred circle into something that reads as a lit sphere. */
        .sg-mesh-blob::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 26%, rgba(255,255,255,0.9), transparent 32%);
          mix-blend-mode: soft-light;
          opacity: 0.7;
        }

        html[data-sg-appearance='light'] .sg-mesh-blob::before {
          opacity: 1;
        }

        /* A diagonal flow of color — coral through magenta/violet to blue/cyan —
           like Apple's dynamic wallpapers, spread across the world as percentages
           so the same markup works whether the world is one viewport or six. */
        .sg-mesh-blob-a { top: -20%; left: -8%;  width: 54vmax; height: 54vmax; background: radial-gradient(circle, var(--sg-wall-coral), transparent 74%); animation: sgMeshDriftA 28s ease-in-out infinite; }
        .sg-mesh-blob-b { top: 4%;   left: 14%; background: radial-gradient(circle, var(--sg-wall-magenta), transparent 75%); opacity: 0.8; animation: sgMeshDriftB 34s ease-in-out infinite; }
        .sg-mesh-blob-c { top: -26%; left: 34%; background: radial-gradient(circle, var(--sg-wall-violet), transparent 75%); opacity: 0.85; animation: sgMeshDriftC 30s ease-in-out infinite; }
        .sg-mesh-blob-d { top: 8%;   left: 52%; width: 56vmax; height: 56vmax; background: radial-gradient(circle, var(--sg-wall-blue), transparent 75%); opacity: 0.78; animation: sgMeshDriftD 24s ease-in-out infinite; }
        .sg-mesh-blob-e { top: -18%; left: 72%; background: radial-gradient(circle, var(--sg-wall-cyan), transparent 75%); opacity: 0.82; animation: sgMeshDriftA 32s ease-in-out infinite; }
        .sg-mesh-blob-f { top: 28%;  left: 88%; width: 50vmax; height: 50vmax; background: radial-gradient(circle, var(--sg-wall-magenta), transparent 76%); opacity: 0.6; animation: sgMeshDriftB 26s ease-in-out infinite; }
        .sg-mesh-blob-g { top: 32%;  left: 2%;  width: 46vmax; height: 46vmax; background: radial-gradient(circle, var(--sg-wall-blue), transparent 76%); opacity: 0.52; animation: sgMeshDriftC 36s ease-in-out infinite; }

        /* Film grain — a tiled SVG turbulence data-URI, not a soft gradient.
           This is what actually sells "light through glass" over "gradient background". */
        .sg-mesh-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px 180px;
          opacity: 0.05;
          mix-blend-mode: overlay;
        }

        html[data-sg-appearance='light'] .sg-mesh-grain {
          opacity: 0.03;
          mix-blend-mode: multiply;
        }

        @keyframes sgMeshDriftA {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(2vw, 3vh, 0) scale(1.1); }
        }

        @keyframes sgMeshDriftB {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-2.5vw, 2vh, 0) scale(0.94); }
        }

        @keyframes sgMeshDriftC {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(1.6vw, -2.4vh, 0) scale(1.08); }
        }

        @keyframes sgMeshDriftD {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-1.3vw, -1.7vh, 0) scale(1.1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .sg-mesh-blob {
            animation: none !important;
          }
        }

        @media (max-width: 768px) {
          .sg-mesh-blob {
            filter: blur(50px);
          }
        }
      `}</style>
    </div>
  )
}
