import UserData from "../../../domain/entity/model/UserData";
import {stakeGasPriceEstimate} from "../../reducers/basicActionUserReducer";

export default stakeGasPriceEstimate

export const stakeGasPriceSelector = ((state: {action: UserData}) => state.action.stakeGasPrice)