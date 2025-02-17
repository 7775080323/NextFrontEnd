// "use client";

// import { useState, useEffect } from "react";
// import io from "socket.io-client";
// import axios from "axios";
// import { FaPaperPlane, FaUserCircle } from "react-icons/fa";

// const socket = io("http://localhost:5000");

// interface Message {
//   time: string;
//   sender: string;
//   text?: string;
//   status: "sent" | "delivered" | "read";
// }

// interface User {
//   name: string;
//   email: string;
//   avatar?: string;
//   isActive: boolean;
// }

// export default function Chat() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [message, setMessage] = useState("");
//   const [username, setUsername] = useState("");
//   const [users, setUsers] = useState<User[]>([]);

//   useEffect(() => {
//     const enteredUsername = prompt("Enter your name:") || "User";
//     setUsername(enteredUsername);
//     socket.emit("join", enteredUsername);

//     // Fetch registered users and active users
//     axios.post("http://localhost:5000/api/user/register")
//       .then(response => {
//         if (response.data.success) {
//           console.log('response.data.users', response.data.users)
//           setUsers(response.data.users);
//         }
//       })
//       .catch(error => console.error("Error fetching users:", error));

//     socket.on("users", (userList: User[]) => {
//       setUsers(prevUsers => prevUsers.map(user => ({
//         ...user,
//         isActive: userList.some(activeUser => activeUser.email === user.email)
//       })));
//     });
    
//     socket.on("previousMessages", (storedMessages: Message[]) => setMessages(storedMessages));
//     socket.on("receiveMessage", (messageData: Message) => setMessages(prev => [...prev, messageData]));

//     return () => {
//       socket.off("receiveMessage");
//       socket.off("previousMessages");
//       socket.off("users");
//     };
//   }, []);

//   const sendMessage = () => {
//     if (message.trim()) {
//       const newMessage: Message = {
//         sender: username,
//         text: message,
//         time: new Date().toISOString(),
//         status: "sent",
//       };
//       socket.emit("sendMessage", newMessage);
//       setMessage("");
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar for Registered and Active Users */}
//       <div className="w-1/4 bg-white shadow-lg p-4">
//         <div className="flex items-center mb-4">
//           <FaUserCircle className="text-4xl text-green-600" />
//           <div className="ml-2">
//             <h2 className="text-lg font-semibold">{username}</h2>
//             <p className="text-sm text-gray-500">Online</p>
//           </div>
//         </div>
//         <h3 className="text-lg font-semibold mb-2">Users</h3>
//         <ul className="space-y-3">
//           {users.map((user, index) => (
//             <li key={index} className={`flex items-center p-2 rounded-lg ${user.isActive ? "bg-green-200" : "bg-gray-200"}`}>
//               {user.avatar ? (
//                 <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
//               ) : (
//                 <FaUserCircle className="text-2xl text-gray-500" />
//               )}
//               <span className="ml-2 font-semibold">{user.name}</span>
//               {user.isActive && <span className="ml-auto text-xs text-green-600">● Online</span>}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Chat Section */}
//       <div className="w-3/4 flex flex-col">
//         <div className="bg-green-700 text-white p-4 font-semibold text-lg">Chat Room</div>
//         <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-200">
//           {messages.map((msg, index) => (
//             <div key={index} className={`flex ${msg.sender === username ? "justify-end" : ""}`}>
//               <div className={`px-4 py-2 max-w-xs rounded-lg shadow-md ${msg.sender === username ? "bg-green-500 text-white" : "bg-white text-gray-800"}`}>
//                 <span className="text-xs font-semibold">{msg.sender}</span>
//                 <p>{msg.text}</p>
//                 <span className="text-xs text-gray-500">{new Date(msg.time).toLocaleTimeString()}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="flex items-center p-3 bg-white shadow-md">
//           <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="flex-1 p-2 border rounded-lg outline-none" placeholder="Type a message..." />
//           <FaPaperPlane className="text-green-700 cursor-pointer mx-2" onClick={sendMessage} />
//         </div>
//       </div>
//     </div>
//   );
// }





"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
// import axios from "axios";
import { FaPaperPlane, FaUserCircle } from "react-icons/fa";

const socket = io("http://localhost:5000");

interface Message {
  time: string;
  sender: string;
  text?: string;
  status: "sent" | "delivered" | "read";
}

interface User {
  name: string;
  email: string;
  avatar?: string;
  isActive: boolean;
}

export default function Chat() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Fetch logged-in user's name
    const storedUser = localStorage.getItem("user");
    console.log('storedUser', storedUser)
    if (!storedUser) {
      router.push("/auth/signin"); // Redirect to login if no user is found
      return;
    }

    const { name } = JSON.parse(storedUser);
    setUsername(name);
    socket.emit("join", name);

    // Fetch registered users and active users
    // axios
    //   .get("http://localhost:5000/api/user/register")
    //   .then((response) => {
    //     if (response.data.success) {
    //       setUsers(response.data.users);
    //     }
    //   })
    //   .catch((error) => console.error("Error fetching users:", error));

    socket.on("users", (userList: User[]) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => ({
          ...user,
          isActive: userList.some((activeUser) => activeUser.email === user.email),
        }))
      );
    });

    socket.on("previousMessages", (storedMessages: Message[]) => setMessages(storedMessages));
    socket.on("receiveMessage", (messageData: Message) => setMessages((prev) => [...prev, messageData]));

    return () => {
      socket.off("receiveMessage");
      socket.off("previousMessages");
      socket.off("users");
    };
  }, [router]);

  const sendMessage = () => {
    if (message.trim() && username) {
      const newMessage: Message = {
        sender: username,
        text: message,
        time: new Date().toISOString(),
        status: "sent",
      };
      socket.emit("sendMessage", newMessage);
      setMessage("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for Registered and Active Users */}
      <div className="w-1/4 bg-white shadow-lg p-4">
        <div className="flex items-center mb-4">
          <FaUserCircle className="text-4xl text-green-600" />
          <div className="ml-2">
            <h2 className="text-lg font-semibold">{username}</h2>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">Users</h3>
        <ul className="space-y-3">
          {users.map((user, index) => (
            <li key={index} className={`flex items-center p-2 rounded-lg ${user.isActive ? "bg-green-200" : "bg-gray-200"}`}>
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
              ) : (
                <FaUserCircle className="text-2xl text-gray-500" />
              )}
              <span className="ml-2 font-semibold">{user.name}</span>
              {user.isActive && <span className="ml-auto text-xs text-green-600">● Online</span>}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Section */}
      <div className="w-3/4 flex flex-col">
        <div className="bg-green-700 text-white p-4 font-semibold text-lg">Chat Room</div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-200">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === username ? "justify-end" : ""}`}>
              <div className={`px-4 py-2 max-w-xs rounded-lg shadow-md ${msg.sender === username ? "bg-green-500 text-white" : "bg-white text-gray-800"}`}>
                <span className="text-xs font-semibold">{msg.sender}</span>
                <p>{msg.text}</p>
                <span className="text-xs text-gray-500">{new Date(msg.time).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center p-3 bg-white shadow-md">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 border rounded-lg outline-none"
            placeholder="Type a message..."
          />
          <FaPaperPlane className="text-green-700 cursor-pointer mx-2" onClick={sendMessage} />
        </div>
      </div>
    </div>
  );
}

