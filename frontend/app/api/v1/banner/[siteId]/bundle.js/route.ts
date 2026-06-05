import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8080';

type ConsentCategory = 'analytics' | 'marketing' | 'functional';

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
}

interface BundleTracker {
  pattern: string;
  category: ConsentCategory;
}

interface BundleConfig {
  siteId: string;
  storageKey: string;
  legacyStorageKey: string;
  consentVersion: number;
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
  };
  trackers: BundleTracker[];
}

const DEFAULT_TRACKERS: BundleTracker[] = [
  { pattern: 'googletagmanager.com', category: 'analytics' },
  { pattern: 'google-analytics.com', category: 'analytics' },
  { pattern: 'analytics.google.com', category: 'analytics' },
  { pattern: 'www.google-analytics.com', category: 'analytics' },
  { pattern: 'connect.facebook.net', category: 'marketing' },
  { pattern: 'facebook.com/tr', category: 'marketing' },
  { pattern: 'static.hotjar.com', category: 'analytics' },
  { pattern: 'hotjar.com', category: 'analytics' },
];

function normaliseCategory(category?: string): ConsentCategory | null {
  const value = category?.trim().toLowerCase();
  if (value === 'analytics' || value === 'marketing' || value === 'functional') {
    return value;
  }
  return null;
}

function normaliseTrackers(trackers: ClassifiedTracker[]): BundleTracker[] {
  const seen = new Set<string>();
  const result: BundleTracker[] = [];
  const candidates: ClassifiedTracker[] = [
    ...trackers,
    ...DEFAULT_TRACKERS.map((tracker) => ({
      pattern: tracker.pattern,
      category: tracker.category,
    })),
  ];

  for (const tracker of candidates) {
    const category = normaliseCategory(tracker.category ?? tracker.cat);
    const pattern = (tracker.domain ?? tracker.pattern ?? '').trim().toLowerCase();

    if (!category || !pattern || (category !== 'analytics' && category !== 'marketing')) {
      continue;
    }

    const key = `${category}:${pattern}`;
    if (seen.has(key)) continue;

    seen.add(key);
    result.push({ pattern, category });
  }

  return result;
}

function minifyJavaScript(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\n\s*/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s*([{}();,:=<>+\-*/?&|[\]])\s*/g, '$1')
    .trim();
}

