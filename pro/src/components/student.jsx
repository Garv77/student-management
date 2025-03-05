import React, { useEffect, useState } from 'react';
import { collection, addDoc, setDoc, updateDoc, getDoc, increment, doc } from 'firebase/firestore';
import { db } from '../utils/firebase'; // Ensure this path is correct
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentForm = () => {
  // State to manage form inputs
  const [iidentity, setIdentity] = useState();
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

  const fetchGlobalIdentity = async () => {
    const docRef = doc(db, "global", "eeMk5UXECvGrrCGRiyzR"); // Corrected this
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      setIdentity(docSnap.data().identity);
    } else {
      console.error("No such document!");
    }
  };

  useEffect(() => {
    fetchGlobalIdentity();
  }, []);

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
        identity: iidentity, // Fixed typo
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

      // Update global identity
      const globalRef = doc(db, 'global', 'eeMk5UXECvGrrCGRiyzR'); // Fixed reference
      if (iidentity !== undefined) {
          await updateDoc(globalRef, {
            identity: increment(1),
          });
          setIdentity(iidentity + 1);
      } else {
          console.error("Identity value is undefined");
      }

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
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {[
          { label: "Name", name: "name", type: "text", placeholder: "Enter student's name" },
          { label: "Address", name: "address", type: "text", placeholder: "Enter student's address" },
          { label: "Joining Date", name: "joiningDate", type: "date" },
          { label: "Mother's Name", name: "mothersName", type: "text", placeholder: "Enter mother's name" },
          { label: "Father's Name", name: "fathersName", type: "text", placeholder: "Enter father's name" },
          { label: "Phone Number", name: "phoneNumber", type: "tel", placeholder: "Enter phone number" },
          { label: "Aadhar Number", name: "aadharNumber", type: "text", placeholder: "Enter Aadhar number" },
          { label: "Date of Birth", name: "dateOfBirth", type: "date" },
          { label: "Fee Amount", name: "feeAmount", type: "number", placeholder: "Enter fee amount" },
        ].map(({ label, name, type, placeholder }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        ))}
        <div className="col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add a New Student
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default StudentForm;
