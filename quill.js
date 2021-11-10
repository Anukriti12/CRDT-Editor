/* eslint-env browser */

import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { WebsocketProvider } from 'y-websocket'
import { QuillBinding } from 'y-quill'
import Quill from 'quill'
import QuillCursors from 'quill-cursors'

Quill.register('modules/cursors', QuillCursors)

const url = new URL(window.location.href)

const roomid = url.searchParams.get("id") || "global"
console.log(roomid)

window.addEventListener('load', () => {
  const ydoc = new Y.Doc()
  const provider = new WebrtcProvider(roomid, ydoc, { 
          signaling: [
            'ws://secure-beyond-94007.herokuapp.com:5000/'
          ] })

  const type = ydoc.getText('quill')
  const editorContainer = document.createElement('div')
  editorContainer.setAttribute('id', 'editor')
  document.body.insertBefore(editorContainer, null)

  var editor = new Quill(editorContainer, {
    modules: {
      cursors: true,
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline'],
        ['image', 'code-block']
      ],
      history: {
        userOnly: true
      }
    },
    theme: 'snow' // or 'bubble'
  })

  const binding = new QuillBinding(type, editor, provider.awareness)

  const connectBtn = document.getElementById('y-connect-btn')
  const currentRoom = document.getElementById('curroom')
  currentRoom.innerHTML = provider.roomName
  connectBtn.addEventListener('click', () => {
    if (provider.shouldConnect) {
      provider.disconnect()
      
      connectBtn.children[0].classList.toggle("fa-link")
      connectBtn.children[0].classList.toggle("fa-chain-broken")
      connectBtn.style.backgroundColor = "#F00"
    } else {
      provider.connect()
      
      connectBtn.children[0].classList.toggle("fa-link")
      connectBtn.children[0].classList.toggle("fa-chain-broken")
      connectBtn.style.backgroundColor = "#0C9"
    }
  })

  const roomBtn = document.getElementById("y-update-room-btn")
  const roomInput = document.getElementById("roomid")
  roomInput.setAttribute('value',roomid)
  roomBtn.addEventListener('click',()=>{
    console.log(provider.roomName)
    console.log(roomInput.value)

    if(provider.roomName!=roomInput.value){
      window.open(window.location.href.split('?')[0]+"?id="+roomInput.value)
    }else{
      console.log("Same room")
    }

    
  })
  
  // @ts-ignore
  window.example = { provider, ydoc, type, binding, Y }
})
