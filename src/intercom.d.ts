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
    isConnected: boolean
    modules?: COMmodule[]
}
interface COMnetwork {
    chains: COMchain[]
}