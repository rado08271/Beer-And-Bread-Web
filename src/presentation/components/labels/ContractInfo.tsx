import {Box, Divider, Skeleton, Stack, Tooltip, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import getMicroeconomicsOwner, {microeconomicsOwnerAddressSelector} from "../../../data/actions/getMicroeconimcsOwnerAddressAction";
import {contractAddressSelector} from "../../../data/actions/getContractByIdAction";
import {useEffect} from "react";

export default function ContractInfo () {
    const dispatch = useDispatch()

    const address = useSelector(contractAddressSelector)
    const owner = useSelector(microeconomicsOwnerAddressSelector)
    // const owner = ""

    useEffect(() => {
        dispatch(getMicroeconomicsOwner({}))
    }, [])

    return (
        <Stack
            direction={"row"}
            alignItems={"flex-end"}
            justifyContent={"flex-end"}
            spacing={2}
            divider={<Divider orientation="vertical" flexItem />}
        >
            <Tooltip title={address}>
                <div>
                    <Typography noWrap variant="caption">Contract address</Typography>
                    {address === ""
                        ? <Skeleton variant="rectangular"/>
                        : <Typography noWrap variant="body1">
                            {address.slice(0,5) + "..." + address.slice(address.length - 5,address.length)}
                        </Typography>}
                </div>
            </Tooltip>

            <Tooltip title={owner}>
                <div>
                    <Typography noWrap variant="caption">Owner</Typography>
                    {owner === ""
                        ? <Skeleton/>
                        : <Typography noWrap variant="body1">
                            {owner.slice(0,5) + "..." + owner.slice(owner.length - 5,owner.length)}
                          </Typography>}
                </div>
            </Tooltip>
        </Stack>
    )
}