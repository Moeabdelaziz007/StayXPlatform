import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="border-t border-[#2A2A2A] py-6 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-gray-medium text-sm">
            &copy; {new Date().getFullYear()} StayX - The Future of Fintech Social Connectivity
          </p>
        </div>
        
        <div className="flex space-x-4">
          <a href="#" className="text-gray-medium hover:text-neon-green transition-colors">
            <i className="ri-twitter-x-line"></i>
          </a>
          <a href="#" className="text-gray-medium hover:text-neon-green transition-colors">
            <i className="ri-github-fill"></i>
          </a>
          <a href="#" className="text-gray-medium hover:text-neon-green transition-colors">
            <i className="ri-discord-line"></i>
          </a>
          <a href="#" className="text-gray-medium hover:text-neon-green transition-colors">
            <i className="ri-telegram-line"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
