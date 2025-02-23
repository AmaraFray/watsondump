"use client"
import React, { useState } from "react";
import {
  Presentation
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { AssistantAlt } from "../assistant_template";

interface TemplateGenProps {
  markdown: string;
  setMarkdown: (markdown: string) => void;
}

const TemplateGen: React.FC<TemplateGenProps> = ({ markdown, setMarkdown }) => {
  return (
    <div className="flex h-screen bg-background">
      {/* <SideBar/> */}
      <div className="max-w-[30rem] border-r border-border transition-all duration-300 ease-in-out">
        <AssistantAlt setMarkdown={setMarkdown} />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-hidden p-6 bg-background">
          <div className="flex items-center gap-2 mb-4">
            <Presentation className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-white">System Prompt</h2>
          </div>
          <div className="h-full w-full overflow-auto p-16 bg-gray-100 text-gray-900">
  <h1 className="text-3xl font-bold mb-6">Template Generator Specification</h1>

  <h2 className="text-2xl font-semibold mt-6 mb-4">Overview</h2>
  <p className="text-lg">
    You are a helper AI responsible for generating structured templates and layouts for presentations.
    Layouts are defined using a concise syntax that organizes content in <strong>Rows</strong> and <strong>Columns</strong>,
    supporting flexible nesting and structured arrangements.
  </p>

  <h2 className="text-2xl font-semibold mt-6 mb-4">Layout Rules</h2>

  <ol className="list-decimal pl-6 space-y-4">
    <li>
      <strong>Row (R) and Column (C) Structure</strong>
      <ul className="list-disc pl-6 mt-2 space-y-1">
        <li>Every layout starts with either <code className="bg-gray-200 px-1 rounded">R</code> (Row) or <code className="bg-gray-200 px-1 rounded">C</code> (Column).</li>
        <li>Rows and Columns can be <strong>nested</strong> within each other.</li>
        <li>Nesting allows for complex hierarchical layouts.</li>
      </ul>
    </li>

    <li>
      <strong>Flex Distribution</strong>
      <ul className="list-disc pl-6 mt-2 space-y-1">
        <li>The proportions of each section are defined inside parentheses <code className="bg-gray-200 px-1 rounded">(...)</code>, representing their relative space distribution.</li>
        <li>For example, <code className="bg-gray-200 px-1 rounded">R(2,1,1)</code> means the first section takes <strong>twice</strong> the space of the second and third sections.</li>
      </ul>
    </li>

    <li>
      <strong>Content Definition</strong>
      <ul className="list-disc pl-6 mt-2 space-y-1">
        <li>The content of each section is enclosed in square brackets <code className="bg-gray-200 px-1 rounded">[...]</code>.</li>
        <li>Content types include:
          <ul className="list-disc pl-6 mt-1 space-y-1">
            <li><code className="bg-gray-200 px-1 rounded">h1</code>, <code className="bg-gray-200 px-1 rounded">p</code>, <code className="bg-gray-200 px-1 rounded">pre</code>, <code className="bg-gray-200 px-1 rounded">b</code>, <code className="bg-gray-200 px-1 rounded">code</code>, and <code className="bg-gray-200 px-1 rounded">img</code>.</li>
          </ul>
        </li>
        <li>Nested layouts can replace content to create complex structures.</li>
      </ul>
    </li>

    <li>
      <strong>Content Constraints</strong>
      <ul className="list-disc pl-6 mt-2 space-y-1">
        <li>Layouts <strong>cannot</strong> be nested inside content elements (<code className="bg-gray-200 px-1 rounded">h1</code>, <code className="bg-gray-200 px-1 rounded">p</code>, <code className="bg-gray-200 px-1 rounded">pre</code>, <code className="bg-gray-200 px-1 rounded">b</code>, <code className="bg-gray-200 px-1 rounded">code</code>, <code className="bg-gray-200 px-1 rounded">img</code>).</li>
        <li>Content elements must be placed as direct children within a layout structure.</li>
      </ul>
    </li>
  </ol>

  <hr className="my-8 border-t border-gray-400" />

  <h2 className="text-2xl font-semibold mt-6 mb-4">Examples</h2>

  <h3 className="text-xl font-semibold mt-4 mb-2">1. Simple Row Layout</h3>

  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto">
    <code>R(2,2,1)[ h2, h3, pre ]</code>
  </pre>

  <p className="mt-4 font-semibold">Structure Breakdown:</p>
  <ul className="list-disc pl-6 mt-2 space-y-1">
    <li>A <strong>Row</strong> with three sections:
      <ul className="list-disc pl-6 mt-1 space-y-1">
        <li><strong>Title</strong> (<code className="bg-gray-200 px-1 rounded">h2</code>), Flex: <code className="bg-gray-200 px-1 rounded">2</code></li>
        <li><strong>Subtitle</strong> (<code className="bg-gray-200 px-1 rounded">h3</code>), Flex: <code className="bg-gray-200 px-1 rounded">2</code></li>
        <li><strong>Code Block</strong> (<code className="bg-gray-200 px-1 rounded">pre</code>), Flex: <code className="bg-gray-200 px-1 rounded">1</code></li>
      </ul>
    </li>
  </ul>

  <hr className="my-8 border-t border-gray-400" />

  <h3 className="text-xl font-semibold mt-4 mb-2">2. Nested Column inside a Row</h3>

  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto">
    <code>R(2,1)[ h1, C(1,1)[b, code] ]</code>
  </pre>

  <p className="mt-4 font-semibold">Structure Breakdown:</p>
  <ul className="list-disc pl-6 mt-2 space-y-1">
    <li>A <strong>Row</strong> with two sections:
      <ul className="list-disc pl-6 mt-1 space-y-1">
        <li><strong>Header</strong> (<code className="bg-gray-200 px-1 rounded">h1</code>), Flex: <code className="bg-gray-200 px-1 rounded">2</code></li>
        <li>A <strong>Column</strong> (Flex: <code className="bg-gray-200 px-1 rounded">1</code>), containing:
          <ul className="list-disc pl-6 mt-1 space-y-1">
            <li><strong>Bold Text</strong> (<code className="bg-gray-200 px-1 rounded">b</code>), Flex: <code className="bg-gray-200 px-1 rounded">1</code></li>
            <li><strong>Inline Code</strong> (<code className="bg-gray-200 px-1 rounded">code</code>), Flex: <code className="bg-gray-200 px-1 rounded">1</code></li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>

  <hr className="my-8 border-t border-gray-400" />

  <h3 className="text-xl font-semibold mt-4 mb-2">3. Deep Nesting Example</h3>

  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto">
    <code>C(1,2)[ R(2,1)[h1, h2], pre ]</code>
  </pre>

  <p className="mt-4 font-semibold">Structure Breakdown:</p>
  <ul className="list-disc pl-6 mt-2 space-y-1">
    <li>A <strong>Column</strong> with two sections:
      <ul className="list-disc pl-6 mt-1 space-y-1">
        <li>A <strong>Row</strong> (Flex: <code className="bg-gray-200 px-1 rounded">1</code>), containing:
          <ul className="list-disc pl-6 mt-1 space-y-1">
            <li><strong>Main Title</strong> (<code className="bg-gray-200 px-1 rounded">h1</code>), Flex: <code className="bg-gray-200 px-1 rounded">2</code></li>
            <li><strong>Subheading</strong> (<code className="bg-gray-200 px-1 rounded">h2</code>), Flex: <code className="bg-gray-200 px-1 rounded">1</code></li>
          </ul>
        </li>
        <li><strong>Code Block</strong> (<code className="bg-gray-200 px-1 rounded">pre</code>), Flex: <code className="bg-gray-200 px-1 rounded">2</code></li>
      </ul>
    </li>
  </ul>
</div>

        </div>
      </div>
    </div>
  );
};

export default TemplateGen;