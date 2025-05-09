'use client'

import { Button } from '@/components/ui/button'
import { LucideFileImage, LucideSave } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { toast } from 'sonner'
import { UAParser } from 'ua-parser-js'

function removeFileExtension(filename: string): string {
  const dotIndex = filename.lastIndexOf('.')
  if (dotIndex === -1) {
    return filename // No extension found, return the original filename
  }
  return filename.substring(0, dotIndex)
}

let inputFilenameWithoutExtension = '大頭貼'

// NOTE: hide download button for mobile
// reason: on mobile, users can simply long-press the image to download it
const deviceType = new UAParser().getDevice().type
const enableDownloadButton =
  deviceType === undefined || (deviceType !== 'mobile' && deviceType !== 'tablet' && deviceType !== 'wearable')

export function Taro() {
  const [outputImage, setOutputImage] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEvents = (isDraggingState: boolean) => (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(isDraggingState)
  }

  const processImage = (file: File) => {
    inputFilenameWithoutExtension = removeFileExtension(file.name ?? '大頭貼.png')

    const reader = new FileReader()
    const img = new Image()

    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string
      }
    }

    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Set canvas dimensions
      canvas.width = img.width
      canvas.height = img.height

      // Draw image
      ctx.drawImage(img, 0, 0)

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      const { length, byteLength, byteOffset } = imageData.data

      console.log({ length, byteLength, byteOffset })

      // Convert to grayscale
      for (let i = 0; i < data.length; i += 4) {
        // @ts-expect-error already check boundry
        const grayscale = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2]
        data[i] = data[i + 1] = data[i + 2] = grayscale
      }

      // Add purple tint
      for (let i = 0; i < data.length; i += 4) {
        // @ts-expect-error already check boundry
        data[i] = Math.min(255, data[i] + 70) // Red channel
        // @ts-expect-error already check boundry
        data[i + 2] = Math.min(255, data[i + 2] + 100) // Blue channel
      }

      // Update canvas with modified data
      ctx.putImageData(imageData, 0, 0)

      // Convert to data URL and update state
      const dataURL = canvas.toDataURL('image/png')
      setOutputImage(dataURL)

      toast.success('芋化成功！')
    }

    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      processImage(file)
    } else {
      toast.error('不支援此類型的檔案QQ')
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      console.log(file.name)

      processImage(file)
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = outputImage
    link.download = `${inputFilenameWithoutExtension}-芋化.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <h1 className="mb-8 text-center text-3xl font-bold">芋化大頭貼</h1>

      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileInput} className="hidden" />

      {/* Drag and drop area */}
      <div
        className={`xs:p-8 relative cursor-pointer rounded-xl border-2 border-dashed p-4 text-center transition-colors ${isDragging ? 'border-purple-500 bg-purple-50' : 'border-border hover:border-purple-400'}`}
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDragEvents(true)}
        onDragOver={handleDragEvents(true)}
        onDragLeave={handleDragEvents(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <LucideFileImage className={`size-12 ${isDragging ? 'text-purple-500' : 'text-muted-foreground'}`} />
          <div className="text-muted-foreground text-lg">
            <p className="font-medium">點此選取要被芋化的圖片</p>
          </div>
        </div>
      </div>

      {/* Output image */}
      {outputImage && (
        <div className="mt-8">
          <div className={`mb-4 flex items-center ${enableDownloadButton ? 'justify-between' : 'justify-center'}`}>
            <h2 className="text-primary text-2xl font-semibold">芋化結果</h2>

            {enableDownloadButton && (
              <Button onClick={handleDownload}>
                <LucideSave className="size-4" />
                儲存芋化圖片
              </Button>
            )}
          </div>

          <picture>
            <img src={outputImage} alt="Processed" className="w-full rounded-lg shadow-lg" />
          </picture>
        </div>
      )}

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
    </>
  )
}
