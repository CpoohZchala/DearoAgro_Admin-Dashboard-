import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import profile from "../data/profilesD.json";
import profileManager from "@/data/profileM.json";
import TeamPopup from "../components/dialog/TeamPopup";

const Team = () => {
    const [selectedProfile, setSelectedProfile] = useState(null);

    return (
        <>
            {/* <section className="w-full flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 py-10">
               
                <div className="w-full flex flex-col items-center bg-gradient-to-r from-white to-white py-10">
                    <h1 className="mt-16 font-extrabold text-blue-950 text-4xl sm:text-4xl lg:text-5xl text-center mb-8">
                        DBF Corporate Management Team
                    </h1>
                    <h2 className="font-bold mt-4 text-black text-2xl sm:text-2xl lg:text-3xl border-b-2 border-gray-600">
                        Board Of Directors
                    </h2>
                </div>

                
                <div className="mt-15 w-full max-w-5xl px-4">
                    <Swiper
                        modules={[EffectCoverflow, Pagination]}
                        effect="coverflow"
                        centeredSlides={true}
                        loop={true}
                        grabCursor={true}
                        breakpoints={{
                            320: { slidesPerView: 1, spaceBetween: 10 },
                            640: { slidesPerView: 3, spaceBetween: 15 },
                            1024: { slidesPerView: 3, spaceBetween: 20 },
                            1280: { slidesPerView: 3, spaceBetween: 30 },
                        }}
                        coverflowEffect={{
                            rotate: 20,
                            stretch: -50,
                            depth: 120,
                            modifier: 1,
                            slideShadows: false,
                        }}
                        pagination={{ clickable: true }}
                        className="w-full mx-auto"
                    >
                        {profile.map((profile, index) => (
                            <SwiperSlide key={index} className="flex justify-center">
                                <Card className="relative bg-white border border-blue-950 rounded-lg shadow-lg ">
                                    <img
                                        src={profile.image}
                                        alt={profile.name}
                                        className="w-full h-auto object-cover"
                                    />
                                    <CardContent className="p-3 text-center">
                                        <h3 className="text-base font-semibold text-black">{profile.name}</h3>
                                        <h3 className="text-xs font-normal text-gray-600">{profile.possition}</h3>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button
                                                    className="mt-8 text-blue-600 hover:underline"
                                                    onClick={() => setSelectedProfile(profile)}
                                                >
                                                    Read More
                                                </button>
                                            </DialogTrigger>
                                            <TeamPopup profile={selectedProfile} />
                                        </Dialog>
                                    </CardContent>
                                </Card>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section> */}

            <section className="w-full flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 py-10">
                {/* Operation Management Team Section */}
                <div className="w-full flex flex-col items-center justify-center bg-gradient-to-r from-white to-white py-10">
                    <h1 className="mt-10 font-extrabold text-blue-950 text-4xl sm:text-3xl lg:text-5xl text-center mb-8">
                        DBF Operation Management Team
                    </h1>
                </div>

                {/* Operation Management Team Grid Layout */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
                    {profileManager.map((profile, index) => (
                        <Card key={index} className="relative bg-white rounded-lg shadow-md w-60 h-auto overflow-hidden ">
                            <img
                                src={profile.image}
                                alt={profile.name}
                                className="w-full h-60 object-cover"
                            />
                            <CardContent className="p-3 text-center">
                                <h3 className="text-base font-semibold text-black">{profile.name}</h3>
                                <h3 className="text-xs font-normal text-gray-700">{profile.possition}</h3>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                
            </section>
        </>
    );
};

export default Team;
