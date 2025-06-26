
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Trash2, Plus, Mail, Clock, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EmailContact {
  id: string;
  email: string;
  name: string;
}

const EmailSettings: React.FC = () => {
  const [frequency, setFrequency] = useState<string>('daily');
  const [customValue, setCustomValue] = useState<string>('1');
  const [customUnit, setCustomUnit] = useState<string>('hours');
  const [emailContacts, setEmailContacts] = useState<EmailContact[]>([]);
  const [newContactEmail, setNewContactEmail] = useState<string>('');
  const [newContactName, setNewContactName] = useState<string>('');
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const addEmailContact = () => {
    if (newContactEmail && newContactName) {
      const newContact: EmailContact = {
        id: Date.now().toString(),
        email: newContactEmail,
        name: newContactName
      };
      setEmailContacts([...emailContacts, newContact]);
      setNewContactEmail('');
      setNewContactName('');
    }
  };

  const removeEmailContact = (id: string) => {
    setEmailContacts(emailContacts.filter(contact => contact.id !== id));
  };

  const handleSaveSettings = () => {
    // Here you would typically save to localStorage or send to backend
    console.log('Saving email settings:', {
      enabled: isEnabled,
      frequency,
      customValue,
      customUnit,
      contacts: emailContacts
    });
    
    // For now, just show a success message
    alert('Email settings saved successfully!');
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Email Notification Settings</h1>
          <p className="text-slate-200">Configure email updates for PPE compliance monitoring</p>
        </div>
      </div>

      {/* Enable/Disable Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enable-emails"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <Label htmlFor="enable-emails">Enable email notifications</Label>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Emails will be sent from: cjmfetalino18@gmail.com
          </p>
        </CardContent>
      </Card>

      {/* Frequency Settings */}
      <Card className={!isEnabled ? 'opacity-50' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Update Frequency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={frequency} 
            onValueChange={setFrequency}
            disabled={!isEnabled}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="realtime" id="realtime" />
              <Label htmlFor="realtime" className="cursor-pointer">
                <div>
                  <div className="font-medium">Real-time</div>
                  <div className="text-sm text-gray-500">Emails sent every time a user enters or exits</div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hourly" id="hourly" />
              <Label htmlFor="hourly" className="cursor-pointer">
                <div>
                  <div className="font-medium">Hourly</div>
                  <div className="text-sm text-gray-500">Emails sent every hour</div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily" className="cursor-pointer">
                <div>
                  <div className="font-medium">Daily</div>
                  <div className="text-sm text-gray-500">Emails sent once every day</div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="cursor-pointer">
                <div>
                  <div className="font-medium">Custom</div>
                  <div className="text-sm text-gray-500">User-defined frequency</div>
                </div>
              </Label>
            </div>
          </RadioGroup>

          {/* Custom Frequency Input */}
          {frequency === 'custom' && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <Label className="text-sm font-medium">Custom Frequency</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  type="number"
                  min="1"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  className="w-20"
                  disabled={!isEnabled}
                />
                <select
                  value={customUnit}
                  onChange={(e) => setCustomUnit(e.target.value)}
                  disabled={!isEnabled}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                </select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Contacts */}
      <Card className={!isEnabled ? 'opacity-50' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Email Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add New Contact */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="contact-name">Name</Label>
                <Input
                  id="contact-name"
                  type="text"
                  placeholder="Contact name"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  disabled={!isEnabled}
                />
              </div>
              <div>
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="contact@example.com"
                  value={newContactEmail}
                  onChange={(e) => setNewContactEmail(e.target.value)}
                  disabled={!isEnabled}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={addEmailContact}
                  disabled={!isEnabled || !newContactEmail || !newContactName || !validateEmail(newContactEmail)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </div>
            </div>

            {/* Contact List */}
            {emailContacts.length > 0 && (
              <div className="space-y-2">
                <Label>Email Recipients</Label>
                <div className="space-y-2">
                  {emailContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-sm text-gray-500">{contact.email}</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeEmailContact(contact.id)}
                        disabled={!isEnabled}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {emailContacts.length === 0 && (
              <Alert>
                <AlertDescription>
                  No email contacts added yet. Add contacts to receive email notifications.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveSettings}
          disabled={!isEnabled || emailContacts.length === 0}
          className="px-6"
        >
          Save Email Settings
        </Button>
      </div>
    </div>
  );
};

export default EmailSettings;