function buildBundle(config: BundleConfig): string {
  const configJson = JSON.stringify(config);

  return minifyJavaScript(`
    (function () {
      'use strict';

      if (window.__COMPLIANCEAI_BANNER_ACTIVE__) return;
      window.__COMPLIANCEAI_BANNER_ACTIVE__ = true;

      var CFG = ${configJson};
      var BLOCK_ATTR = 'data-complianceai-blocked';
      var SRC_ATTR = 'data-blocked-src';
      var CAT_ATTR = 'data-complianceai-category';
      var NONCE_ATTR = 'data-complianceai-restored';
      var originals = {
        appendChild: Node.prototype.appendChild,
        insertBefore: Node.prototype.insertBefore,
        replaceChild: Node.prototype.replaceChild
      };

      function ready(fn) {
        if (document.body) {
          fn();
          return;
        }
        document.addEventListener('DOMContentLoaded', fn, { once: true });
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
            version: parsed.version || CFG.consentVersion,
            updatedAt: parsed.updatedAt || null
          };
        } catch (e) {
          return null;
        }
      }

      function writeConsent(consent) {
        var payload = {
          analytics: !!consent.analytics,
          marketing: !!consent.marketing,
          functional: consent.functional !== false,
          version: CFG.consentVersion,
          updatedAt: new Date().toISOString()
        };
        try {
          localStorage.setItem(CFG.storageKey, JSON.stringify(payload));
          localStorage.setItem(CFG.legacyStorageKey, JSON.stringify(payload));
        } catch (e) {}
        return payload;
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
          wait_for_update: mode === 'default' ? 500 : undefined
        });
      }

      function absoluteUrl(value) {
        try {
          return new URL(value, document.baseURI).href;
        } catch (e) {
          return value || '';
        }
      }

      function matchCategory(src) {
        var value = absoluteUrl(src).toLowerCase();
        for (var i = 0; i < CFG.trackers.length; i++) {
          if (value.indexOf(CFG.trackers[i].pattern) !== -1) {
            return CFG.trackers[i].category;
          }
        }
        return null;
      }

      function shouldAllow(category) {
        var consent = readConsent();
        return !!(consent && consent[category]);
      }

      function isScript(node) {
        return node && node.tagName && node.tagName.toLowerCase() === 'script';
      }

      function blockScript(script) {
        if (!isScript(script) || script.getAttribute(NONCE_ATTR) === 'true') return script;

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
          restored.setAttribute(NONCE_ATTR, 'true');
          restored.async = blocked.async;
          restored.defer = blocked.defer;
          restored.type = 'text/javascript';

          for (var j = 0; j < blocked.attributes.length; j++) {
            var attr = blocked.attributes[j];
            if (attr.name === 'type' || attr.name === 'src' || attr.name === BLOCK_ATTR || attr.name === SRC_ATTR || attr.name === CAT_ATTR) {
              continue;
            }
            restored.setAttribute(attr.name, attr.value);
          }

          restored.src = src;
          originals.insertBefore.call(blocked.parentNode || document.head, restored, blocked.nextSibling);
          if (blocked.parentNode) blocked.parentNode.removeChild(blocked);
        }
      }

      Node.prototype.appendChild = function (node) {
        return originals.appendChild.call(this, blockScript(node));
      };

      Node.prototype.insertBefore = function (node, ref) {
        return originals.insertBefore.call(this, blockScript(node), ref);
      };

      Node.prototype.replaceChild = function (node, oldNode) {
        return originals.replaceChild.call(this, blockScript(node), oldNode);
      };

      function scanExistingScripts() {
        var scripts = document.querySelectorAll('head script[src],body script[src]');
        for (var i = 0; i < scripts.length; i++) {
          blockScript(scripts[i]);
        }
      }

      var observer = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          for (var j = 0; j < mutations[i].addedNodes.length; j++) {
            var node = mutations[i].addedNodes[j];
            if (isScript(node)) {
              blockScript(node);
            } else if (node && node.querySelectorAll) {
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
        if (wrap) {
          wrap.style.opacity = '0';
          wrap.style.transform = 'translateX(-50%) translateY(16px)';
          setTimeout(function () { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }, 240);
        }
        if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
      }

      function logConsent(consent) {
        try {
          fetch('/api/v1/consent/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bannerId: CFG.siteId, siteId: CFG.siteId, choices: consent, consentGiven: !!(consent.analytics || consent.marketing || consent.functional) }),
            keepalive: true
          });
        } catch (e) {}
      }

      function applyConsent(consent) {
        var saved = writeConsent(consent);
        updateGoogleConsent(saved, 'update');
        releaseBlockedScripts(saved);
        removeBanner();
        logConsent(saved);
      }

      function text(value) {
        return document.createTextNode(value);
      }

      function button(id, label, variant) {
        var el = document.createElement('button');
        el.id = id;
        el.type = 'button';
        el.className = variant;
        el.appendChild(text(label));
        return el;
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

      function renderBanner() {
        if (document.getElementById('cai-wrap')) return;

        var css = document.createElement('style');
        css.id = 'cai-style';
        css.textContent =
          '#cai-wrap,#cai-modal{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;box-sizing:border-box}' +
          '#cai-wrap *,#cai-modal *{box-sizing:border-box}' +
          '#cai-wrap{position:fixed;left:50%;bottom:24px;z-index:2147483647;width:calc(100% - 32px);max-width:760px;transform:translateX(-50%) translateY(16px);display:grid;grid-template-columns:1fr auto;gap:16px 20px;padding:20px;background:' + CFG.colors.background + ';color:' + CFG.colors.text + ';border:1px solid ' + CFG.colors.border + ';border-radius:16px;box-shadow:0 24px 80px rgba(15,23,42,.32);opacity:0;transition:opacity .24s ease,transform .24s ease}' +
          '#cai-wrap h2{grid-column:1/-1;margin:0;font-size:17px;line-height:1.25;font-weight:750;letter-spacing:0;color:' + CFG.colors.text + '}' +
          '#cai-wrap p{grid-column:1/-1;margin:0;font-size:14px;line-height:1.55;color:' + CFG.colors.text + ';opacity:.82}' +
          '#cai-actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:10px;grid-column:1/-1}' +
          '#cai-actions button,#cai-save{min-height:40px;border-radius:8px;padding:0 14px;border:1px solid ' + CFG.colors.border + ';font-size:13px;font-weight:700;letter-spacing:0;cursor:pointer}' +
          '.cai-primary{background:' + CFG.colors.primary + ';color:' + CFG.colors.background + ';border-color:' + CFG.colors.primary + '!important}.cai-secondary{background:transparent;color:' + CFG.colors.text + '}.cai-secondary:hover{background:rgba(148,163,184,.14)}' +
          '#cai-modal{position:fixed;inset:0;z-index:2147483647;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(2,6,23,.62)}#cai-modal.open{display:flex}' +
          '#cai-panel{width:min(100%,480px);padding:22px;background:' + CFG.colors.background + ';color:' + CFG.colors.text + ';border:1px solid ' + CFG.colors.border + ';border-radius:16px;box-shadow:0 24px 80px rgba(15,23,42,.35)}' +
          '#cai-panel h2{margin:0 0 8px;font-size:18px;line-height:1.25;letter-spacing:0}#cai-panel p{margin:0 0 16px;font-size:13px;line-height:1.55;opacity:.78}' +
          '.cai-row{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:14px 0;border-top:1px solid ' + CFG.colors.border + '}.cai-row label{font-size:14px;font-weight:700}.cai-row small{display:block;margin-top:3px;font-size:12px;line-height:1.35;opacity:.68}' +
          '.cai-toggle{position:relative;display:inline-block;width:42px;height:24px;flex:0 0 auto}.cai-toggle input{position:absolute;opacity:0}.cai-slider{position:absolute;inset:0;border-radius:999px;background:#475569;cursor:pointer;transition:.18s}.cai-slider:before{content:"";position:absolute;width:18px;height:18px;left:3px;top:3px;border-radius:50%;background:#fff;transition:.18s;box-shadow:0 1px 2px rgba(0,0,0,.22)}.cai-toggle input:checked+.cai-slider{background:' + CFG.colors.primary + '}.cai-toggle input:checked+.cai-slider:before{transform:translateX(18px)}.cai-toggle input:disabled+.cai-slider{opacity:.58;cursor:not-allowed}' +
          '#cai-save{width:100%;margin-top:18px;background:' + CFG.colors.primary + ';color:' + CFG.colors.background + ';border-color:' + CFG.colors.primary + '!important}' +
          '@media(max-width:640px){#cai-wrap{bottom:12px;width:calc(100% - 24px);padding:16px;grid-template-columns:1fr}#cai-actions{justify-content:stretch}#cai-actions button{flex:1 1 100%}}';
        document.head.appendChild(css);

        var wrap = document.createElement('section');
        wrap.id = 'cai-wrap';
        wrap.setAttribute('role', 'dialog');
        wrap.setAttribute('aria-live', 'polite');
        wrap.setAttribute('aria-label', 'Cookie consent');

        var title = document.createElement('h2');
        title.appendChild(text(CFG.content.headline));
        var desc = document.createElement('p');
        desc.appendChild(text(CFG.content.description));
        var actions = document.createElement('div');
        actions.id = 'cai-actions';
        actions.appendChild(button('cai-manage', CFG.content.manageText, 'cai-secondary'));
        actions.appendChild(button('cai-reject', CFG.content.rejectText, 'cai-secondary'));
        actions.appendChild(button('cai-accept', CFG.content.acceptText, 'cai-primary'));
        wrap.appendChild(title);
        wrap.appendChild(desc);
        wrap.appendChild(actions);

        var modal = document.createElement('div');
        modal.id = 'cai-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', 'Cookie preferences');

        var panel = document.createElement('div');
        panel.id = 'cai-panel';
        var modalTitle = document.createElement('h2');
        modalTitle.appendChild(text('Cookie Preferences'));
        var modalDesc = document.createElement('p');
        modalDesc.appendChild(text('Choose which non-essential cookies this site may use. Essential cookies are always on.'));
        panel.appendChild(modalTitle);
        panel.appendChild(modalDesc);
        panel.appendChild(preferenceRow('cai-essential', 'Essential', 'Required for security and core site features.', true, true));
        panel.appendChild(preferenceRow('cai-analytics', 'Analytics', 'Helps measure visits and improve the website.', false, false));
        panel.appendChild(preferenceRow('cai-marketing', 'Marketing', 'Supports advertising, retargeting, and campaign measurement.', false, false));
        panel.appendChild(preferenceRow('cai-functional', 'Functional', 'Enables enhanced features such as chat or embedded media.', true, false));
        panel.appendChild(button('cai-save', 'Save My Preferences', 'cai-primary'));
        modal.appendChild(panel);

        document.body.appendChild(wrap);
        document.body.appendChild(modal);

        document.getElementById('cai-accept').addEventListener('click', function () {
          applyConsent({ analytics: true, marketing: true, functional: true });
        });
        document.getElementById('cai-reject').addEventListener('click', function () {
          applyConsent({ analytics: false, marketing: false, functional: true });
        });
        document.getElementById('cai-manage').addEventListener('click', function () {
          modal.className = 'open';
          document.getElementById('cai-analytics').focus();
        });
        document.getElementById('cai-save').addEventListener('click', function () {
          applyConsent({
            analytics: document.getElementById('cai-analytics').checked,
            marketing: document.getElementById('cai-marketing').checked,
            functional: document.getElementById('cai-functional').checked
          });
        });
        modal.addEventListener('click', function (event) {
          if (event.target === modal) modal.className = '';
        });
        document.addEventListener('keydown', function (event) {
          if (event.key === 'Escape') modal.className = '';
        });

        requestAnimationFrame(function () {
          wrap.style.opacity = '1';
          wrap.style.transform = 'translateX(-50%) translateY(0)';
        });
      }

      var initialConsent = readConsent();
      updateGoogleConsent(initialConsent || { analytics: false, marketing: false, functional: true }, 'default');
      scanExistingScripts();

      if (initialConsent) {
        releaseBlockedScripts(initialConsent);
      } else {
        ready(renderBanner);
      }
    })();
  `);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { siteId: string } }
) {
  const { siteId } = params;

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

  const bundleConfig: BundleConfig = {
    siteId: config.id ?? siteId,
    storageKey: 'complianceai_consent',
    legacyStorageKey: `complianceai_consent_${siteId}`,
    consentVersion: 1,
    colors: {
      background: config.colors?.background ?? '#0f172a',
      primary: config.colors?.primary ?? '#f59e0b',
      text: config.colors?.text ?? '#f8fafc',
      border: config.colors?.border ?? '#334155',
    },
    content: {
      headline: config.content?.headline ?? 'We value your privacy',
      description:
        config.content?.description ??
        'We use cookies to improve your experience, measure traffic, and personalize content. You can accept all, reject non-essential cookies, or manage preferences.',
      acceptText: config.content?.acceptText ?? 'Accept All',
      rejectText: config.content?.rejectText ?? 'Reject Non-Essential',
      manageText: config.content?.manageText ?? 'Manage Preferences',
    },
    trackers: normaliseTrackers(trackers),
  };

  return new NextResponse(buildBundle(bundleConfig), {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=86400, stale-while-revalidate=3600',
      'Access-Control-Allow-Origin': '*',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
