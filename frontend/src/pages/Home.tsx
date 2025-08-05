import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import Cancha from "../components/Cancha";
import styles from "./Home.module.css";
import { IoSearch } from "react-icons/io5";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoIosHeart } from "react-icons/io";

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
  // searchbar query
  const [query, setQuery] = useState("");
  // saved view flag
  const [savedView, setSavedView] = useState(true);

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

        // TODO: nominatim
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
      <div className={styles.nearbyCourts}>
        <form className={styles.searchBarWrapper} action="searchBar">
          <input
            type="text"
            name="query"
            placeholder="Buscar canchas..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
          />
          <button
            className={styles.searchBtn}
            onClick={() => searchNearbyCourts()}
            type="button"
          >
            <IoSearch />
          </button>
        </form>
        <div className={styles.places}>
          <div className={styles.header}>
            <h2>Cerca de ti</h2>
            <button
              className={styles.savedViewBtn}
              type="button"
              onClick={() => setSavedView((prev) => !prev)}
            >
              {savedView ? <IoIosHeart /> : <IoIosHeartEmpty />}
            </button>
          </div>
          {results.length > 0 ? (
            <ul className={styles.resultsList}>
              {results.map((place) => (
                <Cancha key={place.id} place={place} />
              ))}
            </ul>
          ) : (
            <p>No se han encontrado canchas.</p>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
