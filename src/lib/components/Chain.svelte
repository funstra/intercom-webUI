<script lang="ts">
  import Module from "./Module.svelte";
  import { dndzone } from "svelte-dnd-action";
  import { inputCvPID, inputGtPID, inputPID, PID } from "$lib/com/PID";
  import { getContext } from "svelte";
  import { pidToType } from "$lib/interface-mappings/inputs";
  import Dropdown from "./ui/Dropdown.svelte";

  const messenger: Messenger = getContext("messenger");

  export let chain: COMchain;
  export let removeChain;
  function addModule(type) {}
  function removeModule(id) {}

  function considerModules(e) {}
  function finlazieModules(e) {}

  let input_cv_n_ch = null;
  let input_gt_n_ch = null;

  function sendInputs() {
    // let _cv = `${
    //   chain.inputs.cv_in_pid
    //     ? `${chain.inputs.cv_in_pid}:${chain.inputs.cv_in_ch}`
    //     : "_"
    // }`;
    // let _gt = `${
    //   chain.inputs.gt_in_pid
    //     ? `${chain.inputs.gt_in_pid}:${chain.inputs.gt_in_ch}`
    //     : "_"
    // }`;
    // messenger.send(
    //   `c -e${chain.id}:cv${_cv},gt${_gt}>${chain.modules_descriptor}`,
    //   "config"
    // );
  }

  $: {
    switch (pidToType(chain.inputs.cv_in_pid)) {
      case "midi":
        input_cv_n_ch = 16;
        break;
      case "analog":
      case "digital":
        input_cv_n_ch = 9;
        break;
      case "osc":
        input_cv_n_ch = "address";
    }
  }
  $: {
    switch (pidToType(chain.inputs.gt_in_pid)) {
      case "midi":
        input_gt_n_ch = 16;
        break;
      case "analog":
      case "digital":
        input_gt_n_ch = 9;
        break;
      case "osc":
        input_gt_n_ch = "address";
    }
  }
</script>

<div class="chain">
  <header>
    <div class="meta">
      <div class="chain-id">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          style="width: 2ch;"
        >
          <path
            transform="rotate(-45,12 12)"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
        <p>{chain.id}</p>
      </div>
      <button class="remove-chain" on:click={() => removeChain(chain.id)}>
        del
      </button>
    </div>
    <div class="inputs" on:change={sendInputs}>
      <!-- cv inputs -->
      <div class="cv">
        <!-- PID -->
        <Dropdown
          bind:value={chain.inputs.cv_in_pid}
          name="inputs_cv_pid"
          options={inputCvPID}
          option_lookup={PID}
        />
        <!-- channel -->
        {#if input_cv_n_ch == "address"}
          <input
            type="text"
            name="inputs_cv_ch"
            bind:value={chain.inputs.cv_in_ch}
          />
        {:else}
          <select name="inputs_cv_ch" bind:value={chain.inputs.cv_in_ch}>
            {#each { length: input_cv_n_ch } as _, ch}
              <option value={ch}>{ch}</option>
            {/each}
          </select>
        {/if}
      </div>
      <!-- gate inputs -->
      <div class="gt">
        <!-- PID -->
        <Dropdown
          bind:value={chain.inputs.gt_in_pid}
          name="inputs_gt_pid"
          options={inputGtPID}
          option_lookup={PID}
        />
        <!-- channel -->
        {#if input_gt_n_ch == "address"}
          <input
            type="text"
            name="inputs_cv_ch"
            bind:value={chain.inputs.gt_in_ch}
          />
        {:else}
          <select name="inputs_gt_ch" bind:value={chain.inputs.gt_in_ch}>
            {#each { length: input_gt_n_ch } as _, ch}
              <option value={ch}>{ch}</option>
            {/each}
          </select>
        {/if}
      </div>
    </div>
  </header>

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

  <footer>
    <div class="outputs">
      <div class="type">midi</div>
      <div class="port">port:<span>2</span></div>
      <div class="channel">ch:<span>9</span></div>
    </div>
  </footer>
  <button on:click={() => addModule("pth")}>add pth</button>
</div>

<style>
  .chain {
    /* width: 256px; */
    /* min-width: 256px; */
    background-color: palegoldenrod;
    border: 1px black solid;
    padding: 4px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    border-top: none;
    border-bottom: none;
  }
  header,
  footer {
    display: flex;
    gap: 4px;
    /* padding: 4px; */
    flex-direction: column;
    justify-content: end;
    border-width: 1px;
  }
  header {
    border-bottom-style: solid;
    padding-bottom: 4px;
    /* border-bottom: 1px black solid; */
  }
  footer {
    padding-top: 4px;
    border-top-style: solid;
  }
  .meta {
    display: flex;
    justify-content: space-between;
  }
  .chain-id {
    display: flex;
    align-items: center;
  }
  .chain-id svg {
  }
  .inputs,
  .outputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
  }
  .cv,
  .gt {
    /* width: max-content; */
    display: flex;
    flex-direction: column;
    gap: 4px;
    /* background-color: red; */
  }
  select {
  }
  .modules {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    gap: 4px;
    padding: 2px;
  }
</style>
