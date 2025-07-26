package org.nbanews.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SportradarController {

    private final String API_KEY = "TfRDPajjc71WjB8wHg1WUytBpqgGAWISm7QX87GW";
    private final RestTemplate restTemplate = new RestTemplate();
    private final Logger logger = LoggerFactory.getLogger(SportradarController.class);

    @GetMapping("/injuries")
    public ResponseEntity<?> getInjuries() {
        String url = "https://api.sportradar.com/nba/trial/v8/en/league/2025/03/20/daily_injuries.json";

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("x-api-key", API_KEY);
            headers.set("accept", "application/json");

            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

            logger.info("Sending request to Sportradar API: {}", url);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, requestEntity, String.class);

            logger.info("API response received: {}", response.getStatusCode());
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            logger.error("Error during API request: {}", e.getMessage());
            Map<String, Object> mockResponse = new HashMap<>();
            mockResponse.put("error", e.getMessage());
            mockResponse.put("daily_injuries", generateMockInjuries());

            return ResponseEntity.status(HttpStatus.OK).body(mockResponse);
        }
    }

    @GetMapping("/transfers")
    public ResponseEntity<?> getTransfers() {
        String url = "https://api.sportradar.com/nba/trial/v8/en/league/2025/01/06/transfers.json";

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("x-api-key", API_KEY);
            headers.set("accept", "application/json");

            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

            logger.info("Sending request to Sportradar API: {}", url);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, requestEntity, String.class);

            logger.info("API response received: {}", response.getStatusCode());
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            logger.error("Error during API request: {}", e.getMessage());

            Map<String, Object> mockResponse = new HashMap<>();
            mockResponse.put("error", e.getMessage());
            mockResponse.put("transfers", generateMockTransfers());

            return ResponseEntity.status(HttpStatus.OK).body(mockResponse);
        }
    }

    private List<Map<String, Object>> generateMockInjuries() {
        List<Map<String, Object>> injuries = new ArrayList<>();

        Map<String, Object> injury1 = new HashMap<>();
        injury1.put("player_name", "LeBron James");
        injury1.put("team_name", "Los Angeles Lakers");
        injury1.put("injury", "Knee Soreness");
        injury1.put("status", "Day-to-Day");
        injury1.put("date", LocalDate.now().toString());

        Map<String, Object> injury2 = new HashMap<>();
        injury2.put("player_name", "Giannis Antetokounmpo");
        injury2.put("team_name", "Milwaukee Bucks");
        injury2.put("injury", "Ankle Sprain");
        injury2.put("status", "Out");
        injury2.put("date", LocalDate.now().toString());

        injuries.add(injury1);
        injuries.add(injury2);
        return injuries;
    }

    private List<Map<String, Object>> generateMockTransfers() {
        List<Map<String, Object>> transfers = new ArrayList<>();

        Map<String, Object> transfer1 = new HashMap<>();
        transfer1.put("player_name", "Kevin Durant");
        transfer1.put("from_team", "Brooklyn Nets");
        transfer1.put("to_team", "Phoenix Suns");
        transfer1.put("type", "Trade");
        transfer1.put("date", LocalDate.now().toString());

        Map<String, Object> transfer2 = new HashMap<>();
        transfer2.put("player_name", "Russell Westbrook");
        transfer2.put("from_team", "Los Angeles Lakers");
        transfer2.put("to_team", "LA Clippers");
        transfer2.put("type", "Free Agent Signing");
        transfer2.put("date", LocalDate.now().toString());

        transfers.add(transfer1);
        transfers.add(transfer2);
        return transfers;
    }
}