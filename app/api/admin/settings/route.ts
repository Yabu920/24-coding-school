import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst();
    if (!settings) {
      // Create default settings if none exist
      const defaultSettings = await prisma.settings.create({
        data: {
          theme: 'light',
          primary_color: '#000000',
          maintenance_mode: false,
          auto_backup: '',
        },
      });
      return NextResponse.json(defaultSettings, { status: 200 });
    }
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, theme, primary_color, maintenance_mode, auto_backup } = data;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updated = await prisma.settings.update({
      where: { id },
      data: {
        theme,
        primary_color,
        maintenance_mode,
        auto_backup,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
