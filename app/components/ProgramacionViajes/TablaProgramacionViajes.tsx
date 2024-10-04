import { db } from "@/app/lib/firebase";
import { IViaje } from "@/app/lib/interfaces/IProgramacionViajes";
import { message, Table, Tag } from "antd";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import ModalUpdateViaje from "./ModalUpdateViaje";
import { IsReload } from "@/app/lib/interfaces/IConductores";

export default function TablaProgramacionViajes({
  isReload,
  setIsRelaod,
}: IsReload) {
  const [viajes, setViajes] = useState<IViaje[]>([]);
  const [viaje, setViaje] = useState<IViaje>();
  const [isShow, setIsShow] = useState(false);

  const showModal = () => {
    setIsShow(true);
  };
  const columns = [
    {
      title: "nombre del Viaje",
      dataIndex: "nombreViaje",
      key: "nombreViaje",
    },
    {
      title: "Ruta asignada",
      dataIndex: "idRuta",
      key: "idRuta",
    },
    {
      title: "fecha de Recogida",
      dataIndex: "fechaRecogida",
      key: "fechaRecogida",
    },
    {
      title: "fechaLlegada",
      dataIndex: "fechaLlegada",
      key: "fechaLlegada",
    },
    {
      title: "idConductor",
      dataIndex: "idConductor",
      key: "idConductor",
    },
    {
      title: "idVehiculo",
      dataIndex: "idVehiculo",
      key: "idVehiculo",
    },
    {
      title: "estado",
      dataIndex: "estado",
      key: "estado",
      render: (_: unknown, record: IViaje) => {
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
      render: (_: unknown, record: IViaje) => {
        return (
          <>
            <Image
              src="/images/Edit.svg"
              width="22"
              height="22"
              alt="Ver información"
              onClick={() => updateViaje(record)}
            />
            <Image
              src="/images/eliminar.svg"
              width="22"
              height="22"
              alt="Ver información"
              onClick={() => deleteViaje(record.ID)}
            />
          </>
        );
      },
    },
  ];

  const obtenerDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "ProgramacionViajes"));
      const listaViaje: IViaje[] = [];

      querySnapshot.forEach((doc) => {
        listaViaje.push({
          ID: doc.id,
          idConductor: doc.data().idConductor,
          fechaLlegada: doc.data().fechaLlegada,
          fechaRecogida: doc.data().fechaRecogida,
          idRuta: doc.data().idRuta,
          idVehiculo: doc.data().idVehiculo,
          nombreViaje: doc.data().nombreViaje,
          estado: doc.data().estado,
        });
      });

      setViajes(listaViaje); // Actualiza el estado con los datos obtenidos
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const deleteViaje = async (id: string) => {
    try {
      await deleteDoc(doc(db, "ProgramacionViajes", id)); // Elimina el documento en Firebase
      setViajes(viajes.filter((viaje) => viaje.ID !== id)); // Actualiza el estado sin el usuario eliminado
      message.success(`Conductor eliminado con éxito`); // Mensaje de éxito
      console.log(`Usuario con ID ${id} eliminado`);
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const updateViaje = async (viaje: IViaje) => {
    showModal();

    setViaje(viaje);
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
        dataSource={viajes.map((viaje) => ({
          ...viaje,
          key: viaje.ID,
        }))}
      ></Table>

      <ModalUpdateViaje
        isModalOpen={isShow}
        setIsModalOpen={setIsShow}
        setIsRelaod={setIsRelaod}
        viaje={viaje}
      />
    </>
  );
}
