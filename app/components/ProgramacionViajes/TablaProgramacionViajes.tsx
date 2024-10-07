import { db } from "@/app/lib/firebase";
import { IConduntorModal, IsReload } from "@/app/lib/interfaces/IConductores";
import { IViaje } from "@/app/lib/interfaces/IProgramacionViajes";
import { IRutaModalUpdate } from "@/app/lib/interfaces/IRuta";
import { IVehiculoModalUpdate } from "@/app/lib/interfaces/IVehiculo";
import { message, Table } from "antd";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import ModalUpdateViaje from "./ModalUpdateViaje";

export default function TablaProgramacionViajes({
  isReload,
  setIsRelaod,
}: IsReload) {
  const [viajes, setViajes] = useState<IViaje[]>([]);
  const [conductores, setConductores] = useState<IConduntorModal[]>([]);
  const [vehiculos, setVehiculos] = useState<IVehiculoModalUpdate[]>([]);
  const [rutas, setRutas] = useState<IRutaModalUpdate[]>([]);
  const [isShow, setIsShow] = useState(false);
  const [viaje, setViaje] = useState<IViaje>();

  //obtener nombre de rutas
  const obntenerRutas = async () => {
    try {
      const rutasSnapshot = await getDocs(collection(db, "Rutas"));
      const listaRutas: unknown = rutasSnapshot.docs.map((doc) => ({
        ID: doc.id,
        nombreRuta: doc.data().nombreRuta,
      }));
      setRutas(listaRutas as IRutaModalUpdate[]);
    } catch (error) {
      console.log("Error al obtener las rutas", error);
    }
  };

  // Obtener todos los conductores al cargar el componente
  const obtenerConductores = async () => {
    try {
      const conductoresSnapshot = await getDocs(collection(db, "Conductores"));
      const listaConductores: unknown = conductoresSnapshot.docs.map((doc) => ({
        ID: doc.id,
        nombre: doc.data().nombre,
      }));
      setConductores(listaConductores as IConduntorModal[]); // Guardar todos los conductores en el estado
    } catch (error) {
      console.error("Error al obtener los conductores:", error);
    }
  };

  const obtenerVehiculos = async () => {
    try {
      const vehiculosSnapshot = await getDocs(collection(db, "Camiones"));
      const listaVehiculos: unknown = vehiculosSnapshot.docs.map((doc) => ({
        ID: doc.id,
        tipoVehiculo: doc.data().tipoVehiculo,
      }));
      setVehiculos(listaVehiculos as IVehiculoModalUpdate[]);
    } catch (error) {
      console.log("error al cargar", error);
    }
  };

  // Obtener todos los viajes
  const obtenerDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "ProgramacionViajes"));
      const listaViaje: IViaje[] = [];

      querySnapshot.forEach((doc) => {
        const viajeData = doc.data();
        listaViaje.push({
          ID: doc.id,
          idConductor: viajeData.idConductor,
          fechaLlegada: viajeData.fechaLlegada,
          fechaRecogida: viajeData.fechaRecogida,
          idRuta: viajeData.idRuta,
          idVehiculo: viajeData.idVehiculo,
          nombreViaje: viajeData.nombreViaje,
          // estado: viajeData.estado,
        });
      });

      setViajes(listaViaje); // Actualiza el estado con los datos obtenidos
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  //encontar el nombre de la ruta por medio del id de la ruta
  const encontrarRua = (idRuta: string) => {
    const ruta = rutas.find((ruta) => ruta.ID === idRuta);
    return ruta ? ruta.nombreRuta : "No se encontro la ruta";
  };

  // Encontrar el nombre del conductor basado en el idConductor
  const encontrarConductor = (idConductor: string) => {
    const conductor = conductores.find(
      (conductor) => conductor.ID === idConductor
    );
    return conductor ? conductor.nombre : "Conductor no encontrado";
  };

  const encontrarVehiculo = (idVehiculo: string) => {
    const vehiculo = vehiculos.find((vehiculo) => vehiculo.ID === idVehiculo);
    return vehiculo ? vehiculo.tipoVehiculo : "vehiiculo no encontrado";
  };

  // Eliminar un viaje
  const deleteViaje = async (id: string) => {
    try {
      await deleteDoc(doc(db, "ProgramacionViajes", id));
      setViajes(viajes.filter((viaje) => viaje.ID !== id));
      message.success(`Viaje eliminado con éxito`);
    } catch (error) {
      console.error("Error al eliminar el viaje:", error);
    }
  };

  // Abrir modal para actualizar el viaje
  const updateViaje = async (viaje: IViaje) => {
    setIsShow(true);
    setViaje(viaje);
  };

  useEffect(() => {
    obntenerRutas();
    obtenerVehiculos();
    obtenerConductores(); // Obtener conductores al cargar el componente
    obtenerDatos(); // Obtener viajes al cargar el componente
  }, []);

  useEffect(() => {
    if (isReload) {
      obtenerDatos();
      setIsRelaod(false);
      message.success(`Datos actualizados con éxito`);
    }
  }, [isReload]);

  // Definir las columnas de la tabla
  const columns = [
    {
      title: "Nombre del Viaje",
      dataIndex: "nombreViaje",
      key: "nombreViaje",
    },
    {
      title: "Nombre de la Ruta",
      dataIndex: "idRuta",
      key: "idRuta",
      render: (idRuta: string) => encontrarRua(idRuta),
    },
    {
      title: "Fecha de Recogida",
      dataIndex: "fechaRecogida",
      key: "fechaRecogida",
    },
    {
      title: "Fecha de Llegada",
      dataIndex: "fechaLlegada",
      key: "fechaLlegada",
    },
    {
      title: "Conductor",
      dataIndex: "idConductor",
      key: "idConductor",
      render: (idConductor: string) => encontrarConductor(idConductor), // Usar la función para encontrar el nombre del conductor
    },
    {
      title: "Vehículo",
      dataIndex: "idVehiculo",
      key: "idVehiculo",
      render: (idVehiculo: string) => encontrarVehiculo(idVehiculo),
    },
    // {
    //   title: "Estado",
    //   dataIndex: "estado",
    //   key: "estado",
    //   render: (_: unknown, record: IViaje) => {
    //     if (record.estado) {
    //       return <Tag color="#87d068">Activo</Tag>;
    //     } else {
    //       return <Tag color="#FF0000">Inactivo</Tag>;
    //     }
    //   },
    // },
    {
      title: "Opciones",
      dataIndex: "opciones",
      key: "opciones",
      render: (_: unknown, record: IViaje) => (
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
      ),
    },
  ];

  return (
    <>
      <Table
        scroll={{ x: 500 }}
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
