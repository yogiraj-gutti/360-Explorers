import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Adventure from '@/models/Adventure';
import { adventures } from '@/data/adventures';

export async function GET() {
  try {
    await dbConnect();
    
    // Clear existing data
    await Adventure.deleteMany({});
    
    // Insert initial data
    await Adventure.insertMany(adventures);
    
    return NextResponse.json({ message: 'Database seeded successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
