
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

interface MusicPlayerProps {
  audioSrc: string;
  autoPlay?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  audioSrc, 
  autoPlay = false 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(audioSrc);
    audioRef.current.loop = true;
    
    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [audioSrc]);

  // Removed autoplay effect to ensure music is always paused initially

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error("Play failed:", error);
      });
    }
    
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={togglePlay}
        variant="outline"
        size="icon"
        className="rounded-full bg-white/80 shadow-md hover:bg-white"
        aria-label={isPlaying ? "Mute music" : "Play music"}
      >
        {isPlaying ? (
          <Volume2 className="h-5 w-5 text-accent" />
        ) : (
          <VolumeX className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};

export default MusicPlayer;
