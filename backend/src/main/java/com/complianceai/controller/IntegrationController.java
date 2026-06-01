package com.complianceai.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Slf4j
@RestController
@RequestMapping("/integrations")
@RequiredArgsConstructor
public class IntegrationController {

    private String getBaseUrl(HttpServletRequest request) {
        String scheme = request.getScheme();
        String serverName = request.getServerName();
        int serverPort = request.getServerPort();
        
        // Handle standard proxy headers if present
        String proto = request.getHeader("X-Forwarded-Proto");
        if (proto != null && !proto.isEmpty()) {
            scheme = proto;
        }
        String host = request.getHeader("X-Forwarded-Host");
        if (host != null && !host.isEmpty()) {
            serverName = host;
            // Port is usually in host or handled by proto
            return scheme + "://" + serverName + "/api/v1";
        }
        
        String portStr = "";
        if (("http".equals(scheme) && serverPort != 80) || ("https".equals(scheme) && serverPort != 443)) {
            portStr = ":" + serverPort;
        }
        return scheme + "://" + serverName + portStr + "/api/v1";
    }

    @GetMapping(value = "/wordpress/download/{bannerId}", produces = "application/zip")
    public ResponseEntity<byte[]> downloadWordPressPlugin(
            @PathVariable String bannerId,
            HttpServletRequest request) {
        
        String apiHost = getBaseUrl(request);
        log.info("Generating WordPress plugin ZIP on-the-fly for Banner ID: {}, Host: {}", bannerId, apiHost);

        String phpCode = String.format("""
            <?php
            /**
             * Plugin Name: ComplianceAI Pro Consent Manager
             * Plugin URI: https://complianceai.pro
             * Description: Zero-config AI-powered cookie consent banner integration for your WordPress site.
             * Version: 1.0.0
             * Author: ComplianceAI Pro
             * Author URI: https://complianceai.pro
             * License: GPL2
             */

            if (!defined('ABSPATH')) {
                exit;
            }

            // Add the banner script loader inside the head tag
            add_action('wp_head', 'complianceai_inject_banner_script');
            function complianceai_inject_banner_script() {
                $banner_id = get_option('complianceai_banner_id', '%s');
                $api_host = get_option('complianceai_api_host', '%s');
                ?>
                <!-- ComplianceAI Pro Consent Banner -->
                <script src="<?php echo esc_url($api_host); ?>/banners/public/<?php echo esc_attr($banner_id); ?>/banner.js" async></script>
                <!-- End ComplianceAI Pro Consent Banner -->
                <?php
            }

            // Admin menu for settings page
            add_action('admin_menu', 'complianceai_add_settings_menu');
            function complianceai_add_settings_menu() {
                add_options_page(
                    'ComplianceAI Settings',
                    'ComplianceAI',
                    'manage_options',
                    'complianceai-settings',
                    'complianceai_render_settings_page'
                );
            }

            // Register settings
            add_action('admin_init', 'complianceai_register_settings');
            function complianceai_register_settings() {
                register_setting('complianceai-settings-group', 'complianceai_banner_id');
                register_setting('complianceai-settings-group', 'complianceai_api_host');
            }

            function complianceai_render_settings_page() {
                ?>
                <div class="wrap" style="background: #020617; color: #f8fafc; padding: 30px; border-radius: 20px; font-family: sans-serif; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);">
                    <h1 style="color: #f59e0b; font-weight: 800; font-size: 28px; margin-bottom: 20px; border-bottom: 1px solid #334155; padding-bottom: 15px;">ComplianceAI Pro Settings</h1>
                    <form method="post" action="options.php">
                        <?php settings_fields('complianceai-settings-group'); ?>
                        <?php do_settings_sections('complianceai-settings-group'); ?>
                        <table class="form-table" style="width: 100%%; max-width: 600px; margin-bottom: 25px;">
                            <tr valign="top">
                                <th scope="row" style="color: #cbd5e1; font-weight: bold; width: 180px; padding: 15px 0;">Banner ID</th>
                                <td style="padding: 10px 0;">
                                    <input type="text" name="complianceai_banner_id" value="<?php echo esc_attr(get_option('complianceai_banner_id', '%s')); ?>" class="regular-text" style="background: #1e293b; color: #f8fafc; border: 1px solid #334155; border-radius: 8px; padding: 10px; width: 100%%; font-family: monospace;" />
                                </td>
                            </tr>
                            <tr valign="top">
                                <th scope="row" style="color: #cbd5e1; font-weight: bold; padding: 15px 0;">API Host URL</th>
                                <td style="padding: 10px 0;">
                                    <input type="text" name="complianceai_api_host" value="<?php echo esc_attr(get_option('complianceai_api_host', '%s')); ?>" class="regular-text" style="background: #1e293b; color: #f8fafc; border: 1px solid #334155; border-radius: 8px; padding: 10px; width: 100%%; font-family: monospace;" />
                                </td>
                            </tr>
                        </table>
                        <div style="margin-top: 20px;">
                            <?php submit_button('Save Workspace Details', 'primary', 'submit', true, array('style' => 'background: #f59e0b; border: none; border-radius: 9999px; color: #020617; padding: 12px 30px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.3);')); ?>
                        </div>
                    </form>
                </div>
                <?php
            }
            """, bannerId, apiHost, bannerId, apiHost);

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ZipOutputStream zos = new ZipOutputStream(baos)) {
            
            // Add a folder entry inside zip
            ZipEntry entry = new ZipEntry("complianceai-pro/complianceai-pro.php");
            zos.putNextEntry(entry);
            zos.write(phpCode.getBytes(StandardCharsets.UTF_8));
            zos.closeEntry();
            
            zos.finish();
            byte[] zipBytes = baos.toByteArray();
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"complianceai-pro.zip\"")
                    .contentType(MediaType.parseMediaType("application/zip"))
                    .body(zipBytes);
                    
        } catch (IOException e) {
            log.error("Failed to generate WordPress dynamic plugin", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping(value = "/shopify/pixel/{bannerId}", produces = "application/javascript")
    public ResponseEntity<String> getShopifyPixelCode(
            @PathVariable String bannerId,
            HttpServletRequest request) {
        
        String apiHost = getBaseUrl(request);
        log.info("Generating Shopify dynamic Custom Pixel for Banner ID: {}, Host: {}", bannerId, apiHost);

        String jsCode = String.format("""
            // Shopify Custom Pixel for ComplianceAI Pro
            // Preloaded with Banner ID: %s
            // API Host: %s

            (function() {
                var bannerId = "%s";
                var apiHost = "%s";
                
                // Inject the main banner loader into Shopify's execution frame
                var script = document.createElement("script");
                script.src = apiHost + "/banners/public/" + bannerId + "/banner.js";
                script.async = true;
                script.id = "complianceai-shopify-pixel";
                document.head.appendChild(script);
                
                console.log("ComplianceAI: Shopify Custom Pixel initialized.");
            })();
            """, bannerId, apiHost, bannerId, apiHost);

        return ResponseEntity.ok()
                .header(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "*")
                .body(jsCode);
    }

    @GetMapping(value = "/gtm/template/{bannerId}", produces = "application/json")
    public ResponseEntity<String> downloadGtmTemplate(
            @PathVariable String bannerId,
            HttpServletRequest request) {
        
        String apiHost = getBaseUrl(request);
        log.info("Generating GTM template JSON for Banner ID: {}, Host: {}", bannerId, apiHost);

        String gtmJson = String.format("""
            {
              "exportFormatVersion": 2,
              "exportTime": "2026-05-17 12:00:00",
              "containerVersion": {
                "path": "accounts/1/containers/1/versions/1",
                "accountId": "1",
                "containerId": "1",
                "containerVersionId": "1",
                "name": "ComplianceAI GTM Template",
                "tag": [
                  {
                    "accountId": "1",
                    "containerId": "1",
                    "tagId": "1",
                    "name": "ComplianceAI Banner Loader",
                    "type": "html",
                    "parameter": [
                      {
                        "type": "template",
                        "key": "html",
                        "value": "<script src=\\"%s/banners/public/%s/banner.js\\" async></script>"
                      }
                    ],
                    "firingTriggerId": [
                      "2147479553"
                    ],
                    "tagFiringOption": "oncePerEvent"
                  }
                ],
                "trigger": [
                  {
                    "accountId": "1",
                    "containerId": "1",
                    "triggerId": "2147479553",
                    "name": "All Pages",
                    "type": "pageview"
                  }
                ]
              }
            }
            """, apiHost, bannerId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"gtm-complianceai-template.json\"")
                .contentType(MediaType.APPLICATION_JSON)
                .body(gtmJson);
    }
}
