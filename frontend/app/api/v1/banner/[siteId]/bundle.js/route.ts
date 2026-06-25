import { NextRequest, NextResponse } from "next/server";
import { backendApiBaseUrl } from "@/lib/env";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const API_BASE = backendApiBaseUrl().replace(/\/api\/?$/, "");

type ConsentMode = "auto" | "gdpr" | "ccpa";
type RuntimeMode = "gdpr" | "ccpa";
type ConsentCategory = "analytics" | "marketing" | "functional";

interface ClassifiedTracker {
  domain?: string;
  pattern?: string;
  category?: string;
  cat?: string;
}

interface BannerConfig {
  id?: string;
  colors?: Record<string, string>;
  content?: Record<string, string>;
  advanced?: Record<string, unknown>;
}

interface BundleTracker {
  pattern: string;
  category: ConsentCategory;
}

interface GeoHint {
  country: string | null;
  region: string | null;
}

interface BundleConfig {
  siteId: string;
  storageKey: string;
  legacyStorageKey: string;
  optOutStorageKey: string;
  consentVersion: number;
  consentModeOverride: ConsentMode;
  serverGeo: GeoHint;
  initialMode: RuntimeMode;
  colors: {
    background: string;
    primary: string;
    text: string;
    border: string;
  };
  content: {
    headline: string;
    description: string;
    acceptText: string;
    rejectText: string;
    manageText: string;
    doNotSellText: string;
  };
  branding: {
    hidePoweredByBadge: boolean;
    customPrivacyPolicyUrl: string | null;
  };
  crossDomainConsentSharingEnabled: boolean;
  enterpriseConsentKey: string;
  trackers: BundleTracker[];
}

const DEFAULT_TRACKERS: BundleTracker[] = [
  { pattern: "googletagmanager.com", category: "analytics" },
  { pattern: "google-analytics.com", category: "analytics" },
  { pattern: "analytics.google.com", category: "analytics" },
  { pattern: "www.google-analytics.com", category: "analytics" },
  { pattern: "connect.facebook.net", category: "marketing" },
  { pattern: "facebook.com/tr", category: "marketing" },
  { pattern: "static.hotjar.com", category: "analytics" },
  { pattern: "hotjar.com", category: "analytics" },
];

const GDPR_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE",
  "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS",
  "LI", "NO", "GB", "UK", "CH", "CA",
]);

function normaliseCategory(category?: string): ConsentCategory | null {
  const value = category?.trim().toLowerCase();
  if (value === "analytics" || value === "marketing" || value === "functional") return value;
  return null;
}

function normaliseMode(value: unknown): ConsentMode {
  const mode = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (mode === "gdpr" || mode === "strict-gdpr" || mode === "enforce-gdpr") return "gdpr";
  if (mode === "ccpa" || mode === "us-ccpa" || mode === "enforce-ccpa") return "ccpa";
  return "auto";
}

