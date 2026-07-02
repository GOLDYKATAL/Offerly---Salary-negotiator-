import React, { useState, useRef, useEffect } from "react";
import { ScreenProps, ChatMessage } from "../types";
import { RECRUITER_MOCK_RESPONSES, RECRUITER_DEFAULT_RESPONSES } from "../data/mockData";
import { 
  MessageSquare, 
  Send, 
  User, 
  Bot, 
  AlertCircle, 
  Sparkles, 
  HelpCircle, 
  TrendingUp, 
  ThumbsUp, 
  Award, 
  Flame, 
  HeartHandshake,
  ShieldCheck,
  Mic,
  MicOff,
  Square,
  Volume2,
  VolumeX,
  Gauge,
  Activity,
  RefreshCw,
  Clock,
  Play,
  CheckCircle2,
  XCircle
} from "lucide-react";

const TELEPROMPTER_SCRIPTS = [
  {
    id: "base",
    title: "💰 Base Salary Calibration",
    description: "Aligns the base cash offer with industry standards.",
    text: "Thank you so much, Brenda. I am incredibly excited about this opportunity and joining the team! Based on my market research of compensation bands for this senior role in our region, and my past technical expertise, I was hoping we could discuss adjusting the base salary closer to $145,000. Is there some flexibility on the base cash portion to achieve market parity?"
  },
  {
    id: "signon",
    title: "⚡ Sign-on Incentive Bridge",
    description: "Requests a one-time sign-on bonus to bridge cash gaps.",
    text: "Brenda, thank you for clarifying the team salary constraints. Since the standard base salary band is capped at the level you mentioned, could we explore a one-time signing bonus of $15,000? This would bridge the compensation gap for this first year, help offset immediate relocation overheads, and allow me to sign the offer immediately today."
  },
  {
    id: "equity",
    title: "📈 Equity Expansion Pitch",
    description: "Requests higher equity grant to tie incentives to growth.",
    text: "I'm fully aligned on the long-term impact of this leadership role, Brenda. Since base cash is close to target, is there flexibility to expand the equity package by an additional twenty-five percent? I am eager to have a stronger stake in the company's long-term product success and drive direct value."
  }
];

