<script>
  /**
   * Button.svelte
   * Reusable gradient button with loading, disabled, and variant states.
   *
   * Props:
   *   variant   — 'primary' | 'secondary' | 'ghost'
   *   size      — 'sm' | 'md' | 'lg'
   *   loading   — boolean
   *   disabled  — boolean
   *   type      — HTML button type
   *   fullWidth — boolean
   */

  export let variant = 'primary';
  export let size = 'md';
  export let loading = false;
  export let disabled = false;
  export let type = 'button';
  export let fullWidth = false;
</script>

<button
  {type}
  class="btn btn--{variant} btn--{size}"
  class:btn--full={fullWidth}
  class:btn--loading={loading}
  disabled={disabled || loading}
  on:click
  {...$$restProps}
>
  {#if loading}
    <span class="btn__spinner" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-dasharray="28" stroke-dashoffset="10" />
      </svg>
    </span>
  {/if}

  <span class="btn__label">
    <slot />
  </span>
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border: none;
    border-radius: var(--radius-full);
    font-family: var(--font-body);
    font-weight: var(--weight-medium);
    letter-spacing: -0.01em;
    cursor: pointer;
    transition:
      transform var(--transition-spring),
      box-shadow var(--transition-base),
      opacity var(--transition-fast),
      background var(--transition-base);
    position: relative;
    white-space: nowrap;
    text-decoration: none;
    -webkit-user-select: none;
    user-select: none;
  }

  /* ── Sizes ── */
  .btn--sm {
    font-size: var(--text-sm);
    padding: 0.5rem 1.125rem;
    height: 36px;
  }

  .btn--md {
    font-size: var(--text-base);
    padding: 0.75rem 1.75rem;
    height: 48px;
  }

  .btn--lg {
    font-size: var(--text-lg);
    padding: 0.875rem 2.25rem;
    height: 56px;
  }

  /* ── Variants ── */
  .btn--primary {
    background: var(--gradient-primary);
    color: var(--color-text-inverse);
    box-shadow: var(--shadow-primary);
  }

  .btn--primary:hover:not(:disabled) {
    background: var(--gradient-primary-hover);
    box-shadow: var(--shadow-primary-hover);
    transform: scale(1.03) translateY(-1px);
  }

  .btn--primary:active:not(:disabled) {
    transform: scale(0.98) translateY(0);
    box-shadow: var(--shadow-primary);
  }

  .btn--secondary {
    background: var(--color-surface);
    color: var(--color-accent);
    border: 1.5px solid var(--color-border);
    box-shadow: var(--shadow-sm);
  }

  .btn--secondary:hover:not(:disabled) {
    background: var(--color-section);
    border-color: var(--color-primary);
    box-shadow: var(--shadow-md);
    transform: scale(1.02) translateY(-1px);
  }

  .btn--ghost {
    background: transparent;
    color: var(--color-text-muted);
    border: none;
    box-shadow: none;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .btn--ghost:hover:not(:disabled) {
    color: var(--color-text);
    background: var(--color-section);
  }

  /* ── States ── */
  .btn:disabled {
    opacity: 0.48;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  .btn--full {
    width: 100%;
  }

  /* ── Spinner ── */
  .btn__spinner {
    display: flex;
    align-items: center;
    animation: spin 0.75s linear infinite;
    flex-shrink: 0;
  }

  .btn__label {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
</style>
