import type { SiteContent } from "./types";

// Draft English content for client review (BRD §8: client supplies final copy).

export const en: SiteContent = {
  services: {
    "flight-tickets": {
      title: "Flight tickets",
      summary:
        "Economy to first class on any route. Tell us where and when, and we come back with the best options we can find.",
      notice:
        "Inquiry only. We send you fares by WhatsApp or email; there is no live booking on this site.",
      overview: [
        "Our ticketing team searches across airlines for the route, dates and cabin you want, and explains the fare rules before you pay.",
        "We handle one-way, return and multi-city trips, group bookings and date changes on tickets we issue.",
      ],
      eligibility: [
        "Anyone travelling from or to the UAE, or between any two cities worldwide",
        "Individuals, families, groups and corporate travellers",
      ],
      documents: [
        "Passport copy for each traveller (name exactly as on the passport)",
        "Preferred dates, cabin class and baggage needs",
        "Visa for the destination, where required",
      ],
      facts: [
        { label: "Booking", value: "By inquiry" },
        { label: "Cabins", value: "Economy to first" },
        { label: "Trip types", value: "One-way, return, multi-city" },
      ],
      priceNote: "Fares quoted on request",
      whatsappMessage: "Hello, I'd like a quote for a flight ticket.",
      faqIds: ["payment-methods", "cancellation-flights"],
    },
    "uae-tourist-visa": {
      title: "UAE tourist visa",
      summary:
        "30-day and 60-day UAE tourist visas for visitors, handled end to end by our visa desk.",
      overview: [
        "We check your documents, submit the application and keep you updated until the visa is issued.",
        "Choose a 30-day or 60-day visa depending on how long you plan to stay. Our team advises on the right option before you apply.",
      ],
      eligibility: [
        "Visitors travelling to the UAE for tourism or to visit family and friends",
        "Nationalities eligible for a UAE tourist visa",
      ],
      documents: [
        "Clear passport copy, valid for at least 6 months",
        "Recent passport-size photo on a white background",
        "Return or onward ticket, where requested",
      ],
      facts: [
        { label: "Duration", value: "30 or 60 days" },
        { label: "Applied", value: "Online, by our team" },
        { label: "Updates", value: "By WhatsApp and email" },
      ],
      priceNote: "Price on request",
      whatsappMessage: "Hello, I'm inquiring about the UAE tourist visa.",
      faqIds: ["visa-processing", "visa-documents", "visa-photo"],
    },
    "visa-change": {
      title: "A2A & B2B visa change",
      summary:
        "Change your UAE visit visa without a long trip home, by air (A2A) or by bus to the Oman border (B2B).",
      overview: [
        "Airport-to-airport (A2A): you take a short flight out of the UAE and return on a new visa.",
        "Bus-to-border (B2B): you travel by bus to the Oman border and return the same day on a new visa.",
        "We arrange the new visa, the transport and the timing, so you can stay in the UAE without a gap.",
      ],
      eligibility: [
        "Visitors currently in the UAE on a visit or tourist visa",
        "Travellers who need a new visa before their current one expires",
      ],
      documents: [
        "Passport copy and current visa copy",
        "Recent passport-size photo",
        "Preferred travel date",
      ],
      facts: [
        { label: "Options", value: "By air (A2A) or bus (B2B)" },
        { label: "Return", value: "Usually the same day" },
        { label: "Best time", value: "Before your visa expires" },
      ],
      priceNote: "Price on request",
      whatsappMessage: "Hello, I'm inquiring about an A2A or B2B visa change.",
      faqIds: ["visa-change-timing", "visa-processing"],
    },
    "global-visas": {
      title: "Global visas",
      summary:
        "Schengen, UK, US and Asian visas, with help on forms, appointments and supporting documents.",
      overview: [
        "Every embassy has its own rules. We prepare your file, book the appointment where needed and check everything before you submit.",
        "We support tourist, business and family visit visas for Schengen countries, the UK, the US and destinations across Asia.",
      ],
      eligibility: [
        "UAE residents and visitors applying from the UAE",
        "Tourist, business and family visit travel",
      ],
      documents: [
        "Passport, Emirates ID and residence visa (for UAE residents)",
        "Bank statements and salary certificate or business documents",
        "Travel itinerary, hotel booking and travel insurance, where required",
      ],
      facts: [
        { label: "Destinations", value: "Schengen, UK, US, Asia" },
        { label: "Support", value: "Forms, appointments, file check" },
        { label: "Decision", value: "Made by the embassy" },
      ],
      priceNote: "Service fee on request",
      whatsappMessage: "Hello, I'd like help with a visa application abroad.",
      faqIds: ["visa-documents", "visa-refusal"],
    },
    "family-residence-visas": {
      title: "Family & residence visas",
      summary:
        "Bring your family to the UAE or renew a residence visa, with clear guidance at every step.",
      overview: [
        "We guide you through family sponsorship, residence visa renewals and the related medical and Emirates ID steps.",
        "Our team tells you exactly which documents you need before you start, so there are no surprises later.",
      ],
      eligibility: [
        "UAE residents sponsoring a spouse, children or parents",
        "Residents renewing or transferring a residence visa",
      ],
      documents: [
        "Sponsor's passport, residence visa and Emirates ID",
        "Family members' passports and photos",
        "Attested marriage or birth certificates and a tenancy contract, where required",
      ],
      facts: [
        { label: "For", value: "Spouse, children, parents" },
        { label: "Includes", value: "Guidance on medical and Emirates ID" },
        { label: "Updates", value: "By WhatsApp and email" },
      ],
      priceNote: "Price on request",
      whatsappMessage: "Hello, I'm inquiring about a family or residence visa.",
      faqIds: ["visa-documents", "payment-methods"],
    },
  },

  packages: {
    "dubai-city-tour": {
      title: "Dubai city tour",
      category: "City",
      duration: "Half or full day",
      summary:
        "Old Dubai and new Dubai in one day, from the creek and souks to the skyline.",
      overview: [
        "A guided tour of Dubai's landmarks with hotel pick-up and drop-off.",
        "Pick a half-day highlights tour or a full day with time for lunch and shopping.",
      ],
      inclusions: [
        "Hotel pick-up and drop-off",
        "Licensed guide",
        "Abra ride across Dubai Creek",
        "Photo stops at major landmarks",
      ],
      itinerary: [
        { title: "Old Dubai", description: "Al Fahidi district, Dubai Creek and the spice and gold souks." },
        { title: "Modern Dubai", description: "Jumeirah, Burj Al Arab views and Palm Jumeirah." },
        { title: "Downtown", description: "Burj Khalifa and Dubai Mall area." },
      ],
      priceNote: "Price on request",
      whatsappMessage: "Hello, I'm interested in the Dubai city tour.",
    },
    "desert-safari": {
      title: "Desert safari",
      category: "Desert",
      duration: "Evening",
      summary:
        "Dune drive, sunset over the sand and dinner at a desert camp.",
      overview: [
        "An evening in the desert with a 4x4 dune drive, sunset photos and a camp dinner with live shows.",
        "Private and premium camp options are available for families and couples.",
      ],
      inclusions: [
        "Pick-up and drop-off",
        "4x4 dune drive",
        "Camel ride and sandboarding",
        "Dinner and live entertainment at the camp",
      ],
      itinerary: [
        { title: "Afternoon pick-up", description: "Collection from your hotel or home." },
        { title: "Dunes and sunset", description: "Dune drive and a stop for sunset photos." },
        { title: "Desert camp", description: "Dinner, shows and activities at the camp." },
      ],
      priceNote: "Price on request",
      whatsappMessage: "Hello, I'm interested in the desert safari.",
    },
    "luxury-vip": {
      title: "Luxury VIP experiences",
      category: "Luxury",
      duration: "Tailored",
      summary:
        "Private transfers, five-star stays and exclusive experiences, planned around you.",
      overview: [
        "A private itinerary with luxury cars, top hotels and experiences such as yacht cruises and private dining.",
        "One named agent plans and looks after your trip from arrival to departure.",
      ],
      inclusions: [
        "Private chauffeur-driven transfers",
        "Five-star hotel options",
        "Private yacht or helicopter options",
        "Dedicated agent on WhatsApp",
      ],
      itinerary: [
        { title: "Arrival", description: "Meet and greet with a private transfer to your hotel." },
        { title: "Your days", description: "Experiences planned around your interests and pace." },
        { title: "Departure", description: "Private transfer and check-in support." },
      ],
      priceNote: "Price on request",
      whatsappMessage: "Hello, I'd like to plan a luxury VIP trip.",
    },
    "custom-holidays": {
      title: "Custom holidays",
      category: "Worldwide",
      duration: "Your dates",
      summary:
        "Holidays built from scratch: flights, visas, hotels and tours in one plan.",
      overview: [
        "Tell us where you want to go and how you like to travel. We put together a complete plan with one price.",
        "We handle the visa, flights, hotels and activities, so you only have one contact for the whole trip.",
      ],
      inclusions: [
        "Flights and hotels",
        "Visa assistance",
        "Transfers and tours",
        "Travel insurance options",
      ],
      itinerary: [
        { title: "Tell us your idea", description: "Destination, dates, budget and travel style." },
        { title: "Get a plan", description: "A day-by-day plan with one clear price." },
        { title: "Travel", description: "We stay in touch throughout your trip." },
      ],
      priceNote: "Price on request",
      whatsappMessage: "Hello, I'd like to plan a custom holiday.",
    },
    "family-group": {
      title: "Family & group packages",
      category: "Groups",
      duration: "Flexible",
      summary:
        "Trips for families, friends and groups, with pacing and rooms that suit everyone.",
      overview: [
        "Packages for families with children, friends travelling together and larger groups.",
        "We plan room arrangements, transport and activities that work for every age.",
      ],
      inclusions: [
        "Family rooms or group hotel blocks",
        "Private transport for the group",
        "Child-friendly activities",
        "Group rates on tours",
      ],
      itinerary: [
        { title: "Plan together", description: "We agree the group size, dates and must-dos." },
        { title: "Book once", description: "One booking covers hotels, transport and tours." },
        { title: "Enjoy", description: "A coordinator is on call during the trip." },
      ],
      priceNote: "Price on request",
      whatsappMessage: "Hello, I'm interested in a family or group package.",
    },
  },

  faq: [
    {
      id: "visa-policies",
      title: "Visa policies",
      items: [
        {
          id: "visa-processing",
          question: "How long does a UAE visa take to process?",
          answer:
            "Processing times depend on the visa type and the authorities. We give you an estimate once we have checked your documents, and update you until the visa is issued.",
        },
        {
          id: "visa-change-timing",
          question: "When should I arrange an A2A or B2B visa change?",
          answer:
            "Contact us at least a few days before your current visa expires, so the new visa can be arranged without a gap.",
        },
        {
          id: "visa-refusal",
          question: "Can you guarantee my visa will be approved?",
          answer:
            "No. The decision is always made by the embassy or immigration authority. We make sure your application is complete and correct, which gives it the best chance.",
        },
      ],
    },
    {
      id: "documents",
      title: "Documents",
      items: [
        {
          id: "visa-documents",
          question: "Which documents do I need?",
          answer:
            "It depends on the visa. Each service page lists the main documents, and our team confirms the full list for your case before you apply.",
        },
        {
          id: "visa-photo",
          question: "What kind of photo is required?",
          answer:
            "A recent colour photo with a white background, showing your full face. A clear phone photo is usually fine; we will tell you if it needs to be retaken.",
        },
      ],
    },
    {
      id: "payments",
      title: "Payment methods",
      items: [
        {
          id: "payment-methods",
          question: "How can I pay?",
          answer:
            "Payments are made offline: cash or card at our branches, or bank transfer. We do not take payments on this website.",
        },
      ],
    },
    {
      id: "cancellation",
      title: "Cancellation",
      items: [
        {
          id: "cancellation-flights",
          question: "Can I cancel or change a flight ticket?",
          answer:
            "It depends on the airline's fare rules. We explain the rules before you book and help with any changes or refunds the airline allows.",
        },
        {
          id: "cancellation-packages",
          question: "What is your cancellation policy for packages?",
          answer:
            "Cancellation terms depend on the hotels and suppliers in your package. We share the terms with your quote, before you confirm.",
        },
      ],
    },
  ],

  branches: {
    sharjah: {
      name: "Sharjah",
      address: "Al Zahra Street, Sharjah, UAE",
      hours: "Saturday to Thursday, 9:00 to 21:00",
      mapQuery: "Al Zahra Street, Sharjah, United Arab Emirates",
    },
    dubai: {
      name: "Dubai",
      address: "Port Saeed, Deira, Dubai, UAE",
      hours: "Saturday to Thursday, 9:00 to 21:00",
      mapQuery: "Port Saeed, Deira, Dubai, United Arab Emirates",
    },
    sajaa: {
      name: "Sajaa",
      address: "Al Dhaid Street, Sajaa, Sharjah, UAE",
      hours: "Saturday to Thursday, 9:00 to 21:00",
      mapQuery: "Al Dhaid Road, Sajaa, Sharjah, United Arab Emirates",
    },
    india: {
      name: "India",
      address: "Address to be confirmed",
      hours: "Hours to be confirmed",
      mapQuery: "",
    },
  },

  legal: {
    privacy: {
      title: "Privacy Policy",
      updated: "2026-10-25",
      intro:
        "This policy explains what personal information Al Saadah Tourism collects through this website and how we use it.",
      sections: [
        {
          heading: "Information we collect",
          paragraphs: [
            "When you send an inquiry, we collect the details you enter, such as your name, phone number, email address, travel dates and any documents you upload.",
            "We also collect anonymous usage statistics to understand how the website is used.",
          ],
        },
        {
          heading: "How we use it",
          paragraphs: [
            "We use your details only to respond to your inquiry and to provide the services you request, such as visa applications and bookings.",
            "We do not sell your personal information.",
          ],
        },
        {
          heading: "Sharing",
          paragraphs: [
            "We share information with airlines, hotels, embassies and government authorities only when needed to deliver the service you asked for.",
          ],
        },
        {
          heading: "Your rights",
          paragraphs: [
            "You can ask us to show, correct or delete the personal information we hold about you by contacting any of our branches.",
          ],
        },
      ],
    },
    terms: {
      title: "Terms & Conditions",
      updated: "2026-10-25",
      intro:
        "These terms apply to your use of this website and to inquiries made through it.",
      sections: [
        {
          heading: "Inquiries, not bookings",
          paragraphs: [
            "This website is for information and inquiries. A booking is only confirmed once our team sends written confirmation and payment is received.",
          ],
        },
        {
          heading: "Prices and availability",
          paragraphs: [
            "Prices and availability change often and are confirmed at the time of booking.",
          ],
        },
        {
          heading: "Visas",
          paragraphs: [
            "Visa decisions are made by embassies and immigration authorities. We cannot guarantee approval.",
          ],
        },
        {
          heading: "Liability",
          paragraphs: [
            "We are not responsible for changes made by airlines, hotels or authorities, but we will help you as much as we can when they happen.",
          ],
        },
      ],
    },
    cookies: {
      title: "Cookie Notice",
      updated: "2026-10-25",
      intro:
        "This notice explains how this website uses cookies and similar technologies.",
      sections: [
        {
          heading: "Analytics",
          paragraphs: [
            "We use privacy-friendly analytics that do not use cookies to count visits and page views.",
          ],
        },
        {
          heading: "Maps and embeds",
          paragraphs: [
            "Google Maps on the Contact page loads only after you choose to show it. Google may set its own cookies when the map loads.",
          ],
        },
      ],
    },
    credits: {
      title: "Photo credits",
      updated: "2026-10-25",
      intro:
        "Photos on this website come from Wikimedia Commons and are used under the licences listed below.",
      sections: [],
    },
  },
};
