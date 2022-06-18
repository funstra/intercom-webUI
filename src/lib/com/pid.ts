const PID = [
    ["dac", ""],
    ["adc", "adc"],
    ["dout", ""],
    ["din", ""],
    ["serial_midi_1", "1"],
    ["serial_midi_2", "2"],
    ["serial_midi_3", "3"],
    ["usb_midi_device", "device"],
    ["usb_midi_host", "host"],
    ["i2c_1", ""],
    ["i2c_2", ""],
    ["osc", "osc"]
]

function getByType(type: MidiPorts) {
    let t
    let i
    for (let _i = 0; _i < PID.length; _i++) {
        const _t = PID[_i];
        if (type === _t[0]) {
            t = _t
            i = _i
            break
        }
    }
    return { t, i }
}


export default Object.freeze({
    PID,
    getByType
})