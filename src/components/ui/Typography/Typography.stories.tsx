import type { Meta, StoryObj } from '@storybook/react';
import { Heading, Text } from './Typography';

const meta: Meta<typeof Heading> = { // Defaulting to Heading for main component
  title: 'UI/Typography',
  component: Heading, // Main component for the story file
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    // Args for Heading
    as: { control: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
    variant: { control: 'select', options: ['default', 'display', 'subtle'] },
    children: { control: 'text' },
  },
};
export default meta;

// Stories for Heading
export const H1Default: StoryObj<typeof Heading> = {
  args: { as: 'h1', children: 'Heading 1 (Default)' },
};
export const H2Display: StoryObj<typeof Heading> = {
  args: { as: 'h2', variant: 'display', children: 'Heading 2 (Display)' },
};
export const H3Subtle: StoryObj<typeof Heading> = {
  args: { as: 'h3', variant: 'subtle', children: 'Heading 3 (Subtle)' },
};

// Stories for Text
// Need to tell Storybook we're now showing stories for Text component
const TextStoriesMeta: Meta<typeof Text> = {
  title: 'UI/Typography/Text', // Sub-path for organization
  component: Text,
  argTypes: {
    as: { control: 'select', options: ['p', 'span', 'div', 'label'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    weight: { control: 'select', options: ['light', 'normal', 'medium', 'semibold', 'bold'] },
    color: { control: 'select', options: ['default', 'muted', 'primary', 'destructive'] },
    italic: { control: 'boolean' },
    children: { control: 'text' },
  }
};

// This export is needed for Storybook to pick up Text stories correctly
// export const TextStoryFile = TextStoriesMeta; // Not the standard way, let's try separate stories

export const ParagraphDefault: StoryObj<typeof Text> = {
  render: (args) => <Text {...args} />, // Need render function if component changes
  args: { children: 'This is a default paragraph.', as: 'p', size: 'md' },
  // Attach argTypes specific to Text here if they differ widely or for Storybook to pick them up
  argTypes: TextStoriesMeta.argTypes,
};

export const SmallMuted: StoryObj<typeof Text> = {
  render: (args) => <Text {...args} />,
  args: { children: 'This is small, muted text.', as: 'p', size: 'sm', color: 'muted' },
  argTypes: TextStoriesMeta.argTypes,
};

export const LargeBoldPrimary: StoryObj<typeof Text> = {
  render: (args) => <Text {...args} />,
  args: { children: 'Large, bold, primary text.', as: 'div', size: 'lg', weight: 'bold', color: 'primary' },
  argTypes: TextStoriesMeta.argTypes,
};

export const ItalicSemibold: StoryObj<typeof Text> = {
  render: (args) => <Text {...args} />,
  args: { children: 'Italic and semibold.', as: 'span', italic: true, weight: 'semibold' },
  argTypes: TextStoriesMeta.argTypes,
};
