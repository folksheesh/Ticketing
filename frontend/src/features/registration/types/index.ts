export type TShirtSize = 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL';

export type MaritalStatus = 'Single' | 'Family';

export interface ChildData {
  id: string;
  name: string;
  age: number; // in years, to determine if they get Ice Cream
  tshirtSize: TShirtSize;
}

export interface PersonalData {
  fullName: string;
  nik: string;
  division: string;
  email: string;
  phone: string;
  tshirtSize: TShirtSize | '';
  maritalStatus: MaritalStatus | '';
}

export interface FamilyData {
  hasSpouse: boolean;
  spouseName?: string;
  hasChildren: boolean;
  children: ChildData[];
}

export interface RegistrationState {
  currentStep: number;
  personalData: PersonalData;
  familyData: FamilyData;
  
  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setPersonalData: (data: Partial<PersonalData>) => void;
  setFamilyData: (data: Partial<FamilyData>) => void;
  reset: () => void;
}
