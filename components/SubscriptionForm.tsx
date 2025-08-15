"use client";
import { useRef, useState } from "react";
import { generateClient } from "aws-amplify/data";
import { getUrl, uploadData } from "aws-amplify/storage";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export default function SubscriptionManager() {
  const [type, setType] = useState("");
  const [category, setCategory] = useState("personal");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleAddSubscription = async () => {
    try {
      setUploading(true);


      let imageKey = "";
      if (file) {
        const uploadResult = await uploadData({
            
          path: `picture-submissions/${file.name}`,
          data: file,
         }).result;
console.log("Upload result:", uploadResult);
         const key = uploadResult.path; // S3 key
         console.log("Upload result:", uploadResult,key);
          const { url } = await getUrl({ path: key });
console.log(url.toString());

        imageKey = key;
      }

      await client.models.subscriptionModel.create({
        type,
        category,
        image: imageKey,
        isNew: true,
      });

      // Reset states
      setType("");
      setCategory("personal");
      setFile(null);
       if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Error creating subscription:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Subscription type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="block w-full rounded-md border p-2"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="block w-full rounded-md border p-2"
      >
        <option value="personal">Personal</option>
        <option value="work">Work</option>
        <option value="other">Other</option>
      </select>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      {file && (
        <img
          src={URL.createObjectURL(file)}
          alt="Preview"
          className="w-24 h-24 object-cover rounded"
        />
      )}

      <button
        onClick={handleAddSubscription}
        disabled={uploading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {uploading ? "Saving..." : "Add Subscription"}
      </button>
    </div>
  );
}