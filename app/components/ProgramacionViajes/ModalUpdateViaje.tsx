import { db } from "@/app/lib/firebase";
import { IModalViaje, IViaje } from "@/app/lib/interfaces/IProgramacionViajes";
import { Button, Form, Input, Modal, Select, Switch } from "antd";
import { Option } from "antd/es/mentions";

import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function ModalUpdateViaje({
  setIsModalOpen,
  isModalOpen,
  setIsRelaod,
  viaje,
}: IModalViaje) {
  const [form] = Form.useForm();
  const [conductores, setConductores] = useState<any[]>([]);
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [rutas, setRutas] = useState<any[]>([]);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values: IViaje) => {
    console.log("Finish ", values);
    if (viaje) {
      try {
        // Crear referencia al documento del usuario
        const usuarioRef = doc(db, "ProgramacionViajes", viaje.ID);
        // Actualizar el documento con los nuevos valores
        await updateDoc(usuarioRef, {
          nombreViaje: values.nombreViaje,
          fechaRecogida: values.fechaRecogida,
          fechaLlegada: values.fechaLlegada,
          idConductor: values.idConductor,
          idVehiculo: values.idVehiculo,
          idRuta: values.idRuta,
          estado: values.estado,
        });
        console.log("Usuario actualizado correctamente.");
      } catch (error) {
        console.error("Error al actualizar el usuario:", error);
      }
    }
    setIsModalOpen(false);
    setIsRelaod(true);
  };

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
      placa: doc.data().placa,
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
      const conductoresList: any[] = await getConductores();
      setConductores(conductoresList);
      console.log("conductores");
    };

    const fetchVehiculos = async () => {
      const vehiculosList: any[] = await getVehiculos();
      setVehiculos(vehiculosList);
      console.log("Vehiculos");
    };

    const fetchRutas = async () => {
      const rutasList: any[] = await getRutas();
      setRutas(rutasList);
    };

    fetchVehiculos();

    fetchRutas();

    fetchConductores();
  }, []);

  useEffect(() => {
    if (isModalOpen && viaje) {
      // Establecer valores en el formulario
      form.setFieldsValue(viaje);
    }
  }, [isModalOpen, viaje, form]);

  return (
    <>
      <Modal title="Asignar Viaje" open={isModalOpen} footer={null}>
        <Form form={form} name="control-ref" onFinish={onFinish}>
          <Form.Item
            label="nombreViaje"
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
            label="fechaRecogida"
            name="fechaRecogida"
            rules={[
              { required: true, message: "El fechaRecogida es obligatorio" },
            ]}
          >
            <Input placeholder="Ingrese fechaRecogida" />
          </Form.Item>
          <Form.Item
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
          </Form.Item>

          <Form.Item label="Selecciona un Conductor" name="idConductor">
            <Select placeholder="Selecciona un conductor">
              {conductores.map((conductor) => (
                <Select.Option key={conductor.id} value={conductor.id}>
                  {conductor.nombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Selecciona una placa" name="idVehiculo">
            <Select placeholder="Selecciona un vehiculo">
              {vehiculos.map((vehiculo) => (
                <Select.Option key={vehiculo.id} value={vehiculo.id}>
                  {vehiculo.placa}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Selecciona una idRuta" name="idRuta">
            <Select placeholder="Selecciona una ruta">
              {rutas.map((ruta) => (
                <Select.Option key={ruta.id} value={ruta.id}>
                  {ruta.nombreRuta}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Estado"
            name="estado"
            valuePropName="checked"
            rules={[{ required: true, message: "El estado es requerido" }]}
          >
            <Switch />
          </Form.Item>

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
