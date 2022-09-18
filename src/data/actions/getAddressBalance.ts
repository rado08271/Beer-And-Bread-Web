import {getBalance} from "../reducers/basicActionUserReducer";
import UserData from "../../domain/entity/model/UserData";

export default getBalance;

export const addressBalanceSelector = ((state: { action: UserData }) => state.action.accountBalance)
