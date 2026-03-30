import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";


export default function Dashboard() {

  return (
    <div className="min-h-screen flex flex-col">

      <div className="bg-yellow-300 p-3 text-lg font-semibold">
        Click on Professionals List above to Load County Professionals
      </div>
      
      <main className="flex-1 flex items-center justify-center text-2xl font-medium">
        ICT & Innovation
      </main>
      
      <footer className="bg-white shadow-inner py-4">
  <div className="flex flex-col items-center space-y-3">
    
    {/* Social Media Links */}
    <div className="flex space-x-4">
      <a
        href="https://web.facebook.com/ugcounty?_rdc=1&_rdr#"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-yellow-400"
      >
        <FaFacebookF size={18} />
      </a>

      <a
        href="https://x.com/UGC_TheChampion"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-sky-500"
      >
        <FaTwitter size={18} />
      </a>

      <a
        href="https://instagram.com/uasin_gishu_county"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-pink-500"
      >
        <FaInstagram size={18} />
      </a>

      <a
        href="https://www.youtube.com/@countygovernmentofuasingis6548/videos"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-red-600"
      >
        <FaYoutube size={18} />
      </a>
    </div>

    {/* Copyright */}
    <div className="text-gray-600 text-sm text-center">
      © {new Date().getFullYear()} Uasin Gishu County. All rights reserved.
    </div>

  </div>
</footer>
      
    </div>
    
  );
}
