import React, { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const HelpCenter: React.FC = () => {
  const [activeItem, setActiveItem] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "How do I sign up for Event Flow?",
      answer: "Click on the 'Login' button in the top navigation and then select 'Sign Up'. Create your account with your email and password. Once registered, you can browse events, make bookings, and access your profile."
    },
    {
      id: 2,
      question: "How can I search for events?",
      answer: "Use the search bar at the top of the page to search for events by keyword. You can also use the location filter to find events in specific areas like Nova Scotia, Toronto, New York, or Vancouver."
    },
    {
      id: 3,
      question: "How do I book a seat for an event?",
      answer: "Find the event you want to attend, click 'View Details', and then click the booking button. You'll receive an e-ticket with a QR code that you can use for entry."
    },
    {
      id: 4,
      question: "How can I cancel my booking?",
      answer: "Go to your account page by clicking on your profile. Find the booking you want to cancel and click the cancel button. Please note that cancellation policies may vary by event."
    },
    {
      id: 5,
      question: "How do I become an event organizer?",
      answer: "To become an organizer, you need to be promoted by an admin. Contact our support team to request organizer access, and provide details about the events you plan to organize."
    },
    {
      id: 6,
      question: "How do I create an event as an organizer?",
      answer: "Once you have organizer access, you can create events by providing event details, date, time, location, and category. Your events will need admin approval before being published."
    },
    {
      id: 7,
      question: "How do I view my event bookings as an organizer?",
      answer: "In your organizer dashboard, you can view all bookings for your events, see attendee lists, and access real-time statistics including demographic breakdowns."
    },
    {
      id: 8,
      question: "What should I do if I forgot my password?",
      answer: "Click on 'Login' and then select 'Forgot Password'. Enter your email address and you'll receive instructions to reset your password."
    },
    {
      id: 9,
      question: "How do I update my profile information?",
      answer: "Log into your account and go to your account page. You can update your personal information, contact details, and preferences from there."
    },
    {
      id: 10,
      question: "What should I do if I'm having technical issues?",
      answer: "If you're experiencing technical difficulties, try refreshing the page or clearing your browser cache. If the problem persists, please contact our support team using the chat feature."
    }
  ];

  const toggleItem = (id: number) => {
    setActiveItem(activeItem === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Help Center</h1>
          <p className="text-lg text-gray-600">Find answers to common questions about Event Flow</p>
        </header>

        {/* Search Section */}
        <div className="mb-12">
          <div className="max-w-lg mx-auto relative">
            <input 
              type="text" 
              placeholder="Search for help topics..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {faqData.map((item, index) => (
              <div key={item.id} className={`${index !== faqData.length - 1 ? 'border-b border-gray-200' : ''}`}>
                <button 
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-800 pr-4">{item.question}</h3>
                    <span className="text-orange-500 text-xl font-light">
                      {activeItem === item.id ? '−' : '+'}
                    </span>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeItem === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Still need help?</h2>
          <p className="text-gray-600 mb-6">Can't find what you're looking for? Get in touch with our support team.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors font-medium">
              Start Live Chat
            </button>
            <button className="border border-orange-500 text-orange-500 hover:bg-orange-50 px-6 py-3 rounded-lg transition-colors font-medium">
              Email Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;