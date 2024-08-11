import { Loader2 } from "lucide-react";

const AnimatedLoading = () => {
  return (
    <div className="text-[18px] flex flex-col items-center">
      <span className="mb-3 text-[#E7E4E8]">Waiting for payment...</span>
      <Loader2
        size="24"
        className="inline-block animate-spin text-[#5A2D83] transition-all duration-500 ease-in-out"
      />
    </div>
  );
};

export default AnimatedLoading;