function normaliseTrackers(trackers: ClassifiedTracker[]): BundleTracker[] {
  const seen = new Set<string>();
  const result: BundleTracker[] = [];
  const candidates: ClassifiedTracker[] = [
    ...trackers,
    ...DEFAULT_TRACKERS.map((tracker) => ({ pattern: tracker.pattern, category: tracker.category })),
  ];

  for (const tracker of candidates) {
    const category = normaliseCategory(tracker.category ?? tracker.cat);
    const pattern = (tracker.domain ?? tracker.pattern ?? "").trim().toLowerCase();
    if (!category || !pattern || (category !== "analytics" && category !== "marketing")) continue;
    const key = `${category}:${pattern}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({ pattern, category });
  }
  return result;
}

function geoFromHeaders(request: NextRequest): GeoHint {
  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-country-code") ||
    request.headers.get("x-appengine-country") ||
    request.headers.get("cloudfront-viewer-country");
  const region =
    request.headers.get("x-vercel-ip-country-region") ||
    request.headers.get("cf-region") ||
    request.headers.get("x-region-code") ||
    request.headers.get("cloudfront-viewer-country-region");
  return {
    country: country ? country.toUpperCase() : null,
    region: region ? region.toUpperCase() : null,
  };
}

function modeForGeo(geo: GeoHint, override: ConsentMode): RuntimeMode {
  if (override === "gdpr" || override === "ccpa") return override;
  return geo.country && GDPR_COUNTRIES.has(geo.country) ? "gdpr" : "ccpa";
}

function minifyJavaScript(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\n\s*/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s*([{}();,:=<>+\-*/?&|[\]])\s*/g, "$1")
    .trim();
}

function buildBundle(config: BundleConfig): string {
  const configJson = JSON.stringify(config);
  const gdprCountriesJson = JSON.stringify(Array.from(GDPR_COUNTRIES));

  return minifyJavaScript(`
    (function () {
      'use strict';
      if (window.__Zenvyra_BANNER_ACTIVE__) return;
      window.__Zenvyra_BANNER_ACTIVE__ = true;

      var CFG = ${configJson};
      var GDPR_COUNTRIES = ${gdprCountriesJson};
      if (CFG.crossDomainConsentSharingEnabled) {
        CFG.storageKey = CFG.enterpriseConsentKey;
      }
      var BLOCK_ATTR = 'data-Zenvyra-blocked';
      var SRC_ATTR = 'data-blocked-src';
      var CAT_ATTR = 'data-Zenvyra-category';
      var RESTORED_ATTR = 'data-Zenvyra-restored';
      var runtimeMode = CFG.initialMode;
      var originals = {
        appendChild: Node.prototype.appendChild,
        insertBefore: Node.prototype.insertBefore,
        replaceChild: Node.prototype.replaceChild
      };

      function ready(fn) {
        if (document.body) fn();
        else document.addEventListener('DOMContentLoaded', fn, { once: true });
      }

      function normalizeCountry(value) {
        return value ? String(value).trim().toUpperCase() : null;
      }

      function modeForGeo(country) {
        if (CFG.consentModeOverride === 'gdpr' || CFG.consentModeOverride === 'ccpa') return CFG.consentModeOverride;
        country = normalizeCountry(country);
        return country && GDPR_COUNTRIES.indexOf(country) !== -1 ? 'gdpr' : 'ccpa';
      }

      function resolveGeoMode() {
        if (CFG.consentModeOverride !== 'auto' || CFG.serverGeo.country) {
          runtimeMode = modeForGeo(CFG.serverGeo.country);
          return Promise.resolve(runtimeMode);
        }
        return fetch('https://www.cloudflare.com/cdn-cgi/trace', { cache: 'no-store', mode: 'cors' })
          .then(function (response) { return response.ok ? response.text() : ''; })
          .then(function (body) {
            var match = body.match(/(?:^|\\n)loc=([A-Z]{2})/);
            runtimeMode = modeForGeo(match && match[1]);
            return runtimeMode;
          })
          .catch(function () {
            runtimeMode = 'ccpa';
            return runtimeMode;
          });
      }

      function readConsent() {
        try {
          var raw = localStorage.getItem(CFG.storageKey) || localStorage.getItem(CFG.legacyStorageKey);
          if (!raw) return null;
          var parsed = JSON.parse(raw);
          if (typeof parsed.analytics !== 'boolean' || typeof parsed.marketing !== 'boolean') return null;
          return {
            analytics: !!parsed.analytics,
            marketing: !!parsed.marketing,
            functional: parsed.functional !== false,
            mode: parsed.mode || runtimeMode,
            version: parsed.version || CFG.consentVersion,
            updatedAt: parsed.updatedAt || null
          };
        } catch (e) {
          return null;
        }
      }

      function parseSyncedConsent(raw) {
        try {
          if (!raw) return null;
          var parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
          if (typeof parsed.analytics !== 'boolean' || typeof parsed.marketing !== 'boolean') return null;
          return parsed;
        } catch (e) {
          return null;
        }
      }

      function anonymousUserId() {
        try {
          var key = 'zenvyra_anon_id';
          var existing = localStorage.getItem(key);
          if (existing) return existing;
          var value = (crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + '-' + Math.random().toString(16).slice(2);
          localStorage.setItem(key, value);
          return value;
        } catch (e) {
          return 'anonymous';
        }
      }

      function writeConsent(consent) {
        var payload = {
          analytics: !!consent.analytics,
          marketing: !!consent.marketing,
          functional: consent.functional !== false,
          mode: runtimeMode,
          version: CFG.consentVersion,
          updatedAt: new Date().toISOString()
        };
        try {
          localStorage.setItem(CFG.storageKey, JSON.stringify(payload));
          localStorage.setItem(CFG.legacyStorageKey, JSON.stringify(payload));
          if (runtimeMode === 'ccpa' && !payload.marketing) localStorage.setItem(CFG.optOutStorageKey, 'true');
        } catch (e) {}
        return payload;
      }

      function fetchSyncedConsent() {
        if (!CFG.crossDomainConsentSharingEnabled) return Promise.resolve(null);
        return fetch('/api/v1/consent/sync?enterpriseConsentKey=' + encodeURIComponent(CFG.enterpriseConsentKey) + '&anonymousUserId=' + encodeURIComponent(anonymousUserId()), {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          credentials: 'omit'
        })
          .then(function (response) { return response.ok ? response.json() : null; })
          .then(function (payload) {
            if (!payload || !payload.found) return null;
            var synced = parseSyncedConsent(payload.consentState);
            if (synced) return writeConsent(synced);
            return null;
          })
          .catch(function () { return null; });
      }

      function saveSyncedConsent(consent) {
        if (!CFG.crossDomainConsentSharingEnabled) return;
        try {
          fetch('/api/v1/consent/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ siteId: CFG.enterpriseConsentKey, anonymousUserId: anonymousUserId(), consentState: consent }),
            keepalive: true
          });
        } catch (e) {}
      }

      function readOptOut() {
        try { return localStorage.getItem(CFG.optOutStorageKey) === 'true'; } catch (e) { return false; }
      }

      function defaultConsentForMode() {
        if (runtimeMode === 'ccpa' && !readOptOut()) {
          return { analytics: true, marketing: true, functional: true, mode: runtimeMode };
        }
        return { analytics: false, marketing: false, functional: true, mode: runtimeMode };
      }

      function updateGoogleConsent(consent, mode) {
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
        window.gtag('consent', mode || 'default', {
          analytics_storage: consent.analytics ? 'granted' : 'denied',
          ad_storage: consent.marketing ? 'granted' : 'denied',
          ad_user_data: consent.marketing ? 'granted' : 'denied',
          ad_personalization: consent.marketing ? 'granted' : 'denied',
          functionality_storage: consent.functional ? 'granted' : 'denied',
          security_storage: 'granted',
          wait_for_update: mode === 'default' && runtimeMode === 'gdpr' ? 500 : undefined
        });
      }

      function absoluteUrl(value) {
        try { return new URL(value, document.baseURI).href; } catch (e) { return value || ''; }
      }

      function matchCategory(src) {
        var value = absoluteUrl(src).toLowerCase();
        for (var i = 0; i < CFG.trackers.length; i++) {
          if (value.indexOf(CFG.trackers[i].pattern) !== -1) return CFG.trackers[i].category;
        }
        return null;
      }

      function activeConsent() {
        return readConsent() || defaultConsentForMode();
      }

      function shouldAllow(category) {
        var consent = activeConsent();
        return !!(consent && consent[category]);
      }

      function isScript(node) {
        return node && node.tagName && node.tagName.toLowerCase() === 'script';
      }

      function blockScript(script) {
        if (!isScript(script) || script.getAttribute(RESTORED_ATTR) === 'true') return script;
        var src = script.getAttribute('src') || script.src || script.getAttribute(SRC_ATTR);
        if (!src) return script;
        var category = matchCategory(src);
        if (!category || shouldAllow(category)) return script;
        script.setAttribute(SRC_ATTR, absoluteUrl(src));
        script.setAttribute(CAT_ATTR, category);
        script.setAttribute(BLOCK_ATTR, 'true');
        script.setAttribute('type', 'text/plain');
        script.removeAttribute('src');
        return script;
      }

      function releaseBlockedScripts(consent) {
        var scripts = document.querySelectorAll('script[' + BLOCK_ATTR + '="true"]');
        for (var i = 0; i < scripts.length; i++) {
          var blocked = scripts[i];
          var category = blocked.getAttribute(CAT_ATTR);
          var src = blocked.getAttribute(SRC_ATTR);
          if (!src || !consent[category]) continue;
          var restored = document.createElement('script');
          restored.setAttribute(RESTORED_ATTR, 'true');
          restored.async = blocked.async;
          restored.defer = blocked.defer;
          restored.type = 'text/javascript';
          for (var j = 0; j < blocked.attributes.length; j++) {
            var attr = blocked.attributes[j];
            if (attr.name === 'type' || attr.name === 'src' || attr.name === BLOCK_ATTR || attr.name === SRC_ATTR || attr.name === CAT_ATTR) continue;
            restored.setAttribute(attr.name, attr.value);
          }
          restored.src = src;
          originals.insertBefore.call(blocked.parentNode || document.head, restored, blocked.nextSibling);
          if (blocked.parentNode) blocked.parentNode.removeChild(blocked);
        }
      }

      function killAdvertisingOperations() {
        var scripts = document.querySelectorAll('script[src]');
        for (var i = 0; i < scripts.length; i++) {
          if (matchCategory(scripts[i].src) === 'marketing') {
            scripts[i].setAttribute(BLOCK_ATTR, 'true');
            scripts[i].setAttribute(CAT_ATTR, 'marketing');
            scripts[i].setAttribute(SRC_ATTR, scripts[i].src);
            scripts[i].removeAttribute('src');
            scripts[i].type = 'text/plain';
          }
        }
        window.fbq = function () {};
        window.ttq = { track: function () {}, page: function () {}, load: function () {} };
        window.lintrk = function () {};
        window.pintrk = function () {};
      }

      Node.prototype.appendChild = function (node) { return originals.appendChild.call(this, blockScript(node)); };
      Node.prototype.insertBefore = function (node, ref) { return originals.insertBefore.call(this, blockScript(node), ref); };
      Node.prototype.replaceChild = function (node, oldNode) { return originals.replaceChild.call(this, blockScript(node), oldNode); };

      function scanExistingScripts() {
        var scripts = document.querySelectorAll('head script[src],body script[src]');
        for (var i = 0; i < scripts.length; i++) blockScript(scripts[i]);
      }

      var observer = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          for (var j = 0; j < mutations[i].addedNodes.length; j++) {
            var node = mutations[i].addedNodes[j];
            if (isScript(node)) blockScript(node);
            else if (node && node.querySelectorAll) {
              var scripts = node.querySelectorAll('script[src]');
              for (var k = 0; k < scripts.length; k++) blockScript(scripts[k]);
            }
          }
        }
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });

      function removeBanner() {
        var wrap = document.getElementById('cai-wrap');
        var modal = document.getElementById('cai-modal');
        if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
        if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
      }

      function logConsent(consent) {
        try {
          fetch('/api/v1/consent/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bannerId: CFG.siteId, siteId: CFG.siteId, anonymousUserId: anonymousUserId(), country: CFG.serverGeo.country, countryCode: CFG.serverGeo.country, mode: runtimeMode, choices: consent, consentState: consent, consentGiven: !!(consent.analytics || consent.marketing || consent.functional) }),
            keepalive: true
          });
        } catch (e) {}
      }

      function applyConsent(consent) {
        var saved = writeConsent(consent);
        updateGoogleConsent(saved, 'update');
        if (!saved.marketing) killAdvertisingOperations();
        releaseBlockedScripts(saved);
        removeBanner();
        logConsent(saved);
        saveSyncedConsent(saved);
      }

      function text(value) { return document.createTextNode(value); }

      function button(id, label, variant) {
        var el = document.createElement('button');
        el.id = id;
        el.type = 'button';
        el.className = variant;
        el.appendChild(text(label));
        return el;
      }

      function poweredBy() {
        if (CFG.branding.hidePoweredByBadge) return null;
        var el = document.createElement('div');
        el.className = 'cai-powered';
        el.appendChild(text('Powered by Zenvyra'));
        return el;
      }

      function injectStyles() {
        if (document.getElementById('cai-style')) return;
        var css = document.createElement('style');
        css.id = 'cai-style';
        css.textContent =
          '#cai-wrap,#cai-modal{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;box-sizing:border-box}#cai-wrap *,#cai-modal *{box-sizing:border-box}' +
          '#cai-modal{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(2,6,23,.72)}#cai-panel{width:min(100%,560px);padding:28px;background:' + CFG.colors.background + ';color:' + CFG.colors.text + ';border:1px solid ' + CFG.colors.border + ';border-radius:16px;box-shadow:0 24px 80px rgba(15,23,42,.45)}#cai-panel h2{margin:0 0 10px;font-size:22px;line-height:1.2;letter-spacing:0}#cai-panel p{margin:0 0 18px;font-size:14px;line-height:1.55;opacity:.82}' +
          '#cai-wrap{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483647;display:flex;align-items:center;justify-content:space-between;gap:14px;max-width:1100px;margin:0 auto;padding:14px 16px;background:' + CFG.colors.background + ';color:' + CFG.colors.text + ';border:1px solid ' + CFG.colors.border + ';border-radius:10px;box-shadow:0 14px 48px rgba(15,23,42,.22)}#cai-wrap p{margin:0;font-size:13px;line-height:1.45;opacity:.86}#cai-wrap strong{display:block;margin-bottom:2px;font-size:13px}' +
          '#cai-actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:10px}#cai-actions button,#cai-save,.cai-link{min-height:38px;border-radius:8px;padding:0 13px;border:1px solid ' + CFG.colors.border + ';font-size:13px;font-weight:750;letter-spacing:0;cursor:pointer}.cai-primary{background:' + CFG.colors.primary + ';color:' + CFG.colors.background + ';border-color:' + CFG.colors.primary + '!important}.cai-secondary{background:transparent;color:' + CFG.colors.text + '}.cai-link{background:transparent;color:' + CFG.colors.primary + ';border-color:' + CFG.colors.primary + '}' +
          '.cai-powered{margin-top:14px;text-align:right;font-size:10px;line-height:1;color:' + CFG.colors.text + ';opacity:.5}' +
          '.cai-row{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:14px 0;border-top:1px solid ' + CFG.colors.border + '}.cai-row label{font-size:14px;font-weight:700}.cai-row small{display:block;margin-top:3px;font-size:12px;line-height:1.35;opacity:.68}.cai-toggle{position:relative;display:inline-block;width:42px;height:24px;flex:0 0 auto}.cai-toggle input{position:absolute;opacity:0}.cai-slider{position:absolute;inset:0;border-radius:999px;background:#475569;cursor:pointer;transition:.18s}.cai-slider:before{content:"";position:absolute;width:18px;height:18px;left:3px;top:3px;border-radius:50%;background:#fff;transition:.18s;box-shadow:0 1px 2px rgba(0,0,0,.22)}.cai-toggle input:checked+.cai-slider{background:' + CFG.colors.primary + '}.cai-toggle input:checked+.cai-slider:before{transform:translateX(18px)}.cai-toggle input:disabled+.cai-slider{opacity:.58;cursor:not-allowed}#cai-save{width:100%;margin-top:18px;background:' + CFG.colors.primary + ';color:' + CFG.colors.background + ';border-color:' + CFG.colors.primary + '!important}' +
          '@media(max-width:720px){#cai-wrap{display:block}#cai-actions{justify-content:stretch;margin-top:12px}#cai-actions button{flex:1 1 100%}}';
        document.head.appendChild(css);
      }

      function preferenceRow(id, title, help, checked, disabled) {
        var row = document.createElement('div');
        row.className = 'cai-row';
        var copy = document.createElement('div');
        var label = document.createElement('label');
        label.setAttribute('for', id);
        label.appendChild(text(title));
        var small = document.createElement('small');
        small.appendChild(text(help));
        copy.appendChild(label);
        copy.appendChild(small);
        var toggle = document.createElement('label');
        toggle.className = 'cai-toggle';
        var input = document.createElement('input');
        input.id = id;
        input.type = 'checkbox';
        input.checked = checked;
        input.disabled = disabled;
        var slider = document.createElement('span');
        slider.className = 'cai-slider';
        toggle.appendChild(input);
        toggle.appendChild(slider);
        row.appendChild(copy);
        row.appendChild(toggle);
        return row;
      }

      function renderGdprModal() {
        if (readConsent() || document.getElementById('cai-modal')) return;
        injectStyles();
        var modal = document.createElement('div');
        modal.id = 'cai-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', 'Cookie consent');
        var panel = document.createElement('div');
        panel.id = 'cai-panel';
        var title = document.createElement('h2');
        title.appendChild(text(CFG.content.headline));
        var desc = document.createElement('p');
        desc.appendChild(text(CFG.content.description));
        var actions = document.createElement('div');
        actions.id = 'cai-actions';
        actions.appendChild(button('cai-reject', CFG.content.rejectText, 'cai-secondary'));
        actions.appendChild(button('cai-accept', CFG.content.acceptText, 'cai-primary'));
        panel.appendChild(title);
        panel.appendChild(desc);
        panel.appendChild(preferenceRow('cai-essential', 'Essential', 'Required for security and core site features.', true, true));
        panel.appendChild(preferenceRow('cai-analytics', 'Analytics', 'Helps measure visits and improve the website.', false, false));
        panel.appendChild(preferenceRow('cai-marketing', 'Marketing', 'Supports advertising, retargeting, and campaign measurement.', false, false));
        panel.appendChild(preferenceRow('cai-functional', 'Functional', 'Enables enhanced features such as chat or embedded media.', true, false));
        panel.appendChild(button('cai-save', 'Save My Preferences', 'cai-primary'));
        panel.appendChild(actions);
        var badge = poweredBy();
        if (badge) panel.appendChild(badge);
        modal.appendChild(panel);
        document.body.appendChild(modal);
        document.getElementById('cai-accept').addEventListener('click', function () { applyConsent({ analytics: true, marketing: true, functional: true }); });
        document.getElementById('cai-reject').addEventListener('click', function () { applyConsent({ analytics: false, marketing: false, functional: true }); });
        document.getElementById('cai-save').addEventListener('click', function () {
          applyConsent({
            analytics: document.getElementById('cai-analytics').checked,
            marketing: document.getElementById('cai-marketing').checked,
            functional: document.getElementById('cai-functional').checked
          });
        });
      }

      function renderCcpaBar() {
        if (readOptOut() || document.getElementById('cai-wrap')) return;
        injectStyles();
        var wrap = document.createElement('section');
        wrap.id = 'cai-wrap';
        wrap.setAttribute('role', 'dialog');
        wrap.setAttribute('aria-live', 'polite');
        wrap.setAttribute('aria-label', 'Privacy notice');
        var copy = document.createElement('p');
        var strong = document.createElement('strong');
        strong.appendChild(text('Privacy choices'));
        copy.appendChild(strong);
        copy.appendChild(text('We may use analytics and advertising partners. You can opt out of sale or sharing at any time.'));
        var actions = document.createElement('div');
        actions.id = 'cai-actions';
        actions.appendChild(button('cai-optout', CFG.content.doNotSellText, 'cai-link'));
        if (CFG.branding.customPrivacyPolicyUrl) {
          var policy = document.createElement('a');
          policy.href = CFG.branding.customPrivacyPolicyUrl;
          policy.target = '_blank';
          policy.rel = 'noopener noreferrer';
          policy.className = 'cai-link';
          policy.appendChild(text('Privacy Policy'));
          actions.appendChild(policy);
        }
        actions.appendChild(button('cai-close', 'OK', 'cai-secondary'));
        wrap.appendChild(copy);
        wrap.appendChild(actions);
        var badge = poweredBy();
        if (badge) wrap.appendChild(badge);
        document.body.appendChild(wrap);
        document.getElementById('cai-optout').addEventListener('click', function () {
          applyConsent({ analytics: true, marketing: false, functional: true });
        });
        document.getElementById('cai-close').addEventListener('click', function () {
          localStorage.setItem(CFG.storageKey + '_notice_seen', 'true');
          removeBanner();
        });
      }

      resolveGeoMode().then(function () {
        return fetchSyncedConsent();
      }).then(function (syncedConsent) {
        var initialConsent = syncedConsent || readConsent() || defaultConsentForMode();
        updateGoogleConsent(initialConsent, 'default');
        scanExistingScripts();
        if (initialConsent.marketing || initialConsent.analytics) releaseBlockedScripts(initialConsent);
        ready(function () {
          if (runtimeMode === 'gdpr') renderGdprModal();
          else renderCcpaBar();
        });
      });
    })();
  `);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { siteId: string } }
) {
  const { siteId } = params;
  const geo = geoFromHeaders(request);

  let config: BannerConfig = {};
  let trackers: ClassifiedTracker[] = [];

  try {
    const [configResponse, trackersResponse] = await Promise.all([
      fetch(`${API_BASE}/api/v1/banners/public/${encodeURIComponent(siteId)}/config`),
      fetch(`${API_BASE}/api/v1/banners/public/${encodeURIComponent(siteId)}/trackers`),
    ]);
    if (configResponse.ok) config = await configResponse.json();
    if (trackersResponse.ok) trackers = await trackersResponse.json();
  } catch {
    config = {};
    trackers = [];
  }

  const override = normaliseMode(config.advanced?.consentModeOverride);
  const crossDomainConsentSharingEnabled = config.advanced?.crossDomainConsentSharingEnabled === true;
  const bundleConfig: BundleConfig = {
    siteId: config.id ?? siteId,
    storageKey: `zenvyra_consent_${siteId}_v2`,
    legacyStorageKey: `zenvyra_consent_${siteId}`,
    optOutStorageKey: `zenvyra_do_not_sell_${siteId}`,
    consentVersion: 2,
    consentModeOverride: override,
    serverGeo: geo,
    initialMode: modeForGeo(geo, override),
    colors: {
      background: config.colors?.background ?? "#0f172a",
      primary: config.colors?.primary ?? "#f59e0b",
      text: config.colors?.text ?? "#f8fafc",
      border: config.colors?.border ?? "#334155",
    },
    content: {
      headline: config.content?.headline ?? "We value your privacy",
      description:
        config.content?.description ??
        "We use cookies to improve your experience, measure traffic, and personalize content. You can accept all, reject non-essential cookies, or manage preferences.",
      acceptText: config.content?.acceptText ?? "Accept All",
      rejectText: config.content?.rejectText ?? "Reject Non-Essential",
      manageText: config.content?.manageText ?? "Manage Preferences",
      doNotSellText:
        config.content?.doNotSellText ?? "Do Not Sell or Share My Personal Information",
    },
    branding: {
      hidePoweredByBadge: config.advanced?.hidePoweredByBadge === true,
      customPrivacyPolicyUrl:
        typeof config.advanced?.customPrivacyPolicyUrl === "string"
          ? config.advanced.customPrivacyPolicyUrl
          : null,
    },
    crossDomainConsentSharingEnabled,
    enterpriseConsentKey:
      typeof config.advanced?.enterpriseConsentKey === "string"
        ? config.advanced.enterpriseConsentKey
        : "zenvyra_enterprise_consent",
    trackers: normaliseTrackers(trackers),
  };

  return new NextResponse(buildBundle(bundleConfig), {
    status: 200,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "private, no-store",
      "Access-Control-Allow-Origin": "*",
      "Cross-Origin-Resource-Policy": "cross-origin",
      "X-Content-Type-Options": "nosniff",
      "Vary": "x-vercel-ip-country, x-vercel-ip-country-region, cf-ipcountry, cf-region, x-country-code, x-region-code, cloudfront-viewer-country, cloudfront-viewer-country-region",
    },
  });
}
