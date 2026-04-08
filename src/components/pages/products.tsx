import  { useState } from "react";
import { FaAngleDoubleRight, FaMobile } from "react-icons/fa";

function Products() {
    const [activeTab, setActiveTab] = useState("product");

    return (
        <>
            {/* Header Section */}
            <section className="mt-15 w-full flex justify-center bg-white py-10">
                <img
                    src="/service.png"
                    alt="Dearo Agro Banner"
                    className="w-full max-h-[300px] sm:max-h-[400px] object-cover"
                />
            </section>

            {/* Title Section */}
            <section className="text-center py-6">
                <h1 className="font-extrabold text-green-950 text-4xl sm:text-5xl">
                    Dearo Agro Mobile App
                </h1>
                <p className="text-gray-600 mt-4 text-lg max-w-4xl mx-auto">
                    Our flagship product - A comprehensive digital ecosystem transforming Sri Lankan agriculture
                </p>
                <div className="mt-4 inline-block bg-green-100 px-6 py-2 rounded-full">
                    <span className="text-green-800 font-semibold">🏆 Main Product of Our Company</span>
                </div>
            </section>

            {/* Navigation Tabs */}
            
             {/* <div className="w-full">
                <div className="flex justify-center border-b">
                    {["product", "features"].map((tab) => (
                        <button
                            key={tab}
                            className={`w-full sm:w-auto px-6 sm:px-10 py-3 text-lg sm:text-xl transition-all duration-200 ${activeTab === tab
                                ? "border-b-4 border-green-950 font-semibold text-green-950"
                                : "text-gray-500 hover:text-green-600"
                                }`}
                            onClick={() => setActiveTab(tab)}
                            aria-selected={activeTab === tab}
                        >
                            {tab === "product" ? "About Our App" : "App Features"}
                        </button>
                    ))}
                </div> */}

                {/* Tab Content */}
                {/* <section className="w-full max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 px-6 py-10">
                    {activeTab === "product" ? (
                        <>
                            <div className="flex justify-center">
                                <img
                                    src="/Dearo Agro.png"
                                    alt="Dearo Agro Mobile App"
                                    className="max-w-full h-auto border-2 border-green-950 rounded-lg shadow-md"
                                />
                            </div>
                            <div className="border border-gray-300 shadow-md rounded-lg p-6">
                                <h2 className="text-lg font-bold text-gray-800">🚀 Our Flagship Product</h2>
                                <p className="text-green-950 font-bold mt-2 text-xl sm:text-3xl">Dearo Agro Mobile App</p>
                                <div className="mt-7 space-y-4 text-sm leading-relaxed">
                                    <p className="text-gray-700">
                                        <strong>🎯 Our Mission:</strong> Transform how farming business operates in Sri Lanka through our comprehensive mobile platform.
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>📱 The Solution:</strong> A mobile-first platform that bridges traditional agricultural practices with modern business opportunities.
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>🌱 Impact:</strong> Empowering farmers to transition from passive participants to active entrepreneurs in the agricultural value chain.
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>💡 Innovation:</strong> The app serves as a comprehensive business tool, not just an information app, actively facilitating transactions and knowledge transfer.
                                    </p>
                                </div>

                                <div className="mt-6 text-green-950 font-semibold ">
                                    <FaMobile className="inline-block mr-2 " />
                                    Download App: +94743908274
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-center">
                                <img
                                    src="/navBar/Farmers.jpeg"
                                    alt="App Features"
                                    className="max-w-full h-auto border-2 border-green-950rounded-lg shadow-md"
                                />
                            </div>
                            <div className="border border-gray-300 shadow-md rounded-lg p-6">
                                <h2 className="text-lg font-bold text-gray-800">📋 Complete App Features</h2>
                                <p className="text-green-950 font-bold mt-2 text-xl sm:text-3xl">Six Core Capabilities</p>
                                <ul className=" text-center mt-7 space-y-5 text-lg">
                                    
                                    <li className="flex items-center gap-2">
                                        <FaAngleDoubleRight className="text-green-950" />
                                        📊 Comprehensive Cultivation Support
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <FaAngleDoubleRight className="text-green-950" />
                                        💰 Intelligent Financial Management
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <FaAngleDoubleRight className="text-green-950" />
                                        👨‍🌾 Expert Access & Knowledge Sharing
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <FaAngleDoubleRight className="text-green-950" />
                                        🏪 Market Transparency & Fair Pricing
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <FaAngleDoubleRight className="text-green-950" />
                                        📱 User-Friendly Design for All
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <FaAngleDoubleRight className="text-green-950" />
                                        📈 Data-Driven Agricultural Insights
                                    </li>


                                </ul>

                                <div className="mt-6 text-green-950 font-semibold ">
                                    <FaMobile className="inline-block mr-2 " />
                                    Get App Demo: +94743908274
                                </div>
                            </div>
                        </>
                    )}
                </section>
            </div>  */}
            
        </>
    );
}

export default Products;
