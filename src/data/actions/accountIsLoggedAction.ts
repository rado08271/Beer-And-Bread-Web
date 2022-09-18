import AccountData from "../../domain/entity/model/AccountData";
import {superSlice} from "../reducers/superReducer";

const {checkLogin} = superSlice.actions
export default checkLogin

export const accountCheckedSelector = (state: {sup: AccountData}) => state.sup.accountAddress
export const accountLoggedInSelector = (state: {sup: AccountData}) => state.sup.userLogged
export const checkLoadingSelector = (state: {sup: AccountData}) => state.sup.loginLoading

