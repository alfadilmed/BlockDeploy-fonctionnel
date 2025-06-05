
import React, { useState } from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { Mail, User, MessageSquare, Send, MapPin, Phone } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock success response
    console.log('Form submitted:', formData);
    setSubmitMessage('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
    setIsSubmitting(false);
  };

  return (
    <div className="py-16 md:py-24 bg-brand-primary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Have questions, feedback, or need support? We're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-3 bg-brand-secondary p-8 rounded-xl shadow-xl border border-slate-700">
            <h2 className="text-2xl font-semibold text-white mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  id="name"
                  name="name"
                  label="Full Name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  iconLeft={<User size={18} />}
                  required
                />
                <Input
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  iconLeft={<Mail size={18} />}
                  required
                />
              </div>
              <Input
                id="subject"
                name="subject"
                label="Subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Regarding..."
                iconLeft={<MessageSquare size={18} />}
                required
              />
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message here..."
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-brand-accent-blue focus:border-brand-accent-blue outline-none transition-colors duration-200"
                  required
                />
              </div>
              {submitMessage && (
                <p className={`text-sm ${submitMessage.includes('Thank you') ? 'text-green-400' : 'text-red-400'}`}>
                  {submitMessage}
                </p>
              )}
              <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting} glowEffect="blue" iconLeft={<Send size={18}/>}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-2">
             <div className="bg-brand-secondary p-8 rounded-xl shadow-xl border border-slate-700 h-full">
                <h2 className="text-2xl font-semibold text-white mb-6">Contact Information</h2>
                <div className="space-y-6 text-slate-300">
                    <div className="flex items-start">
                        <MapPin size={24} className="text-brand-accent-blue mr-4 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-slate-100">Our Office</h3>
                            <p>123 Blockchain Avenue, Web3 City, Decentraland</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <Mail size={24} className="text-brand-accent-blue mr-4 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-slate-100">Email Us</h3>
                            <a href="mailto:support@blockdeploy.io" className="hover:text-brand-accent-blue transition-colors">support@blockdeploy.io</a><br/>
                            <a href="mailto:sales@blockdeploy.io" className="hover:text-brand-accent-blue transition-colors">sales@blockdeploy.io</a>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <Phone size={24} className="text-brand-accent-blue mr-4 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-slate-100">Call Us (Mon-Fri, 9am-5pm)</h3>
                            <p>+1 (555) 123-4567</p>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-700">
                    <h3 className="font-semibold text-slate-100 mb-2">Follow Us</h3>
                    <div className="flex space-x-4">
                        {/* Placeholder for social media icons */}
                        <a href="#" className="text-slate-400 hover:text-brand-accent-blue"><User size={20} /> {/* Replace with actual social icons */}</a>
                        <a href="#" className="text-slate-400 hover:text-brand-accent-blue"><User size={20} /></a>
                        <a href="#" className="text-slate-400 hover:text-brand-accent-blue"><User size={20} /></a>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
