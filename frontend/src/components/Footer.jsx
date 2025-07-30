import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { TempleContext } from '../context/TempleContext'

const Footer = () => {

  const {navigate} = useContext(TempleContext);

  return (
    <>
      <div className="bg-gray-100 rounded-sm mt-5 font-primary">
        <div className="mx-auto max-w-screen-xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">

          <strong className="block text-xl font-bold text-gray-900 sm:text-3xl">
            Touch with Us!
          </strong>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-32">
            <div className="mx-auto max-w-sm lg:max-w-none">
              <p className="mt-4 text-center text-gray-500 lg:text-left lg:text-lg">
                {/* Kadasiddheshwar Temple Banahatti <br /> */}
                Banahatti Temples Management Trust Committee <br />
                SH 53, Rabkavi Banhatti - 587311, Bagalkot Karnataka India 
              </p>

            </div>

            <div className="grid grid-cols-1 gap-8 text-center lg:grid-cols-3 lg:text-left">
              <div>
                <strong className="font-medium text-gray-900"> Services </strong>

                <ul className="mt-6 space-y-1">
                  <li>
                    <p className="text-gray-700 transition hover:text-gray-700/75"> Pooja </p>
                  </li>

                  <li>
                    <p className="text-gray-700 transition hover:text-gray-700/75"> Annaprasada </p>
                  </li>

                  <li>
                    <p className="text-gray-700 transition hover:text-gray-700/75"> Donation </p>
                  </li>
                </ul>
              </div>

              <div>
                <strong className="font-medium text-gray-900"> About </strong>

                <ul className="mt-6 space-y-1">
                  <li>
                    <p className="text-gray-700 transition hover:text-gray-700/75"> About </p>
                  </li>
                </ul>
              </div>

              <div>
                <strong className="font-medium text-gray-900"> Support </strong>

                <ul className="mt-6 space-y-1">
                  <li>
                    <a className="text-gray-700 transition hover:text-gray-700/75"> Contact </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-16 border-t border-gray-100 pt-8">
            <p className="text-center text-xs/relaxed text-gray-500">©Company 2025. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  )
  }

export default Footer