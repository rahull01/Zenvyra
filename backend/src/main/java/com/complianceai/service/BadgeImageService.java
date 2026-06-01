package com.complianceai.service;

import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.font.FontRenderContext;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;

@Service
public class BadgeImageService {

    public enum BadgeState {
        GREEN, YELLOW, RED
    }

    public byte[] renderBadgePng(String websiteName, double score, BadgeState state, boolean premium) {
        // Simple deterministic badge rendering (production-ready, no external assets).
        int width = 640;
        int height = 120;

        BufferedImage img = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = img.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // Background
        g.setColor(new Color(10, 14, 22, 255));
        g.fillRect(0, 0, width, height);

        // State stripe
        Color stripe;
        switch (state) {
            case GREEN -> stripe = new Color(16, 185, 129);
            case YELLOW -> stripe = new Color(245, 158, 11);
            default -> stripe = new Color(239, 68, 68);
        }

        g.setColor(stripe);
        g.fillRoundRect(22, 22, 76, 76, 18, 18);

        // Icon check/caution/cross
        g.setColor(Color.BLACK);
        g.setFont(new Font("SansSerif", Font.BOLD, 48));
        String icon = switch (state) {
            case GREEN -> "✓";
            case YELLOW -> "!";
            case RED -> "×";
        };
        FontRenderContext frc = g.getFontRenderContext();
        int strW = (int) g.getFont().getStringBounds(icon, frc).getWidth();
        int strH = (int) g.getFont().getStringBounds(icon, frc).getHeight();
        g.drawString(icon, 22 + (76 - strW) / 2, 22 + (76 + strH / 2) / 2);

        // Title
        g.setColor(Color.WHITE);
        g.setFont(new Font("SansSerif", Font.BOLD, 28));
        String title = "Verified by ComplianceAI";
        g.drawString(title, 120, 54);

        // Website name
        g.setColor(new Color(203, 213, 225));
        g.setFont(new Font("SansSerif", Font.PLAIN, 18));
        String safeName = (websiteName == null || websiteName.isBlank()) ? "Website" : websiteName.trim();
        // Trim to keep it inside
        if (safeName.length() > 26) safeName = safeName.substring(0, 25) + "…";
        g.drawString(safeName, 120, 82);

        // Score pill
        g.setColor(new Color(255, 255, 255, 35));
        g.fillRoundRect(500, 26, 120, 70, 18, 18);
        g.setColor(Color.WHITE);
        g.setFont(new Font("SansSerif", Font.BOLD, 30));
        String scoreText = String.format("%d%%", Math.round(score));
        g.drawString(scoreText, 520, 68);
        g.setColor(new Color(226, 232, 240));
        g.setFont(new Font("SansSerif", Font.PLAIN, 14));
        g.drawString("Compliance", 520, 92);

        // Watermark for basic/free
        if (!premium) {
            g.setColor(new Color(255, 255, 255, 60));
            g.setFont(new Font("SansSerif", Font.BOLD, 20));
            String watermark = "BASIC • WATERMARK";
            g.translate(width / 2.0, height / 2.0);
            g.rotate(-Math.PI / 4);
            g.drawString(watermark, -g.getFontMetrics().stringWidth(watermark) / 2f, 0);
            g.rotate(Math.PI / 4);
            g.translate(-width / 2.0, -height / 2.0);
        }

        g.dispose();

        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(img, "png", baos);
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to render badge image", e);
        }
    }

    public BadgeState fromScore(double score) {
        if (score >= 90) return BadgeState.GREEN;
        if (score >= 75) return BadgeState.YELLOW;
        return BadgeState.RED;
    }
}

