import { useParams } from "react-router-dom";

export default function Article() {
  const { slug } = useParams();
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Article: {slug}</h1>
      <p className="text-neutral-300">Single article placeholder view.</p>
    </div>
  );
}
