import { Upload, Button, Form, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { storage } from "@/app/lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const ImageUploadForm = () => {
  const [fileList, setFileList] = useState([]);

  const handleChange = ({ fileList }: any) => setFileList(fileList);

  const handleUpload = () => {
    if (fileList.length === 0) {
      message.error("Por favor, seleccione una imagen para subir");
      return;
    }
    // Aquí puedes implementar la lógica para subir la imagen a un servidor o a Firebase
    //console.log(fileList[0]); // Primer archivo seleccionado
    subirFoto(fileList[0]);
    message.success("Imagen subida con éxito");
  };

  async function subirFoto(file: File) {
    const storageRef = ref(storage, `images/${file.name}`); // Creas una referencia al archivo

    try {
      // Subes la imagen a Firebase Storage
      const snapshot = await uploadBytes(storageRef, file);

      // Obtienes la URL de descarga del archivo subido
      const url = await getDownloadURL(snapshot.ref);

      console.log("Foto subida exitosamente. URL de descarga:", url);
      return url; // Retornas la URL para guardarla en Firestore
    } catch (error) {
      console.error("Error al subir la foto:", error);
    }
  }

  return (
    <>
      <Form.Item label="Imagen">
        <Upload
          fileList={fileList}
          beforeUpload={() => false} // Evita la carga automática
          onChange={handleChange}
        >
          <Button icon={<UploadOutlined />}>Seleccionar Imagen</Button>
        </Upload>
      </Form.Item>
    </>
  );
};

export default ImageUploadForm;
