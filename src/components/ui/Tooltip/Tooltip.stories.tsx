import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import { Button } from '../Button/Button';

const meta: Meta<typeof Tooltip> = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    content: { control: 'text' },
    position: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: 'This is a tooltip!',
    children: <Button variant="outline">Hover me</Button>,
  },
};

export const PositionBottom: Story = {
  args: {
    content: 'Tooltip at the bottom.',
    position: 'bottom',
    children: <span className="border border-dashed p-2">Hover this text</span>,
  },
};

export const LongText: Story = {
  args: {
    content: 'This is a much longer tooltip content to see how it wraps or handles overflow.',
    children: <Button variant="secondary">Long Tooltip</Button>,
    tooltipClassName: "w-40 text-center", // Example for custom styling
  },
};
