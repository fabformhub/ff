import ShortText from '$lib/blocks/ShortText.svelte';
import LongText from '$lib/blocks/LongText.svelte';
import Statement from '$lib/blocks/Statement.svelte';
import DatePicker from '$lib/blocks/DatePicker.svelte';
import Checkbox from '$lib/blocks/Checkbox.svelte';

export const registry = [
  {
    type: "Welcome",
    label: "Welcome",
    icon: "👋",
    color: "#60a5fa",
    defaultTitle: "Welcome",
    defaultDescription: "Intro screen",
    component: Statement
  },
  {
    type: "ShortText",
    label: "Short Text",
    icon: "✏️",
    color: "#3b82f6",
    defaultTitle: "Short answer",
    defaultDescription: "User enters a short response",
    component: ShortText
  },
  {
    type: "LongText",
    label: "Long Text",
    icon: "📄",
    color: "#2563eb",
    defaultTitle: "Long answer",
    defaultDescription: "User enters a long response",
    component: LongText
  },
  {
    type: "DatePicker",
    label: "Date",
    icon: "📅",
    color: "#0ea5e9",
    defaultTitle: "Select date",
    defaultDescription: "Pick a date",
    component: DatePicker
  },
  {
    type: "Checkbox",
    label: "Checkbox",
    icon: "☑️",
    color: "#22c55e",
    defaultTitle: "Checkbox",
    defaultDescription: "Multiple choice",
    component: Checkbox
  },

  {
    type: "Dropdown",
    label: "Dropdown",
    icon: "⬇️",
    color: "#a855f7",
    defaultTitle: "Dropdown",
    defaultDescription: "Select from options",
    component: ShortText
  },

  {
    type: "Select",
    label: "Select",
    icon: "🎯",
    color: "#f97316",
    defaultTitle: "Select",
    defaultDescription: "Single choice selection",
    component: ShortText
  },

  {
    type: "StarRating",
    label: "Star Rating",
    icon: "⭐",
    color: "#facc15",
    defaultTitle: "Rating",
    defaultDescription: "Rate experience",
    component: ShortText
  },

  {
    type: "OpinionScale",
    label: "Opinion Scale",
    icon: "📊",
    color: "#14b8a6",
    defaultTitle: "Opinion",
    defaultDescription: "Scale based response",
    component: ShortText
  },

  {
    type: "Statement",
    label: "Statement",
    icon: "🧾",
    color: "#64748b",
    defaultTitle: "Statement",
    defaultDescription: "Informational block",
    component: Statement
  },

  {
    type: "Number",
    label: "Number",
    icon: "🔢",
    color: "#06b6d4",
    defaultTitle: "Number",
    defaultDescription: "Numeric input",
    component: ShortText
  },

  {
    type: "PhoneNumber",
    label: "Phone",
    icon: "📞",
    color: "#ef4444",
    defaultTitle: "Phone number",
    defaultDescription: "Enter phone number",
    component: ShortText
  },

  {
    type: "ThankYou",
    label: "Thank You",
    icon: "🙏",
    color: "#10b981",
    defaultTitle: "Thank you",
    defaultDescription: "End screen",
    component: Statement
  },

  {
    type: "Website",
    label: "Website",
    icon: "🌐",
    color: "#3b82f6",
    defaultTitle: "Website",
    defaultDescription: "URL input",
    component: ShortText
  },

  {
    type: "Scheduler",
    label: "Scheduler",
    icon: "🗓️",
    color: "#8b5cf6",
    defaultTitle: "Schedule",
    defaultDescription: "Pick a time slot",
    component: Statement
  },

  {
    type: "FileUploader",
    label: "File Upload",
    icon: "📎",
    color: "#94a3b8",
    defaultTitle: "Upload file",
    defaultDescription: "Attach files",
    component: Statement
  },

  {
    type: "Email",
    label: "Email",
    icon: "✉️",
    color: "#0ea5e9",
    defaultTitle: "Email",
    defaultDescription: "Enter email address",
    component: ShortText
  },

  {
    type: "YesNo",
    label: "Yes / No",
    icon: "⚖️",
    color: "#f43f5e",
    defaultTitle: "Yes or No",
    defaultDescription: "Binary choice",
    component: Checkbox
  },

  {
    type: "Signature",
    label: "Signature",
    icon: "✍️",
    color: "#111827",
    defaultTitle: "Signature",
    defaultDescription: "Draw signature",
    component: Statement
  },

  {
    type: "MoodMeter",
    label: "Mood",
    icon: "🙂",
    color: "#f59e0b",
    defaultTitle: "Mood",
    defaultDescription: "Select mood",
    component: Statement
  },

  {
    type: "TimeSlotPicker",
    label: "Time Slot",
    icon: "⏰",
    color: "#38bdf8",
    defaultTitle: "Time slot",
    defaultDescription: "Pick time",
    component: Statement
  }
]
