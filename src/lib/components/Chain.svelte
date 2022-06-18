<script lang="ts">
  import { getContext, SvelteComponent } from "svelte";
  import Module from "./Module.svelte";
  import { dndzone } from "svelte-dnd-action";
  import { uui } from "$util/util";
  import { send } from "$lib/com/messenger";
  import { children } from "svelte/internal";

  export let chain: COMchain;
  export let removeChain;
  const ws: WebSocket = getContext("socket");
  function addModule(type) {
    const _modules = chain.modules.map(module => module.type).join(",");
    const cmd = `c -e ${chain.id}:cv8:0,gt8:0>${_modules}${
      _modules.length ? "," : ""
    }${type}`;
    send(ws, cmd, "editChain");
    chain.modules = [
      ...chain.modules,
      {
        type,
        id: chain.modules.length,
      },
    ];
    console.log(cmd);
  }
  function removeModule(id) {
    const _modules = chain.modules
      .filter(module => module.id !== id)
      .map(module => module.type)
      .join(",");
    const cmd = `c -e ${chain.id}:cv8:0,gt8:0>${
      _modules.length ? _modules : "_"
    }`;
    chain.modules = chain.modules
      .filter(module => module.id !== id)
      .map((module, i) => {
        module.id = i;
        return module;
      });
    send(ws, cmd, "editChain");
    console.log(cmd);
  }

  function considerModules(e) {
    chain.modules = e.detail.items;
  }
  function finlazieModules(e) {
    chain.modules = e.detail.items;
    const _modules = chain.modules.map(module => module.type).join(",");
    const cmd = `c -e ${chain.id}:cv8:0,gt8:0>${_modules}`;
    console.log(cmd);
    send(ws, cmd, "editChain");
  }

  $: inputPorts =
    chain.inputs.type === "midi"
      ? [
          "serial_midi_1",
          "serial_midi_2",
          "serial_midi_3",
          "usb_midi_device",
          "usb_midi_host",
        ]
      : [1, 2, 3, 4, 5, 6, 7, 8, 9];

  $: {
    switch (chain.inputs.type) {
      case "midi":
        if (chain.inputs.port && chain.inputs.ch) {
          let cv_port;
          switch (chain.inputs.port) {
            case "serial_midi_1":
              cv_port = 5;
              break;
            case "serial_midi_2":
              cv_port = 6;
              break;
            case "serial_midi_3":
              cv_port = 7;
              break;
            case "usb_midi_device":
              cv_port = 8;
              break;
            case "usb_midi_host":
              cv_port = 9;
              break;
          }
          let input_descriptor = `cv${cv_port}:${chain.inputs.ch}`;
          let cmd = `c -e${chain.id}:${input_descriptor}`;
          send(ws, cmd, "editChain");
        }
    }
  }
  // function changeInputs() {
  //   let _descriptor = `c -e${chain.id}`;
  //   let cv_in_descriptor = "";
  //   let gt_in_descriptor = "";
  //   let cv_port;
  //   switch (chain.inputs.type) {
  //     case "midi":
  //       if (typeof chain.inputs.port == "string") {
  //         cv_port = chain.inputs.port == "host" ? 4 : 5;
  //       } else {
  //         cv_port = chain.inputs.port;
  //       }
  //       cv_port += 4;
  //       break;
  //     case "osc":
  //       break;
  //     case "adc":
  //       break;
  //   }
  //   console.log(cv_port);

  //   // cv_port = `cv${}`
  //   // send(ws, _descriptor, "editChain");
  // }
</script>

<div class="chain">
  <header>
    <button class="remove-chain" on:click={() => removeChain(chain.id)}>
      del
    </button>
    <div class="meta">
      <p>chain:{chain.id}</p>
      <form class="inputs" on:submit|preventDefault on:change={null}>
        <label>
          <select name="input-type" bind:value={chain.inputs.type}>
            <option value="midi">midi</option>
            <option value="osc">osc</option>
            <option value="adc">adc</option>
          </select>
        </label>

        {#if chain.inputs.type}
          {#if chain.inputs.type != "osc"}
            <label>
              port:
              <select name="input-port" bind:value={chain.inputs.port}>
                {#each inputPorts as port}
                  <option value={port}>{port}</option>
                {/each}
              </select>
            </label>
          {/if}
        {/if}

        {#if chain.inputs.type == "midi"}
          <label>
            ch:
            <select name="input-channel" bind:value={chain.inputs.ch}>
              {#each { length: 16 } as _, i}
                <option value={i}>{i}</option>
              {/each}
            </select>
          </label>
        {/if}
        {#if chain.inputs.type == "osc"}
          <label>
            addr:
            <input
              type="text"
              name="input-adress"
              bind:value={chain.inputs.addr}
            />
          </label>
        {/if}
      </form>
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
  <button on:click={() => addModule("bch")}>add bch</button>
</div>

<style>
  .chain {
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
    gap: 1em;
    justify-content: end;
  }
  header {
    flex-direction: column;
    gap: 4px;
    border-bottom: 1px black solid;
  }
  header .meta {
    display: flex;
    gap: 1em;
  }
  footer {
    border-top: 1px black solid;
  }
  .inputs,
  .outputs {
    display: flex;
    gap: 0.5em;
  }
  .inputs label {
    display: flex;
  }
  .inputs input {
    display: block;
    width: 100%;
  }
  .modules {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    gap: 4px;
    padding: 2px;
  }
</style>
