<script lang="ts">
  import Chain from "./Chain.svelte";
  import { dndzone } from "svelte-dnd-action";
  import { printConf } from "./com/printConf";
  import { uui } from "./util";
import { send } from "./com/messenger";

  let uui1 = uui();

  let _network: {
    id: number;
    inputs: { cv: string; gt: string };
    outputs: { cv: string; gt: string };
    modules: { id: number; type: string; params: [] | boolean }[];
    connected: boolean;
  }[] = [];

  // chain functions - - -
  function addChain() {
    _network = [
      ..._network,
      {
        id: uui1(),
        inputs: { cv: null, gt: null },
        outputs: { cv: null, gt: null },
        modules: [],
        connected: false,
      },
    ];
  }

  function removeChain(chainId) {
    if (_network.find(chain => chain.id === chainId).connected) {
      printConf({ disconnectChain: true, chainIndex: chainId });
    }
    _network = _network.filter(chain => chain.id !== chainId);
  }

  function considerChains(e) {
    _network = e.detail.items;
  }
  function finalizeChains(e) {
    _network = e.detail.items;
  }
  // chain functions - - -
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
      <Chain {...chain} {removeChain} />
    {/each}
  </div>
  <button style="margin:var(--app-padding) 0" on:click={addChain}>add</button>
</div>

<style>
  .network {
    height: 100%;
    padding: var(--app-padding);
    overflow: hidden;

    display: flex;
    gap: var(--app-gap-2);
  }
  .inner {
    height: 100%;
    padding: var(--app-padding);
    overflow-x: scroll;

    display: flex;
    gap: var(--app-gap-1);

    background-color: var(--col-wht);
  }
</style>
