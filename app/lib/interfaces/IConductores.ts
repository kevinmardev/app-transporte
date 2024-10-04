import { Interface } from "readline";

export interface IFormCamion{
    nombre: string;
    ID:string
    direccion:string
    DUI:string
    edad:string
    fotoDeConductor:string
    licencia:string
    estado:boolean
    telefono:string
    correo:string

}

export interface IModalConductores {
    conductor?: IFormCamion
    isModalOpen: boolean;
    setIsModalOpen: (estado: boolean) => void;
    setIsRelaod:(estado: boolean) => void;
  }

  export interface IsReload{
    isReload:boolean
    setIsRelaod:(estado: boolean) => void;
  }


  