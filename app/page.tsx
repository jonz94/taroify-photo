import { Taro } from '@/app/taro'
import { ModeToggle } from '@/components/mode-toggle'

export default function Home() {
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <main className="flex h-full flex-col justify-center gap-y-4">
        <Taro></Taro>

        <div className="absolute top-4 right-4">
          <ModeToggle></ModeToggle>
        </div>
      </main>
    </div>
  )
}
