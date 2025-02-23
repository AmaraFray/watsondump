"use client"
import React, { useState } from "react";
import Editor from "../widgets/editor";
import Slides from "../widgets/slide";
import {
  Presentation
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Assistant } from "../assistant";

const SlideGenPage = () => {
  const [markdown, setMarkdown] = useState(
    "# Welcome\n\n---\n\n## Slide 2\n\n\n\n\n\n\n"
  );
  const [isChatExpanded, setIsChatExpanded] = useState(true);

  return (
    <div className="flex h-screen bg-background">
      {/* <SideBar/> */}
      <div className="max-w-[30rem] border-r border-border transition-all duration-300 ease-in-out">
        <Assistant setMarkdown={setMarkdown} />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-hidden p-6 bg-background">
          <div className="flex items-center gap-2 mb-4">
            <Presentation className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-white">Presentation</h2>
          </div>
          {/* <AspectRatio ratio={960 / 700}> */}
          <Card className="rounded-lg shadow-lg h-[calc(100%-2rem)] flex items-center justify-center overflow-hidden">
            <Slides markdown={markdown} />
          </Card>
          {/* </AspectRatio> */}
        </div>

        <div className="border-border transition-all duration-300 ease-in-out h-64">
          <div className="flex-1 p-6 bg-background h-full">
            <Card className="bg-black rounded-lg shadow-lg h-full border-border flex overflow-hidden">
            <div className="flex-1 h-full overflow-x-auto overflow-y-auto break-words min-w-0">
              <Editor markdownStr={markdown} setMarkdown={setMarkdown} />
            </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};


export default SlideGenPage;