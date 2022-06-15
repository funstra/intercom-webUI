<script lang="ts">
  import Console from "$components/Console.svelte";
  import Network from "$components/Network.svelte";
</script>

<main>
  <Network />
  <Console />
</main>

<style>
  main {
    padding: var(--app-padding);
    border-radius: var(--app-rx);

    overflow: hidden;

    display: grid;
    gap: var(--app-gap-2);
  }
  @media (min-width: 512px) {
    main {
      grid-template-columns: minmax(256px, 1fr) 35ch;
    }
  }
</style>
