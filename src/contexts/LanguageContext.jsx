
import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

// Translation data for all supported languages
const translations = {
  en: {
    // Home Page
    appTitle: "QuickFix",
    appSubtitle: "Home services, simplified",
    selectLanguage: "Select your language",
    chooseRole: "Choose your role",
    customer: "I'm a Customer",
    worker: "I'm a Worker",
    exploreGuest: "Explore as Guest",
    customerDesc: "Book services for your home or work",
    workerDesc: "Offer your skills and earn money",
    getStarted: "Get Started",
    
    // Common
    back: "Back",
    next: "Next",
    skip: "Skip",
    accept: "Accept",
    reject: "Reject",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    confirm: "Confirm",
    
    // Navigation
    dashboard: "Dashboard",
    profile: "Profile",
    wallet: "Wallet",
    services: "Services",
    reviews: "Reviews",
    settings: "Settings",
    logout: "Sign Out",
    
    // Wallet
    quickfixCoins: "QuickFix Coins",
    availableBalance: "Available Balance",
    transactionHistory: "Transaction History",
    referralEarnings: "Referral Earnings",
    exchangeRate: "Exchange Rate: 10 coins = ₹1 (service charges only)",
    
    // Worker Portal
    availableForWork: "Available for work",
    jobRequest: "New Job Request",
    acceptJob: "Accept Job",
    rejectJob: "Reject Job",
    respondWithin: "Respond within",
    minute: "minute",
    
    // Error Messages
    invalidPhone: "Please enter a valid phone number",
    otpFailed: "Failed to verify OTP",
    locationError: "Unable to get your location"
  },
  
  ta: {
    // Tamil translations
    appTitle: "குயிக்ஃபிக்ஸ்",
    appSubtitle: "வீட்டு சேவைகள், எளிமையாக்கப்பட்டது",
    selectLanguage: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    chooseRole: "உங்கள் பாத்திரத்தைத் தேர்ந்தெடுக்கவும்",
    customer: "நான் ஒரு வாடிக்கையாளர்",
    worker: "நான் ஒரு தொழிலாளி",
    exploreGuest: "விருந்தினராக ஆராயுங்கள்",
    customerDesc: "உங்கள் வீடு அல்லது வேலைக்கான சேவைகளை முன்பதிவு செய்யுங்கள்",
    workerDesc: "உங்கள் திறமைகளை வழங்கி பணம் சம்பாதியுங்கள்",
    getStarted: "தொடங்குங்கள்",
    
    back: "பின்",
    next: "அடுத்து",
    skip: "தவிர்",
    accept: "ஏற்று",
    reject: "நிராகரி",
    submit: "சமர்ப்பி",
    cancel: "ரத்து",
    
    dashboard: "டாஷ்போர்டு",
    profile: "சுயவிவரம்",
    wallet: "பணப்பை",
    services: "சேவைகள்",
    reviews: "மதிப்புரைகள்",
    settings: "அமைப்புகள்",
    logout: "வெளியேறு",
    
    quickfixCoins: "குயிக்ஃபிக்ஸ் நாணயங்கள்",
    availableBalance: "கிடைக்கும் இருப்பு",
    transactionHistory: "பரிவர்த்தனை வரலாறு",
    referralEarnings: "பரிந்துரை வருமானம்",
    exchangeRate: "மாற்று விகிதம்: 10 நாணயங்கள் = ₹1 (சேவை கட்டணங்கள் மட்டும்)",
    
    availableForWork: "வேலைக்கு கிடைக்கும்",
    jobRequest: "புதிய வேலை கோரிக்கை",
    acceptJob: "வேலையை ஏற்று",
    rejectJob: "வேலையை நிராகரி",
    respondWithin: "பதிலளிக்கவும்",
    minute: "நிமிடம்"
  },
  
  hi: {
    // Hindi translations
    appTitle: "क्विकफिक्स",
    appSubtitle: "घरेलू सेवाएं, सरल",
    selectLanguage: "अपनी भाषा चुनें",
    chooseRole: "अपनी भूमिका चुनें",
    customer: "मैं एक ग्राहक हूं",
    worker: "मैं एक कार्यकर्ता हूं",
    exploreGuest: "अतिथि के रूप में एक्सप्लोर करें",
    customerDesc: "अपने घर या काम के लिए सेवाएं बुक करें",
    workerDesc: "अपने कौशल की पेशकश करें और पैसे कमाएं",
    getStarted: "शुरू करें",
    
    back: "वापस",
    next: "अगला",
    skip: "छोड़ें",
    accept: "स्वीकार करें",
    reject: "अस्वीकार करें",
    submit: "जमा करें",
    cancel: "रद्द करें",
    
    dashboard: "डैशबोर्ड",
    profile: "प्रोफाइल",
    wallet: "वॉलेट",
    services: "सेवाएं",
    reviews: "समीक्षाएं",
    settings: "सेटिंग्स",
    logout: "साइन आउट",
    
    quickfixCoins: "क्विकफिक्स कॉइन्स",
    availableBalance: "उपलब्ध शेष",
    transactionHistory: "लेनदेन इतिहास",
    referralEarnings: "रेफरल कमाई",
    exchangeRate: "विनिमय दर: 10 कॉइन = ₹1 (केवल सेवा शुल्क)",
    
    availableForWork: "काम के लिए उपलब्ध",
    jobRequest: "नई जॉब रिक्वेस्ट",
    acceptJob: "जॉब स्वीकार करें",
    rejectJob: "जॉब अस्वीकार करें",
    respondWithin: "के भीतर जवाब दें",
    minute: "मिनट"
  },
  
  te: {
    // Telugu translations
    appTitle: "క్విక్‌ఫిక్స్",
    appSubtitle: "ఇంటి సేవలు, సరళీకృతం",
    selectLanguage: "మీ భాషను ఎంచుకోండి",
    chooseRole: "మీ పాత్రను ఎంచుకోండి",
    customer: "నేను ఒక కస్టమర్‌ని",
    worker: "నేను ఒక వర్కర్‌ని",
    exploreGuest: "అతిథిగా అన్వేషించండి",
    customerDesc: "మీ ఇల్లు లేదా పని కోసం సేవలను బుక్ చేయండి",
    workerDesc: "మీ నైపుణ్యాలను అందించి డబ్బు సంపాదించండి",
    getStarted: "ప్రారంభించండి",
    
    back: "వెనుక",
    next: "తరువాత",
    skip: "దాటవేయండి",
    accept: "అంగీకరించండి",
    reject: "తిరస్కరించండి",
    submit: "సమర్పించండి",
    cancel: "రద్దు చేయండి",
    
    dashboard: "డాష్‌బోర్డ్",
    profile: "ప్రొఫైల్",
    wallet: "వాలెట్",
    services: "సేవలు",
    reviews: "సమీక్షలు",
    settings: "సెట్టింగ్‌లు",
    logout: "సైన్ అవుట్",
    
    quickfixCoins: "క్విక్‌ఫిక్స్ కాయిన్‌లు",
    availableBalance: "అందుబాటులో ఉన్న బ్యాలెన్స్",
    transactionHistory: "లావాదేవీ చరిత్ర",
    referralEarnings: "రెఫరల్ ఆదాయాలు",
    exchangeRate: "మార్చుకునే రేటు: 10 కాయిన్‌లు = ₹1 (సేవా రుసుము మాత్రమే)",
    
    availableForWork: "పనికి అందుబాటులో",
    jobRequest: "కొత్త జాబ్ రిక్వెస్ట్",
    acceptJob: "జాబ్ అంగీకరించండి",
    rejectJob: "జాబ్ తిరస్కరించండి",
    respondWithin: "లోపల స్పందించండి",
    minute: "నిమిషం"
  },
  
  ml: {
    // Malayalam translations
    appTitle: "ക്വിക്ക്ഫിക്സ്",
    appSubtitle: "ഗൃഹസേവനങ്ങൾ, ലളിതമാക്കിയത്",
    selectLanguage: "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക",
    chooseRole: "നിങ്ങളുടെ റോൾ തിരഞ്ഞെടുക്കുക",
    customer: "ഞാൻ ഒരു കസ്റ്റമറാണ്",
    worker: "ഞാൻ ഒരു വർക്കറാണ്",
    exploreGuest: "അതിഥിയായി പര്യവേക്ഷണം ചെയ്യുക",
    customerDesc: "നിങ്ങളുടെ വീട്ടിലോ ജോലിസ്ഥലത്തോ സേവനങ്ങൾ ബുക്ക് ചെയ്യുക",
    workerDesc: "നിങ്ങളുടെ കഴിവുകൾ വാഗ്ദാനം ചെയ്ത് പണം സമ്പാദിക്കുക",
    getStarted: "ആരംഭിക്കുക",
    
    back: "പിന്നോട്ട്",
    next: "അടുത്തത്",
    skip: "ഒഴിവാക്കുക",
    accept: "സ്വീകരിക്കുക",
    reject: "നിരസിക്കുക",
    submit: "സമർപ്പിക്കുക",
    cancel: "റദ്ദാക്കുക",
    
    dashboard: "ഡാഷ്ബോർഡ്",
    profile: "പ്രൊഫൈൽ",
    wallet: "വാലറ്റ്",
    services: "സേവനങ്ങൾ",
    reviews: "അവലോകനങ്ങൾ",
    settings: "ക്രമീകരണങ്ങൾ",
    logout: "സൈൻ ഔട്ട്",
    
    quickfixCoins: "ക്വിക്ക്ഫിക്സ് കോയിനുകൾ",
    availableBalance: "ലഭ്യമായ ബാലൻസ്",
    transactionHistory: "ഇടപാട് ചരിത്രം",
    referralEarnings: "റഫറൽ വരുമാനം",
    exchangeRate: "വിനിമയ നിരക്ക്: 10 കോയിനുകൾ = ₹1 (സേവന ഫീസ് മാത്രം)",
    
    availableForWork: "ജോലിക്ക് ലഭ്യം",
    jobRequest: "പുതിയ ജോലി അഭ്യർത്ഥന",
    acceptJob: "ജോലി സ്വീകരിക്കുക",
    rejectJob: "ജോലി നിരസിക്കുക",
    respondWithin: "അകത്ത് പ്രതികരിക്കുക",
    minute: "മിനിറ്റ്"
  },
  
  kn: {
    // Kannada translations
    appTitle: "ಕ್ವಿಕ್‌ಫಿಕ್ಸ್",
    appSubtitle: "ಮನೆಯ ಸೇವೆಗಳು, ಸರಳೀಕೃತ",
    selectLanguage: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    chooseRole: "ನಿಮ್ಮ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    customer: "ನಾನು ಗ್ರಾಹಕ",
    worker: "ನಾನು ಕೆಲಸಗಾರ",
    exploreGuest: "ಅತಿಥಿಯಾಗಿ ಅನ್ವೇಷಿಸಿ",
    customerDesc: "ನಿಮ್ಮ ಮನೆ ಅಥವಾ ಕೆಲಸಕ್ಕಾಗಿ ಸೇವೆಗಳನ್ನು ಬುಕ್ ಮಾಡಿ",
    workerDesc: "ನಿಮ್ಮ ಕೌಶಲ್ಯಗಳನ್ನು ನೀಡಿ ಮತ್ತು ಹಣ ಗಳಿಸಿ",
    getStarted: "ಪ್ರಾರಂಭಿಸಿ",
    
    back: "ಹಿಂದೆ",
    next: "ಮುಂದೆ",
    skip: "ಬಿಟ್ಟುಬಿಡಿ",
    accept: "ಸ್ವೀಕರಿಸಿ",
    reject: "ತಿರಸ್ಕರಿಸಿ",
    submit: "ಸಲ್ಲಿಸಿ",
    cancel: "ರದ್ದುಮಾಡಿ",
    
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    profile: "ಪ್ರೊಫೈಲ್",
    wallet: "ವಾಲೆಟ್",
    services: "ಸೇವೆಗಳು",
    reviews: "ವಿಮರ್ಶೆಗಳು",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    logout: "ಸೈನ್ ಔಟ್",
    
    quickfixCoins: "ಕ್ವಿಕ್‌ಫಿಕ್ಸ್ ನಾಣ್ಯಗಳು",
    availableBalance: "ಲಭ್ಯವಿರುವ ಬ್ಯಾಲೆನ್ಸ್",
    transactionHistory: "ವಹಿವಾಟು ಇತಿಹಾಸ",
    referralEarnings: "ರೆಫರಲ್ ಆದಾಯ",
    exchangeRate: "ವಿನಿಮಯ ದರ: 10 ನಾಣ್ಯಗಳು = ₹1 (ಸೇವಾ ಶುಲ್ಕ ಮಾತ್ರ)",
    
    availableForWork: "ಕೆಲಸಕ್ಕೆ ಲಭ್ಯ",
    jobRequest: "ಹೊಸ ಕೆಲಸದ ವಿನಂತಿ",
    acceptJob: "ಕೆಲಸವನ್ನು ಸ್ವೀಕರಿಸಿ",
    rejectJob: "ಕೆಲಸವನ್ನು ತಿರಸ್ಕರಿಸಿ",
    respondWithin: "ಒಳಗೆ ಪ್ರತಿಕ್ರಿಯಿಸಿ",
    minute: "ನಿಮಿಷ"
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  
  // Load saved language on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('quickfix-language');
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);
  
  const changeLanguage = (languageCode) => {
    if (translations[languageCode]) {
      setLoading(true);
      setCurrentLanguage(languageCode);
      localStorage.setItem('quickfix-language', languageCode);
      
      // Simulate loading time for language switch
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };
  
  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations['en'][key] || key;
  };
  
  const value = {
    currentLanguage,
    changeLanguage,
    t,
    loading,
    availableLanguages: [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
      { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
      { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
      { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' }
    ]
  };
  
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
