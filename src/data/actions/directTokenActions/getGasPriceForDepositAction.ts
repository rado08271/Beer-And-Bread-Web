import {depositGasPriceEstimate} from "../../reducers/basicActionUserReducer";
import UserData from "../../../domain/entity/model/UserData";

export default depositGasPriceEstimate

export const depositGasPriceSelector = ((state: {action: UserData}) => state.action.depositGasPrice)