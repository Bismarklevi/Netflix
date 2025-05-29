import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// TMDB API Configuration
const TMDB_API_KEYS = [
  'c8dea14dc917687ac631a52620e4f7ad',
  '3cb41ecea3bf606c56552db3d17adefd'
];
let currentApiKeyIndex = 0;

const getApiKey = () => {
  return TMDB_API_KEYS[currentApiKeyIndex];
};

const switchApiKey = () => {
  currentApiKeyIndex = (currentApiKeyIndex + 1) % TMDB_API_KEYS.length;
};

const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
});

// Add request interceptor to handle rate limiting
tmdbApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      switchApiKey();
      // Retry the request with new API key
      const config = error.config;
      config.params.api_key = getApiKey();
      return tmdbApi.request(config);
    }
    return Promise.reject(error);
  }
);

// Netflix Profiles Data with Enhanced Features
const NETFLIX_PROFILES = [
  { 
    id: 1, 
    name: 'John', 
    avatar: '👨', 
    color: 'bg-blue-600',
    isKid: false,
    maturityRating: 'All',
    language: 'English'
  },
  { 
    id: 2, 
    name: 'Sarah', 
    avatar: '👩', 
    color: 'bg-pink-600',
    isKid: false,
    maturityRating: 'All',
    language: 'English'
  },
  { 
    id: 3, 
    name: 'Kids', 
    avatar: '👶', 
    color: 'bg-yellow-500',
    isKid: true,
    maturityRating: 'Kids',
    language: 'English'
  },
  { 
    id: 4, 
    name: 'Guest', 
    avatar: '👤', 
    color: 'bg-gray-600',
    isKid: false,
    maturityRating: 'All',
    language: 'English'
  },
];

// Additional Genre IDs for Enhanced Categories
const GENRE_IDS = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  scienceFiction: 878,
  thriller: 53,
  war: 10752,
  western: 37,
  kids: 10762,
  anime: 16 // Using animation for anime
};

// Profile Selection Component
export const ProfileSelection = ({ setCurrentProfile }) => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      {/* Netflix Logo */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-red-600 tracking-wide">NETFLIX</h1>
      </div>
      
      {/* Who's Watching */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-light text-white mb-8">Who's watching?</h2>
        
        {/* Profiles Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {NETFLIX_PROFILES.map((profile) => (
            <button
              key={profile.id}
              onClick={() => setCurrentProfile(profile)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className={`w-24 h-24 md:w-32 md:h-32 ${profile.color} rounded-lg flex items-center justify-center text-4xl md:text-5xl group-hover:border-4 border-white transition-all duration-200`}>
                {profile.avatar}
              </div>
              <p className="text-white mt-2 text-lg group-hover:text-gray-300">{profile.name}</p>
            </button>
          ))}
        </div>
        
        {/* Manage Profiles */}
        <button className="text-gray-400 text-lg border border-gray-400 px-6 py-2 hover:text-white hover:border-white transition-colors">
          Manage Profiles
        </button>
      </div>
    </div>
  );
};

