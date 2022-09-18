import {Card, CardContent, CardMedia, Container, Grid, Stack, Typography} from "@mui/material";
import Contract from "../../../domain/entity/contractDto";
import MapPlaceholderEditor from "../map/MapPlaceholderEditor";
import PointDTO from "../../../domain/entity/contractDto/PointDTO";

interface Props {
    contract: Contract
    areasNotThis?: PointDTO[][]
}

export default function TokenItem(props: Props) {
    return (
        <Card>
            <CardMedia>
                <>
                    <MapPlaceholderEditor
                        polygon={props.contract.deployData.token.area}
                        otherPolygons={props.areasNotThis}
                        interactive={false}
                        centerPolygon={true}
                    />
                </>
            </CardMedia>
            <CardContent>
                <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
                    <Typography align={"center"} variant={"subtitle1"}>
                        {props.contract.deployData.token.name}
                    </Typography>
                    <Typography align={"center"} variant={"subtitle1"}>
                        {props.contract.deployData.token.symbol}
                    </Typography>

                </Stack>
                <Stack alignSelf={"center"}>
                    <Typography align={"center"} variant={"caption"}>
                        {props.contract.contractAccount}
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    )
}