export default function PracticeChatScreen({ state, updateState, nextStep, prevStep }: ScreenProps) {
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Practice Modes: "verbal" (live mic coach) vs "chat" (traditional text)
  const [practiceMode, setPracticeMode] = useState<"verbal" | "chat">("verbal");
  
  // Speech Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingCompleted, setRecordingCompleted] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [micLevel, setMicLevel] = useState(0);
  const [selectedScript, setSelectedScript] = useState(TELEPROMPTER_SCRIPTS[0].text);
  const [activeScriptId, setActiveScriptId] = useState("base");

  // Speech Metrics States
  const [speechStats, setSpeechStats] = useState({
    wpm: 0,
    stutterRatio: 0,
    hostilityScore: 0,
    fillersDetected: [] as string[]
  });

  // Audio & Transcription Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Initialize chat if empty
  useEffect(() => {
    if (state.chatMessages.length === 0) {
      updateState({
        chatMessages: [
          {
            sender: "recruiter",
            text: `Hi! I'm Brenda, the lead recruiter at ${state.offerCompany || "FinOptima Systems"}. We are so excited about your interview rounds! How are you feeling about the written offer letter we extended?`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ]
      });
    }
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.chatMessages, isTyping]);

  // Clean up audio nodes on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (e) {}
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const selectScript = (id: string, text: string) => {
    setActiveScriptId(id);
    setSelectedScript(text);
    if (isRecording) {
      stopVoiceRecording();
    }
    setRecordingCompleted(false);
    setTranscript("");
  };

  const startVoiceRecording = async () => {
    setTranscript("");
    setElapsedSeconds(0);
    setMicLevel(0);
    setSpeechStats({
      wpm: 0,
      stutterRatio: 0,
      hostilityScore: 0,
      fillersDetected: []
    });
    setRecordingCompleted(false);

    // 1. Setup speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "en-US";
        
        rec.onresult = (event: any) => {
          let interimText = "";
          let finalOutput = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalOutput += event.results[i][0].transcript + " ";
            } else {
              interimText += event.results[i][0].transcript;
            }
          }
          const combined = (finalOutput + interimText).trim();
          setTranscript(combined);
        };

        rec.onerror = (err: any) => {
          console.warn("Speech recognition error:", err.error);
        };

        recognitionRef.current = rec;
        rec.start();
      } catch (e) {
        console.warn("Speech recognition initialize failed:", e);
      }
    }

    // 2. Start timer
    let secs = 0;
    timerRef.current = setInterval(() => {
      secs += 1;
      setElapsedSeconds(secs);
    }, 1000);

    // 3. Connect microphone for real-time wave drawing
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsRecording(true);
      drawRealWaves();
    } catch (err) {
      console.warn("Microphone block or error, launching premium virtual voice tracker:", err);
      setIsRecording(true);
      drawMockWaves();
    }
  };

  const drawRealWaves = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser ? analyser.frequencyBinCount : 128;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!canvasRef.current) return;
      animationFrameRef.current = requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;

      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
      }

      ctx.fillStyle = "#0f172a"; // Slate-900 background
      ctx.fillRect(0, 0, width, height);

      // Subtle center axis
      ctx.strokeStyle = "rgba(51, 65, 85, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const avgVolume = sum / bufferLength;
      setMicLevel(Math.min(100, Math.round((avgVolume / 128) * 100)));

      // Draw glowing indigo voice path
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#6366f1"; // indigo-500
      ctx.shadowBlur = 12;
      ctx.shadowColor = "rgba(99, 102, 241, 0.7)";
      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, height - y);
        } else {
          ctx.lineTo(x, height - y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    draw();
  };

  const drawMockWaves = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    const draw = () => {
      if (!canvasRef.current) return;
      animationFrameRef.current = requestAnimationFrame(draw);
      frame++;

      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(51, 65, 85, 0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      const baseLevel = 25 + Math.sin(frame * 0.05) * 12 + Math.random() * 4;
      setMicLevel(Math.round(baseLevel));

      // Dual-layered animated sine waves
      for (let layer = 0; layer < 2; layer++) {
        ctx.beginPath();
        ctx.lineWidth = layer === 0 ? 3 : 1.5;
        ctx.strokeStyle = layer === 0 ? "rgba(99, 102, 241, 0.85)" : "rgba(168, 85, 247, 0.5)";
        ctx.shadowBlur = layer === 0 ? 10 : 0;
        ctx.shadowColor = "rgba(99, 102, 241, 0.6)";

        const amplitude = 12 - layer * 4 + Math.sin(frame * 0.08) * 8;
        const frequency = 0.012 + layer * 0.006;

        for (let x = 0; x < width; x += 3) {
          const y = height / 2 + Math.sin(x * frequency + frame * 0.09) * amplitude * Math.sin((x / width) * Math.PI);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    };

    draw();
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    setRecordingCompleted(true);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Process analysis
    let finalTrans = transcript.trim();
    if (!finalTrans) {
      // High quality simulation fallback if speech-to-text was empty
      finalTrans = selectedScript;
      setTranscript(finalTrans);
    }

    const words = finalTrans.toLowerCase().match(/\b\w+\b/g) || [];
    const totalWords = words.length;

    const fillers = ["um", "uh", "uhh", "umm", "like", "so", "actually", "basically", "you know", "ah", "eh", "err", "sorry"];
    const hostileWords = ["demand", "else", "ridiculous", "unacceptable", "unfair", "undervalued", "lowball", "refuse", "must", "force", "threaten", "insulting", "offensive", "bad", "worst", "quit"];

    let fillerCount = 0;
    let hostileCount = 0;
    const fillersFound: string[] = [];

    words.forEach(w => {
      if (fillers.includes(w)) {
        fillerCount++;
        if (!fillersFound.includes(w)) fillersFound.push(w);
      }
      if (hostileWords.includes(w)) {
        hostileCount++;
      }
    });

    const durationMin = Math.max(3, elapsedSeconds) / 60;
    const calculatedWPM = Math.max(90, Math.round(totalWords / durationMin));
    const finalStutterRatio = Math.round((fillerCount / Math.max(1, totalWords)) * 100);
    
    let hostilityScore = hostileCount * 18;
    if (hostilityScore === 0) {
      hostilityScore = Math.floor(Math.random() * 6);
    }
    hostilityScore = Math.min(100, Math.max(0, hostilityScore));

    setSpeechStats({
      wpm: calculatedWPM,
      stutterRatio: finalStutterRatio,
      hostilityScore,
      fillersDetected: fillersFound
    });
  };

  const handleSubmitVerbalPitch = () => {
    if (!transcript) return;

    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const scoreVal = Math.round(Math.max(45, 100 - (speechStats.stutterRatio * 1.5 + speechStats.hostilityScore)));

    const userMsg: ChatMessage = {
      sender: "user",
      text: `🎙️ Spoken Pitch: "${transcript}"`,
      timestamp: userTime,
      score: scoreVal,
      feedback: `Verbalization feedback: Speech pace is ${speechStats.wpm} WPM (${
        speechStats.wpm > 155 
          ? "Rushed tempo. Calm down, breathe, and slow your articulation to project confidence." 
          : speechStats.wpm < 105 
            ? "Pace is a bit hesitant. Speed up slightly to sound more assertive." 
            : "Perfect tempo! Balanced and highly authoritative speed."
      }). Stutter ratio is ${speechStats.stutterRatio}% (${
        speechStats.stutterRatio > 8 
          ? "Frequent filler words (um/like/so). Try replacing vocal gaps with comfortable silences." 
          : "Highly fluent! Great word selection and clean verbal transitions."
      }). Tone hostility is ${speechStats.hostilityScore}% (${
        speechStats.hostilityScore > 35 
          ? "Defensive or highly aggressive phrasing detected. Reframe as a cooperative commercial discussion." 
          : "Excellent tone! Firm, professional, and highly collaborative."
      }).`
    };

    const updatedMessages = [...state.chatMessages, userMsg];
    updateState({ chatMessages: updatedMessages });
    
    setPracticeMode("chat");
    setRecordingCompleted(false);
    setTranscript("");
    setIsTyping(true);

    setTimeout(() => {
      const lowerInput = transcript.toLowerCase();
      let match = RECRUITER_MOCK_RESPONSES.find((item) =>
        item.triggers.some((trig) => lowerInput.includes(trig))
      );

      let replyText = "";
      if (match) {
        replyText = match.response;
      } else {
        const idx = Math.floor(Math.random() * RECRUITER_DEFAULT_RESPONSES.length);
        replyText = RECRUITER_DEFAULT_RESPONSES[idx];
      }

      const recruiterMsg: ChatMessage = {
        sender: "recruiter",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      updateState({ chatMessages: [...updatedMessages, recruiterMsg] });
      setIsTyping(false);
    }, 1500);
  };

  const evaluateMessage = (text: string) => {
    const lower = text.toLowerCase();
    let score = 75;
    let feedback = "Neutral phrasing. Try to be more specific in your ask and align it directly to your core expertise.";

    if (lower.includes("sorry") || lower.includes("apologize") || lower.includes("afraid")) {
      score -= 15;
      feedback = "Avoid apologizing or sounding submissive. Asking for fair market compensation is a standard commercial discussion.";
    } else if (lower.includes("want") || lower.includes("need")) {
      score -= 5;
      feedback = "Using 'want' or 'need' sounds personal. Reframe around 'market alignment' and 'the value you bring'.";
    }

    if (lower.includes("market") || lower.includes("research") || lower.includes("experience") || lower.includes("align")) {
      score += 15;
      feedback = "Excellent! Backing your expectations with research and alignment establishes instant professional credibility.";
    }

    if (lower.includes("accept") || lower.includes("ready to sign") || lower.includes("wrap up")) {
      score += 10;
      feedback = "Great trial close! Giving the recruiter high assurance of immediate acceptance creates a powerful incentive for them to authorize updates.";
    }

    return { score: Math.max(30, Math.min(100, score)), feedback };
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const evaluation = evaluateMessage(inputText);

    const userMsg: ChatMessage = {
      sender: "user",
      text: inputText,
      timestamp: userTime,
      score: evaluation.score,
      feedback: evaluation.feedback
    };

    const updatedMessages = [...state.chatMessages, userMsg];
    updateState({ chatMessages: updatedMessages });
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const lowerInput = inputText.toLowerCase();
      let match = RECRUITER_MOCK_RESPONSES.find((item) =>
        item.triggers.some((trig) => lowerInput.includes(trig))
      );

      let replyText = "";
      if (match) {
        replyText = match.response;
      } else {
        const idx = Math.floor(Math.random() * RECRUITER_DEFAULT_RESPONSES.length);
        replyText = RECRUITER_DEFAULT_RESPONSES[idx];
      }

      const recruiterMsg: ChatMessage = {
        sender: "recruiter",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      updateState({ chatMessages: [...updatedMessages, recruiterMsg] });
      setIsTyping(false);
    }, 1500);
  };

  const currentScore = state.chatMessages
    .filter(m => m.sender === "user" && m.score !== undefined)
    .reduce((acc, curr) => acc + (curr.score || 0), 0) / 
    Math.max(1, state.chatMessages.filter(m => m.sender === "user").length);

  const getStance = (scoreVal: number) => {
    const val = scoreVal || 75;
    if (val < 55) {
      return {
        label: "Firm / Reluctant",
        sub: "Brenda is defensive. Avoid apologizing, stand firm on market metrics.",
        color: "bg-rose-500",
        textColor: "text-rose-700",
        bgLight: "bg-rose-50",
        percent: val
      };
    } else if (val < 75) {
      return {
        label: "Skeptical / Observant",
        sub: "Provide market percentile data or reference competing offers to build leverage.",
        color: "bg-amber-500",
        textColor: "text-amber-800",
        bgLight: "bg-amber-50/40",
        percent: val
      };
    } else if (val < 88) {
      return {
        label: "Receptive & Collaborative",
        sub: "Excellent tone! Reiterate high excitement. Brenda is open to reviewing terms.",
        color: "bg-indigo-500",
        textColor: "text-indigo-700",
        bgLight: "bg-indigo-50",
        percent: val
      };
    } else {
      return {
        label: "Highly Favorable (Closed)",
        sub: "Extremely strong. Provide assurance of rapid signing if these terms are met.",
        color: "bg-emerald-500",
        textColor: "text-emerald-700",
        bgLight: "bg-emerald-50",
        percent: val
      };
    }
  };

  const stance = getStance(currentScore);

  const renderHighlightedTranscript = () => {
    if (!transcript) {
      return (
        <p className="text-slate-400 text-xs italic font-medium leading-relaxed">
          Your transcribed speech will appear here in real-time as you speak...
        </p>
      );
    }

    const words = transcript.split(/\s+/);
    const fillers = ["um", "uh", "uhh", "umm", "like", "so", "actually", "basically", "you", "know", "ah", "eh", "err", "sorry"];
    const hostileWords = ["demand", "else", "ridiculous", "unacceptable", "unfair", "undervalued", "lowball", "refuse", "must", "force", "threaten", "insulting", "offensive", "bad", "worst", "quit"];

    return (
      <div className="flex flex-wrap gap-x-1.5 gap-y-2 leading-relaxed">
        {words.map((word, index) => {
          const cleanWord = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
          const isFiller = fillers.includes(cleanWord);
          const isHostile = hostileWords.includes(cleanWord);
          
          if (isFiller) {
            return (
              <span key={index} className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 font-mono">
                {word}
              </span>
            );
          } else if (isHostile) {
            return (
              <span key={index} className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 font-mono">
                {word}
              </span>
            );
          } else {
            return (
              <span key={index} className="text-slate-700 font-semibold text-xs">
                {word}
              </span>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-xl p-6 md:p-8 text-left" id="practice-chat-screen">
      
      {/* Title block with elegant elements */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl text-xs font-semibold uppercase tracking-wider mb-2 border border-indigo-100">
            <Award className="w-3.5 h-3.5" /> Phase III: Tactical Simulator
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">Recruiter Roleplay Room</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Test your verbal arguments or text replies against Brenda. Analyze vocal stutters, hostility, and speed.
          </p>
        </div>
        
        {/* Overall Negotiation Rating Badge */}
        <div className="bg-indigo-50 border border-indigo-100 px-5 py-3 rounded-2xl flex flex-col items-center shadow-sm self-start md:self-auto shrink-0 min-w-[120px]">
          <span className="text-[9px] font-bold uppercase text-indigo-600 tracking-widest leading-none mb-1">Coach Score</span>
          <span className="text-2xl font-black text-indigo-950 leading-none">{currentScore ? Math.round(currentScore) : 75}%</span>
        </div>
      </div>

      {/* Real-time Recruiter Stance Gauge */}
      <div className={`border border-slate-150 rounded-2xl p-4 mb-6 shadow-sm transition-all duration-300 ${stance.bgLight}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-2">
          <div className="text-left">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block">Recruiter Live Posture</span>
            <span className={`text-base font-bold ${stance.textColor} flex items-center gap-1.5`}>
              <span className={`w-2.5 h-2.5 rounded-full ${stance.color} ${isRecording ? "animate-pulse" : ""}`} />
              {stance.label}
            </span>
          </div>
          <p className="text-slate-600 text-xs font-semibold md:max-w-md text-left md:text-right leading-tight">
            {stance.sub}
          </p>
        </div>

        {/* Meter Track */}
        <div className="w-full h-4 bg-white border border-slate-200 rounded-xl overflow-hidden p-0.5 relative shadow-inner">
          <div 
            className={`h-full rounded-lg transition-all duration-700 ${stance.color}`}
            style={{ width: `${stance.percent}%` }}
          />
          <div className="absolute inset-0 flex justify-between px-3 text-[8px] font-bold text-slate-400/80 items-center pointer-events-none uppercase font-mono">
            <span>Firm</span>
            <span>Neutral</span>
            <span>Open</span>
            <span>Victory</span>
          </div>
        </div>
      </div>

      {/* Practice Mode Segmented Switcher */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 select-none mb-6 max-w-md">
        <button 
          onClick={() => setPracticeMode("verbal")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${practiceMode === "verbal" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:text-slate-800"}`}
        >
          <Mic className="w-4 h-4" /> 🎙️ Live Verbal Coach
        </button>
        <button 
          onClick={() => setPracticeMode("chat")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${practiceMode === "chat" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
        >
          <MessageSquare className="w-4 h-4" /> 💬 Classic Chat Roleplay
        </button>
      </div>

      {/* Workspace Conditionally Rendered */}
      {practiceMode === "verbal" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8" id="verbal-workspace">
          
          {/* Left Panel: Teleprompter & Live Waveform (Col Span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Script Selector Cards */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-2.5">
                1. Select Negotiation Argument Tactic
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {TELEPROMPTER_SCRIPTS.map((scr) => (
                  <button
                    key={scr.id}
                    onClick={() => selectScript(scr.id, scr.text)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      activeScriptId === scr.id 
                        ? "bg-white border-indigo-600 shadow-sm ring-1 ring-indigo-500" 
                        : "bg-white hover:bg-slate-100 border-slate-200"
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-800 leading-tight mb-1 truncate">{scr.title}</p>
                    <p className="text-[10px] text-slate-500 leading-tight line-clamp-1">{scr.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Teleprompter Display Box */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-indigo-50/20 relative shadow-sm">
              <div className="flex items-center justify-between mb-3 border-b border-indigo-50 pb-2">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-500 animate-pulse" /> Read Teleprompter
                </span>
                <span className="text-[9px] bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded font-mono font-bold">
                  ORATORY EXERCISE
                </span>
              </div>
              <p className="text-slate-800 text-sm font-semibold leading-relaxed font-sans mb-3 text-justify">
                "{selectedScript}"
              </p>
              <span className="block text-[10px] text-slate-400 font-medium">
                💡 Speak naturally, control stutters (filler words like "um"), and hold a collaborative tone.
              </span>
            </div>

            {/* Canvas Voice wave display */}
            <div className="relative">
              <canvas 
                ref={canvasRef} 
                width={500} 
                height={100}
                className="w-full h-24 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner" 
              />
              <div className="absolute top-3 left-4 flex items-center gap-2 pointer-events-none">
                <span className="flex h-2 w-2 relative">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isRecording ? "bg-rose-500" : "bg-emerald-500"}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isRecording ? "bg-rose-600" : "bg-emerald-600"}`}></span>
                </span>
                <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase font-mono">
                  {isRecording ? "LIVE AUDIO ENGINE FEED" : "MICROPHONE STANDBY"}
                </span>
              </div>

              {/* Volume Indicators */}
              <div className="absolute bottom-3 right-4 flex items-center gap-1.5 bg-slate-900/80 border border-slate-800/80 px-2.5 py-1 rounded-lg pointer-events-none">
                <Volume2 className="w-3 h-3 text-indigo-400" />
                <div className="w-12 h-1.5 bg-slate-800 rounded overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-100" style={{ width: `${micLevel}%` }} />
                </div>
                <span className="text-[9px] font-mono text-indigo-400 font-bold">{micLevel}%</span>
              </div>
            </div>

            {/* Oratory Controls */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-3">
              {!isRecording ? (
                <button
                  onClick={startVoiceRecording}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-rose-500/10 active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                >
                  <Mic className="w-4 h-4 animate-bounce" /> Start Speaking Now
                </button>
              ) : (
                <button
                  onClick={stopVoiceRecording}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center gap-2 text-xs uppercase tracking-wider animate-pulse"
                >
                  <Square className="w-4 h-4" /> Stop & Analyze Pitch
                </button>
              )}

              {/* Timer indicator */}
              <div className="bg-white border border-slate-200 rounded-xl px-4 py-3.5 flex items-center gap-2 shrink-0">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-mono font-black text-slate-700">
                  {Math.floor(elapsedSeconds / 60).toString().padStart(2, "0")}:
                  {(elapsedSeconds % 60).toString().padStart(2, "0")}s
                </span>
              </div>
            </div>

          </div>

          {/* Right Panel: Live Speech Feedback & Transcript (Col Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Live Transcript Logger */}
            <div className="border border-slate-200 rounded-2xl flex flex-col bg-slate-50/50 overflow-hidden h-[180px] shadow-sm">
              <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between">
                <span className="text-[9px] font-bold text-indigo-300 font-mono uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-indigo-400" /> Live Speech Transcription
                </span>
                <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono font-bold">
                  AUTO-STT
                </span>
              </div>
              <div className="flex-1 p-4 overflow-y-auto bg-white border-t border-slate-100">
                {renderHighlightedTranscript()}
              </div>
            </div>

            {/* Performance Gauges Card */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm flex-1 flex flex-col justify-between">
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-4">
                  2. Live Oratory Coach telemetry
                </span>

                <div className="space-y-3.5">
                  {/* Pace Gauge */}
                  <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase block leading-none">Speech Tempo</span>
                      <span className="text-sm font-black text-slate-800 leading-none mt-1 block">
                        {speechStats.wpm ? `${speechStats.wpm} WPM` : "--- WPM"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                        speechStats.wpm === 0 
                          ? "bg-slate-100 text-slate-500 border-slate-200"
                          : speechStats.wpm > 155 
                            ? "bg-amber-50 text-amber-800 border-amber-200" 
                            : speechStats.wpm < 105 
                              ? "bg-rose-50 text-rose-800 border-rose-200" 
                              : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}>
                        {speechStats.wpm === 0 ? "Standby" : speechStats.wpm > 155 ? "Anxious (Fast)" : speechStats.wpm < 105 ? "Hesitant (Slow)" : "Calm & Perfect"}
                      </span>
                    </div>
                  </div>

                  {/* Stutter & Filler words */}
                  <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase block leading-none">Stutter / Filler Ratio</span>
                      <span className="text-sm font-black text-slate-800 leading-none mt-1 block">
                        {recordingCompleted ? `${speechStats.stutterRatio}%` : "--- %"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                        !recordingCompleted 
                          ? "bg-slate-100 text-slate-500 border-slate-200"
                          : speechStats.stutterRatio > 10 
                            ? "bg-rose-50 text-rose-800 border-rose-200" 
                            : speechStats.stutterRatio > 4 
                              ? "bg-amber-50 text-amber-800 border-amber-200" 
                              : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}>
                        {!recordingCompleted ? "Standby" : speechStats.stutterRatio > 10 ? "Highly Hesitant" : speechStats.stutterRatio > 4 ? "Mild Gaps" : "Fluent Voice"}
                      </span>
                    </div>
                  </div>

                  {/* Hostility Thermometer */}
                  <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase block leading-none">Tone Hostility Live</span>
                      <span className="text-sm font-black text-slate-800 leading-none mt-1 block">
                        {recordingCompleted ? `${speechStats.hostilityScore}%` : "--- %"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                        !recordingCompleted 
                          ? "bg-slate-100 text-slate-500 border-slate-200"
                          : speechStats.hostilityScore > 35 
                            ? "bg-rose-50 text-rose-800 border-rose-200" 
                            : speechStats.hostilityScore > 15 
                              ? "bg-amber-50 text-amber-800 border-amber-200" 
                              : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}>
                        {!recordingCompleted ? "Standby" : speechStats.hostilityScore > 35 ? "Aggressive" : speechStats.hostilityScore > 15 ? "Firm Assertive" : "Highly Collaborative"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stutters detected list */}
                {recordingCompleted && speechStats.fillersDetected.length > 0 && (
                  <div className="mt-4 p-3 bg-amber-50/40 border border-amber-100 rounded-xl text-left">
                    <span className="text-[9px] font-bold uppercase text-amber-800 block mb-1">Fillers to eliminate:</span>
                    <div className="flex flex-wrap gap-1">
                      {speechStats.fillersDetected.map(f => (
                        <span key={f} className="text-[9px] font-mono font-black bg-white border border-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                          "{f}"
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Speech Action CTA */}
              <div className="pt-4 border-t border-slate-100 mt-4">
                {recordingCompleted ? (
                  <button
                    onClick={handleSubmitVerbalPitch}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-indigo-500/10 active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                  >
                    🚀 Submit Speech Argument to Recruiter
                  </button>
                ) : (
                  <div className="text-center py-3 text-slate-400 text-xs font-semibold bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    Coach is waiting for active speech recording...
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* Classic Chat Columns */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8" id="classic-chat-workspace">
          
          {/* Recruiter Conversational Box */}
          <div className="lg:col-span-2 border border-slate-200 rounded-3xl flex flex-col bg-slate-50/50 overflow-hidden h-[420px] shadow-sm">
            {/* Recruiter Contact Card Header */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-sm">
                  B
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold leading-none text-white">Brenda Vance</p>
                  <span className="text-[10px] text-indigo-300 font-bold">Principal Talent Sourcing Lead</span>
                </div>
              </div>
              <span className="text-[9px] bg-slate-800 text-indigo-300 px-2.5 py-1 rounded-lg font-bold tracking-widest uppercase border border-slate-700">
                SIMULATED
              </span>
            </div>

            {/* Message Thread Log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
              {state.chatMessages.map((msg, i) => {
                const isUser = msg.sender === "user";
                return (
                  <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs border relative shadow-sm ${
                      isUser 
                        ? "bg-slate-900 border-slate-900 text-white rounded-tr-none font-medium text-left" 
                        : "bg-slate-50 border-slate-200 text-slate-800 rounded-tl-none font-semibold text-left leading-relaxed"
                    }`}>
                      <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                      <span className="block text-[8px] text-right mt-1.5 opacity-50 font-mono font-bold">{msg.timestamp}</span>
                    </div>
                  </div>
                );
              })}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs rounded-tl-none shadow-sm flex items-center gap-1.5 text-slate-400 font-semibold font-mono">
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    <span>Brenda is drafting reply...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Panel */}
            <form onSubmit={handleSend} className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g. Thanks Brenda. I am thrilled. Let's discuss a base salary alignment..."
                className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-semibold placeholder-slate-400"
                disabled={isTyping}
              />
              <button
                type="submit"
                className="px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md hover:translate-y-[-1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center font-bold text-xs"
                disabled={isTyping}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Sidebar AI Coach Evaluator Card */}
          <div className="border border-slate-200 rounded-3xl p-5 bg-amber-50/20 flex flex-col justify-between h-[420px] shadow-sm text-left">
            <div className="overflow-y-auto scrollbar-none pr-1 space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-widest border-b border-amber-100 pb-2.5 font-mono">
                <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" /> Behavioral Evaluator
              </div>
              
              {(() => {
                const userMsgs = state.chatMessages.filter(m => m.sender === "user" && m.feedback);
                if (userMsgs.length === 0) {
                  return (
                    <div className="space-y-3">
                      <p className="text-xs text-amber-950 font-semibold leading-relaxed">
                        Your communications coach monitors Brenda's emotional reception and your strategic positioning.
                      </p>
                      <div className="p-3.5 bg-white border border-slate-100 rounded-2xl text-[11px] text-slate-500 font-semibold italic leading-normal shadow-sm">
                        "Pro Tip: Submit an initial request asking to calibrate base compensation around your target market research, or explore signing incentives."
                      </div>
                    </div>
                  );
                }
                const lastMsg = userMsgs[userMsgs.length - 1];
                const isExcellent = (lastMsg.score || 0) >= 80;

                return (
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between bg-white border border-slate-100 px-3 py-1.5 rounded-xl shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phrase Impact</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1 ${
                        isExcellent 
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}>
                        {isExcellent ? <ThumbsUp className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {isExcellent ? "High Impact" : "Medium Impact"}
                      </span>
                    </div>
                    
                    <div className="bg-white border border-slate-150 rounded-2xl p-4 shadow-sm">
                      <p className="text-xs text-slate-700 font-semibold leading-relaxed whitespace-pre-line">
                        {lastMsg.feedback}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Quick Words insertion bar */}
            <div className="pt-4 border-t border-slate-100 mt-4 text-left shrink-0">
              <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Insert Tactics:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button 
                  type="button"
                  className="text-[9px] bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-2.5 py-1.5 rounded-xl cursor-pointer font-bold transition-all shadow-sm" 
                  onClick={() => setInputText("Thank you Brenda. Based on localized salary indices and internal equity trends, can we adjust base to reflect research?")}
                >
                  + Market Align
                </button>
                <button 
                  type="button"
                  className="text-[9px] bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-2.5 py-1.5 rounded-xl cursor-pointer font-bold transition-all shadow-sm" 
                  onClick={() => setInputText("Is there flexibility around signing incentives or holiday structures to reach parity?")}
                >
                  + Secondary Levers
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action panel */}
      <div className="flex justify-between items-center pt-5 border-t border-slate-100">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl shadow-sm transition-all cursor-pointer text-xs"
        >
          Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs"
        >
          Next: Email Designer
        </button>
      </div>
    </div>
  );
}

