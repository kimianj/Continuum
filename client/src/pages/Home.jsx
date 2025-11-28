import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your thoughts,{' '}
            <span className="text-primary-600">organized</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            A simple and elegant way to capture your ideas, notes, and thoughts. 
            Access them anywhere, anytime.
          </p>
          
          {user ? (
            <div className="flex justify-center space-x-4">
              <Link to="/notes" className="btn btn-primary text-lg px-8 py-3">
                Go to My Notes
              </Link>
              {user.isAdmin && (
                <Link to="/admin" className="btn btn-secondary text-lg px-8 py-3">
                  Admin Dashboard
                </Link>
              )}
            </div>
          ) : (
            <div className="flex justify-center space-x-4">
              <Link to="/signup" className="btn btn-primary text-lg px-8 py-3">
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-secondary text-lg px-8 py-3">
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy to Use</h3>
            <p className="text-gray-600">Create, edit, and delete notes with just a few clicks. No complexity, just simplicity.</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure</h3>
            <p className="text-gray-600">Your notes are private and secure. Only you can access your personal notes.</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Persistent</h3>
            <p className="text-gray-600">Your notes are saved and synced. Access them whenever you need them.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
