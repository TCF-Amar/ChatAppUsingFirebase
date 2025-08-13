import React, { useEffect, useState, useCallback } from 'react';
import useAuthStore from '../store/useAuthStore';
import { userService } from '../services/userService.js';
import { chatService } from '../services/chatService.js';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaTimes, FaUserFriends } from 'react-icons/fa';
import ChatContainer from './ChatContainer';

function Contacts({ search, results }) {
  const [allUser, setAllUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const users = await userService.fetchAllUsers();
        console.log('All users:', users);
        // Filter out the current user from the list
        const filteredUsers = users.filter(u => u.uid !== user?.uid);
        console.log('Filtered users (without current user):', filteredUsers);
        setAllUser(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load contacts");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user?.uid]);

  const filteredUsers = allUser.filter(u => {
    if (!search) return true;
    return (
      u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      u.contactNumber?.includes(search)
    );
  });


const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setShowChat(true);
  };

  const handleBackToContacts = () => {
    setShowChat(false);
    setSelectedContact(null);
  };

  return (
    <div className="flex h-full relative w-full">
      {/* Contacts List */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`text-gray-100 flex flex-col gap-2 transition-all duration-300 h-full
          ${showChat 
            ? 'fixed sm:relative left-0 top-0 w-full sm:w-[350px] lg:w-[400px] -translate-x-full sm:translate-x-0' 
            : 'w-full'
          }
          z-20 
          overflow-y-auto sm:border-r 
          ${showChat ? 'sm:px-3' : 'px-4'}`}
      >
      {loading ? (
        <motion.div 
          className="flex flex-col items-center justify-center py-8 text-gray-400 min-h-[200px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity },
              opacity: { duration: 2, repeat: Infinity }
            }}
            className="bg-neutral/20 p-4 rounded-full backdrop-blur-sm"
          >
            <FaUserFriends className="text-4xl text-indigo-400" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 font-medium"
          >
            Loading contacts...
          </motion.p>
        </motion.div>
      ) : filteredUsers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-8 text-gray-400 min-h-[200px]"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-neutral/20 p-4 rounded-full backdrop-blur-sm mb-4"
          >
            <FaUserFriends className="text-4xl text-gray-500" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            {search ? (
              <>
                <span className="block font-medium text-gray-300">No matching contacts</span>
                <span className="text-sm text-gray-500">Try a different search term</span>
              </>
            ) : (
              <>
                <span className="block font-medium text-gray-300">No contacts available</span>
                <span className="text-sm text-gray-500">Start connecting with people</span>
              </>
            )}
          </motion.p>
        </motion.div>
      ) : (
        <AnimatePresence mode="sync">
          {filteredUsers.map((contact, index) => (
            <motion.div
              key={contact.uid || contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleContactClick(contact)}
              className={`p-3 rounded-lg flex items-center gap-3 backdrop-blur-sm
                ${selectedContact?.uid === contact.uid 
                  ? 'bg-indigo-600/20 border-indigo-500/30' 
                  : results.some(r => r.id === contact.id)
                    ? 'bg-neutral/40 border-neutral/30'
                    : 'bg-neutral/20 hover:bg-neutral/30 border-transparent hover:border-neutral/20'
                } 
                border transition-all duration-300 cursor-pointer hover:shadow-lg
                transform hover:-translate-y-0.5`}
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                {contact.photoURL ? (
                  <img 
                    src={contact.photoURL} 
                    alt={contact.displayName} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20" 
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-semibold border-2 border-white/20">
                    {contact?.displayName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </motion.div>

              <div className="flex-1 min-w-0">
                <motion.p 
                  className="text-white font-semibold truncate"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {contact?.displayName || contact?.name || "Unnamed Contact"}
                </motion.p>
                <motion.p 
                  className="text-sm text-gray-400 truncate"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {contact?.contactNumber || "No contact number"}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
      </motion.div>

      {/* Chat Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: showChat ? 1 : 0,
          width: showChat ? '100%' : '0%'
        }}
        className={`fixed sm:relative top-0 left-0 w-full h-full transition-all duration-300
          ${showChat 
            ? 'flex-1 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-md z-10' 
            : 'w-0 hidden sm:block'}`}
      >
        {showChat && (
          <div className="absolute inset-0 h-full w-full">
            <motion.button
              onClick={handleBackToContacts}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="fixed top-4 right-4 z-30 sm:hidden bg-neutral/20 p-3 rounded-full text-white 
                hover:bg-neutral/30 transition-all duration-300 hover:scale-110 active:scale-95
                shadow-lg backdrop-blur-sm"
            >
              <FaTimes />
            </motion.button>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className=" p-2 sm:p-4"
            >
              <ChatContainer selectedContact={selectedContact} />
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Contacts;
