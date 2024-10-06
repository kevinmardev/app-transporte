import { storage } from "@/app/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState, FormEvent } from "react";

export default function SubidaImagen() {
  const [image, setImage] = useState<File | null>(null); // Estado para almacenar el archivo

  // Función para subir una foto a Firebase Storage
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
  // Función para guardar la URL de la imagen en Firestore
  async function guardarEnFirestore(url: string) {
    const db = getFirestore(); // Inicializas Firestore
    const docRef = doc(db, "Conductores", "jFtAa2DhHUW9afWuDR14"); // Referencia al documento con el ID específico

    try {
      // Actualizas el campo "fotoDeConductor" en el documento
      await updateDoc(docRef, {
        fotoDeConductor: url,
      });

      console.log("URL guardada en Firestore exitosamente.");
    } catch (error) {
      console.error("Error al guardar la URL en Firestore:", error);
    }
  }

  // Manejar el envío del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Evitas que se recargue la página
    if (image) {
      const url = await subirFoto(image); // Llamas a la función de subir foto con el archivo seleccionado
      if (url) {
        guardarEnFirestore(url);
      }
    } else {
      console.log("No se ha seleccionado ninguna imagen");
    }
  };

  // Manejar el cambio de archivo seleccionado
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]); // Guardas el archivo seleccionado en el estado
    }
  };

  return (
    <>
      <label>Imagen</label>
      <input type="file" name="file" onChange={handleFileChange} />
      <button type="submit" onClick={handleSubmit}>
        Subir imagen
      </button>
    </>
  );
}
