import Image from "next/image";
import { requestProvider } from "webln";
import CopyToClipboard from "../common/copyToClipboard";
import AnimatedLoading from "../common/loading";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function Step1({
  setStage,
  setPrevStage,
  qrCode,
  invoiceBolt11,
}: {
  setStage: React.Dispatch<React.SetStateAction<number>>;
  setPrevStage: React.Dispatch<React.SetStateAction<number>>;
  qrCode: string | null;
  invoiceBolt11: string | null;
}) {
  const initWebLN = async () => {
    try {
      if (!invoiceBolt11) return;

      const webln = await requestProvider();
      webln.enable();
      webln.sendPayment(invoiceBolt11);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    initWebLN();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceBolt11]);

  return (
    <>
      <AnimatedLoading />
      <div className="flex flex-col items-center justify-center mt-6">
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
          <div className="flex flex-row gap-4 items-center mt-6">
            <button
              className="p-3 w-[110px] bg-gray-800 text-white rounded-full
              hover:bg-[#5A2D83] hover:text-[#E7E4E8] hover:border-[#E640A3] transition-all"
              onClick={() => {
                setPrevStage(1);
                setStage(0);
              }}
            >
              <ArrowLeft className="inline mr-2 h-4 w-4" />
              Back
            </button>
            {invoiceBolt11 && <CopyToClipboard value={invoiceBolt11} />}
          </div>
        </div>
      </div>
    </>
  );
}
