"use client"

import { useState, useRef, useCallback } from 'react'

// Type declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

interface SpeechRecognitionEvent extends Event {
  results: any
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

export interface UseVoiceRecordingReturn {
  isRecording: boolean
  transcript: string
  startRecording: () => Promise<void>
  stopRecording: () => Promise<string>
  error: string | null
}

export const useVoiceRecording = (): UseVoiceRecordingReturn => {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recognitionRef = useRef<any>(null)
  const currentTranscriptRef = useRef<string>('')

  const startRecording = useCallback(async () => {
    try {
      console.log('Starting voice recording...')
      setError(null)
      setTranscript('')
      currentTranscriptRef.current = ''
      
      // Check if browser supports speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      
      if (!SpeechRecognition) {
        console.error('Speech recognition not supported')
        throw new Error('Speech recognition not supported in this browser')
      }
      
      console.log('Speech recognition is supported')

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Set up speech recognition
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'he-IL' // Hebrew language support
      
      recognition.onresult = (event: any) => {
        console.log('Speech recognition result event:', event)
        let finalTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          console.log('Transcript part:', transcript, 'isFinal:', event.results[i].isFinal)
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          }
        }
        
        if (finalTranscript) {
          console.log('Adding final transcript:', finalTranscript)
          currentTranscriptRef.current += finalTranscript
          setTranscript(prev => {
            const newTranscript = prev + finalTranscript
            console.log('Updated transcript:', newTranscript)
            return newTranscript
          })
        }
      }
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setError('Speech recognition error: ' + event.error)
        setIsRecording(false)
      }
      
      recognition.onend = () => {
        setIsRecording(false)
      }
      
      // Start recording
      recognition.start()
      recognitionRef.current = recognition
      setIsRecording(true)
      
      // Clean up the stream since we're only using it for permissions
      stream.getTracks().forEach(track => track.stop())
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start recording'
      setError(errorMessage)
      setIsRecording(false)
    }
  }, [])

  const stopRecording = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      console.log('Stopping voice recording...', 'Current transcript:', currentTranscriptRef.current)
      
      if (recognitionRef.current) {
        // Set up a one-time event listener for when recognition ends
        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended, final transcript:', currentTranscriptRef.current)
          setIsRecording(false)
          resolve(currentTranscriptRef.current)
        }
        
        recognitionRef.current.stop()
        recognitionRef.current = null
      } else {
        setIsRecording(false)
        resolve(currentTranscriptRef.current)
      }
    })
  }, [])

  return {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
    error
  }
} 