import { UploadOutlined } from "@ant-design/icons";
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
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { db, storage } from "../../lib/firebase";
import {
  IFormCamion,
  IModalConductores,
} from "../../lib/interfaces/IConductores";

export default function ModalUpdateCoductores({
  setIsModalOpen,
  isModalOpen,
  setIsRelaod,
  conductor,
}: IModalConductores) {
  const [form] = Form.useForm();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const handleChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList); // Aquí actualizamos la lista de archivos
  };

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
    console.log("Finish ", values);
    if (conductor) {
      let urlFoto: unknown = conductor.fotoDeConductor; // Mantener la URL existente si no se actualiza la foto

      // Verificar si hay una nueva imagen para subir
      if (fileList.length > 0 && fileList[0].originFileObj) {
        // Subir la nueva imagen a Firebase Storage y obtener la URL
        urlFoto = await subirFoto(fileList[0].originFileObj as File);
      }
      try {
        // Crear referencia al documento del usuario
        const usuarioRef = doc(db, "Conductores", conductor.ID);
        // Actualizar el documento con los nuevos valores
        await updateDoc(usuarioRef, {
          nombre: values.nombre,
          direccion: values.direccion,
          edad: values.edad,
          DUI: values.DUI,
          licencia: values.licencia,
          fotoDeConductor: urlFoto,
          telefono: values.telefono,
          estado: values.estado,
          correo: values.correo,
        });
        console.log("Usuario actualizado correctamente.");
      } catch (error) {
        console.error("Error al actualizar el usuario:", error);
      }
    }
    setIsModalOpen(false);
    setIsRelaod(true);
    message.success("Conductor actualizado correctamente");
  };

  useEffect(() => {
    if (isModalOpen && conductor) {
      // Establecer los valores del formulario con los datos del conductor
      form.setFieldsValue(conductor);

      // Si el conductor ya tiene una foto almacenada, se configura el `fileList`
      if (conductor.fotoDeConductor) {
        setFileList([
          {
            uid: "-1", // Un identificador único para este archivo
            name: "", // Nombre del archivo (puedes usar el nombre de la propiedad o el archivo)
            status: "done", // Estado del archivo (ya subido)
            url: conductor.fotoDeConductor, // La URL de la foto ya subida
          },
        ]);
      } else {
        // Si no hay foto previa, limpiar el `fileList`
        setFileList([]);
      }
    }
  }, [isModalOpen, conductor, form]);

  return (
    <>
      <Modal title="Actualizar Conductor" open={isModalOpen} footer={null}>
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
            label="Dirección"
            name="direccion"
            rules={[{ required: true, message: "La direccion es obligatoria" }]}
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
            label="Edad"
            name="edad"
            rules={[
              { required: true, message: "La edad es obligatoria" },
              {
                pattern: /^[0-9]+$/,
                message: "Solo se permiten números",
              },
            ]}
          >
            <Input placeholder="ingrese edad" />
          </Form.Item>

          <Form.Item
            label="Licencia"
            name="licencia"
            rules={[{ required: true, message: "La licencia es obligatoria" }]}
          >
            <Input placeholder="ingrese licencia" />
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
              {
                required: true,
                message: "La Foto del conductor es obligatorio",
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
