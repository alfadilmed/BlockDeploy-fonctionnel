import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
// import { Mail } from 'lucide-react'; // Example icon

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['text', 'password', 'email', 'number'] },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' }, // Or boolean for just error state
    disabled: { control: 'boolean' },
    // iconLeft: { control: 'object' },
    // iconRight: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'you@example.com',
  },
};

export const WithError: Story = {
  args: {
    label: 'Password',
    type: 'password',
    value: '123',
    error: 'Password too short',
  },
};

export const WithIconLeft: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search...',
    // iconLeft: <Mail size={16} />, // Example
  },
};
