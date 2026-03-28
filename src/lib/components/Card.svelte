<script>
  /**
   * Card.svelte
   * Surface container with optional padding, glow, and border variants.
   *
   * Props:
   *   padding   — 'sm' | 'md' | 'lg' | 'xl'
   *   glow      — boolean (adds ambient glow effect)
   *   bordered  — boolean
   *   elevated  — boolean (stronger shadow)
   */

  export let padding = 'lg';
  export let glow = false;
  export let bordered = true;
  export let elevated = false;
</script>

<div
  class="card card--pad-{padding}"
  class:card--glow={glow}
  class:card--bordered={bordered}
  class:card--elevated={elevated}
>
  <slot />
</div>

<style>
  .card {
    background: var(--gradient-surface);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    position: relative;
    overflow: hidden;
  }

  /* ── Glow overlay ── */
  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gradient-glow);
    pointer-events: none;
    z-index: 0;
  }

  .card > :global(*) {
    position: relative;
    z-index: 1;
  }

  /* ── Padding ── */
  .card--pad-sm  { padding: var(--space-4); }
  .card--pad-md  { padding: var(--space-6); }
  .card--pad-lg  { padding: var(--space-8); }
  .card--pad-xl  { padding: var(--space-10) var(--space-12); }

  /* ── Variants ── */
  .card--bordered {
    border: 1px solid var(--color-border);
  }

  .card--elevated {
    box-shadow: var(--shadow-xl);
  }

  .card--glow {
    box-shadow: var(--shadow-xl), var(--shadow-glow);
  }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .card--pad-xl { padding: var(--space-8) var(--space-6); }
    .card--pad-lg { padding: var(--space-6) var(--space-5); }
  }
</style>
