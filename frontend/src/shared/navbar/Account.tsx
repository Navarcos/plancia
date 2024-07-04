import React, {useState} from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import "../../i18n.ts";
import {t} from "i18next";
import {capitalize, MenuList, Typography, useMediaQuery} from "@mui/material";
import {useKeycloak} from "@react-keycloak/web";
import {Config} from "../../config";


interface AccountProps {
    accountMenuOpen: () => void;
    isLoggedIn: boolean;
}

const Account: React.FC<AccountProps> = ({accountMenuOpen, isLoggedIn}) => {
    const isSmallScreen = useMediaQuery("(max-width:600px)");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const {keycloak, initialized} = useKeycloak();
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        accountMenuOpen();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    let accountUrl =
        Config.keycloakUrl + "/realms/" +
        Config.keycloakRealm + "/account?referrer=" +
        Config.keycloakClientId + "&referrer_uri=" +
        window.location.href;
    return (
        <>
            {" "}
            {!isSmallScreen && <Typography> {keycloak.tokenParsed?.name}</Typography>}
            <IconButton
                color="inherit"
                onClick={handleClick}
                aria-controls="account-menu"
                aria-haspopup="true"
            >
                <Badge color="primary">
                    <PersonOutlineIcon/>
                </Badge>
            </IconButton>
            <Menu
                id="account-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuList>
                    <MenuItem>
                        <a
                            style={{textDecoration: "none", color: "inherit"}}
                            href={accountUrl}
                        >
                            Account
                        </a>
                    </MenuItem>
                    <MenuItem onClick={() => keycloak.logout()}>
                        {capitalize(t("logout", {settings: "logout"}))}
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    );
};

export default Account;
