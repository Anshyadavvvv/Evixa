import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaRegClock,
  FaSearch,
  FaShieldAlt,
  FaTicketAlt,
} from "react-icons/fa";
import api from "../Utils/axios";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      const { data } = await api.get(`/events?search=${search}`);
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEvents();
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [fetchEvents]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative bg-[#12213B] text-[#FBF6EC] rounded-[32px] overflow-hidden mb-14 shadow-xl">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, #FBF6EC 0px, #FBF6EC 2px, transparent 2px, transparent 14px)",
          }}
        ></div>

        <div className="relative p-8 md:p-16 lg:p-20 z-10">
          <span className="font-mono-ticket inline-block text-[11px] tracking-[0.25em] uppercase border border-dashed border-[#F0A63A]/60 text-[#F0A63A] px-4 py-1.5 rounded-full mb-8">
            Admit One - Eventora Pass
          </span>

          <h1 className="font-display uppercase text-4xl md:text-6xl lg:text-7xl leading-[0.92] tracking-tight mb-6 max-w-3xl">
            Find Your Next
            <br />
            <span className="relative inline-block">
              Unforgettable
              <svg className="absolute left-0 -bottom-2 w-full h-3" viewBox="0 0 300 12" preserveAspectRatio="none">
                <path d="M2 9 Q 75 1 150 6 T 298 4" stroke="#F0A63A" strokeWidth="5" fill="none" strokeLinecap="round" />
              </svg>
            </span>{" "}
            Experience
          </h1>

          <p className="font-body text-[#FBF6EC]/70 text-base md:text-lg mb-10 max-w-xl font-light leading-relaxed">
            Discover the best tech conferences, late-night music festivals, and
            hands-on workshops happening directly in your area. Secure your spot
            today.
          </p>

          <div className="w-full max-w-2xl relative flex items-center group">
            <FaSearch className="absolute left-6 text-[#12213B]/50 text-xl group-focus-within:text-[#12213B] transition-colors" />
            <input
              type="text"
              placeholder="Search events by title..."
              className="w-full pl-16 pr-6 py-4 md:py-5 rounded-full text-base text-[#12213B] bg-[#FBF6EC] border-2 border-transparent focus:border-[#F0A63A] focus:outline-none transition-all placeholder-[#12213B]/40 font-body font-medium shadow-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="relative h-6">
          <div className="absolute inset-x-8 top-0 border-t-2 border-dashed border-[#FBF6EC]/25"></div>
          <span className="absolute left-5 -top-3 w-6 h-6 rounded-full bg-[#FBF6EC]"></span>
          <span className="absolute right-5 -top-3 w-6 h-6 rounded-full bg-[#FBF6EC]"></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          [FaRegClock, "Fast Booking", "Secure your tickets instantly with our fast streamlined booking infrastructure built for speed."],
          [FaTicketAlt, "Seamless Access", "Download tickets instantly or manage them right from your personal dashboard with easily."],
          [FaShieldAlt, "Secure Platform", "All transactions and registrations are bounded by cutting-edge security and 2FA OTP tech."],
        ].map(([Icon, title, copy]) => (
          <div key={title} className="relative bg-white p-8 rounded-2xl border-2 border-dashed border-[#D9CFB8] flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-lg transition duration-300">
            <span className="absolute left-4 top-4 w-2.5 h-2.5 rounded-full bg-[#FBF6EC] border border-[#D9CFB8]"></span>
            <span className="absolute right-4 top-4 w-2.5 h-2.5 rounded-full bg-[#FBF6EC] border border-[#D9CFB8]"></span>
            <div className="w-16 h-16 bg-[#12213B] text-[#F0A63A] rounded-2xl flex items-center justify-center text-2xl mb-6">
              <Icon />
            </div>
            <h3 className="font-body text-xl font-bold text-[#12213B] mb-3">{title}</h3>
            <p className="font-body text-[#12213B]/60 text-sm leading-relaxed">{copy}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display uppercase text-2xl md:text-4xl text-[#12213B] tracking-tight">
          Upcoming Events
        </h2>
        <div className="font-mono-ticket text-[11px] md:text-xs tracking-widest uppercase text-[#146B5E] border border-dashed border-[#146B5E]/40 px-3 md:px-4 py-1.5 rounded-full whitespace-nowrap">
          {events.length} Results
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 font-body text-xl font-semibold text-[#12213B]/60">
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 font-body text-xl text-[#12213B]/40">
          No events found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="relative bg-white rounded-2xl overflow-hidden border border-[#12213B]/10 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:rotate-[-0.3deg] transition duration-300 flex flex-col"
            >
              <div className="h-48 bg-[#12213B] overflow-hidden relative">
                {event.imageURL ? (
                  <img
                    src={event.imageURL}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#FBF6EC] font-display text-2xl uppercase px-4 text-center">
                    {event.category || "Event"}
                  </div>
                )}
                <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-[#F0A63A] border-2 border-dashed border-[#12213B] flex items-center justify-center rotate-[-8deg] shadow-md">
                  {event.ticketPrice === 0 ? (
                    <span className="font-mono-ticket text-[11px] font-bold text-[#146B5E] leading-none text-center">
                      FREE
                    </span>
                  ) : (
                    <span className="font-mono-ticket text-xs font-bold text-[#12213B] leading-none text-center">
                      Rs {event.ticketPrice}
                    </span>
                  )}
                </div>
              </div>

              <div className="relative">
                <div className="border-t-2 border-dashed border-[#D9CFB8]"></div>
                <span className="absolute left-3 -top-2.5 w-5 h-5 rounded-full bg-[#FBF6EC] border border-[#D9CFB8]"></span>
                <span className="absolute right-3 -top-2.5 w-5 h-5 rounded-full bg-[#FBF6EC] border border-[#D9CFB8]"></span>
              </div>

              <div className="p-6 flex-grow flex flex-col bg-white">
                <div className="font-mono-ticket text-[11px] font-bold text-[#F0A63A] uppercase tracking-[0.2em] mb-2">
                  {event.category}
                </div>
                <h2 className="font-body text-xl font-bold text-[#12213B] mb-4">{event.title}</h2>

                <div className="flex flex-col gap-3 mb-5">
                  <div className="flex items-center gap-2 text-[#12213B]/70 text-sm">
                    <FaCalendarAlt className="text-[#146B5E]" />
                    <span className="font-body">
                      {new Date(event.date).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#12213B]/70 text-sm">
                    <FaMapMarkerAlt className="text-[#146B5E]" />
                    <span className="font-body">{event.location}</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono-ticket text-[10px] uppercase tracking-widest text-[#12213B]/40">Seats</span>
                    <span className="font-mono-ticket text-[10px] text-[#12213B]/40">{event.availableSeats}/{event.totalSeats}</span>
                  </div>
                  <div className="w-full bg-[#F4EDDD] rounded-full h-2 mb-5">
                    <div
                      className="bg-gradient-to-r from-[#146B5E] to-[#F0A63A] h-2 rounded-full"
                      style={{
                        width: `${(event.availableSeats / event.totalSeats) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <Link
                    to={`/events/${event._id}`}
                    className="block w-full text-center bg-[#12213B] hover:bg-[#F0A63A] hover:text-[#12213B] text-[#FBF6EC] font-body font-semibold py-3 rounded-full transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <footer className="relative mt-20 pt-14 pb-8 text-center">
        <div className="absolute inset-x-0 top-0 border-t-2 border-dashed border-[#D9CFB8]"></div>
        <div className="flex justify-center items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-full bg-[#12213B] flex items-center justify-center">
            <FaTicketAlt className="text-[#F0A63A]" />
          </div>
          <span className="font-display uppercase text-xl text-[#12213B] tracking-tight">
            Eventora
          </span>
        </div>
        <p className="font-body text-[#12213B]/50 text-sm mb-6 max-w-md mx-auto">
          The simplest, most dynamic way to manage, discover, and host
          world-class events in your local city. Let's make memories together.
        </p>
        <div className="font-mono-ticket text-[11px] text-[#12213B]/35 uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} Eventora Platform. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
