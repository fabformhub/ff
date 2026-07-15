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
import Signature from '@lucide/svelte/icons/signature';
import PartyPopper from '@lucide/svelte/icons/party-popper';
import ListChecks from '@lucide/svelte/icons/list-checks';
import CalendarClock from '@lucide/svelte/icons/calendar-clock';
import CheckCircle from '@lucide/svelte/icons/check-circle';


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
    blockTypeId: 1,
    label: 'Welcome',
    title: 'Hello There 😀',
    description: 'Mind giving this form a quick fill?',
    embed: '',
    buttonText: 'Let´s Start',
    component: 'Welcome',
    textAlign: 'center',
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[0],
    icon: Sparkle
  },

  {
    blockTypeId: 2,
    label: 'Short Text Block',
    question: 'Your question here...',
    description: 'This is the description',
    component: 'ShortText',
    buttonText: 'Next',
    validation: { required: false },
    props: { placeholder: 'Your answer here...' },
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[1],
    icon: RectangleHorizontal
  },

  {
    blockTypeId: 3,
    label: 'Long Text Block',
    question: 'Your question here...',
    description: 'This is the description',
    component: 'LongText',
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
    icon: CircleDot
  },

  {
    blockTypeId: 4,
    label: 'Single Select Option',
    question: 'Which do you prefer?',
    description: 'This is the description',
    component: 'Select',
    buttonText: 'Next',
    validation: { required: false },
    props: { choices: [], multiple: false },
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[3],
    icon: Check
  },

  {
    blockTypeId: 5,
    label: 'Multi Select Option',
    question: 'Please choose at least one option',
    description: 'This is the description',
    component: 'Select',
    buttonText: 'Next',
    validation: { required: false },
    props: { choices: [], multiple: true },
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[4],
    icon: ListChecks
  },

  {
    blockTypeId: 6,
    label: 'Dropdown',
    question: 'Please choose',
    description: 'This is the description',
    component: 'DropdownBlock',
    buttonText: 'Next',
    validation: { required: false },
    props: {
      choices: ['One', 'Two', 'Three']
    },
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[5],
    icon: ChevronDownSquare
  },

  {
    blockTypeId: 7,
    label: 'StarRating',
    question: 'How would you rate your experience?',
    description: 'This is the description',
    component: 'StarRating',
    buttonText: 'Next',
    validation: { required: false },
    props: { maxRating: '5' },
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[6],
    icon: Star
  },

  {
    blockTypeId: 8,
    label: 'DatePicker',
    question: 'Please select a date',
    component: 'DatePicker',
    description: 'This is the description',
    buttonText: 'Next',
    validation: { required: false },
    props: {},
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[7],
    icon: CalendarCheck
  },

  {
    blockTypeId: 9,
    label: 'Number',
    question: 'Please enter a number',
    description: 'This is the description',
    component: 'Number',
    buttonText: 'Next',
    validation: { required: false },
    props: { placeholder: '' },
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[8],
    icon: Hash
  },

  {
    blockTypeId: 10,
    label: 'OpinionScale',
    question: 'How likely are you to recommend us?',
    description: 'This is the description',
    component: 'OpinionScale',
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
    icon: Gauge
  },

  {
    blockTypeId: 11,
    label: 'PhoneNumber',
    question: 'Please enter a phone number',
    description: 'This is the description',
    component: 'PhoneNumber',
    buttonText: 'Next',
    validation: { required: false },
    props: {},
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[10],
    icon: Phone
  },

  {
    blockTypeId: 12,
    label: 'Statement',
    title: 'This is The Statement Block',
    description: 'This is where you would put your statement text here',
    component: 'Statement',
    buttonText: 'Next',
    props: {},
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[11],
    icon: ScrollText
  },

  {
    blockTypeId: 14,
    label: 'Website URL',
    question: 'Please enter a URL',
    description: 'This is the description',
    component: 'Website',
    buttonText: 'Next',
    validation: { required: false },
    props: {},
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[13],
    icon: Link
  },

  {
    blockTypeId: 15,
    label: 'Scheduler URL',
    question: 'Please enter a Schedule',
    description: 'This is the description',
    component: 'Scheduler',
    buttonText: 'Next',
    validation: { required: false },
    props: {},
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[14],
    icon: ToggleLeft
  },

  {
    blockTypeId: 16,
    label: 'FileUploader',
    question: 'Please upload a file',
    description: 'This is the description',
    component: 'FileUploader',
    buttonText: 'Next',
    validation: { required: false },
    props: {},
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[15],
    icon: Upload
  },

  {
    blockTypeId: 17,
    label: 'Email',
    question: 'Your email address?',
    description: 'This is the description',
    component: 'Email',
    buttonText: 'Next',
    validation: { required: false },
    props: { placeholder: 'Your answer here...' },
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[16],
    icon: Mail
  },

  {
    blockTypeId: 18,
    label: 'Checkbox',
    question: 'Please check if....',
    description: 'This is the description',
    component: 'CheckboxBlock',
    buttonText: 'Next',
    validation: { required: false },
    props: {},
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[17],
    icon: SquareCheck
  },

  {
    blockTypeId: 19,
    label: 'MoodMeter',
    question: 'How did we make you feel?',
    description: 'This is the description',
    component: 'MoodMeter',
    buttonText: 'Next',
    validation: { required: false },
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[18],
    icon: Smile
  },

  {
    blockTypeId: 20,
    label: 'Timeslot Picker',
    question: 'Pick a time',
    description: 'This is the description',
    embed: '',
    component: 'TimeSlotPicker',
    buttonText: 'Next',
    textAlign: 'center',
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[20],
    icon: CalendarClock
  },
  {
    blockTypeId: 21,
    label: 'YesNo',
    question: 'Yes or No?',
    description: 'This is the description',
    embed: '',
    component: 'YesNo',
    buttonText: 'Next',
    textAlign: 'center',
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[21],
    icon: CheckCircle 
  },

 
  {
    blockTypeId: 98,
    label: 'Signature',
    title : 'Signature',
    description: 'This is the description',
    component: 'Signature',
    buttonText: 'Next',
    validation: { required: false },
    props: {},
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[22],
    icon: Signature
  },

  {
    blockTypeId: 99,
    label: 'ThankYou',
    title: 'Thank You!',
    description: 'We will get back to you soon',
    embed: '',
    component: 'ThankYou',
    buttonText: 'Submit',
    textAlign: 'center',
    coverImageProps: createCoverImageProps(),
    bgColor: bgColors[23],
    icon: PartyPopper
  }
]
