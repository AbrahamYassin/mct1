export default async function Preview({ params }){
  return (<div className="max-w-6xl mx-auto p-4 bg-white rounded-2xl shadow-soft">
    <iframe src={`/api/cv/${params.id}/export`} className="w-full h-[80vh] border rounded-xl"></iframe>
  </div>)
}
