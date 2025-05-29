import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { 
  ProfileSelection, 
  NetflixHome, 
  SearchScreen, 
  VideoPlayer,
  BrowseCategories,
  DownloadsScreen 
} from "./components";

function App() {
  const [currentProfile, setCurrentProfile] = useState(null);
  const [myList, setMyList] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState([]);
  const [ratings, setRatings] = useState({});

  // Load saved data from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('netflixProfile');
    const savedMyList = localStorage.getItem('netflixMyList');
    const savedContinueWatching = localStorage.getItem('netflixContinueWatching');
    const savedWatchHistory = localStorage.getItem('netflixWatchHistory');
    const savedDownloads = localStorage.getItem('netflixDownloads');
    const savedTheme = localStorage.getItem('netflixTheme');
    const savedNotifications = localStorage.getItem('netflixNotifications');
    const savedRatings = localStorage.getItem('netflixRatings');
    
    if (savedProfile) setCurrentProfile(JSON.parse(savedProfile));
    if (savedMyList) setMyList(JSON.parse(savedMyList));
    if (savedContinueWatching) setContinueWatching(JSON.parse(savedContinueWatching));
    if (savedWatchHistory) setWatchHistory(JSON.parse(savedWatchHistory));
    if (savedDownloads) setDownloads(JSON.parse(savedDownloads));
    if (savedTheme) setTheme(savedTheme);
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    if (savedRatings) setRatings(JSON.parse(savedRatings));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (currentProfile) localStorage.setItem('netflixProfile', JSON.stringify(currentProfile));
  }, [currentProfile]);

  useEffect(() => {
    localStorage.setItem('netflixMyList', JSON.stringify(myList));
  }, [myList]);

  useEffect(() => {
    localStorage.setItem('netflixContinueWatching', JSON.stringify(continueWatching));
  }, [continueWatching]);

  useEffect(() => {
    localStorage.setItem('netflixWatchHistory', JSON.stringify(watchHistory));
  }, [watchHistory]);

  useEffect(() => {
    localStorage.setItem('netflixDownloads', JSON.stringify(downloads));
  }, [downloads]);

  useEffect(() => {
    localStorage.setItem('netflixTheme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('netflixNotifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('netflixRatings', JSON.stringify(ratings));
  }, [ratings]);

  const addToMyList = (content) => {
    setMyList(prev => {
      const exists = prev.find(item => item.id === content.id);
      if (exists) return prev;
      return [...prev, content];
    });
  };

  const removeFromMyList = (contentId) => {
    setMyList(prev => prev.filter(item => item.id !== contentId));
  };

  const addToContinueWatching = (content) => {
    setContinueWatching(prev => {
      const filtered = prev.filter(item => item.id !== content.id);
      return [content, ...filtered].slice(0, 10); // Keep only 10 items
    });
  };

  const addToWatchHistory = (content) => {
    setWatchHistory(prev => {
      const filtered = prev.filter(item => item.id !== content.id);
      return [{ ...content, watchedAt: new Date().toISOString() }, ...filtered].slice(0, 50);
    });
  };

  const addToDownloads = (content) => {
    setDownloads(prev => {
      const exists = prev.find(item => item.id === content.id);
      if (exists) return prev;
      return [{ ...content, downloadedAt: new Date().toISOString() }, ...prev];
    });
  };

  const removeFromDownloads = (contentId) => {
    setDownloads(prev => prev.filter(item => item.id !== contentId));
  };

  const addNotification = (notification) => {
    setNotifications(prev => [
      { id: Date.now(), ...notification, createdAt: new Date().toISOString() },
      ...prev
    ].slice(0, 20));
  };

  const rateContent = (contentId, rating) => {
    setRatings(prev => ({
      ...prev,
      [contentId]: rating
    }));
  };

  return (
    <div className={`App ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} min-h-screen`}>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              currentProfile ? (
                <NetflixHome 
                  profile={currentProfile}
                  myList={myList}
                  continueWatching={continueWatching}
                  watchHistory={watchHistory}
                  downloads={downloads}
                  notifications={notifications}
                  ratings={ratings}
                  theme={theme}
                  addToMyList={addToMyList}
                  removeFromMyList={removeFromMyList}
                  addToContinueWatching={addToContinueWatching}
                  addToWatchHistory={addToWatchHistory}
                  addToDownloads={addToDownloads}
                  removeFromDownloads={removeFromDownloads}
                  addNotification={addNotification}
                  rateContent={rateContent}
                  setTheme={setTheme}
                  setCurrentProfile={setCurrentProfile}
                />
              ) : (
                <ProfileSelection setCurrentProfile={setCurrentProfile} theme={theme} />
              )
            } 
          />
          <Route 
            path="/search" 
            element={
              <SearchScreen 
                profile={currentProfile}
                myList={myList}
                ratings={ratings}
                theme={theme}
                addToMyList={addToMyList}
                removeFromMyList={removeFromMyList}
                rateContent={rateContent}
                setCurrentProfile={setCurrentProfile}
                setTheme={setTheme}
              />
            } 
          />
          <Route 
            path="/browse/:category" 
            element={
              <BrowseCategories 
                profile={currentProfile}
                myList={myList}
                ratings={ratings}
                theme={theme}
                addToMyList={addToMyList}
                removeFromMyList={removeFromMyList}
                rateContent={rateContent}
                setCurrentProfile={setCurrentProfile}
                setTheme={setTheme}
              />
            } 
          />
          <Route 
            path="/watch/:id" 
            element={
              <VideoPlayer 
                addToContinueWatching={addToContinueWatching}
                addToWatchHistory={addToWatchHistory}
                rateContent={rateContent}
                ratings={ratings}
                theme={theme}
              />
            } 
          />
          <Route 
            path="/downloads" 
            element={
              <DownloadsScreen 
                profile={currentProfile}
                downloads={downloads}
                removeFromDownloads={removeFromDownloads}
                theme={theme}
                setCurrentProfile={setCurrentProfile}
                setTheme={setTheme}
              />
            } 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;