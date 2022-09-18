import {dropFunds} from "../reducers/superReducer";
import AccountData from "../../domain/entity/model/AccountData";

export default dropFunds

export const fundsHashSelector = ((state: {sup: AccountData}) => state.sup.dropHash)
export const fundsLoadingSelector = ((state: {sup: AccountData}) => state.sup.dropFundsLoading)
export const fundsErrorSelector = ((state: {sup: AccountData}) => state.sup.dropFundsError)