<script lang="ts">
  import { intercom_message } from "$lib/stores/message";

  import { getContext, setContext } from "svelte";

  import Chain from "./Chain.svelte";

  import { uui } from "$util/util";
  import { currentMsgType, send } from "$lib/com/messenger";
  import pid from "$lib/com/pid";

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
    const [descriptorType, descriptor] = data.split("@");

    // if (data.startsWith("Created chain")) {
    //   const chain_descriptor = data.split("Created chain")[1];
    //   const [input_descriptor, modules_descriptor] =
    //     chain_descriptor.split(">");

    //   const [id, inputs] = input_descriptor.split(":");
    //   const [cv_in_descriptor, gt_in_descriptor] = inputs.split(",");

    //   console.log(`chain id: ${id}`);

    //   console.log(`input cv: ${cv_in_descriptor}`);
    //   console.log(`input gt: ${gt_in_descriptor}`);

    //   console.log(`modules: ${modules_descriptor}`);

    //   network.chains = [
    //     ...network.chains,
    //     {
    //       id: parseInt(id),
    //       isConnected: true,
    //       modules: [],
    //     },
    //   ];
    // }
    // if (data.split("@")[0] === "edit") {
    //   const [msgType, chain] = data.split("@");
    //   const [chain_descriptor, modules_descriptor] = chain.split(">");
    //   const [id, inputs] = chain_descriptor.split(":");
    //   const [cv_in, gt_in] = inputs.split(",");
    //   const modules = modules_descriptor.split(",");
    //   if (modules[0] === "_") {
    //     network.chains[parseInt(id)].modules = [];
    //   } else {
    //     network.chains[parseInt(id)].modules = modules.map((type, i) => ({
    //       id: uui0(),
    //       type,
    //     }));
    //   }
    // }
    // if (msgType === "config") {
    //   const chain_descriptors = msg.split(";").slice(0, -1);

    //   network.chains = [];
    //   chain_descriptors.forEach(chain => {
    //     const [chain_descriptor, modules_descriptor] = chain.split(">");
    //     const [id, inputs] = chain_descriptor.split(":");
    //     const [cv_in, gt_in] = inputs.split(",");
    //     const modules = modules_descriptor.split(",");
    //     console.log(
    //       `chain id: ${id} - cv in: ${cv_in} / gt in: ${gt_in} > modules: ${modules_descriptor}`
    //     );

    //     network.chains = [
    //       ...network.chains,
    //       {
    //         id: parseInt(id),
    //         isConnected: true,
    //         modules:
    //           modules[0] != "_"
    //             ? modules.map((type, i) => ({ type, id: uui0() }))
    //             : [],
    //       },
    //     ];
    //   });
    // }
    // if (data.startsWith("Removed chain")) {
    //   const id = parseInt(data.split("Removed chain")[1]);
    //   network.chains = network.chains
    //     .filter(chain => chain.id !== id)
    //     .map((chain, i) => {
    //       chain.id = i;
    //       return chain;
    //     });
    // }

    switch (descriptorType) {
      case "config":
        // rebuild the entire network
        const chain_descriptors = descriptor.split(";").slice(0, -1);
        network.chains = [];
        chain_descriptors.forEach(chain => {
          const [chain_descriptor, modules_descriptor] = chain.split(">");

          const [id, inputs] = chain_descriptor.split(/:(.*)/s);
          const [cv_in, gt_in] = inputs.split(",");
          const modules = modules_descriptor.split(",");

          const [cv_type, cv_ch] = cv_in
            .split("cv")[1]
            .split(":")
            .map(type => parseInt(type));

          let t = null;
          let p = null;
          console.log(cv_type, cv_ch);
          if (cv_type >= 5 || cv_type <= 9) {
            // midi type
            t = "midi";
            p = pid[cv_type-1];
          }
          console.log(p);
          
          network.chains = [
            ...network.chains,
            {
              id: parseInt(id),
              inputs: {
                type: t,
                ch: cv_ch,
                port: p,
                addr: null,
              },
              isConnected: true,
              modules:
                modules[0] != "_"
                  ? modules.map((type, i) => ({ type, id: uui0() }))
                  : [],
            },
          ];
        });
      default:
        switch ($currentMsgType) {
          case "createChain":
            if (data.startsWith("Created chain")) {
              $currentMsgType = null;
            }
            break;
          case "removeChain":
            if (data.startsWith("Removed chain")) {
              $currentMsgType = null;
            }
          case null:
            // console.log("null: ", data);
            if (data.startsWith("Created chain")) {
              // console.log("inside created chain: ", data);

              const chain_descriptor = data.split("Created chain")[1];
              const [input_descriptor, modules_descriptor] =
                chain_descriptor.split(">");

              const [id, inputs] = input_descriptor.split(":");
              const [cv_in_descriptor, gt_in_descriptor] = inputs.split(",");

              network.chains = [
                ...network.chains,
                {
                  inputs: {
                    type: null,
                    addr: null,
                    ch: null,
                    port: null,
                  },
                  id: parseInt(id),
                  isConnected: true,
                  modules: [],
                },
              ];
            }
            if (data.startsWith("Removed chain")) {
              const id = parseInt(data.split("Removed chain")[1]);
              network.chains = network.chains
                .filter(chain => chain.id !== id)
                .map((chain, i) => {
                  chain.id = i;
                  return chain;
                });
            }
            break;
          case "createChain":
            console.log("chain created");
            break;
          case "removeChain":
            console.log("chain removed");
        }
    }

    // $currentMsgType = null;
  });

  const network: COMnetwork = {
    chains: [],
  };

  async function addChain() {
    send(ws, "c -n", "createChain");
    network.chains = [
      ...network.chains,
      {
        id: network.chains.length,
        inputs: {
          type: null,
          ch: null,
          port: null,
          addr: null,
        },
        isConnected: false,
        modules: [],
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
    send(ws, `c -r ${id}`, "removeChain");
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
