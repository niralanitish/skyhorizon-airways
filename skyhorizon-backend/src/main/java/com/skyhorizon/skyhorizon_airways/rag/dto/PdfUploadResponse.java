package com.skyhorizon.skyhorizon_airways.rag.dto;

public class PdfUploadResponse {

    private String fileName;
    private Long size;
    private String message;

    public PdfUploadResponse() {
    }

    public PdfUploadResponse(String fileName, Long size, String message) {
        this.fileName = fileName;
        this.size = size;
        this.message = message;
    }

    public String getFileName() {
        return fileName;
    }

    public Long getSize() {
        return size;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }


    public void setSize(Long size) {
        this.size = size;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}