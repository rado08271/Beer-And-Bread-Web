import UserData from "../../../domain/entity/model/UserData";
import {changeBusinessEstimate} from "../../reducers/basicActionUserReducer";

export default changeBusinessEstimate

export const changeBusinessGasPriceSelector = ((state: {action: UserData}) => state.action.changeBusinessGasPrice)