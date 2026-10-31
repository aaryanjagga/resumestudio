import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './features/landing/LandingPage';
import { ResumeDashboard } from './features/dashboard/ResumeDashboard';
import { ResumeEditorPage } from './features/editor/ResumeEditorPage';
import { NotFoundPage } from './features/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/resumes" element={<ResumeDashboard />} />
        <Route path="/editor/:id" element={<ResumeEditorPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
