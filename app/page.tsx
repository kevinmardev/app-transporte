"use client";
import { Typography } from "antd";
import { useState } from "react";
import styles from "./page.module.css";
const { Title } = Typography;

export default function Home() {
  return (
    <div className={styles.page}>
      <h1>Bienvenido </h1>
      <br />
    </div>
  );
}
