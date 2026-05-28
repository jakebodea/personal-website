"use client"

import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

interface ProjectGalleryProps {
  images: { url: string; alt: string }[]
}

export function ProjectGallery({ images }: ProjectGalleryProps) {
  return (
    <Carousel className="mt-4 w-full">
      <CarouselContent>
        {images.map((image) => (
          <CarouselItem key={image.url}>
            <figure className="overflow-hidden rounded-lg border border-border">
              <Image
                src={image.url}
                alt={image.alt}
                width={1200}
                height={675}
                className="h-auto w-full"
              />
              <figcaption className="px-3 py-2 text-xs text-muted-foreground">
                {image.alt}
              </figcaption>
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 top-[calc(50%-1rem)] -translate-y-1/2" />
      <CarouselNext className="right-2 top-[calc(50%-1rem)] -translate-y-1/2" />
    </Carousel>
  )
}
