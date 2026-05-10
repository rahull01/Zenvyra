package com.complianceai.util;

import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.util.Map;

@Slf4j
public class PolicyGenerator {

    private static final String COMPANY_PLACEHOLDER = "{{COMPANY_NAME}}";
    private static final String DATE_PLACEHOLDER = "{{DATE}}";
    private static final String WEBSITE_PLACEHOLDER = "{{WEBSITE_URL}}";
    private static final String EMAIL_PLACEHOLDER = "{{CONTACT_EMAIL}}";
    private static final String ADDRESS_PLACEHOLDER = "{{COMPANY_ADDRESS}}";

    public static String generatePrivacyPolicy(String companyName, String websiteUrl,
            String contactEmail, String language) {

        String template = getPrivacyPolicyTemplate(language);

        return template
                .replace(COMPANY_PLACEHOLDER, companyName)
                .replace(WEBSITE_PLACEHOLDER, websiteUrl)
                .replace(EMAIL_PLACEHOLDER, contactEmail)
                .replace(DATE_PLACEHOLDER, LocalDate.now().toString());
    }

    public static String generateTermsOfService(String companyName, String websiteUrl,
            String contactEmail, String language) {

        String template = getTermsTemplate(language);

        return template
                .replace(COMPANY_PLACEHOLDER, companyName)
                .replace(WEBSITE_PLACEHOLDER, websiteUrl)
                .replace(EMAIL_PLACEHOLDER, contactEmail)
                .replace(DATE_PLACEHOLDER, LocalDate.now().toString());
    }

    public static String generateCookiePolicy(String companyName, String websiteUrl,
            String contactEmail, String language) {

        String template = getCookiePolicyTemplate(language);

        return template
                .replace(COMPANY_PLACEHOLDER, companyName)
                .replace(WEBSITE_PLACEHOLDER, websiteUrl)
                .replace(EMAIL_PLACEHOLDER, contactEmail)
                .replace(DATE_PLACEHOLDER, LocalDate.now().toString());
    }

    public static String generateGDPRNotice(String companyName, String websiteUrl,
            String contactEmail, String companyAddress) {

        String template = getGDPRTemplate();

        return template
                .replace(COMPANY_PLACEHOLDER, companyName)
                .replace(WEBSITE_PLACEHOLDER, websiteUrl)
                .replace(EMAIL_PLACEHOLDER, contactEmail)
                .replace(ADDRESS_PLACEHOLDER, companyAddress)
                .replace(DATE_PLACEHOLDER, LocalDate.now().toString());
    }

    private static String getPrivacyPolicyTemplate(String language) {
        // English template (default)
        return """
                <!DOCTYPE html>
                <html>
                <head><title>Privacy Policy</title></head>
                <body>
                <h1>Privacy Policy for {{COMPANY_NAME}}</h1>
                <p><strong>Last Updated:</strong> {{DATE}}</p>

                <h2>1. Introduction</h2>
                <p>{{COMPANY_NAME}} ("we", "our", or "us") operates {{WEBSITE_URL}}. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>

                <h2>2. Information We Collect</h2>
                <p>We may collect information about you in a variety of ways including:</p>
                <ul>
                    <li><strong>Personal Data:</strong> Name, email address, phone number</li>
                    <li><strong>Usage Data:</strong> IP address, browser type, pages visited</li>
                    <li><strong>Cookies:</strong> We use cookies to enhance your experience</li>
                </ul>

                <h2>3. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul>
                    <li>Provide and maintain our services</li>
                    <li>Improve user experience</li>
                    <li>Send periodic emails</li>
                    <li>Comply with legal obligations</li>
                </ul>

                <h2>4. GDPR Rights (for EU Residents)</h2>
                <p>Under GDPR, you have the right to:</p>
                <ul>
                    <li>Access your personal data</li>
                    <li>Rectify inaccurate data</li>
                    <li>Request erasure of your data</li>
                    <li>Restrict or object to processing</li>
                    <li>Data portability</li>
                </ul>

                <h2>5. CCPA Rights (for California Residents)</h2>
                <p>Under CCPA, California residents have the right to:</p>
                <ul>
                    <li>Know what personal information is collected</li>
                    <li>Know if personal information is sold or disclosed</li>
                    <li>Say no to the sale of personal information</li>
                    <li>Access their personal information</li>
                </ul>

                <h2>6. Contact Us</h2>
                <p>If you have questions about this Privacy Policy, contact us at: {{CONTACT_EMAIL}}</p>
                </body>
                </html>
                """;
    }

