import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function DeleteDialog({openExt, onClose}: { openExt: boolean, onClose: () => void }) {
    const [open, setOpen] = React.useState(openExt);

    React.useEffect(() => {
        setOpen(openExt);
    }, [openExt]);

    const handleClose = () => {
        setOpen(false);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                component: 'form',
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries((formData as any).entries());
                    const skafos = formJson.skafos;
                    console.log(skafos);
                    handleClose();
                },
            }}
        >
            <DialogTitle>Delete skafos</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Rimuovere lo skafos eliminerà tutti i dati e tutte le risorse a lui collegate.
                    <br/>
                    Scrivere il nome dello skafos (NOME_SKAFOS) per confermare la scelta:
                </DialogContentText>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="skafos"
                    name="skafos"
                    label="Skafos name"
                    type="text"
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
                <Button color="error" type="submit">Delete</Button>
            </DialogActions>
        </Dialog>
    );
}
