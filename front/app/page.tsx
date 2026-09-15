import { Background } from "@/components/background";
import { Chat } from "@/components/chat/chat";

export default function Home() {
  return (
    <main className="relative flex h-dvh flex-col overflow-hidden">
      <Background />
      <Chat />
    </main>
  );
}
