import {checkIsExchanger} from "../reducers/basicActionUserReducer";
import UserData from "../../domain/entity/model/UserData";

export default checkIsExchanger

export const isExchangerSelector = ((state: {action: UserData}) => state.action.accountIsExchanger)