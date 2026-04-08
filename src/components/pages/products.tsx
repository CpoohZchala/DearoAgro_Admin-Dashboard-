import { useState } from "react";
import { CheckCircle, Target, Sparkles, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import productsData from "../../data/products.json";

// Define Product Interface
interface SubList {
    title: string;
    subPoints: string[];
}

interface Product {
    id: number;
    category: string;
    title: string;
    description: string;
    images: string[];
    whyChooseUs: (string | SubList)[]; // Meeka thamai aluth kalla
    forWhom: (string | SubList)[];
    benefits: (string | SubList)[];
}

// Reusable Product Card Component
const ProductCard = ({ product }: { product: Product }) => {
    //  tabs 3k thiyenwa benefits, forWhom, whyChooseUs
    const [activeTab, setActiveTab] = useState<'benefits' | 'forWhom' | 'whyChooseUs'>('benefits');

    const renderModernList = (items: (string | SubList)[], theme: 'emerald' | 'green') => {
        const themeColors = {
            emerald: {
                icon: "text-emerald-500",
                line: "border-emerald-100",
                dot: "border-emerald-400",
                bg: "bg-emerald-50/30"
            },
            green: {
                icon: "text-green-500",
                line: "border-green-100",
                dot: "border-green-400",
                bg: "bg-green-50/30"
            }
        }[theme];

        return (
            <div className={`rounded-[2rem] p-6 lg:p-8 border border-white/50 ${themeColors.bg} backdrop-blur-sm shadow-inner`}>
                <div className="space-y-6">
                    {items.map((item, idx) => {
                        const isString = typeof item === 'string';
                        const title = isString ? item : item.title;
                        return (
                            <div key={idx} className="group flex items-start gap-4">
                                <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center bg-white shadow-sm border border-gray-100 group-hover:rotate-12 transition-transform duration-300`}>
                                    <CheckCircle className={`w-4 h-4 ${themeColors.icon}`} />
                                </div>
                                <div className="flex-grow">
                                    <span className={`text-gray-800 text-[0.95rem] leading-snug ${!isString ? 'font-bold text-gray-900 block mb-2' : 'font-medium text-gray-700'}`}>
                                        {title}
                                    </span>
                                    {!isString && (
                                        <div className={`ml-2 mt-3 space-y-3 border-l-2 ${themeColors.line} pl-6 py-1`}>
                                            {item.subPoints.map((sub, sIdx) => (
                                                <div key={sIdx} className="flex items-start gap-4 hover:translate-x-1 transition-transform duration-200">
                                                    <div className={`w-1.5 h-1.5 rounded-full border-2 ${themeColors.dot} mt-1.5 flex-shrink-0 bg-white shadow-sm`} />
                                                    <span className="text-gray-600 text-sm font-medium leading-relaxed">{sub}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <motion.div
            // Card eka scroll karala view ekata enakota yana animations
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="group relative bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-gray-900/5 hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-500 border border-gray-200/50 overflow-hidden flex flex-col lg:flex-row mb-16"
        >
            {/* Hover Overlay Gradient - Card eka hover karaddi ena podi colour ekak */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Image Section - Methana thiyenne product images deka udin yatin display krana eka */}
            <div className="lg:w-2/5 p-8 flex justify-center items-center relative z-10 min-h-[420px] bg-gray-50/30">
                <div className="relative w-full max-w-[320px] h-[360px] lg:h-[400px]">
                    {/* Top Image - Udin thiyena image eka */}
                    <motion.div
                        initial={{ opacity: 0, y: -40, x: -20, rotate: -3 }}
                        whileInView={{ opacity: 1, y: 0, x: -20, rotate: -3 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.08, rotate: 0, zIndex: 30, x: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="absolute top-0 left-4 w-[85%] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white z-10 bg-white group/img-top"
                    >
                        <img
                            src={product.images[0]}
                            alt={`${product.title} 1`}
                            className="object-cover w-full h-full transition-transform duration-700 group-hover/img-top:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/img-top:opacity-100 transition-opacity" />
                    </motion.div>

                    {/* Bottom Image - Yatin thiyena image eka */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, x: 20, rotate: 3 }}
                        whileInView={{ opacity: 1, y: 20, x: 20, rotate: 3 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.08, rotate: 0, zIndex: 30, x: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                        className="absolute bottom-0 right-4 w-[85%] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white z-20 bg-white group/img-bottom"
                    >
                        <img
                            src={product.images[1] || product.images[0]}
                            alt={`${product.title} 2`}
                            className="object-cover w-full h-full transition-transform duration-700 group-hover/img-bottom:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/img-bottom:opacity-100 transition-opacity" />
                    </motion.div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
                </div>
            </div>

            {/* Content Section - Title, Description saha Tabs meke thiyenne */}
            <div className="lg:w-3/5 p-8 lg:p-12 relative z-10 flex flex-col">
                <div className="mb-6">
                    {/* Category Name */}
                    <div className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-800 text-xs font-bold uppercase tracking-widest mb-4">
                        {product.category}
                    </div>
                    {/* Product Title */}
                    <h3 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4 tracking-tight">
                        {product.title}
                    </h3>
                    {/* Product Description */}
                    <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                        {product.description}
                    </p>
                </div>

                {/* Interactive Tabs - Meeken thamai click karala tab dekata maru karanne */}
                <div className="flex-grow w-full max-w-full overflow-hidden">
                    <div className="flex bg-gray-100/50 p-1 rounded-2xl w-full lg:w-fit mb-8 border border-gray-200/50 overflow-x-auto no-scrollbar touch-pan-x">
                        {/* Benefits Button */}
                        <button
                            onClick={() => setActiveTab('benefits')}
                            className={`flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl font-bold text-xs lg:text-sm transition-all duration-300 flex-shrink-0 ${
                                activeTab === 'benefits' 
                                ? 'bg-white text-green-900 shadow-md ring-1 ring-black/5' 
                                : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            <Sparkles className={`w-3.5 h-3.5 lg:w-4 h-4 ${activeTab === 'benefits' ? 'text-emerald-500' : 'text-gray-400'}`} />
                            Featured Benefits
                        </button>
                        {/* Best For Whom Button */}
                        <button
                            onClick={() => setActiveTab('forWhom')}
                            className={`flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl font-bold text-xs lg:text-sm transition-all duration-300 flex-shrink-0 ${
                                activeTab === 'forWhom' 
                                ? 'bg-white text-green-900 shadow-md ring-1 ring-black/5' 
                                : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            <Target className={`w-3.5 h-3.5 lg:w-4 h-4 ${activeTab === 'forWhom' ? 'text-green-600' : 'text-gray-400'}`} />
                            Best For Whom?
                        </button>
                        {/* Why Choose Us Button */}
                        <button
                            onClick={() => setActiveTab('whyChooseUs')}
                            className={`flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl font-bold text-xs lg:text-sm transition-all duration-300 flex-shrink-0 ${
                                activeTab === 'whyChooseUs' 
                                ? 'bg-white text-green-900 shadow-md ring-1 ring-black/5' 
                                : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            <CheckCircle className={`w-3.5 h-3.5 lg:w-4 h-4 ${activeTab === 'whyChooseUs' ? 'text-blue-600' : 'text-gray-400'}`} />
                            Why Choose Us?
                        </button>
                    </div>

                    {/* Tab wala content eka display karana area eka (Smooth sliding animation ekka) */}
                    <div className="min-h-[220px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'benefits' ? (
                                // Benefits list eka pennana animation eka
                                <motion.div
                                    key="benefits"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="bg-gradient-to-r from-green-800 to-green-600 text-white px-5 lg:px-6 py-3 rounded-2xl font-black text-sm lg:text-lg mb-6 shadow-lg tracking-tight">
                                        What are the special benefits?
                                    </div>
                                    <div className="p-0 lg:p-2">
                                        {renderModernList(product.benefits, 'emerald')}
                                    </div>
                                </motion.div>
                            ) : activeTab === 'forWhom' ? (
                                // For Whom list eka pennana animation eka
                                <motion.div
                                    key="forWhom"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="bg-gradient-to-r from-green-800 to-green-600 text-white px-5 lg:px-6 py-3 rounded-2xl font-black text-sm lg:text-lg mb-6 shadow-lg tracking-tight">
                                        For Whom?
                                    </div>
                                    <div className="p-0 lg:p-2">
                                        {renderModernList(product.forWhom, 'green')}
                                    </div>
                                </motion.div>
                            ) : (
                                // Why Choose Us list eka meke thiyenne
                                <motion.div
                                    key="whyChooseUs"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="bg-gradient-to-r from-green-800 to-green-600 text-white px-5 lg:px-6 py-3 rounded-2xl font-black text-sm lg:text-lg mb-6 shadow-lg tracking-tight">
                                        Why you should hunt for Dearo Agro Substrates?
                                    </div>
                                    <div className="p-0 lg:p-2">
                                        {renderModernList(product.whyChooseUs, 'emerald')}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>


                </div>
            </div>
        </motion.div>
    );
};

function Products() {
    // Group products by category
    const groupedProducts = (productsData as Product[]).reduce((acc, product) => {
        if (!acc[product.category]) {
            acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
    }, {} as Record<string, Product[]>);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            {/* Header Section */}
            <section className="mt-15 w-full flex justify-center py-10 overflow-hidden">
                <motion.img
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    src="/products/product-cover.webp"
                    alt="Product Cover"
                    className="w-full max-h-[300px] sm:max-h-[400px] object-cover shadow-2xl"
                />
            </section>

            {/* Title Section */}
            <section className="w-full py-6 text-center relative">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center"
                >
                    <h1 className="font-extrabold text-green-950 text-3xl lg:text-5xl mb-5">
                        Our Products
                    </h1>
                    {/* Gradient Line */}
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: 128 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        viewport={{ once: true }}
                        className="h-1 bg-gradient-to-r from-green-800 to-emerald-800 rounded-full mb-10"
                    ></motion.div>
                </motion.div>
            </section>

            {/* Products Content Area */}
            <section className="px-6 md:px-16 lg:px-24 py-10 relative">
                {/* Ambient Background Glows */}
                <div className="absolute top-0 left-10 w-40 h-40 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl z-0"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl z-0"></div>

                <div className="relative max-w-6xl mx-auto z-10">
                    {Object.entries(groupedProducts).map(([category, products]) => (
                        <div key={category} className="mb-16">
                            {/* Category Heading - Product Group */}
                            <div className="flex items-center gap-4 mb-10 group">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-500">
                                    <Leaf className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl lg:text-4xl font-black bg-gradient-to-r from-green-900 to-emerald-700 bg-clip-text text-transparent uppercase tracking-tight">
                                    {category}
                                </h2>
                                <div className="flex-grow h-[2px] bg-gradient-to-r from-green-200 to-transparent ml-4"></div>
                            </div>

                            {/* Product List */}
                            <div className="space-y-12">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Products;
