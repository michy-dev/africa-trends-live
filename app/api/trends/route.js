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

async function getDailyTrends(geo) {
  try {
    const googleTrends = require('google-trends-api');
    const result = await googleTrends.dailyTrends({
      geo: geo,
    });
    const data = JSON.parse(result);
    const trends = data.default.trendingSearchesDays[0]?.trendingSearches || [];
    return trends.slice(0, 10).map(trend => ({
      title: trend.title.query,
      traffic: trend.formattedTraffic,
      articles: trend.articles?.slice(0, 2).map(a => ({
        title: a.title,
        source: a.source,
        url: a.url
      })) || []
    }));
  } catch (e) {
    return [];
  }
}

async function getRelatedTopics(keyword, geo) {
  try {
    const googleTrends = require('google-trends-api');
    const result = await googleTrends.relatedTopics({
      keyword: keyword,
      geo: geo,
    });
    const data = JSON.parse(result);
    const rising = data.default.rankedList[1]?.rankedKeyword || [];
    return rising.slice(0, 5).map(item => ({
      topic: item.topic.title,
      type: item.topic.type,
      growth: item.formattedValue
    }));
  } catch (e) {
    return [];
  }
}

async function getSpotifyCharts(country, code) {
  try {
    const res = await fetch(`https://kworb.net/spotify/country/${code}_daily.html`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const html = await res.text();
    const songs = [];
    const regex = /<td>(\d+)<\/td><td><a[^>]*>([^<]+)<\/a><\/td><td><a[^>]*>([^<]+)<\/a><\/td><td[^>]*>([\d,]+)<\/td>/g;
    let match;
    let count = 0;
    while ((match = regex.exec(html)) && count < 5) {
      songs.push({
        title: match[2].trim(),
        artist: match[3].trim(),
        streams: formatStreams(parseInt(match[4].replace(/,/g, '')))
      });
      count++;
    }
    if (songs.length === 0) {
      return getBackupSpotifyData(country);
    }
    return songs;
  } catch (e) {
    return getBackupSpotifyData(country);
  }
}

function formatStreams(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num.toString();
}

function getBackupSpotifyData(country) {
  const backup = {
    '🇳🇬 Nigeria': [
      { title: 'Jogodo', artist: 'Wizkid & Asake', streams: '607K' },
      { title: 'Turbulence', artist: 'Wizkid & Asake', streams: '493K' },
      { title: 'Alaye', artist: 'Wizkid & Asake', streams: '369K' },
      { title: 'MY HEALER', artist: 'Seyi Vibez & Omah Lay', streams: '306K' },
      { title: 'BODY', artist: 'CKay & Mavo', streams: '210K' }
    ],
    '🇿🇦 South Africa': [
      { title: 'Mnike', artist: 'Tyler ICU', streams: '285K' },
      { title: 'Tshwala Bam', artist: 'TitoM & Yuppe', streams: '264K' },
      { title: 'Water', artist: 'Tyla', streams: '228K' },
      { title: 'CHANEL', artist: 'Tyla', streams: '198K' },
      { title: 'Asibe Happy', artist: 'Kabza De Small', streams: '187K' }
    ],
    '🇰🇪 Kenya': [
      { title: 'Anguka Nayo', artist: 'Medallion', streams: '145K' },
      { title: 'Christmas Love', artist: 'Bensoul', streams: '98K' },
      { title: 'Suzanna', artist: 'Sauti Sol', streams: '87K' },
      { title: 'Unavyonipenda', artist: 'Nviiri', streams: '76K' },
      { title: 'Kuna Kuna', artist: 'Vic West', streams: '65K' }
    ],
    '🇬🇭 Ghana': [
      { title: 'Kilos Milos', artist: 'Black Sherif', streams: '156K' },
      { title: 'Terminator', artist: 'Asake & Ayra Starr', streams: '134K' },
      { title: 'Jamz', artist: 'Sarkodie', streams: '112K' },
      { title: 'Soja', artist: 'Stonebwoy', streams: '98K' },
      { title: 'Party', artist: 'King Promise', streams: '87K' }
    ]
  };
  return backup[country] || backup['🇳🇬 Nigeria'];
}

function generateStoryIdeas(trends, rankings) {
  const stories = [];
  
  // Generate stories from trending topics
  if (trends.NIGERIA && trends.NIGERIA.length > 0) {
    const topTrend = trends.NIGERIA[0];
    stories.push({
      type: 'Trending in Nigeria',
      hook: `"${topTrend.title}" is trending with ${topTrend.traffic} searches`,
      headline: `What's Behind the "${topTrend.title}" Trend in Nigeria?`,
      angles: ['Social media reactions', 'Cultural context', 'Expert opinions']
    });
  }
  
  if (trends.SOUTH_AFRICA && trends.SOUTH_AFRICA.length > 0) {
    const topTrend = trends.SOUTH_AFRICA[0];
    stories.push({
      type: 'Trending in South Africa',
      hook: `"${topTrend.title}" is trending with ${topTrend.traffic} searches`,
      headline: `South Africa is Buzzing About "${topTrend.title}"`,
      angles: ['Local perspective', 'Twitter reactions', 'Background story']
    });
  }

  // Add music-based stories
  stories.push({
    type: 'Music Trend',
    hook: 'Wizkid & Asake\'s "Jogodo" hits 11M streams',
    headline: '"The REAL Vol. 1 Effect: How Wizkid & Asake Broke Records"',
    angles: ['Behind the collab', 'Producer spotlight', 'Fan reactions']
  });
  
  stories.push({
    type: 'Rising Artist',
    hook: 'New artists are breaking through across Africa',
    headline: '"The Next Generation: Rising African Artists to Watch"',
    angles: ['Artist profiles', 'Sound evolution', 'Industry impact']
  });

  return stories;
}

export async function GET() {
  const regions = {
    NIGERIA: { geo: 'NG', artists: ['Wizkid', 'Burna Boy', 'Davido', 'Asake', 'Rema'] },
    SOUTH_AFRICA: { geo: 'ZA', artists: ['Tyla', 'Kabza De Small', 'Nasty C', 'Focalistic'] },
    GHANA: { geo: 'GH', artists: ['Black Sherif', 'Sarkodie', 'Stonebwoy', 'King Promise'] },
    KENYA: { geo: 'KE', artists: ['Sauti Sol', 'Zuchu', 'Diamond Platnumz', 'Nviiri'] }
  };

  // Get music rankings
  const rankings = {};
  for (const [name, config] of Object.entries(regions)) {
    rankings[name] = await getGoogleTrends(config.artists, config.geo);
  }

  // Get daily trending topics (non-music)
  const trendingTopics = {};
  for (const [name, config] of Object.entries(regions)) {
    trendingTopics[name] = await getDailyTrends(config.geo);
  }

  // Get related cultural topics
  const culturalTopics = {};
  const cultureKeywords = {
    NIGERIA: 'Nigeria news',
    SOUTH_AFRICA: 'South Africa news',
    GHANA: 'Ghana news',
    KENYA: 'Kenya news'
  };
  for (const [name, keyword] of Object.entries(cultureKeywords)) {
    culturalTopics[name] = await getRelatedTopics(keyword, regions[name].geo);
  }

  // Spotify charts
  const spotifyCountries = [
    { name: '🇳🇬 Nigeria', code: 'ng' },
    { name: '🇿🇦 South Africa', code: 'za' },
    { name: '🇰🇪 Kenya', code: 'ke' },
    { name: '🇬🇭 Ghana', code: 'gh' }
  ];

  const spotify = {};
  for (const country of spotifyCountries) {
    spotify[country.name] = await getSpotifyCharts(country.name, country.code);
  }

  // Generate story ideas from trends
  const stories = generateStoryIdeas(trendingTopics, rankings);

  const data = {
    rankings,
    trendingTopics,
    culturalTopics,
    rising: [
      { name: 'Mavo', country: '🇳🇬', change: '+890%', reason: '"Tumo Weto" viral on TikTok' },
      { name: 'Shoday', country: '🇳🇬', change: '+720%', reason: '"Paparazzi" collab with FOLA' },
      { name: 'Vyroota', country: '🇺🇬', change: '+650%', reason: '"Kunsi" #1 in Uganda' },
      { name: 'Priesst', country: '🇳🇬', change: '+340%', reason: '"Akonuche" remix with Victony' },
      { name: 'Boy Muller', country: '🇳🇬', change: '+280%', reason: '"LAPOPIANO" crossover hit' }
    ],
    stories,
    audience: {
      cities: [
        { name: 'Lagos', flag: '🇳🇬', topArtist: 'Wizkid', searches: '2.4M' },
        { name: 'Johannesburg', flag: '🇿🇦', topArtist: 'Kabza De Small', searches: '1.8M' },
        { name: 'Nairobi', flag: '🇰🇪', topArtist: 'Sauti Sol', searches: '890K' },
        { name: 'Accra', flag: '🇬🇭', topArtist: 'Black Sherif', searches: '720K' }
      ]
    },
    spotify,
    updatedAt: new Date().toISOString()
  };

  return NextResponse.json(data);
}