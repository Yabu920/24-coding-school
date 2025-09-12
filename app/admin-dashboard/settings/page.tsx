'use client'

import { useEffect, useState } from 'react'
import { prisma } from '@/lib/prisma' // for type imports if needed

type Settings = {
  id: string
  theme: 'light' | 'dark'
  primary_color: string
  maintenance_mode: boolean
  auto_backup: 'daily' | 'weekly' | 'monthly' | ''
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch settings from your API
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings')
        if (!res.ok) throw new Error('Failed to fetch settings')
        const data: Settings = await res.json()
        setSettings(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSave = async () => {
    if (!settings) return
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error('Failed to update settings')
      alert('Settings updated successfully!')
    } catch (error) {
      console.error(error)
      alert('Error updating settings')
    }
  }

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded space-y-6">
      <h1 className="text-2xl font-bold">Admin Settings</h1>

      {/* Theme */}
      <div>
        <label className="block mb-2 font-medium">Theme</label>
        <select
          value={settings?.theme || 'light'}
          onChange={(e) =>
            setSettings(prev =>
              prev ? { ...prev, theme: e.target.value as 'light' | 'dark' } : prev
            )
          }
          className="border p-2 rounded w-full"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      {/* Primary Color */}
      <div>
        <label className="block mb-2 font-medium">Primary Color</label>
        <input
          type="color"
          value={settings?.primary_color || '#000000'}
          onChange={(e) =>
            setSettings(prev => prev ? { ...prev, primary_color: e.target.value } : prev)
          }
          className="w-16 h-10 p-1 border rounded"
        />
      </div>

      {/* Maintenance Mode */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={settings?.maintenance_mode || false}
          onChange={(e) =>
            setSettings(prev =>
              prev ? { ...prev, maintenance_mode: e.target.checked } : prev
            )
          }
          id="maintenance"
          className="w-4 h-4"
        />
        <label htmlFor="maintenance" className="font-medium">Maintenance Mode</label>
      </div>

      {/* Auto Backup */}
      <div>
        <label className="block mb-2 font-medium">Auto Backup Frequency</label>
        <select
          value={settings?.auto_backup || ''}
          onChange={(e) =>
            setSettings(prev =>
              prev ? { ...prev, auto_backup: e.target.value as 'daily' | 'weekly' | 'monthly' | '' } : prev
            )
          }
          className="border p-2 rounded w-full"
        >
          <option value="">Select Frequency</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Settings
      </button>
    </div>
  )
}
