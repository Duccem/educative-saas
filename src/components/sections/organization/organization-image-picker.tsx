"use client";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import { useRef, useState } from "react";

type OrganizationImagPickerProps = {
  file?: File;
  onFileSelect: (file: File) => void;
  url?: string;
};

export const OrganizationImagePicker = ({
  onFileSelect,
  url,
}: OrganizationImagPickerProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(url || null);
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex items-center gap-4">
      {imagePreview ? (
        <div className="size-16 p-0 rounded-xl border flex justify-center items-center overflow-hidden">
          <img
            src={imagePreview || ""}
            alt=""
            className="object-cover w-full aspect-square rounded-xl"
          />
        </div>
      ) : (
        <div className="size-16 p-3 rounded-xl border flex justify-center items-center">
          <UserCircle />
        </div>
      )}
      <Button type="button" onClick={() => fileRef.current?.click()}>
        Upload Logo
      </Button>
      <input
        type="file"
        name=""
        id=""
        className="hidden"
        ref={fileRef}
        onChange={(e) => {
          if (e.target.files) {
            onFileSelect(e.target.files[0]);
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                setImagePreview(event.target.result as string);
              }
            };
            reader.readAsDataURL(e.target.files[0]);
          }
        }}
      />
    </div>
  );
};

