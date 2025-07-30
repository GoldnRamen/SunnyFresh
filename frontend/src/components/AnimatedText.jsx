import React, { useState, useEffect } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { FaQuoteRight } from "react-icons/fa";
import { GiEcology } from "react-icons/gi";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { TiStopwatch } from "react-icons/ti";

import { Link } from "react-router-dom";

const AnimatedText = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 200); // Small delay before animation starts
  }, []);

  return (
    <div className="h-fit">
      <div className="w-full">
        <div className="flex flex-col gap-7 items-center p-3">
          <div>       
            <section className="pt-20 h-full bg-indigo-500 rounded-t-lg shadow-lg p-3 font-saira text-white text-center flex flex-col items-center justify-center">
              <h1 className="text-6xl font-bold">SunnyFresh Laundry Services</h1>
              <p className="text-lg mt-4">Clean Clothes, Fresh Life.</p>
            </section>
            <section>
              <div className="relative w-full overflow-hidden">
                <div className="relative h-[400px] w-full">
                  {/* Video Container */}
                  <div className="absolute inset-0 w-full h-full">
                    <video
                      className="w-full h-full object-cover opacity-50"
                      autoPlay
                      muted
                      playsInline
                      onEnded={(e) => {
                        const secondVideo = e.target.parentElement.nextElementSibling.querySelector('video');
                        if (secondVideo) {
                          secondVideo.play();
                          e.target.style.display = 'none';
                          secondVideo.style.display = 'block';
                        }
                      }}
                    >
                      <source src="/laundry.mp4" type="video/mp4" />
                    </video>
                  </div>
                  
                  {/* Second Video Background - Initially Hidden */}
                  <div className="absolute inset-0 w-full h-full">
                    <video
                      className="w-full h-full object-cover opacity-70 hidden"
                      muted
                      playsInline
                      onEnded={(e) => {
                        const firstVideo = e.target.parentElement.previousElementSibling.querySelector('video');
                        if (firstVideo) {
                          firstVideo.play();
                          e.target.style.display = 'none';
                          firstVideo.style.display = 'block';
                        }
                      }}
                    >
                      <source src="/breeze.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>
            </section>
            <section>
              <div className="h-full bg-indigo-800 shadow-lg p-3 font-indie text-white text-center flex flex-col items-center justify-center">
                <p className="text-2xl">Who We Are</p>
                <p>We are the laundry service you trust to treat your clothes with the dignity their price tag deserves.</p>
              </div>
            </section>            
            <section className="py-20">
              <div className="text-center mb-10 grid grid-cols-3 gap-[10px]">
                <div className="col-span-1 items-center justify-center flex flex-col">
                  <h2 className="text-4xl font-semibold font-saira">Our Services</h2>
                  <p className="text-lg text-gray-600 mt-2">Fast, affordable, and eco-friendly laundry services. With our "No-drama" service delivery and a reputation for preserving both the texture and quality of your fabrics, it's easy to agree with our community of users on why we are your go-to laundromat service in Abuja.</p>
                </div>
                <div className="col-span-2">
                  <img className="w-fit object-cover object-center" src="https://cdn.pixabay.com/photo/2014/12/14/16/05/laundry-saloon-567951_1280.jpg" alt="IMAGES" />
                </div>
              </div>
              <span className="grid grid-cols-4 gap-2">
                <div className="flex text-center col-span-1 p-2 bg-indigo-700 rounded-lg justify-between font-mono items-center shadow-2xl hover:scale-110">
                <MdOutlineWorkspacePremium className="text-white size-16" />
                  <p className="text-white">PREMIUM CARE AND CUSTOMER SERVICES</p>
                </div>
                <div className="flex text-center col-span-1 p-2 bg-indigo-700 rounded-lg justify-between font-mono items-center shadow-2xl hover:scale-110">
                <TiStopwatch className="text-white size-16" />
                  <p className="text-white">SAME DAY AND EXPRESS SERVICE</p>
                </div>
                <div className="flex text-center col-span-1 p-2 bg-indigo-700 rounded-lg justify-between font-mono items-center shadow-2xl hover:scale-110">
                <GiEcology className="text-white size-16" />
                  <p className="text-white">ECO-FRIENDLY PRODUCTS AND PRACTICES</p>
                </div>
                <div className="flex text-center col-span-1 p-2 bg-indigo-700 rounded-lg justify-between font-mono items-center shadow-2xl hover:scale-110">
                <TbTruckDelivery className="text-white size-16" />
                  <p className="text-white">QUICK AND SEEMLESS PICKUP</p>
                </div>
              </span>
            </section>

            <section className="grid grid-cols-3 w-[70%] mx-auto">
              <div className="col-span-2 gap-4">
                <div className="flex flex-col font-semibold space-y-6">
                  <p>Well, who else will handle your wears with impeccable care and best practices?</p>
                  <p> Who else uses our exclusive eco-friendly and skin friendly laundry products to wash, iron and dry clean your tenders? <br/> Do you know another provider who can assure you of the total absense of toxins in their cleaning agents which keeps you away from all negative encounters with disease causing agents and as a bonus also erases the release of harmful pollutants to our water, soil and air.</p>
                  <p>No wonder our customers trust us with their designer brands!</p>
                </div>
                <span className="w-full mt-4 gap-10 grid grid-cols-5">                
                  <img className="object-cover" src="https://static.vecteezy.com/system/resources/previews/021/059/818/non_2x/gucci-logo-gucci-icon-with-typeface-on-white-background-free-vector.jpg" alt="IMAGES" />
                  <img className="object-cover" src="https://images.platoyo.com/v7/_modehaus_production_img_/spree/brands/logo/59/original/Pierre-Cardin-logo_57841ec2a1ee1b926c39a35f-original.png?1625753724&q=75&force_format=original" alt="IMAGES" />
                  <img className="object-cover" src="https://static.vecteezy.com/system/resources/thumbnails/024/131/481/small_2x/ysl-yves-saint-laurent-brand-logo-black-symbol-clothes-design-icon-abstract-illustration-free-vector.jpg" alt="IMAGES" />
                  <img className="object-cover" src="https://pngimg.com/uploads/dolce_gabanna/dolce_gabanna_PNG10.png" alt="IMAGES" />
                  <img className="object-cover" src="https://icon2.cleanpng.com/20180515/qyq/avrpsmf14.webp" alt="IMAGES" />
                </span>
              </div>
              <div className="col-span-1 justify-center rounded-full shadow-2xl bg-indigo-600 flex">
                <p className="text-4xl text-white font-semibold items-center text-center flex justify-center font-saira">Why us?</p>
              </div>
              
            </section>
            
            <section className="pt-20">
              <div className="text-center">
                <h2 className="text-4xl font-semibold font-saira">What Our Customers Say</h2>
                <p className="text-lg text-gray-600 mt-2">Join thousands of happy customers!</p>
              </div>
              <div className="mt-10 px-10 flex flex-wrap justify-center gap-6">
                <div className="border bg-indigo-100 shadow-lg p-6 rounded-lg max-w-sm flex flex-col items-center">
                  <img className="size-28 object-cover object-top rounded-full border-2 border-white" src="https://cdn.pixabay.com/photo/2021/05/14/09/17/man-6252885_1280.jpg" alt="IMAGES" />
                  <p className="italic">"Fast service and super clean clothes!"</p>
                  <p className="font-bold mt-4">- James K.</p>
                </div>
                <div className="border bg-indigo-100 shadow-lg p-6 rounded-lg max-w-sm flex flex-col items-center">
                <img className="size-28 object-cover object-top rounded-full border-2 border-white" src="https://cdn.pixabay.com/photo/2023/09/06/13/47/woman-8237167_1280.jpg" alt="IMAGES" />
                  <p className="italic">"Eco-friendly and affordable. Highly recommend!"</p>
                  <p className="font-bold mt-4">- Sarah L.</p>
                </div>
                <div className="border bg-indigo-100 shadow-lg p-6 rounded-lg max-w-sm flex flex-col items-center">
                  <img className="size-28 object-cover object-top rounded-full border-2 border-white" src="https://cdn.pixabay.com/photo/2020/03/03/16/53/female-4899174_1280.jpg" alt="IMAGES" />
                  <p className="italic">"Keep taking my money... Quality like yours has no price tag!"</p>
                  <p className="font-bold mt-4">- Seun O.</p>
                </div>
              </div>
            </section>

          </div> 
        </div>
      </div>
        
    </div>
  );
};

export default AnimatedText;
