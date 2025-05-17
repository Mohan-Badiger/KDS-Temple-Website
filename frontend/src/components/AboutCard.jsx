import React from 'react'
import { Link } from 'react-router-dom'

const AboutCard = () => {

  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className='w-full mb-10'>
      <div className='flex align-middle gap-3'>
        <h2 className='text-3xl font-medium text-gray-700 text-center mt-6'>About Temple</h2>
        <p className='w-8 md:w-17 h-[3px] bg-[#414141] mt-11'></p>
      </div>

      <p className='mt-5 leading-7 sm:text-lg font-light text-sm text-gray-500'>The Shri Kadasiddeshwar Temple in Banahatti is dedicated to Shri Kadasiddeshwar Swamy. Every year, a grand festival (Jatre) is held in September, with the Rathotsava (chariot festival) being the main attraction.</p>

      <p className='mt-4 sm:leading-7 sm:text-lg font-light text-sm text-gray-500'>The temple's chariot has a history of around 153 years and was donated by Parashuram Bhau Shankar Rao Patwardhan, the Maharaja of Jamkhandi, to the Mangalwar Peth Daiva Mandali of Banahatti. It is one of the oldest chariots in North Karnataka and is used only during the Rathotsava. The chariot's design reflects royal architecture, resembling the temple structure. Every year, during the festival, it is beautifully decorated with colors and lights, attracting thousands of devotees.</p>

      {/* <button className='h-10 px-7 mt-5 bg-primary text-white'><Link to='/about'>Know More </Link></button> */}

      {/* About us button */}
      <Link to='/about'
        className="group relative inline-flex items-center overflow-hidden rounded-sm bg-primary px-10 py-3 text-white focus:outline-hidden mt-5" href="#">
        <span className="absolute -end-full transition-all group-hover:end-4">
          <svg
            className="size-5 rtl:rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </span>
        <span className=" font-medium transition-all group-hover:me-4" onClick={handleClick}> Know More </span>
      </Link>

    </div>
  )
}

export default AboutCard