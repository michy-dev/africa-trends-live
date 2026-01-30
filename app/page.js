'use client';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState('rankings');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/trends');
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'rankings', label: '📊 Rankings' },
    { id: 'rising', label: '🚀 Rising' },
    { id: 'stories', label: '✍️ Stories' },
    { id: 'audience', label: '👥 Audience' },
    { id: 'spotify', label: '💚 Spotify' },
    { id: 'culture', label: '🎭 Culture' },
    { id: 'hashtags', label: '#️⃣ Hashtags' }
  ];

  const getFlag = (region) => {
    const flags = { NIGERIA: '🇳🇬', SOUTH_AFRICA: '🇿🇦', GHANA: '🇬🇭', KENYA: '🇰🇪', USA: '🇺🇸', UK: '🇬🇧' };
    return flags[region] || '🌍';
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#121212', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌍</div>
          <div style={{ fontSize: '18px' }}>Loading Africa Trends...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#121212', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px' }}>🌍 Africa Music Trends</h1>
            <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Live data • Updates hourly</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ padding: '8px 16px', background: 'rgba(29,185,84,0.1)', borderRadius: '8px', color: '#1DB954', fontSize: '12px' }}>
              🟢 Live • Updated: {lastUpdated}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0 32px', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '14px 24px', background: 'transparent', border: 'none', borderBottom: activeTab === tab.id ? '2px solid #1DB954' : '2px solid transparent', color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ padding: '32px' }}>
        {activeTab === 'rankings' && data?.rankings && (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '18px' }}>📊 Google Trends Rankings</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {Object.entries(data.rankings).map(([region, artists]) => (
                <div key={region} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '24px' }}>{getFlag(region)}</span>
                    <h3 style={{ margin: 0, fontSize: '15px' }}>{region.replace('_', ' ')}</h3>
                  </div>
                  {artists.map((artist, i) => (
                    <div key={artist.name} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: i < artists.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: i < 3 ? ['#FFD700','#C0C0C0','#CD7F32'][i] : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: i < 3 ? '#000' : '#fff', marginRight: '10px' }}>{i+1}</span>
                      <span style={{ flex: 1, fontSize: '13px' }}>{artist.name}</span>
                      <span style={{ fontSize: '12px', color: i === 0 ? '#1DB954' : 'rgba(255,255,255,0.5)' }}>{artist.score}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rising' && data?.rising && (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '18px' }}>🚀 Rising Artists</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {data.rising.map((artist, i) => (
                <div key={i} style={{ background: 'linear-gradient(135deg, rgba(29,185,84,0.15) 0%, rgba(29,185,84,0.05) 100%)', border: '1px solid rgba(29,185,84,0.3)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '18px', fontWeight: '700' }}>{artist.name}</span>
                      <span style={{ marginLeft: '8px' }}>{artist.country}</span>
                    </div>
                    <span style={{ padding: '6px 12px', background: '#1DB954', color: '#000', borderRadius: '100px', fontSize: '13px', fontWeight: '700' }}>{artist.change}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>📈 {artist.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stories' && data?.stories && (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '18px' }}>✍️ Story Ideas</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
              {data.stories.map((story, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>{story.type}</span>
                    <span style={{ padding: '4px 10px', background: 'rgba(244,67,54,0.2)', color: '#F44336', borderRadius: '100px', fontSize: '10px' }}>🔥 HOT</span>
                  </div>
                  <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{story.hook}</p>
                  <h4 style={{ margin: '0 0 12px', fontSize: '15px', color: '#1DB954' }}>{story.headline}</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {story.angles.map((angle, j) => (
                      <span key={j} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '11px' }}>{angle}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'audience' && data?.audience && (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '18px' }}>👥 Audience Insights</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
              {data.audience.cities.map((city, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '20px' }}>{city.flag}</span>
                    <span style={{ fontSize: '16px', fontWeight: '600' }}>{city.name}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Top Artist: <span style={{ color: '#1DB954' }}>{city.topArtist}</span></div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Searches: {city.searches}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'spotify' && data?.spotify && (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '18px' }}>💚 Spotify Charts</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {Object.entries(data.spotify).map(([country, songs]) => (
                <div key={country} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ margin: 0, fontSize: '15px' }}>{country} Top 5</h3>
                  </div>
                  <div style={{ padding: '12px 20px' }}>
                    {songs.map((song, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                        <span style={{ width: '22px', height: '22px', borderRadius: '4px', background: i < 3 ? '#1DB954' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: i < 3 ? '#000' : '#fff', marginRight: '10px' }}>{i+1}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: '600' }}>{song.title}</div>
                          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{song.artist}</div>
                        </div>
                        <span style={{ fontSize: '12px', color: '#1DB954' }}>{song.streams}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'culture' && (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '18px' }}>🎭 Culture & Story Angles</h2>
            <h3 style={{ margin: '0 0 16px', fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>💔 Mood Playlists</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              {[
                { mood: 'Heartbreak Season', emoji: '💔', color: '#E91E63', artists: 'Omah Lay, Oxlade, Ayra Starr' },
                { mood: 'Road Trip Vibes', emoji: '🚗', color: '#FF9800', artists: 'Burna Boy, Rema, CKay' },
                { mood: 'Late Night Feels', emoji: '🌙', color: '#9C27B0', artists: 'Cruel Santino, Tay Iwar, BNXN' },
                { mood: 'Gym & Workout', emoji: '💪', color: '#F44336', artists: 'Asake, Shallipopi, Focalistic' },
                { mood: 'Wedding Season', emoji: '💒', color: '#E91E63', artists: 'Davido, Tiwa Savage, Flavour' },
                { mood: 'Focus & Study', emoji: '📚', color: '#2196F3', artists: 'Amaarae, Odunsi, Lady Donli' }
              ].map((item, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', borderLeft: `3px solid ${item.color}` }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.emoji}</div>
                  <h4 style={{ margin: '0 0 8px', fontSize: '15px' }}>{item.mood}</h4>
                  <div style={{ fontSize: '12px', color: '#1DB954' }}>{item.artists}</div>
                </div>
              ))}
            </div>
            <h3 style={{ margin: '0 0 16px', fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>🎙️ Hot Topics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {[
                { topic: 'Nigeria vs South Africa Rivalry', heat: 95 },
                { topic: 'IShowSpeed Africa Tour', heat: 88 },
                { topic: 'Dating Culture in Africa', heat: 82 },
                { topic: 'AFCON 2025 Culture', heat: 85 },
                { topic: 'Mental Health Awareness', heat: 76 }
              ].map((item, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px' }}>{item.topic}</span>
                  <span style={{ padding: '4px 10px', background: item.heat > 85 ? 'rgba(244,67,54,0.2)' : 'rgba(255,152,0,0.2)', color: item.heat > 85 ? '#F44336' : '#FF9800', borderRadius: '100px', fontSize: '11px', fontWeight: '600' }}>🔥 {item.heat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'hashtags' && (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '18px' }}>#️⃣ Trending Hashtags</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {[
                { title: '🇳🇬 Afrobeats', tags: ['#Afrobeats2026', '#WizkidNewMusic', '#AsakeReal', '#BurnaBoy', '#Davido'] },
                { title: '🇿🇦 Amapiano', tags: ['#Amapiano', '#TylaWater', '#KabzaDeSmall', '#Amapiano2026'] },
                { title: '🌍 Pan-African', tags: ['#AfricanMusic', '#AfroBeatsGlobal', '#Afrofusion', '#AfricaRising'] },
                { title: '🎧 Vibes', tags: ['#AfroVibes', '#ChillAfrobeats', '#AfroSoul', '#MidnightVibes'] }
              ].map((group, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '15px' }}>{group.title}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {group.tags.map(tag => (
                      <span key={tag} style={{ padding: '6px 12px', background: 'rgba(29,185,84,0.15)', borderRadius: '100px', fontSize: '12px', color: '#1DB954' }}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}