
import { Link, useLocation } from "react-router-dom";
import { Book, Image, Users, MessageSquare, Plane, Activity, Gift, Menu, X, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const navItems = [
  { path: "/rsvp", label: "RSVP", icon: Mail },
  { path: "/our-story", label: "Our Story", icon: Book },
  { path: "/photos", label: "Photos", icon: Image },
  { path: "/wedding-party", label: "Wedding Party", icon: Users },
  { path: "/q-and-a", label: "Q&A", icon: MessageSquare },
  { path: "/travel", label: "Travel", icon: Plane },
  { path: "/things-to-do", label: "Things to Do", icon: Activity },
  { path: "/registry", label: "Registry", icon: Gift },
];

export const Navigation = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-sm z-50 shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-serif text-xl">
            Dearborne & Akin
          </Link>
          
          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-accent transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="active"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-600 hover:text-accent transition-colors"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={{
            open: { opacity: 1, height: "auto" },
            closed: { opacity: 0, height: 0 }
          }}
          transition={{ duration: 0.2 }}
          className="md:hidden overflow-hidden bg-white"
        >
          <ul className="py-4 space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "text-accent bg-accent/10"
                      : "text-gray-600 hover:text-accent hover:bg-accent/5"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </nav>
  );
};
