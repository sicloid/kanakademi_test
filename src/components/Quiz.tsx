"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import { Download, RefreshCw, ChevronRight, Droplet, User, HeartPulse } from "lucide-react";

const quizData = [
  {
    question: "Kan bağışı merkezine gitmek:",
    options: [
      { text: "A) Ezbere giderim", points: 3 },
      { text: "B) Konumu hep kayıtlıdır, gerektiğinde bakarım", points: 2 },
      { text: "C) Gitmeden önce mutlaka kontrol ederim", points: 1 },
    ],
  },
  {
    question: "Kan bağışı günü yaklaşınca:",
    options: [
      { text: "A) Gün sayarım 😄", points: 3 },
      { text: "B) Hatırlatıcı kurarım", points: 2 },
      { text: "C) Genelde unuturum", points: 1 },
    ],
  },
  {
    question: "Kan bağışı sonrası:",
    options: [
      { text: "A) Bir sonraki bağışı planlarım", points: 3 },
      { text: "B) “Yine yaparım” derim ama tarih net değil", points: 2 },
      { text: "C) “Bir süre ara vereyim” derim", points: 1 },
    ],
  },
  {
    question: "Bağış öncesi küçük bir işim çıkarsa:",
    options: [
      { text: "A) Bağışı aksatmamak için dikkat ederim, gerekirse ertelerim", points: 3 },
      { text: "B) Duruma göre karar veririm", points: 2 },
      { text: "C) Genelde vazgeçerim", points: 1 },
    ],
  },
  {
    question: "Çevrende kan ihtiyacı olduğunda:",
    options: [
      { text: "A) Hemen organize olur, insanları harekete geçiririm", points: 3 },
      { text: "B) Yardım ederim ama genelde bireysel kalırım", points: 2 },
      { text: "C) Paylaşım yaparım, gerisini takip etmem", points: 1 },
    ],
  },
  {
    question: "Kan bağışı hakkında bilgin:",
    options: [
      { text: "A) Oldukça bilgiliyim, başkalarına da anlatırım", points: 3 },
      { text: "B) Temel şeyleri biliyorum", points: 2 },
      { text: "C) Çok detay bilmiyorum", points: 1 },
    ],
  },
  {
    question: "Kan bağışı çağrısı gördüğünde:",
    options: [
      { text: "A) Hemen aksiyon alırım", points: 3 },
      { text: "B) Uygunsam giderim", points: 2 },
      { text: "C) Genelde geçerim", points: 1 },
    ],
  },
  {
    question: "İlk kan bağışını düşünürsen:",
    options: [
      { text: "A) Heyecanlı ve gurur vericiydi", points: 3 },
      { text: "B) Biraz karışıktı ama iyiydi", points: 2 },
      { text: "C) Tedirgindim", points: 1 },
    ],
  },
  {
    question: "Kan bağışını hayatında nasıl görüyorsun:",
    options: [
      { text: "A) Bir sorumluluk", points: 3 },
      { text: "B) İyi bir alışkanlık", points: 2 },
      { text: "C) Arada yapılan bir şey", points: 1 },
    ],
  },
  {
    question: "Kan bağışı yaptıktan sonra:",
    options: [
      { text: "A) Başkalarını da teşvik ederim", points: 3 },
      { text: "B) Sorulursa anlatırım", points: 2 },
      { text: "C) Pek bahsetmem", points: 1 },
    ],
  },
];

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-", "Bilmiyorum"];

