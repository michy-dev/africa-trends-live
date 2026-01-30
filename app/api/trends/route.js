import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

async function getGoogleTrends(artists, geo) {
  try {
    const googleTrends = require('google-trends-api');
    const result = await googleTrends.interestOverTime({
      keyword: artists,
      geo: geo,
      startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    });
    const data = JSON.parse(result);
    const scores = {};
    artists.forEach((a) => scores[a] = 0);
    data.default.timelineData.forEach(point => {
      point.value.forEach((v, i) => scores[artists[i]] += v);
    });
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const max = sorted[0][1] || 1;
    return sorted.map(([name, score]) => ({
      name,
      score: Math.round((score / max) * 100)
    }));
  } catch (e) {
    return artists.map(name => ({ name, score: 0 }));
  }
}

export async function GET() {
  const regions = {
    NIGERIA: { geo: 'NG', artists: ['Wizkid', 'Burna Boy', 'Davido', 'Asake'] },
    SOUTH_AFRICA: { geo: 'ZA', artists: ['Tyla', 'Kabza De Small', 'Nasty C'] },
    GHANA: { geo: 'GH', artists: ['Black Sherif', 'Sarkodie', 'Stonebwoy'] },
    KENYA: { geo: 'KE', artists: ['Diamond Platnumz', 'Sauti Sol', 'Zuchu'] }
  };

  const rankings = {};
  for (const [name, config] of Object.entries(regions)) {
    rankings[name] = await getGoogleTrends(config.artists, config.geo);
  }

  const data = {
    rankings,
    rising: [
      { name: 'Mavo', country: '🇳🇬', change: '+890%', reason: '"Tumo Weto" viral on TikTok' },
      { name: 'Shoday', country: '🇳🇬', change: '+720%', reason: '"Paparazzi" collab with FOLA' },
      { name: 'Vyroota', country: '🇺🇬', change: '+650%', reason: '"Kunsi" #1 in Uganda' },
      { name: 'Priesst', country: '🇳🇬', change: '+340%', reason: '"Akonuche" remix with Victony' },
      { name: 'Boy Muller', country: '🇳🇬', change: '+280%', reason: '"LAPOPIANO" crossover hit' }
    ],
    stories: [
      { type: 'Trending Song', hook: 'Wizkid & Asake\'s "Jogodo" hits 11M streams', headline: '"The REAL Vol. 1 Effect: How Wizkid & Asake Broke Records"', angles: ['Behind the collab', 'Producer spotlight', 'Fan reactions'] },
      { type: 'Rising Artist', hook: 'Mavo went from 0 to 1M listeners in 60 days', headline: '"From Lagos Streets to Global Playlists: The Mavo Story"', angles: ['Origin story', 'TikTok impact', 'What\'s next'] },
      { type: 'Podcast Story', hook: 'Ayra Starr podcast episode breaks records', headline: '"Why Ayra Starr\'s Interview Has Everyone Talking"', angles: ['Key quotes', 'Fan reactions', 'Career insights'] }
    ],
    audience: {
      cities: [
        { name: 'Lagos', flag: '🇳🇬', topArtist: 'Wizkid', searches: '2.4M' },
        { name: 'Johannesburg', flag: '🇿🇦', topArtist: 'Kabza De Small', searches: '1.8M' },
        { name: 'Nairobi', flag: '🇰🇪', topArtist: 'Sauti Sol', searches: '890K' },
        { name: 'Accra', flag: '🇬🇭', topArtist: 'Black Sherif', searches: '720K' }
      ]
    },
    spotify: {
      '🇳🇬 Nigeria': [
        { title: 'Jogodo', artist: 'Wizkid & Asake', streams: '607K' },
        { title: 'Turbulence', artist: 'Wizkid & Asake', streams: '493K' },
        { title: 'Alaye', artist: 'Wizkid & Asake', streams: '369K' },
        { title: 'MY HEALER', artist: 'Seyi Vibez & Omah Lay', streams: '306K' },
        { title: 'BODY (danz)', artist: 'CKay & Mavo', streams: '210K' }
      ],
      '🇿🇦 South Africa': [
        { title: 'Mnike', artist: 'Tyler ICU', streams: '285K' },
        { title: 'Tshwala Bam', artist: 'TitoM & Yuppe', streams: '264K' },
        { title: 'Water', artist: 'Tyla', streams: '228K' },
        { title: 'CHANEL', artist: 'Tyla', streams: '198K' },
        { title: 'Asibe Happy', artist: 'Kabza De Small', streams: '187K' }
      ]
    },
    updatedAt: new Date().toISOString()
  };

  return NextResponse.json(data);
}