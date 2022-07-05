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
interface COMInput {
    cv_in_pid: PID | false,
    cv_in_ch: number | false,
    gt_in_pid: PID | false,
    gt_in_ch: number | false
}
interface COMOutput {
    chain_id: number
    module_ud: number
    cv_out_pid: PID | false,
    cv_out_ch: number | false,
    gt_out_pid: PID | false,
    gt_out_ch: number | false
}
interface COMchain {
    id: number
    inputs: COMInput
    outputs: COMOutput[]
    isConnected: boolean
    modules_descriptor?: string
    modules?: COMmodule[]
}
interface COMnetwork {
    chains: COMchain[]
}

type PeriphialTypes = "midi" | "osc" | "analog" | "digital" | "i2c"
type MidiPorts = "usb_midi_host" | "usb_midi_device" | "serial_midi_1" | "serial_midi_2" | "serial_midi_3"
type DacPorts = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
type MidiCh = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15


type DescriptorType = "config" | "edit"

type MsgType = "createChain" | "removeChain" | "editChain" | "config" | null;
interface Messenger {
    ws: WebSocket,
    send: (msg: String, msgType: MsgType) => void
}


