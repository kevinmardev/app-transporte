"use client";
import { Button, Col, Row, Typography } from "antd";
import TablaConductores from "./components/TablaConductores";
import styles from "./page.module.css";
import { useState } from "react";
import ModalCoductores from "./components/ModalCoductores";
const { Title } = Typography;

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReload, setIsRelaod] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className={styles.page}>
      <h1>Bienvenido </h1>
      <br />
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "20px" }}
      >
        <Col>
          <Title level={2}>Conductores</Title>
        </Col>
        <Col>
          <Button onClick={showModal} type="primary">
            Nuevo Conductor
          </Button>
        </Col>
      </Row>
      <TablaConductores isReload={isReload} setIsRelaod={setIsRelaod} />
      <ModalCoductores
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setIsRelaod={setIsRelaod}
      />
    </div>
  );
}
