import { messageStore } from '../../store/messageStore'
import { useEffect, useRef, useState } from 'react'
import { authStore } from '../../store/auth.store'
import { Send, Users, MessageSquare } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

const HomePage = () => {
    const {
        isUserSearching,
        isMessageCollecting,
        otherUsers,
        chatMessages,
        getUsers,
        getMessages,
        defaultProfile,
        sentMessage,
        setCurrentReciever,
        currentReciver,
        liveMessages,
    } = messageStore()

    const { authUser, onlineUsers } = authStore()
    const { register, handleSubmit, reset } = useForm()
    const navigate = useNavigate()
    const { slug } = useParams()
    const messagesEndRef = useRef(null)
    const [showOnlineOnly, setShowOnlineOnly] = useState(false)

    // Auto-scroll when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chatMessages])

    // Fetch users once
    useEffect(() => {
        getUsers()
        liveMessages()
    }, [getUsers, liveMessages])

    // Sync receiver + messages from URL
    useEffect(() => {
        if (!slug || !otherUsers.length) return

        const found = otherUsers.find((u: any) => u._id === slug)
        if (!found) return

        if (currentReciver?._id !== slug) {
            setCurrentReciever(found)
        }

        getMessages(slug)
    }, [slug, otherUsers, currentReciver, getMessages, setCurrentReciever])

    const filteredUsers = showOnlineOnly
        ? otherUsers.filter((user: any) => onlineUsers.includes(user._id))
        : otherUsers

    return (
        <div className="bg-base-200">
            <div className="flex items-center justify-center">
                <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-full h-[calc(100vh-4rem)]">
                    <div className="flex h-full rounded-lg overflow-hidden">
                        
                        {/* ================= Sidebar ================= */}
                        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
                            <div className="border-b border-base-300 w-full p-5">
                                <div className="flex items-center gap-2">
                                    <Users className="size-6" />
                                    <span className="font-medium hidden lg:block">Contacts</span>
                                </div>
                                
                                <div className="mt-3 hidden lg:flex items-center gap-2">
                                    <label className="cursor-pointer flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={showOnlineOnly}
                                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                                            className="checkbox checkbox-sm"
                                        />
                                        <span className="text-sm">Show online only</span>
                                    </label>
                                    <span className="text-xs text-zinc-500">
                                        ({onlineUsers.length - 1} online)
                                    </span>
                                </div>
                            </div>

                            <div className="overflow-y-auto w-full py-3">
                                {isUserSearching ? (
                                    Array.from({ length: 7 }).map((_, i) => (
                                        <div key={i} className="flex gap-3 p-3">
                                            <div className="skeleton size-12 rounded-full mx-auto lg:mx-0" />
                                            <div className="hidden lg:flex flex-col gap-2">
                                                <div className="skeleton h-4 w-28" />
                                                <div className="skeleton h-3 w-20" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        {filteredUsers.map((user: any) => (
                                            <button
                                                key={user._id}
                                                onClick={() => {
                                                    setCurrentReciever(user)
                                                    navigate(`/${user._id}`)
                                                }}
                                                className={`
                                                    w-full p-3 flex items-center gap-3
                                                    hover:bg-base-300 transition-colors
                                                    ${currentReciver?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                                                `}
                                            >
                                                <div className="relative mx-auto lg:mx-0">
                                                    <img
                                                        src={user.profilePic || defaultProfile}
                                                        alt={user.userName}
                                                        className="size-12 object-cover rounded-full"
                                                    />
                                                    {onlineUsers.includes(user._id) && (
                                                        <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                                                    )}
                                                </div>
                                                
                                                <div className="hidden lg:block text-left min-w-0">
                                                    <div className="font-medium truncate">{user.userName}</div>
                                                    <div className="text-sm text-zinc-400">
                                                        {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                        {filteredUsers.length === 0 && (
                                            <div className="text-center text-zinc-500 py-4">No online users</div>
                                        )}
                                    </>
                                )}
                            </div>
                        </aside>

                        {/* ================= Chat Area ================= */}
                        {!currentReciver ? (
                            // No Chat Selected
                            <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50 overflow-y-scroll">
                                <div className="max-w-md text-center space-y-6">
                                    <div className="flex justify-center gap-4 mb-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
                                                <MessageSquare className="w-8 h-8 text-primary" />
                                            </div>
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold">Welcome to Chatty!</h2>
                                    <p className="text-base-content/60">
                                        Select a conversation from the sidebar to start chatting
                                    </p>
                                </div>
                            </div>
                        ) : (
                            // Chat Container
                            <div className="flex-1 flex flex-col overflow-auto">
                                {/* Chat Header */}
                                <div className="border-b border-base-300 p-5">
                                    <div className="flex items-center gap-3">
                                        <img
                                            className="size-10 rounded-full object-cover"
                                            src={currentReciver?.profilePic ?? defaultProfile}
                                            alt={currentReciver?.userName}
                                        />
                                        <div>
                                            <div className="font-medium">{currentReciver?.userName}</div>
                                            <div className="text-sm text-zinc-400">
                                                {onlineUsers.includes(currentReciver?._id) ? "Online" : "Offline"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages */}
                                {isMessageCollecting ? (
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {[48, 64, 40].map((_, i) => (
                                            <div key={i} className="chat chat-start">
                                                <div className="chat-bubble">
                                                    <div className="skeleton h-4 w-32" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {chatMessages?.map((each: any) => (
                                            <div
                                                key={each._id}
                                                className={`chat ${
                                                    each.sender === authUser._id ? 'chat-end' : 'chat-start'
                                                }`}
                                            >
                                                <div className="chat-image avatar">
                                                    <div className="size-10 rounded-full border">
                                                        <img
                                                            src={
                                                                each.sender === authUser._id
                                                                    ? authUser.profilePic || defaultProfile
                                                                    : currentReciver?.profilePic || defaultProfile
                                                            }
                                                            alt="profile pic"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="chat-bubble chat-bubble-primary">
                                                    {each.photo && (
                                                        <img
                                                            src={each.photo}
                                                            alt="Attachment"
                                                            className="sm:max-w-[200px] rounded-md mb-2"
                                                        />
                                                    )}
                                                    {each.message && <p>{each.message}</p>}
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}

                                {/* Message Input */}
                                <div className="border-t border-base-300 p-4">
                                    <form
                                        onSubmit={handleSubmit(async (data) => {
                                            if (!data.message?.trim()) return
                                            const success = await sentMessage(currentReciver?._id, data)
                                            if (success) reset()
                                        })}
                                    >
                                        <div className="flex items-end gap-3">
                                            <textarea
                                                rows={1}
                                                placeholder="Type a message..."
                                                className="flex-1 resize-none bg-base-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary max-h-40"
                                                {...register('message')}
                                                onInput={(e) => {
                                                    const t = e.currentTarget
                                                    t.style.height = 'auto'
                                                    t.style.height = `${t.scrollHeight}px`
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault()
                                                        e.currentTarget.form?.requestSubmit()
                                                    }
                                                }}
                                            />
                                            <button 
                                                type="submit"
                                                className="btn btn-circle btn-primary"
                                            >
                                                <Send className="size-5" />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage