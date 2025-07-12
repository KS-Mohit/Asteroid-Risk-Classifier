import AsteroidForm from "@/components/AsteroidForm";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-8">
        🚀 Asteroid Risk Classifier
      </h1>
      <AsteroidForm />
    </main>
  );
}
