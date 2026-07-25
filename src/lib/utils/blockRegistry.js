// $lib/constants/blockRegistry.js

// 1. Lucide Icons
import Sparkle from '@lucide/svelte/icons/sparkle';
import RectangleHorizontal from '@lucide/svelte/icons/rectangle-horizontal';
import CircleDot from '@lucide/svelte/icons/circle-dot';
import Check from '@lucide/svelte/icons/check';
import ChevronDownSquare from '@lucide/svelte/icons/chevron-down-square';
import Star from '@lucide/svelte/icons/star';
import Hash from '@lucide/svelte/icons/hash';
import Gauge from '@lucide/svelte/icons/gauge';
import Phone from '@lucide/svelte/icons/phone';
import ScrollText from '@lucide/svelte/icons/scroll-text';
import Link from '@lucide/svelte/icons/link';
import Upload from '@lucide/svelte/icons/upload';
import Mail from '@lucide/svelte/icons/mail';
import ToggleLeft from '@lucide/svelte/icons/toggle-left';
import SquareCheck from '@lucide/svelte/icons/square-check';
import Smile from '@lucide/svelte/icons/smile';
import CalendarCheck from '@lucide/svelte/icons/calendar-check';
import SignatureIcon from '@lucide/svelte/icons/signature';
import PartyPopper from '@lucide/svelte/icons/party-popper';
import ListChecks from '@lucide/svelte/icons/list-checks';
import CalendarClock from '@lucide/svelte/icons/calendar-clock';
import CheckCircle from '@lucide/svelte/icons/check-circle';

// 2. Block Components
import {
  Welcome,
  ShortText,
  LongText,
  Select,
  DatePicker,
  DropdownBlock,
  OpinionScale,
  StarRating,
  Number as NumberBlock,
  PhoneNumber,
  Statement,
  Website,
  Scheduler,
  FileUploader,
  Email,
  YesNo,
  CheckboxBlock,
  Signature,
  MoodMeter,
  TimeSlotPicker,
  ThankYou
} from '$lib/blocks';

import { bgColors } from '$lib/constants/colors.js';

export const COVER_LAYOUTS = {
  WALLPAPER: 'wallpaper',
  STACK: 'stack',
  SPLIT_LEFT: 'split-left',
  SPLIT_RIGHT: 'split-right'
};

const createCoverImageProps = () => ({
  coverImage: '',
  layout: COVER_LAYOUTS.WALLPAPER
});

