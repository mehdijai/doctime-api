enum DoctorStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  SUSPENDED = 'SUSPENDED',
}

declare interface IDoctor {
  id: string;
  user?: IUser;
  status: DoctorStatus;
  address: string;
  mapPosition?: ICoordinates;
  specialty: string;
  biography?: string;
  pictureUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  patients?: IPatient[];
}

declare interface ISearchDoctor {
  name?: string;
  email?: string;
  phone?: string;
  status?: DoctorStatus;
  address?: string;
  nearMe?: {
    lat: number;
    lng: number;
  };
  specialty?: string;
}
