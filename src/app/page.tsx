import Quiz from "@/components/Quiz";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center relative overflow-hidden">
      {/* Ambient Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-gradient-to-br from-[#f4f6f9] to-[#eef0f5] pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[80px] animate-[floatBlob_15s_infinite_alternate_ease-in-out]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-secondary/10 rounded-full blur-[80px] animate-[floatBlob_15s_infinite_alternate_ease-in-out_-5s]" />
      </div>

      {/* Header */}
      <header className="w-full bg-secondary/95 backdrop-blur-md py-4 text-center sticky top-0 z-50 border-b border-white/10 shadow-sm">
        <img
          src="https://kanakademi.com.tr/wp-content/uploads/2024/08/kanakademi-logo.png"
          alt="Kan Akademi Logo"
          className="h-10 mx-auto transition-transform hover:scale-105"
        />
      </header>

      {/* Main Quiz Area */}
      <div className="flex-1 flex w-full p-4 relative z-10">
        <Quiz />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatBlob {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(5%, 10%) scale(1.1); }
          100% { transform: translate(-5%, -5%) scale(0.9); }
        }
      `}} />
    </main>
  );
}
