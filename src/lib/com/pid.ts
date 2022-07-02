export enum analogPID {
    dac = 1,
    adc
}

export enum digitalPID {
    dout = 3,
    din
}

export enum midiPID {
    serial_midi_1 = 5,
    serial_midi_2,
    serial_midi_3,
    usb_midi_device,
    usb_midi_host,
}

export enum _PID {
    i2c_1 = 10,
    i2c_2,
    osc,
}

export enum PID {
    dac = 1,
    adc,
    dout,
    din,
    serial_midi_1,
    serial_midi_2,
    serial_midi_3,
    usb_midi_device,
    usb_midi_host, i2c_1,
    i2c_2,
    osc,
}

export const _inputPID = {
    2: "adc",
    4: "din",
    5: "serial_midi_1",
    6: "serial_midi_2",
    7: "serial_midi_3",
    8: "usb_midi_device",
    9: "usb_midi_host",
    11: "osc",
}
export const inputPID = [
    2,
    4,
    5,
    6,
    7,
    8,
    9,
    12,
]
export const inputCvPID = [
    2,
    5,
    6,
    7,
    8,
    9,
    12,
]
export const inputGtPID = [
    4,
    5,
    6,
    7,
    8,
    9,
    12,
]
export const outputPID = [
    1,
    3,
    5,
    6,
    7,
    8,
    9,
    11
]
export const _outputPID = {
    1: "dac",
    3: "dout",
    5: "serial_midi_1",
    6: "serial_midi_2",
    7: "serial_midi_3",
    8: "usb_midi_device",
    9: "usb_midi_host",
    11: "osc",
}

export const analogCH = [
    0, 1, 2, 3, 4, 5, 6, 7, 8
]
export const digitalCH = [
    0, 1, 2, 3, 4, 5, 6, 7, 8
]
export const midiCH = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
]