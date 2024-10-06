"use client";

import { db } from "@/app/lib/firebase";
import { IsReload } from "@/app/lib/interfaces/IConductores";
import { IRuta } from "@/app/lib/interfaces/IRuta";
import { message, Table, Tag } from "antd";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ModalUpdateRutas from "./ModalUpdateRutas";

export default function TablaRutas({ isReload, setIsRelaod }: IsReload) {
  const [rutas, setRutas] = useState<IRuta[]>([]);
  const [ruta, setRuta] = useState<IRuta>();
  const [isShow, setIsShow] = useState(false);

  const showModal = () => {
    setIsShow(true);
  };

  const columns = [
    {
      title: "nombre",
      dataIndex: "nombreRuta",
      key: "nombreRuta",
    },
    {
      title: "tipo de Viaje",
      dataIndex: "tipoViaje",
      key: "tipoViaje",
    },
    {
      title: "origen de Ruta",
      dataIndex: "origenRuta",
      key: "origenRuta",
    },
    {
      title: "destino de Ruta",
      dataIndex: "destinoRuta",
      key: "destinoRuta",
    },
    {
      title: "estado",
      dataIndex: "estado",
      key: "estado",
      render: (_: unknown, record: IRuta) => {
        if (record.estado) {
          return <Tag color="#87d068">Activo</Tag>;
        } else {
          return <Tag color="#FF0000">Inactivo</Tag>;
        }
      },
    },
    {
      title: "opciones",
      dataIndex: "opciones",
      key: "opciones",
      render: (_: unknown, record: IRuta) => {
        return (
          <>
            <Image
              src="/images/Edit.svg"
              width="22"
              height="22"
              alt="Ver información"
              onClick={() => updateConductor(record)}
            />
            <Image
              src="/images/eliminar.svg"
              width="22"
              height="22"
              alt="Ver información"
              onClick={() => deleteruta(record.ID)}
            />
          </>
        );
      },
    },
  ];

  const obtenerDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Rutas"));
      const listaRutas: IRuta[] = [];

      querySnapshot.forEach((doc) => {
        listaRutas.push({
          nombreRuta: doc.data().nombreRuta,
          ID: doc.id,
          tipoViaje: doc.data().tipoViaje,
          origenRuta: doc.data().origenRuta,
          destinoRuta: doc.data().destinoRuta,
          idConductor: doc.data().idConductor,
          idVehiculo: doc.data().idVehiculo,
          estado: doc.data().estado,
        });
      });

      setRutas(listaRutas); // Actualiza el estado con los datos obtenidos
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const deleteruta = async (id: string) => {
    try {
      await deleteDoc(doc(db, "Rutas", id)); // Elimina el documento en Firebase
      setRutas(rutas.filter((ruta) => ruta.ID !== id)); // Actualiza el estado sin el usuario eliminado
      message.success(`Ruta eliminada con éxito`); // Mensaje de éxito
      console.log(`Usuario con ID ${id} eliminado`);
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const updateConductor = async (ruta: IRuta) => {
    showModal();

    setRuta(ruta);
  };

  useEffect(() => {
    obtenerDatos();
  }, []); // Se ejecuta una vez al montarse el componente

  useEffect(() => {
    console.log("use useEffect");
    if (isReload) {
      obtenerDatos();
      setIsRelaod(false);
      message.success(`Conductor agregado con éxito`);
    }
  }, [isReload, setIsRelaod]);

  return (
    <>
      <Table
        scroll={{ x: 500 }}
        columns={columns}
        dataSource={rutas.map((ruta) => ({
          ...ruta,
          key: ruta.ID,
        }))}
      ></Table>

      <ModalUpdateRutas
        isModalOpen={isShow}
        setIsModalOpen={setIsShow}
        setIsRelaod={setIsRelaod}
        ruta={ruta}
      />
    </>
  );
}
