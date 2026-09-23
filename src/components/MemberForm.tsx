import { useState, useRef } from 'react';
import { useMembers } from '../store';
import { Member, ViewMode } from '../types';
import {
  Save,
  ArrowLeft,
  Camera,
  X,
  User,
  Calendar,
  PawPrint,
  CreditCard,
  Building2,
} from 'lucide-react';

interface MemberFormProps {
  mode: ViewMode;
  editingMember: Member | null;
  setCurrentView: (view: ViewMode) => void;
  setEditingMember: (member: Member | null) => void;
}

export default function MemberForm({ mode, editingMember, setCurrentView, setEditingMember }: MemberFormProps) {
  const { addMember, updateMember } = useMembers();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Omit<Member, 'id' | 'createdAt'>>({
    photo: editingMember?.photo || null,
    memberCode: editingMember?.memberCode || '',
    registrationDate: editingMember?.registrationDate || new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
    animalType: editingMember?.animalType || 'Cow',
    gender: editingMember?.gender || 'Male',
    firstName: editingMember?.firstName || '',
    surname: editingMember?.surname || '',
    aadharNumber: editingMember?.aadharNumber || '',
    mobileNumber: editingMember?.mobileNumber || '',
    bankName: editingMember?.bankName || '',
    accountNumber: editingMember?.accountNumber || '',
    ifscCode: editingMember?.ifscCode || '',
    branchName: editingMember?.branchName || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.memberCode.trim()) newErrors.memberCode = 'Member code is required';
    if (!formData.registrationDate.trim()) newErrors.registrationDate = 'Registration date is required';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.surname.trim()) newErrors.surname = 'Surname is required';
    if (!formData.aadharNumber.trim()) newErrors.aadharNumber = 'Aadhar number is required';
    else if (formData.aadharNumber.replace(/\s/g, '').length !== 12)
      newErrors.aadharNumber = 'Aadhar must be 12 digits';
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number is required';
    else if (formData.mobileNumber.length !== 10)
      newErrors.mobileNumber = 'Mobile must be 10 digits';
    if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required';
    if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
    if (!formData.ifscCode.trim()) newErrors.ifscCode = 'IFSC code is required';
    if (!formData.branchName.trim()) newErrors.branchName = 'Branch name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (mode === 'edit' && editingMember) {
      updateMember(editingMember.id, {
        ...formData,
        id: editingMember.id,
        createdAt: editingMember.createdAt,
      });
    } else {
      const newMember: Member = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
      };
      addMember(newMember);
    }

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setEditingMember(null);
      setCurrentView('list');
    }, 1500);
  };

  const handleCancel = () => {
    setEditingMember(null);
    setCurrentView('list');
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Save className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            {mode === 'edit' ? 'Member Updated!' : 'Member Added!'}
          </h3>
          <p className="text-gray-500 mt-2">Redirecting to members list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {mode === 'edit' ? 'Edit Member' : 'Add New Member'}
              </h2>
              <p className="text-xs text-gray-500">
                {mode === 'edit' ? 'Update member information' : 'Register a new producer member'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Photo & Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-700 uppercase">Personal Information</h3>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Photo Upload */}
            <div className="flex flex-col items-center gap-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-28 h-28 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors overflow-hidden"
              >
                {formData.photo ? (
                  <img src={formData.photo} alt="Member" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <Camera className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-xs text-gray-400 mt-1">Upload</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              {formData.photo && (
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, photo: null }))}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remove Photo
                </button>
              )}
            </div>

            {/* Form Fields */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Member Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.memberCode}
                  onChange={(e) => handleChange('memberCode', e.target.value.toUpperCase())}
                  placeholder="e.g., AVN001"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.memberCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.memberCode && <p className="text-xs text-red-500 mt-1">{errors.memberCode}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  Registration Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.registrationDate}
                  onChange={(e) => handleChange('registrationDate', e.target.value)}
                  placeholder="dd-mm-yyyy"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.registrationDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.registrationDate && (
                  <p className="text-xs text-red-500 mt-1">{errors.registrationDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <PawPrint className="w-3 h-3 inline mr-1" />
                  Animal Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.animalType}
                  onChange={(e) => handleChange('animalType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Cow">Cow</option>
                  <option value="Buffalo">Buffalo</option>
                  <option value="Goat">Goat</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="Enter first name"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Surname <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.surname}
                  onChange={(e) => handleChange('surname', e.target.value)}
                  placeholder="Enter surname"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.surname ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.surname && <p className="text-xs text-red-500 mt-1">{errors.surname}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aadhar Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.aadharNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                    const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
                    handleChange('aadharNumber', formatted);
                  }}
                  placeholder="XXXX XXXX XXXX"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.aadharNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.aadharNumber && (
                  <p className="text-xs text-red-500 mt-1">{errors.aadharNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.mobileNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    handleChange('mobileNumber', val);
                  }}
                  placeholder="10-digit mobile"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.mobileNumber && (
                  <p className="text-xs text-red-500 mt-1">{errors.mobileNumber}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-700 uppercase">Bank Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
                placeholder="Enter bank name"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.bankName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.bankName && <p className="text-xs text-red-500 mt-1">{errors.bankName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <CreditCard className="w-3 h-3 inline mr-1" />
                Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => handleChange('accountNumber', e.target.value)}
                placeholder="Enter account number"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.accountNumber && (
                <p className="text-xs text-red-500 mt-1">{errors.accountNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IFSC Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.ifscCode}
                onChange={(e) => handleChange('ifscCode', e.target.value.toUpperCase())}
                placeholder="e.g., SBIN0001234"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.ifscCode ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.ifscCode && <p className="text-xs text-red-500 mt-1">{errors.ifscCode}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.branchName}
                onChange={(e) => handleChange('branchName', e.target.value)}
                placeholder="Enter branch name"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.branchName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.branchName && <p className="text-xs text-red-500 mt-1">{errors.branchName}</p>}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            {mode === 'edit' ? 'Update Member' : 'Save Member'}
          </button>
        </div>
      </form>
    </div>
  );
}
