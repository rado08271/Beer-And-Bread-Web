import {Container} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {allContractsSelector} from "../../../data/actions/getAllContractsAction";
import {useEffect} from "react";
import {getAllContracts} from "../../../data/reducers/contractsReducer";
import TokenList from "../../components/list/TokenList";


export default function Dashboard() {
    const dispatch = useDispatch()
    const contracts = useSelector(allContractsSelector)

    useEffect(() => {
        dispatch(getAllContracts())
    }, [dispatch])

    useEffect(() => {
        // console.log(contracts)
    }, [contracts])

    return (
        <Container>
            <TokenList/>
        </Container>
    )
}