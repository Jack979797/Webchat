import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDm0_nbkStCmpgIzGta4BUesPTt5Kh3r78",
    authDomain: "web-khac.firebaseapp.com",
    projectId: "web-khac",
    storageBucket: "web-khac.firebasestorage.app",
    messagingSenderId: "423943087602",
    appId: "1:423943087602:web:7261d79dc66a706d3e376b",
    databaseURL: "https://web-khac-default-rtdb.asia-southeast1.firebasedatabase.app"

};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const loginScreen = document.getElementById("login-screen");
const mainScreen = document.getElementById("main-screen");
const chatBtn = document.getElementById("chat-button");
const chatBox = document.getElementById("chat-box");
const sendBtn = document.getElementById("send");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

document.getElementById("continue").onclick = () => {
    const name = document.getElementById("name").value.trim();
    const userClass = document.getElementById("class").value.trim();

    if (name && userClass) {
        localStorage.setItem("userName", name);
        localStorage.setItem("userClass", userClass);
        loginScreen.style.display = "none";
        mainScreen.style.display = "block";
    }
};

chatBtn.onclick = () => {
    chatBox.classList.toggle("hidden");
};

sendBtn.onclick = () => {
    const msg = chatInput.value.trim();
    if (msg) {
        const name = localStorage.getItem("userName");
        const userClass = localStorage.getItem("userClass");
        const chatRef = ref(db, `chats/${name}_${userClass}`);
        push(chatRef, {
            sender: name,
            text: msg,
            time: new Date().toLocaleTimeString()
        });
        chatInput.value = "";
    }
};

// ✅ Gửi tin nhắn bằng phím Enter
chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendBtn.click(); // Gửi khi nhấn Enter
    }
});

window.onload = () => {
    const name = localStorage.getItem("userName");
    const userClass = localStorage.getItem("userClass");

    if (name && userClass) {
        let lastDate = "";
        const chatRef = ref(db, `chats/${name}_${userClass}`);  // Định nghĩa lại chatRef

        onChildAdded(chatRef, (data) => {
            const msg = data.val();
            const time = new Date(msg.timestamp || Date.now());
            const currentDate = time.toLocaleDateString("vi-VN");

            // Hiển thị ngày nếu khác ngày
            if (currentDate !== lastDate) {
                lastDate = currentDate;
                const dateDiv = document.createElement("div");
                dateDiv.className = "date-divider";
                dateDiv.innerText = currentDate;
                chatMessages.appendChild(dateDiv);
            }

            // Hiển thị bong bóng tin nhắn
            const msgDiv = document.createElement("div");
            msgDiv.className = `chat-bubble ${msg.sender === "admin" ? "admin" : "user"}`;
            msgDiv.innerHTML = `
  <div class="text"><strong>${msg.sender === "admin" ? "Admin" : msg.sender}</strong></div>
  <div class="text">${msg.text}</div>
  <div class="time">${time.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}</div>
`;

            chatMessages.appendChild(msgDiv);

            // Tự động cuộn xuống tin nhắn mới nhất
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    }
};
