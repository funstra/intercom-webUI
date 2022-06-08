<script lang="ts">
  import Chain from "./Chain.svelte";
  import { dndzone } from "svelte-dnd-action";
  import { intercom_message } from "/src/store";

  // print functions - - -
  function printConf(
    opt: {
      chainIndex?: number;
      connectChain?: boolean;
      disconnectChain?: boolean;
    },
    descriptor?: string
  ) {
    const cv_in_per = 12;
    const cv_in_ch = 0;

    const gt_in_per = 12;
    const gt_in_ch = 0;

    const out_per = 12;
    const out_ch = 1;

    const cv_out_ref_chain = 1;
    const cv_out_ref_module = 1;

    const gt_out_pref_chain = 1;
    const gt_out_ref_module = 1;

    let msg;

    if (opt.disconnectChain) {
      msg = `chain -r ${opt.chainIndex}`;
    } else {
      if (opt.connectChain) {
        msg = `chain -n cv${cv_in_per}:${cv_in_ch},gt${gt_in_per}:${gt_in_ch}>${descriptor} out${out_per}:${out_ch}:${cv_out_ref_chain}:${cv_out_ref_module}:${gt_out_pref_chain}:${gt_out_ref_module}`;
      } else {
        msg = `chain -e ${opt.chainIndex} >${
          descriptor.length ? descriptor : "_"
        }`;
      }
    }
    // console.log(msg);
    $intercom_message = msg;
  }
  // print functions - - -

  let uui =
    (s = 0) =>
    () =>
      s++;

  let uui0 = uui();
  let uui1 = uui();

  let _network: {
    id: number;
    modules: { id: number; type: string }[];
    connected: boolean;
  }[] = [];

  // chain functions - - -
  function addChain() {
    _network = [
      ..._network,
      {
        id: uui1(),
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
  // chain functions - - -

  // module functions - - -
  function addModule(chainId, e) {
    _network = _network.map(chain => {
      if (chain.id === chainId) {
        chain.modules.push({ id: uui0(), type: e.target.value });
        if (!chain.connected) {
          chain.connected = true;
          printConf({ connectChain: true }, chain.modules[0].type);
        } else {
          printConf(
            { connectChain: false, chainIndex: chain.id },
            chain.modules.map(module => module.type).join(",")
          );
        }
        return chain;
      }
      return chain;
    });
  }
  function removeModule(chainId, moduleId) {
    _network = _network.map(chain => {
      if (chain.id === chainId) {
        chain.modules = chain.modules.filter(module => module.id !== moduleId);
        printConf(
          { connectChain: false, chainIndex: chain.id },
          chain.modules.map(module => module.type).join(",")
        );
        return chain;
      }
      return chain;
    });
  }
  // module functions - - -

  function considerChains(e) {
    _network = e.detail.items;
  }
  function finalizeChains(e) {
    _network = e.detail.items;
  }
  function finalizeModules(chainId, newModules) {
    _network = _network.map(chain => {
      if (chain.id === chainId) {
        chain.modules = newModules;
        return chain;
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
        removeModule={moduleId => removeModule(chain.id, moduleId)}
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
