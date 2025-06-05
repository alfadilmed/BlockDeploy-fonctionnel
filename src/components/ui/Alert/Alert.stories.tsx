import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['info', 'success', 'warning', 'error', 'default'],
    },
    title: { control: 'text' },
    message: { control: 'text' }, // For Storybook, text is simpler. In app, can be ReactNode.
    showIcon: { control: 'boolean' },
    // onClose: { action: 'closed' }, // Storybook action
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const DefaultInfo: Story = {
  args: {
    variant: 'info',
    title: 'Information',
    message: 'This is an informational alert.',
    showIcon: true,
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Success!',
    message: 'Your action was completed successfully.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Warning',
    message: 'Something needs your attention.',
  },
};

export const ErrorWithClose: Story = {
  args: {
    variant: 'error',
    title: 'Error Occurred',
    message: 'Failed to process your request.',
    onClose: () => alert('Alert closed!'), // Simple alert for story
  },
};

export const NoTitle: Story = {
  args: {
    variant: 'default',
    message: 'This alert has no title, only a message.',
  },
};
