import React , { createContext , useEffect , useState} from "react";

export const LanguageContext = createContext();

const defaultLang = localStorage.getItem('lang') || 'en';

const translations = {
  ar: {
    home: 'الرئيسية',
    upload: 'رفع صورة',
    gallery: 'صوري',
    profile: 'الملف الشخصي',
    login: 'دخول',
    register: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    welcome: 'مرحبًا',
    light: '☀️ نهار',
    dark: '🌙 ليل',
    language: 'اللغة',
    no_account: 'لا يوجد حساب',
    no_image: 'لا يوجد صورة',
    title: 'العنوان',
    description: 'الوصف',
    create_account: 'انشاء حساب',
    login_title: ' تسجيل الدخول',
    email_placeholder: 'البريد الالكتروني',
    password_placeholder: 'كلمة المرور',
    username: 'اسم المستخدم',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirm_password: 'تأكيد كلمة المرور',
    registering: 'جاري التسجيل...',
    already_have_account: 'لديك حساب؟',
    login_error: 'خطأ في تسجيل الدخول',
    register_error: 'خطأ في التسجيل',
    login_success: 'تم تسجيل الدخول بنجاح',
    register_success: 'تم التسجيل بنجاح',
    public_gallery: 'الصور العامة',
    lik: 'الاعجابات',
    likes: 'الاعجابات',
    my_gallery: 'صوري',
    delete: 'حذف',
    update: 'تحديث',
    update_profile: 'تحديث الملف الشخصي',
    new_password: 'كلمة مرور جديدة (اختياري)',
    profile_updated: 'تم تحديث الملف الشخصي بنجاح',
    profile_update_failed: 'فشل تحديث الملف الشخصي',
    my_galery: 'صوري',
    upload_image: 'رفع صورة جديدة',
    image_title: 'عنوان الصورة',
    image_title_placeholder: 'ادخل عنوان الصورة',
    image_description: 'وصف الصورة',
    image_description_placeholder: 'ادخل وصف الصورة',
    choose_image: 'اختر صورة',
    upload_success: 'تم رفع الصورة بنجاح',
    upload_failed: 'فشل رفع الصورة',
    select_image: 'يرجى اختيار صورة',
    edit: 'تعديل',
    no_images: 'لا يوجد صور',
   new_title: 'عنوان جديد',
   new_description: 'وصف جديد',
   cancel: 'إلغاء',
   image_deleted: '✅ تم حذف الصورة بنجاح',
   image_updated: '✅ تم تحديث الصورة بنجاح',
   confirm_delete: 'هل أنت متأكد أنك تريد حذف هذه الصورة؟',
   app_name: 'صوري',
   invalid_email: 'البريد الالكتروني غير صالح',
   password_too_short: 'كلمة المرور قصيرة جداً',
   password_not_match: 'كلمة المرور غير متطابقة',
   success : 'نجاح',
   loading: 'جاري التحميل',
   
  },
  en: {
    home: 'Home',
    upload: 'Upload',
    gallery: 'My Gallery',
    profile: 'Profile',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    welcome: 'Welcome',
    light: '☀️ Light',
    dark: '🌙 Dark',
    language: 'Language',
    no_account: 'No Account',
    no_image: 'No Image',
    title: 'Title',
    description: 'Description',
    create_account: 'Create Account',
    login_title: 'Login',
    email_placeholder: 'Email',
    password_placeholder: 'Password',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    confirm_password: 'Confirm Password',
    registering: 'Registering...',
    already_have_account: 'Already have an account?',
    login_error: 'Login failed',
    register_error: 'Registration failed',
    login_success: 'Login successful',
    register_success: 'Registration successful',
    public_gallery: 'Public Gallery',
    lik: 'Likes',
    likes: 'Likes',
    my_gallery: 'My Gallery',
    delete: 'Delete',
    update: 'Update',
    update_profile: 'Update Profile',
    new_password: 'New Password (Optional)',
    profile_updated: 'Profile updated successfully',
    profile_update_failed: 'Failed to update profile',
    my_galery: 'My Gallery',
    upload_image: 'Upload New Image',
    image_title: 'Image Title',
    image_title_placeholder: 'Enter Image Title',
    image_description: 'Image Description',
    image_description_placeholder: 'Enter Image Description',
    choose_image: 'Choose Image',
    upload_success: 'Image uploaded successfully',
    upload_failed: 'Failed to upload image',
    select_image: 'Please select an image',
    edit: 'Edit',
    no_images: 'No images',
   new_title: 'New Title',
   new_description: 'New Description',
   cancel: 'Cancel',
   image_deleted: '✅ Image deleted successfully',
   image_updated: '✅ Image updated successfully',
   confirm_delete: 'Are you sure you want to delete this image?',
   app_name: 'My Gallery',
   invalid_email: 'Invalid email address',
   password_too_short: 'Password is too short',
   password_not_match: 'Passwords do not match',
   success : 'Success',
   loading: 'Loading',
  
  }
};

export const LanguageContextProvider = ({ children}) => {
  const [lang, setLang] = useState(defaultLang);

  useEffect(()=> {
    localStorage.setItem('lang', lang);
  }, [lang]);
  const toggleLang = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  const t = (key) =>  {
    // add default language if key not found
    const selectedLang = translations[lang] || translations.en;
    return selectedLang[key] || key;
  }

  return (
    <LanguageContext.Provider value={{lang , toggleLang ,t}}>
      {children}
    </LanguageContext.Provider>
  )
}
