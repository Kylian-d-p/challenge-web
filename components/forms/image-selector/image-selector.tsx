import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { Check, Loader, Upload } from "lucide-react";
import Image from "next/image";
import { PropsWithChildren, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import listImagesAction from "./list-images-action";

export default function ImageSelector(
  props: PropsWithChildren<
    | { mode: "single"; defaultValue?: string; onChange: (value: string) => void }
    | { mode: "multiple"; defaultValue?: string[]; onChange: (value: string[]) => void }
  >
) {
  const [selectedImages, setSelectedImages] = useState<string[]>(
    Array.isArray(props.defaultValue) ? props.defaultValue : props.defaultValue ? [props.defaultValue] : []
  );
  const [images, setImages] = useState<string[]>([]);
  const [nextContinuationToken, setNextContinuationToken] = useState<string>();
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getMore = async () => {
    setLoading(true);
    const res = await listImagesAction({ nextContinuationToken });
    setLoading(false);
    console.log(res);
    if (!res.data) {
      toast.error("Erreur lors de la récupération des médias");
      setHasMore(false);
      return;
    }

    if (res.data.error) {
      toast.error(res.data.error);
      setHasMore(false);
      return;
    }

    setImages((prev) => [...prev, ...(res.data?.medias ?? [])]);

    if (!res.data.nextContinuationToken) {
      setHasMore(false);
      return;
    }

    setNextContinuationToken(res.data.nextContinuationToken);
  };

  const handleImageClick = (image: string) => {
    let newSelectedImages: string[];

    if (props.mode === "single") {
      if (selectedImages[0] === image) {
        newSelectedImages = [];
      } else {
        newSelectedImages = [image];
      }
      setSelectedImages(newSelectedImages);
      props.onChange(newSelectedImages[0] || "");
      setDialogOpen(false);
    } else if (props.mode === "multiple") {
      if (selectedImages.includes(image)) {
        newSelectedImages = selectedImages.filter((m) => m !== image);
      } else {
        newSelectedImages = [...selectedImages, image];
      }
      setSelectedImages(newSelectedImages);
      props.onChange(newSelectedImages);
    }
  };

  return (
    <div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>{props.children}</DialogTrigger>
        <DialogContent className="max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choisir un média</DialogTitle>
            <DialogDescription>Choisissez un média existant ou importez-en un nouveau ci-dessous.</DialogDescription>
          </DialogHeader>
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0];

              if (!file) {
                return;
              }

              const formData = new FormData();
              formData.append("file", file);

              setUploadingFile(true);

              const res = await fetch("/api/media/upload", {
                method: "POST",
                body: formData,
              });
              const data = await res.json();

              setUploadingFile(false);

              if (data && data.error) {
                toast.error(data.error);
              }

              if (data && data.message) {
                toast.success(data.message);
              }

              if (data && data.url) {
                setImages((prev) => [data.url, ...prev]);
              }

              inputRef.current!.value = "";
            }}
          />
          <InfiniteScroll getMore={getMore} hasMore={hasMore} loading={loading}>
            <div className="grid grid-cols-3 gap-2">
              <Button variant={"secondary"} className="w-full h-full flex flex-col gap-2" onClick={() => inputRef.current?.click()}>
                {uploadingFile ? <Loader className="size-8 animate-spin" /> : <Upload className="size-8" />}
                <span>Importer</span>
              </Button>
              {images.map((image) => (
                <div
                  key={image}
                  className="relative aspect-square flex flex-col items-center justify-center gap-2 rounded-lg overflow-hidden hover:*:scale-105 *:transition-transform cursor-pointer bg-muted"
                  onClick={() => handleImageClick(image)}
                >
                  <Image src={image} alt="image téléchargée par l'utilisateur" width={100} height={100} className="w-full h-full object-contain" />
                  {(props.mode === "multiple" && selectedImages.includes(image)) || (props.mode === "single" && selectedImages[0] === image) ? (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-background/50">
                      <Check className="size-12" />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </InfiniteScroll>
        </DialogContent>
      </Dialog>
    </div>
  );
}
