# Yetki Kontrolü Güncellemeleri

Tüm CRUD sayfalarına yetki kontrolleri eklendi. Her sayfa için aynı pattern kullanıldı:

## Yapılan Güncellemeler

### Backend (API)
- ✅ User modeli eklendi (4 rol: Admin, ReadOnlyAdmin, Creator, Deletor)
- ✅ AuthController eklendi (login, register, user management)
- ✅ İlk admin kullanıcısı otomatik oluşturuluyor (admin/admin123)

### Frontend
- ✅ login.html - Giriş sayfası
- ✅ auth.js - Authentication & Authorization yönetimi
- ✅ users.html/js - Kullanıcı yönetimi (sadece admin)
- ✅ index.html - Ana sayfa (kullanıcı yönetimi kartı eklendi)

### CRUD Sayfaları
Her sayfa için şunlar eklendi:
1. HTML'de "Ekle" butonuna `id="addBtn"` ve `style="display: none;"`
2. HTML'de `auth.js` import edildi
3. JS'de tablo butonları yetkiye göre gösteriliyor
4. Fonksiyonlarda yetki kontrolleri eklendi:
   - `openAddModal()` - canCreate() kontrolü
   - `editX()` - canEdit() kontrolü  
   - `saveX()` - canCreate() veya canEdit() kontrolü
   - `deleteX()` - canDelete() kontrolü

## Rol Yetkileri

- **Admin (0)**: Tüm yetkiler + kullanıcı yönetimi
- **ReadOnlyAdmin (1)**: Sadece görüntüleme
- **Creator (2)**: Görüntüleme + Ekleme + Düzenleme
- **Deletor (3)**: Görüntüleme + Silme

## Varsayılan Kullanıcı

- **Kullanıcı Adı**: admin
- **Şifre**: admin123
- **Rol**: Admin

