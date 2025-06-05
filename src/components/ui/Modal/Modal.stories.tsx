import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '../Button/Button'; // Assuming Button is available for trigger

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'centered', // Might need to adjust for modals
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    title: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    showCloseButton: { control: 'boolean' },
  },
};

export default meta;

const Template: StoryObj<typeof Modal> = (args) => {
  // Storybook doesn't handle isOpen state well directly in args for controlled components.
  // This is a common workaround for components like Modals in Storybook.
  const [isOpen, setIsOpen] = useState(args.isOpen || false);

  React.useEffect(() => {
    setIsOpen(args.isOpen || false);
  }, [args.isOpen]);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {args.children || (
          <>
            <p>This is the modal content. You can put anything here.</p>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsOpen(false)}>Confirm</Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export const Default: StoryObj<typeof Modal> = {
  ...Template,
  args: {
    title: 'Default Modal',
    isOpen: false, // Initial state for story, user clicks button to open
  },
};

export const LargeWithCustomContent: StoryObj<typeof Modal> = {
  ...Template,
  args: {
    title: 'Large Modal',
    size: 'lg',
    isOpen: false,
    children: (
      <div>
        <h4>Custom Content Here</h4>
        <p>More detailed information or a form can go here.</p>
        <img src="https://via.placeholder.com/400x200" alt="Placeholder" className="mt-2 rounded" />
      </div>
    ),
  },
};
