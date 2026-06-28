package com.skyhorizon.skyhorizon_airways.rag.service;

import org.springframework.stereotype.Service;

import com.skyhorizon.skyhorizon_airways.rag.retrieval.RetrievalService;

@Service
public class AIChatService {

    private final GeminiService geminiService;
    private final RetrievalService retrievalService;

    public AIChatService(
            GeminiService geminiService,
            RetrievalService retrievalService) {

        this.geminiService = geminiService;
        this.retrievalService = retrievalService;
    }

    public String chat(String question) {

        String context =
                retrievalService.retrieveBestChunk(question);

        String promptText = """
                You are SkyHorizon Airways AI Assistant.
                
                - Use ONLY the provided context.
                - If the answer is not present in the retrieved context, reply exactly:
                  "Sorry, I couldn't find this information in the uploaded documents."
                - Do not use external knowledge.
                - Do not hallucinate.

                Context:
                %s

                Question:
                %s
                """.formatted(context, question);

        return geminiService.generateResponse(promptText);
    }
}