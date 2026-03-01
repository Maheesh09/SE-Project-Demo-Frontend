import AppSidebar from "./AppSidebar";
import LightRays from "./LightRays";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <LightRays
        raysOrigin="top-center"
        raysColor="#b2c59d"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={3}
        followMouse={true}
        mouseInfluence={0.15}
        noiseAmount={0.02}
        distortion={0.1}
        pulsating={true}
        fadeDistance={0.8}
        saturation={1.2}
      />
      <AppSidebar />
      <main className="ml-64 p-8 relative z-10 pointer-events-auto">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
