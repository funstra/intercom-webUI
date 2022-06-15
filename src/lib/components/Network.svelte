<script lang="ts">
  import { setContext } from "svelte";

  import Chain from "./Chain.svelte";

  const INTERCOM_IP = "intercom.local";
  const ws = new WebSocket(`ws://${INTERCOM_IP}/ws`);

  setContext("socket", ws);

  let m = "";
  let next = false;
  ws.onopen = () => {
    console.log("ws open");
    ws.send("conf -p");
  };
  ws.onmessage = message => {
    const data: string = message.data.replace(/\n/g, "");
    // console.log('data!:: ',data);

    if (data.startsWith("Created chain")) {
      const chain_descriptor = data.split("Created chain")[1];
      const [input_descriptor, modules_descriptor] =
        chain_descriptor.split(">");

      const [id, inputs] = input_descriptor.split(":");
      const [cv_in_descriptor, gt_in_descriptor] = inputs.split(",");

      console.log(`chain id: ${id}`);

      console.log(`input cv: ${cv_in_descriptor}`);
      console.log(`input gt: ${gt_in_descriptor}`);

      console.log(`modules: ${modules_descriptor}`);

      network.chains = [
        ...network.chains,
        {
          id: parseInt(id),
          isConnected: true,
          modules: [],
        },
      ];

      console.log(network);
    }

    const [msgType, msg] = data.split("@");
    if (msgType === "config") {
      const chain_descriptors = msg.split(";").slice(0, -1);
      chain_descriptors.forEach(chain => {
        const [chain_descriptor, modules_descriptor] = chain.split(">");
        const [id, inputs] = chain_descriptor.split(":");
        const [cv_in, gt_in] = inputs.split(",");
        const modules = modules_descriptor.split(",");
        console.log(
          `chain id: ${id} - cv in: ${cv_in} / gt in: ${gt_in} > modules: ${modules_descriptor}`
        );

        network.chains = [
          ...network.chains,
          {
            id: parseInt(id),
            isConnected: true,
            modules: modules[0] != "_" ? modules.map(type => ({ type })) : [],
          },
        ];
      });
    }
  };

  const network: COMnetwork = {
    chains: [],
  };

  async function addChain() {
    // network.chains.push();
    ws.send("c -n");
  }
</script>

<div class="network">
  <div class="chains">
    {#each network.chains as chain}
      <Chain {chain} />
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
    /* background-color: yellow; */
    text-orientation: upright;
  }

  .network {
    display: flex;
    gap: 8px;
  }
  .chains {
    display: flex;
    gap: 8px;
    overflow-x: scroll;
  }
</style>
