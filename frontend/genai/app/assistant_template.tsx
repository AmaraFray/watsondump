"use client";

import { AssistantRuntimeProvider, ChatModelAdapter, ChatModelRunOptions, useLocalRuntime } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";

import {
  CompositeAttachmentAdapter,
  SimpleImageAttachmentAdapter,
  SimpleTextAttachmentAdapter,
} from "@assistant-ui/react";
import { Atom } from "lucide-react";
import { generateTemplatePPT } from "./api/useChat";

interface AssistantProps {
  setMarkdown: (text: string) => void;
}

export const AssistantAlt: React.FC<AssistantProps> = ({ setMarkdown }) => {
  const runtime = useLocalRuntime({
    run: async ({ messages, abortSignal }) => {
      console.log(messages);

      const messageMap: Array<{ role: string; content: string }> = [];
      for (const message of messages) {
        if (message.content[0].type === 'text') {
          messageMap.push({
            role: message.role,
            content: message.content[0].text,
          });
        }

        if (message.attachments) {
          for (const attachment of message.attachments) {
            if (attachment.type === 'document') {
              messageMap.push({
                role: message.role,
                content: attachment.content[0].type === 'text' ? attachment.content[0].text : '',
              });
            }
          }
        }
      }

      const a = await generateTemplatePPT(messageMap);
      if (a.includes('# End')) {
        setMarkdown(a);
      }
      return {
        content: [
          {
            type: 'text',
            text: a,
          },
        ],
      };
    },
  },
  {
    adapters: {
      attachments: new CompositeAttachmentAdapter([
        new SimpleImageAttachmentAdapter(),
        new SimpleTextAttachmentAdapter(),
      ]),
    },
});

  // const runtime = useChatRuntime({
  //   api: "/api/chat",
  // });

  return (
    <div className="flex flex-col h-screen w-[30rem] bg-background">
    <div className="flex items-center gap-3 border-b px-6 py-4">
        <div className="flex items-center justify-center">
          <Atom className="h-6 w-6 text-primary animate-pulse" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">Genie</h1>
          <p className="text-sm text-muted-foreground">If Genesis had a sister, she'd go insane</p>
        </div>
      </div>
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="grid h-full grid-cols-1 gap-x-2 px-4 py-4 text-muted-foreground overflow-y-auto">
        <Thread />
      </div>
    </AssistantRuntimeProvider>
    </div>
  );
};
