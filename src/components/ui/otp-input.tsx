
import React, { useState, useRef, KeyboardEvent, ClipboardEvent, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  className?: string;
}

export function OtpInput({
  length = 4,
  onComplete,
  className,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.focus();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    // Take only the last character if multiple characters are pasted
    const singleValue = value.slice(-1);
    
    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = singleValue;
    setOtp(newOtp);

    // Auto-focus next input if value is entered
    if (singleValue && index < length - 1) {
      focusInput(index + 1);
    }

    // Call onComplete if all fields are filled
    if (newOtp.every(v => v !== "") && onComplete) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      focusInput(index - 1);
    }
    
    // Handle left/right arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    
    if (!/^\d+$/.test(pastedData)) return; // Only allow digits
    
    const newOtp = [...otp];
    
    // Fill in the values starting from current index
    for (let i = 0; i < pastedData.length && index + i < length; i++) {
      newOtp[index + i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    // Focus on the next unfilled input or the last input
    const nextUnfilled = newOtp.findIndex((v, i) => i >= index && v === "");
    if (nextUnfilled !== -1 && nextUnfilled < length) {
      focusInput(nextUnfilled);
    } else {
      focusInput(length - 1);
    }
    
    // Call onComplete if all fields are filled
    if (newOtp.every(v => v !== "") && onComplete) {
      onComplete(newOtp.join(""));
    }
  };

  return (
    <div className={cn("flex justify-center gap-3", className)}>
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          value={otp[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={(e) => handlePaste(e, index)}
          className="w-12 h-12 text-center text-xl font-semibold"
        />
      ))}
    </div>
  );
}
