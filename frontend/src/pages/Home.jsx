import React from 'react';
import Hero from '../components/Hero';
import AboutCard from '../components/AboutCard';
import ServiceCard from '../components/ServiceCard';
import Testimonials from '../components/Testimonials';

const Home = () => {
    return (
        <div className="font-primary flex flex-col gap-6 pb-12 pt-2 sm:pt-3">
            <Hero />
            <AboutCard />
            <ServiceCard />
            <Testimonials />
        </div>
    );
};

export default Home;