package com.skyhorizon.skyhorizon_airways.rag.service;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import com.skyhorizon.skyhorizon_airways.rag.dto.GeminiRequest;
import com.skyhorizon.skyhorizon_airways.rag.dto.GeminiResponse;

@Service
public class GeminiService {

    private final String geminiApiKey;
    private final RestClient restClient;
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    public GeminiService(@Value("${gemini.api.key}") String geminiApiKey) {
        this.geminiApiKey = geminiApiKey;

        // Configure timeouts
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(10000); // 10 seconds
        requestFactory.setReadTimeout(30000); // 30 seconds

        this.restClient = RestClient.builder()
                .requestFactory(requestFactory)
                .build();
    }

    public String generateResponse(String promptText) {
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            return "Sorry, the Gemini API key is not configured. Please contact the administrator.";
        }

        GeminiRequest.Part part = new GeminiRequest.Part(promptText);
        GeminiRequest.Content content = new GeminiRequest.Content(Collections.singletonList(part));
        GeminiRequest requestPayload = new GeminiRequest(Collections.singletonList(content));

        try {
            GeminiResponse response = restClient.post()
                    .uri(GEMINI_API_URL + "?key=" + geminiApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestPayload)
                    .retrieve()
                    .body(GeminiResponse.class);

            if (response != null && response.getCandidates() != null && !response.getCandidates().isEmpty()) {
                GeminiResponse.Candidate candidate = response.getCandidates().get(0);
                if (candidate.getContent() != null && candidate.getContent().getParts() != null && !candidate.getContent().getParts().isEmpty()) {
                    return candidate.getContent().getParts().get(0).getText();
                }
            }
            return "Sorry, I received an unexpected response structure from the AI provider.";

        } catch (RestClientException e) {
            System.err.println("Gemini API Error: " + e.getMessage());
            return "Sorry, I am currently unable to reach the AI service or the request timed out. Please try again later.";
        } catch (Exception e) {
            System.err.println("Unexpected Error: " + e.getMessage());
            return "Sorry, an unexpected error occurred while processing your request.";
        }
    }
}
