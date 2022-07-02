<script lang="ts">
  import {
    descriptor,
    parseConfig,
    parseDescriptorType,
  } from "$lib/com/parser";

  import { getContext } from "svelte";
  import Chain from "./Chain.svelte";

  const messenger: Messenger = getContext("messenger");

  messenger.ws.onopen = () => {
    console.log("ws open");
    messenger.send("conf -p", "config");
  };

  messenger.ws.addEventListener("message", message => {
    const data: string = message.data.replace(/\n/g, "");

    const parsedType = parseDescriptorType(data);
    switch (parsedType.type) {
      case "config":
        const config = parseConfig(parsedType.descriptor);

        console.log(config.chains);

        network.chains = config.chains;
        break;
    }

    // if (parsed.type) console.log(`message type: ${parsed.type}`);
    // switch (parsed.type) {
    //   case "config":
    //     console.log(parsed);

    //     network.chains = [...network.chains, parsed.chain];
    //     break;
    // }
  });

  const network: COMnetwork = {
    chains: [],
  };

  async function addChain() {
    messenger.send("c -n", "createChain");
    network.chains = [
      ...network.chains,
      {
        id: network.chains.length,
        inputs: {
          cv_in_pid: false,
          cv_in_ch: false,
          gt_in_pid: false,
          gt_in_ch: false,
        },
        isConnected: false,
        modules: [],
        modules_descriptor: "_",
      },
    ];
  }
  function removeChain(id) {
    network.chains = network.chains
      .filter(chain => chain.id !== id)
      .map((chain, i) => {
        chain.id = i;
        return chain;
      });
    messenger.send(`c -r${id}`, "removeChain");
  }
</script>

<div class="network">
  <div class="chains">
    {#each network.chains as chain}
      <Chain {chain} {removeChain} />
    {/each}
  </div>
  <button on:click={addChain}><span>add chain</span></button>
</div>

<style>
  button {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-style: dashed;
  }
  button span {
    writing-mode: vertical-rl;
    text-orientation: upright;
  }
  .network {
    display: flex;
    gap: 8px;
    /* background-color: yellow; */
  }
  .chains {
    display: flex;
    /* grid-template-columns: repeat(auto-fill,minmax(256px,1fr)); */
    background-color: palegreen;
    padding: 4px;
    flex-grow: 1;
    gap: 8px;
    overflow-x: scroll;
  }
</style>
