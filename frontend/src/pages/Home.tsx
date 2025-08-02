import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import Cancha from "../components/Cancha";

export default function Home() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <APIProvider apiKey={apiKey}>
      <div>
        <Map
          defaultCenter={{ lat: 18.4549376, lng: -69.9400192 }}
          defaultZoom={13}
        />
      </div>
      <SearchComponent />
      <ToastContainer />
    </APIProvider>
  );
}

function SearchComponent() {
  // map instance
  const map = useMap();
  // search results
  const [results, setResults] = useState<google.maps.places.Place[]>([]);

  // function to search for nearby courts using google maps
  const searchNearbyCourts = async () => {
    if (!map) {
      toast.warn("Mapa no ha cargado. Por favor espere");
      return;
    }

    // attempt to get user's location
    navigator.geolocation.getCurrentPosition(
      // successful callback
      async (position) => {
        const userLoc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // center on user's location
        map.setCenter(userLoc);

        // set up search request
        const request: google.maps.places.SearchNearbyRequest = {
          fields: [
            "displayName",
            "location",
            "primaryTypeDisplayName",
            "formattedAddress",
          ],
          locationRestriction: {
            center: userLoc,
            radius: 5000, // 5km search radius
          },
          language: "es",
          includedPrimaryTypes: [
            "athletic_field",
            "sports_complex",
            "sports_activity_location",
          ],
        };

        // call searchNearby request
        try {
          const { Place } = (await google.maps.importLibrary(
            "places"
          )) as google.maps.PlacesLibrary;
          const { places } = await Place.searchNearby(request);

          if (places.length) {
            console.log(places);
            setResults(places);
          }
        } catch (error) {
          console.error("Nearby search failed", error);
          toast.error("Error buscando canchas.");
          setResults([]);
        }
      },
      // error callback
      (error: unknown) => {
        console.error("Error getting user's location", error);
        toast.error(
          "No se ha podido obtener tu ubicación. Por favor, activa los servicios de localización."
        );
      }
    );
  };
  return (
    <>
      <button onClick={searchNearbyCourts}>Buscar canchas</button>
      <div>
        <h2>Results:</h2>
        {results.length > 0 ? (
          <ul>
            {results.map((place) => (
              <Cancha key={place.id} place={place} />
            ))}
          </ul>
        ) : (
          <p>No se han encontrado canchas.</p>
        )}
      </div>
      <ToastContainer />
    </>
  );
}
