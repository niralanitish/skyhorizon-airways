package com.skyhorizon.skyhorizon_airways.rag.loader;

import java.io.InputStream;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import com.skyhorizon.skyhorizon_airways.rag.service.PdfService;

@Component
public class RagDataLoader implements CommandLineRunner {

    private final PdfService pdfService;

    public RagDataLoader(PdfService pdfService) {
        this.pdfService = pdfService;
    }

    @Override
    public void run(String... args) throws Exception {

        System.out.println("=================================");
        System.out.println("Loading RAG Documents...");
        System.out.println("=================================");

        loadPdf("documents/baggage-policy.pdf");
        loadPdf("documents/operations-manual.pdf");

        System.out.println("=================================");
        System.out.println("All RAG Documents Loaded");
        System.out.println("=================================");
    }

    private void loadPdf(String path) {

        try {

            ClassPathResource resource =
                    new ClassPathResource(path);

            InputStream inputStream =
                    resource.getInputStream();

            pdfService.processPdf(inputStream);

            System.out.println("Loaded : " + path);

        } catch (Exception e) {

            System.out.println("Failed : " + path);

            e.printStackTrace();
        }
    }
}