"use client";
import React, { useState } from "react";
import TablaProgramacionViajes from "../components/ProgramacionViajes/TablaProgramacionViajes";
import ModalViajes from "../components/ProgramacionViajes/ModalViajes";
import { Button, Col, Row, Typography } from "antd";
const { Title } = Typography;

export default function PageViajes() {
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
          <Title level={2}>Viajes</Title>
        </Col>
        <Col>
          <br />
          <Button onClick={showModal} type="primary">
            Asignar Viajes
          </Button>
        </Col>
      </Row>
      <TablaProgramacionViajes isReload={isReload} setIsRelaod={setIsRelaod} />
      <ModalViajes
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setIsRelaod={setIsRelaod}
      />
    </>
  );
}
