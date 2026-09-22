import type { HTMLAttributes, ReactNode } from 'react';

export type FileExplorerDensity = 'compact' | 'comfortable' | 'spacious';
export type FileExplorerVariant = 'default' | 'muted' | 'outline';
export type FileExplorerView = 'details' | 'grid';
export type FileExplorerItemKind = 'file' | 'folder';
export type FileExplorerSortBy = 'name' | 'modified' | 'size' | 'type';
export type FileExplorerSortDirection = 'asc' | 'desc';

export type FileExplorerItem = {
  children?: FileExplorerItem[];
  description?: ReactNode;
  disabled?: boolean;
  extension?: string;
  icon?: ReactNode;
  id: string;
  kind: FileExplorerItemKind;
  modified?: string;
  name: string;
  size?: string;
  type?: string;
};

export type FileExplorerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'> & {
  ariaLabel?: string;
  defaultSelectedIds?: string[];
  defaultFolderId?: string;
  density?: FileExplorerDensity;
  emptyText?: ReactNode;
  items?: FileExplorerItem[];
  multiSelect?: boolean;
  folderId?: string;
  selectedIds?: string[];
  showFileDetails?: boolean;
  showViewToolbar?: boolean;
  sortBy?: FileExplorerSortBy;
  sortDirection?: FileExplorerSortDirection;
  variant?: FileExplorerVariant;
  view?: FileExplorerView;
  onItemOpen?: (item: FileExplorerItem) => void;
  onFolderChange?: (folderId: string | undefined, folder?: FileExplorerItem) => void;
  onSelectionChange?: (selectedIds: string[], item: FileExplorerItem) => void;
  onSortChange?: (sortBy: FileExplorerSortBy, direction: FileExplorerSortDirection) => void;
  onViewChange?: (view: FileExplorerView) => void;
};
