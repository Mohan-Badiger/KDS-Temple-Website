// import React, { useState } from 'react'
// import Hero_img from '../assets/Hero_img.jpg'
// import Language from '/language.svg'

// const About = () => {

//   const [language, setLanguage] = useState('english');

//   return (
//     <>
//       {/* ---------------Banner Section--------------------- */}
//       <div className="relative bg-cover bg-center bg-no-repeat rounded-sm" style={{ backgroundImage: `url(${Hero_img})` }}>
//         <div
//           className="absolute inset-0 bg-gray-900/75 sm:bg-transparent sm:from-gray-900/95 sm:to-gray-900/25 ltr:sm:bg-gradient-to-r rtl:sm:bg-gradient-to-l rounded-sm">
//         </div>

//         <div className="relative max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto border rounded-sm font-primary">
//           <blockquote className="text-center lg:mx-auto lg:w-3/5 py-10 pb-19">
//             <div className="mt-6 lg:mt-10">
//               <p className="relative text-xl sm:text-2xl md:text-3xl md:leading-normal font-medium text-gray-800">
//                 <svg className="absolute top-0 start-0 transform -translate-x-0 -translate-y-12 size-10 text-gray-600 sm:h-24 sm:w-24" width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
//                   <path d="M7.18079 9.25611C7.18079 10.0101 6.93759 10.6211 6.45119 11.0891C5.96479 11.5311 5.35039 11.7521 4.60799 11.7521C3.71199 11.7521 2.96958 11.4531 2.38078 10.8551C1.81758 10.2571 1.53598 9.39911 1.53598 8.28111C1.53598 7.08511 1.86878 5.91511 2.53438 4.77111C3.22559 3.60111 4.18559 2.67811 5.41439 2.00211L6.29759 3.36711C5.63199 3.83511 5.09439 4.35511 4.68479 4.92711C4.30079 5.49911 4.04479 6.16211 3.91679 6.91611C4.14719 6.81211 4.41599 6.76011 4.72319 6.76011C5.43999 6.76011 6.02879 6.99411 6.48959 7.46211C6.95039 7.93011 7.18079 8.52811 7.18079 9.25611ZM14.2464 9.25611C14.2464 10.0101 14.0032 10.6211 13.5168 11.0891C13.0304 11.5311 12.416 11.7521 11.6736 11.7521C10.7776 11.7521 10.0352 11.4531 9.44639 10.8551C8.88319 10.2571 8.60159 9.39911 8.60159 8.28111C8.60159 7.08511 8.93439 5.91511 9.59999 4.77111C10.2912 3.60111 11.2512 2.67811 12.48 2.00211L13.3632 3.36711C12.6976 3.83511 12.16 4.35511 11.7504 4.92711C11.3664 5.49911 11.1104 6.16211 10.9824 6.91611C11.2128 6.81211 11.4816 6.76011 11.7888 6.76011C12.5056 6.76011 13.0944 6.99411 13.5552 7.46211C14.016 7.93011 14.2464 8.52811 14.2464 9.25611Z" fill="currentColor" />
//                 </svg>
//                 <span className="relative z-10 text-white ">"Experience the Divine Legacy of Shri Kadasiddeshwar Temple – A Sacred Haven of Faith and Tradition"</span>
//               </p>
//             </div>
//           </blockquote>
//         </div>
//       </div>

//       {/* ------------------About Section--------------------- */}

//       {/* -------------English------------------------------ */}
//       <div className={`w-full flex justify-center bg-gray-100 px-4 py-6 mt-5 rounded font-primary ${language === 'kannada' ? 'hidden' : ''}`}>
//         <div className='w-[95%]'>
//           <div>
//             <div className='flex justify-between sm:flex-row flex-col-reverse'>
//               <div className='flex align-middle gap-3'>
//                 <h2 className='sm:text-3xl text-2xl font-medium text-gray-700 sm:text-center mt-6'>Historical and Architectural Significance</h2>
//                 <p className='w-8 md:w-17 h-[3px] bg-[#414141] mt-11 hidden md:block'></p>
//               </div>
//               <button onClick={() => setLanguage(language === 'english' ? 'kannada' : 'english')} className='px-4 h-11 w-24 text-white bg-primary font-kan'>ಕನ್ನಡ</button>
//             </div>

