import { intercom_message } from "../../store"
import { send } from "./messenger"
export function printConf(
    opt: {
        chainIndex?: number;
        inputs?: { cv: string; gt: string };
        connectChain?: boolean;
        disconnectChain?: boolean;
    },
    modules?: [{ id: number, type: string, params: [] | boolean }]
) {
    const cv_in_per = 12;
    const cv_in_ch = 0;

    const gt_in_per = 12;
    const gt_in_ch = 0;

    const out_per = 12;
    const out_ch = 1;

    const cv_out_ref_chain = 1;
    const cv_out_ref_module = 1;

    const gt_out_pref_chain = 1;
    const gt_out_ref_module = 1;

    console.log('hello');
    
    let msg;
    console.log(opt.inputs?.cv)
    console.log(opt.inputs?.gt)
    let inPut = `cv${opt.inputs.cv},gt${opt.inputs.gt}`;
    // let inPut = ""
    let outPut = `out${out_per}:${out_ch}:${cv_out_ref_chain}:${cv_out_ref_module}:${gt_out_pref_chain}:${gt_out_ref_module}`

    if (opt.disconnectChain) {
        msg = `chain -r ${opt.chainIndex}`;
    } else {
        let descriptor = "_"
        if (modules?.length) {
            descriptor = modules.map(module => {
                let params = ""
                if (module.params) {
                    params = module.params.map(param => {
                        return param.value
                    }).join(";")
                }
                return `${module.type}${params}`
            }).join(',')
        }
        if (opt.connectChain) {
            msg = `chain -n ${inPut}>${descriptor}`;
        } else {
            msg = `chain -e ${opt.chainIndex} >${descriptor}`;
        }
    }
    // send(msg)
    console.log(msg);
    
    intercom_message.set(msg)
}