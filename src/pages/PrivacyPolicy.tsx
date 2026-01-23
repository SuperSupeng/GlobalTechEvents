import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#030303] text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>

        {/* Content */}
        <article className="prose prose-invert prose-lg max-w-none">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-white/50 mb-8">Last updated: January 23, 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="text-white/70 leading-relaxed">
              GlobalTechEvents ("we", "our", or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, and safeguard your information 
              when you use our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Data We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-3 text-primary">1. Anonymous Usage Data</h3>
            <p className="text-white/70 leading-relaxed mb-4">
              We use Plausible Analytics, a privacy-friendly analytics service that does not use cookies 
              or collect personal data. We collect:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
              <li>Page views and navigation patterns</li>
              <li>Referral sources (where you came from)</li>
              <li>Browser type and device information</li>
              <li>Geographic location (country level only)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-primary">2. Local Storage</h3>
            <p className="text-white/70 leading-relaxed mb-4">
              We store the following data locally in your browser:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
              <li>Bookmarked events (stored on your device only)</li>
              <li>User preferences (theme, filters, view mode)</li>
              <li>Search history (optional, stored locally)</li>
            </ul>
            <p className="text-white/60 italic">
              This data never leaves your device and is not sent to our servers.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-primary">3. No Personal Data</h3>
            <p className="text-white/70 leading-relaxed">
              We do <strong>NOT</strong> collect:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>Names or email addresses (unless you voluntarily provide them)</li>
              <li>IP addresses</li>
              <li>Login credentials (we don't have user accounts)</li>
              <li>Payment information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">How We Use Your Data</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              The anonymous usage data we collect is used solely to:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>Improve our website's performance and user experience</li>
              <li>Understand which features are most popular</li>
              <li>Identify and fix technical issues</li>
              <li>Plan new features based on usage patterns</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We use the following third-party services:
            </p>
            
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Supabase</h4>
                <p className="text-white/60 text-sm">Database hosting for event data</p>
                <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">
                  View Privacy Policy →
                </a>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Vercel</h4>
                <p className="text-white/60 text-sm">Website hosting and CDN</p>
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">
                  View Privacy Policy →
                </a>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Plausible Analytics</h4>
                <p className="text-white/60 text-sm">Privacy-friendly analytics (no cookies, GDPR compliant)</p>
                <a href="https://plausible.io/privacy" target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">
                  View Privacy Policy →
                </a>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li><strong>Access:</strong> Request what data we have about you (though we collect minimal data)</li>
              <li><strong>Delete:</strong> Clear your local storage data anytime via browser settings</li>
              <li><strong>Opt-out:</strong> Block analytics by using browser extensions or privacy tools</li>
              <li><strong>Data Portability:</strong> Export your bookmarks from your browser</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Cookies</h2>
            <p className="text-white/70 leading-relaxed">
              GlobalTechEvents does <strong>NOT</strong> use cookies for tracking or advertising. 
              We use browser local storage for your preferences, which you can clear at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
            <p className="text-white/70 leading-relaxed">
              Our service is not directed to children under 13. We do not knowingly collect 
              information from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
            <p className="text-white/70 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any 
              changes by updating the "Last updated" date at the top of this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              If you have questions about this Privacy Policy, please contact us:
            </p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-white/70">📧 Email: <a href="mailto:privacy@globaltechevents.com" className="text-primary hover:underline">privacy@globaltechevents.com</a></p>
              <p className="text-white/70 mt-2">💬 Discord: <a href="https://discord.gg/Cj7s7nt7" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Join our community</a></p>
            </div>
          </section>

          <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 mt-12">
            <p className="text-primary font-semibold mb-2">🔒 Your Privacy Matters</p>
            <p className="text-white/70 text-sm">
              We believe in transparency and user privacy. Unlike many websites, we don't track you, 
              sell your data, or show personalized ads. GlobalTechEvents is and will always be privacy-first.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
