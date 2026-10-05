/**
 * Festival Pastry - Supabase Client & Universal Data Layer
 * حلواني فيستيفال - طبقة الربط مع Supabase مع دعم العمل الأوفلاين والبيانات المعتمدة
 */

(function(window) {
  'use strict';

  // 1. الإعدادات الافتراضية للمتجر (Fallback & Seed)
  const DEFAULT_SETTINGS = {
    id: 'primary',
    store_name: 'حلواني فيستيفال',
    store_name_en: 'Festival Pastry',
    slogan: 'أصل الحلو - كل يوم عرض جديد',
    tagline: 'أفخر أنواع الحلويات الشرقية والغربية في قلب الهرم بالسمن البلدي الطبيعي 100%',
    logo_url: './assets/festival-logo.jpg',
    phone: '01093916372',
    whatsapp: '201093916372',
    vodafone_cash: '01093916372',
    address: 'شارع الهرم الرئيسي - فيصل - الجيزة',
    announcement_text: 'أصل الحلو - كل يوم عرض جديد! | خصومات خاصة على التورت والدست والتشكيلات الشرقية',
    announcement_badge: 'عرض اليوم',
    is_announcement_active: true
  };

  // 2. قائمة الـ 69 صنف الأصلية للمتجر (قاعدة البيانات الأساسية)
  const SEED_PRODUCTS = [
    // --- الحلويات الشرقية (23 صنف) ---
    { id: 'o-1', name: 'مشكل ساده', main_category: 'oriental', sub_category: 'مشكل', price: '140 ج.م', num_price: 140, description: 'تشكيلة شرقية فاخرة ساده بالسمن البلدي الطبيعي', badge: 'كلاسيك', image_url: 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857294/bfda4cc4-6315-4223-85d3-f8dcd74e747e.jpg', is_available: true, sort_order: 1 },
    { id: 'o-2', name: 'مشكل ساده ومكسرات', main_category: 'oriental', sub_category: 'مشكل', price: '170 ج.م', num_price: 170, description: 'مزيج رائع من القطع السادة مع تشكيلة مكسرات فاخرة', badge: 'الأكثر مبيعاً', image_url: 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857295/d30f4940-fbd3-4da2-bd66-1d2c2ed8a375.jpg', is_available: true, sort_order: 2 },
    { id: 'o-3', name: 'مشكل مكسرات', main_category: 'oriental', sub_category: 'مشكل', price: '220 ج.م', num_price: 220, description: 'أفخر تشكيلة حلويات شرقية محشوة ومغطاة بالمكسرات الفاخرة', badge: 'سوبر مكسرات', image_url: 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857296/385b94b7-c6bb-4a95-abbf-f6b216c1bfcf.jpg', is_available: true, sort_order: 3 },
    { id: 'o-4', name: 'بسبوسه سادة', main_category: 'oriental', sub_category: 'بسبوسة', price: '140 ج.م', num_price: 140, description: 'بسبوسة دايبة ومرملة بالسمن البلدي والشربات المظبوط', badge: 'طازج', image_url: 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857297/6fa19756-3ca2-4c8f-94f4-ecb68d1e9657.jpg', is_available: true, sort_order: 4 },
    { id: 'o-5', name: 'بسبوسة بندق', main_category: 'oriental', sub_category: 'بسبوسة', price: '200 ج.م', num_price: 200, description: 'بسبوسة مرملة غنية بحبات البندق المحمص الفاخر', badge: 'مميز', image_url: 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857299/abcdf322-1073-4fa6-95d2-6993d9681bda.jpg', is_available: true, sort_order: 5 },
    { id: 'o-6', name: 'بسبوسة نوتيلا', main_category: 'oriental', sub_category: 'بسبوسة', price: '180 ج.م', num_price: 180, description: 'بسبوسة فيستيفال مع شلال نوتيلا أصلي غني', badge: 'عشاق الشوكولاتة', image_url: 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857301/4cf881b6-c40a-4f50-be19-d3ffadec4d91.jpg', is_available: true, sort_order: 6 },
    { id: 'o-7', name: 'كنافة سادة', main_category: 'oriental', sub_category: 'كنافة', price: '150 ج.م', num_price: 150, description: 'كنافة ذهبية مقرمشة بالسمن البلدي الفاخر', badge: '', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/كنافة_سادة638928528828605796.jpg', is_available: true, sort_order: 7 },
    { id: 'o-8', name: 'كنافة كريمة', main_category: 'oriental', sub_category: 'كنافة', price: '130 ج.م', num_price: 130, description: 'كنافة طرية بحشوة القشطة والكريمة الغنية', badge: 'خفيفة ولذيذة', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/كنافة_كريمة638928529001364276.jpg', is_available: true, sort_order: 8 },
    { id: 'o-9', name: 'كنافة مكسرات', main_category: 'oriental', sub_category: 'كنافة', price: '220 ج.م', num_price: 220, description: 'كنافة مقرمشة محشوة بأجود أنواع المكسرات المحمصة', badge: 'ملكي', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/كنافة_مكسرات638928528914453218.jpg', is_available: true, sort_order: 9 },
    { id: 'o-10', name: 'كنافة مانجا', main_category: 'oriental', sub_category: 'كنافة', price: '180 ج.م', num_price: 180, description: 'كنافة مع طبقات الكريمة وقطع المانجو الطبيعية المنعشة', badge: 'منعش', image_url: 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857316/92ba10f3-5261-4ba3-95a8-657f35e1c550.jpg', is_available: true, sort_order: 10 },
    { id: 'o-11', name: 'كيلو رواني', main_category: 'oriental', sub_category: 'أصناف شرقية', price: '140 ج.م', num_price: 140, description: 'كيكة الرواني الذهبية الهشة المسقية بالشربات الخفيف', badge: '', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/رواني638928528922964267.jpg', is_available: true, sort_order: 11 },
    { id: 'o-12', name: 'رموش الست', main_category: 'oriental', sub_category: 'أصناف شرقية', price: '170 ج.م', num_price: 170, description: 'رموش الست الدايبة دوبان بالسمن البلدي المحمص', badge: 'دايبة', image_url: 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857328/61a80958-9dbd-4b63-87b3-cb230dc31762.jpg', is_available: true, sort_order: 12 },
    { id: 'o-13', name: 'شكلمة', main_category: 'oriental', sub_category: 'أصناف شرقية', price: '240 ج.م', num_price: 240, description: 'شكلمة جوز هند طرية وذهبية بأعلى نسبة جوز هند', badge: 'طعم أصيل', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/شكلمة638928528999326733.jpg', is_available: true, sort_order: 13 },
    { id: 'o-14', name: 'مدلعـة', main_category: 'oriental', sub_category: 'أصناف شرقية', price: '160 ج.م', num_price: 160, description: 'طبقات بسبوسة وكنافة وقشطة وكراميل وشوكولاتة', badge: 'اختراع فيستيفال', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/مدلعة638928528936986711.jpg', is_available: true, sort_order: 14 },
    { id: 'o-15', name: 'زنود سادة', main_category: 'oriental', sub_category: 'أصناف شرقية', price: '170 ج.م', num_price: 170, description: 'أصابع زنود مقرمشة وخفيفة', badge: '', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/زنود_سادة638928528973013684.jpg', is_available: true, sort_order: 15 },
    { id: 'o-16', name: 'جلاش مكسرات', main_category: 'oriental', sub_category: 'بقلاوة', price: '240 ج.م', num_price: 240, description: 'رقائق جلاش مورقة مقرمشة بالسمن والمكسرات', badge: 'مورق', image_url: 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857334/3cb7af44-3910-4c3b-adac-e289808aca01.jpg', is_available: true, sort_order: 16 },
    { id: 'o-17', name: 'بقلاوة بأنواعها', main_category: 'oriental', sub_category: 'بقلاوة', price: '290 ج.م', num_price: 290, description: 'تشكيلة بقلاوة تركي ومصري بأنواعها وحشواتها الفاخرة', badge: 'ملوكي', image_url: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=600&auto=format&fit=crop&q=80', is_available: true, sort_order: 17 },
    { id: 'o-18', name: 'بلح الشام وصوابع زينب', main_category: 'oriental', sub_category: 'أصناف شرقية', price: '140 ج.م', num_price: 140, description: 'بلح الشام المقرمش الذهبي وصوابع زينب اللذيذة', badge: 'مقرمش', image_url: 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857337/ae0e056f-f33c-455d-bcc9-9882ba3cf068.jpg', is_available: true, sort_order: 18 },
    { id: 'o-19', name: 'نابلسية بالجبنة', main_category: 'oriental', sub_category: 'كنافة', price: '220 ج.م', num_price: 220, description: 'كنافة نابلسية بالجبنة العكاوي السايحة والمطاطية', badge: 'ساخنة', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/نابلسية_بالجبنة638928528960660984.jpg', is_available: true, sort_order: 19 },
    { id: 'o-20', name: 'هريسة محشية', main_category: 'oriental', sub_category: 'بسبوسة', price: '190 ج.م', num_price: 190, description: 'هريسة إسكندراني محشية مكسرات بالسمن البلدي', badge: '', image_url: 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857299/abcdf322-1073-4fa6-95d2-6993d9681bda.jpg', is_available: true, sort_order: 20 },
    { id: 'o-21', name: 'كيلو كريمات', main_category: 'oriental', sub_category: 'أصناف شرقية', price: '120 ج.م', num_price: 120, description: 'حلويات الكريمة الطازجة والغنية بالحليب', badge: 'اقتصادي', image_url: 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857341/0af6c3c0-621d-436c-9833-9012c3b913c2.jpg', is_available: true, sort_order: 21 },
    { id: 'o-22', name: 'لينزا', main_category: 'oriental', sub_category: 'أصناف شرقية', price: '150 ج.م', num_price: 150, description: 'لينزا فاخرة بجوز الهند وحشوة القشطة والمربى', badge: '', image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80', is_available: true, sort_order: 22 },
    { id: 'o-23', name: 'عزيزية', main_category: 'oriental', sub_category: 'أصناف شرقية', price: '120 ج.م', num_price: 120, description: 'عزيزية مكرونة بالحليب والقشطة محمرة في الفرن', badge: '', image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80', is_available: true, sort_order: 23 },

    // --- التورتات الدائرية وتورت الأشكال (12 صنف) ---
    { id: 'tc-1', name: 'تورتة باندة', main_category: 'circular_tortes', sub_category: 'أشكال', price: '170 ج.م', num_price: 170, description: 'تورتة باندا بشكل كرتوني محبب للأطفال بطعم كريمة وشوكولاتة لذيذة', badge: 'شكل كرتوني', image_url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600&auto=format&fit=crop&q=80', is_available: true, sort_order: 24 },
    { id: 'tc-2', name: 'تورتة مدور مقاس 18', main_category: 'circular_tortes', sub_category: 'دائري', price: '190 ج.م', num_price: 190, description: 'مقاس مناسب لـ 4 إلى 6 أفراد بتشكيلة فواكه أو شوكولاتة غنية', badge: '', image_url: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&auto=format&fit=crop&q=80', is_available: true, sort_order: 25 },
    { id: 'tc-3', name: 'تورتة مدور مقاس 20', main_category: 'circular_tortes', sub_category: 'دائري', price: '250 ج.م', num_price: 250, description: 'مقاس مناسب لـ 6 إلى 8 أفراد نكهات متعددة فواكه ومكسرات', badge: '', image_url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop&q=80', is_available: true, sort_order: 26 },
    { id: 'tc-4', name: 'تورتة مدور مقاس 22', main_category: 'circular_tortes', sub_category: 'دائري', price: '290 ج.م', num_price: 290, description: 'مقاس عائلي لـ 8 إلى 10 أفراد تشكيلات ميكس شوكولاتة وكريمة', badge: '', image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80', is_available: true, sort_order: 27 },
    { id: 'tc-5', name: 'تورتة مدور مقاس 24', main_category: 'circular_tortes', sub_category: 'دائري', price: '370 ج.م', num_price: 370, description: 'مقاس كبير لـ 10 إلى 12 فرد فواكه وشوكولاتة ولوتس', badge: '', image_url: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&auto=format&fit=crop&q=80', is_available: true, sort_order: 28 },
    { id: 'tc-6', name: 'تورتة مدور مقاس 26', main_category: 'circular_tortes', sub_category: 'دائري', price: '420 ج.م', num_price: 420, description: 'مقاس حفلات لـ 12 إلى 15 فرد تزيين ملكي مميز', badge: '', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/WhatsApp_Image_20260210_a639065082827661466.jpeg', is_available: true, sort_order: 29 },
    { id: 'tc-7', name: 'تورتة مدور مقاس 28', main_category: 'circular_tortes', sub_category: 'دائري', price: '450 ج.م', num_price: 450, description: 'المقاس الدائري الأكبر لـ 15 إلى 18 فرد لمناسباتكم السعيدة', badge: '', image_url: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&auto=format&fit=crop&q=80', is_available: true, sort_order: 30 },
    { id: 'tc-8', name: 'تورتة قلب كبير', main_category: 'circular_tortes', sub_category: 'أشكال', price: '450 ج.م', num_price: 450, description: 'تورتة مجسمة على شكل قلب أحمر أو شوكولاتة حجم كبير', badge: 'رومانسي', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/WhatsApp_Image_20260210_a639065083191245940.jpeg', is_available: true, sort_order: 31 },
    { id: 'tc-9', name: 'تورتة قلب وسط', main_category: 'circular_tortes', sub_category: 'أشكال', price: '390 ج.م', num_price: 390, description: 'تورتة قلب مقاس وسط للمناسبات الخاصة والاحتفالات', badge: 'رومانسي', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/WhatsApp_Image_20260210_a639065083415752122.jpeg', is_available: true, sort_order: 32 },
    { id: 'tc-10', name: 'تورتة قلب صغير', main_category: 'circular_tortes', sub_category: 'أشكال', price: '270 ج.م', num_price: 270, description: 'تورتة قلب مقاس صغير هدية رقيقة ومميزة لشخصين', badge: 'رومانسي', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/WhatsApp_Image_20260210_a639065083291888173.jpeg', is_available: true, sort_order: 33 },
    { id: 'tc-11', name: 'تورتة تفاحة كبير', main_category: 'circular_tortes', sub_category: 'أشكال', price: '450 ج.م', num_price: 450, description: 'تصميم ثلاثي الأبعاد مجسم ومبهج على شكل تفاحة مقاس كبير', badge: '3D كيك', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/WhatsApp_Image_20260210_a639065083943874253.jpeg', is_available: true, sort_order: 34 },
    { id: 'tc-12', name: 'تورتة تفاحة وسط', main_category: 'circular_tortes', sub_category: 'أشكال', price: '350 ج.م', num_price: 350, description: 'تصميم مجسم على شكل تفاحة مقاس وسط للأعياد والمفاجآت', badge: '3D كيك', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/WhatsApp_Image_20260210_a639065083924673171.jpeg', is_available: true, sort_order: 35 },

    // --- تورت المناسبات والأحجام الكبيرة (6 أصناف) ---
    { id: 'ts-1', name: 'تورتة مقاس 20×30', main_category: 'special_tortes', sub_category: 'مناسبات', price: 'من غير صورة: 450 ج.م / بصورة: 520 ج.م', num_price: 450, description: 'تورتة مستطيلة للحفلات، إمكانية إضافة صورة صالحة للأكل بدقة عالية', badge: '', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/WhatsApp_Image_20260210_a639065082571860855.jpeg', is_available: true, sort_order: 36 },
    { id: 'ts-2', name: 'تورتة مقاس 30×30', main_category: 'special_tortes', sub_category: 'مناسبات', price: 'من غير صورة: 550 ج.م / بصورة: 620 ج.م', num_price: 550, description: 'تورتة مربعة فخمة لأعياد الميلاد والتخرج والتفوق', badge: '', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/WhatsApp_Image_20260210_a639065083501371194.jpeg', is_available: true, sort_order: 37 },
    { id: 'ts-3', name: 'تورتة مقاس 30×40', main_category: 'special_tortes', sub_category: 'مناسبات', price: 'من غير صورة: 850 ج.م / بصورة: 920 ج.م', num_price: 850, description: 'حجم كبير مخصص للمناسبات والعزائم تكفي حتى 25 فرد', badge: '', image_url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=80', is_available: true, sort_order: 38 },
    { id: 'ts-4', name: 'تورتة مقاس 40×40', main_category: 'special_tortes', sub_category: 'مناسبات', price: 'من غير صورة: 950 ج.م / بصورة: 1050 ج.م', num_price: 950, description: 'تورتة مربعة ضخمة تكفي حتى 35 فرد بتزيين خاص', badge: '', image_url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&auto=format&fit=crop&q=80', is_available: true, sort_order: 39 },
    { id: 'ts-5', name: 'تورتة مقاس 40×60', main_category: 'special_tortes', sub_category: 'مناسبات', price: 'من غير صورة: 1300 ج.م / بصورة: 1400 ج.م', num_price: 1300, description: 'مقاس أفراح واحتفالات كبرى تكفي أكثر من 50 فرد', badge: '', image_url: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=600&auto=format&fit=crop&q=80', is_available: true, sort_order: 40 },
    { id: 'ts-6', name: 'تورتة مقاس 60×60', main_category: 'special_tortes', sub_category: 'مناسبات', price: 'من غير صورة: 2200 ج.م / بصورة: 2300 ج.م', num_price: 2200, description: 'أضخم تورتة مناسبات بالهرم تكفي حتى 80 فرد', badge: '', image_url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600&auto=format&fit=crop&q=80', is_available: true, sort_order: 41 },

    // --- قطع الجاتوه والدست (8 أصناف) ---
    { id: 'g-1', name: 'قطعة جاتوه لوكس', main_category: 'gateaux', sub_category: 'قطع', price: '17 ج.م', num_price: 17, description: 'قطعة جاتوه كلاسيك طازجة شوكولاتة أو فانيليا أو فاكهة', badge: '', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/قطعة_جاتو_لوكس638928529013180264.jpg', is_available: true, sort_order: 42 },
    { id: 'g-2', name: 'قطعة جاتوه سوبر', main_category: 'gateaux', sub_category: 'قطع', price: '25 ج.م', num_price: 25, description: 'قطعة جاتوه سوبر فاخرة بطبقات موس غنية وصوصات خاصة', badge: '', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/قطعة_جاتو_سوبر638928528858278801.jpg', is_available: true, sort_order: 43 },
    { id: 'g-3', name: 'قطعة جاتوه أمواس', main_category: 'gateaux', sub_category: 'قطع', price: '30 ج.م', num_price: 30, description: 'موس فرنسي ناعم وغني بالشوكولاتة أو الفواكه الفاخرة', badge: '', image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80', is_available: true, sort_order: 44 },
    { id: 'g-4', name: 'قطعة جاتوه إكلير', main_category: 'gateaux', sub_category: 'قطع', price: '30 ج.م', num_price: 30, description: 'إكلير فرنسي طازج محشو كريمة غنية ومغطى بجناش شوكولاتة', badge: '', image_url: 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857346/b18b9708-b9cb-4576-86df-4bca6b06c4d4.jpg', is_available: true, sort_order: 45 },
    { id: 'g-5', name: 'قطعة جاتوه ملفيه', main_category: 'gateaux', sub_category: 'قطع', price: '30 ج.م', num_price: 30, description: 'رقائق ملفيه فرنسي مقرمش بحشوة الباستري كريم والسكر البودرة', badge: '', image_url: 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857345/e413e54f-1c90-46ff-a553-0d24544cb405.jpg', is_available: true, sort_order: 46 },
    { id: 'g-6', name: 'دستة جاتوه لوكس (12 قطعة)', main_category: 'gateaux', sub_category: 'دست', price: '190 ج.م', num_price: 190, description: 'علبة دستة (12 قطعة) منوعة من تشكيلات الجاتوه اللوكس الطازج', badge: '', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/دستة_جاتو_لوكس638928529025277274.jpg', is_available: true, sort_order: 47 },
    { id: 'g-7', name: 'دستة جاتوه سوبر لوكس (12 قطعة)', main_category: 'gateaux', sub_category: 'دست', price: '280 ج.م', num_price: 280, description: 'دستة سوبر فاخرة (12 قطعة) تشمل قطع السوبر والإكلير والملفيه', badge: '', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/دستة_جاتو_سوبر_لوكس638928529027607685.jpg', is_available: true, sort_order: 48 },
    { id: 'g-8', name: 'دستة جاتوه اسبيشيال (12 قطعة)', main_category: 'gateaux', sub_category: 'دست', price: '350 ج.م', num_price: 350, description: 'أرقى وأفخم دستة جاتوه فيستيفال مع تشكيلات أمواس وإكلير وسوبر منتقاة', badge: '', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/دستة_إسبيشيال638928529028112620.jpg', is_available: true, sort_order: 49 },

    // --- المخبوزات ونواشف العيد (6 أصناف) ---
    { id: 'b-1', name: 'كيلو كحك سادة', main_category: 'bakery', sub_category: 'كحك', price: '230 ج.م', num_price: 230, description: 'كحك دايب ومرمل بالسمن البلدي الطبيعي ورائحة الكحك الأصيلة', badge: 'سمن بلدي', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/كعك_سادة638928528989674198.jpg', is_available: true, sort_order: 50 },
    { id: 'b-2', name: 'كيلو كحك سكر', main_category: 'bakery', sub_category: 'كحك', price: '190 ج.م', num_price: 190, description: 'كحك ناعم ومغطى بالسكر البودرة الفاخر بالسمن البلدي', badge: 'سمن بلدي', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/كعك_سادة638928528989674198.jpg', is_available: true, sort_order: 51 },
    { id: 'b-3', name: 'كيلو بسكوت', main_category: 'bakery', sub_category: 'بسكوت', price: '190 ج.م', num_price: 190, description: 'بسكويت نشادر وماربل مقرمش وهش خفيف للشاي', badge: 'سمن بلدي', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/بسكويت_سادة638928528760236759.jpg', is_available: true, sort_order: 52 },
    { id: 'b-4', name: 'كيلو سابليه', main_category: 'bakery', sub_category: 'سابليه', price: '320 ج.م', num_price: 320, description: 'سابليه فرنسي فاخر محشو مربى وجناش شوكولاتة ومكسرات', badge: 'فاخر', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/بيتي_فور_سابلية638928528865765569.jpg', is_available: true, sort_order: 53 },
    { id: 'b-5', name: 'كيلو بتي فور', main_category: 'bakery', sub_category: 'بيتي فور', price: '250 ج.م', num_price: 250, description: 'بيتي فور مشكل فاخر بالشوكولاتة والمكسرات والفارماسيل', badge: 'سمن بلدي', image_url: 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280928999/ee1c7589-c291-41a9-8501-62aaee3bff54.jpg', is_available: true, sort_order: 54 },
    { id: 'b-6', name: 'كيلو غريبة', main_category: 'bakery', sub_category: 'غريبة', price: '270 ج.م', num_price: 270, description: 'غريبة بيضاء ناعمة دايبة دوبان بالسمن البلدي ومزينة بالفستق', badge: 'سمن بلدي', image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80', is_available: true, sort_order: 55 },

    // --- المعلبات والحلويات الباردة (14 صنف) ---
    { id: 'c-1', name: 'كب ريد فالفيت', main_category: 'canned', sub_category: 'أكواب', price: '35 ج.م', num_price: 35, description: 'كب كيك ريد فالفيت فاخر بطبقات الكريمة المخفوقة الغنية', badge: 'كوب بارد', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/كب_ريد_فليت638928528827773111.jpg', is_available: true, sort_order: 56 },
    { id: 'c-2', name: 'كب كنافة مانجا', main_category: 'canned', sub_category: 'أكواب', price: '35 ج.م', num_price: 35, description: 'طبقات كنافة ذهبية مقرمشة مع قطع مانجو فريش وكريمة', badge: 'الأكثر طلباً', image_url: 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857316/92ba10f3-5261-4ba3-95a8-657f35e1c550.jpg', is_available: true, sort_order: 57 },
    { id: 'c-3', name: 'كب كنافة نوتيلا', main_category: 'canned', sub_category: 'أكواب', price: '35 ج.م', num_price: 35, description: 'كنافة مقرمشة مغطاة بشوكولاتة نوتيلا أصلية وبندق', badge: 'عشاق النوتيلا', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/بولة_كنافة_نوتيلا638928528931265705.jpg', is_available: true, sort_order: 58 },
    { id: 'c-4', name: 'علبة مدلعة كبيرة', main_category: 'canned', sub_category: 'علب', price: '60 ج.م', num_price: 60, description: 'علبة حجم عائلي من المدلعة الشهيرة؛ بسبوسة وكنافة وقشطة وكراميل', badge: 'حجم كبير', image_url: 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857308/0a7e6355-2b49-4737-95f5-4c78b7b7ea01.jpg', is_available: true, sort_order: 59 },
    { id: 'c-5', name: 'علبة كنافة مانجا كبيرة', main_category: 'canned', sub_category: 'علب', price: '70 ج.م', num_price: 70, description: 'علبة كبيرة تكفي العائلة من كنافة المانجو الطازجة بالكريمة الغنية', badge: 'حجم عائلي', image_url: 'https://talabat.dhmedia.io/image/global-menu-service/HF_EG/vendor/776568/product/2280857316/92ba10f3-5261-4ba3-95a8-657f35e1c550.jpg', is_available: true, sort_order: 60 },
    { id: 'c-6', name: 'ديسباسيتو كبير', main_category: 'canned', sub_category: 'كيك', price: '70 ج.م', num_price: 70, description: 'كيكة الديسباسيتو البرازيلية الغارقة في صوص الشوكولاتة الغني حجم كبير', badge: 'شوكولاتة مكثفة', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/دا_سبسيتو_كبير638928528845059602.jpg', is_available: true, sort_order: 61 },
    { id: 'c-7', name: 'ديسباسيتو صغير', main_category: 'canned', sub_category: 'كيك', price: '35 ج.م', num_price: 35, description: 'كيكة ديسباسيتو فردية غارقة في جناش الشوكولاتة اللذيذ', badge: 'فردي', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/دا_سبسيتو_كبير638928528845059602.jpg', is_available: true, sort_order: 62 },
    { id: 'c-8', name: 'مولتن كيك كبير', main_category: 'canned', sub_category: 'كيك', price: '70 ج.م', num_price: 70, description: 'مولتن كيك دافئ غني ببركان الشوكولاتة البلجيكية السائلة حجم كبير', badge: 'بركان شوكولاتة', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/مولتو_كيك638928528836258356.jpg', is_available: true, sort_order: 63 },
    { id: 'c-9', name: 'قشطوطة كبيرة', main_category: 'canned', sub_category: 'أم علي', price: '70 ج.م', num_price: 70, description: 'قشطوطة الحليب والقشطة الغنية بصوصات الكراميل والمكسرات حجم كبير', badge: 'مميز فيستيفال', image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80', is_available: true, sort_order: 64 },
    { id: 'c-10', name: 'تشيز كيك', main_category: 'canned', sub_category: 'أكواب', price: '45 ج.م', num_price: 45, description: 'تشيز كيك بارد كريمي مع صوص البلوبيري أو الفراولة اللذيذ', badge: 'بارد ولذيذ', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/تشيز_كيك638928528799529637.jpg', is_available: true, sort_order: 65 },
    { id: 'c-11', name: 'فادج كيك', main_category: 'canned', sub_category: 'كيك', price: '35 ج.م', num_price: 35, description: 'قطعة فادج شوكولاتة كثيفة وغنية لعشاق الشوكولاتة الداكنة', badge: '', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/فادج638928528886188539.jpg', is_available: true, sort_order: 66 },
    { id: 'c-12', name: 'فانوس رمضان', main_category: 'canned', sub_category: 'أكواب', price: '40 ج.م', num_price: 40, description: 'تصميم فانوس مبهج محشو بطبقات الحلوى والكريمة الشهية', badge: 'مبهج', image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80', is_available: true, sort_order: 67 },
    { id: 'c-13', name: 'ام علي مكسرات', main_category: 'canned', sub_category: 'أم علي', price: '45 ج.م', num_price: 45, description: 'طاجن أم علي بالحليب الساخن والقشطة البلدية وتشكيلة مكسرات محمصة', badge: 'طاجن ساخن', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/ام_على_مكسرات638928528841886244.jpg', is_available: true, sort_order: 68 },
    { id: 'c-14', name: 'ام علي سادة', main_category: 'canned', sub_category: 'أم علي', price: '35 ج.م', num_price: 35, description: 'طاجن أم علي كلاسيك بالحليب المغلي ورقائق الملفيه والقشطة', badge: 'كلاسيك', image_url: 'https://talabat.dhmedia.io/image/talabat/MenuItems/ام_على_مكسرات638928528841886244.jpg', is_available: true, sort_order: 69 }
  ];

  // 3. العروض الترويجية الافتراضية
  const SEED_OFFERS = [
    {
      id: 'offer-1',
      title: 'عرض التشكيلة الشرقية الملكية',
      badge: 'خصم 15%',
      description: 'طبق مشكل شرقي فاخر بالسمن البلدي الطبيعي والمكسرات مع هدية قطعة إكلير',
      old_price: '260 ج.م',
      new_price: '220 ج.م',
      is_active: true
    },
    {
      id: 'offer-2',
      title: 'عرض تورتة الاحتفال العائلية',
      badge: 'الأكثر طلباً',
      description: 'تورتة مقاس 24 نكهات متعددة شوكولاتة وكراميل وفواكه تكفي 12 فرداً',
      old_price: '440 ج.م',
      new_price: '370 ج.م',
      is_active: true
    },
    {
      id: 'offer-3',
      title: 'عرض دستة الجاتوه السوبر',
      badge: 'عرض الويك إند',
      description: 'دستة سوبر لوكس مشكلة (أمواس، إكلير، ملفيه، وشوكولاتة بلجيكية)',
      old_price: '320 ج.م',
      new_price: '280 ج.م',
      is_active: true
    }
  ];

  // 4. كائن إدارة البيانات (FestivalDB)
  const FestivalDB = {
    client: null,
    isInitialized: false,

    // تهيئة عميل Supabase
    init: function() {
      const url = window.SUPABASE_CONFIG ? window.SUPABASE_CONFIG.getUrl() : '';
      const anonKey = window.SUPABASE_CONFIG ? window.SUPABASE_CONFIG.getAnonKey() : '';

      if (url && anonKey && window.supabase && typeof window.supabase.createClient === 'function') {
        try {
          this.client = window.supabase.createClient(url, anonKey, {
            auth: { persistSession: true }
          });
          this.isInitialized = true;
          return this.client;
        } catch (e) {
          console.warn('[FestivalDB] Supabase client init failed:', e);
          this.client = null;
          this.isInitialized = false;
        }
      }
      return null;
    },

    // اختبار الاتصال بـ Supabase
    testConnection: async function() {
      if (!this.init()) {
        return { success: false, message: 'مفاتيح Supabase غير مدخلة أو مكتبة Supabase لم تُحمّل.' };
      }
      try {
        const { data, error } = await this.client
          .from('store_settings')
          .select('store_name')
          .limit(1);

        if (error) {
          return { success: false, message: `خطأ من Supabase: ${error.message}` };
        }
        return { success: true, message: 'تم الاتصال بقاعدة بيانات Supabase بنجاح تام! ✅' };
      } catch (err) {
        return { success: false, message: `فشل الاتصال: ${err.message}` };
      }
    },

    // ==========================================
    // إعدادات المتجر (STORE SETTINGS)
    // ==========================================

    getStoreSettings: async function() {
      // محاولة الجلب من Supabase
      if (this.init()) {
        try {
          const { data, error } = await this.client
            .from('store_settings')
            .select('*')
            .eq('id', 'primary')
            .single();

          if (!error && data) {
            localStorage.setItem('festival_store_settings', JSON.stringify(data));
            return data;
          }
        } catch (err) {
          console.warn('[FestivalDB] Failed to fetch settings from Supabase:', err);
        }
      }

      // الرجوع للتخزين المحلي أو الافتراضي
      const cached = localStorage.getItem('festival_store_settings');
      if (cached) {
        try { return JSON.parse(cached); } catch (e) {}
      }
      return DEFAULT_SETTINGS;
    },

    saveStoreSettings: async function(settings) {
      const merged = { ...DEFAULT_SETTINGS, ...settings, updated_at: new Date().toISOString() };
      localStorage.setItem('festival_store_settings', JSON.stringify(merged));

      if (this.init()) {
        try {
          const { data, error } = await this.client
            .from('store_settings')
            .upsert(merged, { onConflict: 'id' })
            .select()
            .single();

          if (error) throw error;
          return { success: true, data };
        } catch (err) {
          console.error('[FestivalDB] Failed to save settings to Supabase:', err);
          return { success: true, data: merged, warning: 'تم الحفظ محلياً فقط. ' + err.message };
        }
      }
      return { success: true, data: merged, offline: true };
    },

    // ==========================================
    // المنتجات (PRODUCTS)
    // ==========================================

    getAllProducts: async function() {
      if (this.init()) {
        try {
          const { data, error } = await this.client
            .from('products')
            .select('*')
            .order('sort_order', { ascending: true });

          if (!error && data && data.length > 0) {
            localStorage.setItem('festival_cached_products', JSON.stringify(data));
            return data;
          }
        } catch (err) {
          console.warn('[FestivalDB] Supabase products fetch error:', err);
        }
      }

      const cached = localStorage.getItem('festival_cached_products');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
      return SEED_PRODUCTS;
    },

    addProduct: async function(product) {
      const newProduct = {
        id: product.id || ('prod_' + Date.now()),
        name: product.name,
        main_category: product.main_category || 'oriental',
        sub_category: product.sub_category || '',
        price: product.price,
        num_price: Number(product.num_price) || 0,
        description: product.description || '',
        badge: product.badge || '',
        image_url: product.image_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
        is_available: product.is_available !== false,
        sort_order: Number(product.sort_order) || 999,
        created_at: new Date().toISOString()
      };

      if (this.init()) {
        try {
          const { data, error } = await this.client
            .from('products')
            .insert(newProduct)
            .select()
            .single();

          if (error) throw error;
          await this._updateLocalProductsCache(item => [...item, data || newProduct]);
          return { success: true, data: data || newProduct };
        } catch (err) {
          console.error('[FestivalDB] Add product error:', err);
          await this._updateLocalProductsCache(item => [...item, newProduct]);
          return { success: true, data: newProduct, warning: err.message };
        }
      }

      await this._updateLocalProductsCache(item => [...item, newProduct]);
      return { success: true, data: newProduct, offline: true };
    },

    updateProduct: async function(id, updates) {
      updates.updated_at = new Date().toISOString();

      if (this.init()) {
        try {
          const { data, error } = await this.client
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;
          await this._updateLocalProductsCache(list => list.map(p => p.id === id ? { ...p, ...updates } : p));
          return { success: true, data: data || updates };
        } catch (err) {
          console.error('[FestivalDB] Update product error:', err);
          await this._updateLocalProductsCache(list => list.map(p => p.id === id ? { ...p, ...updates } : p));
          return { success: true, data: updates, warning: err.message };
        }
      }

      await this._updateLocalProductsCache(list => list.map(p => p.id === id ? { ...p, ...updates } : p));
      return { success: true, data: updates, offline: true };
    },

    deleteProduct: async function(id) {
      if (this.init()) {
        try {
          const { error } = await this.client
            .from('products')
            .delete()
            .eq('id', id);

          if (error) throw error;
        } catch (err) {
          console.error('[FestivalDB] Delete product error:', err);
        }
      }
      await this._updateLocalProductsCache(list => list.filter(p => p.id !== id));
      return { success: true };
    },

    toggleProductAvailability: async function(id, isAvailable) {
      return this.updateProduct(id, { is_available: isAvailable });
    },

    // مساعد لتحديث الكاش المحلي للمنتجات
    _updateLocalProductsCache: async function(modifierFn) {
      let current = [];
      const cached = localStorage.getItem('festival_cached_products');
      if (cached) {
        try { current = JSON.parse(cached); } catch (e) { current = [...SEED_PRODUCTS]; }
      } else {
        current = [...SEED_PRODUCTS];
      }
      const updated = modifierFn(current);
      localStorage.setItem('festival_cached_products', JSON.stringify(updated));
      return updated;
    },

    // ==========================================
    // العروض والبانرات (OFFERS)
    // ==========================================

    getAllOffers: async function() {
      if (this.init()) {
        try {
          const { data, error } = await this.client
            .from('offers')
            .select('*')
            .order('sort_order', { ascending: true });

          if (!error && data && data.length > 0) {
            localStorage.setItem('festival_cached_offers', JSON.stringify(data));
            return data;
          }
        } catch (err) {}
      }

      const cached = localStorage.getItem('festival_cached_offers');
      if (cached) {
        try { return JSON.parse(cached); } catch (e) {}
      }
      return SEED_OFFERS;
    },

    saveOffer: async function(offer) {
      const newOffer = {
        id: offer.id || ('offer-' + Date.now()),
        title: offer.title,
        badge: offer.badge || 'عرض خاص',
        description: offer.description || '',
        old_price: offer.old_price || '',
        new_price: offer.new_price || '',
        image_url: offer.image_url || '',
        is_active: offer.is_active !== false,
        sort_order: Number(offer.sort_order) || 0
      };

      if (this.init()) {
        try {
          const { data, error } = await this.client
            .from('offers')
            .upsert(newOffer, { onConflict: 'id' })
            .select()
            .single();

          if (error) throw error;
        } catch (e) {
          console.warn('[FestivalDB] Offer upsert error:', e);
        }
      }

      let offers = await this.getAllOffers();
      const existingIdx = offers.findIndex(o => o.id === newOffer.id);
      if (existingIdx >= 0) offers[existingIdx] = newOffer;
      else offers.push(newOffer);
      localStorage.setItem('festival_cached_offers', JSON.stringify(offers));
      return { success: true, data: newOffer };
    },

    deleteOffer: async function(id) {
      if (this.init()) {
        try {
          await this.client.from('offers').delete().eq('id', id);
        } catch (e) {}
      }
      let offers = await this.getAllOffers();
      offers = offers.filter(o => o.id !== id);
      localStorage.setItem('festival_cached_offers', JSON.stringify(offers));
      return { success: true };
    },

    // ==========================================
    // زرع البيانات الكاملة في Supabase بنقرة واحدة (SEED DATA)
    // ==========================================

    seedDatabase: async function(force = false) {
      if (!this.init()) {
        return { success: false, message: 'يرجى ربط Supabase وضبط المفاتيح أولاً.' };
      }

      try {
        // 1. فحص وجود بيانات في store_settings
        const { data: existingSettings } = await this.client
          .from('store_settings')
          .select('id')
          .eq('id', 'primary');

        if (force || !existingSettings || existingSettings.length === 0) {
          await this.client
            .from('store_settings')
            .upsert(DEFAULT_SETTINGS, { onConflict: 'id' });
        }

        // 2. فحص المنتجات
        const { data: existingProds } = await this.client
          .from('products')
          .select('id')
          .limit(5);

        if (force || !existingProds || existingProds.length === 0) {
          // رفع الـ 69 صنف على دفعات
          const chunkSize = 20;
          for (let i = 0; i < SEED_PRODUCTS.length; i += chunkSize) {
            const chunk = SEED_PRODUCTS.slice(i, i + chunkSize);
            const { error: seedError } = await this.client
              .from('products')
              .upsert(chunk, { onConflict: 'id' });
            if (seedError) throw seedError;
          }
        }

        // 3. العروض
        const { data: existingOffers } = await this.client
          .from('offers')
          .select('id')
          .limit(1);

        if (force || !existingOffers || existingOffers.length === 0) {
          await this.client.from('offers').upsert(SEED_OFFERS, { onConflict: 'id' });
        }

        return {
          success: true,
          message: `تم رفع وزرع جميع البيانات بنجاح! تم تجهيز (${SEED_PRODUCTS.length}) صنف وإعدادات المتجر بالكامل على Supabase.`
        };
      } catch (err) {
        console.error('[FestivalDB] Seeding failed:', err);
        return { success: false, message: 'فشل زرع البيانات: ' + err.message };
      }
    },

    // ==========================================
    // رفع الصور (STORAGE OR DATA URL)
    // ==========================================

    uploadImage: async function(file) {
      if (!file) return null;

      // إذا كانت ملفات Supabase Storage مهيأة
      if (this.init()) {
        try {
          const fileExt = file.name.split('.').pop() || 'jpg';
          const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
          const filePath = `uploads/${fileName}`;

          const { data: uploadData, error: uploadError } = await this.client.storage
            .from('product-images')
            .upload(filePath, file, { cacheControl: '3600', upsert: true });

          if (!uploadError && uploadData) {
            const { data: publicUrlData } = this.client.storage
              .from('product-images')
              .getPublicUrl(filePath);

            if (publicUrlData && publicUrlData.publicUrl) {
              return publicUrlData.publicUrl;
            }
          }
        } catch (storageErr) {
          console.warn('[FestivalDB] Supabase storage upload fell back to DataURL:', storageErr);
        }
      }

      // الرجوع لتحويل الملف لـ Data URL محلي فوري
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });
    },

    // تصدير البيانات الأولية للاستخدام المباشر
    defaults: {
      settings: DEFAULT_SETTINGS,
      products: SEED_PRODUCTS,
      offers: SEED_OFFERS
    }
  };

  window.FestivalDB = FestivalDB;

})(window);
