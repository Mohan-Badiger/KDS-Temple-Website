import React from 'react';
import Hero from '../components/Hero';
import AboutCard from '../components/AboutCard';
import ServiceCard from '../components/ServiceCard';
import Testimonials from '../components/Testimonials';

const Home = () => {
    return (
        <div className="font-primary flex flex-col gap-0 pb-12 pt-6 sm:pt-8">
            <Hero />
            <AboutCard />
            <ServiceCard />
            <Testimonials />
        </div>
    );
};

export default Home;