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
import java.util.HashMap;
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
            return ResponseEntity.status(HttpStatus.OK).body(mockResponse);
        }
    }
}