//             <p className='mt-3 leading-7 sm:text-lg font-light text-sm text-gray-500'>Shri Kadasiddeshwar Temple in Banahatti is an ancient and revered Shiva temple with deep roots in the Shaiva tradition. The temple is believed to have been established centuries ago, with legends suggesting that Kadasiddeshwar Swamy performed penance here, blessing devotees with divine protection. The architecture reflects the traditional North Karnataka style, featuring a sanctum sanctorum (Garbhagriha), Nandi Mantapa, and Sabha Mantapa, with intricate carvings that showcase Dravidian influences. Various dynasties, including the Chalukyas, Vijayanagara rulers, and the Patwardhan family of Jamkhandi,
//               played a crucial role in its preservation and development over time.</p>
//           </div>

//           <div className='mt-3'>
//             <div className='flex align-middle gap-3'>
//               <h2 className='sm:text-3xl text-2xl font-medium text-gray-700 sm:text-center mt-6'>Religious Significance and Grand Rathotsava</h2>
//               <p className='w-8 md:w-17 h-[3px] bg-[#414141] mt-11 hidden md:block'></p>
//             </div>

//             <p className='mt-3 leading-7 sm:text-lg font-light text-sm text-gray-500'>The temple is a hub for religious activities, with daily worship rituals such as Abhishekam, Aarti, and Bhajans. Devotees from across Karnataka and Maharashtra visit for blessings, especially on Mondays, Maha Shivaratri, and Kartik Purnima, which are considered auspicious for Lord Shiva. The temple’s Rathotsava (chariot festival), held annually in September, is its most significant event. The 153-year-old chariot,
//               donated by Maharaja Parashuram Bhau Shankar Rao Patwardhan, is pulled through the streets in a grand procession, decorated with flowers, lights, and vibrant colors, drawing thousands of devotees in celebration.</p>
//           </div>

//           <div className='mt-3 pb-6'>
//             <div className='flex align-middle gap-3'>
//               <h2 className='sm:text-3xl text-2xl font-medium text-gray-700 sm:text-center mt-6'>Preservation, Beliefs, and Tourism</h2>
//               <p className='w-8 md:w-17 h-[3px] bg-[#414141] mt-11 hidden md:block'></p>
//             </div>

//             <p className='mt-3 leading-7 sm:text-lg font-light text-sm text-gray-500'>The temple is not just a place of worship but also a spiritual and cultural landmark, contributing to the local community’s social and religious activities. Devotees believe that prayers at the temple bring prosperity, peace, and good health, with many claiming their wishes have been fulfilled. Due to its historical importance, ongoing renovation and preservation efforts by the government and temple authorities ensure that its sanctity is maintained while providing modern facilities for visitors. As a significant pilgrimage and tourist attraction,
//               the temple continues to stand as a symbol of faith, devotion, and heritage, drawing thousands of visitors every year.</p>
//           </div>
//         </div>
//       </div>

//       {/* -------------------------------Kannada------------------------------- */}
//       <div className={`w-full flex justify-center bg-gray-100 px-4 py-6 mt-5 rounded ${language === 'english' ? 'hidden' : ''}`}>
//         <div className='w-[95%]'>
//           <div>
//             <div className='flex justify-between sm:flex-row flex-col-reverse'>
//               <div className='flex align-middle gap-3'>
//                 <h2 className='sm:text-3xl text-xl font-medium text-gray-700 sm:text-center mt-6 font-kan'>ಐತಿಹಾಸಿಕ ಮತ್ತು ವಾಸ್ತುಶಿಲ್ಪ ಮಹತ್ವ</h2>
//                 <p className='w-8 md:w-17 h-[3px] bg-[#414141] mt-9 hidden md:block'></p>
//               </div>
//               <button onClick={() => setLanguage(language === 'english' ? 'kannada' : 'english')} className='px-4 w-24 h-11 text-white bg-primary'>English</button>
//             </div>

