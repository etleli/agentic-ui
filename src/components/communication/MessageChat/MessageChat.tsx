import { ExternalLink, File, Paperclip, Search, Send, Smile, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type CSSProperties, type DragEvent as ReactDragEvent, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';
import { Button } from '../../inputs/Button';
import { TextInput } from '../../inputs/TextInput';
import { Modal } from '../../overlays/Modal';
import { getThemeGeneratedColorForKey } from '../../../theme/categoricalColors';
import './MessageChat.css';
import type {
  MessageChatDelivery,
  MessageChatAttachment,
  MessageChatCommand,
  MessageChatCompanyReferenceItem,
  MessageChatCommandReference,
  MessageChatMessage,
  MessageChatParticipant,
  MessageChatProps,
  MessageChatReference,
} from './MessageChat.types';

const DEFAULT_CHAT_COMMANDS: MessageChatCommand[] = [];

type ComposerTrigger = {
  query: string;
  symbol: '@' | '/';
  textLength: number;
};

type ComposerSuggestion =
  | { attachment: MessageChatAttachment; description?: ReactNode; id: string; kind: 'attachment'; label: string }
  | { command: MessageChatCommand; description?: ReactNode; id: string; kind: 'command'; label: string }
  | { participant: MessageChatParticipant; description?: ReactNode; id: string; kind: 'participant'; label: string };

type ComposerTokenKind = ComposerSuggestion['kind'] | 'company';

function getMessageChatClassName(className: MessageChatProps['className']) {
  return ['message-chat', className].filter(Boolean).join(' ');
}

function getParticipantName(participant: MessageChatParticipant | undefined) {
  return typeof participant?.name === 'string' ? participant.name : 'Unknown participant';
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function getDeliveryLabel(delivery: MessageChatDelivery | undefined) {
  if (delivery === 'read') return 'Read';
  if (delivery === 'delivered') return 'Delivered';
  if (delivery === 'sent') return 'Sent';
  if (delivery === 'sending') return 'Sending';
  if (delivery === 'failed') return 'Failed';
  return undefined;
}

function formatFileSize(size: number | undefined) {
  if (size === undefined || size <= 0) return undefined;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 102.4) / 10} KB`;
  return `${Math.round(size / (1024 * 102.4)) / 10} MB`;
}

function getAttachmentId(file: File) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`;
}

function getComposerTokenId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `reference-${Math.random().toString(36).slice(2)}`;
}

function getAttachmentReferenceId(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return undefined;
  return target.closest<HTMLElement>('[data-attachment-reference-id]')?.dataset.attachmentReferenceId;
}

function getTextPositionAtOffset(root: HTMLElement, textOffset: number) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let currentOffset = 0;
  let node = walker.nextNode();

  while (node) {
    const textNode = node as Text;
    const nextOffset = currentOffset + textNode.data.length;
    if (textOffset <= nextOffset) return { node: textNode, offset: textOffset - currentOffset };
    currentOffset = nextOffset;
    node = walker.nextNode();
  }

  return undefined;
}

function getComposerTrigger(root: HTMLElement): ComposerTrigger | undefined {
  const selection = window.getSelection();
  if (!selection?.rangeCount) return undefined;

  const selectionRange = selection.getRangeAt(0);
  if (!root.contains(selectionRange.commonAncestorContainer)) return undefined;

  const beforeSelection = selectionRange.cloneRange();
  beforeSelection.selectNodeContents(root);
  beforeSelection.setEnd(selectionRange.startContainer, selectionRange.startOffset);
  const match = beforeSelection.toString().match(/(?:^|\s)([@/])([^\s@/]*)$/);
  if (!match || (match[1] !== '@' && match[1] !== '/')) return undefined;

  return {
    query: match[2],
    symbol: match[1],
    textLength: match[1].length + match[2].length,
  };
}

function ParticipantAvatar({ participant, size = 'regular' }: { participant: MessageChatParticipant; size?: 'regular' | 'small' }) {
  const name = getParticipantName(participant);
  const avatarStyle = {
    '--message-chat-avatar-color': getThemeGeneratedColorForKey(participant.id),
  } as CSSProperties;

  return (
    <span className="message-chat__avatar" data-presence={participant.presence ?? 'offline'} data-size={size} style={avatarStyle} title={name}>
      {participant.avatar ?? getInitials(name)}
    </span>
  );
}

function MessageReactions({ reactions }: { reactions: MessageChatMessage['reactions'] }) {
  if (!reactions?.length) return null;

  return (
    <span className="message-chat__reactions" aria-label="Message reactions">
      {reactions.map((reaction, index) => (
        <span className="message-chat__reaction" data-reacted={reaction.reacted ? 'true' : undefined} key={`${String(reaction.emoji)}-${index}`}>
          {reaction.emoji}
          {reaction.count && reaction.count > 1 ? <span>{reaction.count}</span> : null}
        </span>
      ))}
    </span>
  );
}

