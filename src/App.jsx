import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import EmployeeTable from './pages/EmployeeTable';
import EmployeeCreate from './pages/EmployeeCreate';
import EmployeeDetail from './pages/EmployeeDetail';
import EmployeeUpdate from './pages/EmployeeUpdate';


function App() {
  return (
  <Router>
    <Routes>
    <Route path="/" element={<EmployeeTable />} />
    <Route
      path="/create"
      element={<EmployeeCreate />}
    />
    <Route
      path="/:id/detail"
      element={<EmployeeDetail />}
    />
      <Route
      path="/:id/update"
      element={<EmployeeUpdate />}
    />
  </Routes>
</Router>
  );
}

export default App;
