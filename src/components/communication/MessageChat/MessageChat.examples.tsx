import { useEffect, useState } from 'react';
import { MessageChat } from './MessageChat';
import type { MessageChatMessage, MessageChatProps } from './MessageChat.types';

const PARTICIPANTS = [
  { id: 'alex', name: 'Alex', presence: 'online' as const, subtitle: 'Online' },
  { id: 'maya', name: 'Maya Chen', presence: 'online' as const, subtitle: 'Strategy research' },
  { id: 'noah', name: 'Noah Okafor', presence: 'away' as const, subtitle: 'Execution' },
  { id: 'sam', name: 'Sam Rivera', presence: 'offline' as const, subtitle: 'Risk' },
];

const DIRECT_MESSAGES: MessageChatMessage[] = [
  { authorId: 'maya', body: 'I pushed the revised entry conditions for the momentum strategy.', id: 'direct-1', timestamp: '09:41' },
  { authorId: 'alex', body: 'Perfect. I will run it against the latest paper data.', delivery: 'read', id: 'direct-2', timestamp: '09:43' },
  { authorId: 'maya', body: 'Great — the risk cap is still set to 42%.', id: 'direct-3', reactions: [{ emoji: '✓', reacted: true }], timestamp: '09:44' },
];

const GROUP_MESSAGES: MessageChatMessage[] = [
  { authorId: 'noah', body: 'Order routing is healthy again after the reconnect.', id: 'group-1', timestamp: '10:04' },
  { authorId: 'sam', body: 'Risk checks are clear. I have raised the volatility threshold for today.', id: 'group-2', timestamp: '10:06' },
  { authorId: 'alex', body: 'Thanks. Let’s keep the strategy in simulation until the close.', delivery: 'read', id: 'group-3', reactions: [{ count: 2, emoji: '👍', reacted: true }], timestamp: '10:08' },
];

export type MessageChatExampleProps = Omit<MessageChatProps, 'messages' | 'participants' | 'currentUserId' | 'onSend' | 'typingParticipantId'> & {
  showTyping?: boolean;
};

export function MessageChatExample({ mode = 'direct', showTyping = true, ...props }: MessageChatExampleProps) {
  const baseMessages = mode === 'group' ? GROUP_MESSAGES : DIRECT_MESSAGES;
  const [messages, setMessages] = useState(baseMessages);

  useEffect(() => {
    setMessages(mode === 'group' ? GROUP_MESSAGES : DIRECT_MESSAGES);
  }, [mode]);

  return (
    <MessageChat
      {...props}
      currentUserId="alex"
      messages={messages}
      mode={mode}
      participants={mode === 'group' ? PARTICIPANTS : PARTICIPANTS.slice(0, 2)}
      title={mode === 'group' ? 'Strategy desk' : undefined}
      typingParticipantId={showTyping ? (mode === 'group' ? 'noah' : 'maya') : undefined}
      onSend={(draft, attachments, references) => {
        setMessages((currentMessages) => [
          ...currentMessages,
          { attachments, authorId: 'alex', body: draft, delivery: 'sent', id: `new-${Date.now()}`, references, timestamp: 'Now' },
        ]);
      }}
    />
  );
}
