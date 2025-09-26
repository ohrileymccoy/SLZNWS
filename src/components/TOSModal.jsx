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

        {/* Scrollable box-within-a-box */}
        <div className="flex-1 overflow-y-auto pr-2 mb-6 text-sm text-neutral-300 space-y-4">
          {/* Replace with your real TOS content */}
          <p>
            LEGAL AGREEMENT: TERMS OF USE
Last updated: September 24, 2025

PLEASE READ CAREFULLY. BY ACCESSING THIS WEBSITE, YOU ARE ENTERING INTO A BINDING LEGAL AGREEMENT.

These Terms of Use (“Terms”) govern your access to and use of Sleazy Media LLC (“we,” “us,” or “our”). By accessing or using our website, you acknowledge that you have read, understood, and agree to be bound by these Terms.

1. JURISDICTION AND GOVERNING LAW
You hereby acknowledge and agree that:

You are accessing a private server physically located in the State of West Virginia, United States.

Any and all interactions with Sleazy Media LLC are subject exclusively to the laws of the State of West Virginia and applicable Federal laws of the United States.

Any legal action or proceeding arising out of or relating to these Terms shall be instituted exclusively in the courts of the State of West Virginia.

You waive any objection to the exercise of jurisdiction over you by such courts and to venue in such courts.

2. NO FEES FOR REMOVAL OR ALTERATION
Sleazy Media LLC does not charge any fees for removal, alteration, or modification of any content displayed on this website. Any request for removal or modification will be evaluated according to our internal policies and applicable laws of the State of West Virginia and applicable Federal laws of the United States.

3. NO ADVERTISING, DATA SELLING, OR MONETIZATION
Sleazy Media LLC does not sell advertising space on its platform. Additionally, Sleazy Media LLC does not engage in any of the following revenue-generating practices:

We do not sell, trade, rent, or otherwise transfer user data to third parties for marketing, advertising, or other commercial purposes;

We do not monetize through affiliate marketing or sponsored content;

We do not offer premium features, subscriptions, or paid tiers;

We do not collect or sell aggregated user statistics or analytics;

We do not accept payment for preferential treatment, enhanced listings, or priority placement of information;

We do not utilize targeted advertising technologies or ad networks;

We do not generate revenue through lead generation activities.

Sleazy Media LLC is not currently monetized in any way and operates solely as an information and media service.

4. PUBLIC RECORDS
All information provided on Sleazy Media LLC platforms is derived from public records or other publicly available sources. We make no guarantees or warranties regarding the accuracy, completeness, or timeliness of the information displayed.

5. DISCLAIMER OF WARRANTIES
Your use of this website is at your sole risk. The website and all content are provided on an “AS IS” and “AS AVAILABLE” basis without warranties of any kind, either express or implied. Sleazy Media LLC disclaims all warranties, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.

6. LIMITATION OF LIABILITY
In no event shall Sleazy Media LLC, its officers, directors, employees, affiliates, or agents be liable for any indirect, incidental, consequential, special, or exemplary damages arising from or relating to your use of the website, even if advised of the possibility of such damages.

7. FIRST AMENDMENT PROTECTIONS
This website operates under the principles of the First Amendment to the United States Constitution. Content published by Sleazy Media LLC is protected speech. We reserve the right to publish, decline to publish, or remove any content consistent with these rights and applicable law.

8. JURISDICTIONAL RESTRICTIONS
This website is controlled and operated from within the United States. We make no representation that the website or its content is appropriate or available for use in other jurisdictions. Accessing the website from locations where its content is illegal is strictly prohibited.

9. AGE RESTRICTION
You must be at least 18 years old to access or use this website. By accessing this website, you represent and warrant that you meet this age requirement.

10. INTELLECTUAL PROPERTY
All content, trademarks, service marks, and other intellectual property on this website are the exclusive property of Sleazy Media LLC or its licensors. Unauthorized use, reproduction, or distribution is strictly prohibited.

11. ACCOUNT ACCESS & DEVICE SHARING
If account features are provided, you are responsible for maintaining the confidentiality of your account credentials. You agree not to share access with unauthorized users and acknowledge that Sleazy Media LLC is not liable for unauthorized access resulting from your actions.

12. CONSTITUTIONAL PROTECTIONS
Sleazy Media LLC asserts protections under the Constitution of the United States, including but not limited to the First Amendment and Dormant Commerce Clause, for the operation of its website and the dissemination of information.

13. COMMUNICATIONS DECENCY ACT
Pursuant to Section 230 of the Communications Decency Act (47 U.S.C. § 230), Sleazy Media LLC is not responsible for content posted by third parties.

14. PUBLIC FIGURE DOCTRINE
Content related to public figures is afforded additional protections under U.S. law, including heightened standards for defamation and public interest reporting.

15. DORMANT COMMERCE CLAUSE
Sleazy Media LLC reserves the right to operate its services across state lines consistent with the Dormant Commerce Clause of the United States Constitution.

16. NOT A CONSUMER REPORTING AGENCY
Sleazy Media LLC is not a consumer reporting agency as defined by the Fair Credit Reporting Act (FCRA). Information displayed on this website is not intended for purposes of credit, employment, housing, or other FCRA-regulated uses.

17. USER CONDUCT
You agree not to misuse the website, including but not limited to engaging in illegal activities, attempting to hack or disrupt services, or harassing other users.

18. INDEMNIFICATION
You agree to indemnify, defend, and hold harmless Sleazy Media LLC, its affiliates, and their officers, directors, employees, and agents from any claims, liabilities, damages, or expenses arising out of your use of the website or violation of these Terms.

19. NO LEGAL ADVICE
The content on this website is for informational purposes only and does not constitute legal advice. Users should consult with an attorney for specific legal concerns.

20. DISPUTE RESOLUTION & ARBITRATION
Any dispute arising under or relating to these Terms shall first be attempted to be resolved through good faith negotiations. If unresolved, disputes shall be settled by binding arbitration in West Virginia under the rules of the American Arbitration Association.

21. DMCA POLICY
If you believe your copyrighted material has been used on this website without authorization, you may submit a notice pursuant to the Digital Millennium Copyright Act (DMCA). Sleazy Media LLC will respond in accordance with applicable law.

22. ERRORS & OMISSIONS
We do not warrant that the website will be free from errors, inaccuracies, or omissions. We reserve the right to correct any errors without prior notice.

23. CHANGES
We reserve the right to update, modify, or revise these Terms at any time. Continued use of the website following such changes constitutes acceptance of the revised Terms.

24. RESERVATION OF RIGHTS
Sleazy Media LLC reserves all rights not expressly granted in these Terms.

25. SEVERABILITY & ENTIRE AGREEMENT
If any provision of these Terms is held invalid, the remaining provisions shall remain in full force and effect. These Terms constitute the entire agreement between you and Sleazy Media LLC regarding use of the website.

26. ACCEPTANCE OF TERMS
By accessing or using this website, you affirm that you have read, understood, and agreed to be bound by these Terms of Use.
          </p>
        </div>

        {/* Action buttons stay fixed at bottom */}
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
