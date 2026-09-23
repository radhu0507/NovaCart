import { useEffect, useState } from "react";

const FALLBACK_IMAGE =
  "data:image/svg+xml," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'>" +
      "<rect width='100%' height='100%' fill='#e2e8f0'/>" +
      "<text x='50%' y='50%' font-family='sans-serif' font-size='24' fill='#94a3b8' text-anchor='middle'>NovaCart</text>" +
      "</svg>"
  );

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ProductImage({ src, alt, className }: ProductImageProps) {
  const [current, setCurrent] = useState(src);

  useEffect(() => {
    setCurrent(src);
  }, [src]);

  return (
    <img
      src={current}
      alt={alt}
      loading="lazy"
      className={className ?? "h-full w-full object-cover"}
      onError={() => setCurrent(FALLBACK_IMAGE)}
    />
  );
}