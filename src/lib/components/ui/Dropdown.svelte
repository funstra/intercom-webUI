<script lang="ts">
  export let name;
  export let options;
  export let option_lookup;
  export let value;
</script>

<div class="drop-down">
  <select {name} bind:value>
    {#each options as value}
      <option {value}>
        {#if option_lookup}
          {option_lookup[value]}
        {:else}
          {value}
        {/if}
      </option>
    {/each}
  </select>
  <svg viewBox="0 0 32 32">
    <g transform="translate(16 16)">
      <circle r="4" />
    </g>
  </svg>
</div>

<style>
  .drop-down {
    /* position: relative; */
    display: grid;
    /* grid-template-columns: max-content 1fr 2ch; */
    /* background-color: red; */
    border: 1px black solid;
    border-radius: 2px;
  }
  select {
    display: block;
    /* background-color: blue; */
    border-style: none;
    grid-column: 1/3;
    /* grid-column: 1/5; */
    grid-row: 1;
    padding-right: 3ch;
  }
  .drop-down svg {
    grid-column: 2;
    grid-row: 1;
    pointer-events: none;
    width: 2ch;
    /* background-color: yellow; */
    /* top: 0; */
    /* left: 0; */
    /* position: absolute; */
  }
</style>
