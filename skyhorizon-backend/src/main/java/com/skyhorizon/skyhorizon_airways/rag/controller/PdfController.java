package com.skyhorizon.skyhorizon_airways.rag.controller;

import java.io.IOException;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.skyhorizon.skyhorizon_airways.rag.dto.PdfUploadResponse;
import com.skyhorizon.skyhorizon_airways.rag.service.PdfService;

@RestController
@RequestMapping("/api/rag")
public class PdfController {

    private final PdfService pdfService;

    public PdfController(PdfService pdfService) {
        this.pdfService = pdfService;
    }

    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public PdfUploadResponse upload(

            @RequestParam("file") MultipartFile file

    ) throws IOException {

        return pdfService.upload(file);

    }

}