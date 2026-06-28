package com.skyhorizon.skyhorizon_airways.rag.retrieval;

import java.util.List;

import org.springframework.stereotype.Service;

import com.skyhorizon.skyhorizon_airways.rag.embedding.EmbeddingService;
import com.skyhorizon.skyhorizon_airways.rag.store.InMemoryStore;

@Service
public class RetrievalService {

    private final InMemoryStore inMemoryStore;
    private final EmbeddingService embeddingService;

    public RetrievalService(
            InMemoryStore inMemoryStore,
            EmbeddingService embeddingService) {

        this.inMemoryStore = inMemoryStore;
        this.embeddingService = embeddingService;
    }

    public String retrieveBestChunk(String question) {

        float[] questionEmbedding =
                embeddingService.createEmbedding(question);

        List<String> chunks =
                inMemoryStore.getChunks();

        List<float[]> embeddings =
                inMemoryStore.getEmbeddings();

        if (chunks.isEmpty()) {
            return "No documents uploaded.";
        }

        double bestScore = -1;

        int bestIndex = 0;

        for (int i = 0; i < embeddings.size(); i++) {

            double score = cosineSimilarity(
                    questionEmbedding,
                    embeddings.get(i));

            if (score > bestScore) {

                bestScore = score;

                bestIndex = i;
            }

        }

        System.out.println("Best Similarity Score : " + bestScore);

        return chunks.get(bestIndex);
    }

    private double cosineSimilarity(float[] a, float[] b) {

        double dot = 0;
        double normA = 0;
        double normB = 0;

        for (int i = 0; i < a.length; i++) {

            dot += a[i] * b[i];

            normA += a[i] * a[i];

            normB += b[i] * b[i];

        }

        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }

}