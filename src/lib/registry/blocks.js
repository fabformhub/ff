import Welcome from '$lib/blocks/Welcome.svelte';
import ShortText from '$lib/blocks/ShortText.svelte';
import LongText from '$lib/blocks/LongText.svelte';
import DatePicker from '$lib/blocks/DatePicker.svelte';
import Checkbox from '$lib/blocks/Checkbox.svelte';
import Dropdown from '$lib/blocks/Dropdown.svelte';
import MoodMeter from '$lib/blocks/MoodMeter.svelte';
import Number from '$lib/blocks/Number.svelte';
import OpinionScale from '$lib/blocks/OpinionScale.svelte';
import PhoneNumber from '$lib/blocks/PhoneNumber.svelte';
import Select from '$lib/blocks/Select.svelte';
import Signature from '$lib/blocks/Signature.svelte';
import StarRating from '$lib/blocks/StarRating.svelte';
import Statement from '$lib/blocks/Statement.svelte';
import ThankYou from '$lib/blocks/ThankYou.svelte';
import TimeSlotPicker from '$lib/blocks/TimeSlotPicker.svelte';
import YesNo from '$lib/blocks/YesNo.svelte';
import Email from '$lib/blocks/Email.svelte';
import FileUploader from '$lib/blocks/FileUploader.svelte';

import {
  Hand, Type, AlignLeft, Calendar, CheckSquare, SquareChevronDown,
  MousePointerClick, Star, SlidersHorizontal, FileText, Hash, Phone,
  Sparkles, Globe, Clock, Upload, Mail, ToggleLeft, Signature as SignatureIcon,
  Smile, Timer
} from '@lucide/svelte';

export const registry = [
  // --- ENDPAPERS ---
  { type: "Welcome",        label: "Welcome Screen",        icon: Hand,              bg: "#FFD6E7", fg: "#9D174D", component: Welcome,        defaultDescription: "Greet your audience with a high-end, custom introduction card." },
  { type: "ThankYou",       label: "Thank You Screen",      icon: Sparkles,          bg: "#CCFBCE", fg: "#14532D", component: ThankYou,       defaultDescription: "A beautiful conclusion card with custom closing logic steps." },

  // --- TEXT INPUTS ---
  { type: "ShortText",      label: "Short Text",            icon: Type,              bg: "#BFDBFE", fg: "#1E3A8A", component: ShortText,      defaultDescription: "Capture names, titles, or concise single-line text inputs." },
  { type: "LongText",       label: "Long Text",             icon: AlignLeft,         bg: "#DDD6FE", fg: "#4C1D95", component: LongText,       defaultDescription: "Gather open-ended feedback and longer paragraph responses." },
  { type: "Email",          label: "Email Address",         icon: Mail,              bg: "#99F6E4", fg: "#134E4A", component: Email,          defaultDescription: "Secure, verified email address capture with built-in validation." },
  { type: "PhoneNumber",    label: "Phone Number",          icon: Phone,             bg: "#FED7AA", fg: "#7C2D12", component: PhoneNumber,    defaultDescription: "International phone input fields with clear masks." },
  { type: "Website",        label: "Website URL",           icon: Globe,             bg: "#A5F3FC", fg: "#164E63", component: ShortText,      defaultDescription: "Collect and validate clean portfolio or corporate digital URLs." },
  { type: "Number",         label: "Numeric Value",         icon: Hash,              bg: "#FBCFE8", fg: "#831843", component: Number,         defaultDescription: "Enforced numeric fields for quantitative counts." },

  // --- SELECTION ---
  { type: "Checkbox",       label: "Multiple Choice",       icon: CheckSquare,       bg: "#BBF7D0", fg: "#064E3B", component: Checkbox,       defaultDescription: "Allow multiple items to be selected simultaneously from lists." },
  { type: "Dropdown",       label: "Dropdown Select",       icon: SquareChevronDown, bg: "#E9D5FF", fg: "#581C87", component: Dropdown,       defaultDescription: "An elegant, compact select menu for long options lists." },
  { type: "Select",         label: "Single Select",         icon: MousePointerClick, bg: "#FECACA", fg: "#7F1D1D", component: Select,         defaultDescription: "Radio-alternative choice components with hover micro-states." },
  { type: "YesNo",          label: "Yes / No Toggle",       icon: ToggleLeft,        bg: "#FEF08A", fg: "#713F12", component: YesNo,          defaultDescription: "Clean, lightning-fast binary switch controls for quick answers." },

  // --- DATE & TIME ---
  { type: "DatePicker",     label: "Date Selection",        icon: Calendar,          bg: "#C7D2FE", fg: "#3730A3", component: DatePicker,     defaultDescription: "Premium localised date pickers with interactive view matrices." },
  { type: "TimeSlotPicker", label: "Time Slot",             icon: Timer,             bg: "#FDE68A", fg: "#92400E", component: TimeSlotPicker, defaultDescription: "Let clients choose precise, modular timestamp blocks." },
  { type: "Scheduler",      label: "Appointment Scheduler", icon: Clock,             bg: "#E0E7FF", fg: "#312E81", component: TimeSlotPicker, defaultDescription: "Deeply functional real-time booking layout systems." },

  // --- FILES ---
  { type: "FileUploader",   label: "File Upload",           icon: Upload,            bg: "#E2E8F0", fg: "#1E293B", component: FileUploader,   defaultDescription: "Accept secure client document files, media assets, and PDFs." },

  // --- METRICS ---
  { type: "StarRating",     label: "Star Rating",           icon: Star,              bg: "#FFEDD5", fg: "#9A3412", component: StarRating,     defaultDescription: "Classic star-based visual scoring for satisfaction metrics." },
  { type: "OpinionScale",   label: "Opinion Scale",         icon: SlidersHorizontal, bg: "#A7F3D0", fg: "#065F46", component: OpinionScale,   defaultDescription: "Linear rating ranges (e.g., NPS 1–10 metric structures)." },
  { type: "MoodMeter",      label: "Mood Meter",            icon: Smile,             bg: "#FFC9C9", fg: "#881337", component: MoodMeter,      defaultDescription: "Capture customer sentiment through interactive emotion scales." },

  // --- UTILITY ---
  { type: "Statement",      label: "Text Statement",        icon: FileText,          bg: "#D1FAE5", fg: "#065F46", component: Statement,      defaultDescription: "Display descriptions or context terms without inputs." },
  { type: "Signature",      label: "E-Signature",           icon: SignatureIcon,     bg: "#CFFAFE", fg: "#155E75", component: Signature,      defaultDescription: "Collect legally binding signatures via responsive drawing canvas." },
];