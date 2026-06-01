package com.complianceai.agents.scanner;

import com.complianceai.agents.model.AgentResponse;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Scanner Agent
 * 
 * Responsibility: Performs REAL website scraping using JSoup.
 * Fetches HTML from the target URL and extracts HTML content, scripts, and forms.
 */
@Service
public class Scanner {

    public AgentResponse execute(String url) {
        System.out.println("[Scanner Agent] Starting real scan for URL: " + url);

        AgentResponse response = new AgentResponse();
        if (url == null || url.trim().isEmpty()) {
            response.setRawData("ERROR: Invalid URL provided for scanning.");
            return response;
        }

        try {
            // Fetch HTML using Jsoup
            Document doc = Jsoup.connect(url)
                    .userAgent("ComplianceAI-Bot/1.0")
                    .timeout(10000)
                    .followRedirects(true)
                    .get();

            StringBuilder sb = new StringBuilder();
            sb.append("URL: ").append(url).append("\n");
            sb.append("TITLE: ").append(doc.title()).append("\n");

            // Extract script source URLs
            Elements scripts = doc.select("script[src]");
            List<String> scriptUrls = new ArrayList<>();
            for (Element script : scripts) {
                scriptUrls.add(script.attr("abs:src"));
            }
            sb.append("SCRIPTS: [").append(String.join(", ", scriptUrls)).append("]\n");

            // Extract forms with their action URLs and input fields
            Elements forms = doc.select("form");
            List<String> formDetails = new ArrayList<>();
            for (Element form : forms) {
                String action = form.attr("abs:action");
                Elements inputs = form.select("input[name]");
                List<String> fieldNames = new ArrayList<>();
                for (Element input : inputs) {
                    fieldNames.add(input.attr("name"));
                }
                formDetails.add("Action: " + action + ", Fields: " + fieldNames);
            }
            sb.append("FORMS: [").append(String.join(" | ", formDetails)).append("]\n");

            // Extract outer HTML
            sb.append("HTML: ").append(doc.outerHtml());

            response.setRawData(sb.toString());
            System.out.println("[Scanner Agent] Scan completed successfully. Scraping size: " + sb.length() + " chars.");

        } catch (IOException e) {
            String errorMsg = "Scraping failed for URL " + url + ": " + e.getMessage();
            System.err.println("[Scanner Agent] [ERROR] " + errorMsg);
            response.setRawData("ERROR: " + errorMsg);
        }

        return response;
    }
}
