<script>
  /**
   * RadioGroup.svelte
   * Accessible radio group with animated selection states.
   *
   * Props:
   *   options  â€” Array<{ id: string, label: string, description?: string, isOther?: boolean }>
   *   value    â€” currently selected option id (bindable)
   *   name     â€” input group name
   */
  import { tick } from 'svelte';

  export let options = [];
  export let value = '';
  export let name = 'feedback-reason';

  /** @type {HTMLTextAreaElement|null} */
  let textareaEl = null;

  async function handleSelect(optionId) {
    value = optionId;
    const selected = options.find(o => o.id === optionId);
    if (selected?.isOther) {
      await tick();
      textareaEl?.focus();
    }
  }
</script>

<div class="radio-group" role="radiogroup">
  {#each options as option (option.id)}
    {@const isSelected = value === option.id}
    <label
      class="radio-option"
      class:radio-option--selected={isSelected}
      class:radio-option--other={option.isOther}
    >
      <input
        type="radio"
        {name}
        value={option.id}
        checked={isSelected}
        class="sr-only"
        on:change={() => handleSelect(option.id)}
      />

      <!-- Custom radio dot -->
      <span class="radio-dot" aria-hidden="true">
        <span class="radio-dot__inner" class:radio-dot__inner--visible={isSelected}></span>
      </span>

      <!-- Label text -->
      <span class="radio-label">
        <span class="radio-label__text">{option.label}</span>
        {#if option.description && !option.isOther}
          <span class="radio-label__desc">{option.description}</span>
        {/if}
      </span>

      <!-- Checkmark icon -->
      {#if isSelected}
        <span class="radio-check" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      {/if}
    </label>
  {/each}
</div>

<style>
  .radio-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  /* â”€â”€ Option Row â”€â”€ */
  .radio-option {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-4) var(--space-5);
    border-radius: var(--radius-lg);
    border: 1.5px solid var(--color-border);
    background: var(--color-surface);
    cursor: pointer;
    transition:
      border-color var(--transition-base),
      background var(--transition-base),
      box-shadow var(--transition-base),
      transform var(--transition-spring);
    position: relative;
    overflow: hidden;
  }

  .radio-option::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gradient-primary);
    opacity: 0;
    transition: opacity var(--transition-base);
    pointer-events: none;
  }

  .radio-option:hover {
    border-color: var(--color-primary);
    background: var(--color-section);
    box-shadow: var(--shadow-sm);
    transform: translateX(2px);
  }

  .radio-option--selected {
    border-color: var(--color-accent);
    background: var(--color-section);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1), var(--shadow-sm);
    transform: translateX(4px);
  }

  .radio-option--selected::before {
    opacity: 0.03;
  }

  /* â”€â”€ Radio Dot â”€â”€ */
  .radio-dot {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: var(--radius-full);
    border: 2px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-surface);
    transition:
      border-color var(--transition-base),
      background var(--transition-base);
  }

  .radio-option--selected .radio-dot {
    border-color: var(--color-accent);
    background: var(--color-accent);
  }

  .radio-dot__inner {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full);
    background: var(--color-text-inverse);
    transform: scale(0);
    transition: transform var(--transition-spring);
  }

  .radio-dot__inner--visible {
    transform: scale(1);
  }

  /* â”€â”€ Label â”€â”€ */
  .radio-label {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .radio-label__text {
    font-size: var(--text-base);
    font-weight: var(--weight-medium);
    color: var(--color-text);
    line-height: var(--leading-snug);
  }

  .radio-label__desc {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    line-height: var(--leading-snug);
  }

  /* â”€â”€ Checkmark â”€â”€ */
  .radio-check {
    flex-shrink: 0;
    color: var(--color-accent);
    display: flex;
    align-items: center;
    animation: pop-in var(--transition-spring) forwards;
  }

  @keyframes pop-in {
    0%   { transform: scale(0); opacity: 0; }
    60%  { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
</style>
