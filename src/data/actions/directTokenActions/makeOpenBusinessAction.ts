import {openBusiness} from "../../reducers/basicActionUserReducer";
import UserData from "../../../domain/entity/model/UserData";

export default openBusiness

export const openBusinessLoadingSelector = (state: {action: UserData}) => state.action.openBusinessLoading