import {useDispatch, useSelector} from "react-redux";
import {actionInputStyle} from "./TransferForm";
import {useEffect, useState} from "react";
import {loggedAccountAddressSelector} from "../../../data/actions/getAccountAddressAction";
import {tokenSymbolSelector} from "../../../data/actions/getTokenSymbolAction";
import {stakeLoadingSelector} from "../../../data/actions/directTokenActions/makeStakeFundsAction";
import {stakeGasPriceSelector} from "../../../data/actions/directTokenActions/getGasPriceForStakeAction";
import {
    Button,
    Card,
    CardContent,
    CardHeader, CircularProgress,
    FormControl,
    FormGroup, Grid,
    InputAdornment, Skeleton,
    Stack,
    TextField, Typography
} from "@mui/material";
import GasMeterIcon from "@mui/icons-material/GasMeter";
import setTaxesEstimate, {setTaxesGasPriceSelector} from "../../../data/actions/directTokenActions/getGasPriceForSetTaxAction";
import setTaxes, {setTaxLoadingSelector} from "../../../data/actions/directTokenActions/makeSetTaxAction";
import {stagnationTaxesSelector, taxesSelector} from "../../../data/actions/getTaxesAction";
import {TaxesData} from "../../../domain/entity/model/TaxesData";
import addNewEventLogData from "../../../data/actions/addNewEventLogAction";
import {isOwnerSelector} from "../../../data/actions/checkAccountIsOwnerAction";

