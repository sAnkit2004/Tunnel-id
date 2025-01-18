import React from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, Key, Wallet } from 'lucide-react';

const TimelineItem = ({ year, title, description, icon }) => (
  <motion.div 
    className="flex mb-12"
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white mr-6">
      {icon}
    </div>
    <div>
      <h3 className="text-2xl font-bold text-blue-600">{year}</h3>
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  </motion.div>
);

const AboutPage = () => {
  return (
    <div className="container mx-auto py-24 px-4">
      <h1 className="text-5xl font-bold mb-16 text-center text-blue-600">About Tunnel ID</h1>
      <div className="max-w-3xl mx-auto">
        <TimelineItem 
          year="2021"
          title="Inception"
          description="Tunnel ID was conceived as a solution to centralized identity management issues."
          icon={<Fingerprint size={32} />}
        />
        <TimelineItem 
          year="2022"
          title="Development"
          description="Our team developed the core technology for biometric-based private key generation."
          icon={<Key size={32} />}
        />
        <TimelineItem 
          year="2023"
          title="Integration"
          description="Successfully integrated with MetaMask wallet and launched beta version."
          icon={<Wallet size={32} />}
        />
      </div>
      <motion.div 
        className="mt-16 bg-gray-100 p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-blue-600">Our Vision</h2>
        <p className="text-lg text-gray-700">
          At Tunnel ID, we envision a world where individuals have full control over their digital identities. 
          By leveraging blockchain technology and biometrics, we're creating a secure, decentralized identity 
          management system that puts privacy and security first.
        </p>
      </motion.div>
    </div>
  );
};

export default AboutPage;

