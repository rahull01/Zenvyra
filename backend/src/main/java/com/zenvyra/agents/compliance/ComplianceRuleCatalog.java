package com.zenvyra.agents.compliance;

import java.util.List;

public final class ComplianceRuleCatalog {

    public static final String RULESET_VERSION = "2026.06";

    public static final String GDPR_PRIVACY_NOTICE = "GDPR-2026.06-PRIVACY-NOTICE";
    public static final String GDPR_COOKIE_CONSENT = "GDPR-2026.06-COOKIE-CONSENT";
    public static final String CCPA_PRIVACY_NOTICE = "CCPA-2026.06-PRIVACY-NOTICE";
    public static final String CCPA_OPT_OUT = "CCPA-2026.06-OPT-OUT";
    public static final String DPDP_CONSENT_NOTICE = "DPDP-2026.06-CONSENT-NOTICE";
    public static final String GENERAL_TERMS_NOTICE = "GENERAL-2026.06-TERMS";
    public static final String GENERAL_CONTACT_POINT = "GENERAL-2026.06-CONTACT";

    private ComplianceRuleCatalog() {
    }

    public static List<String> rulesForFramework(String framework) {
        if ("GDPR".equalsIgnoreCase(framework)) {
            return List.of(GDPR_PRIVACY_NOTICE, GDPR_COOKIE_CONSENT, GENERAL_CONTACT_POINT);
        }
        if ("CCPA".equalsIgnoreCase(framework)) {
            return List.of(CCPA_PRIVACY_NOTICE, CCPA_OPT_OUT, GENERAL_CONTACT_POINT);
        }
        if ("DPDP".equalsIgnoreCase(framework)) {
            return List.of(DPDP_CONSENT_NOTICE, GENERAL_CONTACT_POINT);
        }
        return List.of(CCPA_PRIVACY_NOTICE, GENERAL_TERMS_NOTICE, GENERAL_CONTACT_POINT);
    }
}
