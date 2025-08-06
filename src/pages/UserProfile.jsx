import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaPen, FaCheck, FaTimes } from 'react-icons/fa';
import useAuthStore from '../store/useAuthStore';
import { userService } from '../services/UserService';
import { toast } from 'react-hot-toast';
import Themes from '../components/Themes';

function UserProfile() {
    const { user, setUser } = useAuthStore();
    const [editName, setEditName] = useState(false);
    const [editAbout, setEditAbout] = useState(false);
    const [editContact, setEditContact] = useState(false);
    const [newName, setNewName] = useState(user?.displayName || '');
    const [newAbout, setNewAbout] = useState(user?.about || '');
    const [newContact, setNewContact] = useState(user?.contactNumber || '');

    const handleNameChange = async () => {
        if (!newName.trim()) {
            toast.error("Name cannot be empty");
            return;
        }

        try {
            await userService.changeName(user.uid, newName);
            const updatedUser = await userService.fetchUser(user.uid);
            setUser(updatedUser);
            setEditName(false);
            toast.success("Name updated successfully");
        } catch (error) {
            console.error("Error updating name:", error);
            toast.error("Failed to update name");
        }
    };

    const handleAboutChange = async () => {
        try {
            await userService.addUpdateAbout(user.uid, newAbout);
            const updatedUser = await userService.fetchUser(user.uid);
            setUser(updatedUser);
            setEditAbout(false);
            toast.success("About section updated successfully");
        } catch (error) {
            console.error("Error updating about section:", error);
            toast.error("Failed to update about section");
        }
    };

   
    return (
        <div className="min-h-screen bg-neutral/30 text-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-neutral/50 backdrop-blur-lg rounded-xl p-6 shadow-xl hover:bg-neutral/60 transition-colors duration-300"
                >
                    {/* Profile Header */}
                    <div className="text-center mb-8">
                        <div className="relative inline-block">
                            <div className="w-32 h-32 rounded-full border-4 border-indigo-500/30 overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600">
                                {user?.photoURL ? (
                                    <img 
                                        src={user.photoURL} 
                                        alt={user.displayName} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold">
                                        {user?.displayName?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <button className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white hover:bg-indigo-700 transition-colors">
                                <FaCamera size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="space-y-6">
                        {/* Name Section */}
                        <div className="relative group">
                            <label className="text-sm text-gray-400">Name</label>
                            <div className="mt-1">
                                {editName ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="w-full px-3 py-2 bg-neutral/70 border border-neutral/30 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-neutral/80"
                                            placeholder="Enter your name"
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleNameChange}
                                            className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
                                        >
                                            <FaCheck />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setEditName(false)}
                                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                                        >
                                            <FaTimes />
                                        </motion.button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between group">
                                        <p className="text-lg font-medium">{user?.displayName}</p>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setEditName(true)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-indigo-400"
                                        >
                                            <FaPen size={14} />
                                        </motion.button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="relative group">
                            <label className="text-sm text-gray-400">About</label>
                            <div className="mt-1">
                                {editAbout ? (
                                    <div className="flex flex-col gap-2">
                                        <textarea
                                            value={newAbout}
                                            onChange={(e) => setNewAbout(e.target.value)}
                                            className="w-full px-3 py-2 bg-neutral/70 border border-neutral/30 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-neutral/80 min-h-[100px] resize-none"
                                            placeholder="Write something about yourself..."
                                        />
                                        <div className="flex justify-end gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={handleAboutChange}
                                                className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
                                            >
                                                <FaCheck />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setEditAbout(false)}
                                                className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                                            >
                                                <FaTimes />
                                            </motion.button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="group">
                                        <div className="flex items-start justify-between">
                                            <p className="text-gray-300">{user?.about || "No about information added yet."}</p>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setEditAbout(true)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-indigo-400"
                                            >
                                                <FaPen size={14} />
                                            </motion.button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contact Number Section */}
                        <div className="relative group">
                            <label className="text-sm text-gray-400">Contact Number</label>
                            <div className="mt-1">
                               {user?.contactNumber}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
            
            <Themes/>
        </div>
    );
}

export default UserProfile;
