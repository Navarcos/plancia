import React from "react";
import {Box, Grid, Typography} from "@mui/material";
import "./control-plane.css";
import WidgetsIcon from "@mui/icons-material/Widgets";
import SpokeIcon from "@mui/icons-material/Spoke";
import SourceIcon from "@mui/icons-material/Source";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import ActionButtonMaster from "../../../../../../shared/component/actionButton/actionButtons/ActionButtonMaster";
import AnimatedContainer from "../../../../../../style/Animation";
import {CustomTypography} from "../../../../../../style/font/CustomTypography";

export interface DataItem {
    key: string;
    value: string | DataItem[];
}

export interface NewCardProps {
    title?: string;
    data?: {
        [key: string]: string | DataItem[] | undefined;
    };
    skafosName: string;
    namespace: string;
    nodes: number;
}

const getIconByDataKey = (key: string) => {
    switch (key) {
        case "Machine Template":
            return <SpokeIcon className="cp-icons"/>;
        case "Resource Pool":
            return <SourceIcon className="cp-icons"/>;
        case "status":
            return <TroubleshootIcon className="cp-icons"/>;
        default:
            return <WidgetsIcon className="cp-icons"/>;
    }
};

const renderDataItem = (item: DataItem, level: number = 0) => (
    <Box key={item.key} className="control-data-item" sx={{pl: level * 2}}>
        <Typography variant="body2" color="textPrimary">
            <strong>{item.key}:</strong>{" "}
            {typeof item.value === "string" ? item.value : ""}
        </Typography>
        {Array.isArray(item.value) &&
            item.value.map((nestedItem) => renderDataItem(nestedItem, level + 1))}
    </Box>
);

const SkafosControlPlane: React.FC<NewCardProps> = ({
                                                        title,
                                                        data,
                                                        skafosName,
                                                        namespace,
                                                        nodes,
                                                    }) => {
    return (
        <AnimatedContainer>
            <Box className="control-card-content" sx={{width: "auto"}}>
                <Box display="flex" className="control-title-box">
                    <CustomTypography variant="h6" color="textPrimary" gutterBottom>
                        {title}
                    </CustomTypography>
                    <ActionButtonMaster
                        namespace={namespace}
                        name={skafosName}
                        nodes={nodes}
                    />
                </Box>

                <Grid container spacing={2}>
                    {Object.entries(data!).map(([key, value]) => (
                        <React.Fragment key={key}>
                            <Grid item xs={12} sm={4}>
                                <Box className="control-data-item">
                                    <Typography
                                        variant="body1"
                                        fontWeight="bold"
                                        className="control-item-title"
                                    >
                                        {getIconByDataKey(key)}
                                        <span>{key}:</span>
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                {Array.isArray(value) ? (
                                    value.map((item, index) => renderDataItem(item, 1))
                                ) : (
                                    <Box className="control-data-item">
                                        <Typography variant="body2" color="textPrimary">
                                            {value}
                                        </Typography>
                                    </Box>
                                )}
                            </Grid>
                        </React.Fragment>
                    ))}
                </Grid>
            </Box>
        </AnimatedContainer>
    );
};

export default SkafosControlPlane;
