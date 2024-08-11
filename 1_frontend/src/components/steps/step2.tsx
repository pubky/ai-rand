import {
  ArrowLeft,
  CheckCircle,
  Circle,
  Loader,
  SquareArrowOutUpRight,
} from "lucide-react";
import CopyToClipboard from "../common/copyToClipboard";

export default function Step2({
  postUri,
  progressStates,
  setStage,
  setPrevStage,
}: {
  postUri: string | null;
  progressStates: number;
  setStage: React.Dispatch<React.SetStateAction<number>>;
  setPrevStage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const steps = [
    "Generating Image",
    "Refining Text",
    "Creating Tags",
    "Uploading Image",
    "Publishing Post",
    "Done! 🎉",
  ];

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-4 items-start">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-2">
              {progressStates === index && index !== 5 && (
                <Loader className="inline h-6 w-6 text-green-500 mr-2 mb-1 animate-spin" />
              )}
              {progressStates === index && index === 5 && (
                <CheckCircle className="inline h-6 w-6 text-green-500 mr-2 mb-1" />
              )}

              {progressStates > index && (
                <CheckCircle className="inline h-6 w-6 text-green-500 mr-2 mb-1" />
              )}
              {progressStates < index && (
                <Circle className="inline h-6 w-6 text-gray-500 mr-2 mb-1" />
              )}
              <span
                className={`text-lg font-bold ${
                  progressStates > index
                    ? "text-gray-400 line-through"
                    : progressStates === index
                    ? "text-[#E7E4E8]"
                    : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-row gap-4 items-center mt-10">
          {postUri && (
            <a
              href={postUri}
              target="_blank"
              className={`p-3 w-[300px] text-white rounded-full transition-all bg-[#E640A3] hover:bg-[#5A2D83] hover:text-[#E7E4E8] hover:shadow-yellow-200 hover:border-[#E640A3]`}
            >
              <SquareArrowOutUpRight className="inline mr-2 h-4 w-4" />
              View Post
            </a>
          )}
        </div>
        <div className="flex flex-row gap-4 items-center mt-6">
          <button
            type="submit"
            className="p-3 w-[110px] bg-gray-800 text-white rounded-full
              hover:bg-[#5A2D83] hover:text-[#E7E4E8] hover:border-[#E640A3] transition-all"
            onClick={() => {
              setPrevStage(2);
              setStage(0);
            }}
          >
            <ArrowLeft className="inline mr-2 h-4 w-4" />
            Back
          </button>
          {postUri && <CopyToClipboard label="Copy URL" value={postUri} />}
        </div>
      </div>
    </div>
  );
}
