<script lang="ts">
  import module_spec from "./module-spec.json";
  import { dndzone } from "svelte-dnd-action";
  import { printConf } from "./com/printConf";
  import Module from "./Module.svelte";
  import { uui } from "./util";

  const uui0 = uui();

  export let id;
  export let inputs: { cv: string; gt: string };
  export let outputs: { cv: string; gt: string };
  export let modules: { id: number; type: string; params: [] | boolean }[];

  export let connected: boolean;

  export let removeChain;

  $: if (!connected) {
    if (inputs.cv && inputs.gt) {
      printConf({
        chainIndex: id,
        connectChain: true,
        inputs,
      });
    }
  }

  function addModule(e) {
    modules.push({
      id: uui0(),
      type: e.target.value,
      params: module_spec.modules.find(module => module.type === e.target.value)
        .parameters,
    });
    modules = modules;
    printConf(
      {
        chainIndex: id,
        inputs,
        connectChain: !connected,
      },
      modules
    );
    if (!connected) connected = true;
  }

  function removeModule(id: number) {
    modules = modules.filter(module => module.id !== id);
    printConf(
      {
        chainIndex: id,
        connectChain: false,
      },
      modules
    );
  }

  function setValue(value, param) {
    param.value = value;
    console.log(param);

    modules = modules;
    console.log(modules);

    printConf({ chainIndex: id, connectChain: false }, modules);
  }

  function considerModules(e) {
    modules = e.detail.items;
  }
  function finalizeModules(e) {
    modules = e.detail.items;
    printConf({ chainIndex: id, inputs, connectChain: false }, modules);
  }
</script>

<div class="chain">
  <button class="remove-chain" on:click={() => removeChain(id)}>remove</button>
  <p>chain id: <span>{id}</span></p>
  <!-- {#if inputs} -->
  <div class="input">
    input
    <div>
      cv:
      <span><input type="text" name="input-cv" bind:value={inputs.cv} /></span>
      <br />
      gt:
      <span><input type="text" name="input-gt" bind:value={inputs.gt} /></span>
      <!-- cv: <span>{inputs.cv}</span>
        gt: <span>{inputs.gt}</span> -->
    </div>
  </div>
  <!-- {/if} -->
  <div class="inner">
    <div
      class="drop-zone"
      use:dndzone={{
        items: modules,
        dropTargetStyle: { "": "" },
        dropTargetClasses: ["dropOver"],
      }}
      on:consider={considerModules}
      on:finalize={finalizeModules}
    >
      {#each modules as module (module.id)}
        <Module {...module} {removeModule} {setValue} />
      {/each}
    </div>

    <select class="add-module" on:change={addModule} name="add-module">
      <option value="type">type</option>
      <option value="pth">pass through</option>
      <option value="bch">branch</option>
      <option value="lfo">lfo</option>
    </select>
  </div>
</div>

<style>
  .chain {
    height: 100%;
    padding: var(--app-padding);

    display: flex;
    flex-direction: column;

    border-radius: var(--app-rx);
    border-color: var(--col-blk);
    border-style: solid;
    border-width: 2px;
  }
  .chain .inner {
    height: 100%;
    padding: var(--app-padding);

    overflow-y: scroll;

    display: flex;
    flex-direction: column;
    gap: var(--app-gap-2);

    background-color: var(--col-gr);
  }
  .chain .drop-zone {
    display: flex;
    flex-direction: column;
    gap: var(--app-gap-2);
  }
  :global(.chain .dropOver) {
    min-height: 32px;
  }

  .input {
    border: 1px green solid;
  }
  .add-module {
    border-style: dashed;
    opacity: 0.5;
    background-color: var(--col-primary);
  }

  .add-module:hover {
    opacity: 1;
  }
</style>
