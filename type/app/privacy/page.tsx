export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-100 via-bg-200 to-surface p-6 md:p-12 flex items-center justify-center">
      <div className="max-w-5xl w-full bg-amber-100/90 backdrop-blur-md rounded-3xl shadow-lg p-8 md:p-12 border border-amber-300">
        
        {/* Header */}
        <h1 className="text-4xl font-bold text-coffee-800 mb-6 text-center">
          Privacy Policy
        </h1>
        <p className="text-coffee-700 leading-relaxed mb-12 text-center max-w-2xl mx-auto">
          Your privacy matters to us. At <strong>Typing Master</strong>, we want you
          to feel safe and secure while practicing your skills.
        </p>

        {/* Sections in Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="bg-white/80 border border-amber-300 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-coffee-800 mb-3">Data We Collect</h2>
            <p className="text-brown-700 leading-relaxed text-sm">
              We only store your typing test results (WPM, accuracy, and time) so 
              you can track your progress. No personal information is required.
            </p>
          </section>

          <section className="bg-white/80 border border-amber-300 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-coffee-800 mb-3">How We Use Data</h2>
            <p className="text-brown-700 leading-relaxed text-sm">
              Your results are used only to generate statistics and charts 
              for your account. We never sell or share your data.
            </p>
          </section>

          <section className="bg-white/80 border border-amber-300 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-coffee-800 mb-3">Your Control</h2>
            <p className="text-brown-700 leading-relaxed text-sm">
              You can delete your test history at any time. Your privacy, 
              your control — always.
            </p>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-10 text-center text-brown-600 text-sm italic">
          Last updated: September 2025
        </div>
      </div>
    </div>
  );
}
