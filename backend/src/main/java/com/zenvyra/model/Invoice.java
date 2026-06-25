package com.zenvyra.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "invoices")
public class Invoice {
    @Id
    private String id;
    
    @Indexed
    private String organizationId;
    
    private String stripeInvoiceId;
    private Double amount;
    private String currency;
    private String status; // paid, pending, failed
    private String pdfUrl;
    private LocalDateTime date;
    private LocalDateTime createdAt;
}
