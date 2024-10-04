import { db } from "@/app/lib/firebase";
import { IModalVehiculo, IVehiculo } from "@/app/lib/interfaces/IVehiculo";
import { Button, Form, Input, Modal, Switch } from "antd";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect } from "react";

export default function ModalUpdateVehiculo({
  setIsModalOpen,
  isModalOpen,
  setIsRelaod,
  vehiculo,
}: IModalVehiculo) {
  const [form] = Form.useForm();

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values: IVehiculo) => {
    console.log("Finish ", values);
    if (vehiculo) {
      try {
        // Crear referencia al documento del usuario
        const usuarioRef = doc(db, "Camiones", vehiculo.ID);
        // Actualizar el documento con los nuevos valores
        await updateDoc(usuarioRef, {
          marca: values.marca,
          capacidad: values.capacidad,
          fotoVehiculo: values.fotoVehiculo,
          modelo: values.modelo,
          placa: values.placa,
          tipoVehiculo: values.tipoVehiculo,
          estado: values.estado,
          year: values.year,
        });
        console.log("Usuario actualizado correctamente.");
      } catch (error) {
        console.error("Error al actualizar el usuario:", error);
      }
    }
    setIsModalOpen(false);
    setIsRelaod(true);
  };

  useEffect(() => {
    if (isModalOpen && vehiculo) {
      form.setFieldsValue(vehiculo); // Establecer valores en el formulario
      //   form.setFieldsValue({ nombresa: conductor.nombre });
    }
  }, [isModalOpen, vehiculo, form]);

  return (
    <Modal title="Nuevo Vehiculo" open={isModalOpen} footer={null}>
      <Form form={form} name="control-ref" onFinish={onFinish}>
        <Form.Item
          label="Marca"
          name="marca"
          rules={[
            { required: true, message: "La marca es obligatoria" },
            {
              pattern: /^[a-zA-Z\s]+$/,
              message: "Solo se permiten letras y espacios",
            },
          ]}
        >
          <Input placeholder="ingrese marca" />
        </Form.Item>
        <Form.Item
          label="modelo"
          name="modelo"
          rules={[{ required: true, message: "La modelo es obligatorio" }]}
        >
          <Input placeholder="ingrese modelo" />
        </Form.Item>
        <Form.Item
          label="year"
          name="year"
          rules={[
            { required: true, message: "El año es obligatorio" },
            {
              pattern: /^(19|20)\d{2}$/, // Acepta años entre 1900 y 2099
              message:
                "El año debe estar en el formato de 4 dígitos (Ej: 2023)",
            },
          ]}
          validateTrigger="onBlur" // Valida al perder el foco
        >
          <Input placeholder="Ingrese año (Ej: 2023)" />
        </Form.Item>

        <Form.Item
          label="placa"
          name="placa"
          rules={[{ required: true, message: "La placa es obligatorio" }]}
        >
          <Input placeholder="ingrese placa" />
        </Form.Item>
        <Form.Item
          label="capacidad"
          name="capacidad"
          rules={[
            {
              required: true,
              message: "La capacidad es obligatorio",
            },
            {
              pattern: /^[0-9]+$/,
              message: "Solo se permiten números",
            },
          ]}
        >
          <Input placeholder="ingrese capacidad" />
        </Form.Item>
        <Form.Item
          label="Tipo de Vehiculo"
          name="tipoVehiculo"
          rules={[
            { required: true, message: "El tipo de Vehiculo es obligatorio" },
          ]}
        >
          <Input placeholder="ingrese tipo de Vehiculo" />
        </Form.Item>
        <Form.Item
          label="estado"
          name="estado"
          valuePropName="checked"
          rules={[{ required: true, message: "El estado es requerido" }]}
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label="fotoVehiculo"
          name="fotoVehiculo"
          rules={[
            { required: true, message: "El fotoVehiculo es obligatorio" },
            {
              pattern: /^[a-zA-Z\s]+$/,
              message: "Solo se permiten letras y espacios",
            },
          ]}
          validateTrigger="onBlur"
        >
          <Input placeholder="Ingrese su fotoVehiculo" />
        </Form.Item>

        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
          }}
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
  );
}
