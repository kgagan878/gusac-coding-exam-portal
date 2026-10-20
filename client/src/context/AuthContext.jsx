import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [studentUser, setStudentUser] = useState(() => {
    const saved = localStorage.getItem('gusac_student_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('gusac_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial verification if tokens exist
    const verifyUser = async () => {
      const studentToken = localStorage.getItem('gusac_student_token');
      if (studentToken && studentUser) {
        try {
          const res = await authAPI.getMe();
          setStudentUser(res.data.user);
          localStorage.setItem('gusac_student_user', JSON.stringify(res.data.user));
        } catch (err) {
          console.warn('Session verification failed, clearing student token');
          localStorage.removeItem('gusac_student_token');
          localStorage.removeItem('gusac_student_user');
          setStudentUser(null);
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const loginStudent = async (name, email, studentId) => {
    const res = await authAPI.loginStudent({ name, email, studentId });
    const { token, user } = res.data;
    localStorage.setItem('gusac_student_token', token);
    localStorage.setItem('gusac_student_user', JSON.stringify(user));
    setStudentUser(user);
    return user;
  };

  const logoutStudent = () => {
    localStorage.removeItem('gusac_student_token');
    localStorage.removeItem('gusac_student_user');
    localStorage.removeItem('gusac_exam_codes');
    setStudentUser(null);
  };

  const loginAdmin = async (email, password) => {
    const res = await authAPI.loginAdmin({ email, password });
    const { token, user } = res.data;
    localStorage.setItem('gusac_admin_token', token);
    localStorage.setItem('gusac_admin_user', JSON.stringify(user));
    setAdminUser(user);
    return user;
  };

  const logoutAdmin = () => {
    localStorage.removeItem('gusac_admin_token');
    localStorage.removeItem('gusac_admin_user');
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        studentUser,
        adminUser,
        loading,
        loginStudent,
        logoutStudent,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
