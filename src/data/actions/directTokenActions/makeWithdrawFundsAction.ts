import {withdrawFunds} from "../../reducers/basicActionUserReducer";
import UserData from "../../../domain/entity/model/UserData";

export default withdrawFunds

export const withdrawalLoadingSelector = ((state: {action: UserData}) => state.action.withdrawalLoading)