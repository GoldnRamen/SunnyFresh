import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../context/DataContext";
import { FaRegComment, FaRegHeart } from "react-icons/fa6";
import { BiRepost } from "react-icons/bi";
import { LuSettings2 } from "react-icons/lu";
import { MdNotificationAdd } from "react-icons/md";
import { BsSuitDiamondFill } from "react-icons/bs";
import { PiDotsThreeOutlineLight } from "react-icons/pi";
import { IoSend } from "react-icons/io5";
const Comments = ({post_id}) =>{
    const loggedUser = JSON.parse(localStorage.getItem("tumblr_user"))
    const [comments, setComments] = useState([])
    const [msg, setMsg] = useState("")
    const [newComments, setNewComment] = useState({
        post: post_id,
        user: loggedUser.id,
        content: ""
    })
    console.log("Adelson:", post_id)
    console.log("Adelson:", loggedUser.id)
    console.log("Adelson:", newComments)
    

    const handleComment = async (e) =>{
        e.preventDefault()
        
        try {
            const resp = await axios.post("http://localhost:5400/api/comment/newComment", newComments)
            
            if(resp.data.success){
                alert("Sent")
                setComments((prev) => [...prev, resp.data.data])
                setNewComment((prev) => ({ ...prev, content: ""}))
            }
        } catch (error) {
                alert("Error Occured")
                console.error("Error: ", error.message)
        }
    }

    useEffect(() =>{
        const getComments = async () => {
            try {
                const resp = await axios.get(`http://localhost:5400/api/comment?post_id=${post_id}`);
                if (resp.data.success) {
                    console.log(resp.data.data)
                    setComments(resp.data.data);
                } else {
                    setMsg("No reviews found");
                }
            } catch (error) {
                console.error("Error fetching comments:", error.message);
                setMsg("Failed to fetch reviews");
            }
        };
        getComments();  
    }, [])

    return(
        <div>
             <div>
                <div className="border-t border-b mt-2 py-2 flex justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-600 p-2 rounded-3xl w-fit flex text-black items-center gap-2">
                            <FaRegComment className="size-6"></FaRegComment>
                            <p>{comments.length}</p>
                        </div>
                        <div className="w-fit flex items-center gap-2">
                            <BiRepost className="size-6 text-gray-500"></BiRepost>
                            <p>0</p>
                        </div>
                        <div className="w-fit flex items-center gap-2">
                            <FaRegHeart className="size-6 text-gray-500"></FaRegHeart>
                            <p></p>
                        </div>
                        
                    </div>
                    <div className="w-fit flex items-center gap-2">
                        <LuSettings2 className="size-5"/>
                        <MdNotificationAdd className="size-5"/>
                    </div>
                </div>
                <div className="flex items-center gap-3 mt-2 w-full p-2">
                    <div className="bg-blue400 p-2 rounded-full w-fit"><BsSuitDiamondFill className="text-green-400 size-5"/></div>
                    <div className="w-full bg-zinc-200 rounded-lg">
                        <form className="w-full flex justify-between bg-zinc-200 items-center rounded-lg px-4" action=""  onSubmit={handleComment}>
                            <input type="text" placeholder="Text here" value={newComments.content} onChange={(e) => setNewComment((prev) => ({...prev, content: e.target.value}))} className="bg-transparent rounded-lg focus:outline-none focus:ring-0 border-0 p-1 w-fit" />
                            <button><IoSend className="size-5 text-gray-500"/></button>
                        </form>
                    </div>
                </div>
                {comments.length ? comments.map((comment)=>(
                    <div className="flex gap-3 w-full border-t border-b mt-2 p-2 justify-between">
                    <div className="bg-blue-400 p-2 rounded-full w-fit h-fit"><BsSuitDiamondFill className="text-green-400 size-5"/></div>
                    <div className="w-full bg-zinc-200 rounded-lg px-4">
                        <div className="w-full flex justify-between items-center my-2 rounded-lg">
                        <u><p>{comment.user.user_name}</p></u>
                            <div className="flex gap-1 text-sm">
                                <p className="text-gray-700 font-semibold">{comment?.updatedAt?.split("T")[1]?.split(".")[0] || "No Time Available"}</p>
                                <p className="text-gray-700 font-semibold">{comment?.updatedAt?.split("T")[0] || "No Date Available"}</p>
                            </div>
                            <PiDotsThreeOutlineLight className="size-5"/>
                        </div>
                        <div className="rounded-lg overflow-hidden overflow-y-scroll relative scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500">
                            <p className="max-h-72 mb-10">{comment.content}</p>                                            
                        </div>
                        <div className="absolute w-fit bottom-5 left-0">
                            <div className="p-2 rounded-3xl w-fit bg-zinc-800 m-3 border flex items-center gap-2">
                                <FaRegComment className="size-3 mx-auto text-white"></FaRegComment>
                                <p></p>
                            </div>
                        </div>
                    </div>
                    </div>
                )): null}
            </div>
        </div>
    )
}
export default Comments;