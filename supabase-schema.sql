-- =====================================================================
-- حلواني فيستيفال | Festival Pastry - سكربت قاعدة بيانات Supabase
-- قم بنسخ هذا الكود بالكامل ولصقه داخل محرر SQL في Supabase (SQL Editor) ثم اضغط Run
-- =====================================================================

-- 1. جدول إعدادات وهوية المتجر (Store Settings & Branding)
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    store_name TEXT NOT NULL DEFAULT 'حلواني فيستيفال',
    store_name_en TEXT DEFAULT 'Festival Pastry',
    slogan TEXT DEFAULT 'أصل الحلو - كل يوم عرض جديد',
    tagline TEXT DEFAULT 'أفخر أنواع الحلويات الشرقية والغربية في قلب الهرم بالسمن البلدي الطبيعي 100%',
    logo_url TEXT DEFAULT './assets/festival-logo.jpg',
    phone TEXT DEFAULT '01093916372',
    whatsapp TEXT DEFAULT '201093916372',
    vodafone_cash TEXT DEFAULT '01093916372',
    address TEXT DEFAULT 'شارع الهرم الرئيسي - فيصل - الجيزة',
    announcement_text TEXT DEFAULT 'أصل الحلو - كل يوم عرض جديد! | خصومات خاصة على التورت والدست والتشكيلات الشرقية',
    announcement_badge TEXT DEFAULT 'عرض اليوم',
    is_announcement_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. جدول المنتجات والمنيو (Products & Menu Items)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    main_category TEXT NOT NULL, -- 'oriental', 'circular_tortes', 'special_tortes', 'gateaux', 'bakery', 'canned'
    sub_category TEXT DEFAULT '',
    price TEXT NOT NULL,
    num_price NUMERIC NOT NULL DEFAULT 0,
    description TEXT DEFAULT '',
    badge TEXT DEFAULT '',
    image_url TEXT NOT NULL,
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. جدول العروض والخصومات (Special Offers & Promotions)
CREATE TABLE IF NOT EXISTS public.offers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    badge TEXT DEFAULT 'عرض خاص',
    description TEXT DEFAULT '',
    old_price TEXT DEFAULT '',
    new_price TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- =====================================================================
-- 4. إعداد الأمان وسياسات الوصول (Row Level Security - RLS)
-- =====================================================================

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- السماح بالقراءة للجميع (Public Read) لزوار المتجر
DROP POLICY IF EXISTS "Public Read Settings" ON public.store_settings;
CREATE POLICY "Public Read Settings" ON public.store_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Products" ON public.products;
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Offers" ON public.offers;
CREATE POLICY "Public Read Offers" ON public.offers FOR SELECT USING (true);

-- السماح بالتعديل والإضافة والحذف (التحكم الكامل عبر المفتاح العام/المسجل للوحة التحكم)
DROP POLICY IF EXISTS "Admin Full Access Settings" ON public.store_settings;
CREATE POLICY "Admin Full Access Settings" ON public.store_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Full Access Products" ON public.products;
CREATE POLICY "Admin Full Access Products" ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Full Access Offers" ON public.offers;
CREATE POLICY "Admin Full Access Offers" ON public.offers FOR ALL USING (true) WITH CHECK (true);

-- =====================================================================
-- 5. إعداد حاوية تخزين الصور في Supabase Storage (اختياري لرفع الصور)
-- =====================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public View Bucket Images" ON storage.objects;
CREATE POLICY "Public View Bucket Images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow All Uploads" ON storage.objects;
CREATE POLICY "Allow All Uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow All Updates" ON storage.objects;
CREATE POLICY "Allow All Updates" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow All Deletes" ON storage.objects;
CREATE POLICY "Allow All Deletes" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');

-- =====================================================================
-- 6. البيانات الأولية الكاملة للمتجر (Default Seed Data)
-- =====================================================================

