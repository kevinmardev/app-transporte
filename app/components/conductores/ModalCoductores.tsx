import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Switch,
  Upload,
  UploadFile,
} from "antd";
import React, { useState } from "react";
import {
  IFormCamion,
  IModalConductores,
  IsReload,
} from "../../lib/interfaces/IConductores";
import { addDoc, collection } from "firebase/firestore";
import { UploadOutlined } from "@ant-design/icons";
import { db, storage } from "../../lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function ModalCoductores({
  setIsModalOpen,
  isModalOpen,
  setIsRelaod,
}: IModalConductores) {
  const [form] = Form.useForm();

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange = ({ fileList }: any) => setFileList(fileList);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const subirFoto = async (file: File) => {
    const storageRef = ref(storage, `conductores/${file.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, file); //se sube la imagen a firestore
      const url = await getDownloadURL(snapshot.ref); // obtiene la URL de la imagen subida
      return url; // Retorna la URL para guardarla en Firestore
    } catch (error) {
      console.error("Error al subir la foto:", error);
    }
  };
  const onFinish = async (values: IFormCamion) => {
    if (fileList.length === 0) {
      message.error("Por favor, selecciona una imagen para el vehículo.");
      return;
    }

    try {
      // Subir la foto y obtener la URL
      const urlFoto = await subirFoto(fileList[0].originFileObj as File); // Usa el archivo original para subir
      if (urlFoto) {
        // Agregar el vehículo a Firestore junto con la URL de la foto
        await agregarDato({ ...values, fotoDeConductor: urlFoto });
      }

      setIsModalOpen(false);
      setIsRelaod(true);
      form.resetFields();
      setFileList([]); // Limpia la foto seleccionada
      message.success("Vehículo agregado correctamente");
    } catch (error) {
      message.error("Error al agregar el vehículo");
    }
  };

  async function agregarDato(conductor: IFormCamion) {
    if (conductor) {
      try {
        const docRef = await addDoc(collection(db, "Conductores"), {
          nombre: conductor.nombre,
          direccion: conductor.direccion,
          edad: conductor.edad,
          DUI: conductor.DUI,
          licencia: conductor.licencia,
          fotoDeConductor: conductor.fotoDeConductor,
          telefono: conductor.telefono,
          estado: conductor.estado,
          correo: conductor.correo,
        });
        console.log("Documento agregado con ID: ", docRef.id);
      } catch (e) {
        console.error("Error al agregar el documento: ", e);
      }
    }
  }

  return (
    <>
      <Modal title="Nuevo Conductor" open={isModalOpen} footer={null}>
        <Form form={form} name="control-ref" onFinish={onFinish}>
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[
              { required: true, message: "El nombre es obligatorio" },
              {
                pattern: /^[a-zA-Z\s]+$/,
                message: "Solo se permiten letras y espacios",
              },
            ]}
          >
            <Input placeholder="ingrese nombre" />
          </Form.Item>
          <Form.Item
            label="direccion"
            name="direccion"
            rules={[{ required: true, message: "La direccion es obligatorio" }]}
          >
            <Input placeholder="ingrese direccion" />
          </Form.Item>
          <Form.Item
            label="DUI"
            name="DUI"
            rules={[
              { required: true, message: "El DUI es obligatorio" },
              {
                pattern: /^[0-9]{8}-[0-9]$/,
                message:
                  "El formato debe ser 8 números, un guion y un número (Ej: 12345678-9)",
              },
            ]}
            validateTrigger="onBlur" // Valida al perder el foco
          >
            <Input placeholder="Ingrese DUI (Ej: 12345678-9)" />
          </Form.Item>

          <Form.Item
            label="edad"
            name="edad"
            rules={[
              { required: true, message: "La edad es obligatorio" },
              {
                pattern: /^[0-9]+$/,
                message: "Solo se permiten números",
              },
            ]}
          >
            <Input placeholder="ingrese edad" />
          </Form.Item>

          <Form.Item
            label="licencia"
            name="licencia"
            rules={[{ required: true, message: "La licencia es obligatorio" }]}
          >
            <Input placeholder="ingrese licencia" />
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
            label="Teléfono"
            name="telefono"
            rules={[
              { required: true, message: "El teléfono es obligatorio" },
              {
                pattern: /^[0-9]{4}-[0-9]{4}$/,
                message:
                  "El formato debe ser 4 números, un guion y 4 números (Ej: 1234-5678)",
              },
            ]}
            validateTrigger="onBlur" // Valida cuando el campo pierde el foco
          >
            <Input placeholder="Ingrese teléfono (Ej: 1234-5678)" />
          </Form.Item>
          <Form.Item
            label="Correo electrónico"
            name="correo"
            rules={[
              { required: true, message: "El correo es obligatorio" },
              {
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Por favor ingrese un correo válido",
              },
            ]}
            validateTrigger="onBlur"
          >
            <Input placeholder="Ingrese su correo" />
          </Form.Item>
          <Form.Item
            label="fotoDeConductor"
            name="fotoDeConductor"
            rules={[
              { required: true, message: "El fotoDeConductor es obligatorio" },
            ]}
          >
            <Upload
              fileList={fileList}
              beforeUpload={() => false} // Evita la carga automática
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
    </>
  );
}
