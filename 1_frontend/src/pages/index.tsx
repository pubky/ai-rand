import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import CopyToClipboard from "../../components/copyToClipboard";
import { io } from "socket.io-client";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [invoiceBolt11, setInvoiceBolt11] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<number>(0);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [postUri, setPostUri] = useState<string | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:4241");

    socket.on("connect", () => {
      if (socket.id) {
        setSocketId(socket.id);
      }
    });

    socket.on("generating_image", (data) => {
      setStage(2);
      setProgress(data);
    });

    socket.on("refining_text", (data) => {
      setProgress(data);
    });

    socket.on("publishing_post", (data) => {
      setProgress(data);
    });

    socket.on("done", (data) => {
      setProgress("Done!");
      setPostUri(data);
    });

    return () => {
      socket.off("connect");
      socket.disconnect();
    };
  }, []);

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

    // fetch the API to get the invoice
    const response = await axios.post("http://localhost:4242/new-invoice", {
      prompt,
      websocket_id: socketId,
    });

    if (response) {
      setStage(1);
      setQrCode(response.data.qr_code_png);
      setInvoiceBolt11(response.data.payment_request);
    }

    setLoading(false);
  };

  const handleSubmitStage1 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStage(0);
  };

  if (stage === 0) {
    return (
      <main
        className={`flex min-h-screen flex-col items-center p-24 ${inter.className} text-center`}
      >
        <h1 className="text-6xl font-bold text-purple-400">Ai Rand</h1>
        <p className="text-[22px] mt-8">
          Pay with Lightning to create
          <br />
          AI-generated content
          <br />
          in Pubky Social Network.
        </p>
        <div className="flex flex-col items-center justify-center mt-12">
          <form
            className="flex flex-col items-center"
            onSubmit={handleSubmitStage0}
          >
            <textarea
              className={`w-[420px] h-48 p-4 border rounded-lg text-black bg-purple-100 ${
                error ? "border-red-400 bg-red-100" : "border-gray-300"
              } resize-none`}
              placeholder="Write a prompt..."
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
            <div className="flex flex-row gap-4 items-center mt-6">
              <button
                type="reset"
                className="p-2 px-4 w-[175px] bg-gray-800 text-white rounded-lg"
                onClick={() => {
                  setPrompt("");
                  setError(null);
                }}
                disabled={loading}
              >
                Clear Prompt
              </button>
              <button
                className="p-2 px-4 w-[175px] bg-purple-500 text-white rounded-lg"
                type="submit"
                disabled={loading}
              >
                Generate Content
              </button>
            </div>
            <div className="text-red-400 mt-4 transition-all">{error}</div>
          </form>
        </div>
      </main>
    );
  }

  if (stage === 1) {
    return (
      <main
        className={`flex min-h-screen flex-col items-center p-24 ${inter.className} text-center`}
      >
        <h1 className="text-6xl font-bold text-purple-400">Ai Rand</h1>
        <p className="text-[22px] mt-8">
          As soon as you pay,
          <br />
          it will start generating content.
        </p>
        <div className="flex flex-col items-center justify-center mt-12">
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center">
              {qrCode && (
                <Image
                  alt="qrcode"
                  src={qrCode}
                  width="300"
                  height="300"
                  className="rounded-[10px]"
                />
              )}
              <p className="text-xs mt-4">Scan the QR Code to pay</p>
            </div>
            <div className="flex flex-col gap-4 items-center mt-6">
              {invoiceBolt11 && <CopyToClipboard value={invoiceBolt11} />}
              <button
                type="submit"
                className="p-2 px-4 w-[175px] bg-gray-800 text-white rounded-lg"
                onClick={() => {
                  setStage(0);
                  setPrompt("");
                  setError(null);
                }}
                disabled={loading}
              >
                Back
              </button>
            </div>
            <div className="text-red-400 mt-4 transition-all">{error}</div>
          </div>
        </div>
      </main>
    );
  }

  if (stage === 2) {
    return (
      <main
        className={`flex min-h-screen flex-col items-center p-24 ${inter.className} text-center`}
      >
        <h1 className="text-6xl font-bold text-purple-400">Ai Rand</h1>
        {postUri ? (
          <p className="text-[22px] mt-8">Content created!</p>
        ) : (
          <p className="text-[22px] mt-8">Generating content...</p>
        )}

        <div className="flex flex-col items-center justify-center mt-12">
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center">
              {!postUri && <p className="text-xs mt-4">{progress}</p>}
              <div className="flex flex-row gap-4 items-center mt-6">
                {postUri && (
                  <CopyToClipboard label="Copy post URI" value={postUri} />
                )}
                {postUri && (
                  <a
                    href={postUri}
                    target="_blank"
                    className="p-2 px-4 w-[175px] bg-purple-800 text-white rounded-lg"
                  >
                    View Post
                  </a>
                )}
              </div>
              <div className="mt-12">
                <button
                  type="submit"
                  className="p-2 px-4 w-[175px] bg-gray-800 text-white rounded-lg"
                  onClick={() => {
                    setStage(0);
                    setPrompt("");
                    setError(null);
                  }}
                  disabled={loading}
                >
                  Back
                </button>
              </div>
              <div className="text-red-400 mt-4 transition-all">{error}</div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return <></>;
}
