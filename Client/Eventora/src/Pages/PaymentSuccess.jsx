import { Link } from 'react-router-dom';
import { FaCheckCircle, FaTicketAlt } from 'react-icons/fa';

const PaymentSuccess = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
            <div className="relative bg-white p-10 rounded-[30px] shadow-xl max-w-md w-full text-center border-2 border-dashed border-[#D9CFB8] overflow-hidden">
                <span className="absolute left-5 top-5 w-3 h-3 rounded-full bg-[#FBF6EC] border border-[#D9CFB8]"></span>
                <span className="absolute right-5 top-5 w-3 h-3 rounded-full bg-[#FBF6EC] border border-[#D9CFB8]"></span>
                <div className="w-20 h-20 rounded-full bg-[#146B5E] text-[#FBF6EC] flex items-center justify-center mx-auto mb-6 text-4xl shadow-lg">
                    <FaCheckCircle />
                </div>
                <p className="font-mono-ticket text-[11px] uppercase tracking-[0.25em] text-[#F0A63A] mb-2">Confirmed Pass</p>
                <h1 className="font-display uppercase text-4xl text-[#12213B] mb-4">Booking Confirmed!</h1>
                <p className="text-[#12213B]/60 mb-8 text-lg">Your ticket has been booked successfully. A confirmation email has been sent to your registered email address.</p>
                <div className="space-y-4">
                    <Link to="/dashboard" className="block w-full bg-[#12213B] hover:bg-[#F0A63A] text-[#FBF6EC] hover:text-[#12213B] font-bold py-4 px-6 rounded-full transition shadow-lg">
                        View My Tickets
                    </Link>
                    <Link to="/" className="block w-full bg-[#FBF6EC] hover:bg-white text-[#12213B] font-bold py-4 px-6 rounded-full transition border border-dashed border-[#D9CFB8]">
                        <span className="inline-flex items-center justify-center gap-2"><FaTicketAlt /> Discover More Events</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
