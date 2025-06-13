"use client"

import { useState, useEffect } from 'react'

interface UseTypewriterProps {
  text: string
  delay?: number
  startDelay?: number
}

export const useTypewriter = ({ text, delay = 50, startDelay = 0 }: UseTypewriterProps) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    
    const startAnimation = () => {
      let currentIndex = 0
      
      const typeNextCharacter = () => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1))
          currentIndex++
          timeout = setTimeout(typeNextCharacter, delay)
        } else {
          setIsComplete(true)
        }
      }

      timeout = setTimeout(typeNextCharacter, startDelay)
    }

    startAnimation()

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [text, delay, startDelay])

  return { displayedText, isComplete }
} 