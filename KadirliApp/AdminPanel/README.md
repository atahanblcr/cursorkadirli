# KadirliApp Admin Panel

Modern ve kullanıcı dostu bir admin paneli - HTML, CSS ve Vanilla JavaScript ile geliştirilmiştir.

## Özellikler

- ✅ **Haberler (News) Yönetimi**
  - Liste görünümü
  - Yayın durumuna göre filtreleme
  - Yeni haber ekleme
  - Haber düzenleme
  - Haber silme

- ✅ **Eczaneler (Pharmacy) Yönetimi**
  - Liste görünümü
  - Nöbet tarihine göre filtreleme
  - Yeni eczane ekleme
  - Eczane düzenleme
  - Eczane silme

- ✅ **Vefat İlanları (DeathNotice) Yönetimi**
  - Liste görünümü
  - Yeni ilan ekleme
  - İlan düzenleme
  - İlan silme

- ✅ **Reklamlar (Ads) Yönetimi**
  - Liste görünümü
  - Tür bazlı filtreleme
  - Yeni reklam ekleme
  - Reklam düzenleme
  - Reklam silme

- ✅ **Kampanyalar (Campaign) Yönetimi**
  - Liste görünümü
  - Yeni kampanya ekleme
  - Kampanya düzenleme
  - Kampanya silme

- ✅ **Etkinlikler (Event) Yönetimi**
  - Liste görünümü
  - Yaklaşan etkinlikler filtreleme
  - Yeni etkinlik ekleme
  - Etkinlik düzenleme
  - Etkinlik silme

- ✅ **Yerler (Place) Yönetimi**
  - Liste görünümü
  - Yeni yer ekleme
  - Yer düzenleme
  - Yer silme

## Kullanım

1. **API'nin çalıştığından emin olun:**
   ```bash
   cd API_Deneme
   dotnet run
   ```

2. **Admin Panel'i açın:**
   - `index.html` dosyasını tarayıcıda açın
   - Veya bir web sunucusu kullanın (örn: VS Code Live Server)

3. **Yerel sunucu ile çalıştırma (önerilen):**
   ```bash
   # Python 3 ile
   python3 -m http.server 8080
   
   # Node.js ile (http-server paketi)
   npx http-server -p 8080
   ```

   Sonra tarayıcıda: `http://localhost:8080`

## Dosya Yapısı

```
AdminPanel/
├── index.html              # Ana sayfa
├── news.html               # Haberler yönetim sayfası
├── pharmacy.html           # Eczaneler yönetim sayfası
├── death-notices.html      # Vefat İlanları yönetim sayfası
├── ads.html               # Reklamlar yönetim sayfası
├── campaigns.html          # Kampanyalar yönetim sayfası
├── events.html            # Etkinlikler yönetim sayfası
├── places.html            # Yerler yönetim sayfası
├── api.js                 # API client fonksiyonları
├── news.js                # Haberler iş mantığı
├── pharmacy.js            # Eczaneler iş mantığı
├── death-notices.js       # Vefat İlanları iş mantığı
├── ads.js                 # Reklamlar iş mantığı
├── campaigns.js           # Kampanyalar iş mantığı
├── events.js              # Etkinlikler iş mantığı
├── places.js              # Yerler iş mantığı
├── styles.css             # Modern CSS tasarımı
└── README.md              # Bu dosya
```

## API Endpoints

Admin Panel şu API endpoint'lerini kullanır:

**Haberler (News):**
- `GET /api/News` - Tüm haberleri listele
- `GET /api/News/{id}` - Belirli bir haberi getir
- `POST /api/News` - Yeni haber oluştur
- `PUT /api/News/{id}` - Haber güncelle
- `DELETE /api/News/{id}` - Haber sil

**Eczaneler (Pharmacy):**
- `GET /api/Pharmacy` - Tüm eczaneleri listele
- `GET /api/Pharmacy/{id}` - Belirli bir eczaneyi getir
- `GET /api/Pharmacy/duty/{date}` - Nöbet tarihine göre filtrele
- `POST /api/Pharmacy` - Yeni eczane oluştur
- `PUT /api/Pharmacy/{id}` - Eczane güncelle
- `DELETE /api/Pharmacy/{id}` - Eczane sil

**Vefat İlanları (DeathNotice):**
- `GET /api/DeathNotice` - Tüm vefat ilanlarını listele
- `GET /api/DeathNotice/{id}` - Belirli bir ilanı getir
- `POST /api/DeathNotice` - Yeni ilan oluştur
- `PUT /api/DeathNotice/{id}` - İlan güncelle
- `DELETE /api/DeathNotice/{id}` - İlan sil

**Reklamlar (Ads):**
- `GET /api/Ads` - Tüm reklamları listele
- `GET /api/Ads/type/{type}` - Türe göre reklamları filtrele
- `GET /api/Ads/{id}` - Belirli bir reklamı getir
- `POST /api/Ads` - Yeni reklam oluştur
- `PUT /api/Ads/{id}` - Reklam güncelle
- `DELETE /api/Ads/{id}` - Reklam sil

**Kampanyalar (Campaign):**
- `GET /api/Campaigns` - Tüm kampanyaları listele
- `GET /api/Campaigns/{id}` - Belirli bir kampanyayı getir
- `POST /api/Campaigns` - Yeni kampanya oluştur
- `PUT /api/Campaigns/{id}` - Kampanya güncelle
- `DELETE /api/Campaigns/{id}` - Kampanya sil

**Etkinlikler (Event):**
- `GET /api/Events` - Tüm etkinlikleri listele
- `GET /api/Events/upcoming` - Yaklaşan etkinlikleri listele
- `GET /api/Events/{id}` - Belirli bir etkinliği getir
- `POST /api/Events` - Yeni etkinlik oluştur
- `PUT /api/Events/{id}` - Etkinlik güncelle
- `DELETE /api/Events/{id}` - Etkinlik sil

**Yerler (Place):**
- `GET /api/Places` - Tüm yerleri listele
- `GET /api/Places/{id}` - Belirli bir yeri getir
- `POST /api/Places` - Yeni yer oluştur
- `PUT /api/Places/{id}` - Yer güncelle
- `DELETE /api/Places/{id}` - Yer sil

## Özellikler

- 🎨 Modern ve responsive tasarım
- 📱 Mobil uyumlu
- ⚡ Hızlı ve hafif (Vanilla JS)
- 🔔 Bildirim sistemi
- ✅ Form validasyonu
- 🔄 Otomatik yenileme
- 🎯 Kullanıcı dostu arayüz

## Notlar

- API URL'i `api.js` dosyasında `API_BASE_URL` olarak tanımlanmıştır
- CORS hatası alırsanız, API'nin CORS ayarlarının doğru yapılandırıldığından emin olun
- Tarayıcı konsolunda hataları kontrol edebilirsiniz

