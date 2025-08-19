import React from "react";
import { DialogContent, } from "@/components/ui/dialog"
import { FaClock, FaEnvelope, FaMapMarkerAlt, FaPhone, FaFacebookF } from "react-icons/fa";


const ContactPop = () => (
    <section>


        <DialogContent>
            <img src="/navBar/logo.png" alt="DBF Investment Limited" className="h-12 w-auto" />
            <h1 className="text-black font-bold text-xl">Invest with us for stable, long-term profits.</h1>
            <div className="border-b-2 border-gray-400"></div>
            <ul className="space-y-5">
                <li className="flex items-center gap-2"><FaMapMarkerAlt /> Dearo Investment Limited, 8th floor, Ceylinco
                House<br />No 69, Janadhipathi Mawatha, Colombo 01.</li>
                <li className="flex items-center gap-2"><FaPhone /> +94743908274 / <br /> +94702896932</li>
                <li className="flex items-center gap-2"><FaEnvelope />info@dearoinvestment.com</li>
                <li className="flex items-center gap-2"><FaClock /> 8:30 AM - 5:30 PM</li>
            </ul>
            <div className="flex flex-col md:flex-row justify-between items-center text-sm">

                <div className="mt-8 flex space-x-6">
                    <a
                        href="https://www.facebook.com/dearoinvestmentlimited/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 flex items-center justify-center bg-green-950 rounded-full text-white hover:bg-yellow-500 transition"
                    >
                        <FaFacebookF className="text-xl" />
                    </a>
                    
                </div>

            </div>

        </DialogContent>


    </section>

);
export default ContactPop;