enum Gender {
  Male = 'Male',
  Female = 'Female',
}

declare interface IPublicPatient {
  id: string;
  user: IUser;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  createdAt: Date;
  updatedAt: Date;
}

declare interface IPrivatePatient extends IPublicPatient {
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  allergies?: string;
  currentMedication?: string;
  familyMedicalHistory?: string;
  pastMedicalHistory?: string;
  identificationType?: string;
  identificationNumber?: string;
  identificationUrl?: string;
  privacyConsent?: boolean;
  doctors?: IDoctor[];
}
