'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      // Show after a small delay
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  const handlePreferences = () => {
    setShowPreferences(!showPreferences);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#1A1A2E] border border-border-medium rounded-2xl shadow-2xl p-6 md:p-8">
            {!showPreferences ? (
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Cookie className="w-6 h-6 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-status-success" />
                    <span className="text-caption font-bold text-status-success uppercase tracking-[0.05em]">
                      GDPR Compliant
                    </span>
                  </div>
                  <h3 className="text-h4 font-semibold text-white mb-2">
                    We use cookies to enhance your experience
                  </h3>
                  <p className="text-body-sm text-text-secondary leading-relaxed">
                    By continuing to visit this site you agree to our use of cookies. 
                    <a href="/privacy" className="text-primary hover:underline ml-1">Learn more</a>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <Button
                    variant="outline"
                    size="default"
                    onClick={handlePreferences}
                    className="border-border-medium text-text-secondary hover:bg-background-secondary hover:text-text-primary"
                  >
                    Preferences
                  </Button>
                  <Button
                    variant="default"
                    size="default"
                    onClick={handleAccept}
                    className="bg-primary hover:bg-primary-hover text-white"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Cookie className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-h4 font-semibold text-white">Cookie Preferences</h3>
                      <p className="text-body-sm text-text-secondary">Manage your cookie preferences</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="text-text-tertiary hover:text-text-secondary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { name: 'Essential Cookies', desc: 'Required for the site to function', required: true },
                    { name: 'Analytics Cookies', desc: 'Help us improve our website', required: false },
                    { name: 'Marketing Cookies', desc: 'Used for advertising purposes', required: false },
                  ].map((cookie, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-background-secondary rounded-xl">
                      <div>
                        <h4 className="text-body-sm font-semibold text-text-primary">{cookie.name}</h4>
                        <p className="text-caption text-text-tertiary">{cookie.desc}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {cookie.required ? (
                          <span className="text-caption font-semibold text-primary">Required</span>
                        ) : (
                          <button className="w-12 h-6 bg-primary rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border-medium">
                  <Button
                    variant="outline"
                    size="default"
                    onClick={handleDecline}
                    className="border-border-medium text-text-secondary hover:bg-background-secondary"
                  >
                    Decline All
                  </Button>
                  <Button
                    variant="default"
                    size="default"
                    onClick={handleAccept}
                    className="bg-primary hover:bg-primary-hover text-white"
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsent;
