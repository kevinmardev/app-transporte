export interface IViaje {
    ID: string;               // ID del viaje
    nombreViaje: string;      // Nombre del viaje
    fechaRecogida: string;    // Fecha de recogida (puede ser string o Date según cómo la manejes)
    fechaLlegada: string;     // Fecha de llegada (puede ser string o Date según cómo la manejes)
    idConductor: string;      // ID del conductor
    idVehiculo: string;       // ID del vehículo
    idRuta: string;           // ID de la ruta
    estado: boolean;          // Estado del viaje (activo o inactivo)


  }
  
  
  export interface IModalViaje {
    viaje?: IViaje;
    isModalOpen: boolean;
    setIsModalOpen: (estado: boolean) => void;
    setIsRelaod:(estado: boolean) => void;
    
  }