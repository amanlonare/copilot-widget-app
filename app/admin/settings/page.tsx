'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [settings, setSettings] = useState({
    shop_domain: 'dev-copilot-store.myshopify.com', // Default for dev
    bot_name: 'Copilot',
    primary_color: '#000000',
    welcome_message: 'Hi! How can I help you today?',
  });

  useEffect(() => {
    // Fetch current settings on load
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/widget/settings?shop=${settings.shop_domain}`);
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error('Failed to fetch settings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/widget/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      setSaveStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Widget Configuration</h1>
      
      <form onSubmit={handleSave} className="space-y-6 bg-white p-6 rounded-lg border shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shop Domain</label>
          <input
            type="text"
            value={settings.shop_domain}
            onChange={(e) => setSettings({ ...settings, shop_domain: e.target.value })}
            className="w-full p-2 border rounded-md bg-gray-50"
            disabled // Fixed for this merchant in a real app
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bot Name</label>
          <input
            type="text"
            value={settings.bot_name}
            onChange={(e) => setSettings({ ...settings, bot_name: e.target.value })}
            className="w-full p-2 border rounded-md"
            placeholder="e.target.value"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
          <div className="flex gap-4 items-center">
            <input
              type="color"
              value={settings.primary_color}
              onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
              className="h-10 w-20 cursor-pointer"
            />
            <input
              type="text"
              value={settings.primary_color}
              onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
              className="w-32 p-2 border rounded-md font-mono text-sm"
              maxLength={7}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Welcome Message</label>
          <textarea
            value={settings.welcome_message}
            onChange={(e) => setSettings({ ...settings, welcome_message: e.target.value })}
            className="w-full p-2 border rounded-md h-24"
            placeholder="Hi there! How can I help you?"
            required
          />
        </div>

        <button
          type="submit"
          disabled={saveStatus === 'saving'}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
            saveStatus === 'saving' ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'
          }`}
        >
          {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
        </button>

        {saveStatus === 'success' && (
          <p className="text-green-600 text-sm text-center">Settings saved successfully!</p>
        )}
        {saveStatus === 'error' && (
          <p className="text-red-600 text-sm text-center">Failed to save settings. Please check your connection.</p>
        )}
      </form>
    </div>
  );
}
