import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import styles from "./Settings.module.css";
import { IoIosCog } from "react-icons/io";
import { fetchUserInfo, saveUserInfo } from "../api/firestore";
import { toast } from "react-toastify";
import type { Profile } from "../types";
import LoadingScreen from "../components/LoadingScreen";

export default function Settings() {
  const [pfpSrc, setPfpSrc] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        setLoading(true);
        const userInfo = await fetchUserInfo();
        console.log(userInfo);
        setUserProfile(userInfo);
        setPfpSrc(userInfo.pfpSrc || "");
        setName(userInfo.name || "");
        setLastName(userInfo.lastName || "");
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
      setLoading(false);
    };
    loadUserInfo();
  }, []);

  const handleSaveChanges = async () => {
    try {
      if (userProfile) {
        setLoading(true);
        await saveUserInfo({
          name: name,
          lastName: lastName,
          cedula: userProfile.cedula,
          email: userProfile.email,
          pfpSrc: pfpSrc,
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
    setLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imgUrl = URL.createObjectURL(file);
      setPfpSrc(imgUrl);
    }
  };

  return (
    <>
      {isLoading ? <LoadingScreen /> : null}
      <div className={styles.settings}>
        <Navbar />
        <div className={styles.content}>
          <div className={styles.header}>
            <IoIosCog />
            <h2>Configuración</h2>
          </div>
          <form
            action="settings"
            className={styles.settingsForm}
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveChanges();
            }}
          >
            <div className={styles.pfp}>
              <input
                type="file"
                name="pfp-upload"
                id="pfp-upload"
                accept=".png,.jpg,.jpeg"
                onChange={handleImageUpload}
              />
              <img
                src={pfpSrc || "/zero-lio/no-pfp.jpg"}
                onClick={() => {
                  const fileInput = document.getElementById("pfp-upload");
                  if (fileInput) fileInput.click();
                }}
              />
              <p>Foto de perfil</p>
            </div>
            <label htmlFor="edit-name">
              <p>Nombre</p>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
            </label>
            <label htmlFor="edit-lastName">
              <p>Apellido</p>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
            </label>
            <button className={styles.saveBtn} type="submit">
              Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
