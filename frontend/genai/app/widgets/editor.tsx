import React, { useEffect, useRef } from "react";
import { EditorView } from "@codemirror/view";
import { markdown } from "@codemirror/lang-markdown";
import { basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark"; // Default Dark Theme

interface EditorProps {
  markdownStr: string;
  setMarkdown: (text: string) => void;
}

const Editor: React.FC<EditorProps> = ({ markdownStr, setMarkdown }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const startState = EditorState.create({
      doc: markdownStr,
      extensions: [
        basicSetup,
        markdown(),
        oneDark,
        EditorView.lineWrapping,
        EditorView.updateListener.of((v) => {
          setMarkdown(v.state.doc.toString());
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => view.destroy();
  }, []);

  useEffect(() => {
    if (viewRef.current) {
      const currentDoc = viewRef.current.state.doc.toString();
      if (currentDoc !== markdownStr) {
        const transaction = viewRef.current.state.update({
          changes: { from: 0, to: currentDoc.length, insert: markdownStr },
        });
        viewRef.current.dispatch(transaction);
      }
    }
  }, [markdownStr]);

  return <div className="h-full w-full" ref={editorRef}></div>;
};

export default Editor;
