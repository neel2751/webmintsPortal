import React from "react";

export default function BlogPreview({ data }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
      <p className="text-gray-600 mb-2">
        By {data.author} on {new Date(data.date).toLocaleDateString()}
      </p>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: data.content }}
      />
    </div>
  );
}
