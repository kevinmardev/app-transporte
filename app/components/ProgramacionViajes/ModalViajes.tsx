import { db } from "@/app/lib/firebase";
import { IConduntorModal } from "@/app/lib/interfaces/IConductores";
import { IModalViaje, IViaje } from "@/app/lib/interfaces/IProgramacionViajes";
import { IRutaModalUpdate } from "@/app/lib/interfaces/IRuta";
import { IVehiculoModalUpdate } from "@/app/lib/interfaces/IVehiculo";
import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import { Option } from "antd/es/mentions";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function ModalViajes({
  setIsModalOpen,
  isModalOpen,
  setIsRelaod,
}: IModalViaje) {
  const [form] = Form.useForm();
  const [conductores, setConductores] = useState<IConduntorModal[]>([]);
  const [vehiculos, setVehiculos] = useState<IVehiculoModalUpdate[]>([]);
  const [rutas, setRutas] = useState<IRutaModalUpdate[]>([]);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values: any) => {
    console.log("Finish ", values.fechaLlegada.format("YYYY-MM-DD HH:mm:ss"));
    values.fechaLlegada = values.fechaLlegada.format("YYYY-MM-DD HH:mm:ss");
    values.fechaRecogida = values.fechaRecogida.format("YYYY-MM-DD HH:mm:ss");
    await agregarDato(values);
    setIsModalOpen(false);
    setIsRelaod(true);
    form.resetFields();
  };

  // Función para agregar datos a Firestore
  async function agregarDato(viaje: IViaje) {
    if (viaje) {
      try {
        const docRef = await addDoc(collection(db, "ProgramacionViajes"), {
          idConductor: viaje.idConductor,
          fechaLlegada: viaje.fechaLlegada,
          fechaRecogida: viaje.fechaRecogida,
          idRuta: viaje.idRuta,
          idVehiculo: viaje.idVehiculo,
          nombreViaje: viaje.nombreViaje,
          // estado: viaje.estado,
        });
        console.log("Documento agregado con ID: ", docRef.id);
      } catch (e) {
        console.error("Error al agregar el documento: ", e);
      }
    }
  }

  // Función para obtener solo los conductores activos
  const getConductores = async () => {
    const conductoresCollection = collection(db, "Conductores");

    // Crear una consulta para obtener conductores con estado activo
    const q = query(conductoresCollection, where("estado", "==", true));

    const conductoresSnapshot = await getDocs(q);
    const conductoresList = conductoresSnapshot.docs.map((doc) => ({
      id: doc.id,
      nombre: doc.data().nombre,
    }));

    return conductoresList;
  };

  const getVehiculos = async () => {
    const vehiculosCollection = collection(db, "Camiones");
    const q = query(vehiculosCollection, where("estado", "==", true));
    const vehiculosSnapshot = await getDocs(q);
    const vehiculosList = vehiculosSnapshot.docs.map((doc) => ({
      id: doc.id,
      tipoVehiculo: doc.data().tipoVehiculo,
    }));
    return vehiculosList;
  };

  const getRutas = async () => {
    const rutasCollection = collection(db, "Rutas");
    const rutasSnapshot = await getDocs(rutasCollection);
    const rutasList = rutasSnapshot.docs.map((doc) => ({
      id: doc.id,
      nombreRuta: doc.data().nombreRuta,
    }));
    return rutasList;
  };

  useEffect(() => {
    console.log("Modal montado");
    const fetchConductores = async () => {
      const conductoresList: unknown = await getConductores();
      setConductores(conductoresList as IConduntorModal[]);
      console.log("conductores");
    };

    const fetchVehiculos = async () => {
      const vehiculosList: unknown = await getVehiculos();
      setVehiculos(vehiculosList as IVehiculoModalUpdate[]);
      console.log("Vehiculos");
    };

    const fetchRutas = async () => {
      const rutasList: unknown = await getRutas();
      setRutas(rutasList as IRutaModalUpdate[]);
    };

    fetchVehiculos();

    fetchRutas();

    fetchConductores();
  }, []); // El arreglo vacío asegura que esto solo se ejecute una vez cuando el componente se monta

  return (
    <>
      <Modal title="Asignar Viaje" open={isModalOpen} footer={null}>
        <Form form={form} name="control-ref" onFinish={onFinish}>
          <Form.Item
            label="Nombre del viaje"
            name="nombreViaje"
            rules={[
              { required: true, message: "El nombre es obligatorio" },
              {
                pattern: /^[a-zA-Z\s]+$/,
                message: "Solo se permiten letras y espacios",
              },
            ]}
          >
            <Input placeholder="Ingrese nombre" />
          </Form.Item>
          <Form.Item
            label="Fecha de Recogida"
            name="fechaRecogida"
            rules={[
              {
                required: true,
                message: "Por favor selecciona una fecha y hora",
              },
            ]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          {/* <Form.Item
            label="fechaRecogida"
            name="fechaRecogida"
            rules={[
              { required: true, message: "El fechaRecogida es obligatorio" },
            ]}
          >
            <Input placeholder="Ingrese fechaRecogida" />
          </Form.Item> */}
          {/* <Form.Item
            label="fechaLlegada"
            name="fechaLlegada"
            rules={[
              {
                required: true,
                message: "la fechaLlegada es obligatorio",
              },
            ]}
            validateTrigger="onBlur" // Valida al perder el foco
          >
            <Input placeholder="Ingrese la fechaLlegada" />
          </Form.Item> */}

          <Form.Item
            label="Fecha de Llegada"
            name="fechaLlegada"
            rules={[
              {
                required: true,
                message: "Por favor selecciona una fecha y hora",
              },
            ]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>

          <Form.Item
            label="Selecciona un Conductor"
            name="idConductor"
            rules={[{ required: true, message: "El Conductor es obligatorio" }]}
          >
            <Select placeholder="Selecciona un conductor">
              {conductores.map((conductor) => (
                <Option key={conductor.ID} value={conductor.ID}>
                  {conductor.nombre}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Selecciona una placa"
            name="idVehiculo"
            rules={[
              { required: true, message: "El tipo de vehículo es obligatorio" },
            ]}
          >
            <Select placeholder="Selecciona un vehiculo">
              {vehiculos.map((vehiculo) => (
                <Option key={vehiculo.ID} value={vehiculo.ID}>
                  {vehiculo.tipoVehiculo}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Selecciona una Ruta"
            name="idRuta"
            rules={[{ required: true, message: "La ruta es obligatoria" }]}
          >
            <Select placeholder="Selecciona una ruta">
              {rutas.map((ruta) => (
                <Option key={ruta.ID} value={ruta.ID}>
                  {ruta.nombreRuta}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* <Form.Item
            label="Estado"
            name="estado"
            valuePropName="checked"
            rules={[{ required: true, message: "El estado es requerido" }]}
          >
            <Switch />
          </Form.Item> */}

          <div
            style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
          >
            <Button onClick={handleCancel}>Cancelar</Button>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Guardar
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
}
