import axios from "axios";
import { useEffect, useState } from "react";
import DashBoard from "../pages/Dashboard";
import { BiCloset } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";

const AllUsers = () => {
    const [users, setUsers] = useState([])
    const [msg, setMsg] = useState("")
    const navigate = useNavigate()

    
    useEffect(() =>{
        const getUsers = async () => {
            try {
                const resp = await axios.get(`http://localhost:5400/api/users`);
                if (resp.data.success) {
                    console.log(resp.data.data)
                    setUsers(resp.data.data);
                } else {
                    setMsg("No users found");
                }
            } catch (error) {
                console.error("Error fetching comments:", error.message);
                setMsg("Failed to fetch reviews");
            }
        };
        getUsers();
        
    }, [])

    const toDashboard = () =>{
        navigate("/dashboard")
    }
    return(
        <div>
            <DashBoard />
            <div className="fixed h-[80%] right-0 w-[80%] p-3 z-[70]">
                <div className="relative h-full border p-4 flex bg-opacity-100 bg-white">
                    <Link to="/dashboard"><IoCloseSharp className="absolute right-0 size-16 cursor-pointer text-red-900"  /></Link> {/*onClick={toDashboard}*/}
                {users.length ? users.map((user)=>(
                        <div className="bg-white flex flex-col shadow-md rounded-lg p-6 max-w-md mx-auto" key={user._id}>
                        <ul className="flex flex-col gap-4">
                            <li className="text-gray-700 font-semibold">
                                <span className="text-blue-500 font-bold">Name:</span> {user.first_name} {user.last_name}
                            </li>
                            <li className="text-gray-700 font-semibold">
                                <span className="text-blue-500 font-bold">Username:</span> {user.user_name}
                            </li>
                            <li className="text-gray-700 font-semibold">
                                <span className="text-blue-500 font-bold">Gender:</span> {user.gender}
                            </li>
                            <li className="text-gray-700 font-semibold">
                                <span className="text-blue-500 font-bold">Email:</span> {user.email}
                            </li>
                            <li className="text-gray-700 font-semibold">
                                <span className="text-blue-500 font-bold">Role:</span> {user.role}
                            </li>
                        </ul>
                    </div>
                )): null}
                </div>
          </div>
        </div>
        
    )
}
export default AllUsers