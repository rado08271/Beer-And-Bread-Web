import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useLocation} from "react-router-dom";
import getContractById, {
    contractAbiIdSelector,
    contractAddressSelector,
} from "../../../data/actions/getContractByIdAction";
import getAbiById, {contractAbiSelector} from "../../../data/actions/getAbiByIdAction";
import {
    loadStatsContractRepository,
    loadTokenContractRepository,
    loadUserContractRepository
} from "../../../data/actions/contractInitializeAction";
import Loader from "../../components/layout/Loader";
import AdvancedDashboard from "../../components/layout/AdvancedDashboard";
import {makeStyles} from "@material-ui/core";
import checkLogin, {accountCheckedSelector} from "../../../data/actions/accountIsLoggedAction";
import loggedUserAddress from "../../../data/actions/getAccountAddressAction";
import {tokenErrorSelector} from "../../../data/actions/getTokenReducerStateAction";
import showNotification from "../../../domain/service/NotificationService";

const currencyStyle = makeStyles((theme) => ({
    container: {
        width: "100%",
    },
}))

export default function CurrencyDashboard (props: any) {
    const style = currencyStyle()
    const location = useLocation()
    const dispatch = useDispatch()

    const contractAbiId = useSelector(contractAbiIdSelector)
    const contractAddress = useSelector(contractAddressSelector)
    const abiData = useSelector(contractAbiSelector)
    const error: null | string = useSelector(tokenErrorSelector);

    const [contractIsReady, loadedContract] = useState(false);

    useEffect( () => {
        const uriParams = location.pathname.split("/")
        dispatch(getContractById({contractId: uriParams[uriParams.length - 1]}))
        dispatch(loggedUserAddress())
    }, [dispatch])

    useEffect( () => {
        if (contractAbiId !== "") dispatch(getAbiById({abiId: contractAbiId}))
    }, [contractAbiId])

    useEffect(() => {
        if (error != null) {
            showNotification({
                message: `${error}`,
                ttl: 5000,
                title: "Deposit Unsuccesfull",
                type: "error"
            })

        }
    }, [error])

    useEffect(() => {
        if (abiData.length > 0) {
            try {
                dispatch(loadTokenContractRepository({abi: abiData, contractAddress: contractAddress}));
                dispatch(loadUserContractRepository({abi: abiData, contractAddress: contractAddress}));
                dispatch(loadStatsContractRepository({abi: abiData, contractAddress: contractAddress}));
                loadedContract(true)
            } catch (e: any) {
                console.log(e)
            }
        }
    }, [abiData])

    return (
        <div className={style.container}>
            <Loader ready={contractIsReady}/>
            {contractIsReady ? <AdvancedDashboard/> : <span/>}
        </div>
    )
}