enum AppointmentStatus {
  PENDING = 'PENDING',
  SCHEDULED = 'SCHEDULED',
  CANCELLED = 'CANCELLED',
}

declare interface IAppointment {
  id: string;
  doctor: IDoctor;
  patient: IPublicPatient;
  schedule: Date;
  status: AppointmentStatus;
  reason: string;
  note?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
