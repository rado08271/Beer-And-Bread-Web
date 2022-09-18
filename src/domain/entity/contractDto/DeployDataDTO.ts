import ContractDTO from "./ContractDTO";
import TokenDTO from "./TokenDTO";

export default interface DeployDataDTO {
    deployer?: string
    contract: ContractDTO
    token: TokenDTO
}