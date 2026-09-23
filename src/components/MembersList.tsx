import { useState } from 'react';
import { useMembers } from '../store';
import { Member, ViewMode } from '../types';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  FileSpreadsheet,
  FileText,
  Printer,
  Eye,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface MembersListProps {
  setCurrentView: (view: ViewMode) => void;
  setEditingMember: (member: Member | null) => void;
}

export default function MembersList({ setCurrentView, setEditingMember }: MembersListProps) {
  const { members, deleteMember } = useMembers();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnimalType, setFilterAnimalType] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewMember, setViewMember] = useState<Member | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 8;

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.memberCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.aadharNumber.includes(searchTerm) ||
      member.mobileNumber.includes(searchTerm);
    const matchesAnimal = !filterAnimalType || member.animalType === filterAnimalType;
    const matchesGender = !filterGender || member.gender === filterGender;
    return matchesSearch && matchesAnimal && matchesGender;
  });

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setCurrentView('edit');
  };

  const handleDelete = (id: string) => {
    deleteMember(id);
    setDeleteConfirm(null);
  };

  const toggleSelectAll = () => {
    if (selectedMembers.length === paginatedMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(paginatedMembers.map((m) => m.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const exportToExcel = () => {
    const data = (selectedMembers.length > 0
      ? members.filter((m) => selectedMembers.includes(m.id))
      : filteredMembers
    ).map((m) => ({
      'Member Code': m.memberCode,
      'Registration Date': m.registrationDate,
      'Animal Type': m.animalType,
      Gender: m.gender,
      'First Name': m.firstName,
      Surname: m.surname,
      'Aadhar Number': m.aadharNumber,
      'Mobile Number': m.mobileNumber,
      'Bank Name': m.bankName,
      'Account Number': m.accountNumber,
      'IFSC Code': m.ifscCode,
      'Branch Name': m.branchName,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Members');
    XLSX.writeFile(wb, 'aavin_members.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const data = (selectedMembers.length > 0
      ? members.filter((m) => selectedMembers.includes(m.id))
      : filteredMembers
    ).map((m) => [
      m.memberCode,
      m.registrationDate,
      m.animalType,
      m.gender,
      `${m.firstName} ${m.surname}`,
      m.aadharNumber,
      m.mobileNumber,
    ]);

    // Title
    doc.setFontSize(18);
    doc.setTextColor(30, 64, 175);
    doc.text('AAVIN Producer Management System', 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('Know Your Customer - Members Report', 14, 30);
    doc.setFontSize(9);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 37);

    // Table
    (doc as any).autoTable({
      startY: 45,
      head: [['Code', 'Reg. Date', 'Animal', 'Gender', 'Name', 'Aadhar', 'Mobile']],
      body: data,
      theme: 'grid',
      headStyles: { fillColor: [30, 64, 175], textColor: 255 },
      styles: { fontSize: 8 },
    });

    doc.save('aavin_members.pdf');
  };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>AAVIN Members - Print</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1e40af; font-size: 20px; }
            h2 { color: #666; font-size: 14px; margin-top: -10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
            th { background: #1e40af; color: white; padding: 8px; text-align: left; }
            td { padding: 6px 8px; border: 1px solid #ddd; }
            tr:nth-child(even) { background: #f9fafb; }
            .footer { margin-top: 20px; font-size: 10px; color: #999; }
          </style>
        </head>
        <body>
          <h1>AAVIN Producer Management System</h1>
          <h2>Know Your Customer - Members Report</h2>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Reg. Date</th>
                <th>Animal</th>
                <th>Gender</th>
                <th>Name</th>
                <th>Aadhar</th>
                <th>Mobile</th>
                <th>Bank</th>
                <th>Account</th>
                <th>IFSC</th>
                <th>Branch</th>
              </tr>
            </thead>
            <tbody>
              ${(selectedMembers.length > 0
                ? members.filter((m) => selectedMembers.includes(m.id))
                : filteredMembers
              )
                .map(
                  (m) => `
                <tr>
                  <td>${m.memberCode}</td>
                  <td>${m.registrationDate}</td>
                  <td>${m.animalType}</td>
                  <td>${m.gender}</td>
                  <td>${m.firstName} ${m.surname}</td>
                  <td>${m.aadharNumber}</td>
                  <td>${m.mobileNumber}</td>
                  <td>${m.bankName}</td>
                  <td>${m.accountNumber}</td>
                  <td>${m.ifscCode}</td>
                  <td>${m.branchName}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Total Members: ${
              selectedMembers.length > 0 ? selectedMembers.length : filteredMembers.length
            } | Generated: ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, code, aadhar, mobile..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors ${
                showFilters || filterAnimalType || filterGender
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              title="Export to Excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">XLS</span>
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              title="Export to PDF"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
              title="Print"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={() => {
                setEditingMember(null);
                setCurrentView('add');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Member
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-3">
            <select
              value={filterAnimalType}
              onChange={(e) => {
                setFilterAnimalType(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Animal Types</option>
              <option value="Cow">Cow</option>
              <option value="Buffalo">Buffalo</option>
              <option value="Goat">Goat</option>
            </select>
            <select
              value={filterGender}
              onChange={(e) => {
                setFilterGender(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {(filterAnimalType || filterGender) && (
              <button
                onClick={() => {
                  setFilterAnimalType('');
                  setFilterGender('');
                }}
                className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                <X className="w-3 h-3" />
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase">Total Members</p>
          <p className="text-2xl font-bold text-gray-800">{members.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase">Cow</p>
          <p className="text-2xl font-bold text-blue-600">
            {members.filter((m) => m.animalType === 'Cow').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase">Buffalo</p>
          <p className="text-2xl font-bold text-purple-600">
            {members.filter((m) => m.animalType === 'Buffalo').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase">Filtered</p>
          <p className="text-2xl font-bold text-green-600">{filteredMembers.length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedMembers.length === paginatedMembers.length && paginatedMembers.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Photo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Reg. Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Animal</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Mobile</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMembers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-12 h-12 text-gray-300" />
                      <p>No members found</p>
                      <button
                        onClick={() => {
                          setEditingMember(null);
                          setCurrentView('add');
                        }}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        Add First Member
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member.id)}
                        onChange={() => toggleSelect(member.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        {member.firstName.charAt(0)}
                        {member.surname.charAt(0)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-mono font-medium">
                        {member.memberCode}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-800">
                        {member.firstName} {member.surname}
                      </p>
                      <p className="text-xs text-gray-500">{member.gender}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{member.registrationDate}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          member.animalType === 'Cow'
                            ? 'bg-green-100 text-green-700'
                            : member.animalType === 'Buffalo'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {member.animalType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{member.mobileNumber}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewMember(member)}
                          className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(member)}
                          className="p-1.5 rounded-lg hover:bg-yellow-100 text-yellow-600 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(member.id)}
                          className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredMembers.length)} of{' '}
              {filteredMembers.length} members
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Delete Member</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this member? All their information will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Member Modal */}
      {viewMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Member Details</h3>
              <button
                onClick={() => setViewMember(null)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                  {viewMember.firstName.charAt(0)}
                  {viewMember.surname.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">
                    {viewMember.firstName} {viewMember.surname}
                  </h4>
                  <p className="text-sm text-gray-500">Code: {viewMember.memberCode}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Registration Date" value={viewMember.registrationDate} />
                <DetailItem label="Animal Type" value={viewMember.animalType} />
                <DetailItem label="Gender" value={viewMember.gender} />
                <DetailItem label="Aadhar Number" value={viewMember.aadharNumber} />
                <DetailItem label="Mobile Number" value={viewMember.mobileNumber} />
                <DetailItem label="Bank Name" value={viewMember.bankName} />
                <DetailItem label="Account Number" value={viewMember.accountNumber} />
                <DetailItem label="IFSC Code" value={viewMember.ifscCode} />
                <DetailItem label="Branch Name" value={viewMember.branchName} />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  handleEdit(viewMember);
                  setViewMember(null);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Edit Member
              </button>
              <button
                onClick={() => setViewMember(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}
