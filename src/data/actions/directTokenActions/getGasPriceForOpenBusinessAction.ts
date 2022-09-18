import UserData from "../../../domain/entity/model/UserData";
import {openBusinessEstimate} from "../../reducers/basicActionUserReducer";

export default openBusinessEstimate

export const openBusinessGasPriceSelector = ((state: {action: UserData}) => state.action.openBusinessGasPrice)