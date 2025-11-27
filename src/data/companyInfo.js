export const companyInfo = {
  name: "TVS Event Center",
  tagline: "Where Dreams Come to Life",
  description: "Create unforgettable memories in our state-of-the-art event venue designed for life's most precious moments. From intimate gatherings to grand celebrations, we provide comprehensive event services tailored to your unique vision.",
  
  // Contact Information
  contact: {
    phone: "832-228-1066",
    email: "tvseventcenter@gmail.com",
    contactPerson: "Benny"
  },
  
  // Address Information
  address: {
    street: "15511 Hwy 6 Suite A",
    city: "Rosharon", 
    state: "TX",
    zipCode: "77583",
    country: "US",
    full: "15511 Hwy 6 Suite A, Rosharon, TX 77583"
  },
  
  // Pricing Information
  pricing: {
    basePrice: 649,
    taxNote: "plus tax",
    timeSlots: {
      daytime: {
        hours: "9AM - 4PM",
        price: 649
      },
      evening: {
        hours: "6PM - 12AM", 
        price: 649
      }
    },
    cleaning: {
      fee: 100,
      description: "Cleaning fee"
    }
  },
  
  // Services Available
  services: [
    "Catering coordination",
    "DJ services", 
    "Decoration services",
    "Event planning",
    "Venue setup"
  ],
  
  // Venue Details
  maxCapacity: "200+ Guests",
  totalArea: "2000 sq ft",
  
  // Business Hours
  hours: {
    monday: "9:00 AM - 6:00 PM",
    tuesday: "9:00 AM - 6:00 PM",
    wednesday: "9:00 AM - 6:00 PM", 
    thursday: "9:00 AM - 6:00 PM",
    friday: "9:00 AM - 8:00 PM",
    saturday: "9:00 AM - 10:00 PM",
    sunday: "10:00 AM - 6:00 PM"
  },
  
  // Social Media
  socialMedia: {
    facebook: "https://facebook.com/tvseventcenter",
    instagram: "https://instagram.com/tvseventcenter", 
    twitter: "https://twitter.com/tvseventcenter"
  }
}

// Legacy support - keep the old contactInfo export for backward compatibility
export const contactInfo = {
  phone: companyInfo.contact.phone,
  whatsapp: companyInfo.contact.phone,
  email: companyInfo.contact.email,
  address: companyInfo.address
}