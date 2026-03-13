import React, { createContext, useContext, useState, useCallback } from 'react';

type Language = 'ta' | 'en';

const translations = {
  ta: {
    // Promo bar
    promo_bar: '🌸 ₹499க்கு மேல் இலவச டெலிவரி \u00a0|\u00a0 கஞ்சிபுரம் மட்டும் \u00a0|\u00a0 தினமும் புதிய மலர்கள்',

    // Nav
    nav_shop: 'கடை',
    nav_custom_order: 'சிறப்பு ஆர்டர்',
    nav_my_orders: 'என் ஆர்டர்கள்',
    nav_dashboard: 'டாஷ்போர்டு',
    nav_login: 'உள்நுழைய',
    nav_signup: 'இலவசமாக பதிவு',
    nav_logout: 'வெளியேறு',
    nav_admin_dashboard: 'நிர்வாக டாஷ்போர்டு',
    mob_shop: '🌸 மலர் கடை',
    mob_custom_order: '✨ சிறப்பு ஆர்டர்',
    mob_my_orders: '📦 என் ஆர்டர்கள்',
    mob_hello: 'வணக்கம்',

    // Footer
    footer_tagline: 'கஞ்சிபுரத்தின் சிறந்த மலர் சேவை',
    footer_rights: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    footer_love: 'அன்புடன் செய்யப்பட்டது',

    // Home hero
    hero_badge: "கஞ்சிபுரத்தின் #1 மலர் கடை",
    hero_title: 'புதிய மலர்கள்,',
    hero_title2: 'இன்றே டெலிவரி',
    hero_subtitle: 'ஒவ்வொரு தருணத்திற்கும் தேர்ந்தெடுக்கப்பட்ட மலர்கள். எங்கள் புதிய சேகரிப்பை பாருங்கள்.',
    hero_shop_now: 'இப்போதே வாங்கு',
    hero_create_account: 'கணக்கு உருவாக்கு',
    hero_fast_delivery: 'விரைவான டெலிவரி',
    hero_fresh: 'புதுமை உறுதி',
    hero_quality: 'சிறந்த தரம்',

    // Home products
    section_our_collection: 'எங்கள் சேகரிப்பு',
    section_browse_flowers: 'மலர்களை பார்க்க',
    search_placeholder: 'ஏற்பாடுகளை தேடுங்கள்...',
    loading_collection: 'சேகரிப்பு ஏற்றுகிறது...',
    arrangements_available: 'ஏற்பாடுகள் கிடைக்கின்றன',
    arrangement_available: 'ஏற்பாடு கிடைக்கிறது',
    ready_in: '{n} மணி நேரத்தில் தயார்',
    no_arrangements: 'ஏற்பாடுகள் கிடைக்கவில்லை',
    no_arrangements_sub: 'உங்கள் தேடலை மாற்றி பாருங்கள்',

    // Order modal
    order_quantity: 'அளவு',
    order_note: 'சிறப்பு குறிப்பு (விருப்பம்)',
    order_note_placeholder: 'சிறப்பு வழிமுறைகள் ஏதாவது?',
    place_order: 'ஆர்டர் செய்',

    // History
    history_title: 'உங்கள் செயல்பாடு',
    history_subtitle: 'உங்கள் ஆர்டர்களை கண்காணிக்கவும்',
    product_orders: 'பொருள் ஆர்டர்கள்',
    custom_requests: 'சிறப்பு கோரிக்கைகள்',
    no_orders: 'இன்னும் ஆர்டர்கள் இல்லை.',
    no_custom: 'சிறப்பு கோரிக்கைகள் இல்லை.',
    store_support: 'கடை ஆதரவு',
    required_by: 'தேவை:',
    order_label: 'ஆர்டர் #',
    qty_label: 'அளவு:',
    ordered_label: 'ஆர்டர் செய்த நாள்:',
    request_label: 'கோரிக்கை #',

    // Custom Order
    custom_title: 'சிறப்பு உருவாக்கம்',
    custom_subtitle: 'உங்கள் கனவை பகிருங்கள், நாங்கள் மலர்களை கொண்டு வருவோம்',
    ref_photos: 'குறிப்பு புகைப்படங்கள் (அவசியம்)',
    upload_click: 'பதிவேற்ற கிளிக் செய்யுங்கள்',
    upload_photos: 'குறிப்பு புகைப்படங்கள்',
    photo_format: 'PNG, JPG 10MB வரை',
    required_date: 'தேவையான தேதி',
    preferred_time: 'விரும்பிய நேரம்',
    recipient_name: 'பெறுநர் பெயர்',
    recipient_placeholder: 'இது யாருக்காக?',
    contact_phone: 'தொடர்பு எண்',
    phone_placeholder: '10 இலக்க மொபைல் எண்',
    describe_request: 'உங்கள் கோரிக்கையை விவரிக்கவும்',
    describe_placeholder: 'நிறங்கள், மலர் வகைகள், விழா மற்றும் சிறப்பு தேவைகள் பற்றி கூறுங்கள்...',
    submit_order: 'சிறப்பு ஆர்டர் சமர்ப்பி',
    submitting: 'சமர்ப்பிக்கிறது...',
    call_confirm: '2 மணிநேரத்திற்குள் உங்களை தொடர்பு கொள்வோம்',

    // Login
    login_title: 'உள்நுழைக',
    login_subtitle: 'தொடர உங்கள் தகவல்களை உள்ளிடுங்கள்',
    login_email: 'மின்னஞ்சல் முகவரி',
    login_email_ph: 'you@example.com',
    login_password: 'கடவுச்சொல்',
    login_btn: 'உள்நுழைய',
    login_no_account: 'கணக்கு இல்லையா?',
    login_create: 'இலவசமாக உருவாக்கு',
    login_secure: 'VKM மலர் கடை அமைப்பால் பாதுகாக்கப்பட்டது',

    // Signup
    signup_title: 'கணக்கு உருவாக்கு',
    signup_subtitle: 'தொடங்க உங்கள் விவரங்களை நிரப்புங்கள்',
    signup_name: 'முழு பெயர்',
    signup_name_ph: 'உங்கள் முழு பெயர்',
    signup_email: 'மின்னஞ்சல்',
    signup_password: 'கடவுச்சொல்',
    signup_password_ph: 'வலுவான கடவுச்சொல் உருவாக்கவும்',
    signup_phone: 'தொலைபேசி எண் (10 இலக்கம்)',
    signup_city: 'நகரம்',
    signup_area: 'பகுதி',
    signup_area_ph: 'உங்கள் பகுதி',
    signup_btn: 'இலவச கணக்கு உருவாக்கு',
    signup_have_account: 'ஏற்கனவே கணக்கு இருக்கிறதா?',
    signup_login: 'உள்நுழைய',

    // Admin
    admin_hub: 'நிர்வாக மையம்',
    admin_subtitle: 'VKM மலர்கள் — செயல்பாட்டு கட்டுப்பாடு',
    admin_whatsapp: 'வாட்ஸ்அப் எண்',
    admin_whatsapp_ph: '10 இலக்கம்',
    admin_catalog: 'பட்டியல்',
    admin_orders: 'ஆர்டர்கள்',
    admin_custom: 'சிறப்பு',
    admin_add_item: 'புதிய பொருள் சேர்',
    admin_new_product: 'புதிய பொருள்',
    admin_update_product: 'பொருளை புதுப்பி',
    admin_product_name: 'பொருளின் பெயர்',
    admin_price: 'விலை (₹)',
    admin_prep_hours: 'தயாரிப்பு நேரம்',
    admin_gallery: 'படங்கள்',
    admin_description: 'விவரம்',
    admin_cancel: 'ரத்து',
    admin_save: 'சேமி',
    admin_update: 'புதுப்பி',
    admin_saving: 'சேமிக்கிறது...',
    admin_accept: 'ஏற்கு',
    admin_decline: 'நிராகரி',
    admin_complete: 'முடிந்தது',
    admin_no_products: 'இன்னும் பட்டியலில் பொருட்கள் இல்லை.',
    admin_inbound: 'புதிய ஆர்டர்கள்',
    admin_priority: 'முன்னுரிமை: காலக்கெடு',
    admin_history: 'வரலாறு',
    admin_no_orders: 'ஆர்டர்கள் இல்லை.',
    admin_no_custom: 'சிறப்பு ஆர்டர்கள் இல்லை.',
    admin_save_whatsapp: 'வாட்ஸ்அப் சேமி',
    admin_edit: 'திருத்து',
    admin_delete: 'நீக்கு',
    admin_bill_id: 'பில் ID',
    admin_customer: 'வாடிக்கையாளர்',
    admin_product: 'பொருள்',
    admin_amount: 'தொகை',
    admin_status: 'நிலை',
    admin_deadline: 'காலக்கெடு',
    admin_contact: 'தொடர்பு',
    admin_photos: 'படங்கள்',
    admin_request: 'கோரிக்கை',
    admin_description_opt: 'விவரம் (விருப்பம்)',
    admin_pending: 'நிலுவையில்',
    admin_today_orders: 'இன்றைய ஆர்டர்கள்',
  },
  en: {
    // Promo bar
    promo_bar: '🌸 Free Delivery on orders above ₹499 \u00a0|\u00a0 Kanchipuram Exclusive \u00a0|\u00a0 Fresh blooms, every day',

    // Nav
    nav_shop: 'Shop',
    nav_custom_order: 'Custom Order',
    nav_my_orders: 'My Orders',
    nav_dashboard: 'Dashboard',
    nav_login: 'Login',
    nav_signup: 'Sign Up Free',
    nav_logout: 'Logout',
    nav_admin_dashboard: 'Admin Dashboard',
    mob_shop: '🌸 Shop Flowers',
    mob_custom_order: '✨ Custom Order',
    mob_my_orders: '📦 My Orders',
    mob_hello: 'Hello',

    // Footer
    footer_tagline: "Kanchipuram's Premier Floral Service",
    footer_rights: 'All rights reserved.',
    footer_love: 'Made with Love',

    // Home hero
    hero_badge: "Kanchipuram's #1 Flower Shop",
    hero_title: 'Fresh Flowers,',
    hero_title2: 'Delivered Today',
    hero_subtitle: 'Handpicked blooms for every occasion. Browse our fresh collection and order with ease.',
    hero_shop_now: 'Shop Now',
    hero_create_account: 'Create Account',
    hero_fast_delivery: 'Fast Delivery',
    hero_fresh: 'Fresh Guaranteed',
    hero_quality: 'Premium Quality',

    // Home products
    section_our_collection: 'Our Collection',
    section_browse_flowers: 'Browse Flowers',
    search_placeholder: 'Search arrangements...',
    loading_collection: 'Loading Collection...',
    arrangements_available: 'arrangements available',
    arrangement_available: 'arrangement available',
    ready_in: 'Ready in {n} hours',
    no_arrangements: 'No Arrangements Found',
    no_arrangements_sub: 'Try adjusting your search',

    // Order modal
    order_quantity: 'Quantity',
    order_note: 'Special Note (optional)',
    order_note_placeholder: 'Any special instructions?',
    place_order: 'Place Order',

    // History
    history_title: 'Your Activity',
    history_subtitle: 'Track your orders & requests',
    product_orders: 'Product Orders',
    custom_requests: 'Custom Requests',
    no_orders: "You haven't placed any orders yet.",
    no_custom: 'No custom requests found.',
    store_support: 'Store Support',
    required_by: 'Required by:',
    order_label: 'Order #',
    qty_label: 'Qty:',
    ordered_label: 'Ordered:',
    request_label: 'Request #',

    // Custom Order
    custom_title: 'Custom Creations',
    custom_subtitle: 'Share your vision, we bring the flowers',
    ref_photos: 'Reference Photos (Required)',
    upload_click: 'Click to upload',
    upload_photos: 'reference photos',
    photo_format: 'PNG, JPG up to 10MB each',
    required_date: 'Required Date',
    preferred_time: 'Preferred Time',
    recipient_name: 'Recipient Name',
    recipient_placeholder: 'Who is this for?',
    contact_phone: 'Contact Phone',
    phone_placeholder: '10-digit mobile number',
    describe_request: 'Describe Your Request',
    describe_placeholder: 'Tell us about the colors, flower types, occasion, and any specific requirements...',
    submit_order: 'Submit Custom Order',
    submitting: 'Submitting Request...',
    call_confirm: 'We will call you within 2 hours to confirm your order',

    // Login
    login_title: 'Log in',
    login_subtitle: 'Enter your credentials to continue',
    login_email: 'Email Address',
    login_email_ph: 'you@example.com',
    login_password: 'Password',
    login_btn: 'Sign In',
    login_no_account: "Don't have an account?",
    login_create: 'Create one free',
    login_secure: 'Securely managed by VKM Flower Shop Systems',

    // Signup
    signup_title: 'Create account',
    signup_subtitle: 'Fill in your details to get started',
    signup_name: 'Full Name',
    signup_name_ph: 'Your full name',
    signup_email: 'Email',
    signup_password: 'Password',
    signup_password_ph: 'Create a strong password',
    signup_phone: 'Phone Number (10 digits)',
    signup_city: 'City',
    signup_area: 'Area',
    signup_area_ph: 'Your area',
    signup_btn: 'Create Free Account',
    signup_have_account: 'Already have an account?',
    signup_login: 'Log in',

    // Admin
    admin_hub: 'Management Hub',
    admin_subtitle: 'VKM Flowers — Operational Control',
    admin_whatsapp: 'WhatsApp Number',
    admin_whatsapp_ph: '10 Digits',
    admin_catalog: 'Catalog',
    admin_orders: 'Orders',
    admin_custom: 'Custom',
    admin_add_item: 'Add New Item',
    admin_new_product: 'New Product',
    admin_update_product: 'Update Product',
    admin_product_name: 'Product Name',
    admin_price: 'Price (₹)',
    admin_prep_hours: 'Prep Hours',
    admin_gallery: 'Gallery Photos',
    admin_description: 'Description',
    admin_cancel: 'Cancel',
    admin_save: 'Save Item',
    admin_update: 'Update Item',
    admin_saving: 'Saving...',
    admin_accept: 'Accept',
    admin_decline: 'Decline',
    admin_complete: 'Mark Completed',
    admin_no_products: 'No products in catalog yet.',
    admin_inbound: 'Inbound',
    admin_priority: 'Priority: Deadline',
    admin_history: 'History',
    admin_no_orders: 'No orders yet.',
    admin_no_custom: 'No custom orders yet.',
    admin_save_whatsapp: 'Save WhatsApp',
    admin_edit: 'Edit',
    admin_delete: 'Delete',
    admin_bill_id: 'Bill ID',
    admin_customer: 'Customer',
    admin_product: 'Product',
    admin_amount: 'Amount',
    admin_status: 'Status',
    admin_deadline: 'Deadline',
    admin_contact: 'Contact',
    admin_photos: 'Photos',
    admin_request: 'Request',
    admin_description_opt: 'Description (optional)',
    admin_pending: 'Pending',
    admin_today_orders: "Today's Orders",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const LanguageContext = React.createContext<LanguageContextType>({
  language: 'ta',
  setLanguage: () => {},
  t: (key) => key as string,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('vkm_lang') as Language) || 'ta';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('vkm_lang', lang);
  }, []);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>): string => {
      const dict = translations[language] as Record<string, string>;
      let text = dict[key as string] ?? (translations.en as Record<string, string>)[key as string] ?? (key as string);
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          text = text.replace(`{${k}}`, String(v));
        });
      }
      return text;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
