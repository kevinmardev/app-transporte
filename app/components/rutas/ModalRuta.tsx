"use client";
import { db } from "@/app/lib/firebase";
import { IModalRuta, IRuta } from "@/app/lib/interfaces/IRuta";
import { Button, Form, Input, message, Modal, Switch } from "antd";
import { addDoc, collection } from "firebase/firestore";

export default function ModalRuta({
  setIsModalOpen,
  isModalOpen,
  setIsRelaod,
}: IModalRuta) {
  const [form] = Form.useForm();

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values: IRuta) => {
    console.log("Finish ", values);
    await agregarDato(values);
    setIsModalOpen(false);
    setIsRelaod(true);
    form.resetFields();
    message.success("Ruta agregada correctamente");
  };

  // Función para agregar datos a Firestore
  async function agregarDato(ruta: IRuta) {
    if (ruta) {
      try {
        const docRef = await addDoc(collection(db, "Rutas"), {
          nombreRuta: ruta.nombreRuta,
          tipoViaje: ruta.tipoViaje,
          origenRuta: ruta.origenRuta,
          destinoRuta: ruta.destinoRuta,
          estado: ruta.estado,
        });
        console.log("Documento agregado con ID: ", docRef.id);
      } catch (e) {
        console.error("Error al agregar el documento: ", e);
      }
    }
  }

  return (
    <>
      <Modal title="Nueva Ruta" open={isModalOpen} footer={null}>
        <Form form={form} name="control-ref" onFinish={onFinish}>
          <Form.Item
            label="Nombre de la Ruta"
            name="nombreRuta"
            rules={[{ required: true, message: "El nombre es obligatorio" }]}
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
