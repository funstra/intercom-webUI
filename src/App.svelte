<script lang="ts">
  // import messenger from "./lib/com/messenger"
  import Console from "./lib/Console.svelte";
  import Network from "./lib/Network.svelte";

  
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
