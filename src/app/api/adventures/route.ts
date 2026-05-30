import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Adventure from '@/models/Adventure';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const id = searchParams.get('id');

    if (id) {
      const adventure = await Adventure.findOne({ id });
      if (!adventure) {
        return NextResponse.json({ error: 'Adventure not found' }, { status: 404 });
      }
      return NextResponse.json(adventure);
    }

    let query = {};
    if (category) {
      query = { category: { $regex: new RegExp(category, 'i') } };
    }

    const adventures = await Adventure.find(query);
    return NextResponse.json(adventures);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
