import { useEffect, useState } from "react";
import axios from "axios";
import { EraserIcon, Wand2Icon, Zap, Loader } from "lucide-react";

export default function Step0({
  setStage,
  setPrevStage,
  setQrCode,
  setInvoiceBolt11,
  socketId,
  prompt,
  setPrompt,
}: {
  setStage: React.Dispatch<React.SetStateAction<number>>;
  setPrevStage: React.Dispatch<React.SetStateAction<number>>;
  setQrCode: React.Dispatch<React.SetStateAction<string | null>>;
  setInvoiceBolt11: React.Dispatch<React.SetStateAction<string | null>>;
  socketId: string | null;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (prompt.length <= 300 || prompt.length >= 10) {
      setError("");
    }
  }, [prompt]);

  const handleSubmitStage0 = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);

    const prompt = e.currentTarget.querySelector("textarea")?.value;

    if (!prompt) {
      setError("Please enter a prompt!");
      return;
    }

    if (prompt.length < 10) {
      setError("Please enter a prompt with at least 10 characters!");
      return;
    }

    if (prompt.length > 300) {
      setError("Please enter a prompt with at most 300 characters!");
      return;
    }

    setLoading(true);

    const response = await axios.post(
      "https://ai-rand-backend.miguelmedeiros.dev/new-invoice",
      {
        prompt,
        websocket_id: socketId,
      }
    );

    if (response) {
      setPrevStage(0);
      setStage(1);
      setQrCode(response.data.qr_code_png);
      setInvoiceBolt11(response.data.payment_request);
    }

    setLoading(false);
  };

  useEffect(() => {
    const phrases = [
      "What's on your mind today?",
      "Unleash your imagination...",
      "Share your creative spark here...",
      "Let your thoughts take shape...",
      "Start your masterpiece...",
      "What's your big idea?",
      "Inspire me with your thoughts...",
      "Type away your next great idea...",
      "Ready to create something awesome?",
      "Your genius begins here...",
    ];
    const typingInterval = setInterval(() => {
      if (charIndex < phrases[index].length) {
        setPlaceholder((prev) => prev + phrases[index].charAt(charIndex));
        setCharIndex((prevCharIndex) => prevCharIndex + 1);
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setIndex((prevIndex) => (prevIndex + 1) % phrases.length);
          setPlaceholder("");
          setCharIndex(0);
        }, 10000);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [charIndex, index]);

  return (
    <>
      <p className="text-[22px] mt-2">
        AI-generated content for <b className="text-[#E640A3]">Pubky Social</b>
        <br />
        paid with{" "}
        <Zap
          size={24}
          className="inline transition-all zap-loop zap-hover"
        />{" "}
        Lightning Network!
      </p>
      <div className="flex flex-col items-center justify-center mt-8">
        <form
          className="flex flex-col items-center"
          onSubmit={handleSubmitStage0}
        >
          <textarea
            className={`w-[420px] h-48 p-4 border rounded-lg bg-[#5A2D83] text-[#E7E4E8] ${
              error ? "border-[#E640A3]" : "border-[#5A2D83]"
            } resize-none placeholder-[#A059CF] placeholder focus:bg-[#A059CF] focus:outline-none focus:text-[#E7E4E8] focus:placeholder-[#5A2D83]`}
            placeholder={placeholder}
            value={prompt}
            onChange={(e) => setPrompt(e.currentTarget.value)}
            disabled={loading}
          ></textarea>
          <div
            className={`${
              prompt.length === 0
                ? "text-purple-100"
                : prompt.length < 10 || prompt.length > 300
                ? "text-red-400"
                : "text-purple-400"
            } text-xs block -mt-[22px]
              ml-[365px]
              `}
          >
            {prompt.length}/300
          </div>
          <div className="flex flex-row gap-4 items-center mt-8">
            <button
              type="reset"
              className="p-3 w-[160px] bg-gray-800 text-white rounded-full
                hover:bg-[#5A2D83] hover:text-[#E7E4E8] hover:border-[#E640A3] transition-all"
              onClick={() => {
                setPrompt("");
                setError(null);
              }}
              disabled={loading}
            >
              <EraserIcon size={24} className="inline mr-2" />
              Clean
            </button>
            <button
              className={`p-3 w-[160px] text-white rounded-full transition-all ${
                loading
                  ? "bg-yellow-400"
                  : "bg-purple-500 hover:bg-[#E640A3] hover:text-[#E7E4E8] hover:shadow-yellow-200 hover:border-[#E640A3]"
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <Loader size={24} className="inline mr-2 animate-spin" />
              ) : (
                <Wand2Icon size={24} className="inline mr-2" />
              )}
              {loading ? "Generating" : "Generate"}
            </button>
          </div>
          <div className="text-red-400 mt-4 transition-all">{error}</div>
        </form>
      </div>
    </>
  );
}
