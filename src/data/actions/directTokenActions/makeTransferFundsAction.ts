import {transferFunds} from "../../reducers/basicActionUserReducer";
import UserData from "../../../domain/entity/model/UserData";

export default transferFunds

export const transferLoadingSelector = ((state: {action: UserData}) => state.action.transferLoading)
