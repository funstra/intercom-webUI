<script lang="ts">
  export let type: string;
  export let id: number;
  export let params: { type: string; name: string; value: any }[];

  export let removeModule;
  export let setValue: Function;
</script>

<div class="module">
  <button class="remove-module" on:click={() => removeModule(id)}>remove</button
  >
  <div>id: <span>{id}</span></div>
  <div>type: <span>{type}</span></div>
  {#if params}
    {#each params as param}
      <div class="parameter-{type}">
        <div>{param.name}</div>
        <div>{param.value}</div>
        <input
          type="text"
          name="value"
          on:change={e => setValue(e.target.value, param)}
        />
      </div>
    {/each}
  {/if}
</div>

<style>
  .module {
    position: relative;

    padding: var(--app-padding);

    border-radius: var(--app-rx);
    border-color: var(--col-blk);
    border-style: dashed;
    border-width: 2px;
  }
  .params {
    border-color: var(--col-primary);
    border-style: solid;
    border-width: 1px;
    padding: 4px;
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
  .remove-module {
    width: 100%;
  }
</style>
