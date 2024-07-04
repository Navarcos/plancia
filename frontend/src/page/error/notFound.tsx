import {Container} from "@mui/material";
import Typography from "@mui/material/Typography";


export const NotFoundPage = () => {
    return (
        <Container
            style={{
                height: "auto",
                margin: "0vh",
                paddingTop: "1vh",
                paddingBottom: "5vh",
                paddingLeft: "5vh",
                paddingRight: "10vh",
                backgroundColor: "#f5f5f5",
            }}
            maxWidth={false}
        >
            <Typography variant="h2">Page Not Found!</Typography>
        </Container>
    )
}