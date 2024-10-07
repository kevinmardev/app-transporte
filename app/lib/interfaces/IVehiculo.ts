export interface IVehiculo {
  capacidad: string;
  ID:string
  fotoVehiculo: string;
  marca: string;
  modelo: string;
  placa: string;
  tipoVehiculo: string;
  year: string;
  estado:boolean
}

export interface IVehiculoModalUpdate{
  ID:string
  tipoVehiculo:string
}

export interface IModalVehiculo {
  vehiculo?: IVehiculo;
  isModalOpen: boolean;
  setIsModalOpen: (estado: boolean) => void;
  setIsRelaod:(estado: boolean) => void;
}

