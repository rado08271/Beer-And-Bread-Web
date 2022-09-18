import {setTaxes} from "../../reducers/basicActionUserReducer";
import UserData from "../../../domain/entity/model/UserData";

export default setTaxes

export const setTaxLoadingSelector = (state: {action: UserData}) => state.action.setTaxesLoading