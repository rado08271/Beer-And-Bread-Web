import {changeOwner} from "../../reducers/basicActionUserReducer";
import UserData from "../../../domain/entity/model/UserData";

export default changeOwner

export const changeOwnerLoadingSelector = (state: {action: UserData}) => state.action.changeOwnerLoading