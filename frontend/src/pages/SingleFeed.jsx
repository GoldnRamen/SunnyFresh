import { FaRegComment, FaRegHeart } from "react-icons/fa6";
import { IoClose, IoCloseSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom"
import Home from "./Home";
import { PiDotsThreeOutlineLight, PiShareFatBold } from "react-icons/pi";
import { BsFire } from "react-icons/bs";
import { BiRepost } from "react-icons/bi";
import { useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { GiSharpCrown, GiSmokingPipe } from "react-icons/gi";
import { IoMdNuclear } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { useEffect } from "react";
import axios from "axios";
import Comments from "../components/Comments";

const SingleFeed = ()=>{
    const {id} = useParams()    
    const [isExpanded3, setIsExpanded3] = useState(true);
    const [isExpanded4, setIsExpanded4] = useState(false);
    const [visible1, setIsVisible1] = useState(true)
    const [visible2, setIsVisible2] = useState(false)
    const [posts, setPosts] = useState([])
    const [like, setLike] = useState(false)
    const navigate = useNavigate()
    const toggleDrop = () => {
        setIsExpanded3(!isExpanded3);
    };
    const toggleDrop2 = () => {
        setIsExpanded4(!isExpanded4);
        setIsVisible1(false)
        setIsVisible2(true)
    };
    
    const toggleUp2 = () => {
        setIsExpanded4(!isExpanded4);
        setIsVisible2(false)
        setIsVisible1(true)
    };
    

    const toHome = () =>{
        navigate("/home")
    }

    const user = JSON.parse(localStorage.getItem("tumblr_user"))
    const loggedUser = user.id
    console.log("Benghazi:", loggedUser)

    useEffect(()=>{
        const getSinglePost = async () =>{
            const resp = await axios.get(`http://localhost:5400/api/post/${id}`);
            if (resp.data.success){
                setPosts(resp.data.data)
                // setLike(resp.liked)
                console.log("Kitty:", resp.data.data)
            }
            else{
                alert("Error fetching post details")
                console.log("Failed to fetch post:", resp.data)
            }
        }
        console.log("Johnny:", id)

        getSinglePost()
    },[id])

    useEffect(() => {
        // Initialize like from localStorage for the single post
        const storedLike = localStorage.getItem(`like_${id}`);
        setLike(storedLike ? JSON.parse(storedLike) : false); // `like` is a boolean
    }, [id]);
    
    const toggleLike = async () => {
        const newLike = !like;
        setLike(newLike);
        localStorage.setItem(`like_${id}`, JSON.stringify(newLike));
    
        try {
            const likeData = { post: id, user: loggedUser.id };
            const resp = await axios.post("http://localhost:5400/api/likes", likeData);
            if (!resp.data.success) {
                alert("Failed to like the post");
                // Roll back state
                setLike(!newLike);
                localStorage.setItem(`like_${id}`, JSON.stringify(!newLike));
            }
        } catch (error) {
            console.error("Error toggling like:", error.message);
            // Roll back state
            setLike(!newLike);
            localStorage.setItem(`like_${id}`, JSON.stringify(!newLike));
        }
    };
    
    const category = JSON.parse(localStorage.getItem("Post_categories"))

    return(
        <>
        <div className="relative flex bg-black flex-col items-center text-white justify-center min-h-0">
            {/* <div className="absolute inset-0 bg-zinc-950 opacity-70 z-20 h-full w-full"></div> */}
            <div className="fixed inset-0 bg-zinc-300 opacity-70 z-10"><Home className={"bg-zinc-950 opacity-80"}/></div>
            <IoCloseSharp onClick={toHome} className="size-16 z-40 fixed left-10 top-10 text-white"/>
            
            {posts? (
            <div className="grid grid-cols-5 text-black rounded-lg ml-[10%] gap-5 w-[60%] mb-10 p-5 absolute top-0 shadow-xl shadow-zinc-950 bg-slate-900 mt-5 z-40">
                <div className="p-5 col-span-3 bg-slate-700 rounded shadow-md">
                    <div className="flex flex-col gap-2 bg-white rounded">
                        <div className="flex flex-row gap-2 p-4 relative border-b border-black">
                            <img className="size-8 rounded object-center object-fit" src="https://ideogram.ai/assets/progressive-image/balanced/response/-fPkXOK0Tfa1RIKXmHtB_A" alt="IMGAGES" />
                            <div className="flex flex-col m-0 p-0">
                                <p className="text-sm font-semibold">{posts.user && (posts.user.user_name)}</p>
                               <div className="flex gap-1">
                                    <p className="text-xs text-gray-500">
                                        {posts?.updatedAt?.split("T")[0] || "No Date Available"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {posts?.updatedAt?.split("T")[1]?.split(".")[0] || "No Time Available"}
                                    </p>
                               </div>

                            </div>
                            <p className="text-blue-400 cursor-pointer align-text-top text-sm m-0 p-0 font-bold">Follow</p>
                            <PiDotsThreeOutlineLight className="size-6 absolute top-5 right-10"/>
                        </div>

                        {posts.link && (
                            
                            posts.category === category[1]._id ? (
                                <audio className="w-full h-full" src={"https://freesound.org/people/GregorQuendel/sounds/710619/"} />
                            ) : posts.category === category[2]._id ? ( 
                                <img src={posts.link} alt="category-img" className="w-full h-full" />
                            ) : posts.category === category[3]._id ? (
                                <iframe src={posts.link} title="posts-link" className="w-full h-full"></iframe>
                            ): null
                        
                        )}
                         <div className="p-4">
                            <p className="my-2 font-semibold">{posts.title}</p>
                            <p>
                                {posts.content}
                            </p>
                        </div>
                    <div className="p-4 flex flex-col">
                            <div className="flex flex-row gap-2 mt-4 mb-2">
                                <BsFire className="size-5 text-gray-500"/> 
                                <p className="text-gray-500 text-sm">Blaze</p>
                            </div>
                            <hr className="w-full text-xs bg-gray-500"/>
                            <div className="flex justify-between items-center mt-3">
                                {isExpanded3 ?                               
                                    (<div onClick={toggleDrop} className="border cursor-pointer rounded-3xl p-2 items-center flex flex-row gap-1 bg-gray-500">
                                        <IoClose className="size-5"/>  Close notes
                                    </div>)
                                    :
                                    (<div className="border rounded-3xl p-2 flex flex-row gap-2 border-gray-500">
                                        <p>123</p>
                                        <p className="text-gray-500">notes</p>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <div className="relative group">
                                        <PiShareFatBold className="size-8 text-gray-500"/>
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-[-8px] 
                                                px-3 py-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                Share
                                            </div>
                                    </div>
                                    <div className="relative group">
                                        <FaRegComment onClick={toggleDrop} className="size-6 text-gray-500"></FaRegComment>
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-[-8px] 
                                            px-3 py-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            Comment
                                        </div>
                                    </div>
                                    <div className="relative group">
                                    <BiRepost className="size-8 text-gray-500"/>
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-[-8px] 
                                            px-3 py-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            Repost
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        {like ? (
                                            <FaHeart
                                                className="size-6 text-red-500 cursor-pointer"
                                                onClick={toggleLike}
                                            />
                                        ) : (
                                            <FaRegHeart
                                                className="size-6 text-gray-500 cursor-pointer"
                                                onClick={toggleLike}
                                            />
                                        )}
                                        <div
                                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-[-8px] 
                                            px-3 py-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            {like ? "Unlike" : "Like"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {isExpanded3 && (
                               <Comments post_id={id}/>
                            )}
                        </div>
                    </div> 
                    
                </div>
               
                    <div className="flex flex-col gap-3 text-white col-span-2">
                    <div className="h-fit bg-slate-700 rounded shadow-md relative">
                        <img className="w-full h-[10rem] object-cover object-center rounded-t" src="https://ideogram.ai/assets/progressive-image/balanced/response/-fPkXOK0Tfa1RIKXmHtB_A" alt="IMAGES" />
                        <div className="text-center h-fit flex flex-col mt-2 mx-3 mb-7 items-center">
                            <p className="text-gray-300 normal-case text-sm">{posts.user && (posts.user.user_name.toLowerCase().replace(/\s+/g, ""))}@tumblr.com</p> <p>/</p> <p className="text-gray-300 text-sm">{posts.user && (posts.user.email)}</p>
                        </div>
                        {isExpanded4 && (<><p className="text-sm px-3 py-6 mb-3">About us, <br /> sit amet consectetur adipisicing elit. Nulla consequatur sapiente neque doloribus tempore repellendus quasi dolorum cum porro harum necessitatibus in enim voluptatum explicabo distinctio, impedit rem quisquam repellat magni aut facilis excepturi recusandae. Necessitatibus, illum soluta facilis porro perspiciatis mollitia atque cupiditate, aspernatur asperiores officiis animi beatae perferendis architecto iusto voluptatem facere optio. Placeat repellendus, dicta quisquam, nisi et ad id facilis recusandae esse porro animi velit, dolores quo totam maxime atque. Error, et quod? Eos, amet eveniet.</p>
                        {visible2 && (<RiArrowDropUpLine className="size-10 absolute bottom-1 left-[40%] cursor-pointer hover:animate-bounce"  onClick={toggleUp2}/>)}</>)}
                        {visible1 && (<RiArrowDropDownLine className="size-10 absolute bottom-1 left-[40%] cursor-pointer hover:animate-bounce"  onClick={toggleDrop2}/>)}
                        
                    </div>
                    <div className="flex flex-col bg-slate-700 rounded p-5 mt-8">
                            <p className="text-lg font-bold text-left">Checkout these blogs</p>
                            <div className="flex flex-row">
                                    <div className="flex flex-row justify-between w-[100%] my-2">
                                        <div className="flex flex-row gap-3">
                                            <img className="w-10 rounded-lg object-contain" src='https://ideogram.ai/assets/progressive-image/balanced/response/Ad9XyqwtSz6UCFMfpYq_aQ' alt="IMAGES" />
                                            <div className="flex flex-col">
                                                <p className="flex flex-row">infected</p>
                                                <p className="text-sm gap-1 items-center flex flex-row">Infected <IoMdNuclear className="size-4"/></p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row gap-2">
                                            <p className="text-blue-400 text-sm">Follow</p>
                                            <IoCloseSharp className="size-4"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row md:text-xs">
                                    <div className="flex flex-row justify-between w-[100%] my-2">
                                        <div className="flex flex-row gap-3">
                                            <img className="w-10 rounded-lg object-contain" src='https://ideogram.ai/assets/progressive-image/balanced/response/qZT-GPliRpKsNPx5yfzJrg' alt="IMAGES" />
                                            <div className="flex flex-col">
                                                <p className="flex flex-row">thecollectibles</p>
                                                <p className="text-sm gap-1 items-center flex flex-row">The Art Showcase</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row gap-2">
                                            <p className="text-blue-400 text-sm">Follow</p>
                                            <IoCloseSharp className="size-4"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="flex flex-row justify-between w-[100%] my-2">
                                        <div className="flex flex-row gap-3">
                                            <img className="w-10 rounded-lg object-contain" src='https://ideogram.ai/assets/progressive-image/balanced/response/BFNxxmU7QxSfY49Thdk_sg' alt="IMAGES" />
                                            <div className="flex flex-col">
                                                <p className="flex flex-row">animatedtext</p>
                                                <p className="text-sm gap-1 items-center flex flex-row">Animated Text<GiSmokingPipe className="size-4"/></p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row gap-2">
                                            <p className="text-blue-400 text-sm">Follow</p>
                                            <IoCloseSharp className="size-4"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="flex flex-row justify-between w-[100%] my-2">
                                        <div className="flex flex-row gap-3">
                                            <img className="w-10 rounded-lg object-contain" src='https://ideogram.ai/assets/progressive-image/balanced/response/q0DBy_u3Q3KdBbIV3jgI3Q' alt="IMAGES" />
                                            <div className="flex flex-col">
                                                <p className="flex flex-row">baldy</p>
                                                <p className="text-sm gap-1 items-center flex flex-row">The Bald Baron <GiSharpCrown className="size-4"/></p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row gap-2">
                                            <p className="text-blue-400 text-sm">Follow</p>
                                            <IoCloseSharp className="size-4"/>
                                        </div>
                                    </div>
                                </div>
                        </div>
                </div>
            
            </div> 
            ): null}     
             
        </div>
        </>
    )
}
export default SingleFeed;