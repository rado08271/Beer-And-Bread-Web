import {
    Button,
    Card,
    CardMedia,
    Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Modal, Stack, TextField,
} from "@mui/material";
import CreateTokenForm from "../../components/forms/CreateTokenForm";
import DeployLogger from "../../components/layout/DeployLogger";
import {useDispatch, useSelector} from "react-redux";
import MapPlaceholderEditor from "../../components/map/MapPlaceholderEditor";
import addPolygonData from "../../../data/actions/addPolygonDataAction";
import getAllContracts, {
    allContractAreasSelector
} from "../../../data/actions/getAllContractsAction";
import {useEffect} from "react";

export default function DefineNewCurrency() {
    const dispatch = useDispatch()
    const otherAreas = useSelector(allContractAreasSelector)

    useEffect(() => {
        dispatch(getAllContracts())
    })

    return (
        <Container>
            <Stack direction={"column"} spacing={2} >
                <Card>
                    <CardMedia>
                        <MapPlaceholderEditor
                            polygon={[]}
                            interactive={true}
                            onPolygonAdded={polygon => {
                                if (polygon !== null) {
                                    dispatch(addPolygonData(polygon))
                                }
                            }}
                            otherPolygons={otherAreas}
                            positionType={"PERSIST"}
                        />
                    </CardMedia>
                    <CreateTokenForm/>
                </Card>
                <DeployLogger/>
            </Stack>
        </Container>

    )
}