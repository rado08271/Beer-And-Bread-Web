import {redefineAreaGasEstimate} from "../../reducers/basicActionUserReducer";
import UserData from "../../../domain/entity/model/UserData";

export default redefineAreaGasEstimate

export const redefineAreaGasPriceSelector = ((state: {action: UserData}) => state.action.redefineAreaGasPrice)