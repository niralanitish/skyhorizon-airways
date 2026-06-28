package com.skyhorizon.skyhorizon_airways.rag.controller;

import org.springframework.web.bind.annotation.*;

import com.skyhorizon.skyhorizon_airways.rag.dto.ChatRequest;
import com.skyhorizon.skyhorizon_airways.rag.dto.ChatResponse;
import com.skyhorizon.skyhorizon_airways.rag.service.AIChatService;

@RestController
@RequestMapping("/api/ai")
public class AIChatController {

    private final AIChatService aiChatService;

    public AIChatController(AIChatService aiChatService) {
        this.aiChatService = aiChatService;
    }

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {

        String answer =
                aiChatService.chat(request.getMessage());

        return new ChatResponse(answer);
    }
}