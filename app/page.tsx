"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Demo from "./components/Tabla";
import { use } from "react";
import Mitabla from "./components/Tabla";

export default function Home() {
  return (
    <div className={styles.page}>
      <h1>Bienvenido </h1>
      <br />
      <Mitabla></Mitabla>
    </div>
  );
}
