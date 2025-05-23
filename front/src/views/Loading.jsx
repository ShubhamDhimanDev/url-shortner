import Spinner from './Spinner'

export default function Loading() {
  return (
    <div className="absolute bg-theme-secondary  z-10  min-h-screen w-full flex items-center justify-center">
    <div className="flex items-center">
      <span className="text-3xl mr-4 text-white">Loading</span>
      <Spinner/>
    </div>
  </div>
  )
}
