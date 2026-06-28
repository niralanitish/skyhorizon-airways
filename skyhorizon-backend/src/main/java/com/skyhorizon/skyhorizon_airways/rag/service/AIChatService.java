package com.skyhorizon.skyhorizon_airways.rag.service;

import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;

import com.skyhorizon.skyhorizon_airways.rag.retrieval.RetrievalService;

@Service
public class AIChatService {

    private final ChatModel chatModel;
    private final RetrievalService retrievalService;

    public AIChatService(
            ChatModel chatModel,
            RetrievalService retrievalService) {

        this.chatModel = chatModel;
        this.retrievalService = retrievalService;
    }

    public String chat(String question) {

        String context =
                retrievalService.retrieveBestChunk(question);

        String promptText = """
                You are SkyHorizon Airways AI Assistant.

                Answer ONLY using the context below.

                If the answer is not present in the context,
                reply:
                Sorry, I couldn't find this information in the uploaded document.

                Context:
                %s

                Question:
                %s
                """.formatted(context, question);

        Prompt prompt =
                new Prompt(new UserMessage(promptText));

        return chatModel.call(prompt)
                .getResult()
                .getOutput()
                .getText();
    }
}