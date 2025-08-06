import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

function Header() {
    const { user, isAuthenticated } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current &&
                !menuRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleProfile = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className={`fixed top-0 left-0 right-0 w-full h-[10vh] flex items-center justify-between backdrop-blur-3xl ${isAuthenticated ? '' : 'hidden'}`}>
            <div className="w-full h-[10vh] flex flex-row-reverse px-2 md:px-10 items-center justify-between border-b border-gray-500 py-8 gap-4">
                <div className="flex items-center gap-6">
                    <Link to="/" className={`text-lg font-medium transition-colors ${location.pathname === '/' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
                        Chat
                    </Link>
                    <Link to="/profile" className={`text-lg font-medium transition-colors ${location.pathname === '/profile' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
                        Profile
                    </Link>
                </div>

                <Link to={'/'} ref={buttonRef} className='flex items-center gap-3 cursor-pointer group' onClick={toggleProfile}>
                    <div className='relative'>
                        {user?.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt={user.displayName}
                                className="w-10 h-10 rounded-lg object-cover border-2 border-neutral/20 group-hover:border-indigo-500 transition-colors"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold border-2 border-neutral/20 group-hover:border-indigo-500 transition-colors">
                                {user?.displayName?.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <p className='text-sm font-medium group-hover:text-indigo-400 transition-colors'>{user?.displayName}</p>
                        <p className='text-xs opacity-60'>{user?.contactNumber}</p>
                    </div>
                </Link>
            </div>


        </div>
    )
}

export default Header