"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { KnowledgeFilters, KnowledgeSort } from "@/features/knowledge-base/types";
import {
  archiveNote,
  createNote,
  deleteAttachment,
  deleteNote,
  duplicateNote,
  filterNotes,
  getNoteAttachments,
  restoreNote,
  searchNotes,
  toggleBookmark,
  toggleFavorite,
  updateNote,
  uploadAttachment,
} from "@/services/knowledge.service";

function notesQueryKey(search: string, sort: KnowledgeSort, currentFolder: string, filters: KnowledgeFilters) {
  return ["knowledge", search, sort, currentFolder, filters] as const;
}

export function useKnowledgeNotes(search: string, sort: KnowledgeSort, currentFolder: string, filters: KnowledgeFilters) {
  return useQuery({
    queryKey: notesQueryKey(search, sort, currentFolder, filters),
    queryFn: async () => {
      if (search.trim()) {
        const searched = await searchNotes(search);
        return searched
          .filter((note) => (filters.archived ? note.is_archived : !note.is_archived))
          .filter((note) => (!filters.bookmarkedOnly ? true : note.is_bookmarked))
          .filter((note) => (!filters.favoriteOnly ? true : note.is_favorite))
          .filter((note) => (!filters.formulaOnly ? true : note.is_formula))
          .filter((note) => (!filters.subject.trim() ? true : (note.subject || "").toLowerCase() === filters.subject.trim().toLowerCase()))
          .filter((note) => (!filters.topic.trim() ? true : (note.topic || "").toLowerCase() === filters.topic.trim().toLowerCase()))
          .filter((note) => (!filters.subtopic.trim() ? true : (note.subtopic || "").toLowerCase() === filters.subtopic.trim().toLowerCase()))
          .filter((note) => (!filters.tag.trim() ? true : note.tags.includes(filters.tag.trim().toLowerCase())))
          .filter((note) => (!currentFolder.trim() ? true : note.folder === currentFolder.trim().toLowerCase()));
      }

      return filterNotes({
        ...filters,
        search,
        sort,
        currentFolder,
      });
    },
  });
}

export function useKnowledgeFolders() {
  return useQuery({
    queryKey: ["knowledge-folders"],
    queryFn: async () => {
      const notes = await filterNotes({
        archived: false,
        bookmarkedOnly: false,
        favoriteOnly: false,
        subject: "",
        topic: "",
        subtopic: "",
        tag: "",
        formulaOnly: false,
        search: "",
        currentFolder: "",
        sort: "updated_desc",
      });

      const counts = new Map<string, number>();
      notes.forEach((note) => {
        if (!note.folder) {
          return;
        }
        counts.set(note.folder, (counts.get(note.folder) || 0) + 1);
      });

      return Array.from(counts.entries())
        .map(([folder, count]) => ({ folder, count }))
        .sort((a, b) => a.folder.localeCompare(b.folder));
    },
  });
}

export function useNoteAttachments(noteId: string | null) {
  return useQuery({
    queryKey: ["knowledge-attachments", noteId],
    queryFn: async () => getNoteAttachments(noteId || ""),
    enabled: Boolean(noteId),
  });
}

export function useKnowledgeMutations(search: string, sort: KnowledgeSort, currentFolder: string, filters: KnowledgeFilters) {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: notesQueryKey(search, sort, currentFolder, filters) });
    await queryClient.invalidateQueries({ queryKey: ["knowledge-folders"] });
  };

  return {
    createNote: useMutation({ mutationFn: createNote, onSuccess: invalidate }),
    updateNote: useMutation({
      mutationFn: ({ noteId, input }: { noteId: string; input: Parameters<typeof updateNote>[1] }) =>
        updateNote(noteId, input),
      onSuccess: invalidate,
    }),
    deleteNote: useMutation({ mutationFn: deleteNote, onSuccess: invalidate }),
    archiveNote: useMutation({ mutationFn: archiveNote, onSuccess: invalidate }),
    restoreNote: useMutation({ mutationFn: restoreNote, onSuccess: invalidate }),
    toggleBookmark: useMutation({ mutationFn: toggleBookmark, onSuccess: invalidate }),
    toggleFavorite: useMutation({ mutationFn: toggleFavorite, onSuccess: invalidate }),
    duplicateNote: useMutation({ mutationFn: duplicateNote, onSuccess: invalidate }),
    uploadAttachment: useMutation({
      mutationFn: ({ noteId, file }: { noteId: string; file: File }) => uploadAttachment(noteId, file),
      onSuccess: async (_result, variables) => {
        await queryClient.invalidateQueries({ queryKey: ["knowledge-attachments", variables.noteId] });
      },
    }),
    deleteAttachment: useMutation({
      mutationFn: ({ attachmentId, noteId }: { attachmentId: string; noteId: string }) =>
        deleteAttachment(attachmentId),
      onSuccess: async (_result, variables) => {
        await queryClient.invalidateQueries({ queryKey: ["knowledge-attachments", variables.noteId] });
      },
    }),
  };
}
