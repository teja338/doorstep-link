// Update this page (the content is just a fallback if you fail to update the page)

import { Navigate } from 'react-router-dom';

const Index = () => {
  // This page now redirects to login since we have role-based routing
  return <Navigate to="/login" replace />;
};

export default Index;
