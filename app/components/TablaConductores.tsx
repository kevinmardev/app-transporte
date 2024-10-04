"use client";
import { message, Table, Tag } from "antd";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  IFormCamion,
  IModalConductores,
  IsReload,
} from "../lib/interfaces/IConductores";
import { db } from "../lib/firebase";
import ModalUpdateCoductores from "./ModalUpdateConductores";

export default function TablaConductores({ isReload, setIsRelaod }: IsReload) {
  const [conductores, setConductores] = useState<IFormCamion[]>([]);
  const [conductor, setConductor] = useState<IFormCamion>();
  const [isShow, setIsShow] = useState(false);

  const showModal = () => {
    setIsShow(true);
  };

  const columns = [
    {
      title: "nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "DUI",
      dataIndex: "DUI",
      key: "DUI",
    },
    {
      title: "direccion",
      dataIndex: "direccion",
      key: "direccion",
    },
    {
      title: "edad",
      dataIndex: "edad",
      key: "edad",
    },
    {
      title: "estado",
      dataIndex: "estado",
      key: "estado",
      render: (_: unknown, record: IFormCamion) => {
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
      render: (_: unknown, record: IFormCamion) => {
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
              onClick={() => deleteConductor(record.ID)}
            />
          </>
        );
      },
    },
  ];

  const obtenerDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Conductores"));
      const listaConductores: IFormCamion[] = [];

      querySnapshot.forEach((doc) => {
        listaConductores.push({
          nombre: doc.data().nombre,
          ID: doc.id,
          direccion: doc.data().direccion,
          DUI: doc.data().DUI,
          edad: doc.data().edad,
          fotoDeConductor: doc.data().fotoDeConductor,
          licencia: doc.data().licencia,
          estado: doc.data().estado,
          telefono: doc.data().telefono,
          correo: doc.data().correo,
        });
      });

      setConductores(listaConductores); // Actualiza el estado con los datos obtenidos
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const deleteConductor = async (id: string) => {
    try {
      await deleteDoc(doc(db, "Conductores", id)); // Elimina el documento en Firebase
      setConductores(conductores.filter((conductor) => conductor.ID !== id)); // Actualiza el estado sin el usuario eliminado
      message.success(`Conductor eliminado con éxito`); // Mensaje de éxito
      console.log(`Usuario con ID ${id} eliminado`);
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const updateConductor = async (conductor: IFormCamion) => {
    showModal();

    setConductor(conductor);
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  useEffect(() => {
    console.log("use useEffect");
    if (isReload) {
      obtenerDatos();
      setIsRelaod(false);
      message.success(`Conductor agregado con éxito`);
    }
  }, [isReload]);
  return (
    <>
      <Table
        columns={columns}
        dataSource={conductores.map((conductor) => ({
          ...conductor,
          key: conductor.ID,
        }))}
      ></Table>

      <ModalUpdateCoductores
        isModalOpen={isShow}
        setIsModalOpen={setIsShow}
        setIsRelaod={setIsRelaod}
        conductor={conductor}
      />
    </>
  );
}
