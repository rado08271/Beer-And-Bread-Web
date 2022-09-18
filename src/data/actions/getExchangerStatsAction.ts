import UserData from "../../domain/entity/model/UserData";
import {getExchangerData} from "../reducers/basicActionUserReducer";

export default getExchangerData

export const exchangerSelector = ((state: {action: UserData}) => state.action.exchangerAccountData)
