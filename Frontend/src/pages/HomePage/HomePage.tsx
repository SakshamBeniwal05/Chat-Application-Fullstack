import { messageStore } from '../../store/messageStore'
import { useEffect } from 'react'
import { authStore } from '../../store/auth.store'
import { Send } from 'lucide-react'
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
    } = messageStore()

    const { authUser,onlineUsers,connectSocket } = authStore()
    const { register, handleSubmit } = useForm()
    const navigate = useNavigate()
    const { slug } = useParams()

    /* ✅ Fetch users once */
    useEffect(() => {
        getUsers()
        console.log(onlineUsers);
    }, [getUsers,connectSocket])

    /* ✅ Sync receiver + messages from URL */
    useEffect(() => {
        if (!slug || !otherUsers.length) return

        const found = otherUsers.find((u: any) => u._id === slug)
        if (!found) return

        if (currentReciver?._id !== slug) {
            setCurrentReciever(found)
        }

        getMessages(slug)
    }, [slug, otherUsers, currentReciver, getMessages, setCurrentReciever])

    return (
        <div className="flex">

            {/* ================= Sidebar ================= */}
            <div className="w-1/5 bg-primary rounded-2xl m-3 p-2 min-h-[90vh]">
                {isUserSearching ? (
                    <>
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div key={i} className="flex gap-5 p-10 rounded-2xl">
                                <div className="skeleton size-10 rounded-box" />
                                <div className="flex flex-col gap-2">
                                    <div className="skeleton h-4 w-28" />
                                    <div className="skeleton h-3 w-20 opacity-70" />
                                </div>
                            </div>
                        ))}
                    </>
                ) :  (
                    <div>
                        <div className='flex justify-center text-xl font-semibold text-secondary-content p-2'>Currently Online Users {onlineUsers.length - 1} </div>
                        {otherUsers.map((user) => (
                            <button
                            key={user._id}
                            type="button"
                            className="w-full text-left"
                            onClick={() => {
                                setCurrentReciever(user)
                                navigate(`/${user._id}`)
                            }}
                        >
                            <div className="flex gap-5 p-5 rounded-2xl hover:bg-secondary font-bold">
                                <img
                                    className="size-10 rounded-box"
                                    src={user.profilePic ?? defaultProfile}
                                />
                                        {onlineUsers.includes(user._id)&& (<span className='relative right-8 top-7 size-3 bg-green-300 rounded-full ring-2 ring-zinc-900'></span>)}
                                <div>
                                    <div>{user.userName}</div>
                                    <div className="text-xs uppercase font-semibold opacity-60">
                                        {user.fullName}
                                    </div>
                                </div>
                            </div>  
                        </button>
                    ))}
                    </div>
                )}
            </div>

            {/* ================= Chat ================= */}
            <div className="flex-1 m-3">

                {isMessageCollecting ? (
                    <div className="flex flex-col gap-4">
                        {[48, 64, 40].map((w, i) => (
                            <div key={i} className="chat chat-start">
                                <div className="chat-bubble">
                                    <div className={`skeleton h-4 w-${w}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : chatMessages === null ? (
                    <div className="flex justify-center items-center h-screen">
                        Select user to Message
                    </div>
                ) : (
                    <div className="flex flex-col h-[90vh]">

                        {/* Header */}
                        <div className="flex gap-5 p-5 font-bold">
                            <img
                                className="size-10 rounded-box"
                                src={currentReciver?.profilePic ?? defaultProfile}
                            />
                            <div>
                                <div>{currentReciver?.userName}</div>
                                <div className="text-xs uppercase opacity-60">
                                    {currentReciver?.fullName}
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto">
                            {chatMessages.map((each: any) => (
                                <div
                                    key={each._id}
                                    className={`chat ${
                                        each.sender === authUser._id
                                            ? 'chat-end'
                                            : 'chat-start'
                                    }`}
                                >
                                    <div className="chat-bubble chat-bubble-primary">
                                        {each.message || each.photo}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <form
                            onSubmit={handleSubmit((data) => 
                                sentMessage(currentReciver?._id, data)
                                
                            )}
                            className="p-3"
                        >
                            <div className="flex items-end gap-3 bg-primary rounded-2xl p-3">
                                <textarea
                                    rows={1}
                                    className="w-full resize-none bg-transparent focus:outline-none max-h-40"
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
                                <button className="btn btn-circle btn-primary">
                                    <Send />
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HomePage
