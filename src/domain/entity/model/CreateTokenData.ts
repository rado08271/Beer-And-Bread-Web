import RootState from "./RootState";
import PointDTO from "../contractDto/PointDTO";
import Log from "../logDto";

export default interface CreateTokenData extends RootState {
    polygonData: PointDTO[],
    tokenName: string,
    tokenSymbol: string,
    logs: Log[]
    createTokenLoading: boolean
}