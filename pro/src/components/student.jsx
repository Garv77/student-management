import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../utils/firebase'; // Ensure this path is correct
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentForm = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    joiningDate: '',
    mothersName: '',
    fathersName: '',
    phoneNumber: '',
    aadharNumber: '',
    dateOfBirth: '',
    feeAmount: '',
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add student data to Firestore
      await addDoc(collection(db, 'students'), {
        name: formData.name,
        address: formData.address,
        joiningDate: formData.joiningDate,
        mothersName: formData.mothersName,
        fathersName: formData.fathersName,
        phoneNumber: formData.phoneNumber,
        aadharNumber: formData.aadharNumber,
        dateOfBirth: formData.dateOfBirth,
        feeAmount: formData.feeAmount,
      });

      // Show success pop-up
      toast.success('Student added successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Clear the form
      setFormData({
        name: '',
        address: '',
        joiningDate: '',
        mothersName: '',
        fathersName: '',
        phoneNumber: '',
        aadharNumber: '',
        dateOfBirth: '',
        feeAmount: '',
      });
    } catch (error) {
      // Show error pop-up
      toast.error('Error adding student. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('Error adding student: ', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">Add a New Student</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter student's name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter student's address"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Joining Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Joining Date</label>
          <input
            type="date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Mother's Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Mother's Name</label>
          <input
            type="text"
            name="mothersName"
            value={formData.mothersName}
            onChange={handleInputChange}
            placeholder="Enter mother's name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Father's Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Father's Name</label>
          <input
            type="text"
            name="fathersName"
            value={formData.fathersName}
            onChange={handleInputChange}
            placeholder="Enter father's name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Aadhar Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
          <input
            type="text"
            name="aadharNumber"
            value={formData.aadharNumber}
            onChange={handleInputChange}
            placeholder="Enter Aadhar number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Fee Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Fee Amount</label>
          <input
            type="number"
            name="feeAmount"
            value={formData.feeAmount}
            onChange={handleInputChange}
            placeholder="Enter fee amount"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add a New Student
          </button>
        </div>
      </form>

      {/* Toast Container for Pop-up Notifications */}
      <ToastContainer />
    </div>
  );
};

export default StudentForm;