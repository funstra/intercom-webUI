<script lang="ts">
  import { getContext, SvelteComponent } from "svelte";
  import Module from "./Module.svelte";
  import { dndzone } from "svelte-dnd-action";

  export let chain: COMchain;
  export let removeChain;
  const ws: WebSocket = getContext("socket");
  function addModule(type) {
    const _modules = chain.modules.map(module => module.type).join(",");
    let moduleType = type;
    const cmd = `c -e ${chain.id}:cv8:0,gt8:0>${_modules}${
      _modules.length ? "," : ""
    }${moduleType}`;
    console.log(cmd);
    
    ws.send(cmd);
  }
  function removeModule(id) {
    const _modules = chain.modules
      .filter(module => module.id !== id)
      .map(module => module.type)
      .join(",");
    // console.log(chain.modules);

    const cmd = `c -e ${chain.id}:cv8:0,gt8:0>${
      _modules.length ? _modules : "_"
    }`;
    // console.log(cmd);
    ws.send(cmd);
  }

  function considerModules(e) {
    chain.modules = e.detail.items;
  }
  function finlazieModules(e) {
    chain.modules = e.detail.items;
    const _modules = chain.modules.map(module => module.type).join(",");
    const cmd = `c -e ${chain.id}:cv8:0,gt8:0>${_modules}`;
    console.log(cmd);
    
    // ws.send(cmd);
    // chain.modules = e.detail.items;
  }
</script>

<div class="chain">
  <button on:click={() => removeChain(chain.id)} class="remove-chain"
    >remove</button
  >
  <div class="meta">
    id: <span>{chain.id}</span>
    is connected: <span>{chain.isConnected}</span>
  </div>
  <div
    class="modules"
    use:dndzone={{ items: chain.modules }}
    on:consider={considerModules}
    on:finalize={finlazieModules}
  >
    {#each chain.modules as module (module.id)}
      <Module {module} {removeModule} />
    {/each}
  </div>
  <button on:click={() => addModule("pth")}>add pth</button>
  <button on:click={() => addModule("bch0:0")}>add bch</button>
</div>

<style>
  .chain {
    border: 1px black solid;
    padding: 4px;
    display: flex;
    flex-direction: column;
  }
  .modules {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 2px;
  }
</style>
