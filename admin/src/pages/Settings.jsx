import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { Settings, MapPin, Phone, Mail, ShieldAlert, Save, Loader2 } from 'lucide-react';

const SettingsPage = () => {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/settings/admin`);
        if (res.data.success) {
          const { address, phone, email, adminEmail } = res.data.settings;
          setAddress(address || '');
          setPhone(phone || '');
          setEmail(email || '');
          setAdminEmail(adminEmail || '');
        }
      } catch (error) {
        console.error('Error fetching admin settings:', error);
        toast.error(error.response?.data?.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await axios.put(`${backendUrl}/api/settings/admin`, {
        address,
        phone,
        email,
        adminEmail,
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Settings updated successfully');
        const { address, phone, email, adminEmail } = res.data.settings;
        setAddress(address);
        setPhone(phone);
        setEmail(email);
        setAdminEmail(adminEmail);
      } else {
        toast.error(res.data.message || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 font-primary">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
        <p className="text-stone-400 text-xs uppercase tracking-widest">Loading configuration...</p>
      </div>
    );
  }

  return (
    <div className="w-full py-6 bg-white font-primary text-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-10 pb-4 border-b border-stone-100">
        <div>
          <h1 className="text-2xl uppercase tracking-tight text-gray-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-orange-500" /> Website Configuration
          </h1>
          <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">
            Global details and security controls for your temple portal
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="max-w-3xl space-y-8">
        {/* Contact Information Card */}
        <div className="bg-white border border-stone-200 rounded-sm p-6 space-y-6">
          <div className="border-b border-stone-100 pb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700">Contact Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-widest text-stone-500 font-bold">Public Phone Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+91 91234 56789"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 focus:border-orange-500 outline-none transition-all text-sm rounded-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-widest text-stone-500 font-bold">Public Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="info@banahattitemple.com"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 focus:border-orange-500 outline-none transition-all text-sm rounded-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-widest text-stone-500 font-bold">Public Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows="3"
              placeholder="SH 53, Rabkavi Banhatti, Bagalkot, Karnataka 587311"
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-orange-500 outline-none transition-all text-sm rounded-sm resize-none"
            ></textarea>
          </div>
        </div>

        {/* Admin Credentials Card */}
        <div className="bg-white border border-stone-200 rounded-sm p-6 space-y-6">
          <div className="border-b border-stone-100 pb-3 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700">Security & Access Settings</h3>
          </div>

          <div className="space-y-4">
            {/* Warning Callout */}
            <div className="p-4 bg-red-50 border border-red-100 rounded-sm text-red-700 text-xs leading-relaxed flex gap-3">
              <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold uppercase tracking-wider mb-1">Warning: Admin Login Email Change</p>
                <p>
                  Modifying this email address shifts the admin dashboard login access.
                  The next time you log in, you must use the updated email, and the OTP code will be sent to the new address.
                  Ensure you have full access to the target inbox.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-widest text-stone-500 font-bold">Admin Login Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                  placeholder="admin@banahattitemple.com"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 focus:border-orange-500 outline-none transition-all text-sm rounded-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-gray-900 hover:bg-orange-500 text-white uppercase tracking-[0.2em] text-xs font-bold transition-all flex items-center gap-2 rounded-sm disabled:bg-stone-300"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
