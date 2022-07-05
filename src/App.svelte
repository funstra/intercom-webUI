<script lang="ts">
  import Console from "$components/Console.svelte";
  import Network from "$components/Network.svelte";
  import { writable, Writable } from "svelte/store";
  import { setContext } from "svelte";

  // messenger - - - -
  const INTERCOM_IP = "localhost:9090";
  const ws = new WebSocket(`ws://${INTERCOM_IP}/ws`);

  const currentMsgType: Writable<MsgType> = writable(null);

  function send(ws: WebSocket, msg: string, msgType: MsgType) {
    currentMsgType.set(msgType);
    ws.send(msg);
  }

  setContext("messenger", {
    ws,
    send: (msg: string, msgType: MsgType) => send(ws, msg, msgType),
  });

  // messenger - - - -
</script>

<main>
  <Network />
  <Console />
</main>

<style>
  main {
    padding: var(--app-padding);
    border-radius: var(--app-rx);

    overflow: hidden;

    display: grid;
    gap: var(--app-gap-2);
  }
  @media (min-width: 512px) {
    main {
      grid-template-columns: minmax(256px, 1fr) 35ch;
    }
  }
</style>
