import { message, Table, Tag } from "antd";
import Image from "next/image";
import { IVehiculo } from "../../lib/interfaces/IVehiculo";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useEffect, useState } from "react";
import ModalVehiculos from "./ModalVehiculos";
import { IsReload } from "@/app/lib/interfaces/IConductores";
import ModalUpdateVehiculo from "./ModalUpdateVehiculo";

export default function TablaVehiculos({ isReload, setIsRelaod }: IsReload) {
  const [vehiculos, setVehiculos] = useState<IVehiculo[]>([]);
  const [vehiculo, setVehiculo] = useState<IVehiculo>();
  const [isShow, setIsShow] = useState(false);

  const showModal = () => {
    setIsShow(true);
  };

  const columns = [
    {
      title: "marca",
      dataIndex: "marca",
      key: "marca",
    },
    {
      title: "modelo",
      dataIndex: "modelo",
      key: "modelo",
    },
    {
      title: "Año",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "Placa",
      dataIndex: "placa",
      key: "placa",
    },
    {
      title: "Tipo de Vehiculo",
      dataIndex: "tipoVehiculo",
      key: "tipoVehiculo",
    },
    {
      title: "estado",
      dataIndex: "estado",
      key: "estado",
      render: (_: unknown, record: IVehiculo) => {
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
      render: (_: unknown, record: IVehiculo) => {
        return (
          <>
            <Image
              src="/images/Edit.svg"
              width="22"
              height="22"
              alt="Ver información"
              onClick={() => updateVehiculo(record)}
            />
            <Image
              src="/images/eliminar.svg"
              width="22"
              height="22"
              alt="Ver información"
              onClick={() => deleteVehiculo(record.ID)}
            />
          </>
        );
      },
    },
  ];

  const obtenerDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Camiones"));
      const listaVehiculos: IVehiculo[] = [];

      querySnapshot.forEach((doc) => {
        listaVehiculos.push({
          marca: doc.data().marca,
          ID: doc.id,
          capacidad: doc.data().capacidad,
          fotoVehiculo: doc.data().fotoVehiculo,
          modelo: doc.data().modelo,
          placa: doc.data().placa,
          tipoVehiculo: doc.data().tipoVehiculo,
          estado: doc.data().estado,
          year: doc.data().year,
        });
      });

      setVehiculos(listaVehiculos); // Actualiza el estado con los datos obtenidos
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const deleteVehiculo = async (id: string) => {
    try {
      await deleteDoc(doc(db, "Camiones", id)); // Elimina el documento en Firebase
      setVehiculos(vehiculos.filter((vehiculo) => vehiculo.ID !== id)); // Actualiza el estado sin el usuario eliminado
      message.success(`Vehiculo eliminado con éxito`); // Mensaje de éxito
      console.log(`Usuario con ID ${id} eliminado`);
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const updateVehiculo = async (vehiculo: IVehiculo) => {
    showModal();

    setVehiculo(vehiculo);
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  useEffect(() => {
    console.log("use useEffect");
    if (isReload) {
      obtenerDatos();
      setIsRelaod(false);
      // message.success(`Conductor agregado con éxito`);
    }
  }, [isReload]);
  return (
    <>
      <Table
        scroll={{ x: 500 }}
        columns={columns}
        dataSource={vehiculos.map((vehiculo) => ({
          ...vehiculo,
          key: vehiculo.ID,
        }))}
      ></Table>

      <ModalUpdateVehiculo
        isModalOpen={isShow}
        setIsModalOpen={setIsShow}
        setIsRelaod={setIsRelaod}
        vehiculo={vehiculo}
      />
    </>
  );
}
