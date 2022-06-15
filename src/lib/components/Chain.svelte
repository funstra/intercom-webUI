<script lang="ts">
  import { getContext } from "svelte";

  export let chain: COMchain;

  const ws: WebSocket = getContext("socket");
  function addModule() {
    //   ws.send(`-e ${chain.id}>`)
  }
</script>

<div class="chain">
  <button class="remove-chain">remove</button>
  <div class="meta">
    id: <span>{chain.id}</span>
    is connected: <span>{chain.isConnected}</span>
  </div>
  <div class="modules">
    {#each chain.modules as module}
      <div class="module">
        {module.type}
      </div>
    {/each}
  </div>
  <button on:click={addModule}>add module</button>
</div>

<style>
  .chain {
    border: 1px black solid;
    padding: 4px;
    display: flex;
    flex-direction: column;
  }
</style>
