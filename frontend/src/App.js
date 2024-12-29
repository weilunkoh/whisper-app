import React from 'react';
import Layout from "./components/layout";
import Header from "./components/header";
import BodyDisplay from "./components/bodyDisplay";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Search from './pages/search';
import Upload from './pages/upload';
import Postprocess from './pages/postprocess';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Layout>
          <Header />
          <BodyDisplay>
            <Routes>
              <Route path="/" element={<Upload />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/search" element={<Search />} />
              <Route path="/postprocess" element={<Postprocess />} />
            </Routes>
          </BodyDisplay>
        </Layout>
      </div>
    </BrowserRouter>
  );
};

export default App;