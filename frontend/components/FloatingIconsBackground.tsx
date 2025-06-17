"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface FloatingIcon {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  type: "bitcoin" | "ethereum" | "stablecoin"
  color: string
}

export default function FloatingIconsBackground() {
  const [icons, setIcons] = useState<FloatingIcon[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  useEffect(() => {
    if (dimensions.width === 0) return

    const iconTypes = ["bitcoin", "ethereum", "stablecoin"] as const
    const colors = ["#f59e0b", "#8b5cf6", "#06b6d4"]

    const initialIcons: FloatingIcon[] = Array.from({ length: 8 }, (_, i) => {
      const type = iconTypes[i % iconTypes.length]
      const size = 40 + Math.random() * 30

      return {
        id: i,
        x: Math.random() * (dimensions.width - size),
        y: Math.random() * (dimensions.height - size),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size,
        type,
        color: colors[i % colors.length],
      }
    })

    setIcons(initialIcons)
  }, [dimensions])

  useEffect(() => {
    if (icons.length === 0) return

    const animate = () => {
      setIcons((prevIcons) => {
        const newIcons = [...prevIcons]

        // Update positions
        newIcons.forEach((icon) => {
          icon.x += icon.vx
          icon.y += icon.vy

          // Bounce off walls
          if (icon.x <= 0 || icon.x >= dimensions.width - icon.size) {
            icon.vx *= -1
            icon.x = Math.max(0, Math.min(dimensions.width - icon.size, icon.x))
          }
          if (icon.y <= 0 || icon.y >= dimensions.height - icon.size) {
            icon.vy *= -1
            icon.y = Math.max(0, Math.min(dimensions.height - icon.size, icon.y))
          }
        })

        // Collision detection and resolution
        for (let i = 0; i < newIcons.length; i++) {
          for (let j = i + 1; j < newIcons.length; j++) {
            const icon1 = newIcons[i]
            const icon2 = newIcons[j]

            const dx = icon2.x - icon1.x
            const dy = icon2.y - icon1.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const minDistance = (icon1.size + icon2.size) / 2 + 20 // 20px buffer

            if (distance < minDistance) {
              // Calculate collision response
              const angle = Math.atan2(dy, dx)
              const targetX = icon1.x + Math.cos(angle) * minDistance
              const targetY = icon1.y + Math.sin(angle) * minDistance

              // Separate the icons
              const ax = (targetX - icon2.x) * 0.05
              const ay = (targetY - icon2.y) * 0.05

              icon1.vx -= ax
              icon1.vy -= ay
              icon2.vx += ax
              icon2.vy += ay

              // Apply damping
              icon1.vx *= 0.98
              icon1.vy *= 0.98
              icon2.vx *= 0.98
              icon2.vy *= 0.98
            }
          }
        }

        return newIcons
      })
    }

    const interval = setInterval(animate, 16) // ~60fps
    return () => clearInterval(interval)
  }, [icons.length, dimensions])

  const getIconSymbol = (type: string) => {
    switch (type) {
      case "bitcoin":
        return "₿"
      case "ethereum":
        return "Ξ"
      case "stablecoin":
        return "$"
      default:
        return "₿"
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {icons.map((icon) => (
        <motion.div
          key={icon.id}
          className="absolute rounded-full backdrop-blur-sm border border-opacity-30 flex items-center justify-center font-bold text-white shadow-lg"
          style={{
            left: icon.x,
            top: icon.y,
            width: icon.size,
            height: icon.size,
            backgroundColor: `${icon.color}20`,
            borderColor: icon.color,
            boxShadow: `0 0 20px ${icon.color}40`,
            fontSize: icon.size * 0.4,
          }}
          animate={{
            boxShadow: [`0 0 20px ${icon.color}40`, `0 0 30px ${icon.color}60`, `0 0 20px ${icon.color}40`],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {getIconSymbol(icon.type)}
        </motion.div>
      ))}
    </div>
  )
}
