import type { ComponentProps } from "react";

type SiteImageProps = ComponentProps<"img"> & {
  alt: string;
};

const SiteImage = ({ alt, ...props }: SiteImageProps) => (
  <img alt={alt} loading="lazy" {...props} />
);

export default SiteImage;
