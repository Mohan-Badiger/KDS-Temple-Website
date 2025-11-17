import React from 'react'
import { Link } from 'react-router-dom'

const AboutCard = () => {

  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className='w-full mb-10'>
      <div className='flex align-middle gap-3'>
        <h2 className='text-3xl font-medium text-gray-700 text-center mt-6'>About Committe</h2>
        <p className='w-8 md:w-17 h-[3px] bg-[#414141] mt-11'></p>
      </div>

      {/* <p className='mt-5 leading-7 sm:text-lg font-light text-sm text-gray-500'>The Shri Kadasiddeshwar Temple in Banahatti is dedicated to Shri Kadasiddeshwar Swamy. Every year, a grand festival (Jatre) is held in September, with the Rathotsava (chariot festival) being the main attraction.</p>

      <p className='mt-4 sm:leading-7 sm:text-lg font-light text-sm text-gray-500'>The temple's chariot has a history of around 153 years and was donated by Parashuram Bhau Shankar Rao Patwardhan, the Maharaja of Jamkhandi, to the Mangalwar Peth Daiva Mandali of Banahatti. It is one of the oldest chariots in North Karnataka and is used only during the Rathotsava. The chariot's design reflects royal architecture, resembling the temple structure. Every year, during the festival, it is beautifully decorated with colors and lights, attracting thousands of devotees.</p> */}

      <div className="w-full flex justify-center mt-3 rounded font-primary">
        <div className="w-full">
          <h2 className="sm:text-2xl text-2xl font-medium text-gray-700 py-6">
            Banahatti Temples Management Trust Committee
          </h2>

          <p className="mt-3 leading-7 sm:text-lg font-light text-sm text-gray-500">
            The <strong>Banahatti Temples Management Trust Committee</strong> is a dedicated body responsible for the administration, preservation, and development of the major temples in Banahatti, Karnataka. The committee plays a crucial role in maintaining the religious, cultural, and social heritage of the town.
          </p>

          <section className="mt-4">
            <h3 className="sm:text-2xl text-xl font-medium text-gray-700">
              Objectives and Responsibilities
            </h3>
            <ul className="mt-2 list-disc list-inside leading-7 sm:text-lg font-light text-sm text-gray-500">
              <li><strong>Temple Administration:</strong> Ensures smooth functioning of all temple activities, daily rituals, and worship services. Coordinates with priests and staff for proper conduct of pujas and Aartis.</li>
              <li><strong>Maintenance and Renovation:</strong> Oversees upkeep and restoration of temple structures, preserving historical architecture and managing funds for repair and beautification projects.</li>
              <li><strong>Festival Management:</strong> Organizes and supervises major festivals, fairs, and special events, handling logistics, decorations, and rituals during celebrations such as Rathotsava and Maha Shivaratri.</li>
              <li><strong>Cultural and Spiritual Promotion:</strong> Encourages local traditions, spiritual teachings, and cultural programs, acting as a custodian of Banahatti’s religious and cultural identity.</li>
              <li><strong>Community Engagement:</strong> Engages with devotees and the local community to gather support and contributions for temple development, facilitating charitable activities and social welfare initiatives.</li>
            </ul>
          </section>

          <section className="mt-4">
            <h3 className="sm:text-2xl text-xl font-medium text-gray-700">
              Temples Under the Committee
            </h3>
            <ul className="mt-2 list-disc list-inside leading-7 sm:text-lg font-light text-sm text-gray-500">
              <li><strong>Kadasiddeshwar Temple:</strong> Ancient Shiva temple with historical and architectural significance.</li>
              <li><strong>Veerabhadra Swamy Temple:</strong> Spiritual hub for Shaiva devotees.</li>
              <li><strong>Hanuman Temple:</strong> Center for devotion and strength.</li>
              <li><strong>Mallayya Temple:</strong> Important local temple for cultural and spiritual gatherings.</li>
            </ul>
          </section>

          <section className="mt-4 pb-6">
            <h3 className="sm:text-2xl text-xl font-medium text-gray-700">
              Vision
            </h3>
            <p className="mt-2 leading-7 sm:text-lg font-light text-sm text-gray-500">
              The committee aims to preserve Banahatti’s religious heritage while promoting devotion, community harmony, and cultural awareness. By maintaining all four temples, it ensures that both locals and visitors experience the spiritual and historical richness of the region.
            </p>
          </section>
        </div>
      </div>


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