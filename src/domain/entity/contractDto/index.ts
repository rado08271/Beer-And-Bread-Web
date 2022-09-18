import DeployDataDTO from "./DeployDataDTO";

export default interface Contract {
    _id: string
    contractAccount: string
    abiId: string
    deployData: DeployDataDTO
}