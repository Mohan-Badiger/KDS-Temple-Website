import React from 'react'
import Hero from '../components/Hero'
import AboutCard from '../components/AboutCard'
import ServiceCard from '../components/ServiceCard'

const Home = () => {
  return (
    <div className='font-primary'>
     <Hero/>
     <AboutCard/>
     <ServiceCard/>
    </div>
  )
}

export default Home