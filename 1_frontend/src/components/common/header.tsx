import Image from "next/image";

export default function Header() {
  return (
    <div className="flex flex-col items-center">
      <Image
        src="/ai-rand.png"
        alt="Ai Rand"
        width="1024"
        height="1024"
        className="w-40 h-40"
      />
      <h1 className="text-[80px] text-purple-400">
        <span className="font-bold">Ai</span>{" "}
        <span className="text-[#E7E4E8] font-bold">Rand</span>
      </h1>
    </div>
  );
}
