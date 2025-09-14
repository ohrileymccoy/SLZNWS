import { useState, useEffect } from "react";

export default function TOSModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check localStorage on mount
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
    // Redirect to Google if declined
    window.location.href = "https://www.google.com";
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-neutral-900 text-white rounded-xl p-8 max-w-md text-center shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">Terms of Service</h2>
        <p className="mb-6 text-sm text-neutral-300">
          By continuing, you confirm you are 18+ and consent to viewing explicit
          content. If you do not agree, you will be redirected.
        </p>
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
