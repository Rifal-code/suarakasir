"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// Basic types for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  
  // Use any to bypass TS complaining about vendor prefixed APIs
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "id-ID";

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let finalTrans = "";
          let interimTrans = "";
          
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTrans += event.results[i][0].transcript;
            } else {
              interimTrans += event.results[i][0].transcript;
            }
          }
          
          if (finalTrans) {
             setTranscript((prev) => prev ? prev + " " + finalTrans : finalTrans);
          }
          setInterimTranscript(interimTrans);
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          // Only set error if it's not "no-speech" since users might just pause
          if (event.error !== 'no-speech') {
            console.error("Speech recognition error", event.error);
            setError(`Error: ${event.error}`);
            setIsRecording(false);
          }
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      } else {
        setError("Browser tidak mendukung fitur voice recognition (Web Speech API). Gunakan Chrome/Edge.");
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    setTranscript("");
    setInterimTranscript("");
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e: any) {
        if (e.name === 'InvalidStateError') {
          setIsRecording(true);
        } else {
          console.error("Could not start recording", e);
          setError("Gagal memulai rekaman");
        }
      }
    } else {
       setError("Browser tidak mendukung fitur voice recognition.");
    }

    // Start MediaRecorder for actual audio capture
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start();
    } catch (err) {
      console.error("Gagal akses mikrofon untuk MediaRecorder:", err);
    }
  }, []);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current!.mimeType });
          mediaRecorderRef.current!.stream.getTracks().forEach(track => track.stop());
          setIsRecording(false);
          resolve(blob);
        };
        mediaRecorderRef.current.stop();
      } else {
        setIsRecording(false);
        resolve(null);
      }
    });
  }, []);

  return {
    isRecording,
    transcript,
    interimTranscript,
    error,
    startRecording,
    stopRecording
  };
}
