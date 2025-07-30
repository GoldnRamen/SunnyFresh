import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import Navbar from "../components/Navbar"
const Landing = ({className, children})=>{

    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded1, setIsExpanded1] = useState(false);
    const [isExpanded2, setIsExpanded2] = useState(false);
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toHome = ()=>{
        navigate("/")
    }
    const [seeGallery, setSeeGallery] = useState(false)

    const toggleDrop = () => {
        setIsExpanded1(!isExpanded1);
    };
    const toggleDrop2 = () => {
        setIsExpanded2(!isExpanded2);
    };    

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewHeight = window.innerHeight;

      if (scrollPosition > .01 * viewHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
   
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
    
  const login = () =>{
      navigate("/login")
  }

  const signup = () => {
      navigate("/signup")
  }

    const onNavigate =()=>{setSeeGallery(true)}
    const onClose =()=>{setSeeGallery(false)}

    return(
        <>
        <div className="relative">
            <Navbar/>
        <div className="h-[100vh] w-full bg-cover bg-no-repeat bg-center" style={{backgroundImage: "url('https://ideogram.ai/assets/image/lossless/response/_dxUraqNTsiBE83iRaNQkg')"}} >            
            <div className="fixed bottom-0 left-0 w-full bg-indigo-500 p-4 flex-col flex justify-center gap-4 text-white">
                <p className="mx-auto font-semibold">Join over 100 million people using Tumblr to find their communities and make friends.</p>
                <div className=" mx-auto flex gap-4 w-[40%]">
                    <button onClick={signup} className="bg-black w-full  py-2 rounded">Sign me up</button>
                    <button onClick={login} className="bg-indigo-300 w-full py-2 rounded">Log in</button>
                </div>
            </div>
            </div>
        </div>
        </>
    );
}
export default Landing;