import { Box, Divider, Fade, IconButton, List, ListItem, ListItemAvatar, ListItemText, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import { EventByIdDTO } from "../../../models/Events";
import LogoutIcon from "@mui/icons-material/Logout";
import InputIcon from "@mui/icons-material/Input";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PublicIcon from "@mui/icons-material/Public";
import PublicOffIcon from "@mui/icons-material/PublicOff";
import ModalGeneric from "../../atoms/ModalGeneric";
import moment from "moment";
import { useEffect, useState } from "react";
import { useBackdrop } from "../../../hooks/backdrop";
import axios from "axios";
import Avatar from '@mui/material/Avatar';
import { useStyles } from "./styles";
import { getEventParticipants, getEventsById, joinEvent } from "../../../services/events.service";
import { useFeedback } from "../../../hooks/addFeedback";
import DialogDeleteEvent from "./DialogDelete";
import DialogEnterEvent from "./DialogEnterEvent";
import DialogLaveEvent from "./DialogLeaveEvent";
import React from "react";
import theme from "../../../theme";

interface EventDeatailsProps {
    open: boolean;
    handleClose: () => void;
    handleOpen?: () => void;
    id: number;
}

export interface EventParticipantsDTO {
    participants: Participant[]
    admin: Admin
}

export interface Participant {
    id: number
    email: string
    firstName: string
    lastName: string
    profilePictureUrl: string
    profilePicturePath: string
    isAdmin: boolean
    isActive: boolean
    isEmailConfirmed: boolean
}

export interface Admin {
    id: number
    email: string
    firstName: string
    lastName: string
    profilePictureUrl: string
    profilePicturePath: string
    isAdmin: boolean
    isActive: boolean
    isEmailConfirmed: boolean
}

interface Address {
    road: string;
    suburb: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
}

const EventDeatails: React.FC<EventDeatailsProps> = ({ open, handleClose, id }) => {
    const [address, setAddress] = useState<string>();
    const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
    const [openDialogDelete, setOpenDialogDelete] = useState(false);
    const [openDialogEnter, setOpenDialogEnter] = useState(false);
    const [loadingCard, setLoadingCard] = useState(true);
    const [eventById, setEventById] = useState<EventByIdDTO>();
    const [EventParticipants, setEventParticipants] = useState<EventParticipantsDTO>({} as EventParticipantsDTO)

    const classes = useStyles();
    const { handleBackdrop } = useBackdrop();
    const { addFedback } = useFeedback();

    const handleDeleteConfirm = () => {
        setOpenDialogDelete(true);
    };

    const handleDeleteConfirmClose = () => {
        setOpenDialogDelete(false);
    };

    const handleOpenLeaveDialog = () => {
        setOpenLeaveDialog(true);
    };

    const handleCloseLeaveDialog = () => {
        setOpenLeaveDialog(false);
    };

    const handleOpenEnterDialog = () => {
        setOpenDialogEnter(true);
    };

    const handleCloseEnterDialog = () => {
        setOpenDialogEnter(false);
    };

    async function reverseGeocode(
        latitude: number,
        longitude: number
    ): Promise<string> {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

        try {
            const response = await axios.get(url);
            const address: Address = response.data.address;
            setLoadingCard(false)
            return `${address.road}, ${address.suburb}, ${address.city} - ${address.state}, ${address.country}`;
        } catch (error) {
            console.error(error);
            handleClose()
            return "";
        }
    }

    useEffect(() => {
        setLoadingCard(true);

        getEventsById(id)
            .then((res) => {
                setEventById(res?.data!);
            })
            .catch((err) => {
                addFedback({
                    description: `Erro ao carregar os detalhes do evento`,
                    typeMessage: "error",
                });
            })

        getEventParticipants(id)
            .then((res) => {
                setEventParticipants(res.data)
            }).catch((err => {
                addFedback({
                    description: `Erro ao carregar os participantes do evento`,
                    typeMessage: "error",
                });
            }))
    }, [])

    useEffect(() => {
        if (eventById) {
            reverseGeocode(eventById.event.geocode[0], eventById.event.geocode[1])
                .then((res) => {
                    setAddress(res);
                    handleBackdrop(false);
                })
                .catch((err) => {
                    handleBackdrop(false);
                });
        }
    }, [eventById]);


    return (
        <>
            <ModalGeneric title="Detalhes" open={open} handleClose={handleClose} customMargin="27px">
                {loadingCard ? (
                    <>
                        <Stack width='100%' justifyContent='center' alignItems='center'>
                            <Skeleton variant="text" width={220} sx={{ fontSize: "2.3rem" }} />
                            <Skeleton variant="circular" width='40px' height='40px' sx={{ marginTop: '30px' }} />
                            <Skeleton variant="text" width='100%' sx={{ fontSize: "18px", marginTop: '30px' }} />
                            <Skeleton variant="text" width='100%' sx={{ fontSize: "18px" }} />
                            <Skeleton variant="text" width='100%' sx={{ fontSize: "18px" }} />
                            <Skeleton variant="text" width='100%' sx={{ fontSize: "20px", marginTop: '30px' }} />
                            <Skeleton variant="text" width='100%' sx={{ fontSize: "20px" }} />
                            <Skeleton variant="text" width='100%' sx={{ fontSize: "20px" }} />
                            <Skeleton variant="text" width='100%' sx={{ fontSize: "20px" }} />
                            <Skeleton variant="text" width='100%' sx={{ fontSize: "20px" }} />
                        </Stack>
                    </>
                ) :
                    (
                        <>
                            <Typography variant="h4" sx={{ mb: 3 }} className={classes.titleEvent}>
                                {eventById?.event.title}
                            </Typography>
                            <Typography sx={{ mb: 3, }}>
                                {eventById?.event.isPublic ? (
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
                                        <PublicIcon />
                                    </Box>
                                ) : (
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
                                        <PublicOffIcon />
                                    </Box>
                                )}
                            </Typography>

                            <Typography sx={{ mb: 1 }} className={classes.textAddress}>Local: {address}</Typography>

                            <Typography sx={{ mb: 3 }} className={classes.textDate}>
                                {moment(eventById?.event.eventDate).format("DD [de] MMMM [de] YYYY")}{", "}
                                {moment(eventById?.event.eventDate).format("HH:mm")}
                            </Typography>

                            <Typography variant="body1" className={classes.textDescription}>
                                {eventById?.event.description}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', height: '265px', overflowY: 'scroll', mb: 3 }}>
                                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                    <ListItem alignItems="flex-start" >
                                        <ListItemAvatar>
                                            <Avatar sx={{ border: `3px solid ${theme.palette.secondary.light}` }} alt="Remy Sharp" src={EventParticipants.admin.profilePictureUrl} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${EventParticipants?.admin.firstName} ${EventParticipants?.admin.lastName}`}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        sx={{
                                                            display: 'inline',
                                                            color: theme.palette.secondary.light,
                                                        }}
                                                        component="span"
                                                        variant="body2"
                                                    >
                                                        Administrador
                                                    </Typography>

                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                    {
                                        EventParticipants.participants.length !== 0 ? EventParticipants.participants.map((participant, index) => {
                                            return (
                                                <>
                                                    <ListItem alignItems="flex-start" key={index}>
                                                        <ListItemAvatar>
                                                            <Avatar alt="Remy Sharp" src={participant.profilePictureUrl} />
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={`${participant.firstName} ${participant.lastName} `}
                                                            secondary={
                                                                <React.Fragment>
                                                                    <Typography
                                                                        sx={{ display: 'inline' }}
                                                                        component="span"
                                                                        variant="body2"
                                                                        color="text.primary"
                                                                    >
                                                                        Participante
                                                                    </Typography>

                                                                </React.Fragment>
                                                            }
                                                        />
                                                    </ListItem>
                                                    <Divider variant="inset" component="li" />
                                                </>
                                            )
                                        }) :
                                            <Typography>
                                                Ainda não há participantes
                                            </Typography>
                                    }
                                </List>
                            </Box>
                            {eventById?.isAdmin ? (
                                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Tooltip
                                        title="Deletar"
                                        placement="top"
                                        arrow
                                        TransitionComponent={Fade}
                                        TransitionProps={{ timeout: 400 }}
                                    >
                                        <IconButton
                                            aria-label="delete"
                                            size="large"
                                            onClick={() => {
                                                handleDeleteConfirm();
                                            }}
                                            className={classes.btnDelete}
                                        >
                                            <DeleteIcon fontSize="inherit" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip
                                        title="Editar"
                                        placement="top"
                                        arrow
                                        TransitionComponent={Fade}
                                        TransitionProps={{ timeout: 400 }}
                                    >
                                        <IconButton
                                            aria-label="edit"
                                            size="large"
                                            className={classes.btnEdit}
                                        >
                                            <EditIcon fontSize="inherit" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            ) : (
                                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                    {!eventById?.isParticipant ? (
                                        <>
                                            <Tooltip
                                                title="Entrar no evento"
                                                placement="top"
                                                arrow
                                                TransitionComponent={Fade}
                                                TransitionProps={{ timeout: 400 }}
                                            >
                                                <IconButton
                                                    aria-label="join"
                                                    size="large"
                                                    className={classes.btnEnter}
                                                    onClick={() => {
                                                        handleOpenEnterDialog()
                                                    }}
                                                >
                                                    <InputIcon fontSize="large" />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    ) : (
                                        <>
                                            <Tooltip
                                                title="Sair do evento"
                                                placement="top"
                                                arrow
                                                TransitionComponent={Fade}
                                                TransitionProps={{ timeout: 400 }}
                                            >
                                                <IconButton
                                                    aria-label="leave"
                                                    size="large"
                                                    className={classes.btnDelete}
                                                    onClick={() => {
                                                        handleOpenLeaveDialog();
                                                    }}
                                                >
                                                    <LogoutIcon fontSize="large" />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    )}
                                </Box>
                            )}
                        </>
                    )}
            </ModalGeneric>
            <DialogDeleteEvent open={openDialogDelete} handleClose={handleDeleteConfirmClose} idEvent={id} />
            <DialogEnterEvent open={openDialogEnter} handleClose={handleCloseEnterDialog} idEvent={id} />
            <DialogLaveEvent open={openLeaveDialog} handleClose={handleCloseLeaveDialog} idEvent={id} />
        </>
    );
}

export default EventDeatails;
