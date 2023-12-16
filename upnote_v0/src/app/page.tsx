"use client";

import { Button } from "@/app/ui/button";
import { Textarea } from "@/app/ui/textarea";
import Link from "next/link";
import { SetStateAction, useCallback, useEffect, useState } from "react";

interface Note {
  id: number;
  title: string;
  content: string;
}

interface Notebook {
  id: number;
  title: string;
  notes: Note[];
}

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export default function Home() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);

  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | null>(
    null
  );
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const addNotebook = () => {
    const newNotebook = { id: Date.now(), title: "New Notebook", notes: [] };
    setNotebooks([...notebooks, newNotebook]);
    saveToLocalStorage([...notebooks, newNotebook]);
  };

  const addNote = () => {
    if (!selectedNotebook) return;
    const newNote = { id: Date.now(), title: "New Note", content: "" };
    const updatedNotebook = {
      ...selectedNotebook,
      notes: [...selectedNotebook.notes, newNote],
    };
    updateNotebook(updatedNotebook);
    setSelectedNotebook(updatedNotebook); // 선택된 노트북 업데이트
    setSelectedNote(newNote); // 새로 추가된 노트 선택
  };

  const deleteNotebook = (notebookId: number) => {
    const updatedNotebooks = notebooks.filter((nb) => nb.id !== notebookId);
    setNotebooks(updatedNotebooks);
    saveToLocalStorage(updatedNotebooks);
  };

  const deleteNote = (noteId: number) => {
    if (!selectedNotebook) return;
    const updatedNotes = selectedNotebook.notes.filter(
      (note) => note.id !== noteId
    );
    const updatedNotebook = { ...selectedNotebook, notes: updatedNotes };
    updateNotebook(updatedNotebook);
  };

  useEffect(() => {
    const savedNotebooks =
      JSON.parse(localStorage.getItem("notebooks") as string) || [];
    if (savedNotebooks) {
      setNotebooks(savedNotebooks);
    }
  }, []);

  const saveToLocalStorage = (notebooks: any[]) => {
    localStorage.setItem("notebooks", JSON.stringify(notebooks));
  };

  const selectNotebook = (notebook: SetStateAction<Notebook | null>) => {
    setSelectedNotebook(notebook);
    setSelectedNote(null); // 노트 선택 초기화
  };

  const selectNote = (note: SetStateAction<Note | null>) => {
    setSelectedNote(note);
  };

  // 노트 내용 변경 핸들러
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (selectedNote && selectedNotebook) {
      // 첫 번째 줄을 제목으로 설정
      const firstLine = newContent.split("\n")[0];
      const updatedNote = {
        ...selectedNote,
        title: firstLine,
        content: newContent,
      };

      // 나머지 로직은 동일하게 유지
      const updatedNotes = selectedNotebook.notes.map((note) =>
        note.id === updatedNote.id ? updatedNote : note
      );
      const updatedNotebook = { ...selectedNotebook, notes: updatedNotes };

      setSelectedNotebook(updatedNotebook);
      setSelectedNote(updatedNote);
      updateNotebook(updatedNotebook);
    }
  };

  // 노트북 업데이트 함수
  const updateNotebook = useCallback(
    (updatedNotebook: Notebook) => {
      setNotebooks((prevNotebooks) =>
        prevNotebooks.map((nb) =>
          nb.id === updatedNotebook.id ? updatedNotebook : nb
        )
      );
      saveToLocalStorage(notebooks);
    },
    [notebooks]
  );

  // 노트북 내 노트 업데이트 및 저장
  const updateNoteInNotebook = useCallback(
    (updatedNote: Note) => {
      if (selectedNotebook) {
        const updatedNotes = selectedNotebook.notes.map((note) =>
          note.id === updatedNote.id ? updatedNote : note
        );
        const updatedNotebook: Notebook = {
          ...selectedNotebook,
          notes: updatedNotes,
        };
        updateNotebook(updatedNotebook);
      }
    },
    [selectedNotebook, updateNotebook]
  );

  const updateNote = (updatedNote: Note) => {
    if (!selectedNotebook || !selectedNote) return;

    const updatedNotes = selectedNotebook.notes.map((note) =>
      note.id === updatedNote.id ? updatedNote : note
    );

    const updatedNotebook: Notebook = {
      ...selectedNotebook,
      notes: updatedNotes,
    };
    updateNotebook(updatedNotebook);
  };

  const shouldUpdateNoteInNotebook = useCallback(
    (note: Note) => selectedNote && note.id === selectedNote.id,
    [selectedNote]
  );

  useEffect(() => {
    if (selectedNote && selectedNotebook) {
      const updatedNotes = selectedNotebook.notes.map((note) =>
        shouldUpdateNoteInNotebook(note) ? { ...selectedNote, ...note } : note
      );

      const updatedNotebook = {
        ...selectedNotebook,
        notes: updatedNotes,
      };
      updateNotebook(updatedNotebook);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNote, selectedNotebook, shouldUpdateNoteInNotebook]);

  const renderNotebooks = () => {
    return notebooks.map((nb) => (
      <li
        key={nb.id}
        onClick={() => selectNotebook(nb)}
        className="flex items-center"
      >
        {nb.title}
        <Button onClick={() => deleteNotebook(nb.id)}>
          <TrashIcon />
        </Button>
      </li>
    ));
  };

  const renderNotes = () => {
    return selectedNotebook ? (
      selectedNotebook.notes.map((note) => (
        <li
          key={note.id}
          onClick={() => selectNote(note)}
          className="flex items-center gap-2 "
        >
          <div className="whitespace-nowrap overflow-hidden text-ellipsis">
            {note.title}
          </div>
          <Button onClick={() => deleteNote(note.id)}>
            {" "}
            <TrashIcon />
          </Button>
        </li>
      ))
    ) : (
      <p>Select a notebook to view notes</p>
    );
  };

  return (
    <div key="1" className="flex min-h-screen w-full lg:flex-row">
      {/* 왼쪽 사이드바 (노트북 목록) */}
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="#">
              <BookOpenIcon className="h-6 w-6" />
              <span>My Notes</span>
            </Link>
            <Button className="ml-auto" onClick={addNotebook}>
              <PlusIcon className="h-6 w-6" />
              <span className="sr-only">New notebook</span>
            </Button>
          </div>
          <div className="overflow-auto py-2">
            <nav className="flex flex-col items-start px-4 text-sm font-medium">
              <ul>{renderNotebooks()}</ul>
            </nav>
          </div>
        </div>
      </div>

      {/* 오른쪽 메인 영역 (노트 목록 및 편집) */}
      <div className="flex flex-col w-full flex-1">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <Button className="rounded-full" onClick={addNote}>
            <PlusIcon className="h-6 w-6" />
            <span className="sr-only">New note</span>
          </Button>
        </header>
        <main className="flex gap-4 p-4 md:gap-8 md:p-6 max-w-full">
          <div className="flex flex-col w-1/3 md:w-1/4">
            <ul>{renderNotes()}</ul>
          </div>
          <div className="flex-1 w-2/3 md:w-3/4">
            {selectedNote && (
              <div className="flex flex-col w-full gap-1.5">
                <Textarea
                  className="w-full dark:bg-gray-800/40"
                  id="note-input"
                  value={selectedNote.content}
                  onChange={handleNoteChange}
                  placeholder="Type your note here."
                />
                <Button onClick={() => updateNote(selectedNote)}>Save</Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function BookOpenIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function PlusIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function TrashIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
