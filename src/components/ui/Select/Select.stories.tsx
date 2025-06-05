import type { Meta, StoryObj } from '@storybook/react';
import { Select, SelectOption } from './Select';

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    // options requires a more complex control in Storybook or should be pre-defined
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const sampleOptions: SelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3 (Disabled)', disabled: true },
  { value: 'option4', label: 'Another Option' },
];

export const Default: Story = {
  args: {
    label: 'Choose an option',
    options: sampleOptions,
    placeholder: 'Select one...',
  },
};

export const WithError: Story = {
  args: {
    label: 'Selection with Error',
    options: sampleOptions,
    value: 'option1',
    error: 'This field is required.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Select',
    options: sampleOptions,
    placeholder: 'Cannot choose',
    disabled: true,
  },
};
