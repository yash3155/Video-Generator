import React from 'react';
import { useVideoConfig, spring } from 'remotion';
import { Scene, Beat, ChatStoryUI, ChatTimelineItem } from '../types';

interface ChatStoryProps {
  scene: Scene;
  beat: Beat;
  beatIndexInScene?: number;
  beatFrame?: number;
  beatDuration?: number;
  allBeatsInScene?: Beat[];
}

const themeStyles: Record<
  string,
  {
    avatarBg: string;
    avatarText: string;
    avatarBorder: string;
    bubbleBg: string;
    bubbleBorder: string;
    senderText: string;
    messageText: string;
  }
> = {
  amber: {
    avatarBg: '#FEF3C7',
    avatarText: '#B45309',
    avatarBorder: '#FDE68A',
    bubbleBg: '#FFFBEB',
    bubbleBorder: '#FCD34D',
    senderText: '#92400E',
    messageText: '#78350F',
  },
  teal: {
    avatarBg: '#CCFBF1',
    avatarText: '#0F766E',
    avatarBorder: '#99F6E4',
    bubbleBg: '#F0FDFA',
    bubbleBorder: '#5EEAD4',
    senderText: '#115E59',
    messageText: '#134E4A',
  },
  blue: {
    avatarBg: '#DBEAFE',
    avatarText: '#1D4ED8',
    avatarBorder: '#BFDBFE',
    bubbleBg: '#EFF6FF',
    bubbleBorder: '#93C5FD',
    senderText: '#1E40AF',
    messageText: '#1E3A8A',
  },
  purple: {
    avatarBg: '#F3E8FF',
    avatarText: '#7E22CE',
    avatarBorder: '#E9D5FF',
    bubbleBg: '#FAF5FF',
    bubbleBorder: '#D8B4FE',
    senderText: '#6B21A8',
    messageText: '#581C87',
  },
  green: {
    avatarBg: '#DCFCE7',
    avatarText: '#15803D',
    avatarBorder: '#BBF7D0',
    bubbleBg: '#F0FDF4',
    bubbleBorder: '#86EFAC',
    senderText: '#166534',
    messageText: '#14532D',
  },
};

const personaLabels: Record<string, string> = {
  Raju: 'RJ',
  'Sharma ji': 'SJ',
};

