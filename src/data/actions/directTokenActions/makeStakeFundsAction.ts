import {stakeFunds} from "../../reducers/basicActionUserReducer";
import UserData from "../../../domain/entity/model/UserData";

export default stakeFunds

export const stakeLoadingSelector = ((state: {action: UserData}) => state.action.stakeLoading)