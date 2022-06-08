<script lang="ts">
  import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from "svelte-dnd-action";

  export let id;
  export let modules: { id: number; type: string }[];

  export let removeChain;

  export let onDrop;
  export let addModule;

  function considerModules(e) {
    modules = e.detail.items;
  }
  function finalizeModules(e) {
    onDrop(e.detail.items);
  }
</script>

<div class="chain">
  <button class="remove-chain" on:click={() => removeChain(id)}>remove</button>
  <p>chain id: <span>{id}</span></p>
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
        <div class="module">
          <div>id: <span>{module.id}</span></div>
          <div>type: <span>{module.type}</span></div>
          {#if module[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
            <div class="drop-target-shadow" />
          {/if}
        </div>
      {/each}
    </div>
    <select class="add-module" on:change={e => addModule(e)} name="add-module">
      <option value="pth">pass through</option>
      <option value="bch">branch</option>
      <option value="lfo">lfo</option>
    </select>
  </div>
</div>

<style>
  .remove-chain {
    --fg-c: var(--col-danger);
    --bg-c: var(--col-wht);
  }
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
  .module {
    position: relative;

    padding: var(--app-padding);

    border-radius: var(--app-rx);
    border-color: var(--col-blk);
    border-style: dashed;
    border-width: 2px;
  }
  .module .drop-target-shadow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--col-wht);
    visibility: visible;
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
