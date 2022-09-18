import {withdrawGasPriceEstimate} from "../../reducers/basicActionUserReducer";
import TokenData from "../../../domain/entity/model/TokenData";
import UserData from "../../../domain/entity/model/UserData";

export default withdrawGasPriceEstimate

export const withdrawGasPriceSelector = ((state: {action: UserData}) => state.action.withdrawGasPrice)