export const blockRegistry = [
  {
    type: 'welcome',
    label: 'Welcome',
    title: 'Hello There 😀',
    description: 'Mind giving this form a quick fill?',
    embed: '',
    buttonText: 'Let´s Start',
    textAlign: 'center',
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[0],
    icon: Sparkle,
    component: Welcome
  },
  {
    type: 'short-text',
    label: 'Short Text Block',
    question: 'Your question here...',
    description: 'This is the description',
    buttonText: 'Next',
    validation: { required: false },
    props: { placeholder: 'Your answer here...' },
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[1],
    icon: RectangleHorizontal,
    component: ShortText
  },
  {
    type: 'long-text',
    label: 'Long Text Block',
    question: 'Your question here...',
    description: 'This is the description',
    buttonText: 'Next',
    validation: { required: false },
    props: {
      placeholder: 'Your answer here...',
      maxCharacters: '',
      size: 'Medium'
    },
    textAlign: 'left',
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[2],
    icon: CircleDot,
    component: LongText
  },
  {
    type: 'single-select',
    label: 'Single Select Option',
    question: 'Which do you prefer?',
    description: 'This is the description',
    buttonText: 'Next',
    validation: { required: false },
    props: { choices: [], multiple: false },
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[3],
    icon: Check,
    component: Select
  },
  {
    type: 'multi-select',
    label: 'Multi Select Option',
    question: 'Please choose at least one option',
    description: 'This is the description',
    buttonText: 'Next',
    validation: { required: false },
    props: { choices: [], multiple: true },
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[4],
    icon: ListChecks,
    component: Select
  },
  {
    type: 'dropdown',
    label: 'Dropdown',
    question: 'Please choose',
    description: 'This is the description',
    buttonText: 'Next',
    validation: { required: false },
    props: {
      choices: ['One', 'Two', 'Three']
    },
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[5],
    icon: ChevronDownSquare,
    component: DropdownBlock
  },
  {
    type: 'star-rating',
    label: 'StarRating',
    question: 'How would you rate your experience?',
    description: 'This is the description',
    buttonText: 'Next',
    validation: { required: false },
    props: { maxRating: '5' },
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[6],
    icon: Star,
    component: StarRating
  },
  {
    type: 'date-picker',
    label: 'DatePicker',
    question: 'Please select a date',
    description: 'This is the description',
    buttonText: 'Next',
    validation: { required: false },
    props: {},
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[7],
    icon: CalendarCheck,
    component: DatePicker
  },
  {
    type: 'number',
    label: 'Number',
    question: 'Please enter a number',
    description: 'This is the description',
    buttonText: 'Next',
    validation: { required: false },
    props: { placeholder: '' },
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[8],
    icon: Hash,
    component: NumberBlock
  },
  {
    type: 'opinion-scale',
    label: 'OpinionScale',
    question: 'How likely are you to recommend us?',
    description: 'This is the description',
    buttonText: 'Next',
    validation: { required: false },
    props: {
      start: '1',
      end: '10',
      leftLabel: 'Good',
      rightLabel: 'Bad'
    },
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[9],
    icon: Gauge,
    component: OpinionScale
  },
  {
    type: 'phone-number',
    label: 'PhoneNumber',
    question: 'Please enter a phone number',
    description: 'This is the description',
    buttonText: 'Next',
    validation: { required: false },
    props: {},
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[10],
    icon: Phone,
    component: PhoneNumber
  },
  {
    type: 'statement',
    label: 'Statement',
    title: 'This is The Statement Block',
    description: 'This is where you would put your statement text here',
    buttonText: 'Next',
    props: {},
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[11],
    icon: ScrollText,
    component: Statement
  },
  {
    type: 'website-url',
    label: 'Website URL',
    question: 'Please enter a URL',
    description: 'This is the description',
    buttonText: 'Next',
    validation: { required: false },
    props: {},
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[13],
    icon: Link,
    component: Website
  },
  {
    type: 'scheduler-url',
    label: 'Scheduler URL',
    question: 'Please enter a Schedule',
    description: 'This is the description',
    buttonText: 'Next',
    validation: { required: false },
    props: {},
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[14],
    icon: ToggleLeft,
    component: Scheduler
  },
  {
    type: 'file-uploader',
    label: 'FileUploader',
    question: 'Please upload a file',
    description: 'This is the description',
    buttonText: 'Next',
    validation: { required: false },
    props: {},
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[15],
    icon: Upload,
    component: FileUploader
  },
  {
    type: 'email',
    label: 'Email',
    question: 'Your email address?',
    description: 'This is the description',
    buttonText: 'Next',
    validation: { required: false },
    props: { placeholder: 'Your answer here...' },
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[16],
    icon: Mail,
    component: Email
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    question: 'Please check if....',
    description: 'This is the description',
    buttonText: 'Next',
    validation: { required: false },
    props: {},
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[17],
    icon: SquareCheck,
    component: CheckboxBlock
  },
  {
    type: 'mood-meter',
    label: 'MoodMeter',
    question: 'How did we make you feel?',
    description: 'This is the description',
    buttonText: 'Next',
    validation: { required: false },
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[18],
    icon: Smile,
    component: MoodMeter
  },
  {
    type: 'timeslot-picker',
    label: 'Timeslot Picker',
    question: 'Pick a time',
    description: 'This is the description',
    embed: '',
    buttonText: 'Next',
    textAlign: 'center',
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[20],
    icon: CalendarClock,
    component: TimeSlotPicker
  },
  {
    type: 'yes-no',
    label: 'YesNo',
    question: 'Yes or No?',
    description: 'This is the description',
    embed: '',
    buttonText: 'Next',
    textAlign: 'center',
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[21],
    icon: CheckCircle,
    component: YesNo
  },
  {
    type: 'signature',
    label: 'Signature',
    title: 'Signature',
    description: 'This is the description',
    buttonText: 'Next',
    validation: { required: false },
    props: {},
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[22],
    icon: SignatureIcon,
    component: Signature
  },
  {
    type: 'thank-you',
    label: 'ThankYou',
    title: 'Thank You!',
    description: 'We will get back to you soon',
    embed: '',
    buttonText: 'Submit',
    textAlign: 'center',
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[23],
    icon: PartyPopper,
    component: ThankYou
  }
];
