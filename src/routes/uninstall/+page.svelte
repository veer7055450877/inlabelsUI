<script>
  /**
   * /src/routes/uninstall/+page.svelte
   * The uninstall feedback experience.
   *
   * URL: /uninstall?email=user@example.com
   *
   * Flow:
   *  1. Mount  Ã¢â€ â€™ read ?email from URL Ã¢â€ â€™ POST /api/save-email
   *  2. Show   Ã¢â€ â€™ feedback form (radio reasons + optional textarea)
   *  3. Submit Ã¢â€ â€™ POST /api/update-feedback Ã¢â€ â€™ show success state
   */

  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { fade, fly, scale } from 'svelte/transition';
  import { cubicOut, backOut } from 'svelte/easing';

  import Card       from '$lib/components/Card.svelte';
  import Button     from '$lib/components/Button.svelte';
  import RadioGroup from '$lib/components/RadioGroup.svelte';

  import {
    VARIANT,
    PRODUCT,
    FEEDBACK_REASONS,
    COPY,
    API,
  } from '$lib/config.js';

  // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Derived Config Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  const copy    = COPY[VARIANT] ?? COPY.professional;
  const reasons = FEEDBACK_REASONS;

  // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ State Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

  /** Email from URL param */
  let email = '';

  /** Selected reason id */
  let selectedReason = '';

  /** Free-text value for "Other" */
  let otherText = '';

  /** Textarea element ref for auto-focus */
  let textareaEl;

  /** UI phase: 'loading' | 'form' | 'success' | 'error' */
  let phase = 'loading';

  /** Loading state for submit button */
  let isSubmitting = false;

  /** Error message */
  let errorMessage = '';

  // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Computed Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

  $: selectedReasonObj  = reasons.find(r => r.id === selectedReason);
  $: isOtherSelected    = selectedReasonObj?.isOther === true;
  $: isSubmitDisabled   = !selectedReason || (isOtherSelected && otherText.trim().length < 2);

  // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Lifecycle Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

  onMount(async () => {
    // Read email from query param
    email = $page.url.searchParams.get('email') ?? '';

    // Log uninstall event (fire-and-forget with brief delay for UX)
    await logUninstallEvent(email);

    // Show form after brief loading moment
    phase = 'form';
  });

  // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ API Calls Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

  /**
   * POST /api/save-email
   * Called on mount to record the uninstall event.
   */
  async function logUninstallEvent(userEmail) {
    try {
      await fetch(API.saveEmail, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          timestamp: new Date().toISOString(),
          source: 'uninstall_page',
        }),
      });
    } catch (err) {
      // Non-blocking Ã¢â‚¬â€ we still show the form even if logging fails
      console.warn('[uninstall] Failed to log event:', err);
    }
  }

  /**
   * POST /api/update-feedback
   * Called on form submit.
   */
  async function submitFeedback() {
    if (isSubmitDisabled || isSubmitting) return;

    isSubmitting = true;
    errorMessage = '';

    const payload = {
      email,
      reason: selectedReason,
      reasonLabel: selectedReasonObj?.label ?? '',
      otherText: isOtherSelected ? otherText.trim() : '',
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch(API.updateFeedback, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? `Server error ${res.status}`);
      }

      phase = 'success';
    } catch (err) {
      errorMessage = 'Something went wrong. Please try again.';
      console.error('[uninstall] Submit failed:', err);
    } finally {
      isSubmitting = false;
    }
  }

  // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Helpers Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

  function handleKeydown(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      submitFeedback();
    }
  }
</script>

<svelte:head>
  <title>Before you go Ã¢â‚¬â€ {PRODUCT.name}</title>
</svelte:head>

