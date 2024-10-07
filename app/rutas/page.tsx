"use client";
import React, { useState } from "react";
import TablaRutas from "../components/rutas/TablaRutas";
import ModalRuta from "../components/rutas/ModalRuta";
import { Button, Col, Row, Typography } from "antd";
const { Title } = Typography;

export default function PageRutas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReload, setIsRelaod] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "20px" }}
      >
        <Col>
          <Title level={2}>Lista de Rutas</Title>
        </Col>
        <Col>
          <br />
          <Button onClick={showModal} type="primary">
            Agregar Ruta
          </Button>
        </Col>
      </Row>
      <TablaRutas isReload={isReload} setIsRelaod={setIsRelaod} />
      <ModalRuta
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setIsRelaod={setIsRelaod}
      />
    </>
  );
}
