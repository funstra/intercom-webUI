interface COMparameter {
    type: string
    name: string
    value: string
}
interface COMmodule {
    id?: number
    name?: string
    type: string
    parameters?: COMparameter[]
}
interface COMchain {
    id: number
    inputs: {
        type: "midi" | "osc" | "adc" | null
        port?: number | "usb_midi_host" | "usb_midi_device" | "serial_midi_1" | "serial_midi_2" | "serial_midi_3" | null
        ch?: number | null
        addr?: string | null
    }
    isConnected: boolean
    modules?: COMmodule[]
}
interface COMnetwork {
    chains: COMchain[]
}