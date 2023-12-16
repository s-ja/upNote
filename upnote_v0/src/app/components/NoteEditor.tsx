import React, { useEffect } from "react";
import { $getRoot, $createTextNode } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

const exampleTheme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "editor-placeholder",
  paragraph: "editor-paragraph",
};

const editorConfig = {
  theme: exampleTheme,
  onError(error: any) {
    throw error;
  },
  namespace: "editor",
};

export default function Editor({ initialContent, onContentChange }: { initialContent: string, onContentChange: Function }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      // 에디터의 초기 내용 설정
      const root = $getRoot();
      const textNode = $createTextNode(initialContent);
      root.clear().append(textNode);
    });
  }, [editor, initialContent]);

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container w-full dark:bg-gray-800/40">
        <PlainTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin
          onChange={() => {
            editor.getEditorState().read(() => {
              // 에디터의 현재 내용을 가져오기
              const root = $getRoot();
              const currentContent = root.getTextContent();
              onContentChange(currentContent);
            });
          }}
        />
      </div>
    </LexicalComposer>
  );
}

function Placeholder() {
  return <div className="editor-placeholder">Enter some plain text...</div>;
}
