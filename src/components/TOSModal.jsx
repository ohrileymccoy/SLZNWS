import { useState, useEffect } from "react";

export default function TOSModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("tosAccepted");
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const handleConsent = () => {
    localStorage.setItem("tosAccepted", "true");
    setVisible(false);
  };

  const handleDeny = () => {
    window.location.href = "https://www.google.com";
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-neutral-900 text-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">Terms of Service</h2>

        {/* Scrollable TOS content */}
        <div className="flex-1 overflow-y-auto pr-2 mb-6 text-sm text-neutral-300 space-y-6 text-left">
          <div>
            <h3 className="text-lg font-semibold text-white">
              LEGAL AGREEMENT: TERMS OF USE
            </h3>
            <p className="italic text-neutral-400">Last updated: September 24, 2025</p>
            <p>
              PLEASE READ CAREFULLY. BY ACCESSING THIS WEBSITE, YOU ARE
              ENTERING INTO A BINDING LEGAL AGREEMENT.
            </p>
            <p>
              These Terms of Use (“Terms”) govern your access to and use of Sleazy Media LLC (“we,” “us,” or “our”). By accessing or using our website, you acknowledge that you have read, understood, and agree to be bound by these Terms.
            </p>
          </div>

          <Section number="1" title="JURISDICTION AND GOVERNING LAW">
            <ul className="list-disc list-inside space-y-1">
              <li>You are accessing a private server physically located in the State of West Virginia, United States.</li>
              <li>All interactions are subject exclusively to West Virginia and applicable U.S. Federal law.</li>
              <li>Any legal action must be instituted exclusively in West Virginia courts.</li>
              <li>You waive objections to jurisdiction and venue in such courts.</li>
            </ul>
          </Section>

          <Section number="2" title="NO FEES FOR REMOVAL OR ALTERATION">
            <p>
              Sleazy Media LLC does not charge any fees for removal, alteration, or modification of any content. Requests are evaluated
              under our internal policies and applicable law.
            </p>
          </Section>

          <Section number="3" title="NO ADVERTISING, DATA SELLING, OR MONETIZATION">
            <ul className="list-disc list-inside space-y-1">
              <li>No selling, renting, or transferring user data</li>
              <li>No affiliate marketing or sponsored content</li>
              <li>No subscriptions, premium tiers, or paid features</li>
              <li>No targeted ads or ad networks</li>
              <li>No lead generation or preferential treatment sales</li>
            </ul>
            <p>This site is not monetized in any way.</p>
          </Section>

          <Section number="4" title="PUBLIC RECORDS">
            <p>All information provided is derived from public records or other publicly available sources. We make no guarantees or warranties regarding accuracy, completeness, or timeliness.</p>
          </Section>

          <Section number="5" title="DISCLAIMER OF WARRANTIES">
            <p>Your use is at your sole risk. Content is provided on an “AS IS” and “AS AVAILABLE” basis without warranties of any kind.</p>
          </Section>

          <Section number="6" title="LIMITATION OF LIABILITY">
            <p>In no event shall Sleazy Media LLC or its affiliates be liable for any indirect, incidental, consequential, or exemplary damages.</p>
          </Section>

          <Section number="7" title="FIRST AMENDMENT PROTECTIONS">
            <p>Content published is protected speech under the First Amendment. We reserve the right to publish, decline, or remove content consistent with these rights.</p>
          </Section>

          <Section number="8" title="JURISDICTIONAL RESTRICTIONS">
            <p>We make no representation that the site is appropriate outside the U.S. Accessing from prohibited jurisdictions is strictly forbidden.</p>
          </Section>

          <Section number="9" title="AGE RESTRICTION">
            <p>You must be at least 18 years old to access this website.</p>
          </Section>

          <Section number="10" title="INTELLECTUAL PROPERTY">
            <p>All content and trademarks are the property of Sleazy Media LLC or its licensors. Unauthorized use is strictly prohibited.</p>
          </Section>

          <Section number="11" title="ACCOUNT ACCESS & DEVICE SHARING">
            <p>You are responsible for maintaining account confidentiality. Sharing access with unauthorized users is prohibited.</p>
          </Section>

          <Section number="12" title="CONSTITUTIONAL PROTECTIONS">
            <p>We assert protections under the U.S. Constitution, including but not limited to the First Amendment and Dormant Commerce Clause.</p>
          </Section>

          <Section number="13" title="COMMUNICATIONS DECENCY ACT">
            <p>Pursuant to Section 230 of the Communications Decency Act, Sleazy Media LLC is not responsible for content posted by third parties.</p>
          </Section>

          <Section number="14" title="PUBLIC FIGURE DOCTRINE">
            <p>Content related to public figures is afforded additional protections under U.S. law, including heightened standards for defamation.</p>
          </Section>

          <Section number="15" title="DORMANT COMMERCE CLAUSE">
            <p>We reserve the right to operate services across state lines consistent with the Dormant Commerce Clause.</p>
          </Section>

          <Section number="16" title="NOT A CONSUMER REPORTING AGENCY">
            <p>We are not a consumer reporting agency under the FCRA. Content is not intended for credit, employment, housing, or other regulated uses.</p>
          </Section>

          <Section number="17" title="USER CONDUCT">
            <p>You agree not to misuse the site, including hacking, harassment, or illegal activities.</p>
          </Section>

          <Section number="18" title="INDEMNIFICATION">
            <p>You agree to indemnify and hold harmless Sleazy Media LLC and affiliates against claims arising out of your use of the site.</p>
          </Section>

          <Section number="19" title="NO LEGAL ADVICE">
            <p>Content is informational only and does not constitute legal advice. Consult an attorney for legal concerns.</p>
          </Section>

          <Section number="20" title="DISPUTE RESOLUTION & ARBITRATION">
            <p>Disputes shall be resolved first through negotiation, then binding arbitration in West Virginia under AAA rules.</p>
          </Section>

          <Section number="21" title="DMCA POLICY">
            <p>If you believe your copyrighted material has been misused, submit a DMCA notice. We will respond under applicable law.</p>
          </Section>

          <Section number="22" title="ERRORS & OMISSIONS">
            <p>We do not warrant that the website will be free from errors. We reserve the right to correct inaccuracies without notice.</p>
          </Section>

          <Section number="23" title="CHANGES">
            <p>We reserve the right to update or revise these Terms at any time. Continued use constitutes acceptance of changes.</p>
          </Section>

          <Section number="24" title="RESERVATION OF RIGHTS">
            <p>All rights not expressly granted are reserved.</p>
          </Section>

          <Section number="25" title="SEVERABILITY & ENTIRE AGREEMENT">
            <p>If any provision is invalid, the remainder remains in effect. These Terms constitute the entire agreement between you and Sleazy Media LLC.</p>
          </Section>

          <Section number="26" title="ACCEPTANCE OF TERMS">
            <p>By using this website, you affirm that you have read, understood, and agreed to be bound by these Terms of Use.</p>
          </Section>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleConsent}
            className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500"
          >
            I Consent
          </button>
          <button
            onClick={handleDeny}
            className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500"
          >
            Deny
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ number, title, children }) {
  return (
    <div>
      <h4 className="font-semibold text-white mb-1">
        {number}. {title}
      </h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
