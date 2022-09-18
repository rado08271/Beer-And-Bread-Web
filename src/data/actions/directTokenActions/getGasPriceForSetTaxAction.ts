import {setTaxesEstimate} from "../../reducers/basicActionUserReducer";
import UserData from "../../../domain/entity/model/UserData";

export default setTaxesEstimate

export const setTaxesGasPriceSelector = ((state: {action: UserData }) => state.action.setTaxesGasPrice)