import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// Enhanced Content Row Component with Ratings and Downloads
export const EnhancedContentRow = ({ title, content, addToMyList, removeFromMyList, myList, addToDownloads, rateContent, ratings, theme, profile }) => {
  const navigate = useNavigate();
  const scrollRef = React.useRef(null);
  const [showRatingModal, setShowRatingModal] = useState(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const isInMyList = (contentId) => {
    return myList.some(item => item.id === contentId);
  };

  const handleRating = (contentId, rating) => {
    rateContent(contentId, rating);
    setShowRatingModal(null);
  };

  const filteredContent = profile?.isKid 
    ? content.filter(item => !item.adult && (item.genre_ids?.includes(10751) || item.genre_ids?.includes(16)))
    : content;

  return (
    <div className="mb-8">
      <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'} mb-4 px-4`}>{title}</h2>
      <div className="relative group">
        {/* Left Arrow */}
        <button 
          onClick={() => scroll('left')}
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 ${theme === 'dark' ? 'bg-black/50 text-white' : 'bg-white/50 text-black'} p-2 rounded-r-md opacity-0 group-hover:opacity-100 transition-opacity`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Content Slider */}
        <div 
          ref={scrollRef}
          className="flex space-x-2 overflow-x-auto scrollbar-hide px-4 pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredContent.map((item) => (
            <div 
              key={item.id} 
              className="flex-shrink-0 w-40 md:w-48 group/item cursor-pointer relative"
              onClick={() => navigate(`/watch/${item.id}`)}
            >
              <div className="relative overflow-hidden rounded-md">
                <img 
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path || item.backdrop_path}`}
                  alt={item.title || item.name}
                  className="w-full h-60 object-cover group-hover/item:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/300x450/141414/ffffff?text=${encodeURIComponent(item.title || item.name)}`;
                  }}
                />
                
                {/* Rating Display */}
                {ratings[item.id] && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">
                    ★ {ratings[item.id]}
                  </div>
                )}

                {/* Hover Overlay */}
                <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/60' : 'bg-white/60'} opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-end`}>
                  <div className="p-3 w-full">
                    <h3 className={`${theme === 'dark' ? 'text-white' : 'text-black'} text-sm font-semibold line-clamp-2`}>{item.title || item.name}</h3>
                    <div className="flex items-center mt-2 space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/watch/${item.id}`);
                        }}
                        className={`${theme === 'dark' ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'} rounded-full p-1`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isInMyList(item.id)) {
                            removeFromMyList(item.id);
                          } else {
                            addToMyList(item);
                          }
                        }}
                        className={`${theme === 'dark' ? 'bg-gray-800/80 text-white hover:bg-gray-700' : 'bg-gray-200/80 text-black hover:bg-gray-300'} rounded-full p-1`}
                      >
                        {isInMyList(item.id) ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        )}
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToDownloads(item);
                        }}
                        className={`${theme === 'dark' ? 'bg-gray-800/80 text-white hover:bg-gray-700' : 'bg-gray-200/80 text-black hover:bg-gray-300'} rounded-full p-1`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowRatingModal(item.id);
                        }}
                        className={`${theme === 'dark' ? 'bg-gray-800/80 text-white hover:bg-gray-700' : 'bg-gray-200/80 text-black hover:bg-gray-300'} rounded-full p-1`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Right Arrow */}
        <button 
          onClick={() => scroll('right')}
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 ${theme === 'dark' ? 'bg-black/50 text-white' : 'bg-white/50 text-black'} p-2 rounded-l-md opacity-0 group-hover:opacity-100 transition-opacity`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg max-w-sm w-full mx-4`}>
            <h3 className={`${theme === 'dark' ? 'text-white' : 'text-black'} text-lg font-semibold mb-4`}>Rate this content</h3>
            <div className="flex justify-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(showRatingModal, star)}
                  className="text-3xl hover:scale-110 transition-transform"
                >
                  <span className={ratings[showRatingModal] >= star ? 'text-yellow-500' : 'text-gray-400'}>★</span>
                </button>
              ))}
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowRatingModal(null)}
                className={`flex-1 px-4 py-2 ${theme === 'dark' ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-gray-200 text-black hover:bg-gray-300'} rounded`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Top 10 Component
export const Top10Row = ({ content, theme, profile, navigate }) => {
  const filteredContent = profile?.isKid 
    ? content.filter(item => !item.adult && (item.genre_ids?.includes(10751) || item.genre_ids?.includes(16)))
    : content;

  return (
    <div className="mb-8">
      <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'} mb-4 px-4`}>
        🔥 Top 10 in Your Country
      </h2>
      <div className="flex space-x-2 overflow-x-auto scrollbar-hide px-4 pb-2">
        {filteredContent.slice(0, 10).map((item, index) => (
          <div 
            key={item.id} 
            className="flex-shrink-0 w-40 md:w-48 cursor-pointer group relative"
            onClick={() => navigate(`/watch/${item.id}`)}
          >
            <div className="relative">
              {/* Large Number */}
              <div className="absolute -left-4 bottom-0 z-10">
                <span className="text-6xl font-black text-white" style={{ 
                  WebkitTextStroke: '2px black',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}>
                  {index + 1}
                </span>
              </div>
              
              <img 
                src={`https://image.tmdb.org/t/p/w300${item.poster_path || item.backdrop_path}`}
                alt={item.title || item.name}
                className="w-full h-60 object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/300x450/141414/ffffff?text=${encodeURIComponent(item.title || item.name)}`;
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Recently Added Component
export const RecentlyAddedRow = ({ content, theme, profile, navigate }) => {
  const recentContent = content
    .filter(item => profile?.isKid ? (!item.adult && (item.genre_ids?.includes(10751) || item.genre_ids?.includes(16))) : true)
    .map(item => ({
      ...item,
      addedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }))
    .sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
    .slice(0, 20);

  return (
    <div className="mb-8">
      <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'} mb-4 px-4`}>
        🆕 Recently Added
      </h2>
      <div className="flex space-x-2 overflow-x-auto scrollbar-hide px-4 pb-2">
        {recentContent.map((item) => (
          <div 
            key={item.id} 
            className="flex-shrink-0 w-40 md:w-48 cursor-pointer group"
            onClick={() => navigate(`/watch/${item.id}`)}
          >
            <div className="relative">
              <img 
                src={`https://image.tmdb.org/t/p/w300${item.poster_path || item.backdrop_path}`}
                alt={item.title || item.name}
                className="w-full h-60 object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/300x450/141414/ffffff?text=${encodeURIComponent(item.title || item.name)}`;
                }}
              />
              
              {/* New Badge */}
              <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                NEW
              </div>
              
              {/* Date Added */}
              <div className={`absolute bottom-2 left-2 ${theme === 'dark' ? 'bg-black/70 text-white' : 'bg-white/70 text-black'} px-2 py-1 rounded text-xs`}>
                {new Date(item.addedDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Downloads Screen Component
export const DownloadsScreen = ({ profile, downloads, removeFromDownloads, theme, setCurrentProfile, setTheme }) => {
  const navigate = useNavigate();

  return (
    <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} min-h-screen`}>
      <NetflixHeader 
        profile={profile} 
        setCurrentProfile={setCurrentProfile} 
        theme={theme} 
        setTheme={setTheme}
        notifications={[]}
      />
      
      <div className="pt-20 px-4">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate('/')} className={`${theme === 'dark' ? 'text-white' : 'text-black'} mr-4`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>My Downloads</h1>
        </div>

        {downloads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloads.map((item) => (
              <div 
                key={item.id}
                className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-4 cursor-pointer hover:scale-105 transition-transform`}
                onClick={() => navigate(`/watch/${item.id}`)}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${item.poster_path || item.backdrop_path}`}
                    alt={item.title || item.name}
                    className="w-20 h-28 object-cover rounded"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/200x280/141414/ffffff?text=${encodeURIComponent(item.title || item.name)}`;
                    }}
                  />
                  <div className="flex-1">
                    <h3 className={`${theme === 'dark' ? 'text-white' : 'text-black'} font-semibold mb-2`}>
                      {item.title || item.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      Downloaded: {new Date(item.downloadedAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-green-500 text-sm font-medium">Available Offline</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromDownloads(item.id);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>No downloads yet</h2>
            <p className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              Download movies and shows to watch offline
            </p>
          </div>
        )}
      </div>
    </div>
  );
};