import type { HTMLAttributes, ReactNode } from 'react';

export type MessageChatMode = 'direct' | 'group';
export type MessageChatDensity = 'compact' | 'comfortable' | 'spacious';
export type MessageChatVariant = 'default' | 'muted' | 'outline';
export type MessageChatPresence = 'online' | 'away' | 'offline';
export type MessageChatDelivery = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export type MessageChatParticipant = {
  avatar?: ReactNode;
  id: string;
  name: ReactNode;
  presence?: MessageChatPresence;
  subtitle?: ReactNode;
};

export type MessageChatReaction = {
  count?: number;
  emoji: ReactNode;
  reacted?: boolean;
};

export type MessageChatAttachment = {
  /** The browser file, available for upload handling when a user drops an attachment. */
  file?: File;
  id: string;
  name: string;
  size?: number;
  type?: string;
};

export type MessageChatAttachmentSearchItem = MessageChatAttachment & {
  /** Plain-text context used when users search available attachments. */
  description?: string;
};

export type MessageChatCommand = {
  description?: ReactNode;
  id: string;
  label: string;
};

export type MessageChatCompanyReferenceItem = {
  description?: string;
  id: string;
  label: string;
  sourceId: string;
};

export type MessageChatCommandReference = {
  id: string;
  items?: MessageChatCompanyReferenceItem[];
  label: string;
  sourceId?: string;
};

export type MessageChatCommandSelection = {
  insertReference: (reference: MessageChatCommandReference) => void;
  removeCommand: () => void;
};

export type MessageChatReference = {
  attachmentId?: string;
  companyItems?: MessageChatCompanyReferenceItem[];
  id: string;
  kind: 'participant' | 'attachment' | 'command' | 'company';
  label: string;
  sourceId?: string;
  textOffset: number;
};

export type MessageChatMessage = {
  attachments?: MessageChatAttachment[];
  authorId: string;
  body: ReactNode;
  delivery?: MessageChatDelivery;
  id: string;
  reactions?: MessageChatReaction[];
  /** Optional application-provided preview shown as a standalone message card. */
  referenceCard?: ReactNode;
  references?: MessageChatReference[];
  timestamp?: ReactNode;
};

export type MessageChatProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> & {
  attachmentSearchItems?: MessageChatAttachmentSearchItem[];
  commands?: MessageChatCommand[];
  composerAriaLabel?: string;
  composerPlaceholder?: string;
  currentUserId?: string;
  density?: MessageChatDensity;
  description?: ReactNode;
  disabled?: boolean;
  draft?: string;
  enableCommands?: boolean;
  enableFileDrop?: boolean;
  enableMentions?: boolean;
  emptyText?: ReactNode;
  messages?: MessageChatMessage[];
  mode?: MessageChatMode;
  participants?: MessageChatParticipant[];
  readOnly?: boolean;
  showComposer?: boolean;
  showAttachmentOpenAction?: boolean;
  showAttachmentSearch?: boolean;
  showEmojiPicker?: boolean;
  showParticipants?: boolean;
  title?: ReactNode;
  typingParticipantId?: string;
  variant?: MessageChatVariant;
  onDraftChange?: (draft: string) => void;
  /** Called when the chat header is selected. */
  onHeaderClick?: () => void;
  /** Called when a group chat header is selected. */
  onGroupHeaderClick?: () => void;
  onCommandSelect?: (command: MessageChatCommand, selection: MessageChatCommandSelection) => void;
  /** Requests that the parent application open a company-data reference from a rendered message. */
  onReferenceClick?: (reference: MessageChatReference, message: MessageChatMessage) => void;
  /** Requests that the parent application open an attachment; this component never opens files itself. */
  onAttachmentOpen?: (attachment: MessageChatAttachment, message: MessageChatMessage) => void;
  /** Receives the message text and any files queued through the composer drop zone. */
  onSend?: (draft: string, attachments: MessageChatAttachment[], references: MessageChatReference[]) => void;
};
