"use client";

import React, { useState } from "react";
import TablaVehiculos from "../components/vehiculos/TablaVehiculos";
import ModalVehiculos from "../components/vehiculos/ModalVehiculos";
import { Button, Col, Row, Typography } from "antd";
const { Title } = Typography;

export default function PageVehiculos() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReload, setIsRelaod] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "20px" }}
      >
        <Col>
          <Title level={2}>Listado de Vehículos</Title>
        </Col>
        <Col>
          <br />
          <Button onClick={showModal} type="primary">
            Agregar vehículo
          </Button>
        </Col>
      </Row>
      <TablaVehiculos isReload={isReload} setIsRelaod={setIsRelaod} />
      <ModalVehiculos
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setIsRelaod={setIsRelaod}
      />
    </div>
  );
}
