import React, { useState, useEffect } from 'react';
import {api} from '../../axios.config';
import { useNavigate } from "react-router-dom";

const HealthRecordForm = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    doctorId: '',
    diagnosis: '',
    treatment: '',
    prescription: '',
    date: '',
    isManualUpload: false,
    externalDoctorName: '',
    externalHospitalName: '',
  });
  const [attachments, setAttachments] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
 

  

  // Set default date to today's date when component mounts
  useEffect(() => {
    if (!formData.date) {
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, date: today }));
    }
  }, [formData.date]);
 
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setAttachments(files);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
  
    const submissionData = new FormData();
    submissionData.append('studentId', formData.studentId);
    submissionData.append('doctorId', formData.doctorId);
    submissionData.append('diagnosis', formData.diagnosis);
    submissionData.append('treatment', formData.treatment);
    submissionData.append('prescription', formData.prescription);
    submissionData.append('date', formData.date);
    submissionData.append('isManualUpload', formData.isManualUpload.toString());
  
    if (formData.isManualUpload) {
      submissionData.append('externalDoctorName', formData.externalDoctorName);
      submissionData.append('externalHospitalName', formData.externalHospitalName);
    }
  
    console.log("Submission Data:", submissionData);
  
    if (formData.doctorId === "" && !formData.isManualUpload) {
      setMessage("Doctor ID is required.");
      return;
    }
    console.log("Submission Data:", submissionData);

    try {
      const response = await api.post(
        "/health-record/create",
        submissionData,
        { withCredentials: true }
      );
  
      if (!response.ok) {
        const errorData = await response.data;
        throw new Error(errorData.message || 'Something went wrong!');
      }
      if (response.status === 200 || response.status === 201) {
        console.log("✅ Navigation Triggered");
        navigate("/profile");
      }
      setAttachments([]);
    
    } catch (error) {
      setMessage(error.message);
    }
  };
  

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div className="bg-white border border-green-500 rounded-lg shadow-2xl p-6 sm:p-8">
        <h1 className="text-3xl font-extrabold text-center text-green-600 mb-6">
          Health Record Form
        </h1>
        {message && (
          <p className="mb-4 text-center text-sm text-green-700">{message}</p>
        )}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Student ID */}
          <div className="mb-5">
            <label htmlFor="studentId" className="block text-gray-700 font-semibold mb-2">
              Student ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
              placeholder="Enter Student ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
            />
          </div>
          {/* Doctor ID */}
          <div className="mb-5">
            <label htmlFor="doctorId" className="block text-gray-700 font-semibold mb-2">
              Doctor ID
            </label>
            <input
              type="text"
              id="doctorId"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              placeholder="Enter Doctor ID (if applicable)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
            />
          </div>
          {/* Diagnosis */}
          <div className="mb-5">
            <label htmlFor="diagnosis" className="block text-gray-700 font-semibold mb-2">
              Diagnosis <span className="text-red-500">*</span>
            </label>
            <textarea
              id="diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              required
              placeholder="Enter diagnosis details"
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
            ></textarea>
          </div>
          {/* Treatment */}
          <div className="mb-5">
            <label htmlFor="treatment" className="block text-gray-700 font-semibold mb-2">
              Treatment
            </label>
            <textarea
              id="treatment"
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
              placeholder="Enter treatment details"
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
            ></textarea>
          </div>
          {/* Prescription */}
          <div className="mb-5">
            <label htmlFor="prescription" className="block text-gray-700 font-semibold mb-2">
              Prescription
            </label>
            <textarea
              id="prescription"
              name="prescription"
              value={formData.prescription}
              onChange={handleChange}
              placeholder="Enter prescription details"
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
            ></textarea>
          </div>
          {/* Date */}
          <div className="mb-5">
            <label htmlFor="date" className="block text-gray-700 font-semibold mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
            />
          </div>
          {/* Manual Upload Checkbox */}
          <div className="mb-5 flex items-center">
            <input
              type="checkbox"
              id="isManualUpload"
              name="isManualUpload"
              checked={formData.isManualUpload}
              onChange={handleChange}
              className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="isManualUpload" className="ml-2 block text-gray-700 font-semibold">
              Manual Upload?
            </label>
          </div>
          {/* External Fields for Manual Upload */}
          {formData.isManualUpload && (
            <div className="mb-5 space-y-5">
              <div>
                <label htmlFor="externalDoctorName" className="block text-gray-700 font-semibold mb-2">
                  External Doctor Name
                </label>
                <input
                  type="text"
                  id="externalDoctorName"
                  name="externalDoctorName"
                  value={formData.externalDoctorName}
                  onChange={handleChange}
                  required={formData.isManualUpload}
                  placeholder="Enter external doctor's name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
                />
              </div>
              <div>
                <label htmlFor="externalHospitalName" className="block text-gray-700 font-semibold mb-2">
                  External Hospital/Clinic Name
                </label>
                <input
                  type="text"
                  id="externalHospitalName"
                  name="externalHospitalName"
                  value={formData.externalHospitalName}
                  onChange={handleChange}
                  required={formData.isManualUpload}
                  placeholder="Enter external hospital/clinic name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
                />
              </div>
            </div>
          )}
          {/* Attachments */}
          <div className="mb-6">
            <label htmlFor="attachments" className="block text-gray-700 font-semibold mb-2">
              Attachments
            </label>
            <input
              type="file"
              id="attachments"
              name="attachments"
              onChange={handleChange}
              multiple
              className="w-full text-gray-600"
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
          >
            Submit Record
          </button>
        </form>
      </div>
    </div>
  );
};

export default HealthRecordForm;
