import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

const Events = () => {
  const events = [
    {
      title: "Chitra Pournami Festival",
      date: "May 15, 2026",
      time: "4:00 AM - 10:00 PM",
      location: "Main Temple Courtyard",
      description: "Full moon day celebration with special 1008 Paal Abishekam and evening procession of the Goddess on a floral chariot.",
      image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Aadi Velli Special Pooja",
      date: "July 24, 2026",
      time: "6:00 AM - 9:00 PM",
      location: "Amman Sannidhi",
      description: "Fridays in the month of Aadi are highly auspicious. Special Oonjal Seva (Swing festival) and Kumkum archana will be performed.",
      image: "https://images.unsplash.com/photo-1590050752117-23a9d7fc2140?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Navaratri Mahotsavam",
      date: "Oct 12 - Oct 21, 2026",
      time: "Full Day",
      location: "Temple Auditorium",
      description: "Nine days of celebration with different avatars of Goddess. Golu display, cultural programs, and special Alankaram each day.",
      image: "https://images.unsplash.com/photo-1561059488-916d69792237?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div>
      <section className="gradient-red text-white py-20 px-4 text-center">
        <h1 className="text-5xl font-serif mb-6">Upcoming Festivals</h1>
        <p className="max-w-2xl mx-auto opacity-80">Mark your calendars for these divine celebrations and spiritual gatherings.</p>
      </section>

      <section className="py-20 px-4 max-w-5xl mx-auto">
        <div className="space-y-12">
          {events.map((event, i) => (
            <div key={i} className="flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all">
              <div className="md:w-1/3 h-64 md:h-auto">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
              </div>
              <div className="md:w-2/3 p-8 lg:p-12">
                <div className="flex items-center gap-2 text-temple-saffron font-bold text-sm mb-4">
                  <Calendar size={16} /> {event.date}
                </div>
                <h3 className="text-3xl font-serif text-temple-red mb-4">{event.title}</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">{event.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-500 mb-8">
                  <div className="flex items-center gap-2"><Clock size={16} className="text-temple-gold" /> {event.time}</div>
                  <div className="flex items-center gap-2"><MapPin size={16} className="text-temple-gold" /> {event.location}</div>
                </div>
                <button className="bg-temple-gold text-white px-8 py-3 rounded-full font-bold hover:bg-temple-saffron transition-all">
                  Set Reminder
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Events;
