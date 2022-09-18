import RootState from "./RootState";

export default interface PaypalData extends RootState{
    paymentLoading: boolean,
    paymentSuccess: boolean,
    paymentReferenceID: string,
    paymentUrl: string,
    paymentStatus: string,
    paymentId: string
}