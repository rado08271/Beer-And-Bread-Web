import {setRevenueEstimate} from "../../reducers/basicActionUserReducer";
import UserData from "../../../domain/entity/model/UserData";

export default setRevenueEstimate

export const setRevenueGasPriceSelector = ((state: {action: UserData}) => state.action.setRevenueGasPrice)