<script lang="ts">
  import { transition_in } from "svelte/internal";

  import { intercom_message } from "../store.js";

  let logElm: HTMLElement;

  let log = [];
  intercom_message.subscribe(msg => {
    if (msg) {
      log = [...log, msg];
    }
    setTimeout(() => {
      logElm?.scrollTo({ top: logElm.scrollHeight });
    }, 1);
  });

  function sendMsg(e: Event) {
    log = [...log, e.target.value];
    e.target.value = "";
    setTimeout(() => {
      logElm?.scrollTo({ top: logElm.scrollHeight });
    }, 1);
  }
</script>

<div class="console">
  <ul bind:this={logElm} class="log">
    {#each log as msg}
      <li>{msg}</li>
    {/each}
  </ul>
  <input type="text" name="intercom-message" value="" on:change={sendMsg} />
</div>

<style>
  .console {
    height: 100%;
    overflow: hidden;
    padding: var(--app-padding);

    display: flex;
    flex-direction: column;

    border-style: solid;
    border-color: currentColor;
    border-width: 2px;
  }
  .log {
    flex-grow: 1;
    overflow-y: scroll;
  }
</style>
