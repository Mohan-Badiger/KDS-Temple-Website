import React, { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import { TempleContext } from '../context/TempleContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Contact = () => {

    const { token, backendUrl } = useContext(TempleContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [mapLoading, setMapLoading] = useState(true);
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (token === localStorage.getItem('token')) {
                const response = await axios.post(backendUrl + '/api/contact', { name, email, message });
                if (response.data.success) {
                    toast.success("Email sent successfully");
                    setName('');
                    setEmail('');
                    setMessage('');
                } else {
                    toast.error(response.data.message);
                }
            } else {
                toast.error("Please Login to Contact Us");
                setName('');
                setEmail('');
                setMessage('');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='font-primary'>
            <section className="text-gray-600 body-font relative">
                <div className="container px-1 mx-auto flex sm:flex-nowrap flex-wrap">
                    {/*----------------------- Left Side Google Map--------------------- */}
                    <div className="lg:w-3/5 md:w-2/3 w-full h-120 mt-15 bg-neutral-400 relative overflow-hidden sm:mr-10 sm:flex-col p-10 flex items-end justify-start">
                        {mapLoading && (
                            <div className="absolute inset-0 z-10 bg-white bg-opacity-80 flex items-center justify-center">
                                <p className="text-gray-700 text-lg font-medium">Getting Temple Location......</p>
                            </div>
                        )}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.925928835828!2d75.12446747473987!3d16.47928788426119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc730c899a0dffb%3A0x61e2a5390925d9f!2sKadasiddheshwar%20Temple%20Banahatti!5e0!3m2!1sen!2sin!4v1740727319556!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            className="absolute inset-0"
                            style={{ border: "0" }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            onLoad={() => setMapLoading(false)} // This is key!
                        ></iframe>
                    </div>

                    {/* ------------------------Right side Info-------------------------- */}
                    <div className="lg:w-1/3 md:w-1/2 flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-3">
                        <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Contact us</h2>
                        <p className="leading-relaxed mb-5 text-gray-600">We are happy to serve you, Please use the form below for enquiries</p>
                        <form onSubmit={onSubmitHandler}>
                            <div className="relative mb-2">
                                <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full bg-auto border border-gray-300 focus:border-black text-base outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                />
                            </div>
                            <div className="relative mb-2">
                                <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-auto border border-gray-300 focus:border-black text-base outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                />
                            </div>
                            <div className="relative mb-4">
                                <label htmlFor="message" className="leading-7 text-sm text-gray-600">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    className="w-full bg-auto border border-gray-300 focus:border-black h-32 text-base outline-none text-gray-700 py-2 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className={`text-white w-full border-0 py-2 px-6 focus:outline-none text-lg transition-all duration-200 ${loading
                                    ? 'bg-orange-300'
                                    : 'bg-primary hover:bg-orange-400'
                                    }`}
                                disabled={loading}
                            >
                                {loading ? 'Sending mail...' : 'Submit'}
                            </button>

                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
