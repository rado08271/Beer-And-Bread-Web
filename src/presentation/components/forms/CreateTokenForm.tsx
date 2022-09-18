import {
    Button,
    CardActions,
    CardContent,
    Dialog, DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    FormGroup,
    Stack,
    TextField, Typography
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {polygonDataSelector} from "../../../data/actions/addPolygonDataAction";
import createToken, {createTokenLoadingSelector} from "../../../data/actions/createTokenAction";
import addNewDeployLogData, {deployLogsSelector} from "../../../data/actions/addNewDeployLogAction";
import loggedUserAddress, {loggedAccountAddressSelector} from "../../../data/actions/getAccountAddressAction";
import {makeStyles} from "@material-ui/core";

const tokenFormStyle = makeStyles((theme) => ({
    error: {
        color: theme.palette.error.main
    },
    success: {
        color: theme.palette.success.main
    }
}))

export default function CreateTokenForm() {
    const dispatch = useDispatch()
    const style = tokenFormStyle()

    const [valid, setValid] = useState(false)
    const [tokenName, setTokenName] = useState("")
    const [tokenSymbol, setTokenSymbol] = useState("")
    const [open, setOpen] = useState(true)
    const [isLogError, setIsLogError] = useState<boolean | null>(null)

    const polygonData = useSelector(polygonDataSelector)
    const createTokenLoading = useSelector(createTokenLoadingSelector)
    const accountAddress = useSelector(loggedAccountAddressSelector)
    const logger = useSelector(deployLogsSelector)

    useEffect(() => {
        dispatch(loggedUserAddress())
    }, [dispatch])

    function createNewCurrency() {
        if (valid) {
            dispatch(createToken({
                msgSender: accountAddress,
                tokenName: tokenName,
                tokenSymbol: tokenSymbol,
                polygons: polygonData,
                onLog: (log) => {
                    dispatch(addNewDeployLogData(log))
                }
            }))
        }
    }

    useEffect(() => {
        if (tokenName.length > 0 && tokenSymbol.length > 0 && tokenSymbol.length < 6 && !tokenName.includes(' ') &&
            tokenName !== "IBAB" && !tokenSymbol.includes(' ') && polygonData.length > 3 && accountAddress.length === 42) {
            setValid(true)
        } else {
            setValid(false)
        }
    }, [tokenName, tokenSymbol, polygonData])

    useEffect(() => {
        if (logger !== undefined){
            if (logger.filter(value => value.logMessage.includes("deployerror")).length > 0) {setIsLogError(true)}
            else if (logger.filter(value => value.logMessage.includes("deploysuccess")).length > 0) {setIsLogError(false)}
            else {
                if (isLogError === null) setIsLogError(null)
            }
        }
    }, [logger])

    return (
        <div>
            <CardContent>
                <FormGroup>
                    <Stack direction={"row"} justifyContent={"space-evenly"}>
                        <TextField
                            variant={"standard"} label={"Set Token Name"} placeholder={"BeerAndBread"} rows={1}
                            onChange={event => setTokenName(event.target.value)} required/>

                        <TextField
                            variant={"standard"} label={"Set Token Symbol"} placeholder={"B&B"} rows={1}
                            onChange={event => setTokenSymbol(event.target.value)} required/>

                    </Stack>
                </FormGroup>
            </CardContent>
            <CardActions>
                <Button fullWidth disabled={!valid || createTokenLoading} onClick={createNewCurrency}>Deploy</Button>
            </CardActions>
            <Stack direction={"row"} spacing={2} justifyContent={"center"} alignItems={"center"}>
                {isLogError === null || !open ? <></> :
                    isLogError
                        ? <Typography align={"center"} variant={"overline"} className={style.error}>An error occurred refer to logger</Typography>
                        // : <Typography align={"center"} variant={"overline"} className={style.success}>Successfully deployed new contract, your currency is ready, you are the owner! start by finding new residents to join</Typography>
                        : <Dialog open={(!isLogError) && open} onClose={() => setOpen(false)}>
                            <DialogTitle>Contract deployed</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Successfully deployed new contract, your currency is ready, you are the owner! start by finding new residents to join
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpen(false)}>Close</Button>
                            </DialogActions>
                        </Dialog>
                }
            </Stack>
        </div>

    )
}