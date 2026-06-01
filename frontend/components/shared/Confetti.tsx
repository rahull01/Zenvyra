"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiProps {
    trigger: boolean;
    duration?: number;
}

export default function Confetti({ trigger, duration = 3000 }: ConfettiProps) {
    const [particles, setParticles] = useState<Array<{
        id: number;
        x: number;
        color: string;
        size: number;
        rotation: number;
    }>>([]);

    useEffect(() => {
        const colors = ["var(--info)", "var(--success)", "var(--accent)", "var(--danger)", "var(--info-light)", "var(--accent-light)"];
        if (trigger) {
            const newParticles = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360,
            }));
            setParticles(newParticles);

            const timer = setTimeout(() => setParticles([]), duration);
            return () => clearTimeout(timer);
        }
    }, [trigger, duration]);

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            <AnimatePresence>
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        initial={{
                            x: `${particle.x}vw`,
                            y: -20,
                            opacity: 1,
                            rotate: 0,
                        }}
                        animate={{
                            y: "110vh",
                            rotate: particle.rotation,
                            opacity: 0,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: Math.random() * 2 + 2,
                            ease: "linear",
                        }}
                        style={{
                            position: "absolute",
                            width: particle.size,
                            height: particle.size,
                            backgroundColor: particle.color,
                            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}