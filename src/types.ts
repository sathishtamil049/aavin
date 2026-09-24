export interface Member {
  id: string;
  photo: string | null;
  memberCode: string;
  registrationDate: string;
  animalType: 'Cow' | 'Buffalo' | 'Goat';
  gender: 'Male' | 'Female';
  firstName: string;
  surname: string;
  aadharNumber: string;
  mobileNumber: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  createdAt: string;
}

export type ViewMode = 'dashboard' | 'list' | 'add' | 'edit' | 'config';
