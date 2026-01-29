import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { WHATSAPP_GROUP_URL } from '../config/constants';

interface TermsOfServiceProps {
  onBack: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-white/50 mb-8">Last updated: January 23, 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-white/70 leading-relaxed">
              By accessing and using GlobalTechEvents ("the Service"), you accept and agree to be 
              bound by these Terms of Service. If you do not agree to these terms, please do not 
              use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              GlobalTechEvents is a free platform that aggregates and displays information about 
              technology events, conferences, hackathons, and meetups worldwide. The Service includes:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>Event calendar and listings</li>
              <li>Search and filtering tools</li>
              <li>Bookmarking functionality</li>
              <li>Community features (WhatsApp)</li>
              <li>API access (subject to rate limits)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Use of Service</h2>
            
            <h3 className="text-xl font-semibold mb-3 text-primary">3.1 Permitted Use</h3>
            <p className="text-white/70 leading-relaxed mb-4">You may use the Service to:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
              <li>Discover and explore technology events</li>
              <li>Bookmark and track events of interest</li>
              <li>Share events with others</li>
              <li>Access our API for non-commercial purposes</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-primary">3.2 Prohibited Use</h3>
            <p className="text-white/70 leading-relaxed mb-4">You may NOT:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>Scrape or harvest data using automated tools (except via our official API)</li>
              <li>Resell or redistribute our data commercially without permission</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Impersonate others or misrepresent your affiliation</li>
              <li>Use the Service for illegal purposes</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Overload our servers or abuse API rate limits</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Data Accuracy and Disclaimer</h2>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 mb-4">
              <p className="text-amber-200 font-semibold mb-2">⚠️ Important Disclaimer</p>
              <p className="text-white/70">
                While we strive to provide accurate and up-to-date information, GlobalTechEvents 
                aggregates data from multiple sources and cannot guarantee the accuracy, completeness, 
                or timeliness of event information.
              </p>
            </div>
            <p className="text-white/70 leading-relaxed mb-4">
              <strong>You must always verify event details on the official event website before attending.</strong>
            </p>
            <p className="text-white/70 leading-relaxed">
              We are not responsible for:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>Event cancellations or changes</li>
              <li>Inaccurate event information</li>
              <li>Issues with event registration or ticketing</li>
              <li>Your experience at any event</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. User Content</h2>
            
            <h3 className="text-xl font-semibold mb-3 text-primary">5.1 Submission of Events</h3>
            <p className="text-white/70 leading-relaxed mb-4">
              If you submit event information to GlobalTechEvents, you:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
              <li>Grant us a non-exclusive, worldwide, royalty-free license to display and distribute the information</li>
              <li>Confirm that you have the right to share this information</li>
              <li>Acknowledge that submitted content may be moderated or edited</li>
              <li>Understand that we may remove content at our discretion</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-primary">5.2 Community Guidelines</h3>
            <p className="text-white/70 leading-relaxed mb-4">
              When participating in our community (WhatsApp, comments, etc.), you must:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>Be respectful and professional</li>
              <li>Not post spam or promotional content</li>
              <li>Not share false or misleading information</li>
              <li>Respect others' privacy</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Intellectual Property</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              All content on GlobalTechEvents (excluding user-submitted content and third-party data) 
              is owned by us and protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-white/70 leading-relaxed">
              Our logo, branding, and design are trademarks of GlobalTechEvents. You may not use them 
              without our written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. API Usage</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              If you use our API:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>You must respect rate limits (currently 100 requests/hour)</li>
              <li>Attribution is required (link back to GlobalTechEvents)</li>
              <li>Commercial use requires prior written permission</li>
              <li>We reserve the right to revoke API access at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              GlobalTechEvents is provided "AS IS" without warranties of any kind. To the maximum 
              extent permitted by law, we disclaim all warranties, express or implied.
            </p>
            <p className="text-white/70 leading-relaxed mb-4">
              <strong>We are NOT liable for:</strong>
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or goodwill</li>
              <li>Service interruptions or errors</li>
              <li>Actions of third-party event organizers</li>
              <li>Any damages arising from your use of the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Indemnification</h2>
            <p className="text-white/70 leading-relaxed">
              You agree to indemnify and hold harmless GlobalTechEvents from any claims, losses, 
              or damages arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Changes to Terms</h2>
            <p className="text-white/70 leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be effective 
              immediately upon posting. Your continued use of the Service constitutes acceptance 
              of the updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">11. Termination</h2>
            <p className="text-white/70 leading-relaxed">
              We may terminate or suspend your access to the Service at any time, without notice, 
              for any reason, including violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">12. Governing Law</h2>
            <p className="text-white/70 leading-relaxed">
              These Terms are governed by the laws of [Your Jurisdiction]. Any disputes shall be 
              resolved in the courts of [Your Jurisdiction].
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">13. Contact</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Questions about these Terms? Contact us:
            </p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-white/70">📧 Email: <a href="mailto:legal@globaltechevents.com" className="text-primary hover:underline">legal@globaltechevents.com</a></p>
              <p className="text-white/70 mt-2">💬 WhatsApp: <a href={WHATSAPP_GROUP_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Join our community</a></p>
            </div>
          </section>

          <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 mt-12">
            <p className="text-primary font-semibold mb-2">📜 Thank You</p>
            <p className="text-white/70 text-sm">
              Thank you for using GlobalTechEvents responsibly. Together, we're building the world's 
              best platform for discovering tech events.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};

export default TermsOfService;
