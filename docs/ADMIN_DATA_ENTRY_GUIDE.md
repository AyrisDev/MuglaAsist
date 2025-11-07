# Muğla Asistanı - Admin Panel Veri Giriş Kılavuzu

Bu kılavuz, Muğla Asistanı admin paneline veri girişi için detaylı adım adım talimatlar içerir.

## 📋 İçindekiler

1. [Kategoriler](#1-kategoriler)
2. [Mekanlar (İşletmeler)](#2-mekanlar-i̇şletmeler)
3. [Menü Öğeleri](#3-menü-öğeleri)
4. [Servisler (Otobüs & Yemekhane)](#4-servisler-otobüs--yemekhane)
5. [Etkinlikler](#5-etkinlikler)
6. [İndirimler & Fırsatlar](#6-i̇ndirimler--fırsatlar)
7. [Google Maps Konum Bilgisi Alma](#7-google-maps-konum-bilgisi-alma)
8. [Fotoğraf Yükleme İpuçları](#8-fotoğraf-yükleme-i̇puçları)

---

## 1. Kategoriler

Kategoriler, mekanların gruplandırılmasını sağlar (Kahveciler, Fast Food, Restoranlar vb.).

### Kategori Ekleme Adımları

1. **Admin Panel'e giriş yapın**: `http://localhost:3001/login`
2. Sol menüden **"Kategoriler"** sekmesine tıklayın
3. Sağ üstteki **"Yeni Kategori Ekle"** butonuna tıklayın
4. Formu doldurun:

| Alan | Açıklama | Örnek | Zorunlu |
|------|----------|-------|---------|
| **Kategori Adı** | Kategori ismi | "Kahveciler" | ✅ Evet |
| **İkon (Emoji)** | Kategoriyi temsil eden emoji | ☕ | ✅ Evet |
| **Görüntüleme Sırası** | Kategorilerin sırası (0'dan başlar) | 0, 1, 2... | ✅ Evet |
| **Aktif** | Kategori gösterilsin mi? | ✅ İşaretli | - |

### Emoji Seçimi

Formda hazır emoji seçenekleri bulunur:
- 🍔 (Hamburger - Fast Food)
- ☕ (Kahve - Kafeler)
- 🍕 (Pizza - Pizzacılar)
- 🍜 (Çorba - Restoranlar)
- 🍰 (Pasta - Tatlıcılar)
- 🥤 (İçecek - Bar/Cafe)
- 🍗 (Tavuk - Tavukçular)
- 🥗 (Salata - Sağlıklı Yemek)

> 💡 **İpucu**: İsterseniz başka bir emoji de girebilirsiniz! Windows'ta `Win + .` veya Mac'te `Cmd + Ctrl + Space` ile emoji seçiciyi açabilirsiniz.

### Sıralama Mantığı

- **0**: İlk sırada gösterilir
- **1**: İkinci sırada
- **2**: Üçüncü sırada
- vb.

### Örnek Kategori Girişi

```
Kategori Adı: Kahveciler
İkon: ☕
Görüntüleme Sırası: 0
Aktif: ✅
```

---

## 2. Mekanlar (İşletmeler)

Mekanlar, öğrencilerin kullanabileceği işletmelerdir (kafeler, restoranlar, marketler vb.).

### Mekan Ekleme Adımları

1. Sol menüden **"Mekanlar"** sekmesine tıklayın
2. **"Yeni Mekan Ekle"** butonuna tıklayın
3. Formu bölümler halinde doldurun:

### 📝 Temel Bilgiler

| Alan | Açıklama | Örnek | Zorunlu |
|------|----------|-------|---------|
| **Mekan Adı** | İşletme adı | "Starbucks" | ✅ Evet |
| **Kategori** | Mekanın kategorisi | "Kahveciler" | ✅ Evet |
| **Açıklama** | Mekan hakkında kısa bilgi | "Kampüsteki en popüler kahve dükkanı" | - |

### 🖼️ Fotoğraflar

| Alan | Açıklama | Boyut | Zorunlu |
|------|----------|-------|---------|
| **Logo** | Mekanın logosu (kare/yuvarlak olmalı) | Max 5MB | - |
| **Kapak Fotoğrafı** | Mekanın dış veya iç mekan fotoğrafı | Max 5MB | - |

> 💡 **İpucu**: Logo için 500x500px, kapak için 1200x600px ideal boyutlardır.

### 📞 İletişim Bilgileri

| Alan | Açıklama | Örnek | Zorunlu |
|------|----------|-------|---------|
| **Telefon** | Mekanın telefon numarası | `05551234567` | - |
| **Konum** | Google Maps linki | `https://maps.google.com/?q=37.123,28.456` | - |

**Telefon Format Kuralları:**
- ✅ Kabul edilen formatlar: `05551234567`, `5551234567`, `+905551234567`
- ❌ Hatalı formatlar: `0555 123 45 67`, `0555-123-4567`
- Sistem otomatik olarak boşluk ve tireleri temizler

**Konum Bilgisi Nasıl Alınır?**
[Google Maps Konum Bilgisi Alma](#7-google-maps-konum-bilgisi-alma) bölümüne bakın.

### ⏰ Çalışma Saatleri

Çalışma saatleri mekanın hangi günler açık olduğunu ve ne zaman kapandığını belirler.

**Her gün için:**
1. Günü aktif etmek için checkbox'ı işaretleyin
2. Açılış saati girin (örn: `09:00`)
3. Kapanış saati girin (örn: `23:00`)
4. Eğer kapanış saati ertesi güne geçiyorsa **"Ertesi gün"** checkbox'ını işaretleyin

#### Örnek 1: Normal Çalışma Saatleri
```
✅ Pazartesi: 09:00 - 18:00
✅ Salı: 09:00 - 18:00
✅ Çarşamba: 09:00 - 18:00
✅ Perşembe: 09:00 - 18:00
✅ Cuma: 09:00 - 18:00
✅ Cumartesi: 10:00 - 16:00
❌ Pazar: (Kapalı)
```

#### Örnek 2: Gece Geç Saate Kadar Açık
```
✅ Pazartesi: 10:00 - 02:00 ✅ Ertesi gün
✅ Salı: 10:00 - 02:00 ✅ Ertesi gün
✅ Çarşamba: 10:00 - 02:00 ✅ Ertesi gün
```

> ⚠️ **Önemli**: "Ertesi gün" seçeneği, kapanış saatinin ertesi güne geçtiğini belirtir. Örneğin Pazartesi 23:00'te açılan ve Salı 02:00'de kapanan bir mekan için Pazartesi'de "Ertesi gün" işaretlenmelidir.

#### Örnek 3: 7/24 Açık
```
✅ Pazartesi: 00:00 - 23:59
✅ Salı: 00:00 - 23:59
... (tüm günler aynı)
```

#### Örnek 4: Sadece Hafta İçi
```
✅ Pazartesi: 08:00 - 18:00
✅ Salı: 08:00 - 18:00
✅ Çarşamba: 08:00 - 18:00
✅ Perşembe: 08:00 - 18:00
✅ Cuma: 08:00 - 18:00
❌ Cumartesi: (Kapalı)
❌ Pazar: (Kapalı)
```

### ⚙️ Durum

| Alan | Açıklama |
|------|----------|
| **Öne Çıkan Mekan** | Ana sayfada öne çıkarılsın mı? |
| **Aktif** | Mekan mobil uygulamada gösterilsin mi? |

### Tam Örnek Mekan Girişi

```
--- TEMEL BİLGİLER ---
Mekan Adı: Starbucks Muğla
Kategori: Kahveciler
Açıklama: Kampüsün en sevilen kahve dükkanı. Sıcak ve soğuk içecekler, tatlı seçenekleri.

--- FOTOĞRAFLAR ---
Logo: [starbucks-logo.png dosyasını yükle]
Kapak: [starbucks-cover.jpg dosyasını yükle]

--- İLETİŞİM ---
Telefon: 05321234567
Konum: https://maps.google.com/?q=37.1534,28.3662

--- ÇALIŞMA SAATLERİ ---
✅ Pazartesi: 08:00 - 22:00
✅ Salı: 08:00 - 22:00
✅ Çarşamba: 08:00 - 22:00
✅ Perşembe: 08:00 - 22:00
✅ Cuma: 08:00 - 23:00
✅ Cumartesi: 09:00 - 23:00
✅ Pazar: 10:00 - 21:00

--- DURUM ---
Öne Çıkan: ✅
Aktif: ✅
```

---

## 3. Menü Öğeleri

Menü öğeleri, mekanların sattığı ürünlerdir.

### Menü Öğesi Ekleme Adımları

1. Sol menüden **"Menü Öğeleri"** sekmesine tıklayın
2. **"Yeni Menü Öğesi Ekle"** butonuna tıklayın

### 📝 Temel Bilgiler

| Alan | Açıklama | Örnek | Zorunlu |
|------|----------|-------|---------|
| **Ürün Adı** | Ürünün adı | "Americano" | ✅ Evet |
| **Mekan** | Hangi mekana ait | "Starbucks" | ✅ Evet |
| **Kategori** | Menü kategorisi | "Sıcak İçecekler" | - |
| **Açıklama** | Ürün açıklaması | "Yoğun aromalı espresso ve sıcak su" | - |
| **Fiyat** | Ürün fiyatı (TL) | `45.00` | ✅ Evet |

### Menü Kategorileri

Sistemde hazır tanımlı kategoriler:
- **Ana Yemekler**
- **Başlangıçlar**
- **Salatalar**
- **İçecekler**
- **Sıcak İçecekler**
- **Tatlılar**
- **Atıştırmalıklar**
- **Pizzalar**
- **Burgerler**
- **Sandviçler**
- **Kahvaltı**
- **Diğer**

### 🖼️ Ürün Fotoğrafı

- Ürün fotoğrafı yükleyin (opsiyonel)
- Önerilen boyut: 800x800px
- Max boyut: 5MB

### ⚙️ Durum

| Alan | Açıklama |
|------|----------|
| **Mevcut** | Ürün şu anda satışta mı? (Tükendiyse kaldırın) |
| **Onaylı** | AI menü onayı için kullanılır |

> 💡 **İpucu**: "Onaylı" özelliği, gelecekte AI ile menü doğrulaması için kullanılacaktır. Şimdilik manuel olarak işaretleyebilirsiniz.

### Örnek Menü Öğesi Girişi

```
--- TEMEL BİLGİLER ---
Ürün Adı: Filtre Kahve
Mekan: Starbucks Muğla
Kategori: Sıcak İçecekler
Açıklama: Günün taze çekilmiş kahvesi. Tall, Grande ve Venti boyutlarında.
Fiyat: 38.50

--- FOTOĞRAF ---
[filtre-kahve.jpg dosyasını yükle]

--- DURUM ---
Mevcut: ✅
Onaylı: ✅
```

### Toplu Menü Girişi İpuçları

Aynı mekana çok sayıda ürün girecekseniz:

1. İlk ürünü tam olarak girin
2. Sonraki ürünler için sadece farklı alanları değiştirin
3. "Mekan" seçimini değiştirmeyi unutmayın (varsayılan olarak son seçili mekan gelir)

---

## 4. Servisler (Otobüs & Yemekhane)

Servisler, otobüs saatleri, yemekhane menüsü gibi bilgileri içerir.

### Servis Ekleme Adımları

1. Sol menüden **"Servisler"** sekmesine tıklayın
2. **"Yeni Servis Ekle"** butonuna tıklayın

### 📝 Form Alanları

| Alan | Açıklama | Örnek | Zorunlu |
|------|----------|-------|---------|
| **Anahtar (Key)** | Sistemde kullanılacak benzersiz anahtar | `bus-schedule` | ✅ Evet |
| **Başlık** | Kullanıcıya gösterilecek başlık | "Otobüs Saatleri" | ✅ Evet |
| **İçerik (Markdown)** | Markdown formatında içerik | Aşağıda örnek | ✅ Evet |
| **Metadata (JSON)** | Ekstra veriler (ikon, renk vs.) | `{"icon": "🚌"}` | - |
| **Aktif** | Servis gösterilsin mi? | ✅ İşaretli | - |

### Anahtar (Key) Örnekleri

- `bus-ring` - Ring Otobüs Saatleri
- `bus-center` - Merkez Otobüs Saatleri
- `cafeteria-menu` - Yemekhane Menüsü
- `shuttle-times` - Servis Saatleri

> ⚠️ **Önemli**: Anahtar sadece küçük harf, rakam, tire (-) ve alt çizgi (_) içerebilir. Boşluk kullanmayın!

### Markdown İçerik Yazımı

Markdown, metin biçimlendirme için basit bir dildir. Mobil uygulamada otomatik olarak güzel görünecektir.

#### Markdown Sözdizimi Örnekleri

```markdown
# Ana Başlık

## Alt Başlık

### Daha Küçük Başlık

**Kalın yazı**

*İtalik yazı*

- Liste öğesi 1
- Liste öğesi 2
- Liste öğesi 3

1. Numaralı liste 1
2. Numaralı liste 2

[Link metni](https://ornek.com)
```

### Örnek 1: Ring Otobüs Saatleri

```
--- FORM ---
Anahtar: bus-ring
Başlık: Ring Otobüs Saatleri
Aktif: ✅

--- İÇERİK (Markdown) ---
# Ring Otobüs Saatleri

Kampüs içi ring seferleri hafta içi her gün düzenli olarak yapılmaktadır.

## Sabah Seferleri

- 08:00 - Kampüs Girişi
- 08:15 - Fakülteler
- 08:30 - Yurtlar
- 08:45 - Spor Salonu

## Öğle Seferleri

- 12:00 - Kampüs Girişi
- 12:15 - Fakülteler
- 12:30 - Yurtlar

## Akşam Seferleri

- 17:00 - Kampüs Girişi
- 17:15 - Fakülteler
- 17:30 - Yurtlar
- 17:45 - Spor Salonu

**Not:** Hafta sonu sefer saatleri farklıdır.

--- METADATA (JSON) ---
{
  "icon": "🚌",
  "color": "#3B82F6"
}
```

### Örnek 2: Yemekhane Menüsü

```
--- FORM ---
Anahtar: cafeteria-menu
Başlık: Haftalık Yemekhane Menüsü
Aktif: ✅

--- İÇERİK (Markdown) ---
# Bu Haftanın Menüsü

## Pazartesi

**Öğle:**
- Mercimek Çorbası
- Tavuk Sote
- Pilav
- Ayran

**Akşam:**
- Tarhana Çorbası
- Köfte
- Makarna
- Ayran

## Salı

**Öğle:**
- Ezogelin Çorbası
- Sebze Yemeği
- Bulgur Pilavı
- Ayran

**Akşam:**
- Domates Çorbası
- Tavuk Döner
- Patates Kızartması
- Ayran

... (diğer günler)

---

*Menü değişiklik gösterebilir.*

--- METADATA (JSON) ---
{
  "icon": "🍽️",
  "color": "#10B981",
  "last_updated": "2025-01-15"
}
```

### Metadata JSON Örnekleri

```json
{
  "icon": "🚌",
  "color": "#3B82F6",
  "priority": 1
}
```

```json
{
  "icon": "🍽️",
  "color": "#10B981",
  "last_updated": "2025-01-15",
  "contact": "yemekhane@mu.edu.tr"
}
```

> 💡 **İpucu**: JSON formatı doğru olmalıdır. Kaydetmeden önce test edin. Yanlış JSON hata verecektir.

---

## 5. Etkinlikler

Kampüste düzenlenecek etkinlikleri buradan ekleyebilirsiniz.

### Etkinlik Ekleme Adımları

1. Sol menüden **"Etkinlikler"** sekmesine tıklayın
2. **"Yeni Etkinlik Ekle"** butonuna tıklayın

### 📝 Form Alanları

| Alan | Açıklama | Örnek | Zorunlu |
|------|----------|-------|---------|
| **Etkinlik Başlığı** | Etkinliğin adı | "Bahar Şenliği 2025" | ✅ Evet |
| **Açıklama** | Detaylı açıklama | "Kampüsümüzde düzenlenecek geleneksel bahar şenliği..." | ✅ Evet |
| **Etkinlik Tarihi ve Saati** | Ne zaman yapılacak | `2025-05-15 14:00` | ✅ Evet |
| **Konum** | Nerede yapılacak | "Kampüs Ana Bahçesi" | - |
| **Etkinlik Görseli** | Poster veya tanıtım görseli | Max 5MB | - |
| **Aktif** | Etkinlik gösterilsin mi? | ✅ İşaretli | - |

### Tarih ve Saat Girişi

- Tarayıcınızın tarih seçicisini kullanın
- Format: `YYYY-AA-GG SS:DD` (örn: `2025-05-15 14:00`)
- Geçmiş tarihli etkinlikler de eklenebilir (arşiv için)

### Örnek Etkinlik Girişi

```
--- TEMEL BİLGİLER ---
Etkinlik Başlığı: Bahar Şenliği 2025
Açıklama: Kampüsümüzde düzenlenecek geleneksel bahar şenliğinde konserler,
          yarışmalar ve eğlenceli aktiviteler sizi bekliyor!
Etkinlik Tarihi: 2025-05-15 14:00
Konum: Kampüs Ana Bahçesi

--- GÖRSEL ---
[bahar-senligi-poster.jpg dosyasını yükle]

--- DURUM ---
Aktif: ✅
```

### Etkinlik Yönetim İpuçları

- **Gelecek Etkinlikler**: Aktif olarak işaretleyin
- **Geçmiş Etkinlikler**: Aktif durumunu kaldırarak gizleyin (veya silin)
- **Düzenli Etkinlikler**: Her yıl/ay için ayrı kayıt oluşturun

---

## 6. İndirimler & Fırsatlar

Mekanların sunduğu özel indirimler ve kampanyalar.

### İndirim Ekleme Adımları

1. Sol menüden **"İndirimler"** sekmesine tıklayın
2. **"Yeni İndirim Ekle"** butonuna tıklayın

### 📝 Form Alanları

| Alan | Açıklama | Örnek | Zorunlu |
|------|----------|-------|---------|
| **Mekan** | Hangi mekan sunuyor | "Starbucks" | ✅ Evet |
| **Fırsat Başlığı (TR)** | Türkçe başlık | "Öğrenci İndirimi" | ✅ Evet |
| **Fırsat Başlığı (EN)** | İngilizce başlık | "Student Discount" | - |
| **Açıklama (TR)** | Türkçe detay | "Tüm içeceklerde %20 öğrenci indirimi" | ✅ Evet |
| **Açıklama (EN)** | İngilizce detay | "20% student discount on all drinks" | - |
| **İndirim Yüzdesi** | Yüzde olarak | `20` | - |
| **Şartlar ve Koşullar** | Kullanım şartları | "Öğrenci kimliği gösterilmelidir" | - |
| **Başlangıç Tarihi** | İndirimin başlama tarihi | `2025-01-01 00:00` | ✅ Evet |
| **Bitiş Tarihi** | İndirimin bitiş tarihi | `2025-06-30 23:59` | ✅ Evet |
| **Fırsat Görseli** | Kampanya görseli | Max 5MB | - |
| **Aktif** | İndirim gösterilsin mi? | ✅ İşaretli | - |

### İndirim Yüzdesi

- 0 ile 100 arası bir sayı girin
- Sabit fiyat indirimi yoksa boş bırakabilirsiniz
- Örnek: `10`, `15`, `20`, `50`

### Geçerlilik Tarihleri

- **Başlangıç**: İndirimin ne zaman başlayacağı
- **Bitiş**: İndirimin ne zaman sona ereceği
- Sistem otomatik olarak tarihleri kontrol eder
- Bitiş tarihi başlangıçtan önce olamaz

### Örnek İndirim Girişi

```
--- TEMEL BİLGİLER ---
Mekan: Starbucks Muğla
Fırsat Başlığı (TR): Öğrenci İndirimi
Fırsat Başlığı (EN): Student Discount
Açıklama (TR): Tüm sıcak içeceklerde geçerli %20 öğrenci indirimi.
                Öğrenci kimliği göstermeniz yeterli!
Açıklama (EN): 20% student discount on all hot beverages.
                Just show your student ID!
İndirim Yüzdesi: 20
Şartlar: Öğrenci kimliği gösterilmelidir. Diğer kampanyalarla birleştirilemez.

--- GEÇERLİLİK TARİHLERİ ---
Başlangıç: 2025-02-01 00:00
Bitiş: 2025-06-30 23:59

--- GÖRSEL ---
[ogrenci-indirimi.jpg dosyasını yükle]

--- DURUM ---
Aktif: ✅
```

### İndirim Yönetim İpuçları

**Sürekli İndirimler:**
```
Başlangıç: 2025-01-01 00:00
Bitiş: 2025-12-31 23:59
```

**Kısa Süreli Kampanyalar:**
```
Başlangıç: 2025-03-15 00:00
Bitiş: 2025-03-22 23:59
```

**Otomatik Geçersiz Hale Gelme:**
- Bitiş tarihi geçen indirimler otomatik olarak mobil uygulamada gizlenir
- Eski indirimleri silmek veya pasif yapmak için "Aktif" durumunu kaldırın

---

## 7. Google Maps Konum Bilgisi Alma

Mekanlar için doğru konum bilgisi almak için:

### Yöntem 1: Google Maps'ten Link Kopyalama

1. **Google Maps'i açın**: [maps.google.com](https://maps.google.com)
2. **Mekanı arayın** veya haritada bulun
3. Mekana sağ tıklayın
4. **"Bu konumla ilgili ne var?"** seçeneğine tıklayın
5. Altta çıkan koordinatları kopyalayın (örn: `37.1534, 28.3662`)
6. Admin panelde şu formatta girin: `https://maps.google.com/?q=37.1534,28.3662`

### Yöntem 2: Paylaş Butonu ile

1. **Google Maps'te mekanı bulun**
2. **"Paylaş"** butonuna tıklayın
3. **"Link kopyala"** seçeneğine tıklayın
4. Kopyalanan linki admin panele yapıştırın

Örnek link:
```
https://maps.google.com/?q=37.1534,28.3662
```

veya

```
https://maps.app.goo.gl/ABC123xyz
```

> 💡 **İpucu**: Her iki format da çalışır, ancak koordinat formatı (`?q=37.1534,28.3662`) daha kararlıdır.

### Yöntem 3: Koordinatları Manuel Girme

Eğer koordinatları biliyorsanız:

```
Format: https://maps.google.com/?q=ENLEM,BOYLAM
Örnek: https://maps.google.com/?q=37.1534,28.3662
```

---

## 8. Fotoğraf Yükleme İpuçları

### Desteklenen Formatlar

- ✅ **JPG / JPEG**
- ✅ **PNG**
- ✅ **WebP**
- ❌ GIF, BMP, TIFF (desteklenmiyor)

### Dosya Boyutu

- **Maksimum**: 5MB
- **Önerilen**: 1-2MB (hızlı yükleme için)

### Önerilen Çözünürlükler

| Fotoğraf Türü | Önerilen Boyut | En Küçük Boyut | Oran |
|---------------|----------------|----------------|------|
| **Mekan Logosu** | 500x500px | 200x200px | 1:1 (Kare) |
| **Mekan Kapak** | 1200x600px | 800x400px | 2:1 |
| **Menü Öğesi** | 800x800px | 400x400px | 1:1 (Kare) |
| **Etkinlik** | 1200x630px | 800x420px | 1.91:1 |
| **İndirim** | 1080x1080px | 600x600px | 1:1 (Kare) |

### Fotoğraf Optimizasyonu

**Fotoğrafları yüklemeden önce:**

1. **Online Araçlar** (Ücretsiz):
   - [TinyPNG](https://tinypng.com) - PNG ve JPG sıkıştırma
   - [Squoosh](https://squoosh.app) - Gelişmiş sıkıştırma
   - [iLoveIMG](https://www.iloveimg.com/tr) - Yeniden boyutlandırma

2. **Mobil Uygulamalar**:
   - Adobe Lightroom (iOS/Android) - Ücretsiz
   - Snapseed (iOS/Android) - Ücretsiz
   - Photo Resizer (Android) - Ücretsiz

### Fotoğraf İsimlendirme

Dosyalarınızı anlamlı şekilde isimlendirin:

✅ **İyi örnekler:**
```
starbucks-logo.jpg
starbucks-kapak-foto.jpg
americano-menu.jpg
bahar-senligi-poster.jpg
```

❌ **Kötü örnekler:**
```
IMG_1234.jpg
photo.jpg
resim.jpg
WhatsApp Image 2025.jpg
```

### Fotoğraf Kalitesi İpuçları

1. **İyi Işıklandırma**: Doğal ışık tercih edin
2. **Net Çekim**: Bulanık fotoğraflardan kaçının
3. **Doğru Çerçeveleme**: Konuyu merkeze alın
4. **Yüksek Çözünürlük**: Düşük kaliteli fotoğraflar mobilde kötü görünür
5. **Arka Plan**: Sade ve temiz arka plan tercih edin

### Fotoğraf Yükleme Süreci

1. **Fotoğraf alanına tıklayın**
2. **Bilgisayarınızdan dosya seçin**
3. **Önizlemeyi kontrol edin**
4. **Gerekirse kaldırıp yeniden yükleyin** (sağ üstteki ❌ butonu)
5. **Formu kaydedin**

> ⚠️ **Dikkat**: Fotoğrafı yükledikten sonra formun tamamını kaydetmeyi unutmayın! Aksi halde fotoğraf kaydedilmez.

---

## 🎯 Hızlı Başlangıç Kontrol Listesi

Yeni bir admin olarak başlarken şu sırayı izleyin:

### ✅ Adım 1: Kategorileri Oluşturun
- [ ] Kahveciler
- [ ] Fast Food
- [ ] Restoranlar
- [ ] Marketler
- [ ] Diğer kategoriler

### ✅ Adım 2: İlk Mekanı Ekleyin
- [ ] Temel bilgiler
- [ ] Logo ve kapak fotoğrafı
- [ ] Telefon ve konum
- [ ] Çalışma saatleri
- [ ] Aktif olarak işaretleyin

### ✅ Adım 3: Menü Öğelerini Ekleyin
- [ ] En az 5-10 popüler ürün
- [ ] Fiyatları doğru girin
- [ ] Kategorilere ayırın
- [ ] Fotoğrafları ekleyin

### ✅ Adım 4: Servisleri Ayarlayın
- [ ] Otobüs saatlerini ekleyin
- [ ] Yemekhane menüsünü ekleyin
- [ ] Düzenli güncelleyin

### ✅ Adım 5: Etkinlik ve İndirimleri Ekleyin
- [ ] Yaklaşan etkinlikleri girin
- [ ] Aktif indirimleri ekleyin
- [ ] Tarih aralıklarını kontrol edin

---

## 🆘 Sık Sorulan Sorular

### S: Fotoğraf yükleme hatası alıyorum

**C:** Şunları kontrol edin:
- Dosya boyutu 5MB'den küçük mü?
- Dosya formatı JPG, PNG veya WebP mi?
- İnternet bağlantınız çalışıyor mu?

### S: Çalışma saatleri doğru görünmüyor

**C:**
- "Ertesi gün" checkbox'ını kontrol edin
- Kapanış saati açılıştan sonra mı?
- Tüm günleri kaydettiğinize emin olun

### S: Mekan haritada görünmüyor

**C:**
- Google Maps linki doğru formatta mı?
- Link çalışıyor mu? (tarayıcıda test edin)
- `https://` ile başlıyor mu?

### S: Kategori sıralaması değişmiyor

**C:**
- "Görüntüleme Sırası" değerlerini kontrol edin
- Sayılar farklı mı? (0, 1, 2...)
- Sayfayı yenileyip tekrar deneyin

### S: Menü öğesi silinmiyor

**C:**
- Yetkilerinizi kontrol edin
- Öğe başka bir yerden referans ediliyor olabilir
- Önce "Aktif" durumunu kaldırıp gizleyin

### S: İndirim mobilde görünmüyor

**C:**
- "Aktif" durumu işaretli mi?
- Geçerlilik tarihleri doğru mu?
- Bugünün tarihi başlangıç ve bitiş arasında mı?

---

## 📞 Destek

Sorun yaşarsanız:

- **Teknik Destek**: admin@mu.edu.tr
- **Acil Durumlar**: +90 XXX XXX XX XX

---

**Son Güncelleme**: 2025-01-15
**Versiyon**: 1.0.0

