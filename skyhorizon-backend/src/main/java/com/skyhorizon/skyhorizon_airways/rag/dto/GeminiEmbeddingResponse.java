package com.skyhorizon.skyhorizon_airways.rag.dto;

import java.util.List;

public class GeminiEmbeddingResponse {
    private EmbeddingData embedding;

    public GeminiEmbeddingResponse() {}

    public EmbeddingData getEmbedding() {
        return embedding;
    }

    public void setEmbedding(EmbeddingData embedding) {
        this.embedding = embedding;
    }

    public static class EmbeddingData {
        private List<Float> values;

        public EmbeddingData() {}

        public List<Float> getValues() {
            return values;
        }

        public void setValues(List<Float> values) {
            this.values = values;
        }
    }
}
