import {depositFunds} from "../../reducers/basicActionUserReducer";
import UserData from "../../../domain/entity/model/UserData";

export default depositFunds

export const depositLoadingSelector = (state: {action: UserData}) => state.action.depositLoading