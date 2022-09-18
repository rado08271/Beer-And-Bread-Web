import {redefineArea} from "../../reducers/basicActionUserReducer";
import UserData from "../../../domain/entity/model/UserData";

export default redefineArea

export const redefineAreaLoadingSelector = (state: {action: UserData}) => state.action.redefineAreaLoading