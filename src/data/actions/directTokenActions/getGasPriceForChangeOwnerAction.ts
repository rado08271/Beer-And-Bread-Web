import {changeOwnerEstimate} from "../../reducers/basicActionUserReducer";
import UserData from "../../../domain/entity/model/UserData";

export default changeOwnerEstimate

export const changeOwnerGasPriceSelector = (state: {action: UserData}) => state.action.changeOwnerGasPrice