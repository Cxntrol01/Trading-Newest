import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch(
            'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
            { cache: 'no-store' }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch Binance price');
        }

        const data = await response.json();

        return NextResponse.json({ price: data.price });
    } catch (error) {
        return NextResponse.json(
            { error: 'Error fetching Binance price' },
            { status: 500 }
        );
    }
}
