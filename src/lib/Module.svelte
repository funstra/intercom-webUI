<script lang="ts">
  export let type: string;
  export let id: number;
</script>

<div>
  <p>{type}</p>
  <p>{id}</p>
</div>

<style>
  div {
    border: 2px currentColor solid;
    padding: 4px;
    border-radius: 2px;
    width: 192px;
  }
</style>
