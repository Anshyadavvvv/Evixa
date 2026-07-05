import { useState, useContext } from 'react';
import { AuthContext } from '../Context/AuthContextValue';
import { useNavigate, Link } from 'react-router-dom';
import { FaTicketAlt } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, verifyOtp } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!showOTP) {
                const data = await login(email, password);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            } else {
                const data = await verifyOtp(email, otp);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            }
        } catch (err) {
            if (err.needsVerification) {
                setShowOTP(true);
                setError('Account not verified. A new OTP has been sent to your email.');
            } else {
                setError(err.response?.data?.message || err.message || String(err));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-[28px] shadow-xl border-2 border-dashed border-[#D9CFB8] relative overflow-hidden">
            <span className="absolute left-5 top-5 w-3 h-3 rounded-full bg-[#FBF6EC] border border-[#D9CFB8]"></span>
            <span className="absolute right-5 top-5 w-3 h-3 rounded-full bg-[#FBF6EC] border border-[#D9CFB8]"></span>
            <div className="text-center mb-8">
                <div className="w-14 h-14 bg-[#12213B] text-[#F0A63A] rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                    <FaTicketAlt />
                </div>
                <p className="font-mono-ticket text-[11px] uppercase tracking-[0.25em] text-[#F0A63A] mb-2">Admit One</p>
                <h2 className="font-display uppercase text-4xl text-[#12213B] mb-2">Welcome Back</h2>
                <p className="font-body text-[#12213B]/55">Sign in to your Eventora account</p>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-center border border-red-100">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {!showOTP ? (
                    <>
                        <div>
                            <label className="block font-mono-ticket text-[11px] uppercase tracking-widest text-[#12213B]/60 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-full border-2 border-dashed border-[#D9CFB8] bg-[#FBF6EC] focus:border-[#F0A63A] focus:outline-none transition text-[#12213B]"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block font-mono-ticket text-[11px] uppercase tracking-widest text-[#12213B]/60 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-full border-2 border-dashed border-[#D9CFB8] bg-[#FBF6EC] focus:border-[#F0A63A] focus:outline-none transition text-[#12213B]"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </>
                ) : (
                    <div>
                        <label className="block font-mono-ticket text-[11px] uppercase tracking-widest text-[#12213B]/60 mb-2">Verification Code</label>
                        <input
                            type="text"
                            required
                            placeholder="6-digit code"
                            className="w-full px-4 py-3 rounded-full border-2 border-dashed border-[#D9CFB8] bg-[#FBF6EC] focus:border-[#F0A63A] focus:outline-none transition font-mono-ticket tracking-widest text-center text-lg text-[#12213B]"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength="6"
                        />
                    </div>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#12213B] hover:bg-[#F0A63A] text-[#FBF6EC] hover:text-[#12213B] font-body font-bold py-3 rounded-full transition shadow-md disabled:opacity-60"
                >
                    {loading ? 'Processing...' : (showOTP ? 'Verify OTP & Log In' : 'Sign In')}
                </button>
            </form>

            <p className="text-center mt-8 text-[#12213B]/60">
                Don't have an account? <Link to="/register" className="text-[#146B5E] font-bold hover:underline">Sign up</Link>
            </p>
        </div>
    );
};

export default Login;
