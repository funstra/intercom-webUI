<script lang="ts">
  import Chain from "./Chain.svelte";
  import { dndzone } from "svelte-dnd-action";

  let uui =
    (s = 0) =>
    () =>
      s++;

  let uui0 = uui();
  let uui1 = uui();

  let _network = [
    {
      id: uui1(),
      modules: [
        { id: uui0(), type: "pth" },
        { id: uui0(), type: "bch" },
        { id: uui0(), type: "pth" },
      ],
    },
    {
      id: uui1(),
      modules: [
        { id: uui0(), type: "bch" },
        { id: uui0(), type: "bch" },
      ],
    },
  ];

  function addChain() {
    _network = [
      ..._network,
      {
        id: uui1(),
        modules: [],
      },
    ];
  }
  function removeChain(chainId) {
    _network = _network.filter(chain => chain.id !== chainId);
  }

  function addModule(chainId, e) {
    _network = _network.map(chain => {
      if (chain.id === chainId) {
        chain.modules.push({ id: uui0(), type: e.target.value });
        return chain;
      }
      return chain;
    });
  }

  function considerChains(e) {
    _network = e.detail.items;
  }
  function finalizeChains(e) {
    _network = e.detail.items;
  }
  function finalizeModules(chainId, newModules) {
    _network = _network.map(chain => {
      if (chain.id === chainId) {
        console.log(newModules);
        return { ...chain, modules: newModules };
      }
      return chain;
    });
  }
</script>

<div class="network">
  <div
    class="inner"
    use:dndzone={{
      items: _network,
      type: "chain",
      dropTargetStyle: { "": "" },
      dropTargetClasses: ["dropOver"],
    }}
    on:consider={considerChains}
    on:finalize={finalizeChains}
  >
    {#each _network as chain (chain.id)}
      <Chain
        {removeChain}
        {...chain}
        addModule={e => addModule(chain.id, e)}
        onDrop={newModules => finalizeModules(chain.id, newModules)}
      />
    {/each}
  </div>
  <button style="margin:var(--app-padding) 0" on:click={addChain}>add</button>
</div>

<style>
  .network {
    height: 100%;
    padding: var(--app-padding);
    
    display: flex;
    gap: var(--app-gap-2);

  }
  .inner {
    height: 100%;
    padding: var(--app-padding);

    display: flex;
    gap: var(--app-gap-1);

    background-color: var(--col-wht);
  }
</style>
