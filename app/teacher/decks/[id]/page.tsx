export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="flex gap-4">
      <div className="basis-80 border-r-4 grid grid-rows-3">
        <button className="w-36 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Sub-deck
        </button>
        <div className="flex">id: {params.id}</div>
      </div>
      <div className="basis-80 border-r-4">
        <button className="w-36 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add card</button>
      </div>
      <div>Preview/Edit Toggle</div>
    </div>
  )
}
