import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";
import { label } from "three/examples/jsm/nodes/Nodes.js";
import { DiscordIntegration } from "..";

export const discordIntegrationUI = (
  world: OBC.World,
  components: OBC.Components,
) => {
  const textInput = document.createElement("bim-text-input");

  const channelsInput = document.createElement("bim-dropdown");
  channelsInput.required = true;

  const discordIntegration = components.get(DiscordIntegration);

  for (const channel in discordIntegration.channels) {
    const option = document.createElement("bim-option");
    option.label = channel;
    channelsInput.append(option);
  }

  const sendMessage = () => {
    const selectchannel = channelsInput.value[0];
    if (textInput.value.trim() === "" || !selectchannel) return;
    discordIntegration.sendMessage(world, textInput.value, selectchannel);
    textInput.value = "";
    modal.close();
  };

  const headerToolbar = BUI.Component.create<BUI.Toolbar>(() => {
    return BUI.html`
    <bim-toolbar-header style="width: 20rem" label="header" >
      <div>test</div>
    </bim-toolbar-header>
  `;
  });

  document.body.append(headerToolbar);

  const modal = BUI.Component.create<HTMLDialogElement>(() => {
    return BUI.html`
      <dialog>
        <bim-panel style="width: 20rem;">
          <bim-panel-section label="Send Discord Message" fixed>
            <bim-label style="white-space: normal;">The message you write here will be sent to the Discord channel associated with this project based on the settings.</bim-label>
            ${channelsInput} 
            ${textInput}
            <bim-button @click=${sendMessage} label="Send" icon="iconoir:send-diagonal-solid"></bim-button> 
          </bim-panel-section> 
        </bim-panel>
      </dialog>
    `;
  });

  document.body.append(modal);

  return BUI.Component.create<BUI.ToolbarSection>(() => {
    return BUI.html`
      <bim-toolbar-section label="Communication" icon="lets-icons:chat-fill">
        <bim-button @click=${() => modal.showModal()} label="Send Message" icon="flowbite:discord-solid"></bim-button>
      </bim-toolbar-section>
    `;
  });
};
