import { db } from "@/app/lib/firebase";
import { IModalRuta, IRuta } from "@/app/lib/interfaces/IRuta";
import { Button, Form, Input, message, Modal, Switch } from "antd";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";

export default function ModalUpdateRutas({
  setIsModalOpen,
  isModalOpen,
  setIsRelaod,
  ruta,
}: IModalRuta) {
  const [form] = Form.useForm();

  const handleCancel = () => {
    setIsModalOpen(false);
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
