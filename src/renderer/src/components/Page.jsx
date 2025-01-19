export default function Page({ pageIndex, pageSize }) {
  const { width, height } = pageSize;
  const pageGap = 24; // Adjust this value to set the desired gap between pages
  const contentMargin = 40; // Add top and bottom margins for better content break

  return (
    <div
      className="absolute left-0 right-0 bg-white shadow-lg border-2 border-gray-300 rounded-lg"
      style={{
        top: `${pageIndex * (height + pageGap)}px`, // Add spacing between pages
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {/* Content wrapper with margin for top and bottom spacing */}
      <div
        className="page-content"
        style={{
          marginTop: `${contentMargin}px`,
          marginBottom: `${contentMargin}px`,
          height: `calc(${height}px - ${contentMargin * 2}px)`, // Adjust content height
          overflow: 'hidden', // Prevent content overflow
        }}
      >
        {/* Your content goes here */}
      </div>

      <div className="absolute bottom-4 right-4 text-sm text-gray-500">
        Page {pageIndex + 1}
      </div>
    </div>
  );
}
