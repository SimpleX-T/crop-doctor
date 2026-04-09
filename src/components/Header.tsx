import { Sprout } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-farm-green text-white py-6 px-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-full">
          <Sprout size={32} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-serif">CropDoctor 🌿</h1>
          <p className="text-farm-earth/80 text-sm font-sans">Your trusted village agronomist</p>
        </div>
      </div>
    </header>
  );
}
