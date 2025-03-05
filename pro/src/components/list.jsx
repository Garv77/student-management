import React, { useState, useEffect } from 'react';
import { doc, updateDoc, increment, onSnapshot, collection, getDoc, addDoc } from 'firebase/firestore';
import { db } from '../utils/firebase'; // Ensure this path is correct
import { toast } from 'react-toastify';

const StudentList = () => {
  const [students, setStudents] = useState([]); // State to manage the list of students
  const [filteredStudents, setFilteredStudents] = useState([]); // State to manage filtered students for search
  const [searchQuery, setSearchQuery] = useState(''); // State to manage the search query
  const [selectedStudent, setSelectedStudent] = useState(null); // State for selected student (update form)
  const [showPayPopup, setShowPayPopup] = useState(false); // State to control the visibility of the pay popup
  const [password, setPassword] = useState(''); // State to store the password entered by the user
  const [currentStudentId, setCurrentStudentId] = useState(null); // State to store the current student ID for payment
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // Current month (1-12)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Current year
  const [recievedFee, setRecievedFee] = useState(0);
  // Fetch students data in real-time from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'students'), (snapshot) => {
      const studentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsData);
      setFilteredStudents(studentsData); // Initialize filteredStudents with all students
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  // Function to handle search
  useEffect(() => {
    if (searchQuery) {
      if (isNaN(searchQuery)) {
        const filtered = students.filter((student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredStudents(filtered);
      } else {
        const filtered = students.filter((student) =>
          student.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredStudents(filtered);
      }
    } else {
      setFilteredStudents(students); // If no search query, show all students
    }
  }, [searchQuery, students]);

  // Function to calculate pending fees
  const calculatePendingFees = (joiningDate, feePaidTimesCounter, submittedfee, fee) => {
    const joiningDateObj = new Date(joiningDate);
    const joiningMonth = joiningDateObj.getMonth() + 1; // Months are 0-indexed in JavaScript
    const joiningYear = joiningDateObj.getFullYear();

    // Calculate the total number of months since joining
    const totalMonths = (currentYear - joiningYear) * 12 + (currentMonth - joiningMonth);
    const remainingfees = fee - submittedfee;
    // Pending fees = total months since joining - feePaidTimesCounter
    return remainingfees;
  };

  // Function to handle the Update button click
  const handleUpdate = (student) => {
    setSelectedStudent(student); // Set the selected student
  };

  // Function to close the update form
  const handleCloseUpdate = () => {
    setSelectedStudent(null); // Close the update form
  };

  // Function to handle the Save Changes button click
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (selectedStudent) {
      const studentRef = doc(db, 'students', selectedStudent.id);
      await updateDoc(studentRef, {
        name: e.target.name.value,
        address: e.target.address.value,
        joiningDate: e.target.joiningDate.value,
        mothersName: e.target.mothersName.value,
        fathersName: e.target.fathersName.value,
        phoneNumber: e.target.phoneNumber.value,
        aadharNumber: e.target.aadharNumber.value,
        dateOfBirth: e.target.dateOfBirth.value,
        feeAmount: e.target.feeAmount.value,
      });
      alert('Changes saved successfully!');
      setSelectedStudent(null); // Close the update form
    }
  };

  // Function to handle the Pay button click
  const handlePay = (studentId) => {
    setCurrentStudentId(studentId);
    setShowPayPopup(true);
  };

  // Function to handle the payment confirmation
    const handlePaymentConfirmation = async () => {
      if (password === 'correctPassword') { 
        try{
          setShowPayPopup(false);
          toast.success('Payment successful!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        // Replace 'correctPassword' with your actual password check logic
        const studentRef = doc(db, 'students', currentStudentId);
        await updateDoc(studentRef, {
          feePaidTimesCounter: increment(1),
          submittedfee: increment(recievedFee),
        });
         const docSnap = await getDoc(studentRef);
        const docData = docSnap.data();

        console.log("Adding document with data:", {
          name: docData.name,
          phoneNumber: docData.phoneNumber,
          fee: recievedFee,
          paidDate: new Date().toISOString(),
        });

        await addDoc(collection(db, 'fees'), {
          name: docData.name,
          phoneNumber: docData.phoneNumber,
          fee: recievedFee,
          paidDate: new Date().toISOString(),
        });

        setPassword('');
        setRecievedFee(0);
        setShowPayPopup(false);

        

        }catch(error){
          toast.error('Error processing payment. Please try again.', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
        
      } else {
        alert('Incorrect password!');
      }
      setShowPayPopup(false);
    };

  return (
    <div className="max-w-8xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">Student List</h2>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 border-b text-left">ID</th>
              <th className="py-3 px-4 border-b text-left">Name</th>
              <th className="py-3 px-4 border-b text-left">Joining Date</th>
              <th className="py-3 px-4 border-b text-left">Fee Amount</th>
              <th className="py-3 px-4 border-b text-left">Pending Fees (Months)</th>
              <th className="py-3 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const pendingFees = calculatePendingFees(student.joiningDate, student.feePaidTimesCounter || 0, student.submittedfee || 0, student.feeAmount);
                return (
                  <React.Fragment key={student.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b">{student.identity}</td>
                      <td className="py-3 px-4 border-b">{student.name}</td>
                      <td className="py-3 px-4 border-b">{student.joiningDate}</td>
                      <td className="py-3 px-4 border-b">{student.feeAmount || 0}</td>
                      <td className={`py-3 px-4 border-b ${pendingFees > 0 ? "text-red-500" : "text-green-500"}`}>
                        {pendingFees > 0 ? `Pending: ₹${pendingFees}` : "Paid"}
                      </td>
                      <td className="py-3 px-4 border-b">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdate(student)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handlePay(student.id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            Pay
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* Update Form (visible only for the selected student) */}
                    {selectedStudent?.id === student.id && (
                      <tr>
                        <td colSpan="5" className="py-4 px-4 border-b relative">
                          {/* Close Button */}
                          <button
                            onClick={handleCloseUpdate}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            &times;
                          </button>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">Update Student</h3>
                            <form className="grid grid-cols-2 gap-4" onSubmit={handleSaveChanges}>
                              {/* Name */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                  type="text"
                                  name="name"
                                  defaultValue={selectedStudent.name}
                                  className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>

                              {/* Address */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <input
                                  type="text"
                                  name="address"
                                  defaultValue={selectedStudent.address}
                                  className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>

                              {/* Joining Date */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Joining Date</label>
                                <input
                                  type="date"
                                  name="joiningDate"
                                  defaultValue={selectedStudent.joiningDate}
                                  className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>

                              {/* Mother's Name */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Mother's Name</label>
                                <input
                                  type="text"
                                  name="mothersName"
                                  defaultValue={selectedStudent.mothersName}
                                  className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>

                              {/* Father's Name */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Father's Name</label>
                                <input
                                  type="text"
                                  name="fathersName"
                                  defaultValue={selectedStudent.fathersName}
                                  className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>

                              {/* Phone Number */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                  type="tel"
                                  name="phoneNumber"
                                  defaultValue={selectedStudent.phoneNumber}
                                  className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>

                              {/* Aadhar Number */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
                                <input
                                  type="text"
                                  name="aadharNumber"
                                  defaultValue={selectedStudent.aadharNumber}
                                  className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>

                              {/* Date of Birth */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                <input
                                  type="date"
                                  name="dateOfBirth"
                                  defaultValue={selectedStudent.dateOfBirth}
                                  className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>

                              {/* Fee Amount */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Fee Amount</label>
                                <input
                                  type="number"
                                  name="feeAmount"
                                  defaultValue={selectedStudent.feeAmount}
                                  className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>

                              {/* Submit Button (Full Width) */}
                              <div className="col-span-2">
                                <button
                                  type="submit"
                                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  Save Changes
                                </button>
                              </div>
                            </form>
                          </div>
                        </td>
                      </tr>
                    )}

                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="py-3 px-4 border-b text-center text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pay Popup */}
      {showPayPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Payment</h3>
            <p className="mb-4">Please enter the password to confirm the payment for the student.</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Password"
            />
            <p className="mb-4">Please enter the amount of payment for the student.</p>
            <input
              type="number"
              onChange={(e) => setRecievedFee(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowPayPopup(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentConfirmation}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;