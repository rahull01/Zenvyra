package com.zenvyra.service;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class TemplateRenderer {
    private static final Pattern TOKEN_PATTERN = Pattern.compile("\\[([^\\]]+)]");

    public String render(String template, Map<String, String> values) {
        if (template == null || template.isBlank()) {
            return "";
        }

        Matcher matcher = TOKEN_PATTERN.matcher(template);
        StringBuilder rendered = new StringBuilder();
        while (matcher.find()) {
            String token = matcher.group(1).trim();
            matcher.appendReplacement(rendered, Matcher.quoteReplacement(values.getOrDefault(token, matcher.group())));
        }
        matcher.appendTail(rendered);
        return rendered.toString();
    }
}
