/**
 * Supabase Configuration for Festival Pastry (حلواني فيستيفال)
 * 
 * يمكنك ضبط مفاتيح Supabase هنا مباشرة، أو إدخالها من واجهة لوحة التحكم (admin.html)
 * وسيتم حفظها تلقائياً واستخدامها في الموقع والمتجر.
 */

const DEFAULT_SUPABASE_URL = '';
const DEFAULT_SUPABASE_ANON_KEY = '';

const SUPABASE_CONFIG = {
  // استرجاع الرابط من التخزين المحلي أو القيمة الافتراضية
  getUrl: function() {
    return localStorage.getItem('festival_supabase_url') || DEFAULT_SUPABASE_URL || '';
  },

  // استرجاع المفتاح العام من التخزين المحلي أو القيمة الافتراضية
  getAnonKey: function() {
    return localStorage.getItem('festival_supabase_anon_key') || DEFAULT_SUPABASE_ANON_KEY || '';
  },

  // فحص ما إذا كان الربط مهيئاً
  isConfigured: function() {
    const url = this.getUrl().trim();
    const key = this.getAnonKey().trim();
    return Boolean(url && key && url.startsWith('http') && key.length > 20);
  },

  // حفظ الإعدادات
  saveCredentials: function(url, anonKey) {
    if (url) localStorage.setItem('festival_supabase_url', url.trim());
    if (anonKey) localStorage.setItem('festival_supabase_anon_key', anonKey.trim());
    return true;
  },

  // مسح الإعدادات
  clearCredentials: function() {
    localStorage.removeItem('festival_supabase_url');
    localStorage.removeItem('festival_supabase_anon_key');
  }
};

if (typeof window !== 'undefined') {
  window.SUPABASE_CONFIG = SUPABASE_CONFIG;
}
