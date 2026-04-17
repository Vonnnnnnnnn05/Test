// Chat module functions

function renderChat(container) {
    const chatMessages = getData('simms_chat_messages');
    const users = getData('simms_users');
    const otherUsers = users.filter(u => u.id !== currentUser.id);
    
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>Chat</h3>
            </div>
            <div class="form-group">
                <label>Select Recipient</label>
                <select id="chatRecipient" onchange="loadChatMessages()">
                    <option value="">Select a user...</option>
                    ${otherUsers.map(u => `
                        <option value="${u.id}">${u.name} (${u.role})</option>
                    `).join('')}
                </select>
            </div>
            <div class="chat-container">
                <div class="chat-messages" id="chatMessages">
                    <p style="text-align: center; color: #6b7280;">Select a recipient to start chatting</p>
                </div>
                <div class="chat-input">
                    <input type="text" id="messageInput" placeholder="Type your message..." onkeypress="if(event.key === 'Enter') sendMessage()">
                    <button class="btn btn-primary" onclick="sendMessage()">Send</button>
                </div>
            </div>
        </div>
    `;
}

function loadChatMessages() {
    const recipientId = parseInt(document.getElementById('chatRecipient').value);
    if (!recipientId) return;
    
    const chatMessages = getData('simms_chat_messages');
    const users = getData('simms_users');
    const conversation = chatMessages.filter(m => 
        (m.senderId === currentUser.id && m.receiverId === recipientId) ||
        (m.senderId === recipientId && m.receiverId === currentUser.id)
    );
    
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.innerHTML = conversation.map(msg => {
        const isSent = msg.senderId === currentUser.id;
        const sender = users.find(u => u.id === msg.senderId);
        return `
            <div class="chat-message ${isSent ? 'sent' : 'received'}">
                <small>${sender ? sender.name : 'Unknown'} - ${msg.timestamp}</small>
                <p>${msg.message}</p>
            </div>
        `;
    }).join('');
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendMessage() {
    const recipientId = parseInt(document.getElementById('chatRecipient').value);
    const message = document.getElementById('messageInput').value.trim();
    
    if (!recipientId || !message) {
        alert('Please select a recipient and enter a message');
        return;
    }
    
    const chatMessages = getData('simms_chat_messages');
    chatMessages.push({
        id: chatMessages.length + 1,
        senderId: currentUser.id,
        receiverId: recipientId,
        message: message,
        timestamp: new Date().toLocaleString()
    });
    
    setData('simms_chat_messages', chatMessages);
    document.getElementById('messageInput').value = '';
    loadChatMessages();
}
