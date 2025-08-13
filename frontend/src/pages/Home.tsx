import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import shadow from "leaflet/dist/images/marker-shadow.png";
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
import { fetchSavedCanchas, saveCanchas } from "../api/firestore";
import LoadingScreen from "../components/LoadingScreen";

// fix missing marker icon
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: shadow,
});

export default function Home() {
  // search results
  const [results, setResults] = useState<Place[]>([]);
  // selected sport filter
  const [selectedSport, setSelectedSport] = useState("");
  // saved view flag
  const [savedView, setSavedView] = useState(false);
  // menu open flag
  const [isMenuOpen, setMenuOpen] = useState(false);
  // map view flag
  const [isMapView, setIsMapView] = useState(true);
  // saved canchas
  const [savedCanchas, setSavedCanchas] = useState<Place[]>([]);
  // original saved canchas
  const [originalSavedCanchas, setOriginalSavedCanchas] = useState<Place[]>([]);
  // loading flag
  const [isLoading, setLoading] = useState(false);

  // translations for autofill searchbox
  const sportTranslations = new Map([
    ["soccer", "Futbol"],
    ["american_football", "Futbol Americano"],
    ["rugby", "Rugby"],
    ["baseball", "Beisbol"],
    ["basketball", "Baloncesto"],
    ["volleyball", "Voleibol"],
    ["beachvolleyball", "Voleibol de Playa"],
    ["handball", "Balonmano"],
    ["cricket", "Criquet"],
    ["hockey", "Hockey"],
    ["ice_hockey", "Hockey sobre Hielo"],
    ["australian_football", "Futbol Australiano"],
    ["gaelic_games", "Juegos Gaelicos"],
    ["tennis", "Tenis"],
    ["badminton", "Badminton"],
    ["table_tennis", "Tenis de Mesa"],
    ["squash", "Squash"],
    ["padel", "Padel"],
    ["athletics", "Atletismo"],
    ["swimming", "Natacion"],
    ["skateboarding", "Skateboarding"],
    ["climbing", "Escalada"],
    ["equestrian", "Equitacion"],
    ["archery", "Tiro con Arco"],
    ["bowling", "Bolos"],
    ["shooting", "Tiro al Blanco"],
    ["cycling", "Ciclismo"],
    ["gymnastics", "Gimnasia"],
    ["fitness", "Gimnasio"],
    ["golf", "Golf"],
    ["water_polo", "Waterpolo"],
    ["futsal", "Futbol Sala"],
    ["ice_skating", "Patinaje sobre Hielo"],
    ["horse_racing", "Carreras de Caballos"],
  ]);

  useEffect(() => {
    const loadSavedCanchas = async () => {
      try {
        const savedCanchas = await fetchSavedCanchas();
        setSavedCanchas(savedCanchas);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
      setLoading(false);
    };
    loadSavedCanchas();
  }, []);

  // function to handle saved canchas changing
  const handleCanchasChange = async (newCanchas: Place[]) => {
    setSavedCanchas(newCanchas);
    try {
      await saveCanchas(newCanchas, originalSavedCanchas);
      toast.success("Se han guardado tus cambios!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
    setOriginalSavedCanchas(newCanchas);
  };

  // function to handle save button on each cancha
  const handleCanchaSave = (canchaToSave: Place) => {
    const isSaved = savedCanchas.some((cancha) => {
      return cancha.id === canchaToSave.id;
    });

    if (!isSaved) {
      const newSavedCanchas = [...savedCanchas, canchaToSave];
      handleCanchasChange(newSavedCanchas);
    } else {
      toast.warn("Ese lugar ya está guardado.");
    }
  };

  // function to handle remove button on each cancha
  const handleCanchaRemove = (canchaToRemove: Place) => {
    const newSavedCanchas = savedCanchas.filter((cancha) => {
      return cancha.id !== canchaToRemove.id;
    });
    handleCanchasChange(newSavedCanchas);
  };

  // function to search for nearby courts using overpass ap
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

    setLoading(true);
    const userLoc: L.LatLngTuple = await getUserLocation();

    // get sport filter (if any) and match it to overpass sport tags
    let sportFilter = "";
    for (const [key, value] of sportTranslations.entries()) {
      if (value.toLowerCase() === selectedSport.toLowerCase()) {
        sportFilter = key;
        break;
      }
    }

    // use the overpass search api
    try {
      // define search radius (meters)
      const radius = 3000;

      // TODO: option to edit maxResults
      const maxResults = 5;

      // create query
      const query = sportFilter
        ? `
        [out:json];
        (
          nwr["leisure"="pitch"]["sport"="${sportFilter}"](around:${radius},${userLoc[0]},${userLoc[1]});
        );
        out center qt ${maxResults};
      `
        : `
        [out:json];
        (
          nwr["leisure"="pitch"](around:${radius},${userLoc[0]},${userLoc[1]});
        );
        out center qt ${maxResults};
      `;
      console.log("calling overpass api");
      // call api
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: query,
      });

      const data = await response.json();
      console.log(data);

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

    setLoading(false);
  };
  return (
    <>
      {isLoading ? <LoadingScreen /> : null}
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
              value={selectedSport}
              list="sport-options"
              onChange={(e) => {
                setSelectedSport(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            />
            <datalist id="sport-options">
              {Array.from(sportTranslations.values()).map((sport) => (
                <option key={sport} value={sport} />
              ))}
            </datalist>
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
              className={styles.savedViewBtn}
              type="button"
              onClick={() => setSavedView((prev) => !prev)}
            >
              {savedView ? <IoIosHeart /> : <IoIosHeartEmpty />}
            </button>
            <button
              className={styles.mapViewBtn}
              type="button"
              onClick={() => setIsMapView((prev) => !prev)}
            >
              {isMapView ? <IoIosList /> : <IoIosPin />}
            </button>
          </div>
          {savedView ? (
            isMapView ? (
              <MapView results={savedCanchas} />
            ) : (
              <ListView
                canchas={savedCanchas}
                savedCanchas={savedCanchas}
                onSave={handleCanchaSave}
                onRemove={handleCanchaRemove}
              />
            )
          ) : isMapView ? (
            <MapView results={results} />
          ) : (
            <ListView
              canchas={results}
              savedCanchas={savedCanchas}
              onSave={handleCanchaSave}
              onRemove={handleCanchaRemove}
            />
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

function ListView({
  canchas,
  savedCanchas,
  onSave,
  onRemove,
}: {
  canchas: Place[];
  savedCanchas: Place[];
  onSave: (recipe: Place) => void;
  onRemove: (recipe: Place) => void;
}) {
  return (
    <>
      {canchas.length > 0 ? (
        <ul className={styles.resultsList}>
          {canchas.map((place) => {
            const isSaved = savedCanchas.some((saved: Place) => {
              return saved.id === place.id;
            });

            return (
              <Cancha
                key={place.id}
                place={place}
                isSaved={isSaved}
                onSave={onSave}
                onRemove={onRemove}
              />
            );
          })}
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
