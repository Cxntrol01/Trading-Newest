export default function WorkspacePage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Workspace</h1>

        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 bg-gray-800 rounded border border-gray-700 hover:bg-gray-700">
            1 Chart
          </button>
          <button className="px-3 py-1.5 bg-gray-800 rounded border border-gray-700 hover:bg-gray-700">
            2 Charts
          </button>
          <button className="px-3 py-1.5 bg-gray-800 rounded border border-gray-700 hover:bg-gray-700">
            4 Charts
          </button>
        </div>
      </div>

      <div className="border border-gray-800 rounded-lg p-4 min-h-[600px] bg-gray-900/40">
        <p className="text-gray-500 text-center mt-20">
          Chart grid will appear here.
        </p>
      </div>
    </div>
  );
}
