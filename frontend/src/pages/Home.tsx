import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import Cancha from "../components/Cancha";
import styles from "./Home.module.css";
import { IoSearch } from "react-icons/io5";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoIosHeart } from "react-icons/io";
import { IoIosMenu } from "react-icons/io";
import { IoIosList } from "react-icons/io";
import { IoIosPin } from "react-icons/io";
import Menu from "../components/Menu";
import type { Place } from "../types";
import { reverseGeocode } from "../api/geocode";

export default function Home() {
  // search results
  const [results, setResults] = useState<Place[]>([]);
  // searchbar query
  const [query, setQuery] = useState("");
  // saved view flag
  const [savedView, setSavedView] = useState(true);
  // menu open flag
  const [isMenuOpen, setMenuOpen] = useState(false);
  // map view flag
  const [isMapView, setIsMapView] = useState(true);

  // function to search for nearby courts using google maps
  const searchNearbyCourts = async () => {
    // default location
    const defaultLoc: L.LatLngTuple = [18.4549376, -69.9400192];

    // attempt to get user's location
    const getUserLocation = () => {
      return new Promise<L.LatLngTuple>((resolve) => {
        if (!navigator.geolocation) {
          toast.warn("Tu navegador no soporta geolocalización.");
          resolve(defaultLoc);
          return;
        }
        navigator.geolocation.getCurrentPosition(
          // successful callback
          (position) => {
            resolve([position.coords.latitude, position.coords.longitude]);
          },
          // error callback
          (error) => {
            toast.warn(
              "No se ha podido obtener tu ubicación. Por favor, activa los servicios de localización."
            );
            console.error("Error getting user's location", error);
            resolve(defaultLoc);
          },
          { timeout: 5000 }
        );
      });
    };

    const userLoc: L.LatLngTuple = await getUserLocation();

    // use the overpass search api
    try {
      // define search radius (meters)
      const radius = 3000;

      // TODO: option to edit maxResults
      const maxResults = 10;

      // create query
      const query = `
      [out:json];
      (
        node["leisure"="pitch"](around:${radius},${userLoc[0]},${userLoc[1]});
        way["leisure"="pitch"](around:${radius},${userLoc[0]},${userLoc[1]});
        relation["leisure"="pitch"](around:${radius},${userLoc[0]},${userLoc[1]});
      );
      out center qt ${maxResults};
    `;

      // call api
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      });

      const data = await response.json();

      if (data && data.elements.length > 0) {
        const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
        const searchResults: Place[] = [];

        // loop through api response
        for (const element of data.elements) {
          const tags = element.tags || {};
          const sport = tags.sport ? tags.sport : "";

          const lat = element.lat || element.center?.lat;
          const lng = element.lon || element.center?.lon;

          let address = "Sin dirección";
          let name = sport ? `Cancha de ${sport}` : "Cancha sin nombre";
          let distanceMeters = 0;

          // use reverse geocoding to find address and more place info
          if (lat && lng) {
            // calculate distance in meters from user location
            distanceMeters = L.latLng(userLoc[0], userLoc[1]).distanceTo(
              L.latLng(lat, lng)
            );
            try {
              const placeData = await reverseGeocode(lat, lng);
              console.log(placeData);
              if (placeData.name) {
                name = placeData.name;
              }
              if (placeData.address) {
                address = `${placeData.address.road}, ${
                  placeData.address.neighbourhood ||
                  placeData.address.quarter ||
                  ""
                }, ${placeData.address.county}, ${placeData.address.state}, ${
                  placeData.address.country
                }`;
              }
              await delay(1100); // wait 1.1s between requests
              console.log(address);
            } catch (err) {
              console.error("Reverse geocode failed for", lat, lng, err);
            }
          }

          // store formatted place objects
          searchResults.push({
            id: element.id,
            displayName: name,
            location: {
              lat: element.lat || element.center?.lat,
              lng: element.lon || element.center?.lon,
            },
            formattedAddress: address,
            sport: sport,
            distanceMeters: distanceMeters,
          });
        }
        setResults(searchResults);
      } else {
        toast.warn("No se han encontrado canchas cercanas.");
        setResults([]);
      }
    } catch (error) {
      console.error("Nearby search failed", error);
      toast.error("Error buscando canchas.");
      setResults([]);
    }
  };
  return (
    <>
      <div className={styles.nearbyCourts}>
        {isMenuOpen && (
          <div
            className={styles.backdrop}
            onClick={() => setMenuOpen(false)}
          ></div>
        )}
        <div className={styles.searchHeader}>
          <div className={styles.menu} title="Click to see menu">
            <IoIosMenu onClick={() => setMenuOpen(!isMenuOpen)} />
            {isMenuOpen && <Menu />}
          </div>
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
        </div>
        <div className={styles.places}>
          <div className={styles.header}>
            <h2>Cerca de ti</h2>
            <button
              className={styles.mapViewBtn}
              type="button"
              onClick={() => setIsMapView((prev) => !prev)}
            >
              {isMapView ? <IoIosList /> : <IoIosPin />}
            </button>
            <button
              className={styles.savedViewBtn}
              type="button"
              onClick={() => setSavedView((prev) => !prev)}
            >
              {savedView ? <IoIosHeart /> : <IoIosHeartEmpty />}
            </button>
          </div>
          {isMapView ? (
            <MapView results={results} />
          ) : (
            <ListView results={results} />
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

function ListView({ results }: { results: Place[] }) {
  return (
    <>
      {results.length > 0 ? (
        <ul className={styles.resultsList}>
          {results.map((place) => (
            <Cancha key={place.id} place={place} />
          ))}
        </ul>
      ) : (
        <p>No se han encontrado canchas.</p>
      )}
    </>
  );
}

function MapView({ results }: { results: Place[] }) {
  const mapCenter: L.LatLngTuple =
    results.length > 0
      ? [results[0].location.lat, results[0].location.lng]
      : [18.4549376, -69.9400192];

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <MapSetter results={results} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {results.map((place) => (
          <Marker
            key={place.id}
            position={[place.location.lat, place.location.lng]}
          >
            <Popup>
              <strong>{place.displayName}</strong>
              <br />
              {place.formattedAddress}
              <br />
              <IoIosPin /> {(place.distanceMeters / 1000).toFixed(2)} km
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

function MapSetter({ results }: { results: Place[] }) {
  // set map instance
  const map = useMap();
  if (results.length > 0) {
    map.setView([results[0].location.lat, results[0].location.lng], 13);
  }
  return null;
}
