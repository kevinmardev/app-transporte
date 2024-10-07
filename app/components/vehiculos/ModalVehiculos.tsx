import { db, storage } from "@/app/lib/firebase";
import { IModalVehiculo, IVehiculo } from "@/app/lib/interfaces/IVehiculo";
import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Switch,
  Upload,
  UploadFile,
} from "antd";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";

export default function ModalVehiculos({
  setIsModalOpen,
  isModalOpen,
  setIsRelaod,
}: IModalVehiculo) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange = ({ fileList }: any) => setFileList(fileList);

  const subirFoto = async (file: File) => {
    const storageRef = ref(storage, `camiones/${file.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, file); //se sube la imagen a firestore
      const url = await getDownloadURL(snapshot.ref); // obtiene la URL de la imagen subida
      return url; // Retorna la URL para guardarla en Firestore
    } catch (error) {
      console.error("Error al subir la foto:", error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values: IVehiculo) => {
    if (fileList.length === 0) {
      message.error("Por favor, selecciona una imagen para el vehículo.");
      return;
    }

    try {
      // Subir la foto y obtener la URL
      const urlFoto = await subirFoto(fileList[0].originFileObj as File); // Usa el archivo original para subir
      if (urlFoto) {
        // Agregar el vehículo a Firestore junto con la URL de la foto
        await agregarDato({ ...values, fotoVehiculo: urlFoto });
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

  async function agregarDato(vehiculo: IVehiculo) {
    if (vehiculo) {
      try {
        const docRef = await addDoc(collection(db, "Camiones"), {
          marca: vehiculo.marca,
          modelo: vehiculo.modelo,
          year: vehiculo.year,
          placa: vehiculo.placa,
          capacidad: vehiculo.capacidad,
          tipoVehiculo: vehiculo.tipoVehiculo,
          fotoVehiculo: vehiculo.fotoVehiculo,
          estado: vehiculo.estado,
        });
        console.log("Documento agregado con ID: ", docRef.id);
      } catch (e) {
        console.error("Error al agregar el documento: ", e);
      }
    }
  }

  return (
    <>
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
            label="Modelo"
            name="modelo"
            rules={[{ required: true, message: "El modelo es obligatorio" }]}
          >
            <Input placeholder="ingrese modelo" />
          </Form.Item>
          <Form.Item
            label="Año"
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
            label="Placa"
            name="placa"
            rules={[{ required: true, message: "La placa es obligatorio" }]}
          >
            <Input placeholder="ingrese placa" />
          </Form.Item>
          <Form.Item
            label="Capacidad"
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
            label="Tipo de Vehículo"
            name="tipoVehiculo"
            rules={[
              {
                required: true,
                message: "El tipo de Vehículo es obligatorio",
              },
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
            label="Foto del vehículo"
            name="fotoVehiculo"
            rules={[
              {
                required: true,
                message: "La foto del vehículo es obligatoria",
              },
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
