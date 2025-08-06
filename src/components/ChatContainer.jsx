import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaSmile, FaPaperclip, FaTimes, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import useAuthStore from '../store/useAuthStore';
import { chatService } from '../services/chatService';
import { toast } from 'react-hot-toast';


function ChatContainer({ selectedContact }) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [remoteTyping, setRemoteTyping] = useState(false);
    const [editingMessage, setEditingMessage] = useState(null);
    const messageEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const { user } = useAuthStore();
    const chatRoomId = selectedContact ? chatService.getChatRoomId(user.uid, selectedContact.uid) : null;

    // Scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Subscribe to messages
    useEffect(() => {
        if (chatRoomId) {
            const messageUnsubscribe = chatService.subscribeToMessages(chatRoomId, (newMessages) => {
                setMessages(newMessages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0)));
            });

            const typingUnsubscribe = chatService.subscribeToTypingStatus(chatRoomId, (typingStatus) => {
                // Check if the other user is typing
                const isRemoteTyping = typingStatus[selectedContact.uid]?.isTyping || false;
                setRemoteTyping(isRemoteTyping);
            });

            // Mark messages as read
            chatService.markChatAsRead(chatRoomId, user.uid);

            return () => {
                messageUnsubscribe();
                typingUnsubscribe();
            };
        }
    }, [chatRoomId, user.uid, selectedContact?.uid]);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle message submission
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            console.log('Sending message...', {
                user: user,
                selectedContact: selectedContact,
                message: message
            });

            if (!user?.uid || !selectedContact?.uid) {
                toast.error('User information is missing');
                return;
            }

            if (editingMessage) {
                await chatService.editMessage(chatRoomId, editingMessage.id, message);
                setEditingMessage(null);
                toast.success('Message updated');
            } else {
                const result = await chatService.sendMessage(user.uid, selectedContact.uid, message);
                console.log('Message sent with ID:', result);
                toast.success('Message sent');
            }
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error(error.message || (editingMessage ? 'Failed to edit message' : 'Failed to send message'));
        }
    };

    // Handle message edit
    const handleEditMessage = (msg) => {
        setEditingMessage(msg);
        setMessage(msg.text);
    };

    // Handle message delete
    const handleDeleteMessage = async (messageId) => {
        try {
            await chatService.deleteMessage(chatRoomId, messageId);
            toast.success('Message deleted');
        } catch (error) {
            toast.error('Failed to delete message');
        }
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingMessage(null);
        setMessage('');
    };

    if (!selectedContact) {
        return (
            <div className="h-full flex items-center justify-center bg-neutral/20 backdrop-blur-md rounded-lg">
                <div className="text-center opacity-60">
                    <div className="text-6xl mb-4">👋</div>
                    <h3 className="text-xl font-semibold mb-2">Welcome to Chat</h3>
                    <p>Select a contact to start messaging</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:h-[75vh] h-[90vh]  backdrop-blur-md rounded-lg overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
                <div className="relative">
                    {selectedContact?.photoURL ? (
                        <img
                            src={selectedContact.photoURL}
                            alt={selectedContact.displayName}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                        />
                    ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center font-semibold border-2 border-white/20">
                            {selectedContact?.displayName?.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold">
                        {selectedContact?.displayName || "Chat"}
                    </h3>
                    <p className="text-xs opacity-60">
                        {remoteTyping ? 'typing...' : ''}
                    </p>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`flex ${msg.senderId === user.uid ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`group relative max-w-[75%] break-words ${msg.senderId === user.uid
                                    ? 'bg-indigo-600 rounded-l-xl rounded-tr-xl'
                                    : 'bg-neutral/20 rounded-r-xl rounded-tl-xl'
                                } p-3 shadow-lg hover:shadow-xl transition-all`}>
                                {msg.senderId === user.uid && (
                                    <div className="absolute -right-12 top-0 hidden group-hover:flex items-center gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleEditMessage(msg)}
                                            className="p-1.5 bg-neutral/30 rounded-full hover:bg-neutral/40 opacity-80"
                                        >
                                            <FaEdit size={12} />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleDeleteMessage(msg.id)}
                                            className="p-1.5 bg-neutral/30 rounded-full hover:bg-neutral/40 opacity-80"
                                        >
                                            <FaTrash size={12} />
                                        </motion.button>
                                    </div>
                                )}
                                <p>{msg.text}</p>
                                <div className="flex items-center justify-end gap-1 mt-1">
                                    {msg.edited && (
                                        <span className="text-[10px] opacity-50">(edited)</span>
                                    )}
                                    <p className="text-xs opacity-50">
                                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
                                    </p>
                                    {msg.senderId === user.uid && (
                                        <span className="text-xs opacity-50 ml-1">
                                            {msg.status === 'read' ? '✓✓' : '✓'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={messageEndRef} />
            </div>

            {/* Chat Input */}
            <motion.form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-2">


                    <input
                        type="text"
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);

                            // Handle typing indicator
                            if (chatRoomId) {
                                // Clear any existing timeout
                                if (typingTimeoutRef.current) {
                                    clearTimeout(typingTimeoutRef.current);
                                }

                                // Set typing status to true
                                chatService.setTypingStatus(chatRoomId, user.uid, true);

                                // Set a new timeout to clear typing status
                                typingTimeoutRef.current = setTimeout(() => {
                                    chatService.setTypingStatus(chatRoomId, user.uid, false);
                                }, 2000);
                            }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 bg-neutral/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-neutral/30"
                    />
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 rounded-lg transition-colors ${message.trim()
                                ? 'bg-indigo-600 hover:bg-indigo-700'
                                : 'bg-neutral/50 opacity-40 cursor-not-allowed'
                            }`}
                        disabled={!message.trim()}
                    >
                        <FaPaperPlane />
                    </motion.button>
                </div>
            </motion.form>
        </div>
    );
}

export default ChatContainer;