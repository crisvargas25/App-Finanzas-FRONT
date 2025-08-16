import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Tags, 
  Wallet, 
  ArrowUpDown, 
  Target, 
  User,
  LogOut,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, children, className }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg transition-smooth text-sm font-medium",
        isActive 
          ? "bg-primary text-primary-foreground shadow-md" 
          : "text-muted-foreground hover:text-foreground hover:bg-accent",
        className
      )}
    >
      {icon}
      {children}
    </Link>
  );
};

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="p-2 rounded-lg gradient-primary">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            CashCare
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" icon={<Home className="h-4 w-4" />}>
              Dashboard
            </NavLink>
            <NavLink to="/categories" icon={<Tags className="h-4 w-4" />}>
              Categories
            </NavLink>
            <NavLink to="/budgets" icon={<Wallet className="h-4 w-4" />}>
              Budgets
            </NavLink>
            <NavLink to="/transactions" icon={<ArrowUpDown className="h-4 w-4" />}>
              Transactions
            </NavLink>
            <NavLink to="/goals" icon={<Target className="h-4 w-4" />}>
              Goals
            </NavLink>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            <NavLink to="/profile" icon={<User className="h-4 w-4" />} className="hidden md:flex">
              Profile
            </NavLink>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex flex-wrap gap-2">
            <NavLink to="/" icon={<Home className="h-4 w-4" />}>
              Dashboard
            </NavLink>
            <NavLink to="/categories" icon={<Tags className="h-4 w-4" />}>
              Categories
            </NavLink>
            <NavLink to="/budgets" icon={<Wallet className="h-4 w-4" />}>
              Budgets
            </NavLink>
            <NavLink to="/transactions" icon={<ArrowUpDown className="h-4 w-4" />}>
              Transactions
            </NavLink>
            <NavLink to="/goals" icon={<Target className="h-4 w-4" />}>
              Goals
            </NavLink>
            <NavLink to="/profile" icon={<User className="h-4 w-4" />}>
              Profile
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;