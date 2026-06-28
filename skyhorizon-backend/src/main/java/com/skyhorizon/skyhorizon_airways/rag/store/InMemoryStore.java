package com.skyhorizon.skyhorizon_airways.rag.store;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class InMemoryStore {

    private final List<String> chunks = new ArrayList<>();

    private final List<float[]> embeddings = new ArrayList<>();

    public void add(String chunk, float[] embedding) {

        chunks.add(chunk);

        embeddings.add(embedding);
    }

    public List<String> getChunks() {
        return chunks;
    }

    public List<float[]> getEmbeddings() {
        return embeddings;
    }

    public void clear() {

        chunks.clear();

        embeddings.clear();
    }

}