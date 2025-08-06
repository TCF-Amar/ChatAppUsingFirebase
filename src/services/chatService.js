import { ref, push, set, remove, onValue, off, serverTimestamp, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { database } from '../config/firebase';

class ChatService {
    constructor() {
        this.database = database;
        console.log('ChatService initialized with database:', this.database);
        if (!this.database) {
            throw new Error('Firebase database not initialized properly');
        }
    }

    // Create a new chat room or get existing one
    getChatRoomId(userId1, userId2) {
        // Sort IDs to ensure consistent chat room IDs
        const sortedIds = [userId1, userId2].sort();
        return `${sortedIds[0]}_${sortedIds[1]}`;
    }

    // Set typing status
    async setTypingStatus(chatRoomId, userId, isTyping) {
        try {
            const typingRef = ref(this.database, `chats/${chatRoomId}/typing/${userId}`);
            if (isTyping) {
                await set(typingRef, {
                    isTyping: true,
                    timestamp: serverTimestamp()
                });
                // Automatically clear typing status after 5 seconds of inactivity
                setTimeout(async () => {
                    await remove(typingRef);
                }, 5000);
            } else {
                await remove(typingRef);
            }
        } catch (error) {
            console.error('Error updating typing status:', error);
        }
    }

    // Subscribe to typing status
    subscribeToTypingStatus(chatRoomId, callback) {
        const typingRef = ref(this.database, `chats/${chatRoomId}/typing`);
        onValue(typingRef, (snapshot) => {
            const typingStatus = snapshot.val() || {};
            callback(typingStatus);
        });

        return () => off(typingRef);
    }

    // Send a new message
    async sendMessage(senderId, receiverId, message) {
        const auth = getAuth();
        if (!auth.currentUser) throw new Error('User must be authenticated to send messages');
        if (!senderId) throw new Error('senderId is required');
        if (!receiverId) throw new Error('receiverId is required');
        if (!message || !message.trim()) throw new Error('message is required and cannot be empty');
        if (senderId !== auth.currentUser.uid) throw new Error('senderId must match current user');

        try {
            console.log('Sending message with params:', { senderId, receiverId, message });
            const chatRoomId = this.getChatRoomId(senderId, receiverId);
            console.log('Generated chatRoomId:', chatRoomId);

            const chatRef = ref(this.database, `chats/${chatRoomId}/messages`);
            console.log('Chat reference created:', chatRef);
            const newMessageRef = push(chatRef);

            const messageData = {
                senderId,
                text: message,
                timestamp: serverTimestamp(),
                status: 'sent'
            };
            console.log('Setting message data:', messageData);
            await set(newMessageRef, messageData);

            // Update last message in chat room
            const lastMessageData = {
                text: message,
                timestamp: serverTimestamp(),
                senderId
            };
            console.log('Updating last message:', lastMessageData);
            await set(ref(this.database, `chats/${chatRoomId}/lastMessage`), lastMessageData);

            console.log('Message successfully sent with ID:', newMessageRef.key);
            return newMessageRef.key;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    // Edit a message
    async editMessage(chatRoomId, messageId, newText) {
        try {
            const messageRef = ref(this.database, `chats/${chatRoomId}/messages/${messageId}`);
            await update(messageRef, {
                text: newText,
                edited: true,
                editedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error editing message:', error);
            throw error;
        }
    }

    // Delete a message
    async deleteMessage(chatRoomId, messageId) {
        try {
            const messageRef = ref(this.database, `chats/${chatRoomId}/messages/${messageId}`);
            await remove(messageRef);
        } catch (error) {
            console.error('Error deleting message:', error);
            throw error;
        }
    }

    // Subscribe to messages in a chat room
    subscribeToMessages(chatRoomId, callback) {
        const chatRef = ref(this.database, `chats/${chatRoomId}/messages`);
        onValue(chatRef, (snapshot) => {
            const messages = [];
            snapshot.forEach((childSnapshot) => {
                messages.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            callback(messages);
        });

        // Return unsubscribe function
        return () => off(chatRef);
    }

    // Get chat room messages once
    async getChatMessages(chatRoomId) {
        return new Promise((resolve, reject) => {
            const chatRef = ref(this.database, `chats/${chatRoomId}/messages`);
            onValue(chatRef, (snapshot) => {
                const messages = [];
                snapshot.forEach((childSnapshot) => {
                    messages.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
                resolve(messages);
            }, {
                onlyOnce: true
            }, reject);
        });
    }

    // Update message status (read/delivered)
    async updateMessageStatus(chatRoomId, messageId, status) {
        try {
            const messageRef = ref(this.database, `chats/${chatRoomId}/messages/${messageId}`);
            await update(messageRef, {
                status,
                statusTimestamp: serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating message status:', error);
            throw error;
        }
    }

    // Get user's recent chats
    async getUserChats(userId) {
        return new Promise((resolve, reject) => {
            const chatsRef = ref(this.database, 'chats');
            onValue(chatsRef, (snapshot) => {
                const chats = [];
                snapshot.forEach((childSnapshot) => {
                    const chatRoomId = childSnapshot.key;
                    if (chatRoomId.includes(userId)) {
                        const [user1Id, user2Id] = chatRoomId.split('_');
                        const otherUserId = user1Id === userId ? user2Id : user1Id;
                        chats.push({
                            chatRoomId,
                            otherUserId,
                            lastMessage: childSnapshot.val().lastMessage
                        });
                    }
                });
                resolve(chats);
            }, {
                onlyOnce: true
            }, reject);
        });
    }

    // Mark all messages as read
    async markChatAsRead(chatRoomId, userId) {
        try {
            const chatRef = ref(this.database, `chats/${chatRoomId}/messages`);
            onValue(chatRef, async (snapshot) => {
                const updates = {};
                snapshot.forEach((childSnapshot) => {
                    const message = childSnapshot.val();
                    if (message.senderId !== userId && message.status !== 'read') {
                        updates[`${childSnapshot.key}/status`] = 'read';
                        updates[`${childSnapshot.key}/readAt`] = serverTimestamp();
                    }
                });
                if (Object.keys(updates).length > 0) {
                    await update(chatRef, updates);
                }
            }, {
                onlyOnce: true
            });
        } catch (error) {
            console.error('Error marking chat as read:', error);
            throw error;
        }
    }
}

export const chatService = new ChatService();
