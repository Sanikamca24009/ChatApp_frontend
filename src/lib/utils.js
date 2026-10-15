export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export function formatLastSeen(date) {
  if (!date) return "Offline";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Offline";

  const now = new Date();
  const timeStr = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return `Last seen today at ${timeStr}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();
  if (isYesterday) {
    return `Last seen yesterday at ${timeStr}`;
  }

  const dateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  return `Last seen on ${dateStr} at ${timeStr}`;
}

export function formatPresence(isOnline, lastSeen) {
  if (isOnline) return "● Online";
  return formatLastSeen(lastSeen);
}

export function formatChatTime(date) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();
  if (isYesterday) {
    return "Yesterday";
  }

  return d.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' });
}

export function formatMessagePreview(msg, myId, isGroup = false) {
  if (!msg) return "";

  const isMine = msg.senderId === myId;
  const content = msg.image ? (msg.text ? `📷 ${msg.text}` : "📷 Photo") : (msg.text || "");

  if (isMine) {
    return `You: ${content}`;
  }

  if (isGroup && msg.senderName) {
    const firstName = msg.senderName.trim().split(" ")[0];
    return `${firstName}: ${content}`;
  }

  return content;
}

export function formatCrewTyping(typingList) {
  if (!typingList || typingList.length === 0) return null;
  if (typingList.length === 1) {
    const name = typingList[0].name?.trim().split(" ")[0] || "Pirate";
    return `${name} is typing...`;
  }
  if (typingList.length === 2) {
    const name1 = typingList[0].name?.trim().split(" ")[0] || "Pirate";
    const name2 = typingList[1].name?.trim().split(" ")[0] || "Pirate";
    return `${name1} and ${name2} are typing...`;
  }
  return `${typingList.length} pirates are typing...`;
}

export function formatDateSeparator(date) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const now = new Date();

  // Calendar day comparisons in the user's local timezone
  const isToday =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (isToday) return "Today";

  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const isYesterday =
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate();
  if (isYesterday) return "Yesterday";

  // Formatted like "12 Oct 2026"
  const day = d.getDate();
  const month = d.toLocaleDateString("en-GB", { month: "short" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export function isDifferentCalendarDay(dateA, dateB) {
  if (!dateA || !dateB) return true;
  const a = new Date(dateA);
  const b = new Date(dateB);
  if (isNaN(a.getTime()) || isNaN(b.getTime())) return true;
  return (
    a.getFullYear() !== b.getFullYear() ||
    a.getMonth() !== b.getMonth() ||
    a.getDate() !== b.getDate()
  );
}
