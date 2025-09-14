export default function TOSModal() {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-xl shadow-xl">
        <h2 className="text-xl font-bold mb-4">Test Modal</h2>
        <p className="mb-4">This modal is forced to show no matter what.</p>
        <button
          onClick={() => alert("Consent clicked")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          I Consent
        </button>
        <button
          onClick={() => alert("Deny clicked")}
          className="bg-red-600 text-white px-4 py-2 rounded-lg ml-2"
        >
          Deny
        </button>
      </div>
    </div>
  );
}
