import RootState from "./RootState";

export default interface SessionData extends RootState {
    logged: boolean
    address: string
    unlockAccountLoading: boolean
    unlockAccountError: string | null
}