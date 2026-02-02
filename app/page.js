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
        {tabs.map((tab) => (
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

        {activeTab === 'stories' && (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '18px' }}>✍️ Story Ideas from Latest News</h2>
            
            {data?.stories && data.stories.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                {data.stories.map((story, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '11px', color: '#1DB954', textTransform: 'uppercase' }}>{story.type}</span>
                      {story.date && <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{story.date}</span>}
                    </div>
                    <h4 style={{ margin: '0 0 8px', fontSize: '15px', lineHeight: '1.4' }}>{story.headline}</h4>
                    {story.source && (
                      <p style={{ margin: '0 0 12px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                        Source: {story.source}
                      </p>
                    )}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                      {story.angles.map((angle, j) => (
                        <span key={j} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '11px' }}>{angle}</span>
                      ))}
                    </div>
                    {story.url && (
                      <a href={story.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#1DB954', textDecoration: 'none' }}>
                        Read full article →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            {data?.news && (
              <div>
                <h3 style={{ margin: '32px 0 16px', fontSize: '16px' }}>📰 Latest Headlines by Category</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                  {Object.entries(data.news).map(([category, articles]) => (
                    <div key={category} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
                      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(29,185,84,0.1)' }}>
                        <h4 style={{ margin: 0, fontSize: '14px', color: '#1DB954' }}>
                          {category === 'afrobeats' && '🎵 Afrobeats'}
                          {category === 'amapiano' && '🇿🇦 Amapiano'}
                          {category === 'nigeriaCulture' && '🇳🇬 Nigeria Culture'}
                          {category === 'southAfricaCulture' && '🇿🇦 SA Culture'}
                          {category === 'africanMusic' && '🌍 African Music Industry'}
                        </h4>
                      </div>
                      <div style={{ padding: '12px 20px' }}>
                        {articles.slice(0, 4).map((article, i) => (
                          <a key={i} href={article.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '10px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none', textDecoration: 'none', color: '#fff' }}>
                            <div style={{ fontSize: '13px', lineHeight: '1.4', marginBottom: '4px' }}>{article.title}</div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{article.source} • {article.date}</div>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'audience' && (
          <div>
            <h2 style={{ margin: '0 0 8px', fontSize: '18px' }}>👥 Audience Insights by City</h2>
            <p style={{ margin: '0 0 24px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Select a city to see live music trends and news</p>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {['Lagos', 'Port Harcourt', 'Ibadan', 'Abuja', 'Benin City', 'Johannesburg', 'Nairobi', 'Accra'].map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  style={{
                    padding: '10px 20px',
                    background: selectedCity === city ? '#1DB954' : 'rgba(255,255,255,0.05)',
                    border: '1px solid ' + (selectedCity === city ? '#1DB954' : 'rgba(255,255,255,0.1)'),
                    borderRadius: '100px',
                    color: selectedCity === city ? '#000' : '#fff',
                    fontSize: '13px',
                    fontWeight: selectedCity === city ? '600' : '400',
                    cursor: 'pointer'
                  }}
                >
                  {city === 'Lagos' || city === 'Port Harcourt' || city === 'Ibadan' || city === 'Abuja' || city === 'Benin City' ? '🇳🇬' : city === 'Johannesburg' ? '🇿🇦' : city === 'Nairobi' ? '🇰🇪' : '🇬🇭'} {city}
                </button>
              ))}
            </div>

            {selectedCity && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '36px' }}>
                      {selectedCity === 'Lagos' || selectedCity === 'Port Harcourt' || selectedCity === 'Ibadan' || selectedCity === 'Abuja' || selectedCity === 'Benin City' ? '🇳🇬' : selectedCity === 'Johannesburg' ? '🇿🇦' : selectedCity === 'Nairobi' ? '🇰🇪' : '🇬🇭'}
                    </span>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '20px' }}>{selectedCity}</h3>
                      <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Live music & entertainment trends</p>
                    </div>
                  </div>
                  <div style={{ padding: '16px', background: 'rgba(29,185,84,0.1)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Top Artist</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img 
                        src={getArtistImage(data?.audience?.cities?.find(c => c.name === selectedCity)?.topArtist || 'Wizkid')} 
                        alt="Top Artist"
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontSize: '18px', fontWeight: '600', color: '#1DB954' }}>
                        {data?.audience?.cities?.find(c => c.name === selectedCity)?.topArtist || 'Loading...'}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px' }}>
                  <h4 style={{ margin: '0 0 16px', fontSize: '14px', color: '#1DB954' }}>📰 Live News in {selectedCity}</h4>
                  {data?.cityTrends && data.cityTrends[selectedCity] && data.cityTrends[selectedCity].length > 0 ? (
                    data.cityTrends[selectedCity].map((item, i) => (
                      <a 
                        key={i} 
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'block', padding: '10px 0', borderBottom: i < data.cityTrends[selectedCity].length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', textDecoration: 'none', color: '#fff' }}
                      >
                        <div style={{ fontSize: '13px', marginBottom: '4px' }}>{item.title}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{item.source}</div>
                      </a>
                    ))
                  ) : (
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Loading news...</p>
                  )}
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px' }}>
                  <h4 style={{ margin: '0 0 16px', fontSize: '14px', color: '#1DB954' }}>🔍 Popular Searches</h4>
                  {[
                    `${selectedCity} concerts 2026`,
                    `${selectedCity} nightlife`,
                    `Afrobeats ${selectedCity}`,
                    `${selectedCity} music events`,
                    `Artists from ${selectedCity}`
                  ].map((search, i) => (
                    
                      key={i}
                      href={`https://www.google.com/search?q=${encodeURIComponent(search)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none', textDecoration: 'none', color: '#fff' }}
                    >
                      <span style={{ fontSize: '13px' }}>{search}</span>
                      <span style={{ fontSize: '11px', color: '#1DB954' }}>→</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
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
            <h2 style={{ margin: '0 0 24px', fontSize: '18px' }}>🎭 Trending Topics by Region</h2>
            
            {data?.trendingTopics && Object.keys(data.trendingTopics).length > 0 ? (
              Object.entries(data.trendingTopics).map(([region, trends]) => (
                <div key={region} style={{ marginBottom: '32px' }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '14px', color: '#1DB954' }}>
                    {region === 'NIGERIA' && '🇳🇬 '}{region === 'SOUTH_AFRICA' && '🇿🇦 '}{region === 'GHANA' && '🇬🇭 '}{region === 'KENYA' && '🇰🇪 '}{region.replace('_', ' ')} - Whats Trending
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                    {trends.slice(0, 6).map((trend, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '600' }}>{trend.title}</span>
                          <span style={{ padding: '4px 10px', background: 'rgba(244,67,54,0.2)', color: '#F44336', borderRadius: '100px', fontSize: '10px' }}>🔥 {trend.traffic}</span>
                        </div>
                        {trend.articles && trend.articles.length > 0 && trend.articles[0] && (
                          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                            📰 {trend.articles[0].source}: {trend.articles[0].title ? trend.articles[0].title.substring(0, 50) : ''}...
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'rgba(255,255,255,0.5)' }}>Loading trending topics...</p>
            )}

            <h3 style={{ margin: '32px 0 16px', fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>💔 Mood Playlists</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              {[
                { mood: 'Heartbreak Season', emoji: '💔', color: '#E91E63', artists: 'Omah Lay, Oxlade, Ayra Starr' },
                { mood: 'Road Trip Vibes', emoji: '🚗', color: '#FF9800', artists: 'Burna Boy, Rema, CKay' },
                { mood: 'Late Night Feels', emoji: '🌙', color: '#9C27B0', artists: 'Cruel Santino, Tay Iwar, BNXN' },
                { mood: 'Gym & Workout', emoji: '💪', color: '#F44336', artists: 'Asake, Shallipopi, Focalistic' },
                { mood: 'Wedding Season', emoji: '💒', color: '#E91E63', artists: 'Davido, Tiwa Savage, Flavour' },
                { mood: 'Focus & Study', emoji: '📚', color: '#2196F3', artists: 'Amaarae, Odunsi, Lady Donli' }
              ].map((item, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', borderLeft: '3px solid ' + item.color }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.emoji}</div>
                  <h4 style={{ margin: '0 0 8px', fontSize: '15px' }}>{item.mood}</h4>
                  <div style={{ fontSize: '12px', color: '#1DB954' }}>{item.artists}</div>
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
                    {group.tags.map((tag) => (
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