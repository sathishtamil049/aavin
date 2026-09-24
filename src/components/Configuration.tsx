import { useState } from 'react';
import {
  Settings,
  Save,
  Database,
  Shield,
  Bell,
  Palette,
  Globe,
  Printer,
  FileText,
  CheckCircle2,
} from 'lucide-react';

export default function Configuration() {
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const [config, setConfig] = useState({
    // General
    organizationName: 'Aavin Milk Producer Co-operative',
    societyCode: 'AVN-MPC-001',
    district: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    phone: '044-23456789',
    email: 'info@aavin-pms.in',

    // Member Settings
    memberCodePrefix: 'AVN',
    memberCodeStartFrom: 1,
    autoGenerateCode: true,
    requirePhoto: false,
    requireAadhar: true,
    aadharMasking: false,

    // Bank Settings
    defaultBank: 'State Bank of India',
    ifscAutoFetch: true,
    accountValidation: true,

    // Export Settings
    pdfHeader: 'AAVIN Producer Management System',
    pdfSubHeader: 'Know Your Customer - Members Report',
    pdfIncludePhoto: false,
    excelDateFormat: 'dd-mm-yyyy',
    pdfOrientation: 'landscape',

    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    newMemberAlert: true,
    monthlyReport: true,

    // System
    dataRetentionMonths: 60,
    backupFrequency: 'weekly',
    language: 'English',
    theme: 'light',
  });

  const handleChange = (field: string, value: string | boolean) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'member', label: 'Members', icon: Shield },
    { id: 'bank', label: 'Bank', icon: Database },
    { id: 'export', label: 'Export', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Globe },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Configuration</h2>
            <p className="text-xs text-gray-500">Manage system settings and preferences</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <SectionTitle icon={Settings} title="Organization Details" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Organization Name"
                  value={config.organizationName}
                  onChange={(v) => handleChange('organizationName', v)}
                />
                <InputField
                  label="Society Code"
                  value={config.societyCode}
                  onChange={(v) => handleChange('societyCode', v)}
                />
                <InputField
                  label="District"
                  value={config.district}
                  onChange={(v) => handleChange('district', v)}
                />
                <InputField
                  label="State"
                  value={config.state}
                  onChange={(v) => handleChange('state', v)}
                />
                <InputField
                  label="Pincode"
                  value={config.pincode}
                  onChange={(v) => handleChange('pincode', v)}
                />
                <InputField
                  label="Phone"
                  value={config.phone}
                  onChange={(v) => handleChange('phone', v)}
                />
                <InputField
                  label="Email"
                  value={config.email}
                  onChange={(v) => handleChange('email', v)}
                  type="email"
                />
              </div>
            </div>
          )}

          {/* Member Settings */}
          {activeTab === 'member' && (
            <div className="space-y-6">
              <SectionTitle icon={Shield} title="Member Settings" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Member Code Prefix"
                  value={config.memberCodePrefix}
                  onChange={(v) => handleChange('memberCodePrefix', v)}
                  placeholder="e.g., AVN"
                />
                <InputField
                  label="Start Member Code From"
                  value={config.memberCodeStartFrom.toString()}
                  onChange={(v) => handleChange('memberCodeStartFrom', v)}
                  type="number"
                />
              </div>
              <div className="space-y-3 mt-4">
                <ToggleField
                  label="Auto-Generate Member Code"
                  description="Automatically generate sequential member codes"
                  checked={config.autoGenerateCode}
                  onChange={(v) => handleChange('autoGenerateCode', v)}
                />
                <ToggleField
                  label="Require Photo"
                  description="Make photo upload mandatory for new members"
                  checked={config.requirePhoto}
                  onChange={(v) => handleChange('requirePhoto', v)}
                />
                <ToggleField
                  label="Require Aadhar"
                  description="Make Aadhar number mandatory"
                  checked={config.requireAadhar}
                  onChange={(v) => handleChange('requireAadhar', v)}
                />
                <ToggleField
                  label="Aadhar Masking"
                  description="Mask Aadhar number in displays (show only last 4 digits)"
                  checked={config.aadharMasking}
                  onChange={(v) => handleChange('aadharMasking', v)}
                />
              </div>
            </div>
          )}

          {/* Bank Settings */}
          {activeTab === 'bank' && (
            <div className="space-y-6">
              <SectionTitle icon={Database} title="Bank Settings" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Default Bank"
                  value={config.defaultBank}
                  onChange={(v) => handleChange('defaultBank', v)}
                />
              </div>
              <div className="space-y-3 mt-4">
                <ToggleField
                  label="IFSC Auto-Fetch"
                  description="Automatically fetch bank name and branch from IFSC code"
                  checked={config.ifscAutoFetch}
                  onChange={(v) => handleChange('ifscAutoFetch', v)}
                />
                <ToggleField
                  label="Account Number Validation"
                  description="Validate account number format before saving"
                  checked={config.accountValidation}
                  onChange={(v) => handleChange('accountValidation', v)}
                />
              </div>
            </div>
          )}

          {/* Export Settings */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <SectionTitle icon={FileText} title="Export & Print Settings" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="PDF Header Text"
                  value={config.pdfHeader}
                  onChange={(v) => handleChange('pdfHeader', v)}
                />
                <InputField
                  label="PDF Sub-Header Text"
                  value={config.pdfSubHeader}
                  onChange={(v) => handleChange('pdfSubHeader', v)}
                />
                <SelectField
                  label="Excel Date Format"
                  value={config.excelDateFormat}
                  onChange={(v) => handleChange('excelDateFormat', v)}
                  options={[
                    { value: 'dd-mm-yyyy', label: 'dd-mm-yyyy' },
                    { value: 'mm/dd/yyyy', label: 'mm/dd/yyyy' },
                    { value: 'yyyy-mm-dd', label: 'yyyy-mm-dd' },
                  ]}
                />
                <SelectField
                  label="PDF Orientation"
                  value={config.pdfOrientation}
                  onChange={(v) => handleChange('pdfOrientation', v)}
                  options={[
                    { value: 'landscape', label: 'Landscape' },
                    { value: 'portrait', label: 'Portrait' },
                  ]}
                />
              </div>
              <div className="space-y-3 mt-4">
                <ToggleField
                  label="Include Photo in PDF"
                  description="Include member photos in PDF export"
                  checked={config.pdfIncludePhoto}
                  onChange={(v) => handleChange('pdfIncludePhoto', v)}
                />
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Printer className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Print Preview</span>
                </div>
                <p className="text-xs text-blue-600">
                  PDF will be generated in {config.pdfOrientation} format with header: "{config.pdfHeader}"
                </p>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <SectionTitle icon={Bell} title="Notification Settings" />
              <div className="space-y-3">
                <ToggleField
                  label="Email Notifications"
                  description="Send email notifications for important events"
                  checked={config.emailNotifications}
                  onChange={(v) => handleChange('emailNotifications', v)}
                />
                <ToggleField
                  label="SMS Notifications"
                  description="Send SMS alerts to members"
                  checked={config.smsNotifications}
                  onChange={(v) => handleChange('smsNotifications', v)}
                />
                <ToggleField
                  label="New Member Alert"
                  description="Get notified when a new member is registered"
                  checked={config.newMemberAlert}
                  onChange={(v) => handleChange('newMemberAlert', v)}
                />
                <ToggleField
                  label="Monthly Report"
                  description="Automatically generate and send monthly reports"
                  checked={config.monthlyReport}
                  onChange={(v) => handleChange('monthlyReport', v)}
                />
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <SectionTitle icon={Globe} title="System Settings" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Data Retention (Months)"
                  value={config.dataRetentionMonths.toString()}
                  onChange={(v) => handleChange('dataRetentionMonths', v)}
                  type="number"
                />
                <SelectField
                  label="Backup Frequency"
                  value={config.backupFrequency}
                  onChange={(v) => handleChange('backupFrequency', v)}
                  options={[
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' },
                  ]}
                />
                <SelectField
                  label="Language"
                  value={config.language}
                  onChange={(v) => handleChange('language', v)}
                  options={[
                    { value: 'English', label: 'English' },
                    { value: 'Tamil', label: 'Tamil' },
                    { value: 'Hindi', label: 'Hindi' },
                  ]}
                />
                <SelectField
                  label="Theme"
                  value={config.theme}
                  onChange={(v) => handleChange('theme', v)}
                  options={[
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                  ]}
                />
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">System Info</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-amber-700">
                  <p>Version: 1.0.0</p>
                  <p>Build: 2024.01.15</p>
                  <p>Database: Local Storage</p>
                  <p>Members: Active</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
      <Icon className="w-4 h-4 text-blue-600" />
      <h3 className="text-sm font-semibold text-gray-700 uppercase">{title}</h3>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
