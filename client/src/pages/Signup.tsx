
import React, { useState, useEffect, useRef } from 'react';
import { register, googleLogin } from '../services/storage';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Flower2, MapPin, Star } from 'lucide-react';
import { UserRole } from '../types';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', city: 'Kanchipuram', area: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser } = useAuth();
  const { notify } = useNotification();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initGoogle = () => {
      if ((window as any).google && googleBtnRef.current) {
        // SECURITY: Google client ID loaded from environment variable (not hardcoded)
        const googleClientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '';
        (window as any).google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleResponse,
        });
        (window as any).google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline', size: 'large', width: '100%', text: 'signup_with',
        });
      }
    };
    initGoogle();
    const timer = setTimeout(initGoogle, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleGoogleResponse = async (response: any) => {
    try {
      const data = await googleLogin(response.credential);
      if (data && data.user) {
        loginUser(data);
        notify(t('வரவேற்கிறோம், {{name}}!', 'Welcome, {{name}}!', { name: data.user.name }), 'success');
        if (data.user.role === UserRole.ADMIN) navigate('/admin');
        else navigate('/');
      }
    } catch (err: any) {
      notify(err.message || t('Google பதிவு தோல்வியடைந்தது', 'Google sign-up failed'), 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.city !== 'Kanchipuram') {
      notify(t('சேவை தற்போது காஞ்சிபுரத்தில் மட்டுமே உள்ளது.', 'Service is currently available in Kanchipuram only.'), 'error');
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      notify(t('மொபைல் எண் 10 இலக்கமாக இருக்க வேண்டும்.', 'Phone number must be exactly 10 digits.'), 'error');
      return;
    }

    try {
      const response = await register(formData);
      loginUser(response);
      notify(t('கணக்கு உருவாக்கப்பட்டது! வரவேற்கிறோம், {{name}}.', 'Account created! Welcome, {{name}}.', { name: formData.name }), 'success');
      navigate('/');
    } catch (err: any) {
      notify(err.message || t('பதிவு தோல்வியுற்றது', 'Registration failed'), 'error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-9rem)] flex">
      <SEO
        title={t('பதிவு | VKM Flowers - காஞ்சிபுரம்', 'Sign Up | VKM Flowers - Kanchipuram')}
        description={t('புதிய மலர்களை ஆர்டர் செய்ய, டெலிவரியை மேலாண்மை செய்ய, தனிப்பயன் அலங்காரங்களை கோர VKM கணக்கை உருவாக்கவும்.', 'Create your VKM Flowers account in Kanchipuram to order fresh bouquets, manage deliveries, and request custom floral designs.')}
        path="/signup"
      />
      {/* Left Panel — Blue Theme */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-16 right-8 w-56 h-56 bg-blue-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-16 left-8 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
        </div>
        <Link to="/" className="relative z-10 flex items-center gap-2.5">
          <div className="bg-white/20 backdrop-blur p-2.5 rounded-xl border border-white/30">
            <Flower2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-white font-black text-xl tracking-tight">VKM Flowers</span>
        </Link>
        <div className="relative z-10 py-8">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-blue-100 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <Star className="h-3.5 w-3.5" /> {t('VKM Flowers-இல் சேருங்கள்', 'Join VKM Flowers')}
          </div>
          <h2 className="text-4xl font-black text-white leading-tight mb-3">
            {t('உங்கள் இலவச கணக்கை', 'Create your')}<br /><span className="text-blue-200">{t('உருவாக்குங்கள்', 'free account')}</span>
          </h2>
          <p className="text-blue-100 font-medium leading-relaxed mb-8">
            {t('எங்கள் வளர்ந்து வரும் குடும்பத்தில் இணைந்து காஞ்சிபுரத்தில் சிறந்த மலர் அலங்காரங்களை அறியுங்கள்.', 'Join our growing family and discover the finest floral arrangements in Kanchipuram.')}
          </p>
          <div className="bg-white/10 rounded-2xl p-5 border border-white/20 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="h-5 w-5 text-blue-200 flex-shrink-0" />
              <span className="text-white font-bold text-sm">{t('காஞ்சிபுரத்திற்கு மட்டும்', 'Exclusively for Kanchipuram')}</span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              {t('காஞ்சிபுரம் முழுவதும் எங்கள் புதிய மலர்களை டெலிவரி செய்கிறோம். ஆர்டர் செய்யவும், டெலிவரியைப் பார்க்கவும் பதிவு செய்யுங்கள்.', 'We deliver our freshest creations throughout Kanchipuram city. Sign up to place orders and track deliveries.')}
            </p>
          </div>
        </div>
        <div className="relative z-10 text-blue-300 text-xs font-medium">
          &copy; {new Date().getFullYear()} {t('VKM மலர் கடை, காஞ்சிபுரம்', 'VKM Flower Shop, Kanchipuram')}
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md py-6">
            <div className="mb-6">
              <div className="lg:hidden flex items-center gap-2 mb-6">
                <div className="bg-blue-600 p-2 rounded-xl">
                  <Flower2 className="h-5 w-5 text-white" />
                </div>
                <span className="font-black text-gray-900">VKM Flowers</span>
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-1">{t('கணக்கை உருவாக்கவும்', 'Create account')}</h2>
              <p className="text-gray-500 font-medium">{t('தொடங்க உங்கள் விவரங்களை நிரப்பவும்', 'Fill in your details to get started')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-2">{t('முழு பெயர்', 'Full Name')}</label>
                <input type="text" required className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 font-medium text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all" placeholder={t('உங்கள் முழு பெயர்', 'Your full name')} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-2">{t('மின்னஞ்சல்', 'Email')}</label>
                <input type="email" required className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 font-medium text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all" placeholder={t('you@example.com', 'you@example.com')} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-2">{t('கடவுச்சொல்', 'Password')}</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 pr-12 font-medium text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all"
                    placeholder={t('வலுவான கடவுச்சொல் உருவாக்கவும்', 'Create a strong password')}
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-2">{t('தொலைபேசி எண் (10 இலக்கங்கள்)', 'Phone Number (10 digits)')}</label>
                <input
                  type="tel"
                  pattern="[0-9]{10}"
                  minLength={10}
                  maxLength={10}
                  required
                  className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 font-medium text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all"
                  placeholder={t('10 இலக்க மொபைல் எண்', '10-digit mobile number')}
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-2">{t('நகரம்', 'City')}</label>
                  <input type="text" value="Kanchipuram" disabled className="w-full bg-gray-100 border-2 border-gray-200 rounded-2xl p-4 font-medium text-gray-400 cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-2">{t('பகுதி', 'Area')}</label>
                  <input type="text" placeholder={t('உங்கள் பகுதி', 'Your area')} required className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 font-medium text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:from-blue-600 hover:to-indigo-700 hover:-translate-y-0.5 transition-all active:scale-[0.98] text-sm mt-1">
                {t('இலவச கணக்கை உருவாக்கவும்', 'Create Free Account')}
              </button>
            </form>

            <div className="flex items-center my-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">{t('அல்லது', 'or')}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div ref={googleBtnRef} className="flex justify-center" />

            <div className="text-center mt-5">
              <span className="text-gray-500 text-sm font-medium">{t('ஏற்கனவே கணக்குண்டா?', 'Already have an account?')} </span>
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold text-sm underline decoration-2 underline-offset-4 transition-colors">{t('உள்நுழை', 'Log in')}</Link>
            </div>
        </div>
      </div>
    </div>
  );
};