    private static String getTermsTemplate(String language) {
        return """
                <!DOCTYPE html>
                <html>
                <head><title>Terms of Service</title></head>
                <body>
                <h1>Terms of Service for {{COMPANY_NAME}}</h1>
                <p><strong>Last Updated:</strong> {{DATE}}</p>

                <h2>1. Agreement to Terms</h2>
                <p>By accessing {{WEBSITE_URL}}, you agree to be bound by these Terms of Service.</p>

                <h2>2. Use License</h2>
                <p>Permission is granted to temporarily access the materials on our website for personal, non-commercial use.</p>

                <h2>3. Disclaimer</h2>
                <p>The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied.</p>

                <h2>4. Limitations</h2>
                <p>In no event shall {{COMPANY_NAME}} be liable for any damages arising out of the use or inability to use our services.</p>

                <h2>5. Governing Law</h2>
                <p>These terms shall be governed by and construed in accordance with applicable laws.</p>

                <h2>6. Contact</h2>
                <p>Questions about the Terms of Service should be sent to: {{CONTACT_EMAIL}}</p>
                </body>
                </html>
                """;
    }

    private static String getCookiePolicyTemplate(String language) {
        return """
                <!DOCTYPE html>
                <html>
                <head><title>Cookie Policy</title></head>
                <body>
                <h1>Cookie Policy for {{COMPANY_NAME}}</h1>
                <p><strong>Last Updated:</strong> {{DATE}}</p>

                <h2>1. What Are Cookies</h2>
                <p>Cookies are small text files stored on your device when you visit websites.</p>

                <h2>2. How We Use Cookies</h2>
                <p>We use cookies for:</p>
                <ul>
                    <li><strong>Essential cookies:</strong> Required for the website to function</li>
                    <li><strong>Analytics cookies:</strong> Help us understand how visitors interact</li>
                    <li><strong>Marketing cookies:</strong> Used to deliver relevant advertisements</li>
                </ul>

                <h2>3. Managing Cookies</h2>
                <p>You can control cookies through your browser settings. Note that disabling cookies may affect website functionality.</p>

                <h2>4. Contact</h2>
                <p>For questions about our Cookie Policy: {{CONTACT_EMAIL}}</p>
                </body>
                </html>
                """;
    }

    private static String getGDPRTemplate() {
        return """
                <!DOCTYPE html>
                <html>
                <head><title>GDPR Compliance Notice</title></head>
                <body>
                <h1>GDPR Compliance Notice</h1>
                <p><strong>Last Updated:</strong> {{DATE}}</p>

                <h2>Data Controller</h2>
                <p><strong>Company:</strong> {{COMPANY_NAME}}</p>
                <p><strong>Address:</strong> {{COMPANY_ADDRESS}}</p>
                <p><strong>Email:</strong> {{CONTACT_EMAIL}}</p>
                <p><strong>Website:</strong> {{WEBSITE_URL}}</p>

                <h2>Your Rights Under GDPR</h2>
                <ul>
                    <li><strong>Right to Access:</strong> Request copies of your personal data</li>
                    <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
                    <li><strong>Right to Erasure:</strong> Request deletion of your data</li>
                    <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing</li>
                    <li><strong>Right to Data Portability:</strong> Receive data in a structured format</li>
                    <li><strong>Right to Object:</strong> Object to processing of your data</li>
                </ul>

                <h2>Data Protection Officer</h2>
                <p>Contact our DPO at: {{CONTACT_EMAIL}}</p>
                </body>
                </html>
                """;
    }
}
