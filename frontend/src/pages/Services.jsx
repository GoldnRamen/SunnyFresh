// src/components/Services.jsx

import React from "react";
import { useState } from "react";
import Navbar from "../components/Navbar";
// import { Link, useNavigate } from "react-router-dom";
import { MdOutlineCategory } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { TbCurrencyNaira } from "react-icons/tb";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
const alterationServices = [
  {
    id: 1,
    title: "Length Adjustments",
    description: "Includes trouser hemming, dress/skirt hemming, and sleeve alterations.",
    images: "https://imgs.search.brave.com/5KgDjwLXqk6cBEGrVja6CdpKUEH9hretCfyYF0JVzDU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/d29yZGFucy5jb20v/YmxvZy93cC1jb250/ZW50L3VwbG9hZHMv/MjAyNC8wOS9jbG9z/ZS11cC1tYWxlLXRh/aWxvci10YWtpbmct/bWVhc3VyZW1lbnQt/c2VuaW9yLW1hbi1z/LXNsZWV2ZXMtMS0x/MDI0eDY4My5qcGc"
  },
  {
    id: 2,
    title: "Fit Adjustments",
    description: "Waist adjustments, darting, shaping, tapering, and side seam alterations.",
    images: "https://imgs.search.brave.com/f8FP5Cek4mdt9OSPG2BFVusM3gmnC9XqDnuqjpMCg3Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/c2hvcGlmeS5jb20v/cy9maWxlcy8xLzAy/ODEvMDA0OS8zMzk2/L2ZpbGVzL1NjcmVl/bnNob3RfMjAyNC0w/Mi0xNV9hdF8xMC4w/NS4xM182MDB4NjAw/LnBuZz92PTE3MDc5/OTE1MjE"
  },
  {
    id: 3,
    title: "Repairs and Reinforcements",
    description: "Zipper fixes, button replacements, seam repairs, and patch repairs.",
    images: "https://imgs.search.brave.com/VhHVurk8rL4ik9SgP48Gd_mGE2c0NjK-9lHY-EjWidk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGhlc3BydWNlY3Jh/ZnRzLmNvbS90aG1i/L3B6d2xqWWZ3MkNV/MlpEdWVRS1ZQR3Az/R3pxYz0vMTUwMHgw/L2ZpbHRlcnM6bm9f/dXBzY2FsZSgpOm1h/eF9ieXRlcygxNTAw/MDApOnN0cmlwX2lj/YygpL1dvbWFuc2V3/aW5nc2VhbS1HZXR0/eUltYWdlcy01ODgz/MTgxODgtNmM0YzYy/ZjNjN2EzNDcxMmE2/N2EwMWYxYWRlNjM5/NGQuanBn"
  },
  {
    id: 4,
    title: "Customizations",
    description: "Monogramming, pocket additions, and cuff alterations.",
    images: "https://imgs.search.brave.com/iLtfbFATxI4SsdWUwd0HvWmnyDjMQqir56xvoeW6nNs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2FlL2Yz/LzRiL2FlZjM0YjVk/OTljODhjZmE4ZjAy/NTU2NTIxNmE3YWQz/LmpwZw"
  },
];
const dryCleaningServices = [
  {
    id: 1,
    title: "Formal Wear",
    description: "Such as suits, tuxedos and evening gowns",
    images: "https://i.pinimg.com/736x/ca/3c/4d/ca3c4de9f9f12cb875e6e8a4b9e473ea.jpg"
  },
  {
    id: 2,
    title: "Outer Wear",
    description: "Such as heavy coats and jackets",
    images: "https://i.ebayimg.com/images/g/6W4AAOSwmwNjQkC3/s-l1600.jpg"
  },
  {
    id: 3,
    title: "Special Garments/Delicates",
    description: "Such as wedding gowns and costumes",
    images: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQie6WCAjmR1fQ1rcLhEq0_t7791EJjewf4n--GSRW7jpwDcT3GdeqOHWJkeO8eg3wwBZM&usqp=CAU"
  },
  {
    id: 4,
    title: "Casual Wear",
    description: "",
    images: "https://imageio.forbes.com/specials-images/imageserve/646c145862a8991d9cb502ff/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds"
  },
  {
    id: 5,
    title: "Native Wear",
    description: "",
    images: "https://cdn.shopify.com/s/files/1/0498/7997/4042/t/17/assets/d62f060ebcb6346b30132e71fafcf628-1646879356829_1000x.jpg?v=1646879357"
  },
];
const laundryServices = [
  {
    id: 1,
    title: "Formal Shirts",
    description: "",
    images: "https://m.media-amazon.com/images/I/61eUQRDDZjL._AC_SX425_.jpg"
  },
  {
    id: 2,
    title: "Formal Trousers",
    description: "",
    images: "https://m.media-amazon.com/images/I/61EjkUg+CVL._AC_UY1100_.jpg"
  },
  {
    id: 3,
    title: "Casual Wear",
    description: "",
    images: "https://imageio.forbes.com/specials-images/imageserve/646c145862a8991d9cb502ff/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds"
  },
  {
    id: 4,
    title: "Native Wear",
    description: "",
    images: "https://cdn.shopify.com/s/files/1/0498/7997/4042/t/17/assets/d62f060ebcb6346b30132e71fafcf628-1646879356829_1000x.jpg?v=1646879357"
  },
];
const ironingServices = [
  {
    id: 1,
    title: "Formal Wear",
    description: "Such as suits, tuxedos and evening gowns",
    images: "https://i.pinimg.com/736x/ca/3c/4d/ca3c4de9f9f12cb875e6e8a4b9e473ea.jpg"
  },
  {
    id: 2,
    title: "Shirts",
    description: "",
    images: "https://m.media-amazon.com/images/I/61eUQRDDZjL._AC_SX425_.jpg"
  },
  {
    id: 3,
    title: "Trousers",
    description: "",
    images: "https://m.media-amazon.com/images/I/61EjkUg+CVL._AC_UY1100_.jpg"
  },
  {
    id: 4,
    title: "Special Garments/Delicates",
    description: "Such as wedding gowns and costumes",
    images: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQie6WCAjmR1fQ1rcLhEq0_t7791EJjewf4n--GSRW7jpwDcT3GdeqOHWJkeO8eg3wwBZM&usqp=CAU"
  },
  {
    id: 5,
    title: "Casual Wear",
    description: "",
    images: "https://imageio.forbes.com/specials-images/imageserve/646c145862a8991d9cb502ff/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds"
  },
  {
    id: 6,
    title: "Native Wear",
    description: "",
    images: "https://cdn.shopify.com/s/files/1/0498/7997/4042/t/17/assets/d62f060ebcb6346b30132e71fafcf628-1646879356829_1000x.jpg?v=1646879357"
  },
];
const stainRemovalServices = [
  {
    id: 1,
    title: "Food Based Stains",
    description: "Such as from wine, chocolate and sauces",
    images: "https://media.istockphoto.com/id/614016844/photo/stains-on-tablecloth-of-spilled-wine-glass-and-food.jpg?s=612x612&w=0&k=20&c=SKolDqCmUoHeoRqMcnU5-qRHwHjTeDz_xXPg4eY6D3Y="
  },
  {
    id: 2,
    title: "Cosmetic Stains",
    description: "Such as from deodorant and perfume discoloration & hair dye",
    images: "https://wp.en.aleteia.org/wp-content/uploads/sites/2/2018/01/web3-old-lipstick-stain-clothes-shirt-shutterstock_710238748-fecundap-stock-ai.jpg"
  },
  {
    id: 3,
    title: "Ink & Dye Stains",
    description: "Such as from fountain pen inks, printer ink and fabric dyes.",
    images: "https://miro.medium.com/v2/resize:fit:700/1*mxHYFTCs1QjSc9OP4QTZXw.jpeg"
  },
  {
    id: 4,
    title: "Chemical Stains",
    description: "Such as from bleach, paints and chemical cleaning agents.",
    images: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiKzRWFEKlHhblOR6pRbuAjhJgK-R3xC4C8w&s"
  },
  {
    id: 5,
    title: "Protein Based Stains",
    description: "Such as from blood, deep dried sweat and other fluid residue",
    images: "https://oreole-shop.com/cdn/shop/articles/how-to-get-rid-of-sweat-stains_680x.jpg?v=1583153122"
  },
];