//             <p className='mt-3 leading-7 sm:text-lg text-sm text-gray-500 font-kan'>ಬನಹಟ್ಟಿಯ ಶ್ರೀ ಕಾಡಸಿದ್ಧೇಶ್ವರ ದೇವಸ್ಥಾನ ಪ್ರಾಚೀನ ಮತ್ತು ಪವಿತ್ರ ಶಿವ ದೇವಸ್ಥಾನವಾಗಿದ್ದು, ಇದಕ್ಕೆ ಶೈವ ಪರಂಪರೆಯ ಆಳವಾದ ನೆಲೆಯಲ್ಲಿ ಅಸ್ತಿತ್ವವಿದೆ. ಶತಮಾನಗಳ ಹಿಂದೆ ನಿರ್ಮಿತವಾದ ಈ ದೇವಾಲಯದ ಕುರಿತು ಹಲವು ಜಾನಪದ ಕಥೆಗಳು ಇದ್ದು, ಕಾಡಸಿದ್ಧೇಶ್ವರ ಸ್ವಾಮಿ ಇಲ್ಲಿ ತಪಸ್ಸು ನಡೆಸಿದ್ದು ಹಾಗೂ ಭಕ್ತರಿಗೆ ದೈವೀ ಅನುಗ್ರಹ ನೀಡಿದರೆಂದು ನಂಬಲಾಗುತ್ತದೆ. ಈ ದೇವಾಲಯವು ಉತ್ತರ ಕರ್ನಾಟಕದ ಪ್ರಾಚೀನ ಶೈಲಿಯಲ್ಲಿದೆ, ಇದರಲ್ಲಿ ಗರ್ಭಗುಡಿ, ನಂದಿ ಮಂಟಪ ಮತ್ತು ಸಭಾ ಮಂಟಪ ಸೇರಿದಂತೆ ಹಲವು ಸುಂದರ ಶಿಲ್ಪಕಲೆಗಳನ್ನು ಒಳಗೊಂಡಿದೆ. ಈ ದೇವಾಲಯದ ವಿಜಯನಗರ ರಾಜವಂಶ,
//               ಚಾಲುಕ್ಯರು ಹಾಗೂ ಜಮಖಂಡಿಯ ಪಟವರ್ಧನ ಕುಟುಂಬದವರು ಇದರ ರಕ್ಷಣೆಗೆ ಹಾಗೂ ವೃದ್ಧಿಗೆ ಪ್ರಮುಖ ಪಾತ್ರವಹಿಸಿದ್ದಾರೆ.</p>
//           </div>

//           <div className='mt-3'>
//             <div className='flex align-middle gap-3'>
//               <h2 className='sm:text-3xl text-xl font-medium text-gray-700 sm:text-center mt-6 font-kan'>ಧಾರ್ಮಿಕ ಮಹತ್ವ ಮತ್ತು ಮಹೋತ್ಸವಾದ ರಥೋತ್ಸವ</h2>
//               <p className='w-8 md:w-17 h-[3px] bg-[#414141] mt-9 hidden md:block'></p>
//             </div>

//             <p className='mt-3 leading-7 sm:text-lg font-light text-sm text-gray-500 font-kan'>ಈ ದೇವಾಲಯವು ಧಾರ್ಮಿಕ ಚಟುವಟಿಕೆಗಳ ಕೇಂದ್ರವಾಗಿದ್ದು, ಇಲ್ಲಿ ನಿತ್ಯ ಪೂಜಾ ವಿಧಿಗಳು, ಅಂದರೆ ಅಭಿಷೇಕ, ಆರತಿ ಮತ್ತು ಭಜನೆಗಳು ನೆರವೇರಿಸಲಾಗುತ್ತವೆ. ಕರ್ನಾಟಕ ಮತ್ತು ಮಹಾರಾಷ್ಟ್ರದ ಹಲವಾರು ಭಕ್ತರು ದೇವರ ದರ್ಶನಕ್ಕಾಗಿ ಭೇಟಿ ನೀಡುತ್ತಾರೆ,
//               ವಿಶೇಷವಾಗಿ ಸೋಮವಾರ, ಮಹಾ ಶಿವರಾತ್ರಿ, ಮತ್ತು ಕಾರ್ತಿಕ ಪೂರ್ಣಿಮೆಯಂದು, ಯಾಕಂದರೆ ಈ ದಿನಗಳು ಶಿವನಿಗೆ ವಿಶೇಷ ದಿನಗಳಾಗಿವೆ. ಈ ದೇವಾಲಯದ ರಥೋತ್ಸವ (ತೆರ ಉತ್ಸವ) ವರ್ಷವಿಡೀ ನಡೆಯುವ ಪ್ರಮುಖ ಘಟನೆಗಳಲ್ಲೊಂದು. ೧೫೩ ವರ್ಷ ಹಳೆಯ ರಥ, ಮಹಾರಾಜ ಪರಶುರಾಮ ಭೌ ಶಂಕರ ರಾವ್ ಪಟವರ್ಧನ ಅವರಿಂದ ದಾನವಾಗಿ ನೀಡಲಾಯಿತು. ಪ್ರತಿವರ್ಷ ಸೆಪ್ಟೆಂಬರ್‌ನಲ್ಲಿ, ಈ ರಥವನ್ನು ಹೂಗಳು, ದೀಪಗಳು ಮತ್ತು ವಿವಿಧ ಬಣ್ಣಗಳಿಂದ ಅಲಂಕರಿಸಲಾಗುತ್ತದೆ, ಹಾಗೂ ಸಾವಿರಾರು ಭಕ್ತರು ಅದನ್ನು ಶ್ರದ್ಧಾಪೂರ್ವಕವಾಗಿ ಎಳೆಯುತ್ತಾರೆ.</p>
//           </div>

