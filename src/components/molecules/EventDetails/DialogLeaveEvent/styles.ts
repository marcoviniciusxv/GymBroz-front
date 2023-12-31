import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
    dialogCustom: {
        '& .css-1t1j96h-MuiPaper-root-MuiDialog-paper': {
            // border: '2.5px solid #000 ',
            background: 'white',
            borderRadius: 0
        },
    },
    dialogContent: {
        padding: '30px 40px 0px !important',
        width: '400px',
        height: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textDialog: {
        color: '#07142B',
        textAlign: 'center',
        fontFamily: 'Crimson Text',
        fontWeight: 400,
        lineHeight: 'normal',
    },
    btnDialogLeave: {
        width: '130px !important',
        padding: '5px 15px !important',
        fontSize: '12px !important',
        backgroundColor: '#EF233C !important',
        color: 'white !important',
        marginLeft: '1.0rem !important',
        marginTop: '1.1rem !important',
        '&:hover': {
            backgroundColor: '#EF233C !important'
        }
    },
    btnDialogCancel: {
        width: '130px !important',
        padding: '5px 15px !important',
        fontSize: '12px !important',
        borderColor: '#EF233C !important',
        color: '#EF233C !important',
        marginTop: '1.1rem !important',
        '&:hover': {
        }
    },
}));