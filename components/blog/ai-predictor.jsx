// components/admin/AIPredictorCard.tsx
"use client";
import { useState, useEffect } from "react";
import { BrainCircuit, Clock, Calendar } from "lucide-react";
import { predictBestSendTime } from "@/server/aiServer/ai-genetor";

export default function AIPredictorCard() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    predictBestSendTime().then((res) => {
      setPrediction(res);
      setLoading(false);
    });
  }, []);

  if (loading)
    return <div className="h-32 bg-blue-50 animate-pulse rounded-2xl" />;

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
      <BrainCircuit className="absolute -right-4 -top-4 w-32 h-32 opacity-10" />

      <div className="flex items-center gap-2 mb-4">
        <div className="bg-white/20 p-2 rounded-lg">
          <BrainCircuit size={20} />
        </div>
        <h3 className="font-bold text-lg">AI Traffic Predictor</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/10 p-3 rounded-xl border border-white/20">
          <p className="text-[10px] uppercase font-bold opacity-60">Best Day</p>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <p className="font-bold">{prediction.bestDay}</p>
          </div>
        </div>
        <div className="bg-white/10 p-3 rounded-xl border border-white/20">
          <p className="text-[10px] uppercase font-bold opacity-60">
            Best Time
          </p>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <p className="font-bold">{prediction.bestHour}:00</p>
          </div>
        </div>
      </div>

      <p className="text-sm opacity-90 italic">" {prediction.reason} "</p>
    </div>
  );
}
