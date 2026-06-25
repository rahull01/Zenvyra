package com.zenvyra.service;

import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.font.FontRenderContext;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;

@Service
public class BadgeImageService {

    public enum BadgeState {
        GREEN, YELLOW, RED
    }

    public byte[] renderBadgePng(String websiteName, double score, BadgeState state, boolean premium) {
        int width = 640;
        int height = 120;

        BufferedImage img = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = img.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

        g.setColor(new Color(10, 14, 22, 255));
        g.fillRect(0, 0, width, height);

        Color stripe = switch (state) {
            case GREEN -> new Color(16, 185, 129);
            case YELLOW -> new Color(245, 158, 11);
            case RED -> new Color(239, 68, 68);
        };

        g.setColor(stripe);
        g.fillRoundRect(22, 22, 76, 76, 18, 18);

        g.setColor(Color.BLACK);
        g.setFont(new Font("SansSerif", Font.BOLD, state == BadgeState.GREEN ? 26 : 48));
        String icon = switch (state) {
            case GREEN -> "OK";
            case YELLOW -> "!";
            case RED -> "X";
        };
        FontRenderContext frc = g.getFontRenderContext();
        int iconWidth = (int) g.getFont().getStringBounds(icon, frc).getWidth();
        int iconHeight = (int) g.getFont().getStringBounds(icon, frc).getHeight();
        g.drawString(icon, 22 + (76 - iconWidth) / 2, 22 + (76 + iconHeight / 2) / 2);

        g.setColor(Color.WHITE);
        g.setFont(new Font("SansSerif", Font.BOLD, 28));
        g.drawString("Verified by Zenvyra", 120, 54);

        g.setColor(new Color(203, 213, 225));
        g.setFont(new Font("SansSerif", Font.PLAIN, 18));
        String safeName = trimForBadge(websiteName);
        g.drawString(safeName, 120, 82);

        g.setColor(new Color(255, 255, 255, 35));
        g.fillRoundRect(500, 26, 120, 70, 18, 18);
        g.setColor(Color.WHITE);
        g.setFont(new Font("SansSerif", Font.BOLD, 30));
        String scoreText = String.format("%d%%", Math.round(score));
        g.drawString(scoreText, 520, 68);
        g.setColor(new Color(226, 232, 240));
        g.setFont(new Font("SansSerif", Font.PLAIN, 14));
        g.drawString("Compliance", 520, 92);

        if (!premium) {
            g.setColor(new Color(255, 255, 255, 60));
            g.setFont(new Font("SansSerif", Font.BOLD, 20));
            String watermark = "BASIC - WATERMARK";
            FontMetrics metrics = g.getFontMetrics();
            g.translate(width / 2.0, height / 2.0);
            g.rotate(-Math.PI / 4);
            g.drawString(watermark, -metrics.stringWidth(watermark) / 2f, 0);
            g.rotate(Math.PI / 4);
            g.translate(-width / 2.0, -height / 2.0);
        }

        g.dispose();

        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(img, "png", baos);
            return baos.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("Failed to render badge image", e);
        }
    }

    public BadgeState fromScore(double score) {
        if (score >= 90) return BadgeState.GREEN;
        if (score >= 75) return BadgeState.YELLOW;
        return BadgeState.RED;
    }

    private String trimForBadge(String websiteName) {
        String safeName = (websiteName == null || websiteName.isBlank()) ? "Website" : websiteName.trim();
        if (safeName.length() > 28) {
            return safeName.substring(0, 25) + "...";
        }
        return safeName;
    }
}
