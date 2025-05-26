import React, { useContext } from 'react'
import seva from '/seva.svg'
import donate from '/donate.png'
import food from '/food.png'
import { Link } from 'react-router-dom'
import { TempleContext } from '../context/TempleContext'
import { toast } from 'react-toastify'

const ServiceCard = () => {

    const {token, navigate} = useContext(TempleContext);

    const poojaClickHandler = () => {
        if(token === localStorage.getItem('token')){
         navigate('/pooja');
        }else{
            toast.error("Please Login to Book Pooja");
        }
    }
    const donationClickHandler = () => {
        if(token === localStorage.getItem('token')){
         navigate('/donation');
        }else{
            toast.error("Please Login For Donation");
        }
    }

    const annaprasadClickHandler = () => {
        if(token === localStorage.getItem('token')){
         navigate('/annaprasad');
        }else{
            toast.error("Please Login For Contribution");
        }
    }

    return (
        <div>
            <div className="py-8">

                <h1 className="text-3xl font-medium text-gray-700 text-center mt-6">
                    E-Services
                </h1>
                <p className="text-center mt-4 text-lg font-light text-gray-500">
                    Divine E-Services – Connecting You to Spiritual Bliss with Ease!
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="px-3 py-8">
                    <div
                        className="bg-indigo-100 rounded-full w-16 h-16 flex justify-center items-center text-indigo-500 shadow-2xl"
                    >
                        <img src={seva} alt="" className='w-9' />
                    </div>
                    <h2 className="uppercase mt-6 font-medium mb-3">
                        Pooja's
                    </h2>
                    <p className="font-light text-sm text-gray-500 mb-3">
                        The Pooja Module enables devotees to seamlessly book poojas like Abhishek, Kumkum Pooja, Belli Pooja, and Butti Pooja online,
                        ensuring a hassle-free and spiritually fulfilling experience.
                    </p>
                    <button className="text-indigo-500 flex items-center hover:text-indigo-600 cursor-pointer" onClick={poojaClickHandler} >    
                        Book Pooja
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>

                <div className="px-3 py-8">
                    <div
                        className="bg-green-100 rounded-full w-16 h-16 flex justify-center items-center text-green-500 shadow-2xl"
                    >
                        <img src={food} alt="" className='w-10' />
                    </div>
                    <h2 className="uppercase mt-6 font-medium mb-3">
                        Annaprasad
                    </h2>
                    <p className="font-light text-sm text-gray-500 mb-3">
                        The Annaprasad Module allows devotees to contribute financially towards food distribution at the temple, ensuring that prasadam is provided to all worshippers, especially during festivals and special occasions.
                    </p>
                    <a className="text-indigo-500 flex items-center hover:text-indigo-600 cursor-pointer" onClick={annaprasadClickHandler}>
                        Contribute to Annaprasad
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </a>
                </div>
                <div className="px-3 py-8">
                    <div
                        className="bg-red-100 rounded-full w-16 h-16 flex justify-center items-center text-red-500 shadow-2xl"
                    >
                        <img src={donate} alt="" className='w-9' />
                    </div>
                    <h2 className="uppercase mt-6 font-medium mb-3">
                        Donations
                    </h2>
                    <p className="font-light text-sm text-gray-500 mb-3">
                        The Donation Module provides a secure and transparent platform for devotees to contribute towards temple development, renovations, and maintenance, ensuring the preservation of spiritual and cultural heritage.
                    </p>
                    <a className="text-indigo-500 flex items-center hover:text-indigo-600 cursor-pointer"  onClick={donationClickHandler}>
                        Donate Now
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default ServiceCard