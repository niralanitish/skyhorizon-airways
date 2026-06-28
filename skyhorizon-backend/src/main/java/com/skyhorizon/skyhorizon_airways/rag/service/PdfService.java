package com.skyhorizon.skyhorizon_airways.rag.service;
import java.io.InputStream;
import java.io.IOException;
import java.util.List;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.skyhorizon.skyhorizon_airways.rag.chunk.TextChunkService;
import com.skyhorizon.skyhorizon_airways.rag.dto.PdfUploadResponse;
import com.skyhorizon.skyhorizon_airways.rag.embedding.EmbeddingService;
import com.skyhorizon.skyhorizon_airways.rag.store.InMemoryStore;

@Service
public class PdfService {

private final TextChunkService textChunkService;
private final EmbeddingService embeddingService;
private final InMemoryStore inMemoryStore;
public PdfService(
        TextChunkService textChunkService,
        EmbeddingService embeddingService,
        InMemoryStore inMemoryStore
) {

    this.textChunkService = textChunkService;
    this.embeddingService = embeddingService;
    this.inMemoryStore = inMemoryStore;

}


    public PdfUploadResponse upload(MultipartFile file) throws IOException {

       processPdf(file.getInputStream());

return new PdfUploadResponse(
        file.getOriginalFilename(),
        file.getSize(),
        "PDF Uploaded Successfully"
);
    }

    public void processPdf(InputStream inputStream) throws IOException {

    PDDocument document =
            Loader.loadPDF(inputStream.readAllBytes());

    PDFTextStripper stripper =
            new PDFTextStripper();

    String text =
            stripper.getText(document);

    List<String> chunks =
            textChunkService.createChunks(text);

    for (String chunk : chunks) {

        float[] embedding =
                embeddingService.createEmbedding(chunk);

        inMemoryStore.add(chunk, embedding);

    }

    document.close();

    System.out.println("Chunks Stored : " + chunks.size());

}
    
}