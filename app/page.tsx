import Landing from "./components/ui/landing/HeroSection";

export default function Home() {
  return (
    <div>
      <div className="flex  flex-row justify-between ">
        <Landing />
      </div>
      <div className=" bg-gray-100">{/* เนื้อหาของคุณ */}</div>
    </div>
  );
}
