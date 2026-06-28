package com.skyhorizon.skyhorizon_airways.rag.chunk;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class TextChunkService {

    private static final int CHUNK_SIZE = 800;

    public List<String> createChunks(String text) {

        List<String> chunks = new ArrayList<>();

        if (text == null || text.isBlank()) {
            return chunks;
        }

        int start = 0;

        while (start < text.length()) {

            int end = Math.min(start + CHUNK_SIZE, text.length());

            chunks.add(text.substring(start, end));

            start = end;
        }

        return chunks;
    }

}