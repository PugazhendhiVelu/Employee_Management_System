import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export const useAuth = () => {
  const navigate = useNavigate();



  useEffect(() => {
    const token = Cookies.get('token'); // Ensure this matches the cookie name set in the backend
    
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/'); // Redirect to login page if token is not found
    }
  }, [navigate]);
};


//Local Storage

// src/hooks/useAuth.js
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// export const useAuth = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('authToken'); // Retrieve token from local storage
//     console.log(token);
//     if (!token) {
//       navigate('/'); // Redirect to login page if token is not found
//     }
//   }, [navigate]);
// };