//           <div className='mt-3 pb-6'>
//             <div className='flex align-middle gap-3'>
//               <h2 className='sm:text-3xl text-xl font-medium text-gray-700 sm:text-center mt-6 font-kan'>ಸಂರಕ್ಷಣಾ ಕಾರ್ಯಗಳು, ಭಕ್ತಿ ನಂಬಿಕೆಗಳು ಮತ್ತು ಪ್ರವಾಸೋದ್ಯಮ</h2>
//               <p className='w-8 md:w-17 h-[3px] bg-[#414141] mt-9 hidden md:block'></p>
//             </div>

//             <p className='mt-3 leading-7 sm:text-lg font-light text-sm text-gray-500 font-kan'>ಈ ದೇವಾಲಯವು ಕೇವಲ ಭಜನಾ ಕೇಂದ್ರವಷ್ಟೇ ಅಲ್ಲ, ಇದು ಆಧ್ಯಾತ್ಮಿಕ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಕೇಂದ್ರವೂ ಆಗಿದೆ, ಇದು ಸ್ಥಳೀಯ ಸಮುದಾಯದ ಧಾರ್ಮಿಕ ಹಾಗೂ ಸಾಮಾಜಿಕ ಚಟುವಟಿಕೆಗಳಿಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ. ಭಕ್ತರು ಈ ದೇವಾಲಯದಲ್ಲಿ ಪ್ರಾರ್ಥನೆ ಮಾಡಿದರೆ, ಅವರಿಗೆ ಐಶ್ವರ್ಯ, ಶಾಂತಿ ಮತ್ತು ಆರೋಗ್ಯ ದೊರಕುತ್ತದೆ ಎಂದು ನಂಬುತ್ತಾರೆ. ಹಲವರು ತಮ್ಮ ಮನೋವರ್ತನೆಗಳ ಈಡೇರಿಕೆಯನ್ನು ಇಲ್ಲಿ ಅನುಭವಿಸಿದ್ದಾರೆ ಎಂದು ಹೇಳುತ್ತಾರೆ. ಇದರ ಐತಿಹಾಸಿಕ ಮಹತ್ವದ ಕಾರಣ ಸರ್ಕಾರ ಮತ್ತು ದೇವಸ್ಥಾನ ಆಡಳಿತ ಮಂಡಳಿ ಇದನ್ನು ಸಂರಕ್ಷಿಸಲು ಹಾಗೂ ಪುನರ್‌ನಿರ್ಮಿಸಲು ಹಲವಾರು ಪ್ರಯತ್ನಗಳನ್ನು ಮಾಡುತ್ತಿವೆ. ಆಧುನಿಕ ಸೌಲಭ್ಯಗಳ ಜೊತೆಗೆ ಇದರ ಪುರಾತನ ಪರಂಪರೆಯು ಹಾಗೆಯೇ ಉಳಿಯುವಂತೆ ನೋಡಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ.
//               ಪ್ರಮುಖ ಯಾತ್ರಾ ಸ್ಥಳ ಮತ್ತು ಪ್ರವಾಸೋದ್ಯಮ ಕೇಂದ್ರವಾಗಿ, ಈ ದೇವಾಲಯ ಭಕ್ತಿಯ, ಪರಂಪರೆಯ ಮತ್ತು ಸಂಸ್ಕೃತಿಯ ಸಂಕೇತವಾಗಿ ಸಾವಿರಾರು ಭಕ್ತರನ್ನು ಪ್ರತಿವರ್ಷ ಆಕರ್ಷಿಸುತ್ತಿದೆ.</p>
//           </div>
//         </div>
//       </div>


//     </>
//   )
// }

// export default About


import React, { useState } from 'react'
import Hero_img from '../assets/Hero_img.jpg'
import Language from '/language.svg'

