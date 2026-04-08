import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const ContactUs = () => (
  <>
    {/* Header Section with Image */}
    <section className="mt-15 w-full flex justify-center bg-white py-10">
      <img
        src="https://www.eecojiyo.com/wp-content/uploads/2024/07/contact122.jpg"
        alt="Contact Us Banner"
        className="w-full max-h-[300px] object-cover"
      />
    </section>

    {/* Contact Us Title */}
    <section className="w-full py-6 text-center">
      <div className="flex flex-col items-center">
        <h1 className="font-extrabold text-green-950 text-3xl lg:text-5xl mb-5">
          Contact Us
        </h1>
        {/* line */}
        <div className="w-32 h-1 bg-gradient-to-r from-green-800 to-emerald-800 rounded-full mb-10"></div>
      </div>
    </section>

    {/* Contact Form & Office Info Section */}
    <section className="w-full max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 px-6 py-10">
      {/* Contact Form */}
      <Card className="border border-gray-300 shadow-md rounded-lg">
        <CardContent className="p-6 space-y-5">
          <p className="text-gray-700 text-sm">
            If you have any questions or feedback, please send us a message.
          </p>
          <Input
            type="text"
            placeholder="Name"
            className="bg-gray-100 text-sm"
          />
          <Input
            type="email"
            placeholder="Email"
            className="bg-gray-100 text-sm"
          />
          <label className="text-sm font-semibold">Type Your Message:</label>
          <Textarea
            placeholder="Type your message here..."
            className="bg-gray-100 text-sm"
          />
          <Button className="w-full bg-green-950 hover:bg-green-700 text-white">
            Send
          </Button>
        </CardContent>
      </Card>

      {/* Office Information & Map */}
      <div className="border border-gray-300 shadow-md rounded-lg p-6">
        <h1 className="text-green-950 font-semibold text-2xl sm:text-3xl">
          Dearo Investment Limited
        </h1>
        <h3 className="font-bold text-lg mt-2">Head Office</h3>
        <p className="text-gray-700 text-sm mt-2">
          8th floor,
          <br /> Ceylinco House,
          <br /> No 69,Janadhipathi Mawatha,
          <br /> Colombo 01
        </p>
        <p className="text-gray-700 text-sm mt-2">
          <strong>Tel:</strong>
          <a href="tel:+94112370990" className="text-green-600 hover:underline">
            {" "}
            (+94) 11 2 370 990
          </a>
          ,
          <a href="tel:+94114393100" className="text-green-600 hover:underline">
            {" "}
            (+94) 11 4 393 100
          </a>
        </p>
        <p className="text-gray-700 text-sm mt-2">
          <strong>Email:</strong>
          <a
            href="mailto:info@dearoagricapitalventure.com"
            className="text-green-600 hover:underline"
          >
           info@dearoinvestment.com
          </a>
        </p>
        <p className="text-gray-700 text-sm mt-2">
          <strong>Facebook:</strong>
          <a
            href="https://www.facebook.com/dbfinvestmentlimited/"
            className="text-green-600 hover:underline"
          >
            Dearo Investment Limited
          </a>
        </p>

        {/* Google Map Embed */}
        <div className="mt-12">
          <iframe
            className="w-full h-48 rounded-lg"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.6428920916587!2d79.84088202504388!3d6.933215393066692!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25925ba9b387b%3A0xf42c2dc8f66529bb!2zQ2V5bGluY28gSG91c2UgKOC3g-C3meC2veC3kuC2seC3iuC2muC3nSDgtrjgtrHgt4rgtq_gt5Lgtrvgtrop!5e0!3m2!1sen!2slk!4v1751364556345!5m2!1sen!2slk"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  </>
);

export default ContactUs;
