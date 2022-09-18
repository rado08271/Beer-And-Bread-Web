import AddLocationIcon from '@mui/icons-material/AddLocation';
import PolylineIcon from '@mui/icons-material/Polyline';
import DeleteIcon from '@mui/icons-material/Delete';
import {Box, Button, ButtonGroup, Card, CardContent, Container, Divider, Paper, Stack} from "@mui/material";
import {DrawPointMode, DrawPolygonMode, EditingMode} from "react-map-gl-draw";
import {useEffect, useState} from "react";
import {Add} from "@mui/icons-material";

interface Props {
    onMarkerClick?: () => void
    onPolygonClick?: () => void
    onDeleteClick?: () => void
    getTool: (tool: (DrawPolygonMode | DrawPointMode | EditingMode), toolString: "POLYGON" | "POINT" | "EDIT") => void
    toolChanged: (DrawPolygonMode | DrawPointMode | EditingMode | undefined)
    disabledPolygon?: boolean
    disabledPoint?: boolean
}

export default function EditControlPanel(props: Props) {
    const [usingTool, changeToNewTool] = useState<DrawPolygonMode | DrawPointMode | EditingMode | undefined>()

    return (
        <Container style={{position: "absolute", display:"flex", top: 50}}>
            <Paper>
                <ButtonGroup orientation={"vertical"} color={"inherit"}>
                    <Button disabled={props.disabledPoint !== undefined && props.disabledPoint}
                            variant={ (usingTool !== undefined && usingTool instanceof DrawPointMode)  ? "contained" : "text"} size={"small"} onClick={() => {
                        if (props.onMarkerClick) props.onMarkerClick()
                        changeToNewTool(new DrawPointMode())
                        props.getTool(new DrawPointMode(), "POINT")
                    }}><AddLocationIcon/></Button>

                    <Button disabled={props.disabledPolygon !== undefined && props.disabledPolygon}
                            variant={ (usingTool !== undefined && usingTool instanceof DrawPolygonMode) ? "contained" : "text"} size={"small"} onClick={() => {
                        if (props.onPolygonClick) props.onPolygonClick()
                        changeToNewTool(new DrawPolygonMode())
                        props.getTool(new DrawPolygonMode(), "POLYGON")
                    }}><PolylineIcon/></Button>

                    <Button variant={ (usingTool !== undefined && usingTool instanceof EditingMode) ? "contained" : "text"} size={"small"} onClick={() => {
                        if (props.onDeleteClick) props.onDeleteClick()
                        changeToNewTool(new EditingMode())
                        props.getTool(new EditingMode(), "EDIT")
                    }}><DeleteIcon/></Button>
                </ButtonGroup>
            </Paper>
        </Container>
    )
}