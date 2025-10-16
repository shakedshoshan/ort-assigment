
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { TeacherDashboard, QuestionView, StudentForm } from './pages';
import './App.css';

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          {/* Redirect root to teacher dashboard */}
          <Route path="/" element={<Navigate to="/teacher" replace />} />
          
          {/* Teacher routes */}
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/questions/:id" element={<QuestionView />} />
          
          {/* Student route */}
          <Route path="/student" element={<StudentForm />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/teacher" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
