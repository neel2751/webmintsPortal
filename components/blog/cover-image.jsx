import Image from "next/image";

export const CoverImage = ({ url, alt = "Blog Cover", aspect = "video" }) => {
  // Define aspect ratio classes
  const aspectRatios = {
    video: "aspect-video", // 16:9
    square: "aspect-square", // 1:1
    wide: "aspect-[21/9]", // Cinematic
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl shadow-sm ${aspectRatios[aspect]}`}
    >
      <Image
        src={url}
        alt={alt}
        fill // This makes it fill the container regardless of source size
        priority // Good for LCP (Largest Contentful Paint)
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-300 hover:scale-105"
        // object-cover ensures the image fills the area without stretching
      />
    </div>
  );
};
