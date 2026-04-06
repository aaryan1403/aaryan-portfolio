import {
  Cloud,
  CloudRain,
  CloudSun,
  CloudSunRain,
  MapPin,
  Sun,
} from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/liquid-weather-glass";

export default function DemoOne() {
  return (
    <div
      className="w-full gap-8 rounded-xl p-8 py-16"
      style={{
        background:
          'url("https://images.unsplash.com/photo-1590867286251-8e26d9f255c0?q=80&w=687&auto=format&fit=crop") center / cover no-repeat',
      }}
    >
      <div className="mx-auto grid w-full max-w-xl grid-cols-2 gap-4">
        <LiquidGlassCard
          draggable={false}
          shadowIntensity="xs"
          borderRadius="8px"
          glowIntensity="none"
          className="col-span-2 bg-white/8 p-6 text-white"
        >
          <div className="flex justify-between text-sm font-medium">
            <div className="flex flex-col items-center gap-2">
              <span>16:00</span>
              <Cloud className="h-6 w-6 fill-white" />
              <span>+18°</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span>17:00</span>
              <Cloud className="h-6 w-6 fill-white" />
              <span>+18°</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span>18:00</span>
              <CloudRain className="h-6 w-6" />
              <span>+16°</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span>19:00</span>
              <CloudRain className="h-6 w-6" />
              <span>+14°</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span>20:00</span>
              <CloudSun className="h-6 w-6 fill-white" />
              <span>+15°</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span>21:00</span>
              <CloudSunRain className="h-6 w-6" />
              <span>+14°</span>
            </div>
          </div>
        </LiquidGlassCard>

        <LiquidGlassCard
          draggable={false}
          shadowIntensity="xs"
          borderRadius="8px"
          glowIntensity="none"
          className="flex flex-col items-start justify-center rounded-3xl bg-white/8 p-6 text-white"
        >
          <div className="text-6xl font-semibold">+18°C</div>
          <div className="text-lg">Cloudy +18°/+5°</div>
        </LiquidGlassCard>

        <LiquidGlassCard
          draggable={false}
          shadowIntensity="xs"
          borderRadius="8px"
          glowIntensity="none"
          className="flex flex-col items-start justify-center rounded-3xl bg-white/8 p-6 text-white"
        >
          <div className="text-6xl font-semibold">17:32</div>
          <div className="text-lg">Sun, November 19</div>
          <button className="mt-4 inline-flex items-center gap-1 rounded-full bg-black/10 px-2 py-1 text-sm font-medium backdrop-blur-xl">
            <MapPin className="h-4 w-4" />
            Tbilisi
          </button>
        </LiquidGlassCard>

        <LiquidGlassCard
          draggable={false}
          shadowIntensity="xs"
          borderRadius="8px"
          glowIntensity="none"
          className="col-span-2 flex flex-col gap-4 rounded-3xl bg-white/8 p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="h-6 w-6 fill-white" />
              <span>Tue, 7 Sep</span>
            </div>
            <span className="text-lg">+18°/+4°</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="h-6 w-6 fill-white" />
              <span>Wed, 8 Sep</span>
            </div>
            <span className="text-lg">+20°/+6°</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CloudRain className="h-6 w-6" />
              <span>Thu, 9 Sep</span>
            </div>
            <span className="text-lg">+17°/+3°</span>
          </div>
        </LiquidGlassCard>
      </div>
    </div>
  );
}
