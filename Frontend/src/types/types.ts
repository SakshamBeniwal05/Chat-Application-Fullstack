import { Socket } from "socket.io-client"

export type authUserDataType = {
    _id: string,
    fullName: string,
    userName: string,
    email: string,
    createdAt: string,
    updatedAt: string,
    profilePic: string
}

export type LoginData = {
    email: string,
    password: string
}

export type SignUpData = {
    userName: string,
    fullName: string,
    email: string,
    password: string
}

export type authStoreDataType = {
    authUser: authUserDataType | null,
    isLoggingIn: boolean,
    isSignningUp: boolean,
    isCheckingAuth: boolean,
    isUpdatingProfile: boolean,
    socket: Socket | null,
    onlineUsers: string[] | string,

    checkUser: () => Promise<boolean>,
    login: (data: LoginData) => Promise<void>,
    signUp: (data: SignUpData) => Promise<void>,
    logout: () => Promise<void>,
    updateProfile: (photo: string | ArrayBuffer | null | File) => Promise<void | String>,
    connectSocket: () => void,
}

export type MessagedDataType = {
    _id: string,
    sender: authUserDataType,
    reciver: authUserDataType,
    message: string,
    photo: string,
}

export type SendMessageData = {
    message?: string,
    photo?: string,
}

export type messageStoreDataType = {
    isUserSearching: boolean,
    isMessageCollecting: boolean,
    isSendingMessage: boolean,
    otherUsers: authUserDataType[],
    chatMessages: MessagedDataType[],
    currentReciver: authUserDataType | null,
    currentReciverId: string | null,
    defaultProfile: string, 

    getUsers: () => Promise<void | string>,
    setCurrentReciever: (user: authUserDataType) => void,
    getMessages: (id:string) => Promise<void>,
    sentMessage: (id: string, data: SendMessageData) => Promise<Boolean>,
    liveMessages: () => void,
}

export type themeStoreDataType = {
    currentTheme: string,
    setTheme: (theme:string) => void
}