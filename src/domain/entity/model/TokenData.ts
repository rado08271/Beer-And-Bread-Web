import RootState from "./RootState";
import PointDTO from "../contractDto/PointDTO";
import {TaxesData} from "./TaxesData";
import BusinessData from "./BusinessData";

export default interface TokenData extends RootState {
    definedArea: PointDTO[],
    businesses: BusinessData[],
    tokenName: string,
    tokenSymbol: string,
    ownerAddress: string
    businessToPay: BusinessData | null
    taxes: TaxesData,
}