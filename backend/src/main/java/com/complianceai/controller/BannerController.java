package com.complianceai.controller;

import com.complianceai.model.Banner;
import com.complianceai.model.WebsiteScanResult;
import com.complianceai.repository.WebsiteScanResultRepository;
import com.complianceai.service.BannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;
    private final WebsiteScanResultRepository websiteScanResultRepository;

    @PostMapping
    public ResponseEntity<Banner> createBanner(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Banner banner) {
        // In a real app, we'd get the organizationId from the user's profile
        // For now, using username as organizationId for simplicity or mocking
        return ResponseEntity.ok(bannerService.createBanner(userDetails.getUsername(), banner));
    }

    @GetMapping
    public ResponseEntity<List<Banner>> getBanners(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(bannerService.getBannersByOrganization(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Banner> getBanner(@PathVariable String id) {
        return ResponseEntity.ok(bannerService.getBannerById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Banner> updateBanner(@PathVariable String id, @RequestBody Banner banner) {
        return ResponseEntity.ok(bannerService.updateBanner(id, banner));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBanner(@PathVariable String id) {
        bannerService.deleteBanner(id);
        return ResponseEntity.noContent().build();
    }

    // Public endpoint for the banner config (No Auth)
    @GetMapping("/public/{id}/config")
    public ResponseEntity<Banner> getPublicBannerConfig(@PathVariable String id) {
        Banner banner = bannerService.getBannerById(id);
        return ResponseEntity.ok(banner);
    }

    // Public endpoint returning classified trackers for the given banner's organization (No Auth)
    @GetMapping("/public/{id}/trackers")
    public ResponseEntity<List<WebsiteScanResult.ClassifiedTracker>> getPublicTrackers(@PathVariable String id) {
        try {
            Banner banner = bannerService.getBannerById(id);
            List<WebsiteScanResult> results = websiteScanResultRepository.findByUserId(banner.getOrganizationId());
            // Return classifiedTrackers from the most recent COMPLETED scan
            return results.stream()
                    .filter(r -> r.getStatus() == WebsiteScanResult.ScanStatus.COMPLETED
                            && r.getClassifiedTrackers() != null
                            && !r.getClassifiedTrackers().isEmpty())
                    .reduce((a, b) -> a.getScannedAt().isAfter(b.getScannedAt()) ? a : b)
                    .map(r -> ResponseEntity.ok(r.getClassifiedTrackers()))
                    .orElse(ResponseEntity.ok(Collections.emptyList()));
        } catch (Exception e) {
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    // Dynamic Javascript banner loader delivery endpoint
    @GetMapping(value = "/public/{id}/banner.js", produces = "application/javascript")
    public ResponseEntity<String> getPublicBannerScript(@PathVariable String id) {
        try {
            Banner banner;
            if ("active".equalsIgnoreCase(id)) {
                // Attempt to fetch the first banner in the repository
                java.util.List<Banner> banners = bannerService.getBannersByOrganization("demo-organization");
                if (banners == null || banners.isEmpty()) {
                    banner = createFallbackBannerSpec("active-demo-banner");
                } else {
                    banner = banners.get(0);
                }
            } else {
                banner = bannerService.getBannerById(id);
            }
            String js = generateBannerJavascript(banner);
            return ResponseEntity.ok(js);
        } catch (Exception e) {
            Banner mockBanner = createFallbackBannerSpec("fallback-error-banner");
            String js = generateBannerJavascript(mockBanner);
            return ResponseEntity.ok(js);
        }
    }

    private Banner createFallbackBannerSpec(String id) {
        Banner banner = new Banner();
        banner.setId(id);
        banner.setName("Default Sandbox Banner");
        banner.setStatus("active");
        
        java.util.Map<String, String> colors = new java.util.HashMap<>();
        colors.put("background", "#020617");
        colors.put("primary", "#F59E0B");
        colors.put("text", "#F8FAFC");
        banner.setColors(colors);
        
        java.util.Map<String, String> content = new java.util.HashMap<>();
        content.put("headline", "We value your privacy");
        content.put("description", "This site uses cookies to personalize content, deliver targeted ads, and perform behavioral traffic analytics.");
        content.put("acceptText", "Accept All");
        content.put("rejectText", "Reject All");
        banner.setContent(content);
        
        return banner;
    }

    private String generateBannerJavascript(Banner banner) {
        String bgColor = banner.getColors() != null && banner.getColors().containsKey("background") 
                ? banner.getColors().get("background") : "#0F172A";
        String primaryColor = banner.getColors() != null && banner.getColors().containsKey("primary") 
                ? banner.getColors().get("primary") : "#F59E0B";
        String textColor = banner.getColors() != null && banner.getColors().containsKey("text") 
                ? banner.getColors().get("text") : "#F8FAFC";
        
        String headline = banner.getContent() != null && banner.getContent().containsKey("headline") 
                ? banner.getContent().get("headline") : "We value your privacy";
        String description = banner.getContent() != null && banner.getContent().containsKey("description") 
                ? banner.getContent().get("description") : "We use cookies to enhance your browsing experience and analyze our traffic.";
        String acceptText = banner.getContent() != null && banner.getContent().containsKey("acceptText") 
                ? banner.getContent().get("acceptText") : "Accept All";
        String rejectText = banner.getContent() != null && banner.getContent().containsKey("rejectText") 
                ? banner.getContent().get("rejectText") : "Reject All";

        return String.format("""
            (function() {
                var bannerId = '%s';
                
                // 1. Initialize Google Consent Mode v2
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                
                var savedConsent = localStorage.getItem('complianceai_consent_' + bannerId);
                var isAccepted = savedConsent === 'accepted';
                
                gtag('consent', 'default', {
                    'ad_storage': isAccepted ? 'granted' : 'denied',
                    'analytics_storage': isAccepted ? 'granted' : 'denied',
                    'ad_user_data': isAccepted ? 'granted' : 'denied',
                    'ad_personalization': isAccepted ? 'granted' : 'denied',
                    'functional_storage': 'granted',
                    'wait_for_update': 500
                });

                // 2. Tracker Script Interceptor & Auto-Blocker Engine (MutationObserver)
                var blockedScripts = [];
                var blockerPatterns = [
                    { pattern: 'googletagmanager.com', cat: 'analytics' },
                    { pattern: 'google-analytics.com', cat: 'analytics' },
                    { pattern: 'connect.facebook.net', cat: 'marketing' },
                    { pattern: 'static.hotjar.com', cat: 'analytics' },
                    { pattern: 'hotjar.com', cat: 'analytics' }
                ];

                function shouldBlock(src) {
                    if (!src) return false;
                    for (var i = 0; i < blockerPatterns.length; i++) {
                        if (src.indexOf(blockerPatterns[i].pattern) !== -1) {
                            return blockerPatterns[i].cat;
                        }
                    }
                    return null;
                }

                if (!isAccepted) {
                    var observer = new MutationObserver(function(mutations) {
                        mutations.forEach(function(mutation) {
                            mutation.addedNodes.forEach(function(node) {
                                if (node.tagName === 'SCRIPT' && node.src) {
                                    var category = shouldBlock(node.src);
                                    if (category) {
                                        // Save script info for later execution
                                        blockedScripts.push({
                                            src: node.src,
                                            category: category,
                                            originalNode: node
                                        });
                                        // Change script type to plain text so browser holds execution
                                        node.type = 'text/plain';
                                        node.setAttribute('data-complianceai-blocked', 'true');
                                        node.setAttribute('data-complianceai-category', category);
                                        logBlock(node.src, category);
                                    }
                                }
                            });
                        });
                    });
                    
                    observer.observe(document.documentElement, {
                        childList: true,
                        subtree: true
                    });
                }

                function logBlock(src, category) {
                    console.log('[ComplianceAI Auto-Blocker] Blocked tracker script matching pattern in category: ' + category + ' -> ' + src);
                }

                function executeBlockedScripts(choices) {
                    var scriptsToRun = document.querySelectorAll('script[data-complianceai-blocked="true"]');
                    scriptsToRun.forEach(function(node) {
                        var cat = node.getAttribute('data-complianceai-category');
                        if (choices[cat]) {
                            var newScript = document.createElement('script');
                            newScript.src = node.src;
                            newScript.type = 'text/javascript';
                            document.head.appendChild(newScript);
                            node.remove();
                            console.log('[ComplianceAI Auto-Blocker] Released and executed tracker: ' + newScript.src);
                        }
                    });
                }

                // Skip rendering banner if consent state is already recorded
                if (savedConsent) return;
                
                var css = `
                    #compliance-banner {
                        position: fixed;
                        bottom: 24px;
                        right: 24px;
                        max-width: 420px;
                        background: %s;
                        color: %s;
                        border: 1px solid #334155;
                        border-radius: 20px;
                        padding: 24px;
                        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.5);
                        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                        z-index: 999999;
                        transition: opacity 0.5s ease;
                    }
                    #compliance-banner h4 { margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: %s; }
                    #compliance-banner p { margin: 0 0 16px 0; font-size: 14px; line-height: 1.5; opacity: 0.85; }
                    #compliance-banner .actions { display: flex; gap: 8px; justify-content: flex-end; }
                    #compliance-banner button { 
                        padding: 10px 18px; 
                        border-radius: 9999px; 
                        font-size: 12px; 
                        font-weight: 700; 
                        text-transform: uppercase; 
                        cursor: pointer; 
                        border: none;
                        transition: all 0.3s;
                    }
                    #compliance-banner .btn-accept { background: %s; color: %s; }
                    #compliance-banner .btn-accept:hover { filter: brightness(1.1); }
                    #compliance-banner .btn-reject { background: transparent; border: 1px solid #334155; color: %s; }
                    #compliance-banner .btn-reject:hover { background: #1e293b; }
                `;
                
                var style = document.createElement('style');
                style.innerHTML = css;
                document.head.appendChild(style);
                
                var container = document.createElement('div');
                container.id = 'compliance-banner';
                container.innerHTML = `
                    <h4>%s</h4>
                    <p>%s</p>
                    <div class="actions">
                        <button class="btn-reject" onclick="complianceAiConsent(false)">%s</button>
                        <button class="btn-accept" onclick="complianceAiConsent(true)">%s</button>
                    </div>
                `;
                
                document.body.appendChild(container);
                
                window.complianceAiConsent = function(agreed) {
                    localStorage.setItem('complianceai_consent_' + bannerId, agreed ? 'accepted' : 'rejected');
                    container.style.opacity = '0';
                    setTimeout(function() { container.remove(); }, 500);
                    
                    var choices = {
                        analytics: agreed,
                        marketing: agreed,
                        functional: true
                    };

                    // Update Google Consent Mode v2 triggers dynamically
                    gtag('consent', 'update', {
                        'ad_storage': agreed ? 'granted' : 'denied',
                        'analytics_storage': agreed ? 'granted' : 'denied',
                        'ad_user_data': agreed ? 'granted' : 'denied',
                        'ad_personalization': agreed ? 'granted' : 'denied'
                    });

                    // Trigger block release
                    executeBlockedScripts(choices);
                    
                    fetch('/api/v1/consent/log', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            bannerId: bannerId,
                            consentGiven: agreed,
                            choices: choices
                        })
                    }).catch(function(err) { console.warn('ComplianceAI consent logging failed', err); });
                };
            })();
            """, 
            banner.getId(), bgColor, textColor, primaryColor, primaryColor, bgColor, textColor, 
            headline, description, rejectText, acceptText);
    }
}
