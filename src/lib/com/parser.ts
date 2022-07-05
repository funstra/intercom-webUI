import { pidToType } from "../interface-mappings/inputs"
import type { PID } from "./PID"

export function parseConfig(config: string) {
    const [chain_descriptors, out_descriptors] = config.split('out')
    const chains = chain_descriptors.split(';').slice(0, -1).map(parseChain)
    return {
        chains
    }
}
export function parseChain(chain_descriptor: string): COMchain {
    const [chain, modules_descriptor] = chain_descriptor.split('>')

    const [_id, chain_inputs] = chain.split(/:(.*)/s)
    const id = parseInt(_id)

    let [cv_input, gt_input] = chain_inputs.split(',')

    cv_input = cv_input.split('cv')[1]
    gt_input = gt_input.split('gt')[1]


    // cv in
    let cv_in_pid
    let cv_in_ch

    if (cv_input == undefined || cv_input == "_") {
        // no input
        cv_in_pid = false
        cv_in_ch = false
    } else {
        [cv_in_pid, cv_in_ch] = cv_input.split(':')
        cv_in_pid = parseInt(cv_in_pid)
        if (pidToType(cv_in_pid) == 'osc') {
            // exception for osc
        } else {
            cv_in_ch = parseInt(cv_in_ch)
        }
    }


    // gate in
    let gt_in_pid
    let gt_in_ch

    if (gt_input == undefined || gt_input == "_") {
        // no inputs
        gt_in_pid = false
        gt_in_ch = false
    } else {
        [gt_in_pid, gt_in_ch] = gt_input.split(':')
        gt_in_pid = parseInt(gt_in_pid)
        if (pidToType(gt_in_pid) == 'osc') {
            // exception for osc
        } else {
            gt_in_ch = parseInt(gt_in_ch)
        }
    }

    let modules = []
    if (modules_descriptor !== '_') {
        modules = modules_descriptor.split(',').filter(module => module !== 'inp').map(parseModule)
    }

    return {
        id,
        inputs: {
            cv_in_pid,
            cv_in_ch,
            gt_in_pid,
            gt_in_ch
        },
        isConnected: false,
        modules: [],
        modules_descriptor
    }

}

function parseModule(module_descriptor: String) {
    return module_descriptor
}
export function parseDescriptorType(s: string): { type: DescriptorType, descriptor: string } {
    let [type, descriptor] = s.split('@') as [DescriptorType, string]
    return { type, descriptor }

}
export function descriptor(s: String) {
    let [type, descriptor] = s.split('@') as [DescriptorType, string]

    if (descriptor) {
        if (type == 'config') {
            return parseConfig(descriptor)
        }
    } else {
        return false
    }
}

export function chainToString(chain: COMchain): String {
    let string_inp = `cv${chain.inputs.cv_in_pid}:${chain.inputs.cv_in_ch},gt${chain.inputs.gt_in_pid}:${chain.inputs.gt_in_ch}`
    let string_modules = `>${chain.modules.length ? chain.modules : '_'}`
    return `${string_inp}${string_modules}`
}