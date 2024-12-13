import React, { createContext } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5001');

const AppContext = createContext(); 

export { AppContext, socket };
