import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";

import PostButtonMenu from "./PostButtonMenu";
import Button from "./button";
import { all, createLowlight } from "lowlight";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { Post } from "../src/types/post";
const lowlight = createLowlight(all);

// Cloudinary widget type definition
declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: object,
        callback: (error: Error | null, result: CloudinaryUploadResult) => void
      ) => CloudinaryWidget;
    }; // Define a more specific type for the Cloudinary object
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
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    editorProps: {
      attributes: {
        class: "h-auto",
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
      <div className="flex flex-row gap-2">
        {/* submitting the new/edited content */}
        <Button text={"Submit"} onClick={onSubmit} />
        {/* going back to home without saving*/}
        <Button text={"Go back"} onClick={onPrevious} />
      </div>

      {/* The menu */}
      <div className="">
        <label id="title">Title</label>
        <input
          type="text"
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          value={post.title ?? ""}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label>Category</label>
        <select
          value={post.category ?? ""}
          onChange={(e) => setPost({ ...post, category: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Workshop</option>
          <option>Journal</option>
        </select>
      </div>
      <div></div>
      <div className="">
        <label>Content</label>
        <PostButtonMenu editor={editor} />
        <div className="flex flex-row gap-2 mb-2">
          <Button
            text={showRaw ? "Preview" : "Raw HTML"}
            onClick={() => setShowRaw((prev) => !prev)}
          />

          {/* Image buttons */}
          <Button text={"Upload Image"} onClick={openCloudinaryWidget} />
          <Button text={"Image from URL"} onClick={addImageByUrl} />
        </div>

        {/* Editor Content */}
        {showRaw ? (
          <textarea
            className="w-full h- border border-gray-300 rounded px-3 py-2 font-mono"
            value={editor.getHTML()}
            onChange={(e) => {
              editor.commands.setContent(e.target.value, false);
            }}
          />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
    </div>
  );
}
