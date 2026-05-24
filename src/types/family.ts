export interface Person {
  name: string;
  mobile?: string;
  email?: string;
}

export interface Parent {
  name: string;
  occupation?: string;
  income?: number;
  education?: string;
  mobile?: string;
}

export interface CoResident {
  _id?: string;
  name: string;
  relation?: string;
  age?: number;
  occupation?: string;
  mobile?: string;
}

export interface Child {
  _id?: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  dob?: string;
  studentType?: 'School' | 'College';
  school: {
    name?: string;
    medium: 'Hindi' | 'English' | 'Gujarati' | 'Other';
    board?: string;
  };
  course?: string;
  currentStd?: string;
  passOutYear?: number;
  percentage?: number;
  isStudying: boolean;
}

export interface Address {
  houseNo?: string;
  street?: string;
  village?: string;
  city: string;
  district: string;
  state: string;
  pincode?: string;
}

export interface Family {
  _id: string;
  headOfFamily: Person;
  address: Address;
  parents: {
    father: Parent;
    mother: Parent;
  };
  coResidents: CoResident[];
  children: Child[];
  totalFamilyIncome: number;
  createdAt: string;
  updatedAt: string;
}
