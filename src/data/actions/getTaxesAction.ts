import {getTaxes} from "../reducers/basicActionTokenReducer";
import TokenData from "../../domain/entity/model/TokenData";

export default getTaxes

export const transferTaxesSelector = ((state: {token: TokenData}) => state.token.taxes.transactionTax)
export const depositTaxesSelector = ((state: {token: TokenData}) => state.token.taxes.entryTax)
export const withdrawalTaxesSelector = ((state: {token: TokenData}) => state.token.taxes.withdrawalTax)
export const stagnationTaxesSelector = ((state: {token: TokenData}) => state.token.taxes.stagnationTax)
export const taxesSelector = ((state: {token: TokenData}) => state.token.taxes)
