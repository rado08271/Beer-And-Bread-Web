import {
    Button, Card,
    CardContent,
    CardHeader, CircularProgress,
    FormControl,
    FormGroup,
    InputAdornment,
    Skeleton,
    Stack,
    TextField, Typography
} from "@mui/material";
import GasMeterIcon from "@mui/icons-material/GasMeter";
import {useDispatch, useSelector} from "react-redux";
import {actionInputStyle} from "./TransferForm";
import {useEffect, useState} from "react";
import {loggedAccountAddressSelector} from "../../../data/actions/getAccountAddressAction";
import {tokenSymbolSelector} from "../../../data/actions/getTokenSymbolAction";
import changeOwner, {changeOwnerLoadingSelector} from "../../../data/actions/directTokenActions/makeChangeOwnerAction";
import changeOwnerEstimate, {changeOwnerGasPriceSelector} from "../../../data/actions/directTokenActions/getGasPriceForChangeOwnerAction";
import addNewEventLogData from "../../../data/actions/addNewEventLogAction";
import {isOwnerSelector} from "../../../data/actions/checkAccountIsOwnerAction";

export default function ChangeOwnerForm() {
    const dispatch = useDispatch()
    const style = actionInputStyle()

    const [valid, setIsValid] = useState(false);
    const [newOwnerAddress, setNewOwnerAddress] = useState("")

    const accountAddress: string = useSelector(loggedAccountAddressSelector);
    const tokenSymbol: string = useSelector(tokenSymbolSelector);
    // const error: null | string = useSelector(tokenErrorSelector);
    const error: null | string = null;
    const changeOwnerLoading: boolean = useSelector(changeOwnerLoadingSelector);
    const gasPrice: number = useSelector(changeOwnerGasPriceSelector);
    const isOwner: boolean = useSelector(isOwnerSelector)

    useEffect(() => {
        if (newOwnerAddress.startsWith("0x") && newOwnerAddress.length === 42 && isOwner) {
            setIsValid(true)
        } else {
            setIsValid(false)
        }
    }, [newOwnerAddress])

    function getGasPrice() {
        if (valid) {
            dispatch(changeOwnerEstimate({
                msgSender: accountAddress,
                newOwner: newOwnerAddress,
                toLog: (log) => dispatch(addNewEventLogData(log))
            }))
        }
    }

    function doChangeOwner() {
        if (valid) {
            dispatch(changeOwner({
                msgSender: accountAddress,
                newOwner: newOwnerAddress,
                toLog: (log) => dispatch(addNewEventLogData(log))
            }))
        }
    }

    return (
        <Card className={style.container}>
            <><CardHeader
                title={"Change Owner"}
                subheader={`Change owner of ${tokenSymbol} to new account, you might lose some of your permissions by this action (Set Revenue and Set Taxes)`}/>
                <CardContent>
                    <Stack direction={"column"} spacing={2}>
                        <FormControl
                            onKeyPress={(e) => {
                                if (e.key === "Enter" && valid) doChangeOwner()
                            }}
                        >
                            <FormGroup className={style.inputs}>
                                <TextField
                                    variant={"standard"} label={"New Owner"} placeholder={"0x0000000000000000000000000000000000000000"}
                                    rows={1} error={error !== null}
                                    onChange={event => setNewOwnerAddress(event.target.value)} required/>
                            </FormGroup>
                        </FormControl>

                        <Stack direction={"row"} spacing={2} justifyContent={"space-between"} alignItems={"center"}>
                            <div>
                                <Button size="small" variant={"text"} disabled={!valid} onClick={getGasPrice} startIcon={<GasMeterIcon/>}>Gas</Button>
                                {
                                    gasPrice < 0 ? <Skeleton/> : <Typography variant={"subtitle2"}>{gasPrice}</Typography>
                                }
                            </div>
                            <Button variant={"contained"} disabled={!valid} onClick={doChangeOwner}>Change Owner</Button>
                        </Stack>
                    </Stack>

                </CardContent></>
            {changeOwnerLoading ? <div className={style.loading}><CircularProgress/></div> : <></>}
        </Card>
    )
}