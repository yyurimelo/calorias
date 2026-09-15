export type DraftImage = {
  id: string;
  file: File;
  url: string;
  name: string;
};

export type AssistantStatus = "thinking" | "streaming" | "done" | "error";

export type ChatMessage =
  | {
      id: string;
      role: "user";
      text: string;
      images: DraftImage[];
    }
  | {
      id: string;
      role: "assistant";
      text: string;
      status: AssistantStatus;
    };
