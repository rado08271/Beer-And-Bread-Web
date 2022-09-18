import {getBalance} from "../reducers/superReducer";
import AccountData from "../../domain/entity/model/AccountData";

export default getBalance

export const accountGetBalance = (state: {sup: AccountData}) => state.sup.accountBalance

