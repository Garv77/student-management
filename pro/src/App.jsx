import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './utils/firebase'; // Ensure this path is correct
import ResponsiveNavbar from './components/navbar';
import Student from './components/student';
import StudentList from './components/list';
import Dashboard from './components/dashboard';

const App = () => {
  const searchref = useRef();
  const addref = useRef();
  const [students, setStudents] = useState([]); // State to store all students
  const [filteredStudents, setFilteredStudents] = useState([]); // State for filtered students
  const [loading, setLoading] = useState(true); // Loading state

  const handleSearchRef = () => {
    searchref.current.scrollIntoView({ behavior: 'smooth' });
    

  }
  {/*checking git*/}
  const handleAddRef = () => {
    addref.current.scrollIntoView({ behavior: 'smooth' });

  }
  // Fetch students from Firestore
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsCollection = collection(db, 'students');
        const studentsSnapshot = await getDocs(studentsCollection);
        const studentsData = studentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudents(studentsData);
        setFilteredStudents(studentsData); // Initialize filteredStudents with all students
        console.log('Students fetched:', studentsData); // Debugging
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Log students after state update
  useEffect(() => {
    console.log('Students state updated:', students);
  }, [students]);

  // Log filteredStudents after state update
  useEffect(() => {
    console.log('Filtered students state updated:', filteredStudents);
  }, [filteredStudents]);

  // Function to handle search query changes
  const handleSearch = (query) => {
    console.log('Search query:', query); // Debugging
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(query.toLowerCase())
    );
    console.log('Filtered students:', filtered); // Debugging
    setFilteredStudents(filtered);
  };

  return (
    <>
      {/* Fixed Navbar */}
      <header className="bg-white shadow-md fixed w-full top-0 z-50">
        <ResponsiveNavbar handleAddRef={handleAddRef} handleSearchRef={handleSearchRef} />
      </header>

      {/* Search Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <Dashboard/>
      </div>

      {/* Student List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1 mt-1" ref={searchref}>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <StudentList students={filteredStudents} />
        )}
      </div>
      <div ref={addref}>
      <div ><Student /></div>

      </div>
    </>
  );
};

export default App;