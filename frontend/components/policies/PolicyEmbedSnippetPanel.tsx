"use client";

import { useMemo, useState } from "react";
import { Check, Code, Copy, FileJson, PanelsTopLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  companySlug: string;
  policyType: string;
  publicBaseUrl?: string;
};

function buildScriptSnippet(publicBaseUrl: string, companySlug: string, policyType: string) {
  const apiUrl = `${publicBaseUrl}/api/v1/policies/public/${companySlug}/${policyType}`;

  return `<div id="complianceai-privacy-policy"></div>
<script>
(function(){
  var target=document.getElementById('complianceai-privacy-policy');
  if(!target)return;
  function esc(v){return String(v||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function md(src){
    return String(src||'').split(/\\n{2,}/).map(function(block){
      var text=block.trim();
      if(!text)return '';
      if(text.indexOf('# ')===0)return '<h1>'+esc(text.slice(2))+'</h1>';
      if(text.indexOf('## ')===0)return '<h2>'+esc(text.slice(3))+'</h2>';
      if(text.indexOf('### ')===0)return '<h3>'+esc(text.slice(4))+'</h3>';
      var lines=text.split('\\n');
      if(lines.every(function(line){return /^[-*]\\s+/.test(line.trim());})){
        return '<ul>'+lines.map(function(line){return '<li>'+esc(line.trim().replace(/^[-*]\\s+/,''))+'</li>';}).join('')+'</ul>';
      }
      return '<p>'+esc(text).replace(/\\n/g,'<br>')+'</p>';
    }).join('');
  }
  fetch('${apiUrl}',{headers:{Accept:'application/json'}})
    .then(function(res){if(!res.ok)throw new Error('Policy unavailable');return res.json();})
    .then(function(policy){
      target.innerHTML='<article class="complianceai-policy"><h1>'+esc(policy.title)+'</h1>'+md(policy.markdown)+'</article>';
    })
    .catch(function(){target.textContent='This policy is temporarily unavailable.';});
})();
</script>`;
}

export default function PolicyEmbedSnippetPanel({
  companySlug,
  policyType,
  publicBaseUrl = "https://complianceai.pro",
}: Props) {
  const [copied, setCopied] = useState<"iframe" | "script" | null>(null);
  const policyUrl = `${publicBaseUrl}/p/${companySlug}/${policyType}`;

  const iframeSnippet = `<iframe src="${policyUrl}" style="width:100%; height:800px; border:none;" loading="lazy" title="Hosted ${policyType.replace(/-/g, " ")}"></iframe>`;
  const scriptSnippet = useMemo(
    () => buildScriptSnippet(publicBaseUrl, companySlug, policyType),
    [publicBaseUrl, companySlug, policyType]
  );

  const copy = async (kind: "iframe" | "script", value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="bg-background-primary border border-border-light rounded-3xl p-6 shadow-card space-y-5">
      <div>
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
          <Code className="text-primary h-4 w-4" />
          Live policy embeds
        </h3>
        <p className="mt-2 text-xs text-text-secondary leading-relaxed font-medium">
          Share the hosted policy URL or render the latest policy directly on the customer website.
        </p>
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-border-light bg-background-secondary p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-text-primary">
              <PanelsTopLeft className="h-4 w-4 text-primary" />
              Responsive iframe
            </div>
            <Button
              onClick={() => copy("iframe", iframeSnippet)}
              variant="outline"
              className="h-8 rounded-xl border-border-medium px-3 text-caption font-bold gap-1.5"
            >
              {copied === "iframe" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              Copy
            </Button>
          </div>
          <code className="block break-all font-mono text-caption leading-relaxed text-text-secondary">
            {iframeSnippet}
          </code>
        </div>

        <div className="rounded-2xl border border-border-light bg-background-secondary p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-text-primary">
              <FileJson className="h-4 w-4 text-primary" />
              Dynamic script inject
            </div>
            <Button
              onClick={() => copy("script", scriptSnippet)}
              variant="outline"
              className="h-8 rounded-xl border-border-medium px-3 text-caption font-bold gap-1.5"
            >
              {copied === "script" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              Copy
            </Button>
          </div>
          <code className="block max-h-56 overflow-auto whitespace-pre-wrap font-mono text-caption leading-relaxed text-text-secondary">
            {scriptSnippet}
          </code>
        </div>
      </div>
    </div>
  );
}
