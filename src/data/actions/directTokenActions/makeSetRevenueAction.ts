import {setRevenue} from "../../reducers/basicActionUserReducer";
import UserData from "../../../domain/entity/model/UserData";

export default setRevenue

export const setRevenueLoadingSelector = (state: {action: UserData}) => state.action.setRevenueLoading