export default function Quiz() {
  const [step, setStep] = useState<"intro" | "registration" | "quiz" | "result">("intro");
  const [name, setName] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const startRegistration = () => setStep("registration");

  const startQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !bloodType) return;
    setStep("quiz");
  };

  const selectOption = (points: number) => {
    const newScore = totalScore + points;
    setTotalScore(newScore);

    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      finishQuiz(newScore);
    }
  };

  const finishQuiz = async (finalScore: number) => {
    setStep("result");
    const resultProfile = getProfile(finalScore);

    // Save to DB asynchronously
    try {
      await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          score: finalScore, 
          profile: resultProfile.title,
          name: name.trim() || "Anonim",
          bloodType: bloodType || "Bilinmiyor"
        }),
      });
    } catch (error) {
      console.error("Failed to save result:", error);
    }
  };

  const getProfile = (score: number) => {
    if (score >= 24) {
      return {
        title: "Bağış Önderi",
        desc: "Sen tam bir kan bağışı öncüsüsün! Sadece bağış yapmıyorsun, aynı zamanda çevreni de etkiliyorsun. Sistemli, bilinçli ve sürdürülebilir bir bağışçısın.",
        tip: "Senin gibi “Kan Bağışı” serimizde mutlaka hikayesiyle yer almalı!",
        emoji: "🦸‍♂️",
        color: "#FD3E04",
      };
    } else if (score >= 17) {
      return {
        title: "Bilinçli Destekçi",
        desc: "Kan bağışının önemini biliyorsun ve fırsat buldukça katkı sağlıyorsun. Biraz daha planlı olursan çok daha güçlü bir etki yaratabilirsin.",
        tip: "Hatırlatıcı kurmayı dene.",
        emoji: "🤝",
        color: "#ff9800",
      };
    } else {
      return {
        title: "Potansiyel Bağışçı",
        desc: "İçinde iyi bir bağışçı var ama henüz alışkanlık haline gelmemiş. Küçük bir adım seni çok farklı bir noktaya taşıyabilir.",
        tip: "İlk düzenli bağışını planla.",
        emoji: "🌱",
        color: "#4CAF50",
      };
    }
  };

  const downloadStoryImage = async () => {
    setIsExporting(true);
    const exportNode = document.getElementById("storyExport");
    if (!exportNode) {
      setIsExporting(false);
      return;
    }

    try {
      const canvas = await html2canvas(exportNode, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#f4f6f9", // Updated match to the new design
      });

      const link = document.createElement("a");
      link.download = "kanakademi_test_sonucu.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      alert("Görsel oluşturulurken bir hata oluştu.");
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const resultData = step === "result" ? getProfile(totalScore) : null;
  const currentQ = quizData[currentQuestion];
  const progress = ((currentQuestion) / quizData.length) * 100;

  return (
    <div className="w-full max-w-xl mx-auto flex-1 flex flex-col justify-center perspective-[1000px] z-10">
      <AnimatePresence mode="wait">
        {step === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl p-8 text-center shadow-[0_10px_40px_rgba(0,0,0,0.08)] relative overflow-hidden"
          >
            <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-[magicSweep_4s_infinite_linear]" />
            <h1 className="text-3xl font-black bg-gradient-to-br from-secondary to-primary bg-clip-text text-transparent mb-4">
              Nasıl Bir Kan Bağışçısısın?
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Gündelik alışkanlıkların ve kan bağışına olan yaklaşımın senin profilini belirliyor. Testi çöz, sonucunu Instagram&apos;da paylaş!
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={startRegistration}
              className="w-full bg-gradient-to-br from-primary to-[#ff6b3b] text-white py-4 rounded-full font-bold text-lg shadow-[0_8px_25px_var(--primary-glow)] relative overflow-hidden group flex items-center justify-center gap-2"
            >
              <div className="absolute inset-y-0 -left-[20%] w-[20%] bg-white/30 -skew-x-[20deg] group-hover:animate-[shine_1.5s_infinite]" />
              Teste Başla <ChevronRight />
            </motion.button>
          </motion.div>
        )}

        {step === "registration" && (
          <motion.div
            key="registration"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
          >
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-2">
                <HeartPulse size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-black text-secondary text-center mb-2">Seni Tanıyalım</h2>
            <p className="text-gray-500 text-center mb-8 text-sm">Test sonucunu sana özel hazırlayabilmemiz için bilgilerin gerekli.</p>
            
            <form onSubmit={startQuiz} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <User size={16} /> İsim Soyisim
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn: Ahmet Yılmaz"
                  className="w-full border-2 border-gray-100 rounded-xl p-4 bg-gray-50/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-gray-800 font-semibold"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Droplet size={16} /> Kan Grubu
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {bloodTypes.map((type) => (
                    <div
                      key={type}
                      onClick={() => setBloodType(type)}
                      className={`cursor-pointer p-3 rounded-xl border-2 text-center font-bold transition-all ${
                        bloodType === type
                          ? "border-primary bg-primary text-white shadow-md shadow-primary/30"
                          : "border-gray-100 bg-white text-gray-600 hover:border-primary/40"
                      }`}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                disabled={!name.trim() || !bloodType}
                className="w-full mt-4 bg-gradient-to-br from-secondary to-[#2a2d4f] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-full font-bold text-lg shadow-[0_8px_25px_rgba(19,22,47,0.2)] flex items-center justify-center gap-2"
              >
                Sorulara Geç <ChevronRight />
              </motion.button>
            </form>
          </motion.div>
        )}

        {step === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full"
          >
            <div className="w-full h-2 bg-secondary/10 rounded-full mb-8 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
              <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-bold rounded-full text-sm mb-6 border border-primary/20">
                Soru {currentQuestion + 1}/{quizData.length}
              </div>
              <h2 className="text-2xl font-black text-secondary mb-8 leading-tight">
                {currentQ.question}
              </h2>
              <div className="flex flex-col gap-4">
                <AnimatePresence mode="wait">
                  {currentQ.options.map((option, idx) => (
                    <motion.button
                      key={`${currentQuestion}-${idx}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.01, borderColor: "var(--primary)" }}
                      whileTap={{ scale: 0.97, backgroundColor: "rgba(253, 62, 4, 0.05)" }}
                      onClick={() => selectOption(option.points)}
                      className="text-left p-5 rounded-2xl border-2 border-transparent bg-white shadow-sm font-semibold text-gray-800 hover:shadow-md transition-all"
                    >
                      {option.text}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {step === "result" && resultData && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            className="w-full"
          >
            <div className="bg-gradient-to-br from-secondary to-secondary-light rounded-3xl p-8 text-center text-white shadow-2xl relative overflow-hidden mb-6 border border-white/10">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-7xl mb-4 drop-shadow-xl inline-block"
              >
                {resultData.emoji}
              </motion.div>
              <h2
                className="text-3xl font-black mb-4 drop-shadow-md"
                style={{ color: resultData.color }}
              >
                {resultData.title}
              </h2>
              <p className="text-white/85 text-lg leading-relaxed mb-6">
                {resultData.desc}
              </p>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border-l-4 border-primary text-left text-sm">
                <strong>💡 Öneri:</strong> {resultData.tip}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={downloadStoryImage}
                disabled={isExporting}
                className="w-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white py-4 rounded-full font-bold text-lg shadow-lg flex items-center justify-center gap-2"
              >
                {isExporting ? (
                  <RefreshCw className="animate-spin" />
                ) : (
                  <Download />
                )}
                Hikaye Olarak Paylaş
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.reload()}
                className="w-full bg-transparent border-2 border-secondary/20 text-secondary py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2"
              >
                <RefreshCw size={20} />
                Testi Tekrar Çöz
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern, Yeni Nesil Instagram Story Export Card (Off-screen) */}
      {step === "result" && resultData && (
        <div
          id="storyExport"
          className="absolute -top-[9999px] -left-[9999px] w-[1080px] h-[1920px] flex flex-col overflow-hidden bg-[#f4f6f9]"
          style={{ fontFamily: "'League Spartan', sans-serif" }}
        >
          {/* Siyah Header (Kan İlanı Asistanı konsepti) */}
          <div className="h-[220px] bg-[#1a1a1a] w-full flex items-center justify-between px-16 relative z-20 shadow-xl">
             <div className="text-white text-[3.8rem] font-bold tracking-wide flex items-center gap-4">
                Kan Akademi
             </div>
             <div className="w-[120px] h-[120px] bg-white rounded-full flex items-center justify-center shadow-lg">
                <img 
                  src="https://kanakademi.com.tr/wp-content/uploads/2024/08/kanakademi-logo.png" 
                  alt="Logo"
                  className="w-[85px] object-contain"
                  crossOrigin="anonymous" 
                />
             </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center p-16 relative">
            {/* Soft Ambient Background Blobs */}
            <div className="absolute top-20 right-[-100px] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-20 left-[-100px] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]" />

            <div className="bg-white rounded-[50px] shadow-[0_40px_100px_rgba(0,0,0,0.06)] w-[900px] overflow-hidden z-10 border border-gray-100 flex flex-col">
              
              {/* Card Header Pattern */}
              <div className="h-[20px] w-full bg-gradient-to-r from-secondary to-primary" />

              <div className="p-16 flex flex-col gap-12">
                
                {/* Profile Title */}
                <div className="flex flex-col gap-2 items-center text-center pb-8 border-b-2 border-gray-100">
                  <span className="text-[2.2rem] text-gray-400 font-bold uppercase tracking-widest">Kanakademi Test Sonucu</span>
                  <span className="text-[5rem] font-black leading-none" style={{ color: resultData.color }}>
                    {resultData.title}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                   {/* User Details */}
                   <div className="flex flex-col gap-12">
                     <div className="flex flex-col gap-2">
                       <span className="text-[2rem] text-gray-400 font-bold uppercase">Bağışçı Adı:</span>
                       <span className="text-[3.8rem] font-black text-gray-800 leading-none">{name}</span>
                     </div>
                     <div className="flex flex-col gap-2">
                       <span className="text-[2rem] text-gray-400 font-bold uppercase">Test Skoru:</span>
                       <span className="text-[4.2rem] font-black text-primary leading-none">{totalScore} / 30</span>
                     </div>
                   </div>

                   {/* Blood Type Badge */}
                   <div className="flex flex-col items-center justify-center bg-[#ffebee] rounded-[45px] w-[300px] h-[380px] shadow-sm border border-red-100 relative overflow-hidden">
                     <div className="absolute bottom-0 left-0 w-full h-[40%] bg-primary/10" />
                     <span className="text-[2rem] text-primary font-bold mb-4 z-10 uppercase">Kan Grubu</span>
                     <span className="text-[8rem] font-black text-primary leading-none tracking-tighter z-10 drop-shadow-sm">{bloodType}</span>
                     <Droplet size={80} className="text-primary mt-6 opacity-90 z-10" fill="currentColor" />
                   </div>
                </div>

                <div className="bg-gray-50 rounded-3xl p-8 flex items-center gap-8 mt-4 border border-gray-100">
                  <div className="text-[8rem] drop-shadow-md">{resultData.emoji}</div>
                  <div className="text-[2rem] text-gray-600 font-medium leading-relaxed">
                    {resultData.desc}
                  </div>
                </div>

              </div>
            </div>

            {/* Footer CTA */}
            <div className="mt-20 text-center z-10 flex flex-col items-center gap-6">
              <div className="text-[3.2rem] font-black text-secondary tracking-tight">Nasıl Bir Kan Bağışçısısın?</div>
              <div className="text-[2.6rem] font-bold text-white bg-primary px-20 py-8 rounded-[40px] shadow-[0_20px_50px_rgba(253,62,4,0.3)]">
                kanakademi.com.tr
              </div>
            </div>

          </div>
        </div>
      )}

      {isExporting && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-md z-50 flex flex-col items-center justify-center text-secondary font-bold">
          <RefreshCw className="animate-spin mb-4" size={48} color="#FD3E04" />
          <p>Tasarım Oluşturuluyor...</p>
        </div>
      )}

      <style jsx global>{`
        @keyframes magicSweep {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes shine {
          0% { left: -20%; }
          20% { left: 120%; }
          100% { left: 120%; }
        }
      `}</style>
    </div>
  );
}
