import axios from "axios";
import { useEffect, useState } from "react";
import DashBoard from "../pages/Dashboard";
import { BiCloset } from "react-icons/bi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";

const AllPosts = () => {
    const {id} = useParams()
    const [posts, setPosts] = useState([])
    const [msg, setMsg] = useState("")
    const navigate = useNavigate()

    
    useEffect(() =>{
        const getPosts = async () => {
            try {
                const resp = await axios.get(`http://localhost:5400/api/post`);
                if (resp.data.success) {
                    console.log(resp.data.data)
                    setPosts(resp.data.data);
                } else {
                    setMsg("No posts found");
                }
            } catch (error) {
                console.error("Error fetching posts:", error.message);
                setMsg("Failed to fetch reviews");
            }
        };
        getPosts();
        
    }, [])

    const delePost = async (id) => {
        console.log("Deleting post with ID:", id);
        try {
            const resp = await axios.delete(`http://localhost:5400/api/post/deletePost/${id}`);
            if (resp.data.success) {
                alert("Post has been deleted");
            } else {
                alert(`Failed to delete post: ${resp.data.msg}`);
            }
        } catch (error) {
            console.error("Error deleting post:", error.message);
            alert("An error occurred while trying to delete the post.");
        }
    };
    
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            delePost(id);
        }
    };
    
    const toDashboard = () =>{
        navigate("/dashboard")
    }
    return(
        <div>
            <DashBoard />
            <div className="fixed h-[80%] right-0 w-[80%] p-3 z-[70]">
                <div className="relative h-full border p-4 flex bg-opacity-100 gap-3 bg-white overflow-x-scroll">
                    <Link to="/dashboard"><IoCloseSharp className="fixed right-0 size-16 cursor-pointer z-[60] text-red-900"  /></Link> {/*onClick={toDashboard}*/}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4">
    {posts.length ? posts.map((post) => (
        <div 
            className="bg-gray-200 flex flex-col shadow-lg shadow-black rounded-lg p-4 relative" 
            key={post._id}
        >
            <img 
                src="https://ideogram.ai/assets/progressive-image/balanced/response/7AzgDQvGSHyQLcFQT-UAIw" 
                className="w-full h-40 object-center object-cover rounded-t-lg" 
                alt="" 
            />
             <IoCloseSharp
                className="absolute top-3 right-7  size-8 cursor-pointer mx-auto rounded-lg text-white" 
                onClick={() => handleDelete(post._id)}
            />
            <ul className="flex flex-col gap-2 text-sm mt-4">
                <li className="text-gray-700 font-semibold">
                    <span className="text-blue-500 font-bold">Post Title:</span> {post.title}
                </li>
                <li className="text-gray-700 font-semibold">
                    <span className="text-blue-500 font-bold">Post Content:</span> {post.content}
                </li>
                <li className="text-gray-700 font-semibold">
                    <span className="text-blue-500 font-bold">Post Category_ID:</span> {post.category}
                </li>
                <li className="text-gray-700 font-semibold">
                    <span className="text-blue-500 font-bold">Post Tags:</span> {post.tags.join(", ")}
                </li>
                <li className="text-gray-700 font-semibold">
                    <span className="text-blue-500 font-bold">Date Created:</span> {post.createdAt.split(".")[0]}
                </li>
              
            </ul>
        </div>
    )) : null}
</div>

                </div>
          </div>
        </div>
        
    )
}
export default AllPosts;