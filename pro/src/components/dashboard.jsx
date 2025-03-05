import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where , Timestamp , onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase"; // Ensure this path is correct
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"; // Import default styles

const Dashboard = () => {
    const [fees, setFees] = useState([]);
    const [students, setStudents] = useState([]);
    const [unique, setUnique] = useState([]);

    useEffect(() => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();
    
        // Live listener for "fees" collection
        const q = query(
            collection(db, "fees"),
            where("paidDate", ">=", firstDay),
            where("paidDate", "<=", lastDay)
        );
        
        const unsubscribeFees = onSnapshot(q, (querySnapshot) => {
            const feesData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setFees(feesData);
            console.log("Live Fees Data:", feesData);
        });
    
        // Live listener for "students" collection
        const unsubscribeStudents = onSnapshot(collection(db, "students"), (querySnapshot) => {
            const studentsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setStudents(studentsData);
            console.log("Live Students Data:", studentsData);
        });
    
        // Live listener for unique phone numbers in "fees" collection
        const unsubscribeUnique = onSnapshot(collection(db, "fees"), (querySnapshot) => {
            const uniqueNumbers = {};
            const uniqueFees = [];
    
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (!uniqueNumbers[data.phoneNumber]) {
                    uniqueNumbers[data.phoneNumber] = true;
                    uniqueFees.push(data);
                }
            });
    
            setUnique(uniqueFees);
            console.log("Live Unique Data:", uniqueFees);
        });
    
        // Cleanup listeners on unmount
        return () => {
            unsubscribeFees();
            unsubscribeStudents();
            unsubscribeUnique();
        };
    }, []);

    // Calculate metrics
    const totalFees = fees.reduce((acc, f) => acc + Number(f.fee), 0);
    const toBeReceived = students.reduce((acc, s) => acc + Number(s.feeAmount), 0);
    const pendingFee = toBeReceived - totalFees;
    const totalStudents = students.length;
    const feesPaidThisMonth = unique.length;

    // Calculate percentages for progress bars
    const feesPaidPercentage = (totalFees / toBeReceived) * 100 || 0;
    const pendingFeePercentage = (pendingFee / toBeReceived) * 100 || 0;

    return (
        <div className="p-8 bg-gray-100 ">
            <h1 className="text-3xl font-bold mb-8 text-center">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Fees Paid */}
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-xl font-semibold mb-4">Total Fees Paid</h2>
                    <div className="w-32 h-32 mx-auto">
                        <CircularProgressbar
                            value={feesPaidPercentage}
                            text={`₹${totalFees}`}
                            styles={buildStyles({
                                textSize: "16px",
                                pathColor: "#10B981", // Green
                                textColor: "#374151",
                                trailColor: "#F3F4F6",
                            })}
                        />
                    </div>
                </div>

                {/* Pending Fees */}
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-xl font-semibold mb-4">Pending Fees</h2>
                    <div className="w-32 h-32 mx-auto">
                        <CircularProgressbar
                            value={pendingFeePercentage}
                            text={`₹${pendingFee}`}
                            styles={buildStyles({
                                textSize: "16px",
                                pathColor: "#EF4444", // Red
                                textColor: "#374151",
                                trailColor: "#F3F4F6",
                            })}
                        />
                    </div>
                </div>

                {/* Total Students */}
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-xl font-semibold mb-4">Total Students</h2>
                    <div className="w-32 h-32 mx-auto">
                        <CircularProgressbar
                            value={100} // Always 100% for total students
                            text={`${totalStudents}`}
                            styles={buildStyles({
                                textSize: "16px",
                                pathColor: "#3B82F6", // Blue
                                textColor: "#374151",
                                trailColor: "#F3F4F6",
                            })}
                        />
                    </div>
                </div>

                {/* Fees Paid This Month */}
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-xl font-semibold mb-4">Fees Paid This Month</h2>
                    <div className="w-32 h-32 mx-auto">
                        <CircularProgressbar
                            value={(feesPaidThisMonth / totalStudents) * 100 || 0}
                            text={`${feesPaidThisMonth}`}
                            styles={buildStyles({
                                textSize: "16px",
                                pathColor: "#F59E0B", // Orange
                                textColor: "#374151",
                                trailColor: "#F3F4F6",
                            })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;