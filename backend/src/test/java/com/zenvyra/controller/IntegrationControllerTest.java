package com.zenvyra.controller;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;

import static org.junit.jupiter.api.Assertions.*;

class IntegrationControllerTest {

    private final IntegrationController controller = new IntegrationController();

    @Test
    void downloadWordPressPlugin_shouldReturnValidZipFile() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setScheme("https");
        request.setServerName("api.zenvyra.com");
        request.setServerPort(443);

        ResponseEntity<byte[]> response = controller.downloadWordPressPlugin("active-banner-123", request);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("attachment; filename=\"zenvyra.zip\"", response.getHeaders().getFirst("Content-Disposition"));
        assertEquals("application/zip", response.getHeaders().getContentType().toString());

        byte[] content = response.getBody();
        assertNotNull(content);
        assertTrue(content.length > 0);
        // ZIP magic bytes: PK (0x50, 0x4B)
        assertEquals((byte) 0x50, content[0]);
        assertEquals((byte) 0x4B, content[1]);
    }

    @Test
    void getShopifyPixelCode_shouldReturnValidJavascriptBundle() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setScheme("https");
        request.setServerName("api.zenvyra.com");
        request.setServerPort(443);

        ResponseEntity<String> response = controller.getShopifyPixelCode("active-banner-123", request);

        assertEquals(200, response.getStatusCode().value());
        String body = response.getBody();
        assertNotNull(body);
        assertTrue(body.contains("Shopify Custom Pixel for Zenvyra"));
        assertTrue(body.contains("active-banner-123"));
    }

    @Test
    void downloadGtmTemplate_shouldReturnValidGtmContainerJson() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setScheme("https");
        request.setServerName("api.zenvyra.com");
        request.setServerPort(443);

        ResponseEntity<String> response = controller.downloadGtmTemplate("active-banner-123", request);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("attachment; filename=\"gtm-Zenvyra-template.json\"", response.getHeaders().getFirst("Content-Disposition"));
        assertEquals("application/json", response.getHeaders().getContentType().toString());
        String body = response.getBody();
        assertNotNull(body);
        assertTrue(body.contains("Zenvyra GTM Template"));
        assertTrue(body.contains("Zenvyra Banner Loader"));
    }
}
