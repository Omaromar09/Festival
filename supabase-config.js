/**
 * Supabase Configuration for Festival Pastry (حلواني فيستيفال)
 * يتم الربط والمزامنة السحابية تلقائياً دون حاجة لإدخال أي مفاتيح من المستخدم.
 */

const DEFAULT_SUPABASE_URL = 'https://dcgwvgliyeogepcqcoqf.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_bhyEopLcAmAxa1FvI2ZYSw_nAJhwrD0';

const SUPABASE_CONFIG = {
  // استرجاع الرابط المعتمد للمشروع
  getUrl: function() {
    return DEFAULT_SUPABASE_URL || localStorage.getItem('festival_supabase_url') || '';
  },

  // استرجاع المفتاح المعتمد للمشروع
  getAnonKey: function() {
    return DEFAULT_SUPABASE_ANON_KEY || localStorage.getItem('festival_supabase_anon_key') || '';
  },

  // فحص ما إذا كان الربط مهيئاً
  isConfigured: function() {
    const url = this.getUrl().trim();
    const key = this.getAnonKey().trim();
    return Boolean(url && key && url.startsWith('http') && key.length > 20);
  },

  // حفظ الإعدادات يدوياً إذا لزم مستقبلاً
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
