import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

import Step0 from "@/components/steps/step0";
import Step1 from "@/components/steps/step1";
import Step2 from "@/components/steps/step2";
import Header from "@/components/common/header";
import Main from "@/components/common/main";
import ConfettiExplosion from "@/components/common/confetti";

export default function Home() {
  const [stage, setStage] = useState<number>(0);
  const [prevStage, setPrevStage] = useState<number>(0);
  const [direction, setDirection] = useState("right");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [invoiceBolt11, setInvoiceBolt11] = useState<string | null>(null);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [postUri, setPostUri] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [runConfetti, setRunConfetti] = useState(false);
  const [progressStates, setProgressStates] = useState<number>(0);

  useEffect(() => {
    if (prevStage > stage) {
      setDirection("right");
    } else {
      setDirection("left");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  useEffect(() => {
    const socket = io("https://ai-rand-backend.miguelmedeiros.dev");

    socket.on("connect", () => {
      if (socket.id) {
        setSocketId(socket.id);
      }
    });

    socket.on("generating_image", () => {
      setPostUri(null);
      setQrCode(null);
      setInvoiceBolt11(null);
      setPrevStage(1);
      setStage(2);
      setProgressStates(0);
    });

    socket.on("refining_text", () => {
      setProgressStates(1);
    });

    socket.on("creating_tags", () => {
      setProgressStates(2);
    });

    socket.on("uploading_image", () => {
      setProgressStates(3);
    });

    socket.on("publishing_post", () => {
      setProgressStates(4);
    });

    socket.on("done", (data) => {
      setProgressStates(5);

      let url = "https://mvp-001.nuh.dev/post/";

      url += data.replace("pubky:", "").replace("/pubky.app/posts/", "/");

      setPostUri(url);
      setPrompt("");
      setRunConfetti(true);
      setTimeout(() => {
        setRunConfetti(false);
      }, 15000);
    });

    return () => {
      socket.off("connect");
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {runConfetti && <ConfettiExplosion />}
      <Main>
        <Header />
        <StepWrapper currentStage={0} stage={stage} direction={direction}>
          <Step0
            prompt={prompt}
            setPrompt={setPrompt}
            setInvoiceBolt11={setInvoiceBolt11}
            setQrCode={setQrCode}
            setStage={setStage}
            setPrevStage={setPrevStage}
            socketId={socketId}
          />
        </StepWrapper>
        <StepWrapper currentStage={1} stage={stage} direction={direction}>
          <Step1
            setStage={setStage}
            setPrevStage={setPrevStage}
            qrCode={qrCode}
            invoiceBolt11={invoiceBolt11}
          />
        </StepWrapper>
        <StepWrapper currentStage={2} stage={stage} direction={direction}>
          <Step2
            postUri={postUri}
            setStage={setStage}
            setPrevStage={setPrevStage}
            progressStates={progressStates}
          />
        </StepWrapper>
      </Main>
    </>
  );
}

// esumo das Cores:
// Erro:

// Fundo: #E640A3
// Texto: #FFD700
// Borda: #5A2D83
// Acerto:

// Fundo: #A059CF
// Texto: #E7E4E8

const StepWrapper = ({
  stage,
  currentStage,
  direction,
  children,
}: {
  stage: number;
  currentStage: number;
  direction: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`transition-all overflow-hidden duration-500 ease-in-out transform ${
        stage === currentStage
          ? "translate-x-0 opacity-100 h-auto"
          : direction === "right"
          ? "-translate-x-full opacity-0 h-0"
          : "translate-x-full opacity-0 h-0"
      }`}
    >
      {children}
    </div>
  );
};
