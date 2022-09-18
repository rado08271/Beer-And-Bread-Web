import RootState from "./RootState";
import {ExchangerData} from "./ExchangerData";
import RevenueData from "./RevenueData";
import Log from "../logDto";

export default  interface UserData extends RootState {
    accountBalance: string
    loggedAccountAddress: string
    accountIsOwner: boolean
    accountIsExchanger: boolean
    accountIsActive: boolean
    accountIsBusiness: boolean
    exchangerAccountData: ExchangerData | null
    revenueData: RevenueData
    logs: Log[]

    depositGasPrice: number,
    depositLoading: boolean
    withdrawGasPrice: number,
    withdrawalLoading: boolean
    transferGasPrice: number,
    transferLoading: boolean,
    stakeGasPrice: number
    stakeLoading: boolean
    setTaxesGasPrice: number
    setTaxesLoading: boolean
    setRevenueGasPrice: number
    setRevenueLoading: boolean
    changeOwnerGasPrice: number
    changeOwnerLoading: boolean
    openBusinessGasPrice: number
    openBusinessLoading: boolean
    changeBusinessGasPrice: number
    changeBusinessLoading: boolean,
    redefineAreaGasPrice: number
    redefineAreaLoading: boolean,


}