<script lang="ts">
  import { intercom_message } from "$lib/stores/message";
  import { getContext } from "svelte";
  const ws: Messenger = getContext("messenger");
  let logElm: HTMLElement;

  ws.ws.addEventListener("message", message => {
    log = [...log, message.data];
    setTimeout(() => {
      logElm?.scrollTo({ top: logElm.scrollHeight });
    }, 1);
  });

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
    // ws.send(e.target.value);
    ws.send(e.target.value, "editChain");
    e.target.value = "";
    setTimeout(() => {
      logElm?.scrollTo({ top: logElm.scrollHeight });
    }, 1);
  }
</script>

<div class="console">
  <div class="inner">
    <ul bind:this={logElm} class="log">
      {#each log as msg}
        <p>{msg}</p>
      {/each}
    </ul>
    <input type="text" name="intercom-message" value="" on:change={sendMsg} />
  </div>
</div>

<style>
  .console {
    height: 100%;
    width: 100%;
    overflow: hidden;
    padding: var(--app-padding);

    border-style: solid;
    border-color: currentColor;
    border-width: 1px;
  }
  .inner {
    height: 100%;
    width: 100%;
    display: flex;
    overflow: hidden;
    flex-direction: column;
  }
  .log {
    width: 100%;
    flex-grow: 1;
    overflow-y: scroll;
    /* overflow-x: hidden; */
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 8px;
  }
  .log p {
    width: 100%;
    overflow-wrap: break-word;
  }
</style>
