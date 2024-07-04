import React from "react";
import {SkafosGetResponse} from "../../../../../model/vsphere/vsphere/skafos";
import {Box, Container, Paper} from "@mui/material";
import Grid from "@mui/material/Grid";
import SkafosControlPlane from "./controlPlane/ControlPlaneCard";
import MachineDeploymentsCard from "./machineDeployments/machineCard/MachineDeploymentsCard";
import formatControlPlaneStatus from "./status/ControlPlaneStatus";
import formatDeploymentStatus from "./status/MachineDeploymentsStatus";
import "./skafos-info-card.css";

const MainCard: React.FC<{
    namespace: string;
    name: string;
    data: SkafosGetResponse;
}> = ({namespace, name, data}) => {

    if (!data) {
        return <Box>Loading ...</Box>;
    }

    return (
        <Container className="container" disableGutters>
            <Grid container spacing={3} className="grid-container">
                <Grid item xs={12}>
                    <Paper>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12} md={6}>
                                <SkafosControlPlane
                                    title="Control Plane"
                                    data={{
                                        Name: data.controlPlane.name,
                                        status: formatControlPlaneStatus(data.controlPlane.status),
                                    }}
                                    namespace={namespace}
                                    skafosName={name}
                                    nodes={data.controlPlane.nodes}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6}>
                                <MachineDeploymentsCard
                                    deployments={data.machineDeployments.map((md) => ({
                                        namespace: namespace,
                                        name: md.name,
                                        nodes: md.nodes,
                                        status: formatDeploymentStatus(md.status),
                                    }))}

                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};
export default MainCard;
