import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { 
  ProfileSelection, 
  NetflixHome, 
  SearchScreen, 
  VideoPlayer,
  BrowseCategories 
} from "./components";

function App() {
  const [currentProfile, setCurrentProfile] = useState(null);
  const [myList, setMyList] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);

  // Load saved data from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('netflixProfile');
    const savedMyList = localStorage.getItem('netflixMyList');
    const savedContinueWatching = localStorage.getItem('netflixContinueWatching');
    
    if (savedProfile) setCurrentProfile(JSON.parse(savedProfile));
    if (savedMyList) setMyList(JSON.parse(savedMyList));
    if (savedContinueWatching) setContinueWatching(JSON.parse(savedContinueWatching));
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

  return (
    <div className="App bg-black text-white min-h-screen">
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
                  addToMyList={addToMyList}
                  removeFromMyList={removeFromMyList}
                  addToContinueWatching={addToContinueWatching}
                  setCurrentProfile={setCurrentProfile}
                />
              ) : (
                <ProfileSelection setCurrentProfile={setCurrentProfile} />
              )
            } 
          />
          <Route 
            path="/search" 
            element={
              <SearchScreen 
                profile={currentProfile}
                myList={myList}
                addToMyList={addToMyList}
                removeFromMyList={removeFromMyList}
                setCurrentProfile={setCurrentProfile}
              />
            } 
          />
          <Route 
            path="/browse/:category" 
            element={
              <BrowseCategories 
                profile={currentProfile}
                myList={myList}
                addToMyList={addToMyList}
                removeFromMyList={removeFromMyList}
                setCurrentProfile={setCurrentProfile}
              />
            } 
          />
          <Route 
            path="/watch/:id" 
            element={
              <VideoPlayer 
                addToContinueWatching={addToContinueWatching}
              />
            } 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;