import React, {useEffect, useState} from "react";
import {createTheme} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {Link, useNavigate, useParams} from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Cards from "../../../../shared/component/reusableCard/Cards";
import DashboardLayout from "../../../../style/DashboardLayout";
import EventList from "../event/eventList";
import MainCard from "./skafosCard/SkafosMainCard";
import useMediaQuery from "@mui/material/useMediaQuery";
import customTheme from "../../../../style/responsiveTheme/customTheme";
import {VSphereApi} from "../../../../service/vsphereApi";
import {SkafosGetResponse} from "../../../../model/vsphere/vsphere/skafos";
import DetailCard from "./skafosCard/skafosDetails/DetailsCard";
import AnimatedContainer from "../../../../style/Animation";
import "../overview/skafos.css";
import {SkafosApi} from "../../../../service/skafosApi";

function Skafos() {
    const [hasSkafos, setHasSkafos] = useState<boolean>(false);
    const [data, setData] = useState<SkafosGetResponse>();
    const navigate = useNavigate();

    let {namespace, name, provider} = useParams();
    if (namespace === undefined || name === undefined || provider === undefined) {
        navigate("/error");
    }

    useEffect(() => {
        SkafosApi.getSkafos(namespace!, name!, provider!)
            .then((result) => setData(result))
            .catch((err) => console.log(err));

    }, [namespace, name, provider]);

    const theme = createTheme(customTheme);

    const isXLargeScreen = useMediaQuery(theme.breakpoints.up("xl"));

    useEffect(() => {
        const savedSkafos: boolean = true;
        setHasSkafos(savedSkafos);
    }, []);

    return (
        <AnimatedContainer>
            <DashboardLayout>
                <Container disableGutters>
                    <Grid
                        container
                        spacing={isXLargeScreen ? 3 : 8}
                        paddingTop={3}
                        className="main-grid"
                    >
                        <Grid item xs={12}>
                            {hasSkafos ? (
                                <Container className="skafos-container" disableGutters>
                                    <Grid container spacing={5} justifyContent="center">
                                        <Grid item xs={12} sm={12} md={12} lg={4} xl={4} xxl={2}>
                                            <Box className="detail-box">
                                                <DetailCard
                                                    title="Details"
                                                    data={{
                                                        Name: data?.name,
                                                        Namespace: data?.namespace,
                                                        Provider: data?.provider,
                                                        Version: data?.controlPlane.kubernetesVersion,
                                                    }}
                                                />
                                            </Box>
                                        </Grid>

                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={8}
                                            xl={8}
                                            xxl={8}
                                            className="second-grid"
                                            style={{display: "flex", justifyContent: "center"}}
                                        >
                                            <Box className="cards-box">
                                                {namespace && name && (
                                                    <Cards
                                                        skafosNamespace={namespace}
                                                        skafosName={name}
                                                    />
                                                )}
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} xxl={10}>
                                            <Box className="main-card-box">
                                                <MainCard
                                                    namespace={namespace!}
                                                    name={name!}
                                                    data={data!}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} xxl={10}>
                                            <Box className="event-list-box">
                                                <EventList name={name!} namespace={namespace!}/>{" "}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Container>
                            ) : (
                                <Button
                                    component={Link}
                                    to="/skafos/create"
                                    variant="outlined"
                                    color="primary"
                                    size="large"
                                    endIcon={<AddIcon/>}
                                >
                                    Add New Skafos
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </Container>
            </DashboardLayout>
        </AnimatedContainer>
    );
}

export default Skafos;
