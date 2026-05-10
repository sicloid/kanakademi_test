"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import { Download, RefreshCw } from "lucide-react";

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

export default function Quiz() {
  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const startQuiz = () => setStep("quiz");

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
        body: JSON.stringify({ score: finalScore, profile: resultProfile.title }),
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
        backgroundColor: "#13162F",
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
              onClick={startQuiz}
              className="w-full bg-gradient-to-br from-primary to-[#ff6b3b] text-white py-4 rounded-full font-bold text-lg shadow-[0_8px_25px_var(--primary-glow)] relative overflow-hidden group"
            >
              <div className="absolute inset-y-0 -left-[20%] w-[20%] bg-white/30 -skew-x-[20deg] group-hover:animate-[shine_1.5s_infinite]" />
              Teste Başla 🩸
            </motion.button>
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

      {/* Hidden Export Node */}
      {step === "result" && resultData && (
        <div
          id="storyExport"
          className="absolute -top-[9999px] -left-[9999px] w-[1080px] h-[1920px] bg-secondary flex flex-col items-center justify-center text-center p-20 text-white overflow-hidden"
        >
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(253,62,4,0.25),transparent_1000px),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_800px)]" />
          <div className="z-10 flex flex-col items-center w-full">
            <img
              src="https://kanakademi.com.tr/wp-content/uploads/2024/08/kanakademi-logo.png"
              alt="Logo"
              className="h-[140px] mb-[120px]"
              crossOrigin="anonymous"
            />
            <div className="text-[3.5rem] font-medium text-white/80 mb-10">
              Kanakademi testini çözdüm ve ben bir:
            </div>
            <div
              className="text-[8rem] font-black mb-[100px] leading-tight"
              style={{ color: resultData.color }}
            >
              {resultData.title}
            </div>
            <div className="w-[450px] h-[450px] rounded-full bg-white/5 border-4 border-dashed border-primary/50 flex items-center justify-center mb-[120px] shadow-[0_0_100px_rgba(253,62,4,0.2)]">
              <span className="text-[12rem]">{resultData.emoji}</span>
            </div>
            <div className="text-[2.8rem] font-bold text-white bg-primary px-20 py-10 rounded-full mt-auto shadow-[0_20px_50px_rgba(253,62,4,0.4)]">
              sen de kanakademi.com.tr&apos;ye gir, testini çöz! 🩸
            </div>
          </div>
        </div>
      )}

      {isExporting && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-md z-50 flex flex-col items-center justify-center text-secondary font-bold">
          <RefreshCw className="animate-spin mb-4" size={48} color="#FD3E04" />
          <p>Sihir Gerçekleşiyor...</p>
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
