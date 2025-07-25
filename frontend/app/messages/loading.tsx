export default function MessagesLoading() {
  return (
    <div className="h-screen flex">
      <div className="w-1/3 border-r bg-gray-50 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`h-12 bg-gray-200 rounded w-${i % 2 === 0 ? "3/4" : "1/2"} ${i % 2 === 0 ? "ml-auto" : ""}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