export default function SetTaxesForm() {
    const dispatch = useDispatch()
    const style = actionInputStyle()

    const [valid, setIsValid] = useState(false);
    const [currentTaxes, setCurrentTaxes] = useState<TaxesData>({
        entryTax: 0, stagnationTax: 0, withdrawalTax: 0, transactionTax: 0
    });

    const previousTaxes = useSelector(taxesSelector)
    const accountAddress: string = useSelector(loggedAccountAddressSelector);
    const tokenSymbol: string = useSelector(tokenSymbolSelector);
    // const error: null | string = useSelector(tokenErrorSelector);
    const error: null | string = null;
    const setTaxLoading: boolean = useSelector(setTaxLoadingSelector);
    const gasPrice: number = useSelector(setTaxesGasPriceSelector);
    const isOwner: boolean = useSelector(isOwnerSelector)

    useEffect(() => {
        if (
            (!isNaN(currentTaxes.entryTax) && currentTaxes.entryTax >= 0 && currentTaxes.entryTax <= 100) &&
            (!isNaN(currentTaxes.transactionTax) && currentTaxes.transactionTax >= 0 && currentTaxes.transactionTax <= 100) &&
            (!isNaN(currentTaxes.withdrawalTax) && currentTaxes.withdrawalTax >= 0 && currentTaxes.withdrawalTax <= 100) &&
            (!isNaN(currentTaxes.stagnationTax) && currentTaxes.stagnationTax >= 0 && currentTaxes.stagnationTax <= 100) &&
            currentTaxes.entryTax + currentTaxes.transactionTax + currentTaxes.withdrawalTax + currentTaxes.stagnationTax <= 100 && isOwner
        ) {
            setIsValid(true)
        } else {
            setIsValid(false)
        }
    }, [currentTaxes])

    useEffect(() => {
        if (previousTaxes) {
            setCurrentTaxes({
                entryTax: previousTaxes.entryTax !== -1  ?  previousTaxes.entryTax : 0,
                stagnationTax: previousTaxes.stagnationTax !== -1 ? previousTaxes.stagnationTax : 0,
                withdrawalTax: previousTaxes.withdrawalTax !== -1 ? previousTaxes.withdrawalTax : 0,
                transactionTax: previousTaxes.transactionTax !== -1 ? previousTaxes.transactionTax : 0
            })
        }
    }, [previousTaxes])

    useEffect(() => {
    }, [setTaxLoading])

    function getGasPrice() {
        if (valid) {
            dispatch(setTaxesEstimate ({
                msgSender: accountAddress,
                taxes: currentTaxes,
                toLog: (log) => dispatch(addNewEventLogData(log))
            }))
        }
    }

    function doSetTaxes() {
        if (valid) {
            dispatch(setTaxes ({
                msgSender: accountAddress,
                taxes: currentTaxes,
                toLog: (log) => dispatch(addNewEventLogData(log))
            }))
        }
    }

    return (
        <Card className={style.container}>
            <><CardHeader
                title={"Set Taxes"}
                subheader={`Set taxes of ${tokenSymbol}, they are directly affecting funds transferred, deposited and withdrawn. Stagnation tax affect accounts that stagnates for more than 3 years`}/>
                <CardContent>
                    <Stack direction={"column"} spacing={2}>
                        <FormControl
                            onKeyPress={(e) => {
                                if (e.key === "Enter" && valid) doSetTaxes()
                            }}
                        >
                            <FormGroup>
                                <Grid container spacing={2}>
                                    <Grid item md={3}>
                                        <TextField
                                            type={"number"} variant={"standard"} label={"Transfer Tax"} placeholder={"10"}
                                            value={currentTaxes.transactionTax}
                                            rows={1} error={error !== null}
                                            onChange={event => setCurrentTaxes({...currentTaxes, transactionTax: parseInt(event.target.value)})} required
                                            InputProps={{startAdornment: <InputAdornment position="start" disablePointerEvents>%</InputAdornment>}}/>
                                    </Grid>
                                    <Grid item md={3}>
                                        <TextField
                                            type={"number"} variant={"standard"} label={"Deposit Tax"} placeholder={"10"}
                                            value={currentTaxes.entryTax}
                                            rows={1} error={error !== null}
                                            onChange={event => setCurrentTaxes({...currentTaxes, entryTax: parseInt(event.target.value)})} required
                                            InputProps={{startAdornment: <InputAdornment position="start" disablePointerEvents>%</InputAdornment>}}/>
                                    </Grid>
                                    <Grid item md={3}>
                                        <TextField
                                            type={"number"} variant={"standard"} label={"Withdrawal Tax"} placeholder={"10"}
                                            value={currentTaxes.withdrawalTax}
                                            rows={1} error={error !== null}
                                            onChange={event => setCurrentTaxes({...currentTaxes, withdrawalTax: parseInt(event.target.value)})} required
                                            InputProps={{startAdornment: <InputAdornment position="start" disablePointerEvents>%</InputAdornment>}}/>
                                    </Grid>
                                    <Grid item md={3}>
                                        <TextField
                                            type={"number"} variant={"standard"} label={"Stagnation Tax"} placeholder={"10"}
                                            value={currentTaxes.stagnationTax}
                                            rows={1} error={error !== null}
                                            onChange={event => setCurrentTaxes({...currentTaxes, stagnationTax: parseInt(event.target.value)})} required
                                            InputProps={{startAdornment: <InputAdornment position="start" disablePointerEvents>%</InputAdornment>}}/>
                                    </Grid>
                                </Grid>
                            </FormGroup>
                        </FormControl>

                        <Stack direction={"row"} spacing={2} justifyContent={"space-between"} alignItems={"center"}>
                            <div>
                                <Button size="small" variant={"text"} disabled={!valid} onClick={getGasPrice} startIcon={<GasMeterIcon/>}>Gas</Button>
                                {
                                    gasPrice < 0 ? <Skeleton/> : <Typography variant={"subtitle2"}>{gasPrice}</Typography>
                                }
                            </div>
                            <Button variant={"contained"} disabled={!valid} onClick={doSetTaxes}>Set Taxes</Button>
                        </Stack>
                    </Stack>

                </CardContent></>
            {setTaxLoading ? <div className={style.loading}><CircularProgress/></div> : <></>}

        </Card>
    )

}