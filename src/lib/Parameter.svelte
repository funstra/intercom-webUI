<script lang="ts">
  export let type: string;
  export let name: string;
  export let value: any;
</script>

<div class="parameter-{type}">
  <div>{name}</div>
  <div>{value}</div>
  <input type="text" name="value" on:input={e=> value = e.target.value} />
</div>

<style>
</style>
