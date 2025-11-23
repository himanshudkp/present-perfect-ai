"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// Example deleted items
type TrashItem = {
  id: string;
  title: string;
  deletedAt: string;
};

export default function TrashPage() {
  const [items, setItems] = useState<TrashItem[]>([]);

  useEffect(() => {
    // Replace with API call later
    setItems([
      {
        id: "1",
        title: "Marketing Slide Deck",
        deletedAt: "2025-02-15",
      },
      {
        id: "2",
        title: "Business Plan Template",
        deletedAt: "2025-02-12",
      },
    ]);
  }, []);

  const restoreItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    // call restore API
  };

  const deleteForever = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    // call delete forever API
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-8">Trash</h1>

      {items.length === 0 ? (
        <p className="text-muted-foreground">Your trash is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Card
              key={item.id}
              className="flex justify-between items-center p-4"
            >
              <CardHeader className="p-0">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>
                  Deleted on {new Date(item.deletedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => restoreItem(item.id)}>
                  Restore
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteForever(item.id)}
                >
                  Delete Forever
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
