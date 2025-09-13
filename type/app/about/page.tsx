export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-100 via-bg-200 to-surface p-6 md:p-12 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-amber-100/90 backdrop-blur-md rounded-3xl shadow-lg p-8 md:p-12 border border-amber-300">
        
        {/* Header */}
        <h1 className="text-4xl font-bold text-coffee-800 mb-6 text-center">
          About Typing Master
        </h1>
        <p className="text-lg text-coffee-700 leading-relaxed mb-12 text-center max-w-2xl mx-auto">
          Typing Master is your modern companion to become faster, more accurate, 
          and more confident at the keyboard. We designed this platform for students, 
          professionals, and keyboard enthusiasts who want to sharpen their typing skills 
          in a fun and meaningful way.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Why We Built This */}
          <div className="bg-gradient-to-tr from-amber-200 via-amber-300 to-amber-400 text-coffee-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold mb-3">Why We Built This</h2>
            <p className="leading-relaxed">
              Typing should be smooth and effortless. We created Typing Master to 
              help you track your growth, celebrate progress, and enjoy the journey.
            </p>
          </div>

          {/* Our Mission */}
          <div className="bg-gradient-to-tr from-amber-200 via-amber-300 to-amber-400 text-coffee-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
            <p className="leading-relaxed">
              Empower people to type with speed and accuracy while enjoying 
              a beautiful, distraction-free environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