const About = () => {
  const [language, setLanguage] = useState('english');
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <>
      {/* ---------------Banner Section--------------------- */}
      <div className="relative bg-cover bg-center bg-no-repeat rounded-sm" style={{ backgroundImage: `url(${Hero_img})` }}>
        <div
          className="absolute inset-0 bg-gray-900/75 sm:bg-transparent sm:from-gray-900/95 sm:to-gray-900/25 ltr:sm:bg-gradient-to-r rtl:sm:bg-gradient-to-l rounded-sm">
        </div>

        <div className="relative max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto border rounded-sm font-primary">
          <blockquote className="text-center lg:mx-auto lg:w-3/5 py-10 pb-19">
            <div className="mt-6 lg:mt-10">
              <p className="relative text-xl sm:text-2xl md:text-3xl md:leading-normal font-medium text-gray-800">
                <svg className="absolute top-0 start-0 transform -translate-x-0 -translate-y-12 size-10 text-gray-600 sm:h-24 sm:w-24" width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M7.18079 9.25611C7.18079 10.0101 6.93759 10.6211 6.45119 11.0891C5.96479 11.5311 5.35039 11.7521 4.60799 11.7521C3.71199 11.7521 2.96958 11.4531 2.38078 10.8551C1.81758 10.2571 1.53598 9.39911 1.53598 8.28111C1.53598 7.08511 1.86878 5.91511 2.53438 4.77111C3.22559 3.60111 4.18559 2.67811 5.41439 2.00211L6.29759 3.36711C5.63199 3.83511 5.09439 4.35511 4.68479 4.92711C4.30079 5.49911 4.04479 6.16211 3.91679 6.91611C4.14719 6.81211 4.41599 6.76011 4.72319 6.76011C5.43999 6.76011 6.02879 6.99411 6.48959 7.46211C6.95039 7.93011 7.18079 8.52811 7.18079 9.25611ZM14.2464 9.25611C14.2464 10.0101 14.0032 10.6211 13.5168 11.0891C13.0304 11.5311 12.416 11.7521 11.6736 11.7521C10.7776 11.7521 10.0352 11.4531 9.44639 10.8551C8.88319 10.2571 8.60159 9.39911 8.60159 8.28111C8.60159 7.08511 8.93439 5.91511 9.59999 4.77111C10.2912 3.60111 11.2512 2.67811 12.48 2.00211L13.3632 3.36711C12.6976 3.83511 12.16 4.35511 11.7504 4.92711C11.3664 5.49911 11.1104 6.16211 10.9824 6.91611C11.2128 6.81211 11.4816 6.76011 11.7888 6.76011C12.5056 6.76011 13.0944 6.99411 13.5552 7.46211C14.016 7.93011 14.2464 8.52811 14.2464 9.25611Z" fill="currentColor" />
                </svg>
                <span className="relative z-10 text-white ">"Experience the Divine Legacy of Shri Kadasiddeshwar Temple – A Sacred Haven of Faith and Tradition"</span>
              </p>
            </div>
          </blockquote>
        </div>
      </div>

      {/* ------------------About Section with Accordion--------------------- */}
      <div className="w-full flex justify-center bg-gray-100 mt-5 rounded font-primary">
        <div className='w-[95%]'>
          {/* Accordion header */}
          <div
            onClick={() => setIsAboutOpen(!isAboutOpen)}
            className='flex justify-between items-center py-7 cursor-pointer text-lg font-semibold text-gray-800'
          >
            <div className='flex items-center gap-3'>
              <h2 className='sm:text-3xl text-2xl font-medium text-gray-700 sm:text-center'>Kadasiddeshwar Temple</h2>
              <p className='w-8 md:w-17 h-[3px] bg-[#414141] mt-3 hidden md:block'></p>
            </div>
            {/* Arrow icon */}
            <svg
              className={`w-5 h-5 transform transition-transform duration-300 ${isAboutOpen ? 'rotate-180' : ''}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Accordion content with language button */}
          <div className={`${isAboutOpen ? 'block' : 'hidden'} transition-all duration-500`}>
            {/* Language toggle button */}
            <div className='flex justify-end pr-6'>
              <button onClick={() => setLanguage(language === 'english' ? 'kannada' : 'english')} className='px-4 h-11 w-24 text-white bg-primary font-kan'>
                {language === 'english' ? 'ಕನ್ನಡ' : 'English'}
              </button>
            </div>

            {/* English Content */}
            <div className={`mt-3 ${language === 'kannada' ? 'hidden' : ''}`}>
              <div>
                <div className='flex align-middle gap-3'>
                  <h2 className='sm:text-3xl text-2xl font-medium text-gray-700 sm:text-center mt-6'>Historical and Architectural Significance</h2>
                  <p className='w-8 md:w-17 h-[3px] bg-[#414141] mt-11 hidden md:block'></p>
                </div>
                <p className='mt-3 leading-7 sm:text-lg font-light text-sm text-gray-500'>
                  Shri Kadasiddeshwar Temple in Banahatti is an ancient and revered Shiva temple with deep roots in the Shaiva tradition. The temple is believed to have been established centuries ago, with legends suggesting that Kadasiddeshwar Swamy performed penance here, blessing devotees with divine protection. The architecture reflects the traditional North Karnataka style, featuring a sanctum sanctorum (Garbhagriha), Nandi Mantapa, and Sabha Mantapa, with intricate carvings that showcase Dravidian influences. Various dynasties, including the Chalukyas, Vijayanagara rulers, and the Patwardhan family of Jamkhandi, played a crucial role in its preservation and development over time.
                </p>
              </div>

              <div className='mt-3'>
                <div className='flex align-middle gap-3'>
                  <h2 className='sm:text-3xl text-2xl font-medium text-gray-700 sm:text-center mt-6'>Religious Significance and Grand Rathotsava</h2>
                  <p className='w-8 md:w-17 h-[3px] bg-[#414141] mt-11 hidden md:block'></p>
                </div>
                <p className='mt-3 leading-7 sm:text-lg font-light text-sm text-gray-500'>
                  The temple is a hub for religious activities, with daily worship rituals such as Abhishekam, Aarti, and Bhajans. Devotees from across Karnataka and Maharashtra visit for blessings, especially on Mondays, Maha Shivaratri, and Kartik Purnima, which are considered auspicious for Lord Shiva. The temple’s Rathotsava (chariot festival), held annually in September, is its most significant event. The 153-year-old chariot, donated by Maharaja Parashuram Bhau Shankar Rao Patwardhan, is pulled through the streets in a grand procession, decorated with flowers, lights, and vibrant colors, drawing thousands of devotees in celebration.
                </p>
              </div>

              <div className='mt-3 pb-6'>
                <div className='flex align-middle gap-3'>
                  <h2 className='sm:text-3xl text-2xl font-medium text-gray-700 sm:text-center mt-6'>Preservation, Beliefs, and Tourism</h2>
                  <p className='w-8 md:w-17 h-[3px] bg-[#414141] mt-11 hidden md:block'></p>
                </div>
                <p className='mt-3 leading-7 sm:text-lg font-light text-sm text-gray-500'>
                  The temple is not just a place of worship but also a spiritual and cultural landmark, contributing to the local community’s social and religious activities. Devotees believe that prayers at the temple bring prosperity, peace, and good health, with many claiming their wishes have been fulfilled. Due to its historical importance, ongoing renovation and preservation efforts by the government and temple authorities ensure that its sanctity is maintained while providing modern facilities for visitors. As a significant pilgrimage and tourist attraction, the temple continues to stand as a symbol of faith, devotion, and heritage, drawing thousands of visitors every year.
                </p>
              </div>
            </div>

            {/* Kannada Content */}
            <div className={`mt-3 ${language === 'english' ? 'hidden' : ''}`}>
              <div>
                <div className='flex align-middle gap-3'>
                  <h2 className='sm:text-3xl text-xl font-medium text-gray-700 sm:text-center mt-6 font-kan'>ಐತಿಹಾಸಿಕ ಮತ್ತು ವಾಸ್ತುಶಿಲ್ಪ ಮಹತ್ವ</h2>
                  <p className='w-8 md:w-17 h-[3px] bg-[#414141] mt-9 hidden md:block'></p>
                </div>
                <p className='mt-3 leading-7 sm:text-lg text-sm text-gray-500 font-kan'>
                  ಬನಹಟ್ಟಿಯ ಶ್ರೀ ಕಾಡಸಿದ್ಧೇಶ್ವರ ದೇವಸ್ಥಾನ ಪ್ರಾಚೀನ ಮತ್ತು ಪವಿತ್ರ ಶಿವ ದೇವಸ್ಥಾನವಾಗಿದ್ದು, ಇದಕ್ಕೆ ಶೈವ ಪರಂಪರೆಯ ಆಳವಾದ ನೆಲೆಯಲ್ಲಿ ಅಸ್ತಿತ್ವವಿದೆ. ಶತಮಾನಗಳ ಹಿಂದೆ ನಿರ್ಮಿತವಾದ ಈ ದೇವಾಲಯದ ಕುರಿತು ಹಲವು ಜಾನಪದ ಕಥೆಗಳು ಇದ್ದು, ಕಾಡಸಿದ್ಧೇಶ್ವರ ಸ್ವಾಮಿ ಇಲ್ಲಿ ತಪಸ್ಸು ನಡೆಸಿದ್ದು ಹಾಗೂ ಭಕ್ತರಿಗೆ ದೈವೀ ಅನುಗ್ರಹ ನೀಡಿದರೆಂದು ನಂಬಲಾಗುತ್ತದೆ. ಈ ದೇವಾಲಯವು ಉತ್ತರ ಕರ್ನಾಟಕದ ಪ್ರಾಚೀನ ಶೈಲಿಯಲ್ಲಿದೆ, ಇದರಲ್ಲಿ ಗರ್ಭಗುಡಿ, ನಂದಿ ಮಂಟಪ ಮತ್ತು ಸಭಾ ಮಂಟಪ ಸೇರಿದಂತೆ ಹಲವು ಸುಂದರ ಶಿಲ್ಪಕಲೆಗಳನ್ನು ಒಳಗೊಂಡಿದೆ. ಈ ದೇವಾಲಯದ ವಿಜಯನಗರ ರಾಜವಂಶ, ಚಾಲುಕ್ಯರು ಹಾಗೂ ಜಮಖಂಡಿಯ ಪಟವರ್ಧನ ಕುಟುಂಬದವರು ಇದರ ರಕ್ಷಣೆಗೆ ಹಾಗೂ ವೃದ್ಧಿಗೆ ಪ್ರಮುಖ ಪಾತ್ರವಹಿಸಿದ್ದಾರೆ.
                </p>
              </div>

              <div className='mt-3'>
                <div className='flex align-middle gap-3'>
                  <h2 className='sm:text-3xl text-xl font-medium text-gray-700 sm:text-center mt-6 font-kan'>ಧಾರ್ಮಿಕ ಮಹತ್ವ ಮತ್ತು ಮಹೋತ್ಸವಾದ ರಥೋತ್ಸವ</h2>
                  <p className='w-8 md:w-17 h-[3px] bg-[#414141] mt-9 hidden md:block'></p>
                </div>
                <p className='mt-3 leading-7 sm:text-lg font-light text-sm text-gray-500 font-kan'>
                  ಈ ದೇವಾಲಯವು ಧಾರ್ಮಿಕ ಚಟುವಟಿಕೆಗಳ ಕೇಂದ್ರವಾಗಿದ್ದು, ಇಲ್ಲಿ ನಿತ್ಯ ಪೂಜಾ ವಿಧಿಗಳು, ಅಂದರೆ ಅಭಿಷೇಕ, ಆರತಿ ಮತ್ತು ಭಜನೆಗಳು ನೆರವೇರಿಸಲಾಗುತ್ತವೆ. ಕರ್ನಾಟಕ ಮತ್ತು ಮಹಾರಾಷ್ಟ್ರದ ಹಲವಾರು ಭಕ್ತರು ದೇವರ ದರ್ಶನಕ್ಕಾಗಿ ಭೇಟಿ ನೀಡುತ್ತಾರೆ, ವಿಶೇಷವಾಗಿ ಸೋಮವಾರ, ಮಹಾ ಶಿವರಾತ್ರಿ, ಮತ್ತು ಕಾರ್ತಿಕ ಪೂರ್ಣಿಮೆಯಂದು, ಯಾಕಂದರೆ ಈ ದಿನಗಳು ಶಿವನಿಗೆ ವಿಶೇಷ ದಿನಗಳಾಗಿವೆ. ಈ ದೇವಾಲಯದ ರಥೋತ್ಸವ (ತೆರ ಉತ್ಸವ) ವರ್ಷವಿಡೀ ನಡೆಯುವ ಪ್ರಮುಖ ಘಟನೆಗಳಲ್ಲೊಂದು. ೧೫೩ ವರ್ಷ ಹಳೆಯ ರಥ, ಮಹಾರಾಜ ಪರಶುರಾಮ ಭೌ ಶಂಕರ ರಾವ್ ಪಟವರ್ಧನ ಅವರಿಂದ ದಾನವಾಗಿ ನೀಡಲಾಯಿತು. ಪ್ರತಿವರ್ಷ ಸೆಪ್ಟೆಂಬರ್‌ನಲ್ಲಿ, ಈ ರಥವನ್ನು ಹೂಗಳು, ದೀಪಗಳು ಮತ್ತು ವಿವಿಧ ಬಣ್ಣಗಳಿಂದ ಅಲಂಕರಿಸಲಾಗುತ್ತದೆ, ಹಾಗೂ ಸಾವಿರಾರು ಭಕ್ತರು ಅದನ್ನು ಶ್ರದ್ಧಾಪೂರ್ವಕವಾಗಿ ಎಳೆಯುತ್ತಾರೆ.
                </p>
              </div>

              <div className='mt-3 pb-6'>
                <div className='flex align-middle gap-3'>
                  <h2 className='sm:text-3xl text-xl font-medium text-gray-700 sm:text-center mt-6 font-kan'>ಸಂರಕ್ಷಣಾ ಕಾರ್ಯಗಳು, ಭಕ್ತಿ ನಂಬಿಕೆಗಳು ಮತ್ತು ಪ್ರವಾಸೋದ್ಯಮ</h2>
                  <p className='w-8 md:w-17 h-[3px] bg-[#414141] mt-9 hidden md:block'></p>
                </div>
                <p className='mt-3 leading-7 sm:text-lg font-light text-sm text-gray-500 font-kan'>
                  ಈ ದೇವಾಲಯವು ಕೇವಲ ಭಜನಾ ಕೇಂದ್ರವಷ್ಟೇ ಅಲ್ಲ, ಇದು ಆಧ್ಯಾತ್ಮಿಕ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಕೇಂದ್ರವೂ ಆಗಿದೆ, ಇದು ಸ್ಥಳೀಯ ಸಮುದಾಯದ ಧಾರ್ಮಿಕ ಹಾಗೂ ಸಾಮಾಜಿಕ ಚಟುವಟಿಕೆಗಳಿಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ. ಭಕ್ತರು ಈ ದೇವಾಲಯದಲ್ಲಿ ಪ್ರಾರ್ಥನೆ ಮಾಡಿದರೆ, ಅವರಿಗೆ ಐಶ್ವರ್ಯ, ಶಾಂತಿ ಮತ್ತು ಆರೋಗ್ಯ ದೊರಕುತ್ತದೆ ಎಂದು ನಂಬುತ್ತಾರೆ. ಹಲವರು ತಮ್ಮ ಮನೋವರ್ತನೆಗಳ ಈಡೇರಿಕೆಯನ್ನು ಇಲ್ಲಿ ಅನುಭವಿಸಿದ್ದಾರೆ ಎಂದು ಹೇಳುತ್ತಾರೆ. ಇದರ ಐತಿಹಾಸಿಕ ಮಹತ್ವದ ಕಾರಣ ಸರ್ಕಾರ ಮತ್ತು ದೇವಸ್ಥಾನ ಆಡಳಿತ ಮಂಡಳಿ ಇದನ್ನು ಸಂರಕ್ಷಿಸಲು ಹಾಗೂ ಪುನರ್‌ನಿರ್ಮಿಸಲು ಹಲವಾರು ಪ್ರಯತ್ನಗಳನ್ನು ಮಾಡುತ್ತಿವೆ. ಆಧುನಿಕ ಸೌಲಭ್ಯಗಳ ಜೊತೆಗೆ ಇದರ ಪುರಾತನ ಪರಂಪರೆಯು ಹಾಗೆಯೇ ಉಳಿಯುವಂತೆ ನೋಡಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ. ಪ್ರಮುಖ ಯಾತ್ರಾ ಸ್ಥಳ ಮತ್ತು ಪ್ರವಾಸೋದ್ಯಮ ಕೇಂದ್ರವಾಗಿ, ಈ ದೇವಾಲಯ ಭಕ್ತಿಯ, ಪರಂಪರೆಯ ಮತ್ತು ಸಂಸ್ಕೃತಿಯ ಸಂಕೇತವಾಗಿ ಸಾವಿರಾರು ಭಕ್ತರನ್ನು ಪ್ರತಿವರ್ಷ ಆಕರ್ಷಿಸುತ್ತಿದೆ.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