// Header Component
const NetflixHeader = ({ profile, setCurrentProfile }) => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/80 to-transparent p-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div onClick={() => navigate('/')} className="cursor-pointer">
          <h1 className="text-2xl font-bold text-red-600 tracking-wide">NETFLIX</h1>
        </div>
        
        {/* Navigation - Hidden on mobile */}
        <nav className="hidden md:flex space-x-6 text-white">
          <button onClick={() => navigate('/')} className="hover:text-gray-300">Home</button>
          <button onClick={() => navigate('/browse/tv')} className="hover:text-gray-300">TV Shows</button>
          <button onClick={() => navigate('/browse/movie')} className="hover:text-gray-300">Movies</button>
          <button onClick={() => navigate('/browse/popular')} className="hover:text-gray-300">Popular</button>
        </nav>
        
        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <button onClick={() => navigate('/search')} className="text-white hover:text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          {/* Profile */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`w-8 h-8 ${profile.color} rounded flex items-center justify-center text-sm`}
            >
              {profile.avatar}
            </button>
            
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-black/90 border border-gray-600 rounded-md py-2 shadow-xl">
                {NETFLIX_PROFILES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setCurrentProfile(p);
                      setShowProfileMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-white hover:bg-gray-800"
                  >
                    <div className={`w-6 h-6 ${p.color} rounded mr-3 flex items-center justify-center text-xs`}>
                      {p.avatar}
                    </div>
                    {p.name}
                  </button>
                ))}
                <hr className="border-gray-600 my-2" />
                <button 
                  onClick={() => {
                    setCurrentProfile(null);
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-white hover:bg-gray-800"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Content Row Component
const ContentRow = ({ title, content, addToMyList, removeFromMyList, myList }) => {
  const navigate = useNavigate();
  const scrollRef = React.useRef(null);

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

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-white mb-4 px-4">{title}</h2>
      <div className="relative group">
        {/* Left Arrow */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-r-md opacity-0 group-hover:opacity-100 transition-opacity"
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
          {content.map((item) => (
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
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-3 w-full">
                    <h3 className="text-white text-sm font-semibold line-clamp-2">{item.title || item.name}</h3>
                    <div className="flex items-center mt-2 space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/watch/${item.id}`);
                        }}
                        className="bg-white text-black rounded-full p-1 hover:bg-gray-200"
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
                        className="bg-gray-800/80 text-white rounded-full p-1 hover:bg-gray-700"
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
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-l-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Hero Banner Component
const HeroBanner = ({ content, addToMyList, removeFromMyList, myList }) => {
  const navigate = useNavigate();
  
  if (!content) return null;

  const isInMyList = myList.some(item => item.id === content.id);

  return (
    <div className="relative h-screen">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${content.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-4 md:px-16">
        <div className="max-w-lg">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {content.title || content.name}
          </h1>
          <p className="text-lg text-gray-200 mb-6 line-clamp-3">
            {content.overview}
          </p>
          
          {/* Buttons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(`/watch/${content.id}`)}
              className="bg-white text-black px-8 py-3 rounded-md font-semibold flex items-center space-x-2 hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span>Play</span>
            </button>
            <button 
              onClick={() => {
                if (isInMyList) {
                  removeFromMyList(content.id);
                } else {
                  addToMyList(content);
                }
              }}
              className="bg-gray-600/80 text-white px-8 py-3 rounded-md font-semibold flex items-center space-x-2 hover:bg-gray-500/80 transition-colors"
            >
              {isInMyList ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  <span>Added</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>My List</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Netflix Home Component
export const NetflixHome = ({ 
  profile, 
  myList, 
  continueWatching, 
  addToMyList, 
  removeFromMyList, 
  addToContinueWatching,
  setCurrentProfile 
}) => {
  const [content, setContent] = useState({
    trending: [],
    popular: [],
    topRated: [],
    action: [],
    comedy: [],
    horror: [],
    romance: [],
    documentary: [],
    hero: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const requests = [
          tmdbApi.get('/trending/all/day', { params: { api_key: getApiKey() } }),
          tmdbApi.get('/movie/popular', { params: { api_key: getApiKey() } }),
          tmdbApi.get('/movie/top_rated', { params: { api_key: getApiKey() } }),
          tmdbApi.get('/discover/movie', { params: { api_key: getApiKey(), with_genres: 28 } }), // Action
          tmdbApi.get('/discover/movie', { params: { api_key: getApiKey(), with_genres: 35 } }), // Comedy
          tmdbApi.get('/discover/movie', { params: { api_key: getApiKey(), with_genres: 27 } }), // Horror
          tmdbApi.get('/discover/movie', { params: { api_key: getApiKey(), with_genres: 10749 } }), // Romance
          tmdbApi.get('/discover/movie', { params: { api_key: getApiKey(), with_genres: 99 } }), // Documentary
        ];

        const responses = await Promise.all(requests);
        
        setContent({
          trending: responses[0].data.results,
          popular: responses[1].data.results,
          topRated: responses[2].data.results,
          action: responses[3].data.results,
          comedy: responses[4].data.results,
          horror: responses[5].data.results,
          romance: responses[6].data.results,
          documentary: responses[7].data.results,
          hero: responses[0].data.results[0] // Use first trending item as hero
        });
      } catch (error) {
        console.error('Error fetching content:', error);
        // Fallback mock data if API fails
        const mockContent = {
          id: 1,
          title: "Sample Movie",
          overview: "This is a sample movie description for demonstration purposes.",
          backdrop_path: "/sample-backdrop.jpg",
          poster_path: "/sample-poster.jpg"
        };
        setContent({
          trending: [mockContent],
          popular: [mockContent],
          topRated: [mockContent],
          action: [mockContent],
          comedy: [mockContent],
          horror: [mockContent],
          romance: [mockContent],
          documentary: [mockContent],
          hero: mockContent
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-600 text-4xl font-bold animate-pulse">NETFLIX</div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <NetflixHeader profile={profile} setCurrentProfile={setCurrentProfile} />
      
      {/* Hero Banner */}
      <HeroBanner 
        content={content.hero} 
        addToMyList={addToMyList}
        removeFromMyList={removeFromMyList}
        myList={myList}
      />
      
      {/* Content Rows */}
      <div className="relative -mt-32 z-20">
        {continueWatching.length > 0 && (
          <ContentRow 
            title="Continue Watching" 
            content={continueWatching}
            addToMyList={addToMyList}
            removeFromMyList={removeFromMyList}
            myList={myList}
          />
        )}
        
        <ContentRow 
          title="Trending Now" 
          content={content.trending}
          addToMyList={addToMyList}
          removeFromMyList={removeFromMyList}
          myList={myList}
        />
        
        {myList.length > 0 && (
          <ContentRow 
            title="My List" 
            content={myList}
            addToMyList={addToMyList}
            removeFromMyList={removeFromMyList}
            myList={myList}
          />
        )}
        
        <ContentRow 
          title="Popular on Netflix" 
          content={content.popular}
          addToMyList={addToMyList}
          removeFromMyList={removeFromMyList}
          myList={myList}
        />
        
        <ContentRow 
          title="Top Rated" 
          content={content.topRated}
          addToMyList={addToMyList}
          removeFromMyList={removeFromMyList}
          myList={myList}
        />
        
        <ContentRow 
          title="Action & Adventure" 
          content={content.action}
          addToMyList={addToMyList}
          removeFromMyList={removeFromMyList}
          myList={myList}
        />
        
        <ContentRow 
          title="Comedies" 
          content={content.comedy}
          addToMyList={addToMyList}
          removeFromMyList={removeFromMyList}
          myList={myList}
        />
        
        <ContentRow 
          title="Horror Movies" 
          content={content.horror}
          addToMyList={addToMyList}
          removeFromMyList={removeFromMyList}
          myList={myList}
        />
        
        <ContentRow 
          title="Romantic Movies" 
          content={content.romance}
          addToMyList={addToMyList}
          removeFromMyList={removeFromMyList}
          myList={myList}
        />
        
        <ContentRow 
          title="Documentaries" 
          content={content.documentary}
          addToMyList={addToMyList}
          removeFromMyList={removeFromMyList}
          myList={myList}
        />
      </div>
      
      {/* Footer */}
      <footer className="bg-black text-gray-400 p-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <p className="mb-4">Questions? Contact us.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="space-y-2">
              <p>FAQ</p>
              <p>Investor Relations</p>
              <p>Privacy</p>
              <p>Speed Test</p>
            </div>
            <div className="space-y-2">
              <p>Help Center</p>
              <p>Jobs</p>
              <p>Cookie Preferences</p>
              <p>Legal Notices</p>
            </div>
            <div className="space-y-2">
              <p>Account</p>
              <p>Ways to Watch</p>
              <p>Corporate Information</p>
              <p>Only on Netflix</p>
            </div>
            <div className="space-y-2">
              <p>Media Center</p>
              <p>Terms of Use</p>
              <p>Contact Us</p>
            </div>
          </div>
          <p className="mt-8 text-xs">© 2024 Netflix Clone</p>
        </div>
      </footer>
    </div>
  );
};

// Search Screen Component
export const SearchScreen = ({ profile, myList, addToMyList, removeFromMyList, setCurrentProfile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState(['Action Movies', 'Comedy', 'Thriller', 'Documentary']);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const searchContent = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await tmdbApi.get('/search/multi', {
        params: {
          api_key: getApiKey(),
          query: query,
          page: 1
        }
      });
      setSearchResults(response.data.results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      searchContent(searchQuery);
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const isInMyList = (contentId) => {
    return myList.some(item => item.id === contentId);
  };

  const categories = [
    { name: 'Action & Adventure', image: 'https://via.placeholder.com/300x200/dc2626/ffffff?text=Action' },
    { name: 'Comedy', image: 'https://via.placeholder.com/300x200/fbbf24/000000?text=Comedy' },
    { name: 'Drama', image: 'https://via.placeholder.com/300x200/7c3aed/ffffff?text=Drama' },
    { name: 'Horror', image: 'https://via.placeholder.com/300x200/000000/ffffff?text=Horror' },
    { name: 'Romance', image: 'https://via.placeholder.com/300x200/ec4899/ffffff?text=Romance' },
    { name: 'Sci-Fi', image: 'https://via.placeholder.com/300x200/06b6d4/ffffff?text=Sci-Fi' },
    { name: 'Thriller', image: 'https://via.placeholder.com/300x200/374151/ffffff?text=Thriller' },
    { name: 'Documentary', image: 'https://via.placeholder.com/300x200/059669/ffffff?text=Documentary' },
  ];

  return (
    <div className="bg-black min-h-screen">
      <NetflixHeader profile={profile} setCurrentProfile={setCurrentProfile} />
      
      <div className="pt-20 px-4">
        {/* Search Input */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies, TV shows..."
              className="w-full bg-gray-800 text-white px-6 py-4 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Search Results</h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="text-white">Searching...</div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {searchResults.map((item) => (
                  <div 
                    key={item.id}
                    className="cursor-pointer group"
                    onClick={() => navigate(`/watch/${item.id}`)}
                  >
                    <div className="relative">
                      <img
                        src={`https://image.tmdb.org/t/p/w300${item.poster_path || item.backdrop_path}`}
                        alt={item.title || item.name}
                        className="w-full h-64 object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/300x450/141414/ffffff?text=${encodeURIComponent(item.title || item.name)}`;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isInMyList(item.id)) {
                              removeFromMyList(item.id);
                            } else {
                              addToMyList(item);
                            }
                          }}
                          className="bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
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
                      </div>
                    </div>
                    <h3 className="text-white text-sm mt-2 line-clamp-2">{item.title || item.name}</h3>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>
        )}

        {/* Recent Searches */}
        {!searchQuery && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Searches</h2>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(search)}
                  className="block text-gray-300 hover:text-white text-left"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Browse Categories */}
        {!searchQuery && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => navigate(`/browse/${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`)}
                  className="relative rounded-md overflow-hidden group"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h3 className="text-white font-semibold text-center">{category.name}</h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Browse Categories Component
export const BrowseCategories = ({ profile, myList, addToMyList, removeFromMyList, setCurrentProfile }) => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryContent = async () => {
      setLoading(true);
      try {
        let endpoint = '/discover/movie';
        let params = { api_key: getApiKey(), page: 1 };

        // Map category to appropriate API call
        switch (category) {
          case 'tv':
            endpoint = '/discover/tv';
            break;
          case 'popular':
            endpoint = '/movie/popular';
            break;
          case 'action-adventure':
            params.with_genres = 28;
            break;
          case 'comedy':
            params.with_genres = 35;
            break;
          case 'drama':
            params.with_genres = 18;
            break;
          case 'horror':
            params.with_genres = 27;
            break;
          case 'romance':
            params.with_genres = 10749;
            break;
          case 'sci-fi':
            params.with_genres = 878;
            break;
          case 'thriller':
            params.with_genres = 53;
            break;
          case 'documentary':
            params.with_genres = 99;
            break;
          default:
            break;
        }

        const response = await tmdbApi.get(endpoint, { params });
        setContent(response.data.results);
      } catch (error) {
        console.error('Error fetching category content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryContent();
  }, [category]);

  const isInMyList = (contentId) => {
    return myList.some(item => item.id === contentId);
  };

  const getCategoryTitle = (cat) => {
    return cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen">
        <NetflixHeader profile={profile} setCurrentProfile={setCurrentProfile} />
        <div className="pt-20 flex items-center justify-center h-64">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <NetflixHeader profile={profile} setCurrentProfile={setCurrentProfile} />
      
      <div className="pt-20 px-4">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate('/')} className="text-white mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-white">{getCategoryTitle(category)}</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {content.map((item) => (
            <div 
              key={item.id}
              className="cursor-pointer group"
              onClick={() => navigate(`/watch/${item.id}`)}
            >
              <div className="relative">
                <img
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path || item.backdrop_path}`}
                  alt={item.title || item.name}
                  className="w-full h-64 object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/300x450/141414/ffffff?text=${encodeURIComponent(item.title || item.name)}`;
                  }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isInMyList(item.id)) {
                        removeFromMyList(item.id);
                      } else {
                        addToMyList(item);
                      }
                    }}
                    className="bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
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
                </div>
              </div>
              <h3 className="text-white text-sm mt-2 line-clamp-2">{item.title || item.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Video Player Component
export const VideoPlayer = ({ addToContinueWatching }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const fetchContentDetails = async () => {
      try {
        // Fetch content details
        const contentResponse = await tmdbApi.get(`/movie/${id}`, {
          params: { api_key: getApiKey() }
        });
        
        // Fetch videos (trailers, etc.)
        const videosResponse = await tmdbApi.get(`/movie/${id}/videos`, {
          params: { api_key: getApiKey() }
        });

        setContent(contentResponse.data);
        setVideos(videosResponse.data.results);
        
        // Add to continue watching
        addToContinueWatching(contentResponse.data);
      } catch (error) {
        console.error('Error fetching content details:', error);
        // Fallback content
        setContent({
          id: id,
          title: 'Sample Content',
          overview: 'This is sample content for demonstration.',
          backdrop_path: '/sample.jpg'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContentDetails();
  }, [id, addToContinueWatching]);

  useEffect(() => {
    // Hide controls after 3 seconds
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const getYouTubeTrailer = () => {
    const trailer = videos.find(video => 
      video.type === 'Trailer' && video.site === 'YouTube'
    );
    return trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&controls=1` : null;
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const youtubeUrl = getYouTubeTrailer();

  return (
    <div className="bg-black min-h-screen relative">
      {/* Video Player */}
      <div className="relative h-screen">
        {youtubeUrl ? (
          <iframe
            src={youtubeUrl}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div 
            className="w-full h-full bg-cover bg-center relative"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${content?.backdrop_path})`,
            }}
          >
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-center">
                <h1 className="text-4xl font-bold mb-4">{content?.title}</h1>
                <p className="text-xl mb-8">No trailer available</p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-red-600 text-white px-8 py-3 rounded-md hover:bg-red-700"
                >
                  Back to Browse
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Controls Overlay */}
        {showControls && (
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80 flex flex-col justify-between p-4"
            onClick={() => setShowControls(!showControls)}
          >
            {/* Top Controls */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => navigate('/')}
                className="text-white hover:text-gray-300"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-white text-xl font-semibold">{content?.title}</h1>
              <div></div>
            </div>

            {/* Bottom Controls */}
            <div className="text-white">
              <div className="mb-4">
                <div className="bg-red-600 h-1 rounded-full mb-2" style={{ width: '30%' }}></div>
                <div className="flex items-center justify-between text-sm">
                  <span>12:34</span>
                  <span>45:67</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-8">
                <button className="hover:text-gray-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                  </svg>
                </button>
                
                <button className="hover:text-gray-300">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
                
                <button className="hover:text-gray-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.055 7.06c-1.25-.714-2.805.189-2.805 1.628v8.123c0 1.44 1.555 2.342 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.342 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256L14.805 7.06C13.555 6.346 12 7.25 12 8.688v2.34L5.055 7.06z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Info */}
      {!showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
          <h2 className="text-white text-2xl font-bold mb-2">{content?.title}</h2>
          <p className="text-gray-300 text-sm line-clamp-3">{content?.overview}</p>
        </div>
      )}
    </div>
  );
};