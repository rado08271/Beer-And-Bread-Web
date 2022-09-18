import {transferFundsGasEstimate} from "../../reducers/basicActionUserReducer";
import UserData from "../../../domain/entity/model/UserData";

export default transferFundsGasEstimate

export const transferGasPriceSelector = ((state: {action: UserData}) => state.action.transferGasPrice)