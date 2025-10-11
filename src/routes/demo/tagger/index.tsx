import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPosTagResult } from "@/data/pos-tagger";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRightIcon, LoaderIcon } from "lucide-react";
import React from "react";

export const Route = createFileRoute("/demo/tagger/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [value, setValue] = React.useState("");
  const predict = useQuery({
    enabled: false,
    queryKey: ["pos-tag"],
    gcTime: 0,
    queryFn: async () => {
      return await getPosTagResult(value);
    },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-4 sm:p-16">
      <div>
        <h1 className="font-departure text-3xl uppercase">
          POS Tagging for Informal Data in Platform X Using Word2Vec and
          Bidirectional LSTM
        </h1>
        <a
          target="_blank"
          href="https://ieeexplore.ieee.org/document/10845574"
          className="text-blue-500 underline"
        >
          IEEE Xplore
        </a>
      </div>
      <p>
        Unstructured and informal Indonesian text poses challenges for NLP tasks
        like POS tagging. This study applies a Bidirectional LSTM with Skip-Gram
        word embeddings to capture contextual and semantic meaning, achieving a
        94.52% F1 score. The approach shows strong potential for improving
        linguistic analysis and broader NLP applications in Indonesian.
      </p>
      <div>
        <div className="space-y-2">
          <p className="font-departure uppercase">
            Insert your text (max 74 tokens)
          </p>
          <div className="flex items-center gap-2">
            <Input
              value={value}
              onChange={(v) => setValue(v.target.value)}
              className="rounded-none shadow-none"
              placeholder="Aku suka makan nasi goreng"
            />
            <Button
              onClick={() => {
                predict.refetch();
              }}
              disabled={predict.isFetching}
              size="icon"
              className="cursor-pointer rounded-none border border-blue-500 bg-blue-100 text-black hover:bg-blue-200"
            >
              {predict.isFetching ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                <ArrowRightIcon />
              )}
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {predict.data?.result.map(([word, tag], i) => {
              return (
                <p
                  key={i}
                  className="flex items-baseline gap-1 border border-blue-500 bg-blue-100 px-2 py-1 leading-0"
                >
                  <span className="!text-base">{word}</span>
                  <span className="!text-xs">{tag}</span>
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
