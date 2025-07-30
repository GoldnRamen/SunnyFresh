import React, { useState, useEffect } from "react";
import tumblrPhoto from "../PNG/Tumblr_Logos_2018.03.06_Wordmark Black.png"
import { Link, useNavigate } from "react-router-dom";
// import AllUsers from "../components/AllUsers";

const DashBoard = () => {
  const user =  JSON.parse(localStorage.getItem("tumblr_admin"));
  const username = user.user_name
  // const[profiles, setProfiles] = ([])
  // const [showUsers, setShowUsers] = useState(false);
  // const handleUsers = () => {};

  return (
    <>
      <div className="mt-[8%]">
        <div className="flex fixed flex-col w-full h-fit bg-white z-50 top-0 mx-auto border-b shadow p-3">
          <div className="absolute left-10 top-8 font-bold">User: {username}</div>
          <Link to="/" className="my-auto">
            <img src={tumblrPhoto} className="w-40 mx-auto my-auto" alt="IMAGES" />
          </Link>
          {/* <div className="absolute left-10 top-8">
            <img className="size-20"/>
          </div> */}
        </div>
        <div className="mt-20">
          <div className="fixed left-0 w-[250px] top-56  border-r border shadow h-fit bg-gray-200" >
            <Link to="/allPosts" className="no-underline text-black">
              <p className="p-3 border-b cursor-pointer hover:shadow-black hover:shadow">
                  All Posts 
              </p>
            </Link>
            <Link to="/allComments" className="no-underline text-black">
              <p className="p-3 border-b cursor-pointer hover:shadow-black hover:shadow">
                  All Comments
              </p>
            </Link>
            <Link to="/allUsers" className="no-underline text-black">
              <p className="p-3 border-b cursor-pointer hover:shadow-black hover:shadow">
                  All Users
              </p>
            </Link>
            <Link to="/adminLogin" className="no-underline text-black">
              <p className="p-3 border-b cursor-pointer hover:shadow-black hover:shadow">
                  Logout
              </p>
            </Link>
            
          </div>
          <div className="fixed h-[80%] right-0 w-[80%]  p-3" style={{backgroundImage: `url("https://ideogram.ai/assets/image/lossless/response/GzbMAAABSbmqPTtQwPjBhg")`, backgroundPosition: "center", backgroundRepeat:"no-repeat", backgroundSize:"cover"}}>
            <div className="relative h-full border p-4 flex bg-opacity-50 bg-gray-700">
              
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
};
export default DashBoard;
