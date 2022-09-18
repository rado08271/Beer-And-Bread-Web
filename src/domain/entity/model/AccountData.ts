import RootState from "./RootState";

export default interface AccountData extends RootState {
    accountAddress: string | null
    accountBalance: number
    userLogged: boolean
    loginLoading: boolean
    dropFundsLoading: boolean
    dropHash: string
    dropFundsError: string | null
}