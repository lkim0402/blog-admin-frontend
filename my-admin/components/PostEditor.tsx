import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import TextAlign from "@tiptap/extension-text-align";

import PostButtonMenu from "./PostButtonMenu";
import { TagsInput } from "./TagsInput";
import Button from "./button";
import { all, createLowlight } from "lowlight";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { Post } from "../src/types/post";
const lowlight = createLowlight(all);

import { ArrowLeftFromLine } from "lucide-react";

// Cloudinary widget type definition
declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: object,
        callback: (error: Error | null, result: CloudinaryUploadResult) => void
      ) => CloudinaryWidget;
    };
  }
}

type PostEditorProps = {
  post: Post; // initial Post
  setPost: React.Dispatch<React.SetStateAction<Post>>;
  //"setPost is a function that updates a state variable of type Post."
  onSubmit: () => void;
  onPrevious: () => void;
};

interface CloudinaryUploadResult {
  event: string;
  info: {
    secure_url: string;
  };
}

interface CloudinaryWidget {
  open: () => void;
}

export default function PostEditor({
  post,
  setPost,
  onSubmit,
  onPrevious,
}: PostEditorProps) {
  const [showRaw, setShowRaw] = useState(false);
  const cloudinaryWidgetRef = useRef<CloudinaryWidget | null>(null);

  const editor = useEditor({
    content: post.body || "",
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Link.configure({
        openOnClick: true, // Make links clickable
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      ImageResize,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    editorProps: {
      attributes: {
        class: "h-[45rem] overflow-y-auto",
      },
    },
    onUpdate({ editor }) {
      setPost((prevPost) => ({
        ...prevPost,
        body: editor.getHTML(),
      }));
    },
  });

  // Simple image insertion via URL prompt
  const addImageByUrl = useCallback(() => {
    const url = window.prompt("Enter image URL");

    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  // Initialize Cloudinary widget
  useEffect(() => {
    // Load Cloudinary script if not already loaded
    if (!document.getElementById("cloudinary-widget-script")) {
      const script = document.createElement("script");
      script.id = "cloudinary-widget-script";
      script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      // Cleanup if needed
      if (cloudinaryWidgetRef.current) {
        cloudinaryWidgetRef.current = null;
      }
    };
  }, []);

  // Function to open the Cloudinary upload widget
  const openCloudinaryWidget = useCallback(() => {
    if (typeof window !== "undefined" && window.cloudinary) {
      // Initialize the widget if it doesn't exist
      if (!cloudinaryWidgetRef.current) {
        cloudinaryWidgetRef.current = window.cloudinary.createUploadWidget(
          {
            cloudName: "dwa6lkvcr", // Replace with your Cloudinary cloud name
            uploadPreset: "cloudinary-preset", // Replace with your upload preset
            multiple: false,
            resourceType: "image",
          },
          (error: Error | null, result: CloudinaryUploadResult) => {
            if (!error && result && result.event === "success" && editor) {
              // Insert the uploaded image into the editor
              const imageUrl = result.info.secure_url;
              editor.chain().focus().setImage({ src: imageUrl }).run();
            }
          }
        );
      }

      // Open the widget
      if (cloudinaryWidgetRef.current) {
        cloudinaryWidgetRef.current.open();
      }
    } else {
      console.error("Cloudinary widget script not loaded yet");
      alert("Image upload is not ready yet. Please try again in a moment.");
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between gap-2 my-6 ">
        <button onClick={onPrevious} className="hover:cursor-pointer">
          <ArrowLeftFromLine />
        </button>
        <Button text={"Save"} onClick={onSubmit} />
      </div>

      {/* The menu */}
      <section className="flex flex-col space-y-2">
        <section className="flex flex-col gap-2 ">
          <label id="title"></label>
          <input
            type="text"
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            value={post.title ?? ""}
            placeholder="Title"
            className="w-full text-2xl
            border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </section>
        <section className="flex flex-col gap-2">
          <input
            type="text"
            value={post.cover_image ?? ""}
            onChange={(e) => setPost({ ...post, cover_image: e.target.value })}
            placeholder="Cover Image URL: https://..."
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {post.cover_image && (
            <img
              src={post.cover_image}
              alt="Cover Preview"
              className="w-56 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </section>

        {/* <label>Category</label> */}
        <section className="flex flex-col gap-2">
          <select
            value={post.category ?? ""}
            onChange={(e) => setPost({ ...post, category: e.target.value })}
            className="w-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Draft</option>

            <option>Workshop</option>
            <option>Journal</option>
          </select>
        </section>
        <section className="flex flex-col gap-2">
          <TagsInput post={post} setPost={setPost} />
        </section>
        {/* menu buttons */}
        <section className="flex flex-wrap ">
          <div>
            <PostButtonMenu editor={editor} />
          </div>
          <div className="flex flex-row items-center mb-3 mx-0.5 text-xs gap-0.5">
            <button
              onClick={() => setShowRaw((prev) => !prev)}
              className="px-2 py-1 border  whitespace-nowrap items-center border-gray-300 rounded-md hover:bg-gray-100 transition"
            >
              {showRaw ? "Preview" : "Raw HTML"}
            </button>
            <button
              onClick={openCloudinaryWidget}
              className="px-2 py-1 border  whitespace-nowrap items-center border-gray-300 rounded-md hover:bg-gray-100 transition"
            >
              Upload Image
            </button>
            <button
              onClick={addImageByUrl}
              className="px-2 py-1 border whitespace-nowrap items-center border-gray-300 rounded-md hover:bg-gray-100 transition"
            >
              Image from URL
            </button>
          </div>
        </section>

        {/* Editor Content! */}
        <section className="flex flex-col gap-2">
          {/* <label>Content</label> */}

          {showRaw ? (
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 font-mono"
              value={editor.getHTML()}
              onChange={(e) => {
                editor.commands.setContent(e.target.value, false);
              }}
            />
          ) : (
            <EditorContent editor={editor} />
          )}
        </section>
      </section>
    </div>
  );
}
