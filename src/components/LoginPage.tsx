import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/firebase';

const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: unknown) {
      console.error('Sign in error:', err);
      const message = err instanceof Error ? err.message : 'שגיאה בהתחברות';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[100dvh] items-center justify-center bg-[#f4f4f0] bg-[radial-gradient(#d4d4d0_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="flex flex-col items-center gap-8 w-full max-w-sm px-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 bg-[#facc15] border-[4px] border-black shadow-[6px_6px_0_0_#000] rounded-xl flex items-center justify-center">
            <span className="text-5xl font-black font-mono">L</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-black font-mono">LinkKeeper</h1>
          <p className="text-base font-bold text-black/70 text-center">שמור, ארגן וגש ללינקים שלך בקלות</p>
        </div>

        {/* Login Card */}
        <div className="w-full bg-white border-[4px] border-black shadow-[8px_8px_0_0_#000] rounded-xl p-8 flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-black uppercase text-black">כניסה לחשבון</h2>
            <p className="text-sm font-bold text-black/60 mt-1">התחבר כדי לגשת ללינקים שלך</p>
          </div>

          {error && (
            <div className="bg-red-100 border-[3px] border-red-500 rounded-lg px-4 py-3 text-sm font-bold text-red-700 shadow-[2px_2px_0_0_#ef4444]">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-[#f8f8f8] border-[3px] border-black rounded-xl px-6 py-4 font-black text-base shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-none active:translate-x-0 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <div className="w-6 h-6 border-[3px] border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            <span>{loading ? 'מתחבר...' : 'התחבר עם Google'}</span>
          </button>
        </div>

        <p className="text-xs font-bold text-black/50 text-center">
          על ידי התחברות אתה מסכים לתנאי השימוש שלנו
        </p>
      </div>
    </div>
  );
}
