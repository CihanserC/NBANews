# NBA News Hub

Live web application displaying NBA player injuries and transfer information.

## Features

- 🏥 **Current Injury Reports**: Real-time tracking of NBA players' injury status
- 🔄 **Transfer News**: Recent player transfers and team changes
- ⏱️ **Automatic Refresh**: Automatic data updates every hour
- 📊 **Statistical Summary**: View total injury and transfer numbers
- 🎨 **Modern Interface**: User-friendly and visually rich design

## Technologies

- HTML5, CSS3, JavaScript (Frontend)
- Java Spring Boot (Backend)
- Maven (Project management)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/CihanserC/nba-news-hub.git
   ```

2. Navigate to the project directory:
   ```bash
   cd nba-news-hub
   ```

3. Build with Maven:
   ```bash
   mvn clean package
   ```

4. Run the application:
   ```bash
   java -jar target/nba-news-hub-1.0.0.jar
   ```

5. Open in your browser:
   ```
   http://localhost:8080
   ```

## API Configuration

You can configure API connections in `src/main/resources/static/js/script.js`:

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