
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="py-8 text-center text-sm text-muted-foreground border-t">
      <div className="container">
        <p>© 2025 Dearborne & Akin Wedding</p>
        <Link 
          to="/admin" 
          className="mt-2 inline-block text-xs hover:underline"
        >
          Admin Access
        </Link>
      </div>
    </footer>
  );
};
