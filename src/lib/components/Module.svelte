<script lang="ts">
  import { getContext } from "svelte";

  export let module: COMmodule;
  const ws: WebSocket = getContext("socket");
  export let removeModule;
</script>

<div class="module">
  id:{module.id}
  <br>
  {module.type}
  <button on:click={() => removeModule(module.id)} class="remove-module"
    >remove</button
  >
</div>

<style>
  .module{
    border: 1px black dashed;
    padding: 4px;
  }
</style>
