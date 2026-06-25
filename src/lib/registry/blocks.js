import {
  Hand,
  Type,
  AlignLeft,
  Calendar,
  CheckSquare,
  ChevronDownSquare,
  MousePointerSquare,
  Star,
  SlidersHorizontal,
  FileText,
  Hash,
  Phone,
  Sparkles,
  Globe,
  Clock,
  Upload,
  Mail,
  ToggleLeftRight,
  PenLine,
  Smile,
  Timer
} from 'lucide-svelte';

import ShortText from '$lib/blocks/ShortText.svelte';
import LongText from '$lib/blocks/LongText.svelte';
import Statement from '$lib/blocks/Statement.svelte';
import DatePicker from '$lib/blocks/DatePicker.svelte';
import Checkbox from '$lib/blocks/Checkbox.svelte';

export const registry = [
  {
    type: "Welcome",
    label: "Welcome",
    icon: Hand,
    color: "#FFE8D6",
    defaultTitle: "Welcome",
    defaultDescription: "Intro screen",
    component: Statement
  },
  {
    type: "ShortText",
    label: "Short Text",
    icon: Type,
    color: "#E0F7FA",
    defaultTitle: "Short answer",
    defaultDescription: "User enters a short response",
    component: ShortText
  },
  {
    type: "LongText",
    label: "Long Text",
    icon: AlignLeft,
    color: "#EDE7F6",
    defaultTitle: "Long answer",
    defaultDescription: "User enters a long response",
    component: LongText
  },
  {
    type: "DatePicker",
    label: "Date",
    icon: Calendar,
    color: "#FFF3C4",
    defaultTitle: "Select date",
    defaultDescription: "Pick a date",
    component: DatePicker
  },
  {
    type: "Checkbox",
    label: "Checkbox",
    icon: CheckSquare,
    color: "#E8F5E9",
    defaultTitle: "Checkbox",
    defaultDescription: "Multiple choice",
    component: Checkbox
  },
  {
    type: "Dropdown",
    label: "Dropdown",
    icon: ChevronDownSquare,
    color: "#F3E5F5",
    defaultTitle: "Dropdown",
    defaultDescription: "Select from options",
    component: ShortText
  },
  {
    type: "Select",
    label: "Select",
    icon: MousePointerSquare,
    color: "#FFEBEE",
    defaultTitle: "Select",
    defaultDescription: "Single choice selection",
    component: ShortText
  },
  {
    type: "StarRating",
    label: "Star Rating",
    icon: Star,
    color: "#FFF9C4",
    defaultTitle: "Rating",
    defaultDescription: "Rate experience",
    component: ShortText
  },
  {
    type: "OpinionScale",
    label: "Opinion Scale",
    icon: SlidersHorizontal,
    color: "#E0F2F1",
    defaultTitle: "Opinion",
    defaultDescription: "Scale based response",
    component: ShortText
  },
  {
    type: "Statement",
    label: "Statement",
    icon: FileText,
    color: "#ECEFF1",
    defaultTitle: "Statement",
    defaultDescription: "Informational block",
    component: Statement
  },
  {
    type: "Number",
    label: "Number",
    icon: Hash,
    color: "#E1F5FE",
    defaultTitle: "Number",
    defaultDescription: "Numeric input",
    component: ShortText
  },
  {
    type: "PhoneNumber",
    label: "Phone",
    icon: Phone,
    color: "#FFEBEE",
    defaultTitle: "Phone number",
    defaultDescription: "Enter phone number",
    component: ShortText
  },
  {
    type: "ThankYou",
    label: "Thank You",
    icon: Sparkles,
    color: "#ECFDF5",
    defaultTitle: "Thank you",
    defaultDescription: "End screen",
    component: Statement
  },
  {
    type: "Website",
    label: "Website",
    icon: Globe,
    color: "#E3F2FD",
    defaultTitle: "Website",
    defaultDescription: "URL input",
    component: ShortText
  },
  {
    type: "Scheduler",
    label: "Scheduler",
    icon: Clock,
    color: "#F3E5F5",
    defaultTitle: "Schedule",
    defaultDescription: "Pick a time slot",
    component: Statement
  },
  {
    type: "FileUploader",
    label: "File Upload",
    icon: Upload,
    color: "#ECEFF1",
    defaultTitle: "Upload file",
    defaultDescription: "Attach files",
    component: Statement
  },
  {
    type: "Email",
    label: "Email",
    icon: Mail,
    color: "#E3F2FD",
    defaultTitle: "Email",
    defaultDescription: "Enter email address",
    component: ShortText
  },
  {
    type: "YesNo",
    label: "Yes / No",
    icon: ToggleLeftRight,
    color: "#FFEBEE",
    defaultTitle: "Yes or No",
    defaultDescription: "Binary choice",
    component: Checkbox
  },
  {
    type: "Signature",
    label: "Signature",
    icon: PenLine,
    color: "#F5F5F5",
    defaultTitle: "Signature",
    defaultDescription: "Draw signature",
    component: Statement
  },
  {
    type: "MoodMeter",
    label: "Mood",
    icon: Smile,
    color: "#FFF3C4",
    defaultTitle: "Mood",
    defaultDescription: "Select mood",
    component: Statement
  },
  {
    type: "TimeSlotPicker",
    label: "Time Slot",
    icon: Timer,
    color: "#E1F5FE",
    defaultTitle: "Time slot",
    defaultDescription: "Pick time",
    component: Statement
  }
];

