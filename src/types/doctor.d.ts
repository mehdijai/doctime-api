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
