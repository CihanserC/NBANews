# NBA News Hub

NBA oyuncularının sakatlık ve transfer bilgilerini gösteren canlı bir web uygulaması.

## Özellikler

- 🏥 **Güncel Sakatlık Raporları**: NBA oyuncularının sakatlık durumlarını anlık takip etme
- 🔄 **Transfer Haberleri**: Gerçekleşen son oyuncu transferleri ve takım değişiklikleri
- ⏱️ **Otomatik Yenileme**: Her saat başı otomatik veri güncelleme
- 📊 **İstatistik Özeti**: Toplam sakatlık ve transfer sayılarını görüntüleme
- 🎨 **Modern Arayüz**: Kullanıcı dostu ve görsel açıdan zengin tasarım

## Teknolojiler

- HTML5, CSS3, JavaScript (Frontend)
- Java Spring Boot (Backend)
- Maven (Proje yönetimi)

## Kurulum

1. Repoyu klonlayın:
   ```bash
   git clone https://github.com/CihanserC/nba-news-hub.git
   ```

2. Proje dizinine gidin:
   ```bash
   cd nba-news-hub
   ```

3. Maven ile derleyin:
   ```bash
   mvn clean package
   ```

4. Uygulamayı çalıştırın:
   ```bash
   java -jar target/nba-news-hub-1.0.0.jar
   ```

5. Tarayıcınızda açın:
   ```
   http://localhost:8080
   ```

## API Yapılandırması

API bağlantılarını `src/main/resources/static/index.html` içinde ayarlayabilirsiniz:

```javascript
const API_CONFIG = {
    injuries: {
        url: '/api/injuries',
        headers: {}
    },
    transfers: {
        url: '/api/transfers',
        headers: {}
    }
};
```

## GitHub Pages Dağıtımı

Uygulamayı GitHub Pages üzerinde çalıştırmak için:

1. API konfigürasyonunu statik verilere yönlendirin:
   ```javascript
   const API_CONFIG = {
       injuries: {
           url: 'data/injuries.json',
           headers: {}
       },
       transfers: {
           url: 'data/transfers.json',
           headers: {}
       }
   };
   ```

2. `data` klasörü oluşturun ve statik JSON dosyaları ekleyin
3. GitHub repository ayarlarından Pages özelliğini aktifleştirin

## Geliştirici

Bu proje Cihanser Caliskan tarafından geliştirilmiştir.