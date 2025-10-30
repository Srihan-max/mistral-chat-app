import Chat from "../components/chat";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-purple-500 via-pink-500 to-red-400 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">Mistral Chat</h1>
        <Chat />
      </div>
    </main>
  );
}
