import React, { useEffect } from "react";
import { $getRoot, $createTextNode, $createParagraphNode } from "lexical";
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

export default function Editor({
  initialContent,
  onContentChange,
}: {
  initialContent: string;
  onContentChange: Function;
}) {
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
          onChange={(editor) => {
            const content = editor.read(() => {
              const root = $getRoot();
              return root.getTextContent();
            });
            onContentChange(content);
          }}
        />
        <EditorContent initialContent={initialContent} />
      </div>
    </LexicalComposer>
  );
}

function EditorContent({ initialContent }: { initialContent: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      const root = $getRoot();

      // 루트 노드에 이미 컨텐츠가 있는지 확인
      if (root.isEmpty()) {
        root.clear();

        // 단락 노드를 생성하고 텍스트 노드를 포함시킴
        const paragraphNode = $createParagraphNode();
        paragraphNode.append($createTextNode(initialContent || ""));

        // 단락 노드를 루트 노드에 추가
        root.append(paragraphNode);
      }
    });
  }, [editor]); // initialContent를 의존성 배열에서 제거

  return null;
}

function Placeholder() {
  return <div className="editor-placeholder">Enter some plain text...</div>;
}
