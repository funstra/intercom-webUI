<script lang="ts">
  import { intercom_message } from "$lib/stores/message";

  import { getContext, setContext } from "svelte";

  import Chain from "./Chain.svelte";

  import { uui } from "$util/util";

  const uui0 = uui();

  const ws: WebSocket = getContext("socket");

  let message_type: string | null = null;

  ws.onopen = () => {
    console.log("ws open");
    // ws.send("echo");
    // message_type = "configuration";
    ws.send("conf -p");
  };

  ws.addEventListener("message", message => {
    const data: string = message.data.replace(/\n/g, "");

    // console.log(data);

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
      // $intercom_message = data;
    }
    if (data.split("@")[0] === "edit") {
      const [msgType, chain] = data.split("@");
      const [chain_descriptor, modules_descriptor] = chain.split(">");
      const [id, inputs] = chain_descriptor.split(":");
      const [cv_in, gt_in] = inputs.split(",");
      const modules = modules_descriptor.split(",");
      if (modules[0] === "_") {
        network.chains[parseInt(id)].modules = [];
      } else {
        network.chains[parseInt(id)].modules = modules.map((type, i) => ({
          id: uui0(),
          type,
        }));
      }
    }
    // switch (message_type) {
    //   case "configuration":
    //     message_type = null;
    //     console.log(data);

    //     const [msgType, msg] = data.split("@");
    //     console.log(msg);

    //     const chain_descriptors = msg.split(";").slice(0, -1);
    //     chain_descriptors.forEach(chain => {
    //       const [chain_descriptor, modules_descriptor] = chain.split(">");
    //       const [id, inputs] = chain_descriptor.split(":");
    //       const [cv_in, gt_in] = inputs.split(",");
    //       const modules = modules_descriptor.split(",");
    //       console.log(
    //         `chain id: ${id} - cv in: ${cv_in} / gt in: ${gt_in} > modules: ${modules_descriptor}`
    //       );

    //       network.chains = [
    //         ...network.chains,
    //         {
    //           id: parseInt(id),
    //           isConnected: true,
    //           modules: modules[0] != "_" ? modules.map(type => ({ type })) : [],
    //         },
    //       ];
    //     });
    //     $intercom_message = data;
    //     break;
    // }

    const [msgType, msg] = data.split("@");
    if (msgType === "config") {
      const chain_descriptors = msg.split(";").slice(0, -1);

      network.chains = [];
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
            modules:
              modules[0] != "_"
                ? modules.map((type, i) => ({ type, id: uui0() }))
                : [],
          },
        ];
      });
      // $intercom_message = data;
    }

    if (data.startsWith("Removed chain")) {
      const id = parseInt(data.split("Removed chain")[1]);
      network.chains = network.chains
        .filter(chain => chain.id !== id)
        .map((chain, i) => {
          chain.id = i;
          return chain;
        });
      // $intercom_message = data;
    }
  });

  const network: COMnetwork = {
    chains: [],
  };

  async function addChain() {
    ws.send("c -n");
    $intercom_message = "c -n";
  }
  function removeChain(id) {
    ws.send(`c -r ${id}`);
    $intercom_message = `c -r ${id}`;
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