<!-- Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
     Page Shell
Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â -->
<div class="page">
  <!-- Background decoration -->
  <div class="page__bg-orb page__bg-orb--1" aria-hidden="true"></div>
  <div class="page__bg-orb page__bg-orb--2" aria-hidden="true"></div>

  <main class="page__main">

    <!-- Ã¢â€â‚¬Ã¢â€â‚¬ Loading Skeleton Ã¢â€â‚¬Ã¢â€â‚¬ -->
    {#if phase === 'loading'}
      <div class="skeleton-wrap" in:fade={{ duration: 200 }}>
        <div class="skeleton skeleton--title"></div>
        <div class="skeleton skeleton--text"></div>
        <div class="skeleton skeleton--text skeleton--short"></div>
        {#each Array(4) as _}
          <div class="skeleton skeleton--option"></div>
        {/each}
        <div class="skeleton skeleton--btn"></div>
      </div>

    <!-- Ã¢â€â‚¬Ã¢â€â‚¬ Feedback Form Ã¢â€â‚¬Ã¢â€â‚¬ -->
    {:else if phase === 'form'}
      <div
        class="card-wrap"
        in:fly={{ y: 24, duration: 500, easing: cubicOut, delay: 50 }}
      >
        <Card glow elevated>
          <!-- Header -->
          <header class="form-header">
            <div class="form-header__brand">
              <span class="brand-icon">{PRODUCT.logoEmoji}</span>
              <span class="brand-name">{PRODUCT.name}</span>
            </div>

            <div class="form-header__eyebrow">{copy.eyebrow}</div>

            <h1 class="form-header__headline">
              {#each copy.headline.split('\n') as line, i}
                {#if i === 0}
                  {line}
                {:else}
                  <br /><em>{line}</em>
                {/if}
              {/each}
            </h1>

            {#if email}
              <p class="form-header__email">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.5" />
                  <path d="M1 6l7 4.5L15 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                </svg>
                {email}
              </p>
            {/if}

            <p class="form-header__sub">{copy.subheadline}</p>
          </header>

          <!-- Divider -->
          <div class="divider" role="separator"></div>

          <!-- Form Body -->
          <form
            class="feedback-form"
            on:submit|preventDefault={submitFeedback}
            novalidate
          >
            <fieldset class="form-fieldset">
              <legend class="form-section-label">{copy.sectionLabel}</legend>

              <RadioGroup
                options={reasons}
                bind:value={selectedReason}
                name="feedback-reason"
              />
            </fieldset>

            <!-- "Other" textarea (animated reveal) -->
            {#if isOtherSelected}
              <div
                class="textarea-wrap"
                in:fly={{ y: 10, duration: 280, easing: backOut }}
                out:fade={{ duration: 150 }}
              >
                <label class="textarea-label" for="other-text">
                  Tell us more
                  <span class="textarea-label__hint">(optional but helpful)</span>
                </label>
                <textarea
                  id="other-text"
                  bind:this={textareaEl}
                  bind:value={otherText}
                  class="textarea"
                  placeholder={copy.otherPlaceholder}
                  rows="4"
                  maxlength="500"
                  on:keydown={handleKeydown}
                ></textarea>
                <div class="textarea-footer">
                  <span class="textarea-count">{otherText.length}/500</span>
                  {#if !isOtherSelected || otherText.trim().length < 2}
                    <span class="textarea-hint">A few words help us understand.</span>
                  {/if}
                </div>
              </div>
            {/if}

            <!-- Microcopy -->
            {#if copy.microcopy}
              <p class="microcopy">{copy.microcopy}</p>
            {/if}

            <!-- Error -->
            {#if errorMessage}
              <div class="error-msg" role="alert" in:fly={{ y: 4, duration: 200 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" />
                  <path d="M8 4.5v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  <circle cx="8" cy="11" r="0.75" fill="currentColor" />
                </svg>
                {errorMessage}
              </div>
            {/if}

            <!-- Submit -->
            <div class="form-actions">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isSubmitting}
                disabled={isSubmitDisabled}
              >
                {isSubmitting ? copy.submitLoadingLabel : copy.submitLabel}
              </Button>

              <p class="form-footer-note">
                Having second thoughts?
                <a href={PRODUCT.homepageUrl} class="link">Explore what's new Ã¢â€ â€™</a>
              </p>
            </div>
          </form>
        </Card>
      </div>

    <!-- Ã¢â€â‚¬Ã¢â€â‚¬ Success State Ã¢â€â‚¬Ã¢â€â‚¬ -->
    {:else if phase === 'success'}
      <div
        class="card-wrap"
        in:scale={{ start: 0.95, duration: 400, easing: backOut }}
      >
        <Card glow elevated>
          <div class="success-state">
            <!-- Animated checkmark -->
            <div class="success-icon" in:scale={{ start: 0.5, duration: 500, easing: backOut, delay: 100 }}>
              <div class="success-icon__ring"></div>
              <svg class="success-icon__check" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path
                  class="check-path"
                  d="M7 16l6.5 6.5L25 9"
                  stroke="white"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <div class="success-copy" in:fly={{ y: 12, duration: 400, easing: cubicOut, delay: 200 }}>
              <h2 class="success-headline">{copy.successHeadline}</h2>
              <p class="success-body">{copy.successBody}</p>

              {#if email}
                <p class="success-email">
                  Submitted for <strong>{email}</strong>
                </p>
              {/if}
            </div>

            <div in:fly={{ y: 8, duration: 350, easing: cubicOut, delay: 350 }}>
              <Button
                variant="secondary"
                size="md"
                on:click={() => window.location.href = PRODUCT.homepageUrl}
              >
                {copy.successCta}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </Button>
            </div>

            <!-- Support note -->
            <p class="success-support">
              Changed your mind?
              <a href="mailto:{PRODUCT.supportEmail}" class="link">Contact support</a>
              Ã¢â‚¬â€ we may be able to restore your account.
            </p>
          </div>
        </Card>
      </div>
    {/if}

  </main>

  <!-- Footer -->
  <footer class="page-footer">
    <p>Ã‚Â© {new Date().getFullYear()} {PRODUCT.name}. All rights reserved.</p>
    <a href="mailto:{PRODUCT.supportEmail}" class="link">Contact support</a>
  </footer>
</div>

<!-- Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
     Styles
Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â -->
<style>
  /* Ã¢â€â‚¬Ã¢â€â‚¬ Page Layout Ã¢â€â‚¬Ã¢â€â‚¬ */
  .page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-8) var(--space-4);
    position: relative;
    overflow: hidden;
  }

  /* Ã¢â€â‚¬Ã¢â€â‚¬ Background Orbs Ã¢â€â‚¬Ã¢â€â‚¬ */
  .page__bg-orb {
    position: fixed;
    border-radius: var(--radius-full);
    pointer-events: none;
    z-index: 0;
    filter: blur(80px);
  }

  .page__bg-orb--1 {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(96, 165, 250, 0.12) 0%, transparent 70%);
    top: -200px;
    right: -100px;
  }

  .page__bg-orb--2 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.10) 0%, transparent 70%);
    bottom: -150px;
    left: -100px;
  }

  /* Ã¢â€â‚¬Ã¢â€â‚¬ Main Container Ã¢â€â‚¬Ã¢â€â‚¬ */
  .page__main {
    width: 100%;
    max-width: 560px;
    position: relative;
    z-index: 1;
  }

  .card-wrap {
    width: 100%;
  }

  /* Ã¢â€â‚¬Ã¢â€â‚¬ Form Header Ã¢â€â‚¬Ã¢â€â‚¬ */
  .form-header {
    margin-bottom: var(--space-6);
  }

  .form-header__brand {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-5);
  }

  .brand-icon {
    font-size: 1.25rem;
    line-height: 1;
  }

  .brand-name {
    font-size: var(--text-base);
    font-weight: var(--weight-semi);
    color: var(--color-text-muted);
    letter-spacing: 0.02em;
  }

  .form-header__eyebrow {
    font-size: var(--text-xs);
    font-weight: var(--weight-semi);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-accent);
    margin-bottom: var(--space-3);
  }

  .form-header__headline {
    font-family: var(--font-display);
    font-size: var(--text-4xl);
    font-weight: var(--weight-regular);
    line-height: var(--leading-tight);
    color: var(--color-text);
    margin-bottom: var(--space-4);
  }

  .form-header__headline em {
    font-style: italic;
    color: var(--color-accent);
  }

  .form-header__email {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    background: var(--color-section);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    padding: 0.3rem 0.75rem;
    margin-bottom: var(--space-4);
  }

  .form-header__sub {
    font-size: var(--text-base);
    color: var(--color-text-muted);
    line-height: var(--leading-relaxed);
    max-width: 44ch;
  }

  /* Ã¢â€â‚¬Ã¢â€â‚¬ Divider Ã¢â€â‚¬Ã¢â€â‚¬ */
  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--color-border), transparent);
    margin-bottom: var(--space-6);
  }

  /* Ã¢â€â‚¬Ã¢â€â‚¬ Form Ã¢â€â‚¬Ã¢â€â‚¬ */
  .feedback-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }

  .form-fieldset {
    border: none;
    padding: 0;
    margin: 0;
  }

  .form-section-label {
    display: block;
    font-size: var(--text-sm);
    font-weight: var(--weight-semi);
    color: var(--color-text-muted);
    letter-spacing: 0.03em;
    margin-bottom: var(--space-4);
  }

  /* Ã¢â€â‚¬Ã¢â€â‚¬ Textarea Ã¢â€â‚¬Ã¢â€â‚¬ */
  .textarea-wrap {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .textarea-label {
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text);
    display: flex;
    align-items: baseline;
    gap: var(--space-2);
  }

  .textarea-label__hint {
    font-weight: var(--weight-regular);
    color: var(--color-text-light);
    font-size: var(--text-xs);
  }

  .textarea {
    width: 100%;
    border: 1.5px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    color: var(--color-text);
    padding: var(--space-3) var(--space-4);
    font-size: var(--text-base);
    line-height: var(--leading-relaxed);
    resize: vertical;
    min-height: 100px;
    transition:
      border-color var(--transition-base),
      box-shadow var(--transition-base);
  }

  .textarea:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
  }

  .textarea::placeholder {
    color: var(--color-text-light);
  }

  .textarea-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .textarea-count {
    font-size: var(--text-xs);
    color: var(--color-text-light);
  }

  .textarea-hint {
    font-size: var(--text-xs);
    color: var(--color-text-light);
  }

  /* Ã¢â€â‚¬Ã¢â€â‚¬ Microcopy Ã¢â€â‚¬Ã¢â€â‚¬ */
  .microcopy {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    text-align: center;
    font-style: italic;
  }

  /* Ã¢â€â‚¬Ã¢â€â‚¬ Error Ã¢â€â‚¬Ã¢â€â‚¬ */
  .error-msg {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
    background: #FEF2F2;
    border: 1px solid #FECACA;
    border-radius: var(--radius-md);
    color: #DC2626;
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
  }

  /* Ã¢â€â‚¬Ã¢â€â‚¬ Actions Ã¢â€â‚¬Ã¢â€â‚¬ */
  .form-actions {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    align-items: center;
  }

  .form-footer-note {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    text-align: center;
  }

  /* Ã¢â€â‚¬Ã¢â€â‚¬ Link Ã¢â€â‚¬Ã¢â€â‚¬ */
  .link {
    color: var(--color-accent);
    text-decoration: none;
    font-weight: var(--weight-medium);
    transition: color var(--transition-fast);
  }

  .link:hover {
    color: var(--color-accent-dark);
    text-decoration: underline;
  }

  /* Ã¢â€â‚¬Ã¢â€â‚¬ Success State Ã¢â€â‚¬Ã¢â€â‚¬ */
  .success-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--space-6);
    padding: var(--space-4) 0;
  }

  /* Ã¢â€â‚¬Ã¢â€â‚¬ Success Icon Ã¢â€â‚¬Ã¢â€â‚¬ */
  .success-icon {
    position: relative;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .success-icon__ring {
    position: absolute;
    inset: 0;
    border-radius: var(--radius-full);
    background: var(--gradient-primary);
    box-shadow: var(--shadow-primary-hover);
    animation: ring-pulse 2.5s ease-in-out infinite;
  }

  .success-icon__check {
    position: relative;
    z-index: 1;
  }

  .check-path {
    stroke-dasharray: 40;
    stroke-dashoffset: 40;
    animation: draw-check 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
  }

  @keyframes draw-check {
    to { stroke-dashoffset: 0; }
  }

  @keyframes ring-pulse {
    0%, 100% { box-shadow: var(--shadow-primary-hover), 0 0 0 0 rgba(99, 102, 241, 0.3); }
    50%       { box-shadow: var(--shadow-primary-hover), 0 0 0 10px rgba(99, 102, 241, 0); }
  }

  /* Ã¢â€â‚¬Ã¢â€â‚¬ Success Copy Ã¢â€â‚¬Ã¢â€â‚¬ */
  .success-copy {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    max-width: 38ch;
  }

  .success-headline {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    font-weight: var(--weight-regular);
    color: var(--color-text);
    line-height: var(--leading-tight);
  }

  .success-body {
    font-size: var(--text-base);
    color: var(--color-text-muted);
    line-height: var(--leading-relaxed);
  }

  .success-email {
    font-size: var(--text-sm);
    color: var(--color-text-light);
  }

  .success-email strong {
    color: var(--color-text-muted);
    font-weight: var(--weight-medium);
  }

  .success-support {
    font-size: var(--text-sm);
    color: var(--color-text-light);
  }

  /* Ã¢â€â‚¬Ã¢â€â‚¬ Skeleton Loading Ã¢â€â‚¬Ã¢â€â‚¬ */
  .skeleton-wrap {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    background: var(--color-surface);
    border-radius: var(--radius-xl);
    padding: var(--space-8);
    border: 1px solid var(--color-border);
  }

  .skeleton {
    border-radius: var(--radius-sm);
    background: linear-gradient(
      90deg,
      var(--color-section) 0%,
      var(--color-border) 50%,
      var(--color-section) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
  }

  .skeleton--title  { height: 40px; width: 70%; border-radius: var(--radius-md); margin-bottom: var(--space-2); }
  .skeleton--text   { height: 16px; width: 90%; }
  .skeleton--short  { width: 60%; }
  .skeleton--option { height: 60px; width: 100%; border-radius: var(--radius-lg); margin-top: var(--space-2); }
  .skeleton--btn    { height: 52px; width: 100%; border-radius: var(--radius-full); margin-top: var(--space-4); }

  @keyframes shimmer {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }

  /* Ã¢â€â‚¬Ã¢â€â‚¬ Footer Ã¢â€â‚¬Ã¢â€â‚¬ */
  .page-footer {
    margin-top: var(--space-8);
    display: flex;
    align-items: center;
    gap: var(--space-4);
    font-size: var(--text-sm);
    color: var(--color-text-light);
    position: relative;
    z-index: 1;
  }

  /* Ã¢â€â‚¬Ã¢â€â‚¬ Responsive Ã¢â€â‚¬Ã¢â€â‚¬ */
  @media (max-width: 600px) {
    .form-header__headline {
      font-size: var(--text-3xl);
    }

    .page-footer {
      flex-direction: column;
      text-align: center;
      gap: var(--space-2);
    }
  }
</style>
