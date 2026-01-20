import React, { useEffect } from 'react'
import { messageStore } from '../../store/messageStore'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const HomePage = () => {
    const { getUsers, getMessages, otherUsers, chatMessages, selectedUserId, setSelectedUser, isUserSearching, isMessageCollecting } = messageStore()

    useEffect(() => {
        getUsers()
    }, [])
    console.log(otherUsers);

    return (
        <div className="flex h-screen bg-base-100">
            {/* sidebar */}
            <div className="w-1/3 bg-base-200 border-r border-base-300 overflow-y-auto">
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-4">Users</h2>
                    {isUserSearching ? (
                        <div className="flex justify-center py-4">
                            <span className="loading loading-spinner loading-md"></span>
                        </div>
                    ) : otherUsers && otherUsers.length > 0 ? (
                        otherUsers.map((user: any) => (
                            <div
                                key={user._id}
                                onClick={() => setSelectedUser(user._id)}
                                className={`p-3 rounded cursor-pointer transition ${selectedUserId === user._id
                                        ? "bg-accent text-accent-content"
                                        : "hover:bg-base-300"
                                    }`}>
                                <Link to={`/${user._id}`}>
                                    {user.userName}
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No users found</p>
                    )}
                </div>
            </div>

            {/* chat area */}
            <div className="w-2/3 flex flex-col">
                {selectedUserId ? (
                    <>
                        <div className="flex-1 overflow-y-auto p-4 bg-base-100">
                            {isMessageCollecting ? (
                                <div className="flex justify-center items-center h-full">
                                    <span className="loading loading-spinner loading-md"></span>
                                </div>
                            ) : chatMessages && chatMessages.length > 0 ? (
                                chatMessages.map((msg: any) => (
                                    <div key={msg._id} className="mb-4 p-2 bg-base-200 rounded">
                                        <p className="text-sm">{msg.message}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No messages yet</p>
                            )}
                        </div>
                        <div className="p-4 border-t border-base-300">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="input input-bordered w-full"
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-xl text-gray-500">
                        Select a user to start chatting
                    </div>
                )}
            </div>
        </div>
    )
}

export default HomePage