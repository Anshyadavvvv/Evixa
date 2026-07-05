import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTicketAlt } from 'react-icons/fa';
import { AuthContext } from '../Context/AuthContextValue';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
    }

  return (
    
      <nav className="bg-[#12213B] text-[#FBF6EC] border-b-2 border-dashed border-[#F0A63A]/40 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
                    <Link to="/" className="font-display uppercase text-2xl tracking-tight flex items-center gap-2">
                        <span className="w-9 h-9 rounded-full bg-[#F0A63A] text-[#12213B] flex items-center justify-center"><FaTicketAlt /></span> Eventora
                    </Link>
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                        <Link to="/" className="font-mono-ticket text-xs uppercase tracking-widest text-[#FBF6EC]/75 hover:text-[#F0A63A] transition cursor-pointer">Events</Link>
                        {user ? (
                            <>
                                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="font-mono-ticket text-xs uppercase tracking-widest text-[#FBF6EC]/75 hover:text-[#F0A63A] transition">Dashboard</Link>
                                <button onClick={handleLogout} className="font-body bg-[#FBF6EC]/10 hover:bg-[#F0A63A] hover:text-[#12213B] text-[#FBF6EC] px-4 py-2 rounded-full border border-dashed border-[#FBF6EC]/30 transition">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="font-mono-ticket text-xs uppercase tracking-widest text-[#FBF6EC]/75 hover:text-[#F0A63A] transition">Login</Link>
                                <Link to="/register" className="bg-[#F0A63A] text-[#12213B] hover:bg-[#FBF6EC] px-4 py-2 rounded-full font-semibold transition">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    
  )
}

export default Navbar;

