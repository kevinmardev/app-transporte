export interface IRuta {

    ID:string
    destinoRuta: string;
    estado: string;
    idConductor: string;
    idVehiculo: string;
    nombreRuta: string;
    origenRuta: string;
    tipoViaje: string;
  }

  export interface IRutaModalUpdate{
    ID:string
    nombreRuta: string;
    
  }


  export interface IModalRuta {
    ruta?: IRuta;
    isModalOpen: boolean;
    setIsModalOpen: (estado: boolean) => void;
    setIsRelaod:(estado: boolean) => void;
  }