-- إعدادات المتجر الأولية
INSERT INTO public.store_settings (
    id, store_name, store_name_en, slogan, tagline, logo_url,
    phone, whatsapp, vodafone_cash, address, announcement_text, announcement_badge, is_announcement_active
) VALUES (
    'primary',
    'حلواني فيستيفال',
    'Festival Pastry',
    'أصل الحلو - كل يوم عرض جديد',
    'أفخر أنواع الحلويات الشرقية والغربية في قلب الهرم بالسمن البلدي الطبيعي 100%',
    './assets/festival-logo.jpg',
    '01093916372',
    '201093916372',
    '01093916372',
    'شارع الهرم الرئيسي - فيصل - الجيزة',
    'أصل الحلو - كل يوم عرض جديد! | خصومات خاصة على التورت والدست والتشكيلات الشرقية',
    'عرض اليوم',
    true
)
ON CONFLICT (id) DO UPDATE SET
    store_name = EXCLUDED.store_name,
    slogan = EXCLUDED.slogan;

-- قائمة أصناف المنيو الكاملة (69 صنفاً معتمداً)
INSERT INTO public.products (id, name, main_category, sub_category, price, num_price, description, badge, image_url, is_available, sort_order)
VALUES
-- 1. الحلويات الشرقية (23 صنف)
('o-1', 'مشكل ساده', 'oriental', 'مشكل', '140 ج.م', 140, 'تشكيلة شرقية فاخرة ساده بالسمن البلدي الطبيعي', 'كلاسيك', 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857294/bfda4cc4-6315-4223-85d3-f8dcd74e747e.jpg', true, 1),
('o-2', 'مشكل ساده ومكسرات', 'oriental', 'مشكل', '170 ج.م', 170, 'مزيج رائع من القطع السادة مع تشكيلة مكسرات فاخرة', 'الأكثر مبيعاً', 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857295/d30f4940-fbd3-4da2-bd66-1d2c2ed8a375.jpg', true, 2),
('o-3', 'مشكل مكسرات', 'oriental', 'مشكل', '220 ج.م', 220, 'أفخر تشكيلة حلويات شرقية محشوة ومغطاة بالمكسرات الفاخرة', 'سوبر مكسرات', 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857296/385b94b7-c6bb-4a95-abbf-f6b216c1bfcf.jpg', true, 3),
('o-4', 'بسبوسه سادة', 'oriental', 'بسبوسة', '140 ج.م', 140, 'بسبوسة دايبة ومرملة بالسمن البلدي والشربات المظبوط', 'طازج', 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857297/6fa19756-3ca2-4c8f-94f4-ecb68d1e9657.jpg', true, 4),
('o-5', 'بسبوسة بندق', 'oriental', 'بسبوسة', '200 ج.م', 200, 'بسبوسة مرملة غنية بحبات البندق المحمص الفاخر', 'مميز', 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857299/abcdf322-1073-4fa6-95d2-6993d9681bda.jpg', true, 5),
('o-6', 'بسبوسة نوتيلا', 'oriental', 'بسبوسة', '180 ج.م', 180, 'بسبوسة فيستيفال مع شلال نوتيلا أصلي غني', 'عشاق الشوكولاتة', 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857301/4cf881b6-c40a-4f50-be19-d3ffadec4d91.jpg', true, 6),
('o-7', 'كنافة سادة', 'oriental', 'كنافة', '150 ج.م', 150, 'كنافة ذهبية مقرمشة بالسمن البلدي الفاخر', '', 'https://talabat.dhmedia.io/image/talabat/MenuItems/كنافة_سادة638928528828605796.jpg', true, 7),
('o-8', 'كنافة كريمة', 'oriental', 'كنافة', '130 ج.م', 130, 'كنافة طرية بحشوة القشطة والكريمة الغنية', 'خفيفة ولذيذة', 'https://talabat.dhmedia.io/image/talabat/MenuItems/كنافة_كريمة638928529001364276.jpg', true, 8),
('o-9', 'كنافة مكسرات', 'oriental', 'كنافة', '220 ج.م', 220, 'كنافة مقرمشة محشوة بأجود أنواع المكسرات المحمصة', 'ملكي', 'https://talabat.dhmedia.io/image/talabat/MenuItems/كنافة_مكسرات638928528914453218.jpg', true, 9),
('o-10', 'كنافة مانجا', 'oriental', 'كنافة', '180 ج.م', 180, 'كنافة مع طبقات الكريمة وقطع المانجو الطبيعية المنعشة', 'منعش', 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857316/92ba10f3-5261-4ba3-95a8-657f35e1c550.jpg', true, 10),
('o-11', 'كيلو رواني', 'oriental', 'أصناف شرقية', '140 ج.م', 140, 'كيكة الرواني الذهبية الهشة المسقية بالشربات الخفيف', '', 'https://talabat.dhmedia.io/image/talabat/MenuItems/رواني638928528922964267.jpg', true, 11),
('o-12', 'رموش الست', 'oriental', 'أصناف شرقية', '170 ج.م', 170, 'رموش الست الدايبة دوبان بالسمن البلدي المحمص', 'دايبة', 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857328/61a80958-9dbd-4b63-87b3-cb230dc31762.jpg', true, 12),
('o-13', 'شكلمة', 'oriental', 'أصناف شرقية', '240 ج.م', 240, 'شكلمة جوز هند طرية وذهبية بأعلى نسبة جوز هند', 'طعم أصيل', 'https://talabat.dhmedia.io/image/talabat/MenuItems/شكلمة638928528999326733.jpg', true, 13),
('o-14', 'مدلعـة', 'oriental', 'أصناف شرقية', '160 ج.م', 160, 'طبقات بسبوسة وكنافة وقشطة وكراميل وشوكولاتة', 'اختراع فيستيفال', 'https://talabat.dhmedia.io/image/talabat/MenuItems/مدلعة638928528936986711.jpg', true, 14),
('o-15', 'زنود سادة', 'oriental', 'أصناف شرقية', '170 ج.م', 170, 'أصابع زنود مقرمشة وخفيفة', '', 'https://talabat.dhmedia.io/image/talabat/MenuItems/زنود_سادة638928528973013684.jpg', true, 15),
('o-16', 'جلاش مكسرات', 'oriental', 'بقلاوة', '240 ج.م', 240, 'رقائق جلاش مورقة مقرمشة بالسمن والمكسرات', 'مورق', 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857334/3cb7af44-3910-4c3b-adac-e289808aca01.jpg', true, 16),
('o-17', 'بقلاوة بأنواعها', 'oriental', 'بقلاوة', '290 ج.م', 290, 'تشكيلة بقلاوة تركي ومصري بأنواعها وحشواتها الفاخرة', 'ملوكي', 'https://images.unsplash.com/photo-1519869325930-281384150729?w=600&auto=format&fit=crop&q=80', true, 17),
('o-18', 'بلح الشام وصوابع زينب', 'oriental', 'أصناف شرقية', '140 ج.م', 140, 'بلح الشام المقرمش الذهبي وصوابع زينب اللذيذة', 'مقرمش', 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857337/ae0e056f-f33c-455d-bcc9-9882ba3cf068.jpg', true, 18),
('o-19', 'نابلسية بالجبنة', 'oriental', 'كنافة', '220 ج.م', 220, 'كنافة نابلسية بالجبنة العكاوي السايحة والمطاطية', 'ساخنة', 'https://talabat.dhmedia.io/image/talabat/MenuItems/نابلسية_بالجبنة638928528960660984.jpg', true, 19),
('o-20', 'هريسة محشية', 'oriental', 'بسبوسة', '190 ج.م', 190, 'هريسة إسكندراني محشية مكسرات بالسمن البلدي', '', 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857299/abcdf322-1073-4fa6-95d2-6993d9681bda.jpg', true, 20),
('o-21', 'كيلو كريمات', 'oriental', 'أصناف شرقية', '120 ج.م', 120, 'حلويات الكريمة الطازجة والغنية بالحليب', 'اقتصادي', 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857341/0af6c3c0-621d-436c-9833-9012c3b913c2.jpg', true, 21),
('o-22', 'لينزا', 'oriental', 'أصناف شرقية', '150 ج.م', 150, 'لينزا فاخرة بجوز الهند وحشوة القشطة والمربى', '', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80', true, 22),
('o-23', 'عزيزية', 'oriental', 'أصناف شرقية', '120 ج.م', 120, 'عزيزية مكرونة بالحليب والقشطة محمرة في الفرن', '', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80', true, 23),

-- 2. التورتات الدائرية وتورت الأشكال (12 صنف)
('tc-1', 'تورتة باندة', 'circular_tortes', 'أشكال', '170 ج.م', 170, 'تورتة باندا بشكل كرتوني محبب للأطفال بطعم كريمة وشوكولاتة لذيذة', 'شكل كرتوني', 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600&auto=format&fit=crop&q=80', true, 24),
('tc-2', 'تورتة مدور مقاس 18', 'circular_tortes', 'دائري', '190 ج.م', 190, 'مقاس مناسب لـ 4 إلى 6 أفراد بتشكيلة فواكه أو شوكولاتة غنية', '', 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&auto=format&fit=crop&q=80', true, 25),
('tc-3', 'تورتة مدور مقاس 20', 'circular_tortes', 'دائري', '250 ج.م', 250, 'مقاس مناسب لـ 6 إلى 8 أفراد نكهات متعددة فواكه ومكسرات', '', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop&q=80', true, 26),
('tc-4', 'تورتة مدور مقاس 22', 'circular_tortes', 'دائري', '290 ج.م', 290, 'مقاس عائلي لـ 8 إلى 10 أفراد تشكيلات ميكس شوكولاتة وكريمة', '', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80', true, 27),
('tc-5', 'تورتة مدور مقاس 24', 'circular_tortes', 'دائري', '370 ج.م', 370, 'مقاس كبير لـ 10 إلى 12 فرد فواكه وشوكولاتة ولوتس', '', 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&auto=format&fit=crop&q=80', true, 28),
('tc-6', 'تورتة مدور مقاس 26', 'circular_tortes', 'دائري', '420 ج.م', 420, 'مقاس حفلات لـ 12 إلى 15 فرد تزيين ملكي مميز', '', 'https://talabat.dhmedia.io/image/talabat/MenuItems/WhatsApp_Image_20260210_a639065082827661466.jpeg', true, 29),
('tc-7', 'تورتة مدور مقاس 28', 'circular_tortes', 'دائري', '450 ج.م', 450, 'المقاس الدائري الأكبر لـ 15 إلى 18 فرد لمناسباتكم السعيدة', '', 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&auto=format&fit=crop&q=80', true, 30),
('tc-8', 'تورتة قلب كبير', 'circular_tortes', 'أشكال', '450 ج.م', 450, 'تورتة مجسمة على شكل قلب أحمر أو شوكولاتة حجم كبير', 'رومانسي', 'https://talabat.dhmedia.io/image/talabat/MenuItems/WhatsApp_Image_20260210_a639065083191245940.jpeg', true, 31),
('tc-9', 'تورتة قلب وسط', 'circular_tortes', 'أشكال', '390 ج.م', 390, 'تورتة قلب مقاس وسط للمناسبات الخاصة والاحتفالات', 'رومانسي', 'https://talabat.dhmedia.io/image/talabat/MenuItems/WhatsApp_Image_20260210_a639065083415752122.jpeg', true, 32),
('tc-10', 'تورتة قلب صغير', 'circular_tortes', 'أشكال', '270 ج.م', 270, 'تورتة قلب مقاس صغير هدية رقيقة ومميزة لشخصين', 'رومانسي', 'https://talabat.dhmedia.io/image/talabat/MenuItems/WhatsApp_Image_20260210_a639065083291888173.jpeg', true, 33),
('tc-11', 'تورتة تفاحة كبير', 'circular_tortes', 'أشكال', '450 ج.م', 450, 'تصميم ثلاثي الأبعاد مجسم ومبهج على شكل تفاحة مقاس كبير', '3D كيك', 'https://talabat.dhmedia.io/image/talabat/MenuItems/WhatsApp_Image_20260210_a639065083943874253.jpeg', true, 34),
('tc-12', 'تورتة تفاحة وسط', 'circular_tortes', 'أشكال', '350 ج.م', 350, 'تصميم مجسم على شكل تفاحة مقاس وسط للأعياد والمفاجآت', '3D كيك', 'https://talabat.dhmedia.io/image/talabat/MenuItems/WhatsApp_Image_20260210_a639065083924673171.jpeg', true, 35),

-- 3. تورت المناسبات والأحجام الكبيرة (6 أصناف)
('ts-1', 'تورتة مقاس 20×30', 'special_tortes', 'مناسبات', 'من غير صورة: 450 ج.م / بصورة: 520 ج.م', 450, 'تورتة مستطيلة للحفلات، إمكانية إضافة صورة صالحة للأكل بدقة عالية', '', 'https://talabat.dhmedia.io/image/talabat/MenuItems/WhatsApp_Image_20260210_a639065082571860855.jpeg', true, 36),
('ts-2', 'تورتة مقاس 30×30', 'special_tortes', 'مناسبات', 'من غير صورة: 550 ج.م / بصورة: 620 ج.م', 550, 'تورتة مربعة فخمة لأعياد الميلاد والتخرج والتفوق', '', 'https://talabat.dhmedia.io/image/talabat/MenuItems/WhatsApp_Image_20260210_a639065083501371194.jpeg', true, 37),
('ts-3', 'تورتة مقاس 30×40', 'special_tortes', 'مناسبات', 'من غير صورة: 850 ج.م / بصورة: 920 ج.م', 850, 'حجم كبير مخصص للمناسبات والعزائم تكفي حتى 25 فرد', '', 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=80', true, 38),
('ts-4', 'تورتة مقاس 40×40', 'special_tortes', 'مناسبات', 'من غير صورة: 950 ج.م / بصورة: 1050 ج.م', 950, 'تورتة مربعة ضخمة تكفي حتى 35 فرد بتزيين خاص', '', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&auto=format&fit=crop&q=80', true, 39),
('ts-5', 'تورتة مقاس 40×60', 'special_tortes', 'مناسبات', 'من غير صورة: 1300 ج.م / بصورة: 1400 ج.م', 1300, 'مقاس أفراح واحتفالات كبرى تكفي أكثر من 50 فرد', '', 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=600&auto=format&fit=crop&q=80', true, 40),
('ts-6', 'تورتة مقاس 60×60', 'special_tortes', 'مناسبات', 'من غير صورة: 2200 ج.م / بصورة: 2300 ج.م', 2200, 'أضخم تورتة مناسبات بالهرم تكفي حتى 80 فرد', '', 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600&auto=format&fit=crop&q=80', true, 41),

-- 4. قطع الجاتوه والدست (8 أصناف)
('g-1', 'قطعة جاتوه لوكس', 'gateaux', 'قطع', '17 ج.م', 17, 'قطعة جاتوه كلاسيك طازجة شوكولاتة أو فانيليا أو فاكهة', '', 'https://talabat.dhmedia.io/image/talabat/MenuItems/قطعة_جاتو_لوكس638928529013180264.jpg', true, 42),
('g-2', 'قطعة جاتوه سوبر', 'gateaux', 'قطع', '25 ج.م', 25, 'قطعة جاتوه سوبر فاخرة بطبقات موس غنية وصوصات خاصة', '', 'https://talabat.dhmedia.io/image/talabat/MenuItems/قطعة_جاتو_سوبر638928528858278801.jpg', true, 43),
('g-3', 'قطعة جاتوه أمواس', 'gateaux', 'قطع', '30 ج.م', 30, 'موس فرنسي ناعم وغني بالشوكولاتة أو الفواكه الفاخرة', '', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80', true, 44),
('g-4', 'قطعة جاتوه إكلير', 'gateaux', 'قطع', '30 ج.م', 30, 'إكلير فرنسي طازج محشو كريمة غنية ومغطى بجناش شوكولاتة', '', 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857346/b18b9708-b9cb-4576-86df-4bca6b06c4d4.jpg', true, 45),
('g-5', 'قطعة جاتوه ملفيه', 'gateaux', 'قطع', '30 ج.م', 30, 'رقائق ملفيه فرنسي مقرمش بحشوة الباستري كريم والسكر البودرة', '', 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857345/e413e54f-1c90-46ff-a553-0d24544cb405.jpg', true, 46),
('g-6', 'دستة جاتوه لوكس (12 قطعة)', 'gateaux', 'دست', '190 ج.م', 190, 'علبة دستة (12 قطعة) منوعة من تشكيلات الجاتوه اللوكس الطازج', '', 'https://talabat.dhmedia.io/image/talabat/MenuItems/دستة_جاتو_لوكس638928529025277274.jpg', true, 47),
('g-7', 'دستة جاتوه سوبر لوكس (12 قطعة)', 'gateaux', 'دست', '280 ج.م', 280, 'دستة سوبر فاخرة (12 قطعة) تشمل قطع السوبر والإكلير والملفيه', '', 'https://talabat.dhmedia.io/image/talabat/MenuItems/دستة_جاتو_سوبر_لوكس638928529027607685.jpg', true, 48),
('g-8', 'دستة جاتوه اسبيشيال (12 قطعة)', 'gateaux', 'دست', '350 ج.م', 350, 'أرقى وأفخم دستة جاتوه فيستيفال مع تشكيلات أمواس وإكلير وسوبر منتقاة', '', 'https://talabat.dhmedia.io/image/talabat/MenuItems/دستة_إسبيشيال638928529028112620.jpg', true, 49),

-- 5. المخبوزات ونواشف العيد (6 أصناف)
('b-1', 'كيلو كحك سادة', 'bakery', 'كحك', '230 ج.م', 230, 'كحك دايب ومرمل بالسمن البلدي الطبيعي ورائحة الكحك الأصيلة', 'سمن بلدي', 'https://talabat.dhmedia.io/image/talabat/MenuItems/كعك_سادة638928528989674198.jpg', true, 50),
('b-2', 'كيلو كحك سكر', 'bakery', 'كحك', '190 ج.م', 190, 'كحك ناعم ومغطى بالسكر البودرة الفاخر بالسمن البلدي', 'سمن بلدي', 'https://talabat.dhmedia.io/image/talabat/MenuItems/كعك_سادة638928528989674198.jpg', true, 51),
('b-3', 'كيلو بسكوت', 'bakery', 'بسكوت', '190 ج.م', 190, 'بسكويت نشادر وماربل مقرمش وهش خفيف للشاي', 'سمن بلدي', 'https://talabat.dhmedia.io/image/talabat/MenuItems/بسكويت_سادة638928528760236759.jpg', true, 52),
('b-4', 'كيلو سابليه', 'bakery', 'سابليه', '320 ج.م', 320, 'سابليه فرنسي فاخر محشو مربى وجناش شوكولاتة ومكسرات', 'فاخر', 'https://talabat.dhmedia.io/image/talabat/MenuItems/بيتي_فور_سابلية638928528865765569.jpg', true, 53),
('b-5', 'كيلو بتي فور', 'bakery', 'بيتي فور', '250 ج.م', 250, 'بيتي فور مشكل فاخر بالشوكولاتة والمكسرات والفارماسيل', 'سمن بلدي', 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280928999/ee1c7589-c291-41a9-8501-62aaee3bff54.jpg', true, 54),
('b-6', 'كيلو غريبة', 'bakery', 'غريبة', '270 ج.م', 270, 'غريبة بيضاء ناعمة دايبة دوبان بالسمن البلدي ومزينة بالفستق', 'سمن بلدي', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80', true, 55),

-- 6. المعلبات والحلويات الباردة (14 صنف)
('c-1', 'كب ريد فالفيت', 'canned', 'أكواب', '35 ج.م', 35, 'كب كيك ريد فالفيت فاخر بطبقات الكريمة المخفوقة الغنية', 'كوب بارد', 'https://talabat.dhmedia.io/image/talabat/MenuItems/كب_ريد_فليت638928528827773111.jpg', true, 56),
('c-2', 'كب كنافة مانجا', 'canned', 'أكواب', '35 ج.م', 35, 'طبقات كنافة ذهبية مقرمشة مع قطع مانجو فريش وكريمة', 'الأكثر طلباً', 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857316/92ba10f3-5261-4ba3-95a8-657f35e1c550.jpg', true, 57),
('c-3', 'كب كنافة نوتيلا', 'canned', 'أكواب', '35 ج.م', 35, 'كنافة مقرمشة مغطاة بشوكولاتة نوتيلا أصلية وبندق', 'عشاق النوتيلا', 'https://talabat.dhmedia.io/image/talabat/MenuItems/بولة_كنافة_نوتيلا638928528931265705.jpg', true, 58),
('c-4', 'علبة مدلعة كبيرة', 'canned', 'علب', '60 ج.م', 60, 'علبة حجم عائلي من المدلعة الشهيرة؛ بسبوسة وكنافة وقشطة وكراميل', 'حجم كبير', 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857308/0a7e6355-2b49-4737-95f5-4c78b7b7ea01.jpg', true, 59),
('c-5', 'علبة كنافة مانجا كبيرة', 'canned', 'علب', '70 ج.م', 70, 'علبة كبيرة تكفي العائلة من كنافة المانجو الطازجة بالكريمة الغنية', 'حجم عائلي', 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857316/92ba10f3-5261-4ba3-95a8-657f35e1c550.jpg', true, 60),
('c-6', 'ديسباسيتو كبير', 'canned', 'كيك', '70 ج.م', 70, 'كيكة الديسباسيتو البرازيلية الغارقة في صوص الشوكولاتة الغني حجم كبير', 'شوكولاتة مكثفة', 'https://talabat.dhmedia.io/image/talabat/MenuItems/دا_سبسيتو_كبير638928528845059602.jpg', true, 61),
('c-7', 'ديسباسيتو صغير', 'canned', 'كيك', '35 ج.م', 35, 'كيكة ديسباسيتو فردية غارقة في جناش الشوكولاتة اللذيذ', 'فردي', 'https://talabat.dhmedia.io/image/talabat/MenuItems/دا_سبسيتو_كبير638928528845059602.jpg', true, 62),
('c-8', 'مولتن كيك كبير', 'canned', 'كيك', '70 ج.م', 70, 'مولتن كيك دافئ غني ببركان الشوكولاتة البلجيكية السائلة حجم كبير', 'بركان شوكولاتة', 'https://talabat.dhmedia.io/image/talabat/MenuItems/مولتو_كيك638928528836258356.jpg', true, 63),
('c-9', 'قشطوطة كبيرة', 'canned', 'أم علي', '70 ج.م', 70, 'قشطوطة الحليب والقشطة الغنية بصوصات الكراميل والمكسرات حجم كبير', 'مميز فيستيفال', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80', true, 64),
('c-10', 'تشيز كيك', 'canned', 'أكواب', '45 ج.م', 45, 'تشيز كيك بارد كريمي مع صوص البلوبيري أو الفراولة اللذيذ', 'بارد ولذيذ', 'https://talabat.dhmedia.io/image/talabat/MenuItems/تشيز_كيك638928528799529637.jpg', true, 65),
('c-11', 'فادج كيك', 'canned', 'كيك', '35 ج.م', 35, 'قطعة فادج شوكولاتة كثيفة وغنية لعشاق الشوكولاتة الداكنة', '', 'https://talabat.dhmedia.io/image/talabat/MenuItems/فادج638928528886188539.jpg', true, 66),
('c-12', 'فانوس رمضان', 'canned', 'أكواب', '40 ج.م', 40, 'تصميم فانوس مبهج محشو بطبقات الحلوى والكريمة الشهية', 'مبهج', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80', true, 67),
('c-13', 'ام علي مكسرات', 'canned', 'أم علي', '45 ج.م', 45, 'طاجن أم علي بالحليب الساخن والقشطة البلدية وتشكيلة مكسرات محمصة', 'طاجن ساخن', 'https://talabat.dhmedia.io/image/talabat/MenuItems/ام_على_مكسرات638928528841886244.jpg', true, 68),
('c-14', 'ام علي سادة', 'canned', 'أم علي', '35 ج.م', 35, 'طاجن أم علي كلاسيك بالحليب المغلي ورقائق الملفيه والقشطة', 'كلاسيك', 'https://talabat.dhmedia.io/image/talabat/MenuItems/ام_على_مكسرات638928528841886244.jpg', true, 69)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    num_price = EXCLUDED.num_price,
    image_url = EXCLUDED.image_url;

-- العروض الترويجية الأولية
INSERT INTO public.offers (id, title, badge, description, old_price, new_price, is_active, sort_order)
VALUES
('offer-1', 'عرض التشكيلة الشرقية الملكية', 'خصم 15%', 'طبق مشكل شرقي فاخر بالسمن البلدي الطبيعي والمكسرات مع هدية قطعة إكلير', '260 ج.م', '220 ج.م', true, 1),
('offer-2', 'عرض تورتة الاحتفال العائلية', 'الأكثر طلباً', 'تورتة مقاس 24 نكهات متعددة شوكولاتة وكراميل وفواكه تكفي 12 فرداً', '440 ج.م', '370 ج.م', true, 2),
('offer-3', 'عرض دستة الجاتوه السوبر', 'عرض الويك إند', 'دستة سوبر لوكس مشكلة (أمواس، إكلير، ملفيه، وشوكولاتة بلجيكية)', '320 ج.م', '280 ج.م', true, 3)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    new_price = EXCLUDED.new_price;

-- تم إنشاء الجداول وتهيئتها بالكامل بنجاح!
