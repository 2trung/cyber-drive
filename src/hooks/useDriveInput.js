import { useEffect, useRef, useState } from 'react'

export function useDriveInput() {
  const [isTurbo, setIsTurbo] = useState(false)
  const isTurboRef = useRef(false)
  const targetMouseX = useRef(0)

  useEffect(() => {
    const onMouseMove = (e) => {
      targetMouseX.current = (e.clientX - window.innerWidth / 2) * 0.003
    }

    const onPointerDown = (e) => {
      if (e.button !== 0) return
      isTurboRef.current = true
      setIsTurbo(true)
    }

    const onPointerUp = () => {
      isTurboRef.current = false
      setIsTurbo(false)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [])

  return { isTurbo, isTurboRef, targetMouseX }
}
