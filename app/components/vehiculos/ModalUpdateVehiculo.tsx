import { db } from "@/app/lib/firebase";
import { UploadOutlined } from "@ant-design/icons";
import { IModalVehiculo, IVehiculo } from "@/app/lib/interfaces/IVehiculo";
import { Button, Form, Input, Modal, Select, Switch, Upload } from "antd";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";

export default function ModalUpdateVehiculo({
  setIsModalOpen,
  isModalOpen,
  setIsRelaod,
  vehiculo,
}: IModalVehiculo) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  const handleChange = ({ fileList }: any) => setFileList(fileList);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values: IVehiculo) => {
    console.log("Finish ", values);
    if (vehiculo) {
      try {
        const usuarioRef = doc(db, "Camiones", vehiculo.ID);
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

      // Precargar la imagen existente en fileList
      if (vehiculo.fotoVehiculo) {
        setFileList([
          {
            url: vehiculo.fotoVehiculo, // URL de la imagen existente
          },
        ]);
      }
    }
  }, [isModalOpen, vehiculo, form]);

  return (
    <Modal title="Actualizar Vehículo" open={isModalOpen} footer={null}>
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
          <Input placeholder="Ingrese marca" />
        </Form.Item>
        <Form.Item
          label="Modelo"
          name="modelo"
          rules={[{ required: true, message: "El modelo es obligatorio" }]}
        >
          <Input placeholder="Ingrese modelo" />
        </Form.Item>
        <Form.Item
          label="Año"
          name="year"
          rules={[
            { required: true, message: "El año es obligatorio" },
            {
              pattern: /^(19|20)\d{2}$/,
              message:
                "El año debe estar en el formato de 4 dígitos (Ej: 2023)",
            },
          ]}
          validateTrigger="onBlur"
        >
          <Input placeholder="Ingrese año (Ej: 2023)" />
        </Form.Item>
        <Form.Item
          label="Placa"
          name="placa"
          rules={[{ required: true, message: "La placa es obligatoria" }]}
        >
          <Input placeholder="Ingrese placa" />
        </Form.Item>
        <Form.Item
          label="Capacidad"
          name="capacidad"
          rules={[
            { required: true, message: "La capacidad es obligatoria" },
            {
              pattern: /^[0-9]+$/,
              message: "Solo se permiten números",
            },
          ]}
        >
          <Input placeholder="Ingrese capacidad" />
        </Form.Item>
        <Form.Item
          label="Tipo de Vehículo"
          name="tipoVehiculo"
          rules={[
            { required: true, message: "El tipo de vehículo es obligatorio" },
          ]}
        >
          <Select placeholder="Seleccione el tipo de vehículo">
            <Select.Option value="sedan">Sedán</Select.Option>
            <Select.Option value="microbus">Microbús</Select.Option>
            <Select.Option value="coaster">Coaster</Select.Option>
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
        <Form.Item
          label="Foto del Vehículo"
          name="fotoVehiculo"
          rules={[
            { required: true, message: "La foto del vehículo es obligatoria" },
          ]}
        >
          <Upload
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleChange}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Seleccionar Imagen</Button>
          </Upload>
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
