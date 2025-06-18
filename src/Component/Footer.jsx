import React from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800 py-12">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[300px] h-[300px] bg-blue-400 opacity-20 blur-[100px] animate-pulse rounded-full top-[-100px] left-[-50px]"></div>
        <div className="absolute w-[400px] h-[400px] bg-purple-400 opacity-30 blur-[100px] animate-pulse rounded-full bottom-[-150px] right-[-100px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold text-blue-700 mb-4">QuickVote</h3>
            <p className="text-gray-600 mb-4">
              Empowering democracy through secure digital voting.
            </p>
            <div className="flex space-x-4">
              {[{Icon:FaFacebookF,url:"#"}, {Icon:FaTwitter,url:"#"}, {Icon:FaLinkedinIn,url:"https://www.linkedin.com/in/jalpan-patel-172980252/"}, {Icon:FaInstagram,url:"#"}].map((obj, index) => (
                <a
                  key={index}
                  href={obj.url}
                  target="_blank"  
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-500 transition-transform transform hover:scale-110"
                >
                  <obj.Icon className="text-2xl" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-blue-700 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Features', 'About', 'How It Works'].map((link, index) => (
                <li key={index}>
                  <a
                    href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-gray-600 hover:text-blue-500 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xl font-semibold text-blue-700 mb-4">Support</h3>
            <ul className="space-y-2">
              {['Help Center', 'FAQs', 'Contact Us', 'Privacy Policy'].map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-500 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold text-blue-700 mb-4">Contact</h3>
            <ul className="space-y-2">
              {[
                { icon: FaEnvelope, text: 'quickvote.support@gmail.com' },
                { icon: FaPhone, text: '+91 9925542689' },
                { icon: FaMapMarkerAlt, text: 'College Road, Nadiad' },
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <item.icon className="text-blue-500" />
                  <span className="text-gray-600">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center text-gray-500 text-sm border-t border-gray-200 pt-6">
        &copy; {new Date().getFullYear()} QuickVote. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
