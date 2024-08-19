import * as OBC from "@thatopen/components"

export interface DiscordIntegrationConfig {
  webhookURL: string | null
}

export class DiscordIntegration extends OBC.Component implements OBC.Configurable<DiscordIntegrationConfig> {
  static readonly uuid = "45f0856c-eaf4-47c5-a9f0-c57cab007bf6" as const
  enabled = false

  private _xhr = new XMLHttpRequest()
  channels: Record<string, string> = {
    "chanel-b": "https://discord.com/api/webhooks/1255217273220628542/sznq3xIj6PnJz8ta2W4lmwy9Ym7iEAlKH4VuzVSdIBwNkT5yX3apXZnqwP2XCRlrjaGR",
    "chanel-c": "https://discord.com/api/webhooks/1255234946038108221/6dX6iNbt2LzrSPUMsbJujSL6LjiyThSNkm_owGRk3-wdkRyxYw3AIdmnpVErxOjAcXrP"
  }


  constructor(components: OBC.Components) {
    super(components)
    components.add(DiscordIntegration.uuid, this)
  }

  config: Required<DiscordIntegrationConfig> = {
    webhookURL: null
  }



  readonly onSetup = new OBC.Event<DiscordIntegration>()

  setup(config?: Partial<DiscordIntegrationConfig>) {
    if (this.isSetup) return;
    this.config = { ...this.config, ...config }
    const _config = { ...this.config }
    const openConnection = (url: string) => {
      this._xhr.open("POST", url)
    }

    Object.defineProperty(this.config, "webhookURL", {
      get() {
        return this._webhookURL
      },
      set(url: string | null) {
        this._webhookURL = url
        if (url) openConnection(url)
      }
    })

    this.config.webhookURL = _config.webhookURL
    this.enabled = true
    this.isSetup = true
    this.onSetup.trigger(this)
  }
  isSetup = false
  onSetyp = new OBC.Event<DiscordIntegrationConfig>

  sendMessage(world: OBC.World, message: string, channel: string) {
    if (!this.isSetup) {
      throw new Error("DiscordIntegration: the component is not setup yet!")
    }

    const url = this.channels[channel]
    if (!url) {
      throw new Error("what the fuck")
    }
    this.config.webhookURL = url


    if (!(this.enabled && url)) return;

    const { scene, camera, renderer } = world
    if (!renderer) {
      throw new Error("DiscordIntegration: your world need a renderer to send a message!")
    };
    const canvas = renderer.three.domElement
    renderer.three.render(scene.three, camera.three)
    canvas.toBlob((blob) => {
      if (!blob) { return }
      const file = new File([blob], "screenshot.png")
      const data = new FormData()
      data.set("content", message)
      data.set("screenshot", file)
      this._xhr.send(data)
    })
  }
}

export * from "./src"