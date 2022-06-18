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
        type: PeriphialTypes | null
        port: DacPorts | MidiPorts | null
        ch: MidiCh | null
        addr: string | null
    }
    isConnected: boolean
    modules?: COMmodule[]
}
interface COMnetwork {
    chains: COMchain[]
}

type PeriphialTypes = "midi" | "osc" | "adc"
type MidiPorts = "usb_midi_host" | "usb_midi_device" | "serial_midi_1" | "serial_midi_2" | "serial_midi_3"
type DacPorts = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
type MidiCh = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 