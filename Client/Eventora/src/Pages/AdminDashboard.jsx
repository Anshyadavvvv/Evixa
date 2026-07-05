import { useCallback, useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Context/AuthContextValue';
import api from '../Utils/axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showEventForm, setShowEventForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', imageURL: ''
    });

    const fetchData = useCallback(async () => {
        try {
            const [eventsRes, bookingsRes] = await Promise.all([
                api.get('/events'),
                api.get('/bookings/my')
            ]);
            setEvents(eventsRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, [user, navigate, fetchData]);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', formData);
            setShowEventForm(false);
            setFormData({ title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', imageURL: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating event');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                fetchData();
            } catch {
                alert('Error deleting event');
            }
        }
    };

    const handleConfirmBooking = async (id, paymentStatus) => {
        try {
            await api.put(`/bookings/${id}/confirm`, { paymentStatus });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error confirming booking');
        }
    };

    const handleCancelBooking = async (id) => {
        if (window.confirm('Cancel this user\'s booking request?')) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchData();
            } catch (error) {
                alert(error.response?.data?.message || 'Error cancelling booking');
            }
        }
    };

    if (loading) return <div className="text-center py-20 font-body text-xl font-semibold text-[#12213B]/60">Loading admin panel...</div>;

    const revenue = bookings.reduce((sum, b) => b.paymentStatus === 'paid' && b.status === 'confirmed' ? sum + b.amount : sum, 0);
    const paidClients = new Set(bookings.filter(b => b.paymentStatus === 'paid' && b.status === 'confirmed').map(b => b.userId?._id)).size;
    const pendingRequests = bookings.filter(b => b.status === 'pending').length;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="relative bg-[#12213B] text-[#FBF6EC] rounded-[28px] p-6 sm:p-8 mb-8 shadow-xl overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{ backgroundImage: "repeating-linear-gradient(115deg, #FBF6EC 0px, #FBF6EC 2px, transparent 2px, transparent 14px)" }}
                ></div>
                <div className="relative">
                    <p className="font-mono-ticket text-[11px] uppercase tracking-[0.25em] text-[#F0A63A] mb-2">Control Booth</p>
                    <h1 className="font-display uppercase text-3xl sm:text-5xl mb-2">Admin Dashboard</h1>
                    <p className="text-[#FBF6EC]/65">Manage events and manually confirm bookings.</p>
                </div>
                <button
                    onClick={() => setShowEventForm(!showEventForm)}
                    className="relative w-full md:w-auto bg-[#F0A63A] text-[#12213B] font-bold py-3 px-6 rounded-full hover:bg-[#FBF6EC] transition shadow-md"
                >
                    {showEventForm ? 'Cancel Creation' : '+ Create New Event'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    ['Total Revenue', `Rs ${revenue}`, 'text-[#146B5E]'],
                    ['Paid Clients', paidClients, 'text-blue-600'],
                    ['Pending Requests', pendingRequests, 'text-yellow-700'],
                ].map(([label, value, color]) => (
                    <div key={label} className="bg-white p-6 rounded-2xl shadow-sm border-2 border-dashed border-[#D9CFB8] flex items-center justify-between">
                        <div>
                            <p className="font-mono-ticket text-[11px] text-[#12213B]/45 uppercase tracking-wider mb-1">{label}</p>
                            <h3 className={`font-display text-4xl ${color}`}>{value}</h3>
                        </div>
                        <div className="w-12 h-12 bg-[#FBF6EC] text-[#F0A63A] rounded-full flex items-center justify-center text-xl font-bold border border-dashed border-[#D9CFB8]">●</div>
                    </div>
                ))}
            </div>

            {showEventForm && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-dashed border-[#D9CFB8] mb-8">
                    <h2 className="font-display uppercase text-3xl mb-6 text-[#12213B]">Create New Event</h2>
                    <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input required type="text" placeholder="Event Title" className="border-2 border-dashed border-[#D9CFB8] bg-[#FBF6EC] px-4 py-3 rounded-full focus:border-[#F0A63A] outline-none transition" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        <input required type="text" placeholder="Category (e.g., Tech, Music)" className="border-2 border-dashed border-[#D9CFB8] bg-[#FBF6EC] px-4 py-3 rounded-full focus:border-[#F0A63A] outline-none transition" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                        <input required type="date" className="border-2 border-dashed border-[#D9CFB8] bg-[#FBF6EC] px-4 py-3 rounded-full focus:border-[#F0A63A] outline-none transition" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        <input required type="text" placeholder="Location" className="border-2 border-dashed border-[#D9CFB8] bg-[#FBF6EC] px-4 py-3 rounded-full focus:border-[#F0A63A] outline-none transition" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                        <input required type="number" placeholder="Total Seats" className="border-2 border-dashed border-[#D9CFB8] bg-[#FBF6EC] px-4 py-3 rounded-full focus:border-[#F0A63A] outline-none transition" value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })} />
                        <input required type="number" placeholder="Ticket Price (0 for free)" className="border-2 border-dashed border-[#D9CFB8] bg-[#FBF6EC] px-4 py-3 rounded-full focus:border-[#F0A63A] outline-none transition" value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} />

                        <div className="md:col-span-2">
                            <input required type="url" placeholder="Image URL (Provide any direct link to an image)" className="w-full border-2 border-dashed border-[#D9CFB8] bg-[#FBF6EC] px-4 py-3 rounded-full focus:border-[#F0A63A] outline-none transition" value={formData.imageURL} onChange={e => setFormData({ ...formData, imageURL: e.target.value })} />
                        </div>

                        <textarea required placeholder="Event Description" className="border-2 border-dashed border-[#D9CFB8] bg-[#FBF6EC] px-4 py-3 rounded-2xl md:col-span-2 h-32 focus:border-[#F0A63A] outline-none transition" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        <button type="submit" className="md:col-span-2 bg-[#12213B] text-[#FBF6EC] font-bold py-3 mt-2 rounded-full hover:bg-[#F0A63A] hover:text-[#12213B] transition shadow-md">Publish Event</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col">
                    <h2 className="font-display uppercase text-3xl mb-6 text-[#12213B] flex items-center gap-3">
                        <span className="font-mono-ticket flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#146B5E] text-sm border border-dashed border-[#D9CFB8]">{events.length}</span>
                        All Events
                    </h2>
                    <div className="bg-white rounded-2xl shadow-sm border border-[#12213B]/10 overflow-hidden">
                        <ul className="divide-y divide-[#D9CFB8] max-h-[600px] overflow-y-auto">
                            {events.length === 0 ? <li className="p-6 text-[#12213B]/50 text-center">No events created yet.</li> :
                                events.map(event => (
                                    <li key={event._id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-[#FBF6EC] transition">
                                        <div>
                                            <h4 className="font-bold text-[#12213B] mb-1 leading-tight">{event.title}</h4>
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-[#12213B]/55">
                                                <span className="flex items-center gap-1 font-medium"><span className="w-2 h-2 rounded-full bg-[#F0A63A]"></span> {new Date(event.date).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1 font-medium"><span className={`w-2 h-2 rounded-full ${event.availableSeats > 0 ? 'bg-[#146B5E]' : 'bg-red-500'}`}></span> {event.availableSeats}/{event.totalSeats} seats</span>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteEvent(event._id)} className="w-full sm:w-auto text-red-600 hover:text-white hover:bg-red-600 border border-red-200 px-4 py-2 rounded-full text-sm font-bold transition shadow-sm shrink-0">
                                            Delete
                                        </button>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col">
                    <h2 className="font-display uppercase text-3xl mb-6 text-[#12213B] flex items-center gap-3">
                        <span className="font-mono-ticket flex items-center justify-center w-8 h-8 rounded-full bg-white text-yellow-700 text-sm border border-dashed border-[#D9CFB8]">{bookings.length}</span>
                        Booking Requests
                    </h2>
                    <div className="bg-white rounded-2xl shadow-sm border border-[#12213B]/10 overflow-hidden">
                        <ul className="divide-y divide-[#D9CFB8] max-h-[600px] overflow-y-auto">
                            {bookings.length === 0 ? <li className="p-6 text-[#12213B]/50 text-center">No bookings yet.</li> :
                                bookings.map(booking => (
                                    <li key={booking._id} className={`p-6 hover:bg-[#FBF6EC] transition border-l-4 ${booking.status === 'pending' ? 'border-l-yellow-400' : booking.status === 'confirmed' ? 'border-l-[#146B5E]' : 'border-l-red-400'}`}>
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-bold text-[#12213B] text-lg leading-tight">{booking.eventId?.title || 'Deleted Event'}</h4>
                                            <div className="flex flex-col gap-1 items-end shrink-0 ml-4">
                                                <span className={`px-2 py-1 text-[10px] font-mono-ticket rounded-full uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-green-100 text-[#146B5E]' : booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{booking.status}</span>
                                                {booking.status !== 'cancelled' && <span className={`px-2 py-1 text-[10px] font-mono-ticket rounded-full uppercase tracking-wider ${booking.paymentStatus === 'paid' ? 'bg-indigo-100 text-indigo-700' : 'bg-[#FBF6EC] text-[#12213B]/70'}`}>{booking.paymentStatus.replace('_', ' ')}</span>}
                                            </div>
                                        </div>
                                        <div className="bg-[#FBF6EC] rounded-xl p-3 mb-3 border border-dashed border-[#D9CFB8] text-sm">
                                            <p className="text-[#12213B]/70 flex items-center gap-2 mb-1">
                                                <span className="font-bold w-16 text-[#12213B]/45 uppercase text-xs">User:</span>
                                                <span className="font-semibold">{booking.userId?.name}</span>
                                                <span className="text-[#12213B]/35">({booking.userId?.email})</span>
                                            </p>
                                            <p className="text-[#12213B]/70 flex items-center gap-2 mb-1">
                                                <span className="font-bold w-16 text-[#12213B]/45 uppercase text-xs">Amount:</span>
                                                <span className={`font-semibold ${booking.amount === 0 ? 'text-[#146B5E]' : ''}`}>{booking.amount === 0 ? 'Free' : `Rs ${booking.amount}`}</span>
                                            </p>
                                            <p className="text-[#12213B]/70 flex items-center gap-2 mb-1">
                                                <span className="font-bold w-16 text-[#12213B]/45 uppercase text-xs">Date:</span>
                                                <span>{new Date(booking.bookedAt).toLocaleString()}</span>
                                            </p>
                                            {booking.eventId && (
                                                <p className="text-[#12213B]/70 flex items-center gap-2 mt-2 pt-2 border-t border-dashed border-[#D9CFB8]">
                                                    <span className="font-bold w-16 text-[#12213B]/45 uppercase text-xs">Seats:</span>
                                                    <span className={`font-bold ${booking.eventId.availableSeats > 0 ? 'text-[#146B5E]' : 'text-red-500'}`}>{booking.eventId.availableSeats}</span> remaining of {booking.eventId.totalSeats}
                                                </p>
                                            )}
                                        </div>

                                        {booking.status === 'pending' && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <button onClick={() => handleConfirmBooking(booking._id, 'paid')} className="flex-1 min-w-[120px] bg-green-50 text-[#146B5E] hover:bg-[#146B5E] hover:text-white border border-green-200 text-xs font-bold py-2.5 px-3 rounded-full shadow-sm transition">
                                                    Approve Paid
                                                </button>
                                                <button onClick={() => handleConfirmBooking(booking._id, 'not_paid')} className="flex-1 min-w-[120px] bg-[#FBF6EC] text-[#12213B] hover:bg-[#12213B] hover:text-[#FBF6EC] border border-[#D9CFB8] text-xs font-bold py-2.5 px-3 rounded-full shadow-sm transition">
                                                    Approve Undecided
                                                </button>
                                                <button onClick={() => handleCancelBooking(booking._id)} className="w-[80px] bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-200 text-xs font-bold py-2.5 px-3 rounded-full transition">
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
