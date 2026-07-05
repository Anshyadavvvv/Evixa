import { useCallback, useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Context/AuthContextValue';
import api from '../Utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaTimesCircle } from 'react-icons/fa';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = useCallback(async () => {
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchBookings();
    }, [user, navigate, fetchBookings]);

    const cancelBooking = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking request?')) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchBookings();
            } catch (error) {
                alert(error.response?.data?.message || 'Error cancelling booking');
            }
        }
    };

    if (loading) return <div className="text-center py-20 font-body text-xl font-semibold text-[#12213B]/60">Loading dashboard...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="relative bg-[#12213B] text-[#FBF6EC] rounded-[28px] p-6 sm:p-8 mb-8 shadow-xl overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{ backgroundImage: "repeating-linear-gradient(115deg, #FBF6EC 0px, #FBF6EC 2px, transparent 2px, transparent 14px)" }}
                ></div>
                <div className="relative flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
                    <div className="w-20 h-20 bg-[#F0A63A] text-[#12213B] rounded-full flex items-center justify-center font-display text-4xl uppercase tracking-tight shrink-0">
                        {user?.name.charAt(0)}
                    </div>
                    <div className="flex flex-col items-center sm:items-start">
                        <p className="font-mono-ticket text-[11px] uppercase tracking-[0.25em] text-[#F0A63A] mb-2">Holder Dashboard</p>
                        <h1 className="font-display uppercase text-3xl sm:text-5xl mb-2">Welcome, {user?.name}!</h1>
                        <p className="text-[#FBF6EC]/65 flex items-center justify-center sm:justify-start gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#F0A63A]"></span> User Dashboard
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mb-6">
                <h2 className="font-display uppercase text-2xl sm:text-4xl text-[#12213B] flex items-center gap-3">
                    <FaTicketAlt className="text-[#F0A63A]" /> My Bookings
                </h2>
                <span className="font-mono-ticket text-[11px] uppercase tracking-widest text-[#146B5E] border border-dashed border-[#146B5E]/40 px-3 py-1.5 rounded-full">
                    {bookings.length} Passes
                </span>
            </div>

            {bookings.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center border-2 border-dashed border-[#D9CFB8]">
                    <div className="w-20 h-20 bg-[#FBF6EC] rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-[#D9CFB8]">
                        <FaTicketAlt className="text-[#F0A63A] text-3xl" />
                    </div>
                    <p className="text-xl text-[#12213B]/55 mb-6 mt-4 font-medium">You haven't booked any events yet.</p>
                    <Link to="/" className="inline-block bg-[#12213B] hover:bg-[#F0A63A] hover:text-[#12213B] text-[#FBF6EC] font-bold py-3 px-8 rounded-full transition shadow-md">
                        Browse Events
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition border border-[#12213B]/10 flex flex-col">
                            <div className="p-6 border-b-2 border-dashed border-[#D9CFB8] flex-grow">
                                {booking.eventId ? (
                                    <>
                                        <div className="flex justify-between items-start mb-4 gap-3">
                                            <h3 className="font-body text-lg font-bold text-[#12213B] leading-tight">{booking.eventId.title}</h3>
                                            <div className="flex flex-col gap-1 items-end">
                                                <span className={`px-2 py-1 text-[10px] font-mono-ticket rounded-full uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-green-100 text-[#146B5E]' :
                                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                                {booking.status !== 'cancelled' && (
                                                    <span className={`px-2 py-1 text-[10px] font-mono-ticket rounded-full uppercase tracking-wider ${booking.paymentStatus === 'paid' ? 'bg-blue-100 text-blue-700' : 'bg-[#FBF6EC] text-[#12213B]/70'
                                                        }`}>
                                                        {booking.paymentStatus.replace('_', ' ')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="font-body text-sm text-[#12213B]/60 mb-4 space-y-1">
                                            <p><strong className="text-[#12213B]">Date:</strong> {new Date(booking.eventId.date).toLocaleDateString()}</p>
                                            <p><strong className="text-[#12213B]">Amount:</strong> {booking.amount === 0 ? 'Free' : `Rs ${booking.amount}`}</p>
                                            <p><strong className="text-[#12213B]">Requested:</strong> {new Date(booking.bookedAt).toLocaleDateString()}</p>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-red-500 italic">Event details unavailable (might have been deleted)</p>
                                )}
                            </div>
                            <div className="p-4 bg-[#FBF6EC] flex justify-between items-center shrink-0">
                                {booking.eventId && booking.status !== 'cancelled' ? (
                                    <>
                                        <Link to={`/events/${booking.eventId._id}`} className="text-[#146B5E] font-semibold text-sm hover:underline">View Event</Link>
                                        <button
                                            onClick={() => cancelBooking(booking._id)}
                                            className="text-red-500 font-semibold text-sm hover:text-red-700 transition flex items-center gap-1"
                                        >
                                            <FaTimesCircle /> Cancel
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full text-center text-sm text-[#12213B]/45 italic">Booking Cancelled</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
