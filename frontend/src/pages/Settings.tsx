import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import styles from "./Settings.module.css";
import { IoIosCog } from "react-icons/io";
import { fetchUserInfo, saveUserInfo } from "../api/firestore";
import { toast } from "react-toastify";
import type { Profile } from "../types";

export default function Settings() {
  const [pfpSrc, setPfpSrc] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
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
    };
    loadUserInfo();
  }, []);

  const handleSaveChanges = async () => {
    try {
      if (userProfile) {
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
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imgUrl = URL.createObjectURL(file);
      setPfpSrc(imgUrl);
    }
  };

  return (
    <div className={styles.settings}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.header}>
          <IoIosCog />
          <h2>Configuración</h2>
        </div>
        <form
          action="settings"
          className={styles.settingsWrapper}
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveChanges();
          }}
        >
          <label htmlFor="pfp-upload">
            <input
              type="file"
              name="pfp-upload"
              id="pfp-upload"
              accept=".png,.jpg,.jpeg"
              onChange={handleImageUpload}
            />
            <img
              src={pfpSrc || "/no-image-available-vector.jpg"}
              alt="Foto de perfil"
            />
            <p>Foto de perfil</p>
          </label>
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
  );
}
