import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../Utils/axios';
import { AuthContext } from '../Context/AuthContextValue';
import { FaCalendarAlt, FaMapMarkerAlt, FaChair, FaMoneyBillWave, FaTicketAlt } from 'react-icons/fa';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch {
                setError('Failed to load event details.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setBookingLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            if (!showOTP) {
                await api.post('/bookings/send-otp');
                setShowOTP(true);
                setSuccessMsg('OTP sent to your email. Please verify to confirm booking.');
            } else {
                await api.post('/bookings', { eventId: event._id, otp });
                setSuccessMsg('Booking requested! Awaiting admin confirmation.');
                setShowOTP(false);
                setEvent({ ...event, availableSeats: event.availableSeats - 1 });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20 font-body text-xl font-semibold text-[#12213B]/60">Loading...</div>;
    if (error && !event) return <div className="text-center py-20 font-body text-xl text-red-600">{error || 'Event not found'}</div>;

    const isSoldOut = event.availableSeats <= 0;

    return (
        <div className="max-w-5xl mx-auto">
            <div className="relative bg-white rounded-[28px] shadow-xl overflow-hidden border border-[#12213B]/10">
                <div className="h-72 md:h-96 bg-[#12213B] relative overflow-hidden">
                    {event.imageURL ? (
                        <img src={event.imageURL} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#FBF6EC] font-display text-5xl uppercase tracking-tight px-6 text-center">
                            {event.category}
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12213B]/80 to-transparent"></div>
                    <div className="absolute left-6 right-6 bottom-6">
                        <span className="font-mono-ticket inline-block text-[11px] tracking-[0.25em] uppercase border border-dashed border-[#F0A63A]/70 text-[#F0A63A] px-4 py-1.5 rounded-full mb-4 bg-[#12213B]/70">
                            {event.category}
                        </span>
                        <h1 className="font-display uppercase text-4xl md:text-6xl text-[#FBF6EC] leading-[0.95] tracking-tight">{event.title}</h1>
                    </div>
                </div>

                <div className="relative">
                    <div className="border-t-2 border-dashed border-[#D9CFB8]"></div>
                    <span className="absolute left-5 -top-3 w-6 h-6 rounded-full bg-[#FBF6EC] border border-[#D9CFB8]"></span>
                    <span className="absolute right-5 -top-3 w-6 h-6 rounded-full bg-[#FBF6EC] border border-[#D9CFB8]"></span>
                </div>

                <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
                    <div>
                        <p className="font-body text-[#12213B]/70 text-lg leading-relaxed">{event.description}</p>
                    </div>

                    <div className="bg-[#FBF6EC] p-6 rounded-2xl border-2 border-dashed border-[#D9CFB8] shadow-sm">
                        <h3 className="font-display uppercase text-2xl text-[#12213B] mb-6 flex items-center gap-2">
                            <FaTicketAlt className="text-[#F0A63A]" /> Booking Pass
                        </h3>

                        <div className="space-y-4 mb-8">
                            {[
                                [FaMoneyBillWave, 'Ticket Price', event.ticketPrice === 0 ? 'Free' : `Rs ${event.ticketPrice}`],
                                [FaChair, 'Availability', `${event.availableSeats} / ${event.totalSeats}`],
                                [FaCalendarAlt, 'Date', new Date(event.date).toLocaleDateString()],
                                [FaMapMarkerAlt, 'Location', event.location],
                            ].map(([Icon, label, value]) => (
                                <div key={label} className="flex items-center gap-4 text-[#12213B]/70">
                                    <div className="w-10 h-10 rounded-full bg-[#12213B] flex items-center justify-center text-[#F0A63A] shrink-0">
                                        <Icon />
                                    </div>
                                    <div>
                                        <p className="font-mono-ticket text-[10px] tracking-widest text-[#12213B]/40 uppercase">{label}</p>
                                        <p className="font-body font-bold text-[#12213B]">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {showOTP && (
                            <div className="mb-4">
                                <label className="block font-mono-ticket text-[11px] uppercase tracking-widest text-[#12213B]/60 mb-2">Enter OTP to Confirm</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="6-digit code"
                                    className="w-full px-4 py-3 rounded-full border-2 border-dashed border-[#D9CFB8] bg-white focus:border-[#F0A63A] focus:outline-none transition font-mono-ticket tracking-widest text-center text-lg text-[#12213B]"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength="6"
                                />
                            </div>
                        )}

                        <button
                            onClick={handleBooking}
                            disabled={isSoldOut || bookingLoading || (showOTP && !otp)}
                            className={`w-full py-4 px-6 rounded-full font-body font-bold text-lg transition shadow-lg ${isSoldOut || (successMsg && !showOTP)
                                ? 'bg-[#D9CFB8] text-[#12213B]/40 cursor-not-allowed'
                                : 'bg-[#12213B] hover:bg-[#F0A63A] text-[#FBF6EC] hover:text-[#12213B] hover:-translate-y-1'
                                }`}
                        >
                            {bookingLoading ? 'Processing...' : (showOTP ? 'Verify OTP & Confirm' : (successMsg && !showOTP ? 'Request Sent' : (isSoldOut ? 'Sold Out' : 'Confirm Registration')))}
                        </button>
                        {error && <p className="text-red-600 mt-4 text-center font-medium bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}
                        {successMsg && <p className="text-[#146B5E] mt-4 text-center font-medium bg-green-50 p-3 rounded-xl border border-green-100">{successMsg}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
