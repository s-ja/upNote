"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { SetStateAction, useEffect, useState } from "react";

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

export default function Note() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [notes, setNotes] = useState([]);

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

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedNote) {
      setSelectedNote({
        ...selectedNote,
        content: e.target.value,
      });
    }
  };

  const updateNotebook = (updatedNotebook: {
    notes?: any[] | Note[];
    id: any;
    title?: string;
  }) => {
    const updatedNotebooks = notebooks.map((nb) =>
      nb.id === updatedNotebook.id ? updatedNotebook : nb
    );
    setNotebooks(updatedNotebooks as Notebook[]);
    saveToLocalStorage(updatedNotebooks);
  };

  const updateNote = (updatedNote: { id: number }) => {
    if (!selectedNotebook) return;
    const updatedNotes = selectedNotebook.notes.map((note) =>
      note.id === updatedNote.id ? updatedNote : note
    );
    const updatedNotebook = { ...selectedNotebook, notes: updatedNotes };
    updateNotebook(updatedNotebook);
  };

  const renderNotebooks = () => {
    return notebooks.map((nb) => (
      <li key={nb.id} onClick={() => selectNotebook(nb)}>
        {nb.title}
        <Button onClick={() => deleteNotebook(nb.id)}>Delete</Button>
      </li>
    ));
  };

  const renderNotes = () => {
    return selectedNotebook ? (
      selectedNotebook.notes.map((note) => (
        <li key={note.id} onClick={() => selectNote(note)}>
          {note.title}
          <Button onClick={() => deleteNote(note.id)}>Delete</Button>
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
                <Label htmlFor="note-input">{selectedNote.title}</Label>
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
