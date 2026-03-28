<script>
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';

  if (browser) {
    goto('/uninstall');
  }
</script>

<svelte:head>
  <title>Redirecting…</title>
</svelte:head>
