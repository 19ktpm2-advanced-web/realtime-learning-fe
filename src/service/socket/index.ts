import React from 'react'
import { io } from 'socket.io-client'
import { config } from '../../config'

export const socket = io(config.socket.SERVER_URL || 'http://localhost:3300')
export const SocketContext = React.createContext(socket)
