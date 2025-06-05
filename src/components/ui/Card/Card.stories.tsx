import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../Button/Button'; // Example content

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'padded', // Cards usually need some space around them
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outlined', 'elevated'],
    },
    padding: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg'],
    },
    children: { control: 'object' }, // Can show source but not directly edit complex children
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    variant: 'default',
    padding: 'md',
    children: (
      <div>
        <h3 className="text-lg font-semibold mb-2">Card Title</h3>
        <p className="text-sm text-muted-foreground mb-4">This is some card content. It can be a paragraph or other elements.</p>
        <Button size="sm">Action</Button>
      </div>
    ),
    className: "w-80", // Example width for story
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    padding: 'lg',
    children: (
      <div>
        <h3 className="text-xl font-bold mb-3">Elevated Card</h3>
        <p>This card has a shadow and larger padding.</p>
      </div>
    ),
    className: "w-80",
  },
};

export const OutlinedWithNoPadding: Story = {
  args: {
    variant: 'outlined',
    padding: 'none',
    children: <img src="https://via.placeholder.com/300x150" alt="Placeholder" className="rounded-lg" />,
    className: "w-fit", // Fit to content
  },
};
