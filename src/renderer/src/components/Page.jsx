
export default function Page({ pageIndex, isLast, pageSize, pageGap, contentMargin }) {
  const { width, height } = pageSize;

  return (
    <div
      className={`absolute left-0 right-0 shadow-md border border-gray-200  bg-white`}
      style={{
        top: `${pageIndex * (height + pageGap)}px`, // Add vertical gap between pages
        width: `${width}px`,
        height: `${height}px`,
        boxShadow: `0 4px 8px rgba(0, 0, 0, 0.1)`, // Subtle shadow for modern feel
      }}
    >
      {/* Page Content Area */}
      <div
        className={`relative h-full overflow-hidden px-10 py-12`}
        style={{
          marginTop: `${contentMargin}px`,
          marginBottom: `${contentMargin}px`,
          height: `calc(${height}px - ${contentMargin * 2}px)`, // Dynamic height adjustment
        }}
      >
        {/* Placeholder for the page content */}
        <div className="text-gray-600 font-serif text-base tracking-wide">
          {/* Add your editable content here */}
        </div>
      </div>

      {/* Footer with Page Number */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-500">
        Page {pageIndex + 1}
      </div>

      {/* Non-editable Page Break Area */}
      {!isLast && (
        <div
          className="absolute bottom-0 left-0 w-full"
          style={{
            height: `${pageGap}px`, // Visual gap between pages
            transform: `translateY(50%)`,
            pointerEvents: 'none', // Prevent interactions with page break
          }}
        />
      )}
    </div>
  );
}
