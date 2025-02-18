
import { Link, useLocation } from "react-router-dom";
import { Book, Image, Users, MessageSquare, Plane, Activity, Gift } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
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

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-sm z-50 shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-serif text-xl">
            Dearborne & Akin
          </Link>
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
        </div>
      </div>
    </nav>
  );
};
