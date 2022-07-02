import { PID } from "../com/PID";

export function pidToType(_pid: PID | null): PeriphialTypes {

    if (_pid >= PID.serial_midi_1 && _pid <= PID.usb_midi_host) {
        // type = midi
        return "midi"
    }
    if (_pid == PID.osc) {
        // type osc
        return "osc"
    }
    if (_pid <= PID.adc) {
        // type analog
        return "analog"
    }
    if (_pid == PID.din || _pid == PID.dout) {
        // type digital
        return "digital"
    }
    if (_pid == PID.i2c_1 || _pid == PID.i2c_2) {
        // type i2c
        return "i2c"
    }
}
