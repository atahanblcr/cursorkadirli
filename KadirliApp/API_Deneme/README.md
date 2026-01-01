# KadirliApp API - ASP.NET Core Web API

Bu proje, KadirliApp iOS uygulaması için ASP.NET Core Web API backend'idir. SQLite veritabanı kullanır.

## Proje Yapısı

```
API_Deneme/
├── Models/              # C# Entity Modelleri
│   ├── News.cs
│   ├── Pharmacy.cs
│   ├── DeathNotice.cs
│   ├── Ad.cs
│   ├── AdType.cs
│   ├── Campaign.cs
│   ├── Event.cs
│   └── Place.cs
├── Data/
│   └── ApplicationDbContext.cs
├── Controllers/         # API Endpoints
│   ├── NewsController.cs
│   ├── PharmacyController.cs
│   ├── DeathNoticeController.cs
│   ├── AdsController.cs
│   ├── CampaignsController.cs
│   ├── EventsController.cs
│   └── PlacesController.cs
├── Program.cs           # Startup ve SQLite Configuration
└── appsettings.json     # Connection String
```

## Kurulum

### 1. .NET 8.0 SDK Kurulumu (macOS)

.NET SDK yüklü değilse, aşağıdaki yöntemlerden birini kullanarak kurabilirsiniz:

#### Homebrew ile Kurulum (Önerilen)
```bash
brew install --cask dotnet-sdk
```

#### Manuel Kurulum
1. [.NET 8.0 SDK İndirme Sayfası](https://dotnet.microsoft.com/download/dotnet/8.0)'na gidin
2. macOS için `.pkg` dosyasını indirin ve kurun
3. Kurulum sonrası terminal'i yeniden başlatın

#### Kurulum Kontrolü
```bash
dotnet --version
```
Bu komut `.NET SDK 8.0.x` gibi bir versiyon numarası döndürmelidir.

### 2. Projeyi Çalıştırma

Proje dizininde terminal açın:
```bash
cd API_Deneme
dotnet restore
dotnet run
```

## API Endpoints

### News
- `GET /api/News` - Tüm haberleri listele
- `GET /api/News/{id}` - Belirli bir haberi getir
- `POST /api/News` - Yeni haber oluştur
- `PUT /api/News/{id}` - Haber güncelle
- `DELETE /api/News/{id}` - Haber sil

### Pharmacy
- `GET /api/Pharmacy` - Tüm eczaneleri listele
- `GET /api/Pharmacy/{id}` - Belirli bir eczaneyi getir
- `GET /api/Pharmacy/duty/{date}` - Belirli bir tarihteki nöbetçi eczaneleri getir
- `POST /api/Pharmacy` - Yeni eczane oluştur
- `PUT /api/Pharmacy/{id}` - Eczane güncelle
- `DELETE /api/Pharmacy/{id}` - Eczane sil

### DeathNotice
- `GET /api/DeathNotice` - Tüm vefat ilanlarını listele
- `GET /api/DeathNotice/{id}` - Belirli bir vefat ilanını getir
- `POST /api/DeathNotice` - Yeni vefat ilanı oluştur
- `PUT /api/DeathNotice/{id}` - Vefat ilanı güncelle
- `DELETE /api/DeathNotice/{id}` - Vefat ilanı sil

### Ads
- `GET /api/Ads` - Aktif ilanları listele
- `GET /api/Ads/{id}` - Belirli bir ilanı getir
- `GET /api/Ads/type/{adType}` - Türe göre ilanları listele
- `POST /api/Ads` - Yeni ilan oluştur
- `PUT /api/Ads/{id}` - İlan güncelle
- `DELETE /api/Ads/{id}` - İlan sil

### Campaigns
- `GET /api/Campaigns` - Tüm kampanyaları listele
- `GET /api/Campaigns/{id}` - Belirli bir kampanyayı getir
- `POST /api/Campaigns` - Yeni kampanya oluştur
- `PUT /api/Campaigns/{id}` - Kampanya güncelle
- `DELETE /api/Campaigns/{id}` - Kampanya sil

### Events
- `GET /api/Events` - Aktif etkinlikleri listele
- `GET /api/Events/{id}` - Belirli bir etkinliği getir
- `GET /api/Events/upcoming` - Yaklaşan etkinlikleri listele
- `POST /api/Events` - Yeni etkinlik oluştur
- `PUT /api/Events/{id}` - Etkinlik güncelle
- `DELETE /api/Events/{id}` - Etkinlik sil

### Places
- `GET /api/Places` - Tüm yerleri listele (mesafeye göre sıralı)
- `GET /api/Places/{id}` - Belirli bir yeri getir
- `POST /api/Places` - Yeni yer oluştur
- `PUT /api/Places/{id}` - Yer güncelle
- `DELETE /api/Places/{id}` - Yer sil

## Veritabanı

- SQLite veritabanı kullanılır
- Veritabanı dosyası: `kadirli.db` (proje root dizininde oluşturulur)
- İlk çalıştırmada tablolar otomatik oluşturulur (`EnsureCreated()`)

## CORS

API, iOS uygulamasından erişim için CORS yapılandırılmıştır (tüm origin'lere izin verir).

## Swagger

Development modunda Swagger UI erişilebilir:
- `http://localhost:5000/swagger` veya
- `https://localhost:5001/swagger`

## Notlar

- Guid'ler SQLite'da TEXT olarak saklanır
- Tarih alanları UTC olarak saklanır
- ImageUrls alanları JSON array olarak TEXT tipinde saklanır
- AdType enum değerleri: Job, Service, Tender, RealEstate, Vehicle, SecondHand, Animals, SpareParts

