"use client";
import { Button, Col, Row, Typography } from "antd";
import React, { useState } from "react";
import ModalCoductores from "../components/conductores/ModalCoductores";
import TablaConductores from "../components/conductores/TablaConductores";
const { Title } = Typography;

export default function pageConductores() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReload, setIsRelaod] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  return (
    <div>
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
          <br />

          <Button onClick={showModal} type="primary">
            Agregar Conductor
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