const EMOJI_CATEGORIES = [
  { id: 'smileys', icon: '☺', label: 'Smileys', emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😍', '🥰', '😘', '😎', '🤓', '🥳', '🤔', '🫡', '🤝', '😮', '😢', '😭', '😤', '😡', '🤯', '😴', '🙄'] },
  { id: 'gestures', icon: '👍', label: 'Gestures', emojis: ['👍', '👎', '👏', '🙌', '🫶', '🤝', '🙏', '💪', '👌', '✌️', '🤞', '🤟', '🤘', '👋', '🫡', '🤙', '👀', '🧠', '💯', '🔥'] },
  { id: 'symbols', icon: '♥', label: 'Symbols', emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💔', '❣️', '✨', '⭐', '💥', '💫', '✅', '❌', '⚠️', '❗', '❓', '💤'] },
  { id: 'objects', icon: '💡', label: 'Objects', emojis: ['🎯', '🚀', '📈', '📉', '💰', '💵', '💳', '💼', '📊', '📝', '📌', '📎', '💡', '🔔', '🔒', '🔑', '⚙️', '🛠️', '⌛', '🕒'] },
  { id: 'food', icon: '🍕', label: 'Food', emojis: ['☕', '🍵', '🥤', '🍕', '🍔', '🍣', '🍜', '🥗', '🍎', '🍓', '🍰', '🍪', '🍻', '🥂', '🍾'] },
  { id: 'animals', icon: '🐶', label: 'Animals', emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐼', '🐻', '🐨', '🦁', '🐯', '🐸', '🐵', '🦄', '🐝'] },
  { id: 'travel', icon: '✈', label: 'Travel', emojis: ['🚗', '🚕', '🚌', '🚆', '✈️', '🚀', '🛳️', '🏠', '🏢', '🏖️', '🏔️', '🌍', '🗺️', '⛱️', '🎡'] },
  { id: 'activity', icon: '⚽', label: 'Activities', emojis: ['⚽', '🏀', '🏆', '🥇', '🎮', '🎲', '🎵', '🎸', '🎨', '🎬', '📷', '🎉', '🎊', '🎁', '🧩'] },
] as const;

type EmojiCategoryId = 'recent' | (typeof EMOJI_CATEGORIES)[number]['id'];
const DEFAULT_RECENT_EMOJIS = ['😀', '👍', '❤️', '😂', '🎯', '✅', '🚀', '👀'];
const EMOJI_KEYWORDS: Record<string, string> = {
  '❤️': 'heart love red', '👍': 'thumbs up like yes', '👎': 'thumbs down no', '😀': 'happy smile grin', '😂': 'laugh tears funny',
  '😭': 'cry sad tears', '🔥': 'fire hot', '✅': 'check done success', '❌': 'cross no failed', '⚠️': 'warning alert',
  '🎯': 'target goal', '🚀': 'rocket launch', '📈': 'chart growth up', '📉': 'chart down decline', '💰': 'money cash',
  '👀': 'eyes look see', '💡': 'idea light', '🎉': 'party celebrate', '☕': 'coffee drink', '🤝': 'handshake agree',
};

export function MessageChat({
  attachmentSearchItems = [],
  className,
  commands = DEFAULT_CHAT_COMMANDS,
  composerAriaLabel = 'Message draft',
  composerPlaceholder = 'Write a message…',
  currentUserId,
  density = 'comfortable',
  description,
  disabled = false,
  draft,
  enableCommands = true,
  enableFileDrop = true,
  enableMentions = true,
  emptyText = 'No messages yet.',
  messages = [],
  mode = 'direct',
  participants = [],
  readOnly = false,
  showComposer = true,
  showAttachmentOpenAction = true,
  showAttachmentSearch = attachmentSearchItems.length > 0,
  showEmojiPicker = true,
  showParticipants = true,
  title,
  typingParticipantId,
  variant = 'default',
  onAttachmentOpen,
  onDraftChange,
  onHeaderClick,
  onGroupHeaderClick,
  onCommandSelect,
  onReferenceClick,
  onSend,
  ...chatProps
}: MessageChatProps) {
  const [, setUncontrolledDraft] = useState('');
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [emojiCategory, setEmojiCategory] = useState<EmojiCategoryId>('recent');
  const [emojiQuery, setEmojiQuery] = useState('');
  const [attachmentSearchOpen, setAttachmentSearchOpen] = useState(false);
  const [attachmentSearchQuery, setAttachmentSearchQuery] = useState('');
  const [selectedSearchAttachmentIds, setSelectedSearchAttachmentIds] = useState<string[]>([]);
  const [recentEmojis, setRecentEmojis] = useState(DEFAULT_RECENT_EMOJIS);
  const [animatedMessageIds, setAnimatedMessageIds] = useState<Set<string>>(() => new Set());
  const [pendingAttachments, setPendingAttachments] = useState<MessageChatAttachment[]>([]);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [hoveredAttachmentId, setHoveredAttachmentId] = useState<string>();
  const [composerTrigger, setComposerTrigger] = useState<ComposerTrigger>();
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const messagesRef = useRef<HTMLDivElement>(null);
  const composerEditorRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const emojiControlRef = useRef<HTMLDivElement>(null);
  const emojiSearchRef = useRef<HTMLInputElement>(null);
  const knownMessageIdsRef = useRef(new Set(messages.map((message) => message.id)));
  const isGroup = mode === 'group';
  const directParticipant = participants.find((participant) => participant.id !== currentUserId) ?? participants[0];
  const typingParticipant = participants.find((participant) => participant.id === typingParticipantId);
  const composerSuggestions = useMemo<ComposerSuggestion[]>(() => {
    if (!composerTrigger) return [];

    const query = composerTrigger.query.trim().toLocaleLowerCase();
    const matchesQuery = (...values: Array<ReactNode | undefined>) => values.some((value) => String(value ?? '').toLocaleLowerCase().includes(query));

    if (composerTrigger.symbol === '@') {
      const participantSuggestions = participants
        .filter((participant) => matchesQuery(getParticipantName(participant), participant.subtitle))
        .map((participant) => ({
          description: participant.subtitle,
          id: `participant-${participant.id}`,
          kind: 'participant' as const,
          label: getParticipantName(participant),
          participant,
        }));
      const attachmentSuggestions = pendingAttachments
        .filter((attachment) => matchesQuery(attachment.name, attachment.type))
        .map((attachment) => ({
          attachment,
          description: formatFileSize(attachment.size) ?? attachment.type,
          id: `attachment-${attachment.id}`,
          kind: 'attachment' as const,
          label: attachment.name,
        }));

      return [...participantSuggestions, ...attachmentSuggestions];
    }

    return commands
      .filter((command) => matchesQuery(command.label, command.description))
      .map((command) => ({
        command,
        description: command.description,
        id: `command-${command.id}`,
        kind: 'command' as const,
        label: command.label,
      }));
  }, [commands, composerTrigger, participants, pendingAttachments]);
  const visibleEmojis = useMemo(() => {
    const normalizedQuery = emojiQuery.trim().toLocaleLowerCase();

    if (normalizedQuery) {
      return EMOJI_CATEGORIES
        .filter((category) => category.label.toLocaleLowerCase().includes(normalizedQuery) || category.emojis.some((emoji) => (EMOJI_KEYWORDS[emoji] ?? '').includes(normalizedQuery)))
        .flatMap((category) => category.emojis);
    }

    if (emojiCategory === 'recent') return recentEmojis;
    return EMOJI_CATEGORIES.find((category) => category.id === emojiCategory)?.emojis ?? [];
  }, [emojiCategory, emojiQuery, recentEmojis]);
  const attachmentSearchResults = attachmentSearchItems.filter((attachment) => {
    const query = attachmentSearchQuery.trim().toLocaleLowerCase();
    return !query || [attachment.name, attachment.description, attachment.type].some((value) => value?.toLocaleLowerCase().includes(query));
  });
  const headerTitle = title ?? (isGroup ? 'Group chat' : getParticipantName(directParticipant));
  const headerDescription = description ?? (isGroup ? `${participants.length} members` : directParticipant?.subtitle);

  function updateDraft(nextDraft: string) {
    if (draft === undefined) setUncontrolledDraft(nextDraft);
    onDraftChange?.(nextDraft);
  }

  function getComposerText() {
    return composerEditorRef.current?.textContent ?? '';
  }

  function syncComposerDraft() {
    updateDraft(getComposerText());
  }

  function refreshComposerTrigger() {
    const editor = composerEditorRef.current;
    const nextTrigger = editor ? getComposerTrigger(editor) : undefined;
    setComposerTrigger(nextTrigger && ((nextTrigger.symbol === '@' && enableMentions) || (nextTrigger.symbol === '/' && enableCommands)) ? nextTrigger : undefined);
    setActiveSuggestionIndex(0);
  }

  function placeComposerCaretAfter(node: Node) {
    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    range.setStartAfter(node);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function getComposerInsertionRange() {
    const editor = composerEditorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection?.rangeCount) return undefined;

    const range = selection.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) return undefined;
    return range;
  }

  function insertTextAtComposerSelection(text: string) {
    const editor = composerEditorRef.current;
    if (!editor) return;

    const range = getComposerInsertionRange() ?? document.createRange();
    if (!range.commonAncestorContainer.parentNode) range.selectNodeContents(editor);
    if (!getComposerInsertionRange()) range.collapse(false);

    range.deleteContents();
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    placeComposerCaretAfter(textNode);
    syncComposerDraft();
    refreshComposerTrigger();
  }

  function createComposerToken({ attachmentId, kind, label, sourceId }: { attachmentId?: string; kind: ComposerTokenKind; label: string; sourceId?: string }) {
    const token = document.createElement('span');
    const tokenKindLabel = kind === 'command' ? 'Command' : kind === 'participant' ? 'Person reference' : kind === 'company' ? 'Company reference' : 'Attachment reference';

    token.className = 'message-chat__composer-token';
    token.contentEditable = 'false';
    token.dataset.composerTokenId = getComposerTokenId();
    token.dataset.composerTokenKind = kind;
    if (attachmentId) token.dataset.attachmentReferenceId = attachmentId;
    if (sourceId) token.dataset.composerTokenSourceId = sourceId;
    token.setAttribute('aria-label', tokenKindLabel + ': ' + label);
    token.setAttribute('role', 'note');
    token.textContent = label;
    return token;
  }

  function getCompanyReferenceItems(token: HTMLElement): MessageChatCompanyReferenceItem[] | undefined {
    const serializedItems = token.dataset.companyReferenceItems;

    if (!serializedItems) return undefined;

    try {
      const parsedItems: unknown = JSON.parse(serializedItems);
      if (!Array.isArray(parsedItems)) return undefined;

      const items = parsedItems.flatMap((item) => {
        if (
          !item
          || typeof item !== 'object'
          || !('id' in item)
          || !('label' in item)
          || !('sourceId' in item)
          || typeof item.id !== 'string'
          || typeof item.label !== 'string'
          || typeof item.sourceId !== 'string'
        ) {
          return [];
        }

        return [{
          description: 'description' in item && typeof item.description === 'string' ? item.description : undefined,
          id: item.id,
          label: item.label,
          sourceId: item.sourceId,
        }];
      });

      return items.length ? items : undefined;
    } catch {
      return undefined;
    }
  }

  function replaceComposerCommandTokenWithReference(token: HTMLElement, reference: MessageChatCommandReference) {
    if (!token.isConnected) return;

    token.dataset.composerTokenKind = 'company';
    token.dataset.composerTokenSourceId = reference.sourceId ?? reference.items?.[0]?.sourceId ?? reference.id;
    if (reference.items?.length) {
      token.dataset.companyReferenceItems = JSON.stringify(reference.items);
    } else {
      delete token.dataset.companyReferenceItems;
    }
    delete token.dataset.attachmentReferenceId;
    token.setAttribute('aria-label', 'Company reference: ' + reference.label);
    token.textContent = reference.label;
    syncComposerDraft();
  }

  function removeComposerCommandToken(token: HTMLElement) {
    if (!token.isConnected) return;

    const trailingSpace = token.nextSibling;
    token.remove();
    if (trailingSpace?.nodeType === Node.TEXT_NODE && trailingSpace.textContent === ' ') trailingSpace.remove();
    syncComposerDraft();
  }

  function replaceComposerTriggerWithToken(trigger: ComposerTrigger, token: HTMLElement) {
    const editor = composerEditorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection?.rangeCount) return false;

    const selectionRange = selection.getRangeAt(0);
    if (!editor.contains(selectionRange.commonAncestorContainer)) return false;

    const beforeSelection = selectionRange.cloneRange();
    beforeSelection.selectNodeContents(editor);
    beforeSelection.setEnd(selectionRange.startContainer, selectionRange.startOffset);
    const triggerStart = beforeSelection.toString().length - trigger.textLength;
    const startPosition = getTextPositionAtOffset(editor, triggerStart);
    if (!startPosition) return false;

    const replacementRange = document.createRange();
    replacementRange.setStart(startPosition.node, startPosition.offset);
    replacementRange.setEnd(selectionRange.startContainer, selectionRange.startOffset);
    replacementRange.deleteContents();
    const trailingSpace = document.createTextNode(' ');
    const fragment = document.createDocumentFragment();
    fragment.append(token, trailingSpace);
    replacementRange.insertNode(fragment);
    placeComposerCaretAfter(trailingSpace);
    syncComposerDraft();
    setComposerTrigger(undefined);
    return true;
  }

  function selectComposerSuggestion(suggestion: ComposerSuggestion) {
    if (!composerTrigger) return;

    if (suggestion.kind === 'participant') {
      replaceComposerTriggerWithToken(composerTrigger, createComposerToken({ kind: 'participant', label: '@' + suggestion.label, sourceId: suggestion.participant.id }));
      return;
    }

    if (suggestion.kind === 'attachment') {
      replaceComposerTriggerWithToken(composerTrigger, createComposerToken({ attachmentId: suggestion.attachment.id, kind: 'attachment', label: '@' + suggestion.label, sourceId: suggestion.attachment.id }));
      return;
    }

    const commandToken = createComposerToken({ kind: 'command', label: '/' + suggestion.label, sourceId: suggestion.command.id });
    if (replaceComposerTriggerWithToken(composerTrigger, commandToken)) {
      onCommandSelect?.(suggestion.command, {
        insertReference: (reference) => replaceComposerCommandTokenWithReference(commandToken, reference),
        removeCommand: () => removeComposerCommandToken(commandToken),
      });
    }
  }

  function insertAttachmentReferences(attachments: MessageChatAttachment[]) {
    const editor = composerEditorRef.current;
    if (!editor || attachments.length === 0) return;

    const range = getComposerInsertionRange() ?? document.createRange();
    if (!range.commonAncestorContainer.parentNode) range.selectNodeContents(editor);
    if (!getComposerInsertionRange()) range.collapse(false);
    range.deleteContents();

    const fragment = document.createDocumentFragment();
    const needsLeadingSpace = Boolean(editor.textContent?.trim());
    if (needsLeadingSpace) fragment.append(document.createTextNode(' '));

    let trailingSpace: Text | undefined;
    attachments.forEach((attachment, index) => {
      if (index > 0) fragment.append(document.createTextNode(' '));
      fragment.append(createComposerToken({ attachmentId: attachment.id, kind: 'attachment', label: `@${attachment.name}`, sourceId: attachment.id }));
      trailingSpace = document.createTextNode(' ');
      fragment.append(trailingSpace);
    });

    range.insertNode(fragment);
    if (trailingSpace) placeComposerCaretAfter(trailingSpace);
    syncComposerDraft();
    setComposerTrigger(undefined);
  }

  function getComposerReferences(): MessageChatReference[] {
    const editor = composerEditorRef.current;
    if (!editor) return [];

    return Array.from(editor.querySelectorAll<HTMLElement>('[data-composer-token-id]')).flatMap((token) => {
      const kind = token.dataset.composerTokenKind;
      const id = token.dataset.composerTokenId;
      const label = token.textContent ?? '';
      if (!id || !label || (kind !== 'participant' && kind !== 'attachment' && kind !== 'command' && kind !== 'company')) return [];

      const range = document.createRange();
      range.selectNodeContents(editor);
      range.setEndBefore(token);
      return [{
        attachmentId: token.dataset.attachmentReferenceId,
        companyItems: kind === 'company' ? getCompanyReferenceItems(token) : undefined,
        id,
        kind,
        label,
        sourceId: token.dataset.composerTokenSourceId,
        textOffset: range.toString().length,
      }];
    });
  }

  function renderMessageBody(message: MessageChatMessage) {
    const body = message.body;
    if (typeof body !== 'string' || !message.references?.length) return body;

    const references = [...message.references].sort((left, right) => left.textOffset - right.textOffset);
    const content: ReactNode[] = [];
    let cursor = 0;

    references.forEach((reference) => {
      const referenceStart = Math.max(cursor, reference.textOffset);
      const referenceEnd = referenceStart + reference.label.length;
      if (body.slice(referenceStart, referenceEnd) !== reference.label) return;

      if (referenceStart > cursor) content.push(body.slice(cursor, referenceStart));
      const isCompanyReference = reference.kind === 'company' && Boolean(onReferenceClick);

      content.push(
        <span
          className="message-chat__message-reference"
          data-clickable={isCompanyReference ? 'true' : undefined}
          data-highlighted={reference.attachmentId === hoveredAttachmentId ? 'true' : undefined}
          data-kind={reference.kind}
          key={reference.id}
          role={isCompanyReference ? 'button' : undefined}
          tabIndex={isCompanyReference ? 0 : undefined}
          onClick={() => isCompanyReference && onReferenceClick?.(reference, message)}
          onKeyDown={(event) => {
            if (!isCompanyReference || (event.key !== 'Enter' && event.key !== ' ')) return;

            event.preventDefault();
            onReferenceClick?.(reference, message);
          }}
          onMouseEnter={() => reference.attachmentId && setHoveredAttachmentId(reference.attachmentId)}
          onMouseLeave={() => setHoveredAttachmentId(undefined)}
        >
          {reference.label}
        </span>,
      );
      cursor = referenceEnd;
    });

    if (cursor < body.length) content.push(body.slice(cursor));
    return content.length ? content : body;
  }

  function submitDraft() {
    const rawDraft = getComposerText();
    const nextDraft = rawDraft.trim();
    if ((!nextDraft && pendingAttachments.length === 0) || disabled || readOnly) return;
    const leadingWhitespaceLength = rawDraft.length - rawDraft.trimStart().length;
    const references = getComposerReferences()
      .map((reference) => ({ ...reference, textOffset: reference.textOffset - leadingWhitespaceLength }))
      .filter((reference) => reference.textOffset >= 0 && reference.textOffset + reference.label.length <= nextDraft.length);
    onSend?.(nextDraft, pendingAttachments, references);
    composerEditorRef.current?.replaceChildren();
    updateDraft('');
    setPendingAttachments([]);
    setComposerTrigger(undefined);
  }

  function appendAttachments(files: File[]) {
    const nextAttachments = files.map((file) => ({
      file,
      id: getAttachmentId(file),
      name: file.name,
      size: file.size,
      type: file.type || undefined,
    }));

    if (nextAttachments.length) {
      setPendingAttachments((currentAttachments) => [...currentAttachments, ...nextAttachments]);
      requestAnimationFrame(() => {
        if (enableMentions) insertAttachmentReferences(nextAttachments);
        else composerEditorRef.current?.focus();
      });
    }
  }

  function updateAttachmentSearchOpen(isOpen: boolean) {
    setAttachmentSearchOpen(isOpen);

    if (!isOpen) {
      setAttachmentSearchQuery('');
      setSelectedSearchAttachmentIds([]);
    }
  }

  function toggleAttachmentSearchSelection(attachmentId: string) {
    setSelectedSearchAttachmentIds((currentIds) => currentIds.includes(attachmentId)
      ? currentIds.filter((currentId) => currentId !== attachmentId)
      : [...currentIds, attachmentId]);
  }

  function attachSelectedSearchAttachments() {
    const selectedAttachments = attachmentSearchItems.filter((attachment) => selectedSearchAttachmentIds.includes(attachment.id));
    const nextAttachments = selectedAttachments.filter((attachment) => !pendingAttachments.some((pendingAttachment) => pendingAttachment.id === attachment.id));

    if (nextAttachments.length) {
      setPendingAttachments((currentAttachments) => [...currentAttachments, ...nextAttachments]);
      requestAnimationFrame(() => {
        if (enableMentions) {
          insertAttachmentReferences(nextAttachments);
        } else {
          composerEditorRef.current?.focus();
        }
      });
    }

    updateAttachmentSearchOpen(false);
  }

  function handleChatDragOver(event: ReactDragEvent<HTMLElement>) {
    if (!event.dataTransfer.types.includes('Files')) return;
    event.preventDefault();
    if (disabled || readOnly || !enableFileDrop) return;
    event.dataTransfer.dropEffect = 'copy';
    setIsDraggingFiles(true);
  }

  function handleChatDragLeave(event: ReactDragEvent<HTMLElement>) {
    if (event.currentTarget.contains(event.relatedTarget as Node)) return;
    setIsDraggingFiles(false);
  }

  function handleChatDrop(event: ReactDragEvent<HTMLElement>) {
    if (!event.dataTransfer.files.length) return;
    event.preventDefault();
    setIsDraggingFiles(false);
    if (disabled || readOnly || !enableFileDrop) return;
    appendAttachments(Array.from(event.dataTransfer.files));
  }

  function handleComposerKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (composerSuggestions.length && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      setActiveSuggestionIndex((index) => (index + direction + composerSuggestions.length) % composerSuggestions.length);
      return;
    }

    if (composerSuggestions.length && (event.key === 'Tab' || (event.key === 'Enter' && !event.shiftKey))) {
      event.preventDefault();
      selectComposerSuggestion(composerSuggestions[activeSuggestionIndex] ?? composerSuggestions[0]);
      return;
    }

    if (event.key === 'Escape' && composerTrigger) {
      event.preventDefault();
      setComposerTrigger(undefined);
      return;
    }

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitDraft();
    }
  }

  function insertEmoji(emoji: string) {
    insertTextAtComposerSelection(emoji);
    setRecentEmojis((currentEmojis) => [emoji, ...currentEmojis.filter((currentEmoji) => currentEmoji !== emoji)].slice(0, 24));
    setEmojiPickerOpen(false);
    requestAnimationFrame(() => composerEditorRef.current?.focus());
  }

  function handleReferenceHover(event: ReactMouseEvent<HTMLElement>) {
    setHoveredAttachmentId(getAttachmentReferenceId(event.target));
  }

  function removeAttachment(attachmentId: string) {
    setPendingAttachments((currentAttachments) => currentAttachments.filter((attachment) => attachment.id !== attachmentId));
    composerEditorRef.current?.querySelectorAll<HTMLElement>(`[data-attachment-reference-id="${attachmentId}"]`).forEach((reference) => reference.remove());
    if (hoveredAttachmentId === attachmentId) setHoveredAttachmentId(undefined);
    syncComposerDraft();
  }

  useEffect(() => {
    const editor = composerEditorRef.current;
    if (draft !== undefined && editor && editor.textContent !== draft) editor.textContent = draft;
  }, [draft]);

  useEffect(() => {
    if (!composerSuggestions.length) return;

    suggestionsRef.current?.querySelector<HTMLElement>(`#message-chat-suggestion-${activeSuggestionIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeSuggestionIndex, composerSuggestions.length]);

  useEffect(() => {
    const newlyAddedIds = messages
      .map((message) => message.id)
      .filter((messageId) => !knownMessageIdsRef.current.has(messageId));

    if (newlyAddedIds.length) {
      setAnimatedMessageIds((currentIds) => new Set([...currentIds, ...newlyAddedIds]));
    }

    knownMessageIdsRef.current = new Set(messages.map((message) => message.id));
    messagesRef.current?.scrollTo({ behavior: 'smooth', top: messagesRef.current.scrollHeight });
  }, [messages, typingParticipantId]);

  useEffect(() => {
    if (!emojiPickerOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !emojiControlRef.current?.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        setEmojiPickerOpen(false);
        composerEditorRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(() => emojiSearchRef.current?.focus());

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [emojiPickerOpen]);

  return (
    <section
      {...chatProps}
      className={getMessageChatClassName(className)}
      data-density={density}
      data-dragging={isDraggingFiles ? 'true' : undefined}
      data-mode={mode}
      data-variant={variant}
      onDragLeave={handleChatDragLeave}
      onDragOver={handleChatDragOver}
      onDrop={handleChatDrop}
    >
      <header className="message-chat__header">
        {onHeaderClick || (isGroup && onGroupHeaderClick) ? (
          <button aria-label={isGroup ? 'Open group details' : 'Open participant profile'} className="message-chat__header-button" type="button" onClick={onHeaderClick ?? onGroupHeaderClick}>
            <span className="message-chat__identity">
              {!isGroup && directParticipant ? <ParticipantAvatar participant={directParticipant} /> : null}
              {isGroup && showParticipants ? (
                <span className="message-chat__avatar-stack" aria-label={participants.length + ' participants'}>
                  {participants.slice(0, 4).map((participant) => <ParticipantAvatar key={participant.id} participant={participant} size="small" />)}
                  {participants.length > 4 ? <span className="message-chat__avatar-overflow">+{participants.length - 4}</span> : null}
                </span>
              ) : null}
              <span className="message-chat__heading">
                <strong>{headerTitle}</strong>
                {headerDescription ? <span>{headerDescription}</span> : null}
              </span>
            </span>
            {isGroup && showParticipants ? <span className="message-chat__member-count">{participants.length} members</span> : null}
          </button>
        ) : (
          <>
            <div className="message-chat__identity">
              {!isGroup && directParticipant ? <ParticipantAvatar participant={directParticipant} /> : null}
              {isGroup && showParticipants ? (
                <span className="message-chat__avatar-stack" aria-label={participants.length + ' participants'}>
                  {participants.slice(0, 4).map((participant) => <ParticipantAvatar key={participant.id} participant={participant} size="small" />)}
                  {participants.length > 4 ? <span className="message-chat__avatar-overflow">+{participants.length - 4}</span> : null}
                </span>
              ) : null}
              <span className="message-chat__heading">
                <strong>{headerTitle}</strong>
                {headerDescription ? <span>{headerDescription}</span> : null}
              </span>
            </div>
            {isGroup && showParticipants ? <span className="message-chat__member-count">{participants.length} members</span> : null}
          </>
        )}
      </header>

      {isGroup && showParticipants ? (
        <div className="message-chat__participants" aria-label="Chat participants">
          {participants.map((participant) => (
            <span className="message-chat__participant" key={participant.id}>
              <ParticipantAvatar participant={participant} size="small" />
              <span>{participant.name}</span>
            </span>
          ))}
        </div>
      ) : null}

      <div className="message-chat__messages" aria-live="polite" ref={messagesRef}>
        {messages.length === 0 ? <p className="message-chat__empty">{emptyText}</p> : null}
        {messages.map((message) => {
          const participant = participants.find((candidate) => candidate.id === message.authorId);
          const isOwn = message.authorId === currentUserId;
          const deliveryLabel = getDeliveryLabel(message.delivery);

          return (
            <article
              className="message-chat__message"
              data-animate={animatedMessageIds.has(message.id) ? 'true' : undefined}
              data-own={isOwn ? 'true' : undefined}
              key={message.id}
            >
              {!isOwn && participant ? <ParticipantAvatar participant={participant} size="small" /> : null}
              <div className="message-chat__message-content">
                {!isOwn && isGroup ? <span className="message-chat__author">{participant?.name ?? 'Unknown participant'}</span> : null}
                {message.referenceCard ? <div className="message-chat__reference-card">{message.referenceCard}</div> : null}
                {message.body ? <div className="message-chat__bubble">{renderMessageBody(message)}</div> : null}
                {message.attachments?.length ? (
                  <div className="message-chat__attachments" aria-label={`${message.attachments.length} attachment${message.attachments.length === 1 ? '' : 's'}`}>
                    {message.attachments.map((attachment) => (
                      <span className="message-chat__attachment" data-highlighted={hoveredAttachmentId === attachment.id ? 'true' : undefined} key={attachment.id} title={attachment.name} onMouseEnter={() => setHoveredAttachmentId(attachment.id)} onMouseLeave={() => setHoveredAttachmentId(undefined)}>
                        <File aria-hidden="true" size={15} />
                        <span className="message-chat__attachment-details">
                          <strong>{attachment.name}</strong>
                          {formatFileSize(attachment.size) ? <small>{formatFileSize(attachment.size)}</small> : null}
                        </span>
                        {showAttachmentOpenAction && onAttachmentOpen ? (
                          <Button
                            aria-label={`Open ${attachment.name}`}
                            className="message-chat__attachment-open"
                            htmlType="button"
                            icon={<ExternalLink aria-hidden="true" size={13} />}
                            size="compact"
                            variant="secondary"
                            onClick={() => onAttachmentOpen(attachment, message)}
                          >
                            Open
                          </Button>
                        ) : null}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="message-chat__message-footer">
                  {message.timestamp ? <span>{message.timestamp}</span> : null}
                  {isOwn && deliveryLabel ? <span data-delivery={message.delivery}>{deliveryLabel}</span> : null}
                </div>
                <MessageReactions reactions={message.reactions} />
              </div>
            </article>
          );
        })}
        {typingParticipant ? (
          <article className="message-chat__message message-chat__typing" aria-label={`${getParticipantName(typingParticipant)} is typing`} role="status">
            <ParticipantAvatar participant={typingParticipant} size="small" />
            <div className="message-chat__message-content">
              {isGroup ? <span className="message-chat__author">{typingParticipant.name}</span> : null}
              <div className="message-chat__typing-bubble" aria-hidden="true"><span /><span /><span /></div>
            </div>
          </article>
        ) : null}
      </div>

      {showComposer ? (
        <form
          className="message-chat__composer"
          onSubmit={(event) => { event.preventDefault(); submitDraft(); }}
        >
          {pendingAttachments.length ? (
            <div className="message-chat__attachment-queue" aria-label={`${pendingAttachments.length} file${pendingAttachments.length === 1 ? '' : 's'} ready to send`}>
              {pendingAttachments.map((attachment) => (
                <span className="message-chat__attachment-chip" data-highlighted={hoveredAttachmentId === attachment.id ? 'true' : undefined} key={attachment.id} title={attachment.name} onMouseEnter={() => setHoveredAttachmentId(attachment.id)} onMouseLeave={() => setHoveredAttachmentId(undefined)}>
                  <File aria-hidden="true" size={14} />
                  <span>{attachment.name}</span>
                  <button
                    aria-label={`Remove ${attachment.name}`}
                    disabled={disabled || readOnly}
                    type="button"
                    onClick={() => removeAttachment(attachment.id)}
                  >
                    <X aria-hidden="true" size={13} />
                  </button>
                </span>
              ))}
            </div>
          ) : null}
          <div className="message-chat__composer-actions">
            {showAttachmentSearch ? (
              <Button
                aria-label="Search files to attach"
                className="message-chat__attachment-trigger"
                disabled={disabled || readOnly}
                htmlType="button"
                icon={<Paperclip aria-hidden="true" size={17} />}
                iconOnly
                size="compact"
                variant="secondary"
                onClick={() => updateAttachmentSearchOpen(true)}
              />
            ) : null}
            {showEmojiPicker ? (
            <div className="message-chat__emoji-control" ref={emojiControlRef}>
              <Button
                aria-expanded={emojiPickerOpen}
                aria-label="Choose emoji"
                className="message-chat__emoji-trigger"
                disabled={disabled || readOnly}
                htmlType="button"
                icon={<Smile aria-hidden="true" size={18} />}
                iconOnly
                size="compact"
                variant="secondary"
                onClick={() => {
                  setEmojiPickerOpen((isOpen) => !isOpen);
                  setEmojiQuery('');
                }}
              />
              {emojiPickerOpen ? (
                <div className="message-chat__emoji-picker" aria-label="Emoji picker" role="group">
                  <div className="message-chat__emoji-search">
                    <Search aria-hidden="true" size={15} />
                    <input aria-label="Search emoji" placeholder="Search emoji" ref={emojiSearchRef} type="search" value={emojiQuery} onChange={(event) => setEmojiQuery(event.target.value)} />
                  </div>
                  <div className="message-chat__emoji-grid" aria-label={emojiQuery ? 'Emoji search results' : `${emojiCategory} emoji`}>
                    {visibleEmojis.map((emoji, index) => (
                      <button aria-label={`Add ${emoji}`} key={`${emoji}-${index}`} type="button" onClick={() => insertEmoji(emoji)}>{emoji}</button>
                    ))}
                    {visibleEmojis.length === 0 ? <span className="message-chat__emoji-empty">No matching emoji</span> : null}
                  </div>
                  <div className="message-chat__emoji-categories" aria-label="Emoji categories" role="tablist">
                    <button aria-label="Recent emoji" aria-selected={emojiCategory === 'recent'} data-active={emojiCategory === 'recent' ? 'true' : undefined} role="tab" type="button" onClick={() => { setEmojiCategory('recent'); setEmojiQuery(''); }}>◷</button>
                    {EMOJI_CATEGORIES.map((category) => (
                      <button aria-label={category.label} aria-selected={emojiCategory === category.id} data-active={emojiCategory === category.id ? 'true' : undefined} key={category.id} role="tab" type="button" onClick={() => { setEmojiCategory(category.id); setEmojiQuery(''); }}>{category.icon}</button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            ) : null}
          </div>
          <div
            aria-label={composerAriaLabel}
            aria-activedescendant={composerSuggestions.length ? `message-chat-suggestion-${activeSuggestionIndex}` : undefined}
            aria-controls={composerSuggestions.length ? 'message-chat-suggestions' : undefined}
            aria-expanded={composerSuggestions.length > 0}
            aria-multiline="true"
            className="message-chat__composer-editor"
            contentEditable={!disabled && !readOnly}
            data-placeholder={composerPlaceholder}
            ref={composerEditorRef}
            role="textbox"
            suppressContentEditableWarning
            onBlur={syncComposerDraft}
            onInput={() => {
              syncComposerDraft();
              refreshComposerTrigger();
            }}
            onKeyDown={handleComposerKeyDown}
            onMouseMove={handleReferenceHover}
            onMouseLeave={() => setHoveredAttachmentId(undefined)}
          />
          {composerTrigger ? (
            <div className="message-chat__suggestions" id="message-chat-suggestions" ref={suggestionsRef} role="listbox" aria-label={composerTrigger.symbol === '@' ? 'People and attached files' : 'Chat commands'}>
              {composerSuggestions.length ? composerSuggestions.map((suggestion, index) => {
                const previousSuggestion = composerSuggestions[index - 1];
                const showGroupLabel = index === 0 || previousSuggestion?.kind !== suggestion.kind;
                const groupLabel = suggestion.kind === 'participant' ? 'People' : suggestion.kind === 'attachment' ? 'Attached files' : 'Commands';

                return (
                  <div className="message-chat__suggestion-group" key={suggestion.id}>
                    {showGroupLabel ? <span className="message-chat__suggestion-label">{groupLabel}</span> : null}
                    <button
                      aria-selected={index === activeSuggestionIndex}
                      className="message-chat__suggestion"
                      data-active={index === activeSuggestionIndex ? 'true' : undefined}
                      id={`message-chat-suggestion-${index}`}
                      role="option"
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectComposerSuggestion(suggestion)}
                    >
                      <span className="message-chat__suggestion-prefix" aria-hidden="true">{suggestion.kind === 'attachment' ? <File size={14} /> : suggestion.kind === 'command' ? '/' : '@'}</span>
                      <span className="message-chat__suggestion-copy">
                        <strong>{suggestion.kind === 'command' ? `/${suggestion.label}` : suggestion.label}</strong>
                        {suggestion.description ? <small>{suggestion.description}</small> : null}
                      </span>
                    </button>
                  </div>
                );
              }) : <span className="message-chat__suggestion-empty">No matches for {composerTrigger.symbol}{composerTrigger.query}</span>}
            </div>
          ) : null}
          <Button
            aria-label="Send message"
            className="message-chat__send"
            disabled={disabled || readOnly || (!getComposerText().trim() && pendingAttachments.length === 0)}
            htmlType="submit"
            icon={<Send aria-hidden="true" size={16} strokeWidth={2.3} />}
            iconOnly
            size="compact"
          />
        </form>
      ) : null}
      {showAttachmentSearch ? (
        <Modal
          cancelLabel="Cancel"
          confirmLabel={selectedSearchAttachmentIds.length ? 'Attach ' + selectedSearchAttachmentIds.length + ' file' + (selectedSearchAttachmentIds.length === 1 ? '' : 's') : 'Attach files'}
          description="Search shared files, then add the selected documents to your message."
          open={attachmentSearchOpen}
          title="Attach files"
          onConfirm={attachSelectedSearchAttachments}
          onOpenChange={updateAttachmentSearchOpen}
        >
          <div className="message-chat__file-search">
            <TextInput
              ariaLabel="Search files"
              placeholder="Search files"
              value={attachmentSearchQuery}
              onValueChange={setAttachmentSearchQuery}
            />
            <div aria-label="File search results" className="message-chat__file-search-results">
              {attachmentSearchResults.map((attachment) => {
                const isSelected = selectedSearchAttachmentIds.includes(attachment.id);

                return (
                  <button
                    aria-pressed={isSelected}
                    className="message-chat__file-search-result"
                    data-selected={isSelected ? 'true' : undefined}
                    key={attachment.id}
                    type="button"
                    onClick={() => toggleAttachmentSearchSelection(attachment.id)}
                  >
                    <span className="message-chat__file-search-icon"><File aria-hidden="true" size={17} /></span>
                    <span className="message-chat__file-search-copy">
                      <strong>{attachment.name}</strong>
                      <small>{attachment.description}</small>
                    </span>
                    <span className="message-chat__file-search-meta">{formatFileSize(attachment.size) ?? attachment.type}</span>
                  </button>
                );
              })}
              {attachmentSearchResults.length === 0 ? <span className="message-chat__file-search-empty">No matching files.</span> : null}
            </div>
          </div>
        </Modal>
      ) : null}
      {isDraggingFiles ? <span className="message-chat__drop-target" aria-hidden="true">Drop files anywhere in this chat</span> : null}
    </section>
  );
}

export type {
  MessageChatAttachment,
  MessageChatAttachmentSearchItem,
  MessageChatCommand,
  MessageChatCompanyReferenceItem,
  MessageChatCommandReference,
  MessageChatCommandSelection,
  MessageChatDelivery,
  MessageChatDensity,
  MessageChatMessage,
  MessageChatMode,
  MessageChatParticipant,
  MessageChatPresence,
  MessageChatProps,
  MessageChatReference,
  MessageChatReaction,
  MessageChatVariant,
} from './MessageChat.types';