export const ChatStory: React.FC<ChatStoryProps> = ({
  scene,
  beat,
  beatIndexInScene = 0,
  beatFrame = 0,
  allBeatsInScene = [],
}) => {
  const { fps } = useVideoConfig();

  // Unified accumulated timeline
  const accumulatedTimeline: Array<{
    item: ChatTimelineItem;
    isNew: boolean;
  }> = [];

  const seenKeys = new Set<string>();

  const beatsToProcess =
    allBeatsInScene.length > 0
      ? allBeatsInScene.slice(0, beatIndexInScene + 1)
      : [beat];

  beatsToProcess.forEach((b, bIdx) => {
    const isCurrentBeat = bIdx === beatIndexInScene;
    const ui = b.ui_state as ChatStoryUI;

    // 1. If beat explicitly provides timeline array
    if (ui?.timeline && ui.timeline.length > 0) {
      ui.timeline.forEach((item) => {
        const key = `${item.type}:${item.text}:${item.sender || ''}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          accumulatedTimeline.push({
            item,
            isNew: isCurrentBeat,
          });
        }
      });
    } else {
      // 2. Fallback: normalize stageDirections & messages into timeline
      if (ui?.stageDirections) {
        ui.stageDirections.forEach((dir) => {
          const key = `note:${dir}`;
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            accumulatedTimeline.push({
              item: { type: 'note', text: dir },
              isNew: isCurrentBeat,
            });
          }
        });
      }

      if (ui?.messages) {
        ui.messages.forEach((msg) => {
          const key = `msg:${msg.sender}:${msg.text}`;
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            accumulatedTimeline.push({
              item: {
                type: 'message',
                sender: msg.sender,
                avatar: msg.avatar,
                text: msg.text,
                theme: msg.theme,
                align: msg.align,
              },
              isNew: isCurrentBeat,
            });
          }
        });
      }

      // 3. Fallback: visual.data.messages
      const visualMessages = (b.visual?.data as any)?.messages;
      if (visualMessages && Array.isArray(visualMessages)) {
        visualMessages.forEach((msg: any) => {
          const key = `msg:${msg.sender}:${msg.text}`;
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            accumulatedTimeline.push({
              item: {
                type: 'message',
                sender: msg.sender,
                avatar: msg.avatar,
                text: msg.text,
                theme: msg.theme || (msg.sender === 'Sharma ji' ? 'teal' : 'amber'),
                align: msg.align || (msg.sender === 'Sharma ji' ? 'right' : 'left'),
              },
              isNew: isCurrentBeat,
            });
          }
        });
      }

      // 4. Fallback: single message in ui_state or visual.data
      const singleMsg = ui?.message || (b.visual?.data as any)?.message;
      if (singleMsg) {
        const sender = ui?.speaker || (ui as any)?.sender || (b.visual?.data as any)?.speaker || 'Raju';
        const key = `msg:${sender}:${singleMsg}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          accumulatedTimeline.push({
            item: {
              type: 'message',
              sender,
              avatar: ui?.avatar || (sender === 'Sharma ji' ? 'S' : 'R'),
              text: singleMsg,
              theme: ui?.theme || (sender === 'Sharma ji' ? 'teal' : 'amber'),
              align: sender === 'Sharma ji' ? 'right' : 'left',
            },
            isNew: isCurrentBeat,
          });
        }
      }
    }
  });

  return (
    <div className="w-full h-full flex flex-col justify-between relative z-10 px-4 py-2">
      {/* Unified Timeline Container */}
      <div className="flex-1 flex flex-col justify-center space-y-4 max-w-4xl mx-auto w-full px-6 py-4 my-auto">
        {/* Grouped Scene Badge anchored inside centered container */}
        {scene.badge && (
          <div className="mb-4 flex items-center justify-start">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#F3EFE6] text-[#8B7355] border border-[#E5DFD3] shadow-sm">
              {scene.badge}
            </span>
          </div>
        )}

        {accumulatedTimeline.map(({ item, isNew }, index) => {
          let opacity = 1;
          let translateY = 0;
          let scale = 1;

          if (isNew) {
            const entrance = spring({
              frame: beatFrame,
              fps,
              config: { damping: 15, stiffness: 120 },
            });
            opacity = entrance;
            translateY = (1 - entrance) * 16;
            scale = 0.98 + entrance * 0.02;
          }

          // Case A: Stage Note
          if (item.type === 'note') {
            const cleanText = item.text.replace(/^[—–-]\s*|\s*[—–-]$/g, '').trim();
            const formattedNote = `— ${cleanText} —`;

            return (
              <div
                key={index}
                style={{
                  opacity,
                  transform: `translateY(${translateY}px)`,
                }}
                className="w-full flex justify-center my-1 mb-6"
              >
                <p className="italic text-base text-[#737373] tracking-wide font-medium bg-[#FAFAF8] px-5 py-1.5 rounded-full border border-[#EFECE6] shadow-2xs">
                  {formattedNote}
                </p>
              </div>
            );
          }

          // Case B: Chat Message Bubble
          const isRight = item.align === 'right';
          const theme = themeStyles[item.theme || 'amber'] || themeStyles.amber;

          return (
            <div
              key={index}
              style={{
                opacity,
                transform: `translateY(${translateY}px) scale(${scale})`,
              }}
              className={`flex items-end space-x-4 ${
                isRight ? 'flex-row-reverse space-x-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar Circle */}
              <div
                className="w-13 h-13 rounded-full flex items-center justify-center font-bold text-lg shrink-0 border-2 shadow-sm"
                style={{
                  backgroundColor: theme.avatarBg,
                  color: theme.avatarText,
                  borderColor: theme.avatarBorder,
                }}
              >
                {personaLabels[item.sender || ''] || item.avatar || (item.sender ? item.sender.charAt(0) : 'U')}
              </div>

              {/* Message Bubble + Sender */}
              <div
                className={`flex flex-col max-w-xl ${
                  isRight ? 'items-end' : 'items-start'
                }`}
              >
                {item.sender && (
                  <span
                    className="text-xs font-semibold uppercase tracking-wider mb-1 px-1"
                    style={{ color: theme.senderText }}
                  >
                    {item.sender}
                  </span>
                )}

                <div
                  className="rounded-2xl px-5 py-3.5 shadow-sm border text-xl font-medium leading-relaxed"
                  style={{
                    backgroundColor: theme.bubbleBg,
                    borderColor: theme.bubbleBorder,
                    color: theme.messageText,
                    borderBottomLeftRadius: isRight ? 16 : 4,
                    borderBottomRightRadius: isRight ? 4 : 16,
                  }}
                >
                  {item.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-2" />
    </div>
  );
};
