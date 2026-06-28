package com.skyhorizon.skyhorizon_airways.rag.embedding;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import com.skyhorizon.skyhorizon_airways.rag.dto.GeminiEmbeddingRequest;
import com.skyhorizon.skyhorizon_airways.rag.dto.GeminiEmbeddingResponse;
import com.skyhorizon.skyhorizon_airways.rag.exception.EmbeddingGenerationException;

@Service
public class EmbeddingService {

    private final String geminiApiKey;
    private final RestClient restClient;
    private static final String GEMINI_EMBED_URL = "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent";
    private static final String MODEL_NAME = "models/text-embedding-004";

    private long lastCallTime = 0;
    private static final long RATE_LIMIT_DELAY_MS = 1000; // 1 second between calls

    public EmbeddingService(@Value("${gemini.api.key}") String geminiApiKey) {
        this.geminiApiKey = geminiApiKey;

        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(10000); // 10 seconds
        requestFactory.setReadTimeout(30000); // 30 seconds

        this.restClient = RestClient.builder()
                .requestFactory(requestFactory)
                .build();
    }

    @Retryable(
            value = { RestClientException.class },
            maxAttempts = 3,
            backoff = @Backoff(delay = 2000, multiplier = 2)
    )
    public float[] createEmbedding(String text) {
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            throw new EmbeddingGenerationException("Gemini API key is not configured.");
        }

        enforceRateLimit();

        GeminiEmbeddingRequest.Part part = new GeminiEmbeddingRequest.Part(text);
        GeminiEmbeddingRequest.Content content = new GeminiEmbeddingRequest.Content(Collections.singletonList(part));
        GeminiEmbeddingRequest requestPayload = new GeminiEmbeddingRequest(MODEL_NAME, content);

        try {
            GeminiEmbeddingResponse response = restClient.post()
                    .uri(GEMINI_EMBED_URL + "?key=" + geminiApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestPayload)
                    .retrieve()
                    .body(GeminiEmbeddingResponse.class);

            if (response != null && response.getEmbedding() != null && response.getEmbedding().getValues() != null) {
                List<Float> values = response.getEmbedding().getValues();
                float[] floatArray = new float[values.size()];
                for (int i = 0; i < values.size(); i++) {
                    floatArray[i] = values.get(i);
                }
                return floatArray;
            }
            
            throw new EmbeddingGenerationException("Unexpected null response or missing values from Gemini Embedding API.");

        } catch (RestClientException e) {
            System.err.println("Gemini Embedding API Error: " + e.getMessage());
            throw new EmbeddingGenerationException("HTTP failure while generating embedding.", e);
        } catch (Exception e) {
            System.err.println("Unexpected Embedding Error: " + e.getMessage());
            throw new EmbeddingGenerationException("Unexpected error during embedding generation.", e);
        }
    }

    private synchronized void enforceRateLimit() {
        long now = System.currentTimeMillis();
        long elapsed = now - lastCallTime;
        if (elapsed < RATE_LIMIT_DELAY_MS) {
            try {
                Thread.sleep(RATE_LIMIT_DELAY_MS - elapsed);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        lastCallTime = System.currentTimeMillis();
    }
}