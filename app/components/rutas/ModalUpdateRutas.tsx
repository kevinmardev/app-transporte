import { db } from "@/app/lib/firebase";
import { IModalRuta, IRuta } from "@/app/lib/interfaces/IRuta";
import { Button, Form, Input, message, Modal, Switch } from "antd";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function ModalUpdateRutas({
  setIsModalOpen,
  isModalOpen,
  setIsRelaod,
  ruta,
}: IModalRuta) {
  const [form] = Form.useForm();
  const [conductores, setConductores] = useState<any[]>([]);
  const [vehiculos, setVehiculos] = useState<any[]>([]);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Función para obtener los conductores de Firestore
  const getConductores = async () => {
    const conductoresCollection = collection(db, "Conductores");
    const conductoresSnapshot = await getDocs(conductoresCollection);
    const conductoresList = conductoresSnapshot.docs.map((doc) => ({
      id: doc.id,
      nombre: doc.data().nombre,
    }));
    return conductoresList;
  };

  const getVehiculos = async () => {
    const vehiculosCollection = collection(db, "Camiones");
    const vehiculosSnapshot = await getDocs(vehiculosCollection);
    const vehiculosList = vehiculosSnapshot.docs.map((doc) => ({
      id: doc.id,
      placa: doc.data().placa,
    }));
    return vehiculosList;
  };

  const onFinish = async (values: IRuta) => {
    console.log("Finish ", values);
    if (ruta) {
      try {
        // Crear referencia al documento del usuario
        const usuarioRef = doc(db, "Rutas", ruta.ID);
        // Actualizar el documento con los nuevos valores
        await updateDoc(usuarioRef, {
          nombreRuta: values.nombreRuta,
          tipoViaje: values.tipoViaje,
          origenRuta: values.origenRuta,
          destinoRuta: values.destinoRuta,
          // idConductor: values.idConductor,
          // idVehiculo: values.idVehiculo,
          estado: values.estado,
        });
        console.log("Usuario actualizado correctamente.");
      } catch (error) {
        console.error("Error al actualizar el usuario:", error);
      }
    }
    setIsModalOpen(false);
    setIsRelaod(true);
    message.success("Ruta actualizada correctamente");
  };

  useEffect(() => {
    if (isModalOpen && ruta) {
      form.setFieldsValue(ruta); // Establecer valores en el formulario
      //   form.setFieldsValue({ nombresa: conductor.nombre });
    }
  }, [isModalOpen, ruta, form]);

  return (
    <>
      <Modal title="Actualizar Ruta" open={isModalOpen} footer={null}>
        <Form form={form} name="control-ref" onFinish={onFinish}>
          <Form.Item
            label="Nombre de la Ruta"
            name="nombreRuta"
            rules={[
              { required: true, message: "El nombre es obligatorio" },
              // {
              //   pattern: /^[a-zA-Z\s]+$/,
              //   message: "Solo se permiten letras y espacios",
              // },
            ]}
          >
            <Input placeholder="Ingrese nombre" />
          </Form.Item>
          <Form.Item
            label="Tipo de Viaje"
            name="tipoViaje"
            rules={[
              { required: true, message: "El tipo de viaje es obligatorio" },
            ]}
          >
            <Input placeholder="Ingrese tipo de viaje" />
          </Form.Item>
          <Form.Item
            label="Origen de Ruta"
            name="origenRuta"
            rules={[
              {
                required: true,
                message: "El origen de la ruta es obligatorio",
              },
            ]}
            validateTrigger="onBlur" // Valida al perder el foco
          >
            <Input placeholder="Ingrese el origen de la ruta" />
          </Form.Item>
          <Form.Item
            label="Destino de Ruta"
            name="destinoRuta"
            rules={[
              {
                required: true,
                message: "El destino de la ruta es obligatorio",
              },
            ]}
            validateTrigger="onBlur" // Valida al perder el foco
          >
            <Input placeholder="Ingrese el destino de la ruta" />
          </Form.Item>

          {/* <Form.Item label="Selecciona un Conductor" name="idConductor">
            <Select placeholder="Selecciona un conductor">
              {conductores.map((conductor) => (
                <Option key={conductor.id} value={conductor.id}>
                  {conductor.nombre}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Selecciona una placa" name="idVehiculo">
            <Select placeholder="Selecciona un vehiculo">
              {vehiculos.map((vehiculo) => (
                <Option key={vehiculo.id} value={vehiculo.id}>
                  {vehiculo.placa}
                </Option>
              ))}
            </Select>
          </Form.Item> */}

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
