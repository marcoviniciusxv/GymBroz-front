import './style.css'
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster'
import { Icon } from 'leaflet';
import { useCallback, useEffect, useState, } from 'react';
import { EventUnique, EventsDTO, getEvents } from '../../../../services/events.service';
import PopUpEvents from '../../../molecules/PopUpEvents';
import { useBackdrop } from '../../../../hooks/backdrop';
import { useFeedback } from '../../../../hooks/addFeedback';
import iconGym from '../../../../../assets/location2.png'
import { Box } from '@mui/material';

const MapEvents = () => {
    const [markers, setMarkers] = useState<EventsDTO>()
    const { handleBackdrop } = useBackdrop()
    const { addFedback } = useFeedback()

    const eventsList = useCallback(() => {
        handleBackdrop(true)
        getEvents()
            .then(res => {
                setMarkers(res.data)
                handleBackdrop(false)
            })
            .catch(err => {
                addFedback({
                    description: 'Erro ao exibir os eventos',
                    typeMessage: 'error'
                })
                handleBackdrop(false)
            })
    }, [])

    useEffect(() => {
        eventsList()
    }, [])

    const deleteEventInPop = () => {
        eventsList()
    }

    const customMarkerIcon = new Icon({
        iconUrl: iconGym,
        iconSize: [45, 45]
    });

    return (
        <Box sx={{ marginBottom: '0px' }}>
            <MapContainer
                center={[-22.7999744, -45.2001792]}
                zoom={13}
                scrollWheelZoom={true}
            >
                <TileLayer
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MarkerClusterGroup
                    chunkedLoading
                    maxClusterRadius={150}
                    spiderfyOnMaxZoom={true}
                    showCoverageOnHover={true}
                >

                    {
                        markers?.events && markers.events!.map((marker: EventUnique) => (
                            <Marker position={marker.geocode} key={marker.id} icon={customMarkerIcon}>
                                <Popup>
                                    <PopUpEvents title={marker.title} date={marker.eventDate} id={marker.id} deleteEventInPop={deleteEventInPop} />
                                </Popup>
                            </Marker>
                        ))
                    }
                </MarkerClusterGroup>

            </MapContainer>
        </Box>
    );
}

export default MapEvents;