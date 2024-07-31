package com.example.urbanvoyagebackend.service.travel;

import com.adobe.pdfservices.operation.ExecutionContext;
import com.adobe.pdfservices.operation.auth.Credentials;
import com.adobe.pdfservices.operation.io.FileRef;
import com.adobe.pdfservices.operation.pdfops.CreatePDFOperation;
import com.adobe.pdfservices.operation.pdfops.options.createpdf.CreatePDFOptions;
import com.example.urbanvoyagebackend.entity.travel.Passenger;
import com.example.urbanvoyagebackend.entity.travel.Reservation;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.xml.bind.DatatypeConverter;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.format.DateTimeFormatter;

@Service
public class TicketService {

    private static final Logger logger = LoggerFactory.getLogger(TicketService.class);

    @Value("${adobe.pdf.clientId}")
    private String clientId;

    @Value("${adobe.pdf.clientSecret}")
    private String clientSecret;

    public byte[] generateTicket(Reservation reservation, Passenger passenger) throws IOException {
        Path tempHtmlPath = null;
        Path tempPdfPath = null;
        ByteArrayOutputStream pdfOutputStream = null;

        try {
            // Set up the PDF Services SDK
            Credentials credentials = Credentials.servicePrincipalCredentialsBuilder()
                    .withClientId(clientId)
                    .withClientSecret(clientSecret)
                    .build();

            ExecutionContext executionContext = ExecutionContext.create(credentials);

            // Create HTML content for the ticket, including the QR code
            String htmlContent = createTicketHTML(reservation, passenger);

            // Save HTML content to a temporary file
            tempHtmlPath = Files.createTempFile("ticket_html_", ".html");
            Files.write(tempHtmlPath, htmlContent.getBytes());

            // Set up the PDF creation operation
            CreatePDFOperation createPDFOperation = CreatePDFOperation.createNew();

            // Create FileRef from the temporary HTML file
            FileRef source = FileRef.createFromLocalFile(tempHtmlPath.toString());
            createPDFOperation.setInput(source);

            // Set options for PDF creation
            CreatePDFOptions options = CreatePDFOptions.htmlOptionsBuilder()
                    .includeHeaderFooter(true)
                    .build();
            createPDFOperation.setOptions(options);

            // Generate the PDF
            FileRef result = createPDFOperation.execute(executionContext);

            // Generate a unique filename for the PDF
            String uniqueFileName = "ticket_pdf_" + System.currentTimeMillis() + "_" + reservation.getReservationID() + ".pdf";
            Path finalPdfPath = Path.of("/tmp", uniqueFileName);

            // Save the PDF to the unique file
            result.saveAs(finalPdfPath.toString());

            // Read the PDF file into a byte array
            byte[] pdfBytes = Files.readAllBytes(finalPdfPath);

            // Optionally, save to ByteArrayOutputStream for further processing if needed
            pdfOutputStream = new ByteArrayOutputStream();
            pdfOutputStream.write(pdfBytes);

            return pdfBytes;
        } catch (Exception e) {
            logger.error("Failed to generate ticket PDF", e);
            throw new IOException("Failed to generate ticket PDF: " + e.getMessage(), e);
        } finally {
            // Clean up temporary files
            cleanupTempFile(tempHtmlPath);
            cleanupTempFile(tempPdfPath);
            closeQuietly(pdfOutputStream);
        }
    }

    private String createTicketHTML(Reservation reservation, Passenger passenger) throws Exception {
        // Generate QR code
        String qrCodeImage = generateQRCodeImage(passenger.getSerialNumber());

        // Format dates
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formattedDepartureTime = passenger.getDepartureTime().format(String.valueOf(formatter));
        String formattedArrivalTime = passenger.getArrivalTime().format(String.valueOf(formatter));

        // Create an HTML string with ticket details and QR code
        return "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>Travel Ticket</title>" +
                "<style>body { font-family: Arial, sans-serif; } " +
                ".ticket { border: 1px solid #000; padding: 20px; max-width: 600px; margin: 0 auto; }" +
                ".qr-code { text-align: center; margin-top: 20px; }" +
                "</style></head><body>" +
                "<div class=\"ticket\">" +
                "<h1>Travel Ticket</h1>" +
                "<p><strong>Passenger:</strong> " + passenger.getFirstName() + " " + passenger.getLastName() + "</p>" +
                "<p><strong>From:</strong> " + passenger.getDepartureCity() + "</p>" +
                "<p><strong>To:</strong> " + passenger.getArrivalCity() + "</p>" +
                "<p><strong>Departure:</strong> " + formattedDepartureTime + "</p>" +
                "<p><strong>Arrival:</strong> " + formattedArrivalTime + "</p>" +
                "<p><strong>Seat Type:</strong> " + passenger.getSeatType() + "</p>" +
                "<p><strong>Reservation ID:</strong> " + reservation.getReservationID() + "</p>" +
                "<p><strong>Serial Number:</strong> " + passenger.getSerialNumber() + "</p>" +
                "<div class=\"qr-code\">" +
                "<img src=\"data:image/png;base64," + qrCodeImage + "\" alt=\"QR Code\" />" +
                "</div></div></body></html>";
    }

    private String generateQRCodeImage(String content) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, 200, 200);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        byte[] pngData = pngOutputStream.toByteArray();
        return DatatypeConverter.printBase64Binary(pngData);
    }

    private void cleanupTempFile(Path tempFilePath) {
        if (tempFilePath != null) {
            try {
                Files.deleteIfExists(tempFilePath);
            } catch (IOException e) {
                logger.warn("Failed to delete temporary file: " + tempFilePath, e);
            }
        }
    }

    private void closeQuietly(Closeable closeable) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (IOException e) {
                logger.warn("Failed to close resource", e);
            }
        }
    }
}