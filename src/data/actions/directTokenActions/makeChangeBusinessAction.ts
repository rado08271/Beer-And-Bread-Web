import {changeBusiness} from "../../reducers/basicActionUserReducer";
import UserData from "../../../domain/entity/model/UserData";

export default changeBusiness

export const changeBusinessLoadingSelector = (state: {action: UserData}) => state.action.changeBusinessLoading