import { createContext, useContext, useState, ReactNode } from 'react';
import { Member } from './types';

interface MemberContextType {
  members: Member[];
  addMember: (member: Member) => void;
  updateMember: (id: string, member: Member) => void;
  deleteMember: (id: string) => void;
  getMember: (id: string) => Member | undefined;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

const sampleMembers: Member[] = [
  {
    id: '1',
    photo: null,
    memberCode: 'AVN001',
    registrationDate: '15-01-2024',
    animalType: 'Cow',
    gender: 'Male',
    firstName: 'Rajesh',
    surname: 'Kumar',
    aadharNumber: '1234 5678 9012',
    mobileNumber: '9876543210',
    bankName: 'State Bank of India',
    accountNumber: '12345678901234',
    ifscCode: 'SBIN0001234',
    branchName: 'Chennai Main Branch',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    photo: null,
    memberCode: 'AVN002',
    registrationDate: '20-02-2024',
    animalType: 'Cow',
    gender: 'Female',
    firstName: 'Lakshmi',
    surname: 'Devi',
    aadharNumber: '2345 6789 0123',
    mobileNumber: '9876543211',
    bankName: 'HDFC Bank',
    accountNumber: '50100012345678',
    ifscCode: 'HDFC0001234',
    branchName: 'Coimbatore Branch',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    photo: null,
    memberCode: 'AVN003',
    registrationDate: '10-03-2024',
    animalType: 'Buffalo',
    gender: 'Male',
    firstName: 'Murugan',
    surname: 'Selvam',
    aadharNumber: '3456 7890 1234',
    mobileNumber: '9876543212',
    bankName: 'Indian Bank',
    accountNumber: '60123456789012',
    ifscCode: 'IDIB0001234',
    branchName: 'Madurai Branch',
    createdAt: '2024-03-10',
  },
];

export function MemberProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>(sampleMembers);

  const addMember = (member: Member) => {
    setMembers((prev) => [...prev, member]);
  };

  const updateMember = (id: string, updatedMember: Member) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? updatedMember : m)));
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const getMember = (id: string) => {
    return members.find((m) => m.id === id);
  };

  return (
    <MemberContext.Provider value={{ members, addMember, updateMember, deleteMember, getMember }}>
      {children}
    </MemberContext.Provider>
  );
}

export function useMembers() {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error('useMembers must be used within a MemberProvider');
  }
  return context;
}