const Services = () => {
// const navigate = useNavigate()
const [orders, setOrders] = useState(false)
const [submitOrder, setSubmitOrders] = useState(false)

const [dryCleaning, setDryCleaning] = useState(false)
const [totalDryCleaningCosts, setTotalDryCleaningCosts] = useState([]);
const [adultDryCleaningCosts, setAdultDryCleaningCosts] = useState([]);
const [kidsDryCleaningCosts, setKidsDryCleaningCosts] = useState([]);
const [dryCleanAge, setdryCleanAge] = useState(Array(dryCleaningServices.length).fill(false));

const [laundry, setLaundry] = useState(false)
const [totalLaundryCosts, setTotalLaundryCosts] = useState([]);
const [adultLaundryCosts, setAdultLaundryCosts] = useState([]);
const [kidsLaundryCosts, setKidsLaundryCosts] = useState([]);
const [laundryAge, setLaundryAge] = useState(Array(laundryServices.length).fill(false));

const [ironing, setIroning] = useState(false)
const [totalIroningCosts, setTotalIroningCosts] = useState([]);
const [adultIroningCosts, setAdultIroningCosts] = useState([]);
const [kidsIroningCosts, setKidsIroningCosts] = useState([]);
const [ironAge, setIronAge] = useState(Array(ironingServices.length).fill(false));

const [stainRemoval, setStainRemoval] = useState(false)
const [stainRemovalCount, setStainRemovalCount] = useState(Array(stainRemovalServices.length).fill(false));
const [stainRemovalCosts, setStainRemovalCosts] = useState([]);

const [curtainCleaning, setCurtainCleaning] = useState(false)
const [weddingGown, setWeddingGown] = useState(false)
const [suedeCleaning, setSuedeCleaning] = useState(false)
const [beddingCleaning, setBeddingCleaning] = useState(false)

const [alteration, setAlteration] = useState(false)
const [alterationCount, setAlterationCount] = useState(Array(alterationServices.length).fill(false));
const [alterationCosts, setAlterationCosts] = useState([]);

const [pickupOptions, setPickupOptions] = useState([]);




  const toggleOrders = ()=>{
    setOrders(true)
  }
  const closeOrders = ()=>{
    setOrders(false)
  }
  const [laundryDetails, setLaundryDetails] = useState(
    laundryServices.map(service => ({
      id: service.id,
      title: service.title,
      adultGarments: 0,
      kidsGarments: 0,
      adultsPickupOption: "", 
      kidsPickupOption: "" 
    }))
  );
  const [ironingDetails, setIroningDetails] = useState(
    ironingServices.map(service => ({
      id: service.id,
      title: service.title,
      adultGarments: 0,
      kidsGarments: 0,
      adultsPickupOption: "", 
      kidsPickupOption: "" 
    }))
  );
  const [dryCleaningDetails, setDryCleaningDetails] = useState(
    dryCleaningServices.map(service => ({
      id: service.id,
      title: service.title,
      adultGarments: 0,
      kidsGarments: 0,
      adultsPickupOption: "", 
      kidsPickupOption: "" 
    }))
  );

  // const toHome = ()=>{
  //   navigate("/")
  // }
  
  const toggleDryCleaning = ()=>{
    setDryCleaning(true)
  }
  const toggleLaundry = ()=>{
    setLaundry(true)
  }
  const toggleIroning = ()=>{
    setIroning(true)
  }
  const toggleCurtainCleaning = ()=>{
    setCurtainCleaning(true)
  }
  const toggleBeddingCleaning = ()=>{
    setBeddingCleaning(true)
  }
  const toggleStainRemoval = ()=>{
    setStainRemoval(true)
  }
  const toggleSuedeCleaning = ()=>{
    setSuedeCleaning(true)
  }
  const toggleWeddingGown = ()=>{
    setWeddingGown(true)
  }
  const toggleAlteration = ()=>{
    setAlteration(true)
  }
  
  const toggleDryCleanAge = (index) => {
    setdryCleanAge(prevState =>
      prevState.map((visible, i) => (i === index ? !visible : visible))
    );
  };
  const toggleIronAge = (index) => {
    setIronAge(prevState =>
      prevState.map((visible, i) => (i === index ? !visible : visible))
    );
  };
  const toggleLaundryAge = (index) => {
    setLaundryAge(prevState =>
      prevState.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  const handleAdultLaundryInputChange = (index, field, value) => {
    setLaundryDetails((prevDetails) => {
      const updatedDetails = [...prevDetails];
      updatedDetails[index] = {
        ...updatedDetails[index],
        [field]: parseInt(value) || 0,
      };
      return updatedDetails;
    });
  };
  const handleKidsLaundryInputChange = (index, field, value) => {
    setLaundryDetails((prevDetails) => {
      const updatedDetails = [...prevDetails];
      updatedDetails[index] = {
        ...updatedDetails[index],
        [field]: parseInt(value) || 0,
      };
      return updatedDetails;
    });
  };
  
  const handleKidsIroningInputChange = (index, field, value) => {
    setIroningDetails((prevDetails) => {
      const updatedDetails = [...prevDetails];
      updatedDetails[index] = {
        ...updatedDetails[index],
        [field]: parseInt(value) || 0,
      };
      return updatedDetails;
    });
  };
  const handleAdultIroningInputChange = (index, field, value) => {
    setIroningDetails((prevDetails) => {
      const updatedDetails = [...prevDetails];
      updatedDetails[index] = {
        ...updatedDetails[index],
        [field]: parseInt(value) || 0,
      };
      return updatedDetails;
    });
  };
  const handleKidsDryCleaningInputChange = (index, field, value) => {
    setDryCleaningDetails((prevDetails) => {
      const updatedDetails = [...prevDetails];
      updatedDetails[index] = {
        ...updatedDetails[index],
        [field]: parseInt(value) || 0,
      };
      return updatedDetails;
    });
  };
  const handleAdultDryCleaningInputChange = (index, field, value) => {
    setDryCleaningDetails((prevDetails) => {
      const updatedDetails = [...prevDetails];
      updatedDetails[index] = {
        ...updatedDetails[index],
        [field]: parseInt(value) || 0,
      };
      return updatedDetails;
    });
  };
  // const handleAlterationInputChange = (index, count) => {
  //   setAlterationCount((prevCounts) => {
  //     const updatedCounts = [...prevCounts];
  //     updatedCounts[index] = count;
  //     return updatedCounts;
  //   });
  //   calculateAlterationCost(index, count, pickupOptions[index]);
  // };
  const handleStainRemovalInputChange = (index, count) => {
    setStainRemovalCount((prevCounts) => {
      const updatedCounts = [...prevCounts];
      updatedCounts[index] = count;
      return updatedCounts;
    });
    calculateStainRemovalCost(index, count, pickupOptions[index]);
  };
  
  const handleLaundryDetails = (index) => {
    console.log(`Service ${index + 1}:`, laundryDetails[index]);
    toggleLaundryAge(index)
  };
  const handleIroningDetails = (index) => {
    console.log(`Service ${index + 1}:`, ironingDetails[index]);
    toggleIronAge(index)
  };
  const handleDryCleaningDetails = (index) => {
    console.log(`Service ${index + 1}:`, dryCleaningDetails[index]);
    toggleDryCleanAge(index)
  };

  // const calculateAlterationCost = (index, count, pickupOption) => {
  //   const baseRatePerGarment = 10; // Example base rate
  //   const pickupRates = {
  //     ondemand: 15,
  //     "6hrs": 10,
  //     "24hrs": 5,
  //     "48hrs": 3,
  //     "1wk": 2,
  //     "2wks": 1,
  //   };
    
  //   const pickupRate = pickupRates[pickupOption] || 0;
  //   const totalCost = count * (baseRatePerGarment + pickupRate);
    
  //   setAlterationCosts((prevCosts) => {
  //     const updatedCosts = [...prevCosts];
  //     updatedCosts[index] = totalCost;
  //     return updatedCosts;
  //   });
  // };
  const totalAlterationCost = (alterationCosts.reduce((sum, cost) => sum + (cost || 0), 0))

  const calculateStainRemovalCost = (index, count, pickupOption) => {
    const baseRatePerGarment = 10; // Example base rate
    const pickupRates = {
      ondemand: 15,
      "6hrs": 10,
      "24hrs": 5,
      "48hrs": 3,
      "1wk": 2,
      "2wks": 1,
    };
    
    const pickupRate = pickupRates[pickupOption] || 0;
    const totalCost = count * (baseRatePerGarment + pickupRate);
    
    setStainRemovalCosts((prevCosts) => {
      const updatedCosts = [...prevCosts];
      updatedCosts[index] = totalCost;
      return updatedCosts;
    });
  };
  const totalStainRemovalCost = (stainRemovalCosts.reduce((sum, cost) => sum + (cost || 0), 0))
  
  // const handlePickupOptionChange = (index, option) => {
  //   setPickupOptions((prevOptions) => {
  //     const updatedOptions = [...prevOptions];
  //     updatedOptions[index] = option;
  //     return updatedOptions;
  //   });
  //   calculateAlterationCost(index, alterationCount[index], option);
  // };

  const handleStainRemovalPickupOptionChange = (index, option) => {
    setPickupOptions((prevOptions) => {
      const updatedOptions = [...prevOptions];
      updatedOptions[index] = option;
      return updatedOptions;
    });
    calculateStainRemovalCost(index, stainRemovalCount[index], option);
  };

  const handleAdultIroningPickupOptionChange = (index, option) => {
    const updatedOptions = [...ironingDetails];
    updatedOptions[index].adultsPickupOption = option;
    setIroningDetails(updatedOptions);
    calculateIroningCost(index)
  };
  const handleKidsIroningPickupOptionChange = (index, option) => {
    const updatedOptions = [...ironingDetails];
    updatedOptions[index].kidsPickupOption = option;
    setIroningDetails(updatedOptions);
    calculateIroningCost(index)
  };
  const handleAdultDryCleaningPickupOptionChange = (index, option) => {
    const updatedOptions = [...dryCleaningDetails];
    updatedOptions[index].adultsPickupOption = option;
    setDryCleaningDetails(updatedOptions);
    calculateDryCleaningCost(index)
  };
  const handleKidsDryCleaningPickupOptionChange = (index, option) => {
    const updatedOptions = [...dryCleaningDetails];
    updatedOptions[index].kidsPickupOption = option;
    setDryCleaningDetails(updatedOptions);
    calculateDryCleaningCost(index)
  };
  const handleAdultLaundryPickupOptionChange = (index, option) => {
    const updatedOptions = [...laundryDetails];
    updatedOptions[index].adultsPickupOption = option;
    setLaundryDetails(updatedOptions);
    calculateLaundryCost(index)
  };
  const handleKidsLaundryPickupOptionChange = (index, option) => {
    const updatedOptions = [...laundryDetails];
    updatedOptions[index].kidsPickupOption = option;
    setLaundryDetails(updatedOptions);
    calculateLaundryCost(index)
  };
  
  const calculateIroningCost = (index) => {
    const { adultGarments, kidsGarments, adultsPickupOption, kidsPickupOption } = ironingDetails[index];

  // Pricing Rules
  const adultRate = 10;  // Example: $10 per adult garment
  const kidsRate = 5;    // Example: $5 per kids garment
  const pickupSurcharge = {
    "ondemand": 15,
    "6hrs": 10,
    "24hrs": 5,
    "48hrs": 2,
    "1wk": 0,
    "2wks": -2,
  };

  // Independent cost calculations
  const adultGarmentCost = adultGarments * adultRate;
  const kidsGarmentCost = kidsGarments * kidsRate;
  
  const totalAdultCost = adultGarmentCost + (pickupSurcharge[adultsPickupOption] || 0);
  const totalKidsCost = kidsGarmentCost + (pickupSurcharge[kidsPickupOption] || 0);

  // Update state for adult and kid costs separately
  setAdultIroningCosts((prev) => {
    const updated = [...prev];
    updated[index] = totalAdultCost;
    return updated;
  });
  setKidsIroningCosts((prev) => {
    const updated = [...prev];
    updated[index] = totalKidsCost;
    return updated;
  });
  setTotalIroningCosts(kidsIroningCosts[index] + adultIroningCosts[index] || 0)
  };
  const totalIroningCost = (adultIroningCosts.reduce((sum, cost) => sum + (cost || 0), 0)) + (kidsIroningCosts.reduce((sum, cost) => sum + (cost || 0), 0))

  const calculateDryCleaningCost = (index) => {
    const { adultGarments, kidsGarments, adultsPickupOption, kidsPickupOption } = dryCleaningDetails[index];

  // Pricing Rules
  const adultRate = 10;  // Example: $10 per adult garment
  const kidsRate = 5;    // Example: $5 per kids garment
  const pickupSurcharge = {
    "ondemand": 15,
    "6hrs": 10,
    "24hrs": 5,
    "48hrs": 2,
    "1wk": 0,
    "2wks": -2,
  };

  // Independent cost calculations
  const adultGarmentCost = adultGarments * adultRate;
  const kidsGarmentCost = kidsGarments * kidsRate;
  
  const totalAdultCost = adultGarmentCost + (pickupSurcharge[adultsPickupOption] || 0);
  const totalKidsCost = kidsGarmentCost + (pickupSurcharge[kidsPickupOption] || 0);

  // Update state for adult and kid costs separately
  setAdultDryCleaningCosts((prev) => {
    const updated = [...prev];
    updated[index] = totalAdultCost;
    return updated;
  });

  setKidsDryCleaningCosts((prev) => {
    const updated = [...prev];
    updated[index] = totalKidsCost;
    return updated;
  });
  setTotalDryCleaningCosts(kidsDryCleaningCosts[index] + adultDryCleaningCosts[index] || 0)
  };
  const totalDryCleaningCost = (adultDryCleaningCosts.reduce((sum, cost) => sum + (cost || 0), 0)) + (kidsDryCleaningCosts.reduce((sum, cost) => sum + (cost || 0), 0))

  const calculateLaundryCost = (index) => {
    const { adultGarments, kidsGarments, adultsPickupOption, kidsPickupOption } = laundryDetails[index];

    // Pricing Rules
    const adultRate = 10;  // Example: $10 per adult garment
    const kidsRate = 5;    // Example: $5 per kids garment
    const pickupSurcharge = {
      "ondemand": 15,
      "6hrs": 10,
      "24hrs": 5,
      "48hrs": 2,
      "1wk": 0,
      "2wks": -2,
    };

    // Independent cost calculations
    const adultGarmentCost = adultGarments * adultRate;
    const kidsGarmentCost = kidsGarments * kidsRate;
    
    const totalAdultCost = adultGarmentCost + (pickupSurcharge[adultsPickupOption] || 0);
    const totalKidsCost = kidsGarmentCost + (pickupSurcharge[kidsPickupOption] || 0);

    // Update state for adult and kid costs separately
    setAdultLaundryCosts((prev) => {
      const updated = [...prev];
      updated[index] = totalAdultCost;
      return updated;
    });

    setKidsLaundryCosts((prev) => {
      const updated = [...prev];
      updated[index] = totalKidsCost;
      return updated;
    });
    setTotalLaundryCosts(kidsLaundryCosts[index] + adultLaundryCosts[index] || 0);
  };
  const totalLaundryCost = (adultLaundryCosts.reduce((sum, cost) => sum + (cost || 0), 0)) + (kidsLaundryCosts.reduce((sum, cost) => sum + (cost || 0), 0))
  
  const onClose = ()=>{
    setAlteration(false)
    setBeddingCleaning(false)
    setCurtainCleaning(false)
    setDryCleaning(false)
    setIroning(false)
    setLaundry(false)
    setStainRemoval(false)
    setSuedeCleaning(false)
    setWeddingGown(false)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
  
    // Calculate total garments across all services
    const totalGarments = [
      ...stainRemovalCount,
      ...dryCleaningDetails.map(d => d.adultGarments + d.kidsGarments), 
      ...ironingDetails.map(d => d.adultGarments + d.kidsGarments), 
      ...laundryDetails.map(d => d.adultGarments + d.kidsGarments)
    ].reduce((acc, val) => acc + val, 0);
  
    if (totalGarments === 0) {
        toast.warn("Please enter at least one garment before submitting.");
        return;
    }
  
    // Ensure user is logged in
    const token = localStorage.getItem("Logged_customer_token");
    if (!token) {
        toast.warn("Session expired. Please log in again.");
        return;
    }
  
    const userId = JSON.parse(localStorage.getItem("laundry_customer_loggedUser")).id;
  
    // Calculate overall total cost from each service category
    const overallTotalCost = totalStainRemovalCost + totalDryCleaningCost + totalIroningCost + totalLaundryCost;
  
    // Construct order data for backend
    const formData = {
      userId,
      itemQuantity: totalGarments,
      totalCost: overallTotalCost,
      serviceType: [
        // Stain Removal Services
        ...stainRemovalServices.map((s, index) => ({
            category: "Stain Removal",
            title: s.title,
            garments: stainRemovalCount[index] || 0, 
            pickupOption: pickupOptions[index] || "",
            cost: stainRemovalCosts[index] || 0
        })).filter(s => s.garments > 0),
  
        // Dry Cleaning Services
        ...dryCleaningServices.map((s, index) => ({
            category: "Dry Cleaning",
            title: s.title,
            adultGarments: dryCleaningDetails[index]?.adultGarments || 0,
            kidsGarments: dryCleaningDetails[index]?.kidsGarments || 0,
            adultsPickupOption: dryCleaningDetails[index]?.adultsPickupOption || "",
            kidsPickupOption: dryCleaningDetails[index]?.kidsPickupOption || "",
            cost: totalDryCleaningCosts[index] || 0
        })).filter(s => (s.adultGarments + s.kidsGarments) > 0),
  
        // Ironing Services
        ...ironingServices.map((s, index) => ({
            category: "Ironing",
            title: s.title,
            adultGarments: ironingDetails[index]?.adultGarments || 0,
            kidsGarments: ironingDetails[index]?.kidsGarments || 0,
            adultsPickupOption: ironingDetails[index]?.adultsPickupOption || "",
            kidsPickupOption: ironingDetails[index]?.kidsPickupOption || "",
            cost: totalIroningCosts[index] || 0
        })).filter(s => (s.adultGarments + s.kidsGarments) > 0),
  
        // Laundry Services
        ...laundryServices.map((s, index) => ({
            category: "Laundry",
            title: s.title,
            adultGarments: laundryDetails[index]?.adultGarments || 0,
            kidsGarments: laundryDetails[index]?.kidsGarments || 0,
            adultsPickupOption: laundryDetails[index]?.adultsPickupOption || "",
            kidsPickupOption: laundryDetails[index]?.kidsPickupOption || "",
            cost: totalLaundryCosts[index] || 0
        })).filter(s => (s.adultGarments + s.kidsGarments) > 0),
      ],
    };
  
    console.log("Submitting Order:", formData);
  
    try {
        const response = await axios.post("http://localhost:5000/api/orders", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        console.log(response.data);
  
        if (response.data.success) {
            toast.success("Order submitted successfully!");
            setSubmitOrders(false);
        }
    } catch (error) {
        console.error("Error submitting order:", error.response?.data || error.message);
        if (error.response?.status === 401) {
            toast.warn("Session expired. Please log in again.");
            localStorage.removeItem("Logged_customer_token");
            window.location.href = "/login";
        } else {
            toast.error(`Failed to submit order: ${error.response?.data?.msg || "Unknown error"}`);
        }
        setSubmitOrders(false);
    }
  };
  


  

  return (
    <>
    <Navbar/>
    {alteration && (
    //   <div className="fixed w-full my-16 h-[100vh] z-20 bg-gray-800 opacity-90 p-6 rounded shadow-lg text-center font-indie">
    //     <div className="relative w-[90%] left-[5%] h-[90vh] z-10 bg-gray-800 opacity-100 p-6 rounded shadow-lg text-center bg-cover overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black" style={{backgroundImage: "url('https://cdn.pixabay.com/photo/2020/04/15/15/01/virus-5046926_1280.jpg')"}}>
    //       <div className="flex flex-col relative">
    //         <div className="fixed top-28 right-30 cursor-pointer" onClick={onClose}><IoCloseSharp className="text-white size-12" /></div>
    //           <div className="flex flex-row gap-4 mx-auto items-center px-10">
    //             <div className="container mx-auto px-4 py-8">
    //               <h2 className="text-3xl font-bold text-black text-center mb-6 w-fit mx-auto p-2">
    //                 Alteration Services
    //               </h2>
    //               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 relative">
    //                 {alterationServices.map((service, index) => (
    //                   <div
    //                     key={service.id}
    //                     className="bg-white z-20 flex text-sm shadow-lg rounded-lg p-6 hover:shadow-xl transition gap-2"
    //                   >
    //                     <img src={service.images} className="w-[50%] h-[10rem] object-cover " alt="IMAGES" />
    //                    <div>
    //                     <h3 className="text-xl font-semibold text-gray-800 mb-3">
    //                         {service.title}
    //                       </h3>
    //                       <p className="text-gray-600 mb-4 text-left">{service.description}</p>
    //                       <div className="flex items-center gap-2">
    //                         <label className="block text-gray-700 font-bold mb-2">Number of Garments:</label>
    //                         <input
    //                           type="number"
    //                           min="0"
    //                           value={alterationCount[index] || ""}
    //                           onChange={(e) => handleAlterationInputChange(index, parseInt(e.target.value) || 0)}
    //                           placeholder="Enter number"
    //                           className="w-full border-b border-gray-300 rounded-md p-2 focus:none focus:outline-none"
    //                         />
    //                       </div>
    //                       <div className="flex items-center gap-2">
    //                         <p className="font-bold">Pickup Time:</p>
    //                         <select name="pickup" id="" value={pickupOptions[index] || ""} onChange={(e) => handlePickupOptionChange(index, e.target.value)} className="border-b">
    //                           <option value="">Select pickup time</option>
    //                           <option value="ondemand">On-Demand</option>
    //                           <option value="6hrs">6 Hours</option>
    //                           <option value="24hrs">24 Hours</option>
    //                           <option value="48hrs">48 Hours</option>
    //                           <option value="1wk">1 Week</option>
    //                           <option value="2wks">2 Weeks</option>
    //                         </select>
    //                       </div>
    //                       <p className="mt-4 text-gray-700 font-medium flex items-center text-right">Cost: <TbCurrencyNaira />{alterationCosts[index] || 0}</p>
    //                    </div>
    //                   </div>
    //                 ))}
    //               </div>
    //               <p className="bg-white w-fit mx-auto p-2 m-2 text-black font-bold text-xl flex items-center gap-1">Total Service Cost:<TbCurrencyNaira />{totalAlterationCost}</p>
    //             </div>
    //           </div>
    //       </div>
    //     </div>
    // </div>
    <div className="fixed w-full my-16 h-[100vh]  bg-gray-800 opacity-90 p-6 rounded shadow-lg text-center font-indie">
        <div className="flex flex-col bg-white rounded-lg p-3">
            <div className="flex flex-row gap-4 mx-auto items-center px-10">
              <div className="container mx-auto px-4 py-8">
                    <h2 className="text-3xl font-bold text-black text-center mb-6 w-fit mx-auto p-2">
                      Alterations and Repairs
                    </h2>
                     <div className="relative mx-auto bg-cover w-[100%] h-[20rem]">
                     <div className="fixed top-28 left-10 cursor-pointer" onClick={onClose}><IoCloseSharp className="text-black size-12" /></div>
                     <img className="mx-auto object-cover w-full h-full" src="https://img.freepik.com/free-vector/abstract-coming-soon-halftone-style-background-design_1017-27282.jpg?semt=ais_hybrid" alt="Not Yet Available " />
                    </div>
                  </div>  
              </div>
        </div>
    </div>
    )}
    {beddingCleaning && (
      <div className="fixed w-full my-16 h-[100vh] z-20 bg-gray-800 opacity-90 p-6 rounded shadow-lg text-center font-indie">
        <div className="flex flex-col bg-white rounded-lg p-3">
            <div className="flex flex-row gap-4 mx-auto items-center px-10">
              <div className="container mx-auto px-4 py-8">
                    <h2 className="text-3xl font-bold text-black text-center mb-6 w-fit mx-auto p-2">
                      Bedding and Linen Cleaning
                    </h2>
                     <div className="relative mx-auto bg-cover w-[100%] h-[20rem]">
                     <div className="fixed top-28 left-10 cursor-pointer" onClick={onClose}><IoCloseSharp className="text-black size-12" /></div>
                     <img className="mx-auto object-cover w-full h-full" src="https://img.freepik.com/free-vector/abstract-coming-soon-halftone-style-background-design_1017-27282.jpg?semt=ais_hybrid" alt="Not Yet Available " />
                    </div>
                  </div>  
              </div>
        </div>
    </div>
    )}
    {curtainCleaning && (
     <div className="fixed w-full my-16 h-[100vh] z-20 bg-gray-800 opacity-90 p-6 rounded shadow-lg text-center font-indie">
     <div className="flex flex-col bg-white rounded-lg p-3">
         <div className="flex flex-row gap-4 mx-auto items-center px-10">
           <div className="container mx-auto px-4 py-8">
                 <h2 className="text-3xl font-bold text-black text-center mb-6 w-fit mx-auto p-2">
                   Curtain and Drapery Cleaning
                 </h2>
                  <div className="relative mx-auto bg-cover w-[100%] h-[20rem]">
                  <div className="fixed top-28 left-10 cursor-pointer" onClick={onClose}><IoCloseSharp className="text-black size-12" /></div>
                  <img className="mx-auto object-cover w-full h-full" src="https://img.freepik.com/free-vector/abstract-coming-soon-halftone-style-background-design_1017-27282.jpg?semt=ais_hybrid" alt="Not Yet Available" />
                 </div>
               </div>  
           </div>
     </div>
 </div>
    )}
    
    {suedeCleaning && (
      <div className="fixed w-full my-16 h-[100vh] z-20 bg-gray-800 opacity-90 p-6 rounded shadow-lg text-center font-indie">
      <div className="flex flex-col bg-white rounded-lg p-3">
          <div className="flex flex-row gap-4 mx-auto items-center px-10">
            <div className="container mx-auto px-4 py-8">
                  <h2 className="text-3xl font-bold text-black text-center mb-6 w-fit mx-auto p-2">
                    Leather and Suede Cleaning
                  </h2>
                   <div className="relative mx-auto bg-cover w-[100%] h-[20rem]">
                   <div className="fixed top-28 left-10 cursor-pointer" onClick={onClose}><IoCloseSharp className="text-black size-12" /></div>
                   <img className="mx-auto object-cover w-full h-full" src="https://img.freepik.com/free-vector/abstract-coming-soon-halftone-style-background-design_1017-27282.jpg?semt=ais_hybrid" alt="Not Yet Available" />
                  </div>
                </div>  
            </div>
      </div>
  </div>
    )}
    {weddingGown && (
     <div className="fixed w-full my-16 h-[100vh] z-20 bg-gray-800 opacity-90 p-6 rounded shadow-lg text-center font-indie">
     <div className="flex flex-col bg-white rounded-lg p-3">
         <div className="flex flex-row gap-4 mx-auto items-center px-10">
           <div className="container mx-auto px-4 py-8">
                 <h2 className="text-3xl font-bold text-black text-center mb-6 w-fit mx-auto p-2">
                   Wedding Gown Preservation
                 </h2>
                  <div className="relative mx-auto bg-cover w-[100%] h-[20rem]">
                  <div className="fixed top-28 left-10 cursor-pointer" onClick={onClose}><IoCloseSharp className="text-black size-12" /></div>
                  <img className="mx-auto object-cover w-full h-full" src="https://img.freepik.com/free-vector/abstract-coming-soon-halftone-style-background-design_1017-27282.jpg?semt=ais_hybrid" alt="Not Yet Available" />
                 </div>
               </div>  
           </div>
     </div>
 </div>
    )}
    <div>
      <form action="" onSubmit={handleSubmit}>
        {stainRemoval && (
          <div className="fixed w-full my-16 h-[100vh] z-20 bg-gray-800 opacity-100 p-6 rounded shadow-lg text-center font-indie">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl mx-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 text-center flex-1">
                    Stain Removal Services
                  </h2>
                  <div className="cursor-pointer" onClick={onClose}>
                    <IoCloseSharp className="text-gray-800 size-8 hover:text-red-600 transition-colors" />
                  </div>
                </div>

                <p className="bg-blue-950 w-fit mx-auto px-4 py-2 rounded-lg text-white font-bold text-xl flex items-center gap-2 mb-8">
                  Total Service Cost: <TbCurrencyNaira className="text-2xl" />{totalStainRemovalCost}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[60vh] overflow-y-auto px-4">
                  {stainRemovalServices.map((service, index) => (
                    <div
                      key={service.id}
                      className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="aspect-w-16 aspect-h-9 rounded-t-xl overflow-hidden">
                        <img 
                          src={service.images} 
                          className="w-full h-48 object-cover"
                          alt={service.title}
                        />
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 mb-6">{service.description}</p>
                        
                        <div className="space-y-4">
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              value={stainRemovalCount[index] || ""}
                              onChange={(e) => handleStainRemovalInputChange(index, parseInt(e.target.value) || 0)}
                              placeholder="Number of garments"
                              className="w-full font-sans px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                          </div>

                          <select 
                            value={pickupOptions[index] || ""} 
                            onChange={(e) => handleStainRemovalPickupOptionChange(index, e.target.value)}
                            className="w-full font-sans px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          >
                            <option value="">Select pickup time</option>
                            {!(stainRemovalCount[index] > 10) && (
                              <option value="ondemand">On-Demand</option>
                            )}
                            {!(stainRemovalCount[index] > 20) && (
                              <option value="6hrs">6 Hours</option>
                            )}
                            {!(stainRemovalCount[index] > 30) && (
                              <option value="24hrs">24 Hours</option>
                            )}
                            {!(stainRemovalCount[index] > 60) && (
                              <option value="48hrs">48 Hours</option>
                            )}
                            {!(stainRemovalCount[index] > 100) && (
                              <option value="1wk">1 Week</option>
                            )}
                            <option value="2wks">2 Weeks</option>
                          </select>

                          <div className="flex font-sans items-center justify-between pt-4 border-t border-gray-200">
                            <span className="text-gray-600 font-medium">Service Cost:</span>
                            <span className="text-blue-950 font-bold text-xl flex items-center gap-1">
                              <TbCurrencyNaira />
                              {stainRemovalCosts[index] || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {dryCleaning && (
          <div className="fixed w-full my-16 h-[100vh] z-20 bg-gray-800 opacity-100 p-6 rounded shadow-lg text-center font-indie">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl mx-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 text-center flex-1">
                    Dry Cleaning Services
                  </h2>
                  <div className="cursor-pointer" onClick={onClose}>
                    <IoCloseSharp className="text-gray-800 size-8 hover:text-red-600 transition-colors" />
                  </div>
                </div>

                <p className="bg-blue-950 w-fit mx-auto px-4 py-2 rounded-lg text-white font-bold text-xl flex items-center gap-2 mb-8">
                  Total Service Cost: <TbCurrencyNaira className="text-2xl" />{totalDryCleaningCost.toFixed(2)}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[60vh] overflow-y-auto px-4">
                  {dryCleaningServices.map((service, index) => (
                    <div
                      key={service.id}
                      className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="aspect-w-16 aspect-h-9 rounded-t-xl overflow-hidden">
                        <img 
                          src={service.images} 
                          className="w-full h-48 object-cover"
                          alt={service.title}
                        />
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 mb-6">{service.description}</p>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="block text-gray-700 font-semibold">Adult Wear</label>
                              <input
                                type="number"
                                min="0"
                                value={dryCleaningDetails[index]?.adultGarments || ""}
                                onChange={(e) => handleAdultDryCleaningInputChange(index, "adultGarments", e.target.value)}
                                placeholder="Number of garments"
                                className="w-full font-sans px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              />
                              <select 
                                value={dryCleaningDetails[index]?.adultsPickupOption || ""} 
                                onChange={(e) => handleAdultDryCleaningPickupOptionChange(index, e.target.value)}
                                className="w-full font-sans px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              >
                                <option value="">Select pickup time</option>
                                {!(dryCleaningDetails[index]?.adultGarments > 10) && (
                                  <option value="ondemand">On-Demand</option>
                                )}
                                {!(dryCleaningDetails[index]?.adultGarments > 20) && (
                                  <option value="6hrs">6 Hours</option>
                                )}
                                {!(dryCleaningDetails[index]?.adultGarments > 30) && (
                                  <option value="24hrs">24 Hours</option>
                                )}
                                {!(dryCleaningDetails[index]?.adultGarments > 60) && (
                                  <option value="48hrs">48 Hours</option>
                                )}
                                {!(dryCleaningDetails[index]?.adultGarments > 100) && (
                                  <option value="1wk">1 Week</option>
                                )}
                                <option value="2wks">2 Weeks</option>
                              </select>
                            </div>

                            <div className="space-y-2">
                              <label className="block text-gray-700 font-semibold">Kids Wear</label>
                              <input
                                type="number"
                                min="0"
                                value={dryCleaningDetails[index]?.kidsGarments || ""}
                                onChange={(e) => handleKidsDryCleaningInputChange(index, "kidsGarments", e.target.value)}
                                placeholder="Number of garments"
                                className="w-full font-sans px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              />
                              <select 
                                value={dryCleaningDetails[index]?.kidsPickupOption || ""} 
                                onChange={(e) => handleKidsDryCleaningPickupOptionChange(index, e.target.value)}
                                className="w-full font-sans px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              >
                                <option value="">Select pickup time</option>
                                {!(dryCleaningDetails[index]?.kidsGarments > 10) && (
                                  <option value="ondemand">On-Demand</option>
                                )}
                                {!(dryCleaningDetails[index]?.kidsGarments > 20) && (
                                  <option value="6hrs">6 Hours</option>
                                )}
                                {!(dryCleaningDetails[index]?.kidsGarments > 30) && (
                                  <option value="24hrs">24 Hours</option>
                                )}
                                {!(dryCleaningDetails[index]?.kidsGarments > 60) && (
                                  <option value="48hrs">48 Hours</option>
                                )}
                                {!(dryCleaningDetails[index]?.kidsGarments > 100) && (
                                  <option value="1wk">1 Week</option>
                                )}
                                <option value="2wks">2 Weeks</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex font-sans items-center justify-between pt-4 border-t border-gray-200">
                            <span className="text-gray-600 font-medium">Service Cost:</span>
                            <span className="text-blue-950 font-bold text-xl flex items-center gap-1">
                              <TbCurrencyNaira />
                              {(adultDryCleaningCosts[index] + kidsDryCleaningCosts[index]) || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {ironing && (
          <div className="fixed w-full my-16 h-[100vh] z-20 bg-gray-800 opacity-100 p-6 rounded shadow-lg text-center font-indie">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl mx-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 text-center flex-1">
                    Ironing Services
                  </h2>
                  <div className="cursor-pointer" onClick={onClose}>
                    <IoCloseSharp className="text-gray-800 size-8 hover:text-red-600 transition-colors" />
                  </div>
                </div>

                <p className="bg-blue-950 w-fit mx-auto px-4 py-2 rounded-lg text-white font-bold text-xl flex items-center gap-2 mb-8">
                  Total Service Cost: <TbCurrencyNaira className="text-2xl" />{totalIroningCost.toFixed(2)}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[60vh] overflow-y-auto px-4">
                  {ironingServices.map((service, index) => (
                    <div
                      key={service.id}
                      className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="aspect-w-16 aspect-h-9 rounded-t-xl overflow-hidden">
                        <img 
                          src={service.images} 
                          className="w-full h-48 object-cover"
                          alt={service.title}
                        />
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 mb-6">{service.description}</p>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="block text-gray-700 font-semibold">Adult Wear</label>
                              <input
                                type="number"
                                min="0"
                                value={ironingDetails[index]?.adultGarments || ""}
                                onChange={(e) => handleAdultIroningInputChange(index, "adultGarments", e.target.value)}
                                placeholder="Number of garments"
                                className="w-full font-sans px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              />
                              <select 
                                value={ironingDetails[index]?.adultsPickupOption || ""} 
                                onChange={(e) => handleAdultIroningPickupOptionChange(index, e.target.value)}
                                className="w-full font-sans px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              >
                                <option value="">Select pickup time</option>
                                {!(ironingDetails[index]?.adultGarments > 10) && (
                                  <option value="ondemand">On-Demand</option>
                                )}
                                {!(ironingDetails[index]?.adultGarments > 20) && (
                                  <option value="6hrs">6 Hours</option>
                                )}
                                {!(ironingDetails[index]?.adultGarments > 30) && (
                                  <option value="24hrs">24 Hours</option>
                                )}
                                {!(ironingDetails[index]?.adultGarments > 60) && (
                                  <option value="48hrs">48 Hours</option>
                                )}
                                {!(ironingDetails[index]?.adultGarments > 100) && (
                                  <option value="1wk">1 Week</option>
                                )}
                                <option value="2wks">2 Weeks</option>
                              </select>
                            </div>

                            <div className="space-y-2">
                              <label className="block text-gray-700 font-semibold">Kids Wear</label>
                              <input
                                type="number"
                                min="0"
                                value={ironingDetails[index]?.kidsGarments || ""}
                                onChange={(e) => handleKidsIroningInputChange(index, "kidsGarments", e.target.value)}
                                placeholder="Number of garments"
                                className="w-full font-sans px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              />
                              <select 
                                value={ironingDetails[index]?.kidsPickupOption || ""} 
                                onChange={(e) => handleKidsIroningPickupOptionChange(index, e.target.value)}
                                className="w-full font-sans px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              >
                                <option value="">Select pickup time</option>
                                {!(ironingDetails[index]?.kidsGarments > 10) && (
                                  <option value="ondemand">On-Demand</option>
                                )}
                                {!(ironingDetails[index]?.kidsGarments > 20) && (
                                  <option value="6hrs">6 Hours</option>
                                )}
                                {!(ironingDetails[index]?.kidsGarments > 30) && (
                                  <option value="24hrs">24 Hours</option>
                                )}
                                {!(ironingDetails[index]?.kidsGarments > 60) && (
                                  <option value="48hrs">48 Hours</option>
                                )}
                                {!(ironingDetails[index]?.kidsGarments > 100) && (
                                  <option value="1wk">1 Week</option>
                                )}
                                <option value="2wks">2 Weeks</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex font-sans items-center justify-between pt-4 border-t border-gray-200">
                            <span className="text-gray-600 font-medium">Service Cost:</span>
                            <span className="text-blue-950 font-bold text-xl flex items-center gap-1">
                              <TbCurrencyNaira />
                              {(adultIroningCosts[index] + kidsIroningCosts[index]) || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {laundry && (
          <div className="fixed w-full my-16 h-[100vh] z-20 bg-gray-800 opacity-100 p-6 rounded shadow-lg text-center font-indie">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl mx-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 text-center flex-1">
                    Laundry Services
                  </h2>
                  <div className="cursor-pointer" onClick={onClose}>
                    <IoCloseSharp className="text-gray-800 size-8 hover:text-red-600 transition-colors" />
                  </div>
                </div>

                <p className="bg-blue-950 w-fit mx-auto px-4 py-2 rounded-lg text-white font-bold text-xl flex items-center gap-2 mb-8">
                  Total Service Cost: <TbCurrencyNaira className="text-2xl" />{totalLaundryCost.toFixed(2)}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[60vh] overflow-y-auto px-4">
                  {laundryServices.map((service, index) => (
                    <div
                      key={service.id}
                      className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="aspect-w-16 aspect-h-9 rounded-t-xl overflow-hidden">
                        <img 
                          src={service.images} 
                          className="w-full h-48 object-cover"
                          alt={service.title}
                        />
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 mb-6">{service.description}</p>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="block text-gray-700 font-semibold">Adult Wear</label>
                              <input
                                type="number"
                                min="0"
                                value={laundryDetails[index]?.adultGarments || ""}
                                onChange={(e) => handleAdultLaundryInputChange(index, "adultGarments", e.target.value)}
                                placeholder="Number of garments"
                                className="w-full font-sans px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              />
                              <select 
                                value={laundryDetails[index]?.adultsPickupOption || ""} 
                                onChange={(e) => handleAdultLaundryPickupOptionChange(index, e.target.value)}
                                className="w-full font-sans px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              >
                                <option value="">Select pickup time</option>
                                {!(laundryDetails[index]?.adultGarments > 10) && (
                                  <option value="ondemand">On-Demand</option>
                                )}
                                {!(laundryDetails[index]?.adultGarments > 20) && (
                                  <option value="6hrs">6 Hours</option>
                                )}
                                {!(laundryDetails[index]?.adultGarments > 30) && (
                                  <option value="24hrs">24 Hours</option>
                                )}
                                {!(laundryDetails[index]?.adultGarments > 60) && (
                                  <option value="48hrs">48 Hours</option>
                                )}
                                {!(laundryDetails[index]?.adultGarments > 100) && (
                                  <option value="1wk">1 Week</option>
                                )}
                                <option value="2wks">2 Weeks</option>
                              </select>
                            </div>

                            <div className="space-y-2">
                              <label className="block text-gray-700 font-semibold">Kids Wear</label>
                              <input
                                type="number"
                                min="0"
                                value={laundryDetails[index]?.kidsGarments || ""}
                                onChange={(e) => handleKidsLaundryInputChange(index, "kidsGarments", e.target.value)}
                                placeholder="Number of garments"
                                className="w-full font-sans px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              />
                              <select 
                                value={laundryDetails[index]?.kidsPickupOption || ""} 
                                onChange={(e) => handleKidsLaundryPickupOptionChange(index, e.target.value)}
                                className="w-full font-sans px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              >
                                <option value="">Select pickup time</option>
                                {!(laundryDetails[index]?.kidsGarments > 10) && (
                                  <option value="ondemand">On-Demand</option>
                                )}
                                {!(laundryDetails[index]?.kidsGarments > 20) && (
                                  <option value="6hrs">6 Hours</option>
                                )}
                                {!(laundryDetails[index]?.kidsGarments > 30) && (
                                  <option value="24hrs">24 Hours</option>
                                )}
                                {!(laundryDetails[index]?.kidsGarments > 60) && (
                                  <option value="48hrs">48 Hours</option>
                                )}
                                {!(laundryDetails[index]?.kidsGarments > 100) && (
                                  <option value="1wk">1 Week</option>
                                )}
                                <option value="2wks">2 Weeks</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex font-sans items-center justify-between pt-4 border-t border-gray-200">
                            <span className="text-gray-600 font-medium">Service Cost:</span>
                            <span className="text-blue-950 font-bold text-xl flex items-center gap-1">
                              <TbCurrencyNaira />
                              {(adultLaundryCosts[index] + kidsLaundryCosts[index]) || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
         
  
        <div className="bg-indigo-300 min-h-screen w-full py-20 bg-cover" style={{backgroundImage: 'url("https://softhealer.com/theme_softhealer_website/static/src/img/images/laundry_management/overview.webp")'}}>
          <div onClick={toggleOrders} className="fixed p-3 text-center right-8 top-24 cursor-pointer rounded-lg bg-white text-blue-950 shadow-lg group">
            <MdOutlineCategory className="text-blue-950 size-6" />
            <div className="absolute -bottom-[40%] right-7 transform -translate-y-1 translate-x-[40px] px-2 py-1 bg-blue-950 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              View&nbsp;Order
            </div>
          </div>

          <div className="container mx-auto px-6">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl mx-auto opacity-90">
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
                  Our Services
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  <div className="bg-white shadow-md rounded-lg hover:shadow-xl transition duration-300 cursor-pointer" onClick={toggleAlteration}>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">Alterations and Repairs</h3>
                      <p className="text-gray-600">Tailoring services for garment adjustments, stitching, and minor repairs.</p>
                    </div>
                  </div>

                  <div className="bg-white shadow-md rounded-lg hover:shadow-xl transition duration-300 cursor-pointer" onClick={toggleBeddingCleaning}>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">Bedding and Linen Cleaning</h3>
                      <p className="text-gray-600">Comprehensive cleaning for bed sheets, duvet covers, pillowcases, and comforters.</p>
                    </div>
                  </div>

                  <div className="bg-white shadow-md rounded-lg hover:shadow-xl transition duration-300 cursor-pointer" onClick={toggleCurtainCleaning}>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">Curtain and Drapery Cleaning</h3>
                      <p className="text-gray-600">Detailed cleaning of your household drapes, curtains and carpets are available.</p>
                    </div>
                  </div>

                  <div className="bg-white shadow-md rounded-lg hover:shadow-xl transition duration-300 cursor-pointer" onClick={toggleDryCleaning}>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">Dry Cleaning</h3>
                      <p className="text-gray-600">Premium dry-cleaning services for delicate garments.</p>
                    </div>
                  </div>

                  <div className="bg-white shadow-md rounded-lg hover:shadow-xl transition duration-300 cursor-pointer" onClick={toggleIroning}>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">Ironing Services</h3>
                      <p className="text-gray-600">Professional ironing for a crisp and polished look.</p>
                    </div>
                  </div>

                  <div className="bg-white shadow-md rounded-lg hover:shadow-xl transition duration-300 cursor-pointer" onClick={toggleLaundry}>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">Laundry Services</h3>
                      <p className="text-gray-600">Efficient washing, drying, and folding for everyday clothes.</p>
                    </div>
                  </div>

                  <div className="bg-white shadow-md rounded-lg hover:shadow-xl transition duration-300 cursor-pointer" onClick={toggleStainRemoval}>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">Stain Removal</h3>
                      <p className="text-gray-600">Expert stain treatment for tough stains on any fabric.</p>
                    </div>
                  </div>

                  <div className="bg-white shadow-md rounded-lg hover:shadow-xl transition duration-300 cursor-pointer" onClick={toggleSuedeCleaning}>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">Leather and Suede Cleaning</h3>
                      <p className="text-gray-600">Specialised care for cleaning and restoring delicate leather and suede garments.</p>
                    </div>
                  </div>

                  <div className="bg-white shadow-md rounded-lg hover:shadow-xl transition duration-300 cursor-pointer" onClick={toggleWeddingGown}>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">Wedding Gown Preservation</h3>
                      <p className="text-gray-600">Special care for cleaning and preserving wedding gowns.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {orders && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-30 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-[95%] max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-950 to-blue-800 p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Order Summary</h2>
                  <button 
                    onClick={closeOrders}
                    className="text-white hover:text-red-400 transition-colors"
                  >
                    <IoCloseSharp className="size-8" />
                  </button>
                </div>
              </div>

              {/* Services Grid */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Ironing Section */}
                  {ironingDetails.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                      <div className="bg-blue-950 text-white p-4 rounded-t-xl">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">Ironing Services</h3>
                          <span className="bg-blue-900 px-3 py-1 rounded-full text-sm">
                            <TbCurrencyNaira className="inline" />{totalIroningCost}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        {ironingDetails.map(detail => (
                          <div key={detail.id} className="bg-gray-50 rounded-lg p-3">
                            <h4 className="font-medium text-blue-950">{detail.title}</h4>
                            <div className="mt-2 text-sm text-gray-600 space-y-1">
                              <div className="flex justify-between">
                                <span>Adult Garments:</span>
                                <span className="font-medium">{detail.adultGarments}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Kids Garments:</span>
                                <span className="font-medium">{detail.kidsGarments}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Laundry Section */}
                  {laundryDetails.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                      <div className="bg-blue-950 text-white p-4 rounded-t-xl">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">Laundry Services</h3>
                          <span className="bg-blue-900 px-3 py-1 rounded-full text-sm">
                            <TbCurrencyNaira className="inline" />{totalLaundryCost}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        {laundryDetails.map(detail => (
                          <div key={detail.id} className="bg-gray-50 rounded-lg p-3">
                            <h4 className="font-medium text-blue-950">{detail.title}</h4>
                            <div className="mt-2 text-sm text-gray-600 space-y-1">
                              <div className="flex justify-between">
                                <span>Adult Garments:</span>
                                <span className="font-medium">{detail.adultGarments}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Kids Garments:</span>
                                <span className="font-medium">{detail.kidsGarments}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dry Cleaning Section */}
                  {dryCleaningDetails.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                      <div className="bg-blue-950 text-white p-4 rounded-t-xl">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">Dry Cleaning Services</h3>
                          <span className="bg-blue-900 px-3 py-1 rounded-full text-sm">
                            <TbCurrencyNaira className="inline" />{totalDryCleaningCost}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        {dryCleaningDetails.map(detail => (
                          <div key={detail.id} className="bg-gray-50 rounded-lg p-3">
                            <h4 className="font-medium text-blue-950">{detail.title}</h4>
                            <div className="mt-2 text-sm text-gray-600 space-y-1">
                              <div className="flex justify-between">
                                <span>Adult Garments:</span>
                                <span className="font-medium">{detail.adultGarments}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Kids Garments:</span>
                                <span className="font-medium">{detail.kidsGarments}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Alteration Section */}
                  {alterationCount.some(count => count > 0) && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                      <div className="bg-blue-950 text-white p-4 rounded-t-xl">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">Alteration Services</h3>
                          <span className="bg-blue-900 px-3 py-1 rounded-full text-sm">
                            <TbCurrencyNaira className="inline" />{totalAlterationCost}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        {alterationCount.map((count, index) => (
                          count > 0 && (
                            <div key={index} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-blue-950">
                                  {alterationServices[index].title}
                                </span>
                                <span className="text-gray-600">{count} garments</span>
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stain Removal Section */}
                  {stainRemovalCount.some(count => count > 0) && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                      <div className="bg-blue-950 text-white p-4 rounded-t-xl">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">Stain Removal Services</h3>
                          <span className="bg-blue-900 px-3 py-1 rounded-full text-sm">
                            <TbCurrencyNaira className="inline" />{totalStainRemovalCost}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        {stainRemovalCount.map((count, index) => (
                          count > 0 && (
                            <div key={index} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-blue-950">
                                  {stainRemovalServices[index].title}
                                </span>
                                <span className="text-gray-600">{count} garments</span>
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="bg-blue-950 text-white px-6 py-3 rounded-xl">
                    <div className="text-sm">Total Order Cost</div>
                    <div className="text-2xl font-bold flex items-center">
                      <TbCurrencyNaira className="text-3xl" />
                      {totalIroningCost + totalAlterationCost + totalDryCleaningCost + totalStainRemovalCost + totalLaundryCost}
                    </div>
                  </div>
                  <button 
                    onClick={() => {setSubmitOrders(true); setOrders(false)}}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {submitOrder && (
            <div className="w-full h-full z-70 top-0 bg-black rounded-lg opacity-90 font-indie fixed left-0">
              <div className="z-90 my-[30vh] mx-auto py-20 gap-4 w-[50%] bg-white rounded-lg text-center flex-col flex item-center">
                <p className="font-sans">Are you sure your order details are accurate and you want to proceed to submit?</p>
                <div className="mx-auto flex gap-2 ">
                  <button type="submit" className="border bg-green-700 text-white p-2 rounded-lg" >Proceed</button>
                  <button type="button" className="border bg-red-700 text-white p-2 rounded-lg" onClick={()=>{setSubmitOrders(false)}}>Cancel</button>
                </div>
              </div>
            </div>
          )}
      </form>
    </div> 
    <ToastContainer />
    </>
    
  );
};

export